"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verdaccio_fleetbase_s3_storage_1 = __importDefault(require("@fleetbase/verdaccio-fleetbase-s3-storage"));
class ComposerMiddleware {
    logger;
    s3Storage;
    constructor(config, options) {
        this.logger = options.logger;
        this.s3Storage = new verdaccio_fleetbase_s3_storage_1.default(config, {
            ...options,
            config: { ...config },
        });
    }
    register_middlewares(app, auth, storage) {
        const router = (0, express_1.Router)();
        router.get('/packages.json', async (req, res, next) => {
            try {
                const packages = await this.s3Storage.getAllComposerJson();
                res.json(packages);
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
