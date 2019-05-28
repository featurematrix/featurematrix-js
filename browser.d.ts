import { FeatureMatrixBase, Options } from './base';
export declare class FeatureMatrixBrowser extends FeatureMatrixBase {
    constructor(options: Options);
    private init;
    initListeners(ws: WebSocket): void;
}
