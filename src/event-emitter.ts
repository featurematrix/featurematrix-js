

export type EventType = 'ready' | 'update';

interface Listener {
    eventType: EventType;
    id: number;
    callback: (...args: any[]) => any;
}

export class EventEmitter {
    private listeners: Listener[] = [];

    register(listener: Listener) {
        this.listeners.push(listener);
    }

    emit(eventType: EventType, data?: any) {
        this.listeners
            .filter(listener => listener.eventType === eventType)
            .forEach(listener => listener.callback.call(listener, data));
    }
}