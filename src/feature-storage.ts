export interface Feature {
    id: string;
    name: string;
    key: string;
    percentage: number;
}

export interface StoredFeature extends Feature {
    isOn: boolean;
}

const storageKey = '__fm_features__';

const findById = <T extends { id: string }>(id: string, items: T[]) => {
    return items.find(item => item.id === id);
};

const findIdxById = <T extends { id: string }>(id: string, items: T[]) => {
    return items.findIndex(item => item.id === id);
};

const evaluate = (percentage: number) => Math.random() * 100 < percentage;

const reEvaluate = (feature: Feature, storedFeature: StoredFeature): boolean => {
    const originalPercentage = storedFeature.percentage;
    const newPercentage = feature.percentage;

    if (!storedFeature) {
        return evaluate(newPercentage);
    }

    const change = newPercentage - originalPercentage;
    const percentageIncreased = change > 0;
    const isOn = storedFeature.isOn;
    
    if (!change) {
        return storedFeature.isOn;
    }

    if (!percentageIncreased) {
        return evaluate(newPercentage);
    }

    if (isOn && percentageIncreased) {
        return storedFeature.isOn;
    }

    if (!isOn && percentageIncreased) {
        const diff = newPercentage - originalPercentage;
        const remainingSamplePercentage = 100 - originalPercentage;
        const samplePercentage = diff / (remainingSamplePercentage / 100);
        return evaluate(samplePercentage);
    }
};

const createStorableFeature = (feature: Feature, storedFeatures: StoredFeature[]): StoredFeature => {
    const storedFeature = findById(feature.id, storedFeatures);
    const isOn = reEvaluate(feature, storedFeature);

    return { ...feature, isOn };
};

export class FeatureStorage {
    private features: StoredFeature[];

    updateFeatures(features: Feature[]) {
        const storedFeatures = this.getStoredFeatures();
        const featuresToStore: StoredFeature[] = features.map(feature => {
            return createStorableFeature(feature, storedFeatures);
        });

        this.persist(featuresToStore);
    }

    updateFeature(feature: Feature) {
        const storedFeatures = this.getStoredFeatures();
        const featureToStore = createStorableFeature(feature, storedFeatures);

        const featureIdx = findIdxById(feature.id, storedFeatures);
        let featuresToStore = storedFeatures;

        if (~featureIdx) {
            featuresToStore[featureIdx] = featureToStore;
        } else {
            featuresToStore.push(featureToStore);
        }

        this.persist(featuresToStore);
    }

    private getStoredFeatures(): StoredFeature[] {
        const storedFeatures = localStorage.getItem(storageKey);
        return JSON.parse(storedFeatures) as StoredFeature[] || [];
    }

    private persist(features: StoredFeature[]) {
        localStorage.setItem(storageKey, JSON.stringify(features));
        this.features = features;
    }

    getFeatureState(featureKey: string) {
        const feature = this.features.find(f => f.key === featureKey);

        if (!feature) {
            console.warn('Invalid feature key ' + featureKey);
            return false;
        }

        return feature.isOn;
    }
}