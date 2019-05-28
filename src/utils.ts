import { StoredFeature, Feature } from './feature-storage';

export const findById = <T extends { id: string }>(id: string, items: T[]) => {
    return items.find(item => item.id === id);
};

export const findIdxById = <T extends { id: string }>(id: string, items: T[]) => {
    return items.findIndex(item => item.id === id);
};

export const evaluate = (percentage: number) => Math.random() * 100 < percentage;

export const reEvaluate = (feature: Feature, storedFeature: StoredFeature): boolean => {
    const newPercentage = feature.percentage;

    if (!storedFeature) {
        return evaluate(newPercentage);
    }

    const originalPercentage = storedFeature.percentage;

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