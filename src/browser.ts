import { FeatureMatrixBase, Options } from './base';
import { FeatureStorage } from './feature-storage';
import { LocalStorage } from './localstorage';

export class FeatureMatrixBrowser extends FeatureMatrixBase {
    private options: Options;

    constructor() {
        super();
        this.featureStorage = new FeatureStorage(new LocalStorage());
    }

    init(options: Options) {
        if (!options || !options.appKey || !options.envKey) {
            throw new Error('appKey and envKey are required');
        }

        this.options = options;
        this.connect();
    }

    connect() {
        const { appKey, envKey } = this.options;
        const ws = new WebSocket(`wss://live.featurematrix.io?envKey=${envKey}&appKey=${appKey}`);
        this.initListeners(ws);
    }

    initListeners(ws: WebSocket) {
        ws.addEventListener('open', () => {
            super.onConnect();
        });

        ws.addEventListener('message', message => {
            const parsedMessage = JSON.parse(message.data);
            super.onMessage(parsedMessage);
        });

        ws.addEventListener('error', (evt) => {
            console.error(evt);
        });

        ws.addEventListener('close', evt => {
            super.onClose();

            try {
                const reason = JSON.parse(evt.reason);
                console.error(reason);
            } catch (err) {
                console.error('Socket closed unexpectedly');
            }
        });
    }
}