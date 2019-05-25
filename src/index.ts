import { FeatureStorage, Feature } from './feature-storage';
import { EventEmitter, EventType } from './event-emitter';

interface Options {
    appKey: string;
    envKey: string;
}

enum MessageType {
    INIT = 'INIT',
    FEATURE_UPDATED = 'FEATURE_UPDATED',
}

interface InitialData {
    type: MessageType;
    features: Feature[];
}

interface UpdateData {
    type: MessageType;
    feature: Feature;
}

class FeatureMatrix {
    private featureStorage = new FeatureStorage();
    private eventEmitter = new EventEmitter();

    constructor(options: Options) {
        this.init(options);
    }

    private init(options: Options) {
        const { appKey, envKey } = options;
        const ws = new WebSocket(`ws://localhost:8000/live?envKey=${envKey}&appKey=${appKey}`);
        this.initListeners(ws);
    }

    private initListeners(ws: WebSocket) {
        ws.addEventListener('message', message => {
            const parsedMessage = JSON.parse(message.data);

            switch (parsedMessage.type as MessageType) {
                case MessageType.INIT:
                    return this.processInitialFeatureData(parsedMessage as InitialData);
                case MessageType.FEATURE_UPDATED:
                    return this.processFeatureUpdate(parsedMessage as UpdateData);
            }
        });
    }

    private processInitialFeatureData(initialData: InitialData) {
        const features = initialData.features;
        this.featureStorage.updateFeatures(features);
        this.eventEmitter.emit('ready');
    }

    private processFeatureUpdate(updateData: UpdateData) {
        const { feature } = updateData;
        this.featureStorage.updateFeature(feature);
        this.eventEmitter.emit('update', feature);
    }

    on(eventType: EventType, callback: (...args: any[]) => void) {
        this.eventEmitter.register({
            eventType,
            id: Date.now(),
            callback
        });
    }

    getFeatureState(featureKey: string) {
        return this.featureStorage.getFeatureState(featureKey);
    }
}