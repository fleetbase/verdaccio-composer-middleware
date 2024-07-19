import { AxiosInstance } from 'axios';
import { ComposerMiddlewareConfig } from './types/index';
export interface IFleetbaseClient extends AxiosInstance {
}
export declare const createFleetbaseClient: (config: ComposerMiddlewareConfig) => IFleetbaseClient;
