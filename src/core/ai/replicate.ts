import Replicate from 'replicate';

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
 * Replicate configs
 * @docs https://replicate.com/
 */
export interface ReplicateConfigs extends AIConfigs {
  baseUrl?: string;
  apiToken: string;
  customStorage?: boolean;
  saveFiles?: SaveFilesFunction;
  uuid?: UuidFunction;
}

/**
 * Replicate provider
 * @docs https://replicate.com/
 */
export class ReplicateProvider implements AIProvider {
  readonly name = 'replicate';
  configs: ReplicateConfigs;
  client: Replicate;

  constructor(configs: ReplicateConfigs) {
    this.configs = configs;
    this.client = new Replicate({
      auth: this.configs.apiToken,
    });
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
    const {
      mediaType,
      model,
      prompt,
      options,
      async: isAsync,
      callbackUrl,
    } = params;

    if (!mediaType) {
      throw new Error('mediaType is required');
    }

    if (!model) {
      throw new Error('model is required');
    }

    if (!prompt) {
      throw new Error('prompt is required');
    }

    const input: any = this.formatInput({ mediaType, model, prompt, options });

    const isValidCallbackUrl =
      callbackUrl &&
      callbackUrl.startsWith('http') &&
      !callbackUrl.includes('localhost') &&
      !callbackUrl.includes('127.0.0.1');

    const output = await this.client.predictions.create({
      model,
      input,
      webhook: isValidCallbackUrl ? callbackUrl : undefined,
      webhook_events_filter: isValidCallbackUrl ? ['completed'] : undefined,
    });

    return {
      taskStatus: AITaskStatus.PENDING,
      taskId: output.id,
      taskInfo: {},
      taskResult: output,
    };
  }

  async query({
    taskId,
    mediaType,
  }: {
    taskId: string;
    mediaType?: AIMediaType;
  }): Promise<AITaskResult> {
    const data = await this.client.predictions.get(taskId);

    let images: AIImage[] | undefined = undefined;
    let videos: AIVideo[] | undefined = undefined;

    if (data.output) {
      if (mediaType === AIMediaType.VIDEO) {
        if (Array.isArray(data.output)) {
          videos = data.output.map((video: any) => ({
            id: '',
            createTime: new Date(data.created_at),
            videoUrl: video,
          }));
        } else if (typeof data.output === 'string') {
          videos = [
            {
              id: '',
              createTime: new Date(data.created_at),
              videoUrl: data.output,
            },
          ];
        }
      } else {
        if (Array.isArray(data.output)) {
          images = data.output.map((image: any) => ({
            id: '',
            createTime: new Date(data.created_at),
            imageUrl: image,
          }));
        } else if (typeof data.output === 'string') {
          images = [
            {
              id: '',
              createTime: new Date(data.created_at),
              imageUrl: data.output,
            },
          ];
        }
      }
    }

    const taskStatus = this.mapStatus(data.status);

    if (taskStatus === AITaskStatus.SUCCESS && this.configs.customStorage) {
      if (images && images.length > 0) {
        const filesToSave: AIFile[] = [];
        images.forEach((image, index) => {
          if (image.imageUrl) {
            filesToSave.push({
              url: image.imageUrl,
              contentType: 'image/png',
              key: `replicate/image/${this.getUuid()}.png`,
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
              key: `replicate/video/${this.getUuid()}.mp4`,
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
        status: data.status,
        errorCode: '',
        errorMessage: data.error as string,
        createTime: new Date(data.created_at),
      },
      taskResult: data,
    };
  }

  private mapStatus(status: string): AITaskStatus {
    switch (status) {
      case 'starting':
        return AITaskStatus.PENDING;
      case 'processing':
        return AITaskStatus.PROCESSING;
      case 'succeeded':
        return AITaskStatus.SUCCESS;
      case 'failed':
        return AITaskStatus.FAILED;
      case 'canceled':
        return AITaskStatus.CANCELED;
      default:
        throw new Error(`unknown status: ${status}`);
    }
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
      if (['black-forest-labs/flux-2-pro'].includes(model)) {
        input.input_images = options.image_input;
        delete input.image_input;
      } else if (['google/veo-3.1'].includes(model)) {
        input.reference_images = input.image_input;
        delete input.image_input;
      } else if (['openai/sora-2'].includes(model)) {
        input.input_reference = options.image_input[0];
        delete input.image_input;
      }
    }

    if (options.duration) {
      if (['openai/sora-2'].includes(model)) {
        input.seconds = Number(options.duration);
        delete input.duration;
      }
    }

    return input;
  }
}
