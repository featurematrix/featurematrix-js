import { StoredFeature, Feature } from './feature-storage';
export declare const findById: <T extends {
    id: string;
}>(id: string, items: T[]) => T;
export declare const findIdxById: <T extends {
    id: string;
}>(id: string, items: T[]) => number;
export declare const evaluate: (percentage: number) => boolean;
export declare const reEvaluate: (feature: Feature, storedFeature: StoredFeature) => boolean;
