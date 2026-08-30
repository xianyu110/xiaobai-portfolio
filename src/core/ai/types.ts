/**
 * AI Configs to use AI functions
 */
export interface AIConfigs {
  [key: string]: any;
}

/**
 * ai media type
 */
export enum AIMediaType {
  MUSIC = 'music',
  IMAGE = 'image',
  VIDEO = 'video',
  TEXT = 'text',
  SPEECH = 'speech',
}

export interface AISong {
  id?: string;
  createTime?: Date;
  audioUrl: string;
  imageUrl: string;
  duration: number;
  prompt: string;
  title: string;
  tags: string;
  style: string;
  model?: string;
  artist?: string;
  album?: string;
}

export interface AIImage {
  id?: string;
  createTime?: Date;
  imageType?: string;
  imageUrl?: string;
}

export interface AIVideo {
  id?: string;
  createTime?: Date;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
}

/**
 * AI generate params
 */
export interface AIGenerateParams {
  mediaType: AIMediaType;
  prompt: string;
  model?: string;
  options?: any;
  callbackUrl?: string;
  stream?: boolean;
  async?: boolean;
}

export enum AITaskStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELED = 'canceled',
}

/**
 * AI task info
 */
export interface AITaskInfo {
  songs?: AISong[];
  images?: AIImage[];
  videos?: AIVideo[];
  status?: string;
  errorCode?: string;
  errorMessage?: string;
  createTime?: Date;
}

/**
 * AI task result
 */
export interface AITaskResult {
  taskStatus: AITaskStatus;
  taskId: string;
  taskInfo?: AITaskInfo;
  taskResult?: any;
}

export interface AIFile {
  url: string;
  contentType: string;
  key: string;
  index?: number;
  type?: string;
}

/**
 * AI Provider provide AI functions
 */
export interface AIProvider {
  readonly name: string;
  configs: AIConfigs;
  generate({ params }: { params: AIGenerateParams }): Promise<AITaskResult>;
  query?({
    taskId,
    mediaType,
    model,
  }: {
    taskId: string;
    mediaType?: string;
    model?: string;
  }): Promise<AITaskResult>;
}

/**
 * Save files function type - can be injected by consumer
 */
export type SaveFilesFunction = (
  files: AIFile[]
) => Promise<AIFile[] | undefined>;

/**
 * Upload file function type - can be injected by consumer
 */
export interface UploadFileOptions {
  body: Buffer | Uint8Array;
  key: string;
  contentType: string;
}

export interface UploadFileResult {
  url: string;
}

export type UploadFileFunction = (
  options: UploadFileOptions
) => Promise<UploadFileResult>;

/**
 * UUID generator function type
 */
export type UuidFunction = () => string;
