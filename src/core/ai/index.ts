import { AIFile, AIMediaType, AIProvider, SaveFilesFunction } from './types';

export * from './types';

/**
 * AI Manager to manage all AI providers
 */
export class AIManager {
  private providers: AIProvider[] = [];
  private defaultProvider?: AIProvider;
  private _saveFiles?: SaveFilesFunction;

  /**
   * Set the save files function for custom storage integration
   */
  setSaveFiles(fn: SaveFilesFunction) {
    this._saveFiles = fn;
  }

  /**
   * Get the save files function
   */
  get saveFiles(): SaveFilesFunction | undefined {
    return this._saveFiles;
  }

  addProvider(provider: AIProvider, isDefault = false) {
    this.providers.push(provider);
    if (isDefault) {
      this.defaultProvider = provider;
    }
  }

  getProvider(name: string): AIProvider | undefined {
    return this.providers.find((p) => p.name === name);
  }

  getProviderNames(): string[] {
    return this.providers.map((p) => p.name);
  }

  getMediaTypes(): string[] {
    return Object.values(AIMediaType);
  }

  getDefaultProvider(): AIProvider | undefined {
    if (!this.defaultProvider && this.providers.length > 0) {
      this.defaultProvider = this.providers[0];
    }
    return this.defaultProvider;
  }
}

export const aiManager = new AIManager();

export * from './kie';
export * from './replicate';
export * from './gemini';
export * from './fal';
