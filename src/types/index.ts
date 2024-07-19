import { Config } from '@verdaccio/types';

export interface ComposerMiddlewareConfig extends Config {
    fleetbaseHost: string;
    fleetbaseApiKey: string;
}
