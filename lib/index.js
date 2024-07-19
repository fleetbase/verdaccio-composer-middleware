"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias/register');
const express_1 = require("express");
const fleetbaseClient_1 = require("./fleetbaseClient");
const verdaccio_fleetbase_s3_storage_1 = __importDefault(require("@fleetbase/verdaccio-fleetbase-s3-storage"));
const axios_1 = __importDefault(require("axios"));
class ComposerMiddleware {
    logger;
    s3Storage;
    fleetbaseClient;
    constructor(config, options) {
        this.logger = options.logger;
        this.fleetbaseClient = (0, fleetbaseClient_1.createFleetbaseClient)(config);
        this.s3Storage = new verdaccio_fleetbase_s3_storage_1.default(config, {
            ...options,
            config: { ...config },
        });
    }
    register_middlewares(app, auth, storage) {
        const router = (0, express_1.Router)();
        router.get('/packages.json', async (req, res, next) => {
            try {
                // Extract bearer token from Authorization header
                const authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                const token = authHeader.slice(7);
                // Authenticate with the API using the bearer token
                let authResponse;
                try {
                    authResponse = await this.fleetbaseClient.post('auth/composer-auth', { registryToken: token });
                }
                catch (authError) {
                    if (axios_1.default.isAxiosError(authError) && authError.response) {
                        this.logger.error({ error: authError.response.data }, 'Authentication failed: @{error}');
                        return res.status(authError.response.status ?? 401).json(authError.response.data);
                    }
                    else if (authError instanceof Error) {
                        this.logger.error({ error: authError.message }, 'Authentication failed: @{error}');
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                }
                // Extract the list of unauthorized packages from the API response
                const unauthorizedPackages = authResponse.data.unauthorizedPackages;
                // Fetch all packages from S3 storage
                const allPackages = await this.s3Storage.getAllComposerJson();
                // Ensure allPackages.packages is an object
                if (typeof allPackages.packages !== 'object') {
                    this.logger.error({ error: 'Invalid package format' }, 'Error fetching composer.json files');
                    return res.status(500).send('Internal Server Error');
                }
                // Filter out unauthorized packages
                const filteredPackages = Object.keys(allPackages.packages)
                    .filter((pkgName) => !unauthorizedPackages.includes(pkgName))
                    .reduce((result, pkgName) => {
                    result[pkgName] = allPackages.packages[pkgName];
                    return result;
                }, {});
                this.logger.info({ packages: filteredPackages }, 'Fetched authorized packages: @{packages}');
                res.json({ packages: filteredPackages });
            }
            catch (error) {
                if (error instanceof Error) {
                    this.logger.error({ error: error.message }, 'Error fetching composer.json files');
                    res.status(500).send('Internal Server Error');
                }
            }
        });
        app.use('/', router);
    }
}
exports.default = ComposerMiddleware;
