import { findById, reEvaluate, findIdxById } from './utils';

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

export class FeatureStorage {
    private features: StoredFeature[];

    constructor(
        private storage: Storage
    ) {}

    updateFeatures(features: Feature[]) {
        const storedFeatures = this.storage.getFeatures();
        const featuresToStore: StoredFeature[] = features.map(feature => {
            return this.createStorableFeature(feature, storedFeatures);
        });

        this.persist(featuresToStore);
    }

    updateFeature(feature: Feature) {
        const storedFeatures = this.storage.getFeatures();
        const featureToStore = this.createStorableFeature(feature, storedFeatures);

        const featureIdx = findIdxById(feature.id, storedFeatures);
        let featuresToStore = storedFeatures;

        if (~featureIdx) {
            featuresToStore[featureIdx] = featureToStore;
        } else {
            featuresToStore.push(featureToStore);
        }

        this.persist(featuresToStore);
    }

    getFeature(featureKey: string) {
        return this.features.find(f => f.key === featureKey);
    }

    getFeatureState(featureKey: string) {
        const feature = this.features.find(f => f.key === featureKey);

        if (!feature) {
            console.warn('Invalid feature key ' + featureKey);
            return false;
        }

        return feature.isOn;
    }

    getFeatures() {
        return this.features.map(f => f.key);
    }

    private createStorableFeature (feature: Feature, storedFeatures: StoredFeature[]): StoredFeature {
        const storedFeature = findById(feature.id, storedFeatures);
        const isOn = reEvaluate(feature, storedFeature);

        return { ...feature, isOn };
    };

    private persist(features: StoredFeature[]) {
        this.storage.persistFeatures(features);
        this.features = features;
    }
}