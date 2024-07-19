"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFleetbaseClient = void 0;
const axios_1 = __importDefault(require("axios"));
const getConfigValue_1 = __importDefault(require("./getConfigValue"));
const createFleetbaseClient = (config) => {
    const fleetbaseHost = (0, getConfigValue_1.default)('FLEETBASE_HOST', config);
    const fleetbaseApiKey = (0, getConfigValue_1.default)('FLEETBASE_API_KEY', config);
    const instance = axios_1.default.create({
        baseURL: `${fleetbaseHost}/~registry/v1/`,
        headers: {
            Authorization: `Bearer ${fleetbaseApiKey}`,
            'Content-Type': 'application/json',
        },
    });
    return instance;
};
exports.createFleetbaseClient = createFleetbaseClient;
