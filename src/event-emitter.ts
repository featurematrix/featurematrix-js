

export type EventType = 'ready' | 'update';

interface Listener {
    eventType: EventType;
    id: number;
    callback: (...args: any[]) => any;
}

export interface Subscription {
    unsubscribe: () => void;
}

export class EventEmitter {
    private listeners: Listener[] = [];

    register(listener: Listener): Subscription {
        this.listeners.push(listener);
        return {
            unsubscribe: () => this.unregister(listener.id)
        };
    }

    unregister(id: number) {
        const listenerIdx = this.listeners.findIndex(listener => listener.id === id);
        ~listenerIdx && this.listeners.splice(listenerIdx, 1);
    }

    emit(eventType: EventType, data?: any) {
        this.listeners
            .filter(listener => listener.eventType === eventType)
            .forEach(listener => listener.callback.call(listener, data));
    }
}