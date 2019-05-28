export declare type EventType = 'ready' | 'update';
interface Listener {
    eventType: EventType;
    id: number;
    callback: (...args: any[]) => any;
}
export declare class EventEmitter {
    private listeners;
    register(listener: Listener): () => void;
    unregister(id: number): void;
    emit(eventType: EventType, data?: any): void;
}
export {};
