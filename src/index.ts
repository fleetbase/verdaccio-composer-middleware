import { Logger, IPluginMiddleware, IBasicAuth, IStorageManager, PluginOptions, Config } from '@verdaccio/types';
import { Router, Request, Response, NextFunction, Application } from 'express';
import { CustomConfig } from './types/index';
import S3Database, { S3Config } from '@fleetbase/verdaccio-fleetbase-s3-storage';

export default class ComposerMiddleware implements IPluginMiddleware<CustomConfig> {
    public logger: Logger;
    private s3Storage: S3Database;

    public constructor(config: CustomConfig, options: PluginOptions<CustomConfig>) {
        this.logger = options.logger;
        this.s3Storage = new S3Database(config, {
            ...options,
            config: { ...config } as S3Config & Config,
        });
    }

    public register_middlewares(app: Application, auth: IBasicAuth<CustomConfig>, storage: IStorageManager<CustomConfig>): void {
        const router = Router();

        router.get('/packages.json', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const packages = await this.s3Storage.getAllComposerJson();
                res.json(packages);
            } catch (error) {
                if (error instanceof Error) {
                    this.logger.error({ error: error.message }, 'Error fetching composer.json files');
                    res.status(500).send('Internal Server Error');
                }
            }
        });

        app.use('/', router);
    }
}
