import { FeatureMatrixBase, Options } from './base';
import { FeatureStorage } from './feature-storage';
import { LocalStorage } from './localstorage';

export class FeatureMatrixBrowser extends FeatureMatrixBase {
    constructor() {
        super();
        this.featureStorage = new FeatureStorage(new LocalStorage());
    }

    init(options: Options) {
        if (!options || !options.appKey || !options.envKey) {
            throw new Error('appKey and envKey are required');
        }

        const { appKey, envKey } = options;
        const ws = new WebSocket(`wss://live.featurematrix.io?envKey=${envKey}&appKey=${appKey}`);
        this.initListeners(ws);
    }

    initListeners(ws: WebSocket) {
        ws.addEventListener('message', message => {
            const parsedMessage = JSON.parse(message.data);
            super.onMessage(parsedMessage);
        });

        ws.addEventListener('error', (evt) => {
            console.error(evt);
        });

        ws.addEventListener('close', evt => {
            try {
                const reason = JSON.parse(evt.reason);
                console.error(reason);
            } catch (err) {
                console.error('Socket closed unexpectedly');
            }
        });
    }
}