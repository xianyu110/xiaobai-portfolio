import {
  AIConfigs,
  AIFile,
  AIGenerateParams,
  AIImage,
  AIMediaType,
  AIProvider,
  AITaskResult,
  AITaskStatus,
  AIVideo,
  SaveFilesFunction,
  UuidFunction,
} from './types';

const defaultUuid: UuidFunction = () => crypto.randomUUID();

/**
 * Fal configs
 * @docs https://fal.ai/
 */
export interface FalConfigs extends AIConfigs {
  apiKey: string;
  customStorage?: boolean;
  saveFiles?: SaveFilesFunction;
  uuid?: UuidFunction;
}

/**
 * Fal provider
 * @docs https://fal.ai/
 */
export class FalProvider implements AIProvider {
  readonly name = 'fal';
  configs: FalConfigs;

  private baseUrl = 'https://queue.fal.run';

  constructor(configs: FalConfigs) {
    this.configs = configs;
  }

  private getUuid(): string {
    return (this.configs.uuid || defaultUuid)();
  }

  private async trySaveFiles(files: AIFile[]): Promise<AIFile[] | undefined> {
    if (!this.configs.saveFiles) return undefined;
    try {
      return await this.configs.saveFiles(files);
    } catch (error) {
      console.error('save files failed:', error);
      return undefined;
    }
  }

  async generate({
    params,
  }: {
    params: AIGenerateParams;
  }): Promise<AITaskResult> {
    const { mediaType, model, prompt, options, callbackUrl } = params;

    if (!mediaType) {
      throw new Error('mediaType is required');
    }

    if (!model) {
      throw new Error('model is required');
    }

    if (!prompt) {
      throw new Error('prompt is required');
    }

    const input = this.formatInput({ mediaType, model, prompt, options });

    let apiUrl = `${this.baseUrl}/${model}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Key ${this.configs.apiKey}`,
    };

    const isValidCallbackUrl =
      callbackUrl &&
      callbackUrl.startsWith('http') &&
      !callbackUrl.includes('localhost') &&
      !callbackUrl.includes('127.0.0.1');

    if (isValidCallbackUrl) {
      apiUrl += `?fal_webhook=${callbackUrl}`;
    }

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });

    if (!resp.ok) {
      throw new Error(`request failed with status: ${resp.status}`);
    }

    const data = await resp.json();

    if (!data || !data.request_id) {
      throw new Error('generate failed: no request_id');
    }

    return {
      taskStatus: AITaskStatus.PENDING,
      taskId: data.request_id,
      taskInfo: {},
      taskResult: data,
    };
  }

  async query({
    taskId,
    model,
    mediaType,
  }: {
    taskId: string;
    model?: string;
    mediaType?: AIMediaType;
  }): Promise<AITaskResult> {
    const queryModel = this.getQueryModel(model);

    const statusUrl = `${this.baseUrl}/${queryModel}/requests/${taskId}/status`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Key ${this.configs.apiKey}`,
    };

    const statusResp = await fetch(statusUrl, { method: 'GET', headers });

    if (!statusResp.ok) {
      throw new Error(`request failed with status: ${statusResp.status}`);
    }

    const statusData = await statusResp.json();
    const taskStatus = this.mapStatus(statusData.status);

    if (taskStatus !== AITaskStatus.SUCCESS) {
      return {
        taskId,
        taskStatus,
        taskInfo: {
          status: statusData.status,
          errorCode: '',
          errorMessage: '',
        },
        taskResult: statusData,
      };
    }

    const resultUrl = `${this.baseUrl}/${queryModel}/requests/${taskId}`;
    const resultResp = await fetch(resultUrl, { method: 'GET', headers });

    if (!resultResp.ok) {
      throw new Error(`request failed with status: ${resultResp.status}`);
    }

    const data = await resultResp.json();

    let images: AIImage[] | undefined = undefined;
    let videos: AIVideo[] | undefined = undefined;

    if (mediaType === AIMediaType.VIDEO) {
      if (data.video && data.video.url) {
        videos = [
          {
            id: '',
            createTime: new Date(),
            videoUrl: data.video.url,
          },
        ];
      } else if (data.videos && Array.isArray(data.videos)) {
        videos = data.videos.map((video: any) => ({
          id: '',
          createTime: new Date(),
          videoUrl: video.url,
        }));
      }
    } else {
      if (data.images && Array.isArray(data.images)) {
        images = data.images.map((image: any) => ({
          id: '',
          createTime: new Date(),
          imageUrl: image.url,
        }));
      }
    }

    if (taskStatus === AITaskStatus.SUCCESS && this.configs.customStorage) {
      if (images && images.length > 0) {
        const filesToSave: AIFile[] = [];
        images.forEach((image, index) => {
          if (image.imageUrl) {
            filesToSave.push({
              url: image.imageUrl,
              contentType: 'image/png',
              key: `fal/image/${this.getUuid()}.png`,
              index: index,
              type: 'image',
            });
          }
        });

        if (filesToSave.length > 0) {
          const uploadedFiles = await this.trySaveFiles(filesToSave);
          if (uploadedFiles) {
            uploadedFiles.forEach((file: AIFile) => {
              if (file && file.url && images && file.index !== undefined) {
                const image = images[file.index];
                if (image) {
                  image.imageUrl = file.url;
                }
              }
            });
          }
        }
      }

      if (videos && videos.length > 0) {
        const filesToSave: AIFile[] = [];
        videos.forEach((video, index) => {
          if (video.videoUrl) {
            filesToSave.push({
              url: video.videoUrl,
              contentType: 'video/mp4',
              key: `fal/video/${this.getUuid()}.mp4`,
              index: index,
              type: 'video',
            });
          }
        });

        if (filesToSave.length > 0) {
          const uploadedFiles = await this.trySaveFiles(filesToSave);
          if (uploadedFiles) {
            uploadedFiles.forEach((file: AIFile) => {
              if (file && file.url && videos && file.index !== undefined) {
                const video = videos[file.index];
                if (video) {
                  video.videoUrl = file.url;
                }
              }
            });
          }
        }
      }
    }

    return {
      taskId,
      taskStatus,
      taskInfo: {
        images,
        videos,
        status: statusData.status,
        errorCode: '',
        errorMessage: '',
        createTime: new Date(),
      },
      taskResult: data,
    };
  }

  private mapStatus(status: string): AITaskStatus {
    switch (status) {
      case 'IN_QUEUE':
        return AITaskStatus.PENDING;
      case 'IN_PROGRESS':
        return AITaskStatus.PROCESSING;
      case 'COMPLETED':
        return AITaskStatus.SUCCESS;
      case 'FAILED':
        return AITaskStatus.FAILED;
      default:
        throw new Error(`unknown status: ${status}`);
    }
  }

  private getQueryModel(model?: string): string {
    if (!model) {
      return '';
    }
    const parts = model.split('/');
    if (parts.length <= 2) {
      return model;
    }
    return `${parts[0]}/${parts[1]}`;
  }

  private formatInput({
    mediaType,
    model,
    prompt,
    options,
  }: {
    mediaType: AIMediaType;
    model: string;
    prompt: string;
    options: any;
  }): any {
    let input: any = { prompt };

    if (!options) {
      return input;
    }

    input = { ...input, ...options };

    if (options.image_input && Array.isArray(options.image_input)) {
      if (['fal-ai/kling-video/o1/video-to-video/edit'].includes(model)) {
        input.input_images = options.image_input;
      } else {
        input.image_url = options.image_input[0];
      }
      delete input.image_input;
    }

    if (options.video_input && Array.isArray(options.video_input)) {
      input.video_url = options.video_input[0];
      delete input.video_input;
    }

    return input;
  }
}
