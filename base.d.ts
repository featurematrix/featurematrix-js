import { FeatureStorage, Feature } from './feature-storage';
import { EventType } from './event-emitter';
export interface Options {
    appKey: string;
    envKey: string;
}
export declare enum MessageType {
    INIT = "INIT",
    FEATURE_UPDATED = "FEATURE_UPDATED"
}
export interface Message {
    type: MessageType;
}
export interface InitialData {
    type: MessageType;
    features: Feature[];
}
export interface UpdateData {
    type: MessageType;
    feature: Feature;
}
export declare class FeatureMatrixBase {
    protected featureStorage: FeatureStorage;
    private eventEmitter;
    initialized: boolean;
    onMessage(message: Message): void;
    private processInitialFeatureData;
    private processFeatureUpdate;
    on(eventType: EventType, callback: (...args: any[]) => void): {
        unsubsribe: () => void;
    };
    getFeatureState(featureKey: string): boolean;
    getFeatures(): string[];
}
