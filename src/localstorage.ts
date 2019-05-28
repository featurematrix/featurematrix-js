import { Storage, StoredFeature } from './feature-storage';

const storageKey = '__fm_features__';

export class LocalStorage implements Storage {
    persistFeatures(features: StoredFeature[]) {
        localStorage.setItem(storageKey, JSON.stringify(features));
    }

    getFeatures(): StoredFeature[] {
        const storedFeatures = localStorage.getItem(storageKey);
        return JSON.parse(storedFeatures) as StoredFeature[] || [];
    }
}