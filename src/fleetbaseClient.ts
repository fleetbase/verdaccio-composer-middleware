import axios, { AxiosInstance } from 'axios';
import { ComposerMiddlewareConfig } from './types/index';
import getConfigValue from './getConfigValue';

export interface IFleetbaseClient extends AxiosInstance {}

export const createFleetbaseClient = (config: ComposerMiddlewareConfig): IFleetbaseClient => {
    const fleetbaseHost = getConfigValue('FLEETBASE_HOST', config);
    const fleetbaseApiKey = getConfigValue('FLEETBASE_API_KEY', config);
    const instance = axios.create({
        baseURL: `${fleetbaseHost}/~registry/v1/`,
        headers: {
            Authorization: `Bearer ${fleetbaseApiKey}`,
            'Content-Type': 'application/json',
        },
    });

    return instance as IFleetbaseClient;
};
