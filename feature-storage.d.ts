export interface Feature {
    id: string;
    name: string;
    key: string;
    percentage: number;
}
export interface StoredFeature extends Feature {
    isOn: boolean;
}
export interface Storage {
    persistFeatures: (features: StoredFeature[]) => void;
    getFeatures(): StoredFeature[];
}
export declare class FeatureStorage {
    private storage;
    private features;
    constructor(storage: Storage);
    updateFeatures(features: Feature[]): void;
    updateFeature(feature: Feature): void;
    getFeature(featureKey: string): StoredFeature;
    getFeatureState(featureKey: string): boolean;
    getFeatures(): string[];
    private createStorableFeature;
    private persist;
}
