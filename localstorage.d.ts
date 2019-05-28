import { Storage, StoredFeature } from './feature-storage';
export declare class LocalStorage implements Storage {
    persistFeatures(features: StoredFeature[]): void;
    getFeatures(): StoredFeature[];
}
