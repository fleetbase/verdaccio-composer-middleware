require('module-alias/register');

import { Logger, IPluginMiddleware, IBasicAuth, IStorageManager, PluginOptions, Config } from '@verdaccio/types';
import { Router, Request, Response, NextFunction, Application } from 'express';
import { ComposerMiddlewareConfig } from './types/index';
import { createFleetbaseClient, IFleetbaseClient } from './fleetbaseClient';
import S3Database, { S3Config } from '@fleetbase/verdaccio-fleetbase-s3-storage';
import axios from 'axios';

export default class ComposerMiddleware implements IPluginMiddleware<ComposerMiddlewareConfig> {
    public logger: Logger;
    private s3Storage: S3Database;
    private fleetbaseClient: IFleetbaseClient;

    public constructor(config: ComposerMiddlewareConfig, options: PluginOptions<ComposerMiddlewareConfig>) {
        this.logger = options.logger;
        this.fleetbaseClient = createFleetbaseClient(config);
        this.s3Storage = new S3Database(config, {
            ...options,
            config: { ...config } as S3Config & ComposerMiddlewareConfig,
        });
    }

    public register_middlewares(app: Application, auth: IBasicAuth<ComposerMiddlewareConfig>, storage: IStorageManager<ComposerMiddlewareConfig>): void {
        const router = Router();

        router.get('/packages.json', async (req: Request, res: Response, next: NextFunction) => {
            try {
                // Extract bearer token from Authorization header
                const authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    // return res.status(401).json({ error: 'Unauthorized' });
                    return res.json({ packages: {} });
                }
                const token = authHeader.slice(7);

                // Authenticate with the API using the bearer token
                let authResponse;
                try {
                    authResponse = await this.fleetbaseClient.post('auth/composer-auth', { registryToken: token });
                } catch (authError: unknown) {
                    if (axios.isAxiosError(authError) && authError.response) {
                        this.logger.error({ error: authError.response.data }, 'Authentication failed: @{error}');
                        // return res.status(authError.response.status ?? 401).json(authError.response.data);
                        return res.json({ packages: {} });
                    } else if (authError instanceof Error) {
                        this.logger.error({ error: authError.message }, 'Authentication failed: @{error}');
                        // return res.status(500).json({ error: 'Internal Server Error' });
                        return res.json({ packages: {} });
                    }
                }

                // Extract the list of unauthorized packages from the API response
                const unauthorizedPackages = authResponse.data.unauthorizedPackages;

                // Fetch all packages from S3 storage
                const allPackages = await this.s3Storage.getAllComposerJson();

                // Ensure allPackages.packages is an object
                if (typeof allPackages.packages !== 'object') {
                    this.logger.error({ error: 'Invalid package format' }, 'Error fetching composer.json files');
                    // return res.status(500).send('Internal Server Error');
                    return res.json({ packages: {} });
                }

                // Filter out unauthorized packages
                const filteredPackages = Object.keys(allPackages.packages)
                    .filter((pkgName) => !unauthorizedPackages.includes(pkgName))
                    .reduce((result, pkgName) => {
                        result[pkgName] = allPackages.packages[pkgName];
                        return result;
                    }, {} as Record<string, any>);

                this.logger.info({ packages: filteredPackages }, 'Fetched authorized packages: @{packages}');
                res.json({ packages: filteredPackages });
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
