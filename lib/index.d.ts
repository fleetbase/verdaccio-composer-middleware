import { Logger, IPluginMiddleware, IBasicAuth, IStorageManager, PluginOptions } from '@verdaccio/types';
import { Application } from 'express';
import { CustomConfig } from './types/index';
export default class ComposerMiddleware implements IPluginMiddleware<CustomConfig> {
    logger: Logger;
    private s3Storage;
    constructor(config: CustomConfig, options: PluginOptions<CustomConfig>);
    register_middlewares(app: Application, auth: IBasicAuth<CustomConfig>, storage: IStorageManager<CustomConfig>): void;
}
