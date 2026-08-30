import {
  AIConfigs,
  AIGenerateParams,
  AIImage,
  AIMediaType,
  AIProvider,
  AITaskResult,
  AITaskStatus,
  UploadFileFunction,
  UuidFunction,
} from './types';

const defaultUuid: UuidFunction = () => crypto.randomUUID();

/**
 * Gemini configs
 */
export interface GeminiConfigs extends AIConfigs {
  apiKey: string;
  uploadFile?: UploadFileFunction;
  uuid?: UuidFunction;
}

/**
 * Gemini provider
 */
export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';
  configs: GeminiConfigs;

  constructor(configs: GeminiConfigs) {
    this.configs = configs;
  }

  private getUuid(): string {
    return (this.configs.uuid || defaultUuid)();
  }

  async generate({
    params,
  }: {
    params: AIGenerateParams;
  }): Promise<AITaskResult> {
    const { mediaType, model, prompt, options } = params;

    if (mediaType !== AIMediaType.IMAGE) {
      throw new Error(`mediaType not supported: ${mediaType}`);
    }

    if (!model) {
      throw new Error('model is required');
    }

    if (!prompt) {
      throw new Error('prompt is required');
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.configs.apiKey}`;

    const requestParts: any[] = [{ text: prompt }];

    if (options && options.image_input && Array.isArray(options.image_input)) {
      for (const imageUrl of options.image_input) {
        try {
          const imageResp = await fetch(imageUrl);
          if (imageResp.ok) {
            const arrayBuffer = await imageResp.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Image = buffer.toString('base64');
            const mimeType =
              imageResp.headers.get('content-type') || 'image/jpeg';

            requestParts.push({
              inlineData: {
                mimeType,
                data: base64Image,
              },
            });
          }
        } catch (e) {
          console.error('failed to fetch image input', imageUrl, e);
        }
      }
    }

    const { image_input, ...generationConfig } = options || {};

    const payload = {
      contents: {
        role: 'user',
        parts: requestParts,
      },
      generation_config: {
        response_modalities: ['TEXT', 'IMAGE'],
        ...generationConfig,
      },
    };

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(
        `request failed with status: ${resp.status}, body: ${errorText}`
      );
    }

    const data = await resp.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('no candidates returned');
    }

    const taskId = this.getUuid();
    const candidate = data.candidates[0];
    const parts = candidate.content?.parts;

    if (!parts || parts.length === 0) {
      throw new Error('no parts returned');
    }

    const imagePart = parts.find((p: any) => p.inlineData);

    if (!imagePart) {
      throw new Error('no image part returned');
    }

    const mimeType = imagePart.inlineData.mimeType;
    const base64Data = imagePart.inlineData.data;

    if (!this.configs.uploadFile) {
      throw new Error('uploadFile function is required for Gemini provider');
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const ext = mimeType.split('/')[1] || 'png';
    const key = `gemini/image/${this.getUuid()}.${ext}`;

    const uploadResult = await this.configs.uploadFile({
      body: buffer,
      key,
      contentType: mimeType,
    });

    if (!uploadResult || !uploadResult.url) {
      throw new Error('upload image failed');
    }

    if (imagePart.inlineData) {
      imagePart.inlineData.data = uploadResult.url;
      const partIndex = parts.findIndex((p: any) => p === imagePart);
      if (partIndex !== -1 && data.candidates?.[0]?.content?.parts) {
        data.candidates[0].content.parts[partIndex].inlineData.data =
          uploadResult.url;
        data.candidates[0].content.parts[partIndex].thoughtSignature = '';
      }
    }

    const image: AIImage = {
      id: this.getUuid(),
      createTime: new Date(),
      imageType: mimeType,
      imageUrl: uploadResult.url,
    };

    return {
      taskStatus: AITaskStatus.SUCCESS,
      taskId: taskId,
      taskInfo: {
        images: [image],
        status: 'success',
        createTime: new Date(),
      },
      taskResult: data,
    };
  }
}
