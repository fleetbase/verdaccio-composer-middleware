import { Logger, IPluginMiddleware, IBasicAuth, IStorageManager, PluginOptions } from '@verdaccio/types';
import { Router, Request, Response, NextFunction, Application } from 'express';
import { CustomConfig } from './types/index';

export default class ComposerMiddleware implements IPluginMiddleware<CustomConfig> {
    public constructor(config: CustomConfig, options: PluginOptions<CustomConfig>) {}

    public register_middlewares(app: Application, auth: IBasicAuth<CustomConfig>, storage: IStorageManager<CustomConfig>): void {}
}
