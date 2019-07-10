import { FeatureStorage, Feature } from './feature-storage';
import { EventEmitter, EventType, Subscription } from './event-emitter';

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
    private reconnectInterval;

    initialized = false;

    protected connect() {
    };

    onConnect() {
        clearInterval(this.reconnectInterval);
    }

    onMessage(message: Message) {
        switch (message.type) {
            case MessageType.INIT:
                return this.processInitialFeatureData(message as InitialData);
            case MessageType.FEATURE_UPDATED:
                return this.processFeatureUpdate(message as UpdateData);
        }
    }

    onClose() {
        this.reconnectInterval = setInterval(() => {
            clearInterval(this.reconnectInterval);
            this.connect();
        }, 10000);
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

    on(eventType: EventType, callback: (...args: any[]) => void): Subscription {
        if (eventType === 'ready' && this.initialized) {
            callback();
        }

        return this.eventEmitter.register({
            eventType,
            id: Date.now(),
            callback
        });
    }

    getFeatureState(featureKey: string) {
        if (!this.initialized) {
            console.warn('Uninitialized');
        }

        return this.featureStorage.getFeatureState(featureKey, !this.initialized);
    }

    getFeatures() {
        if (!this.initialized) {
            console.warn('Uninitialized');
            return null;
        }
        return this.featureStorage.getFeatures();
    }
}