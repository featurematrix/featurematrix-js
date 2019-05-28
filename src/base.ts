import { FeatureStorage, Feature } from './feature-storage';
import { EventEmitter, EventType } from './event-emitter';

export interface Options {
    appKey: string;
    envKey: string;
}

export enum MessageType {
    INIT = 'INIT',
    FEATURE_UPDATED = 'FEATURE_UPDATED',
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

export class FeatureMatrixBase {
    protected featureStorage: FeatureStorage;
    private eventEmitter = new EventEmitter();
    initialized = false;

    onMessage(message: Message) {
        switch (message.type) {
            case MessageType.INIT:
                return this.processInitialFeatureData(message as InitialData);
            case MessageType.FEATURE_UPDATED:
                return this.processFeatureUpdate(message as UpdateData);
        }
    }

    private processInitialFeatureData(initialData: InitialData) {
        const features = initialData.features;
        this.featureStorage.updateFeatures(features);
        this.initialized = true;
        this.eventEmitter.emit('ready');
    }

    private processFeatureUpdate(updateData: UpdateData) {
        const { feature } = updateData;
        this.featureStorage.updateFeature(feature);
        const { name, key, isOn } = this.featureStorage.getFeature(feature.key);
        this.eventEmitter.emit('update', { name, key, isOn });
    }

    on(eventType: EventType, callback: (...args: any[]) => void) {
        const unsubsribe = this.eventEmitter.register({
            eventType,
            id: Date.now(),
            callback
        });

        return { unsubsribe };
    }

    getFeatureState(featureKey: string) {
        if (!this.initialized) {
            throw new Error('Uninitialized');
        }
        return this.featureStorage.getFeatureState(featureKey);
    }

    getFeatures() {
        if (!this.initialized) {
            throw new Error('Uninitialized');
        }
        return this.featureStorage.getFeatures();
    }
}