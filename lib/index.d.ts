import { Logger, IPluginMiddleware, IBasicAuth, IStorageManager, PluginOptions } from '@verdaccio/types';
import { Application } from 'express';
import { ComposerMiddlewareConfig } from './types/index';
export default class ComposerMiddleware implements IPluginMiddleware<ComposerMiddlewareConfig> {
    logger: Logger;
    private s3Storage;
    private fleetbaseClient;
    constructor(config: ComposerMiddlewareConfig, options: PluginOptions<ComposerMiddlewareConfig>);
    register_middlewares(app: Application, auth: IBasicAuth<ComposerMiddlewareConfig>, storage: IStorageManager<ComposerMiddlewareConfig>): void;
}
