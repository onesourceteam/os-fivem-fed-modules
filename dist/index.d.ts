type DebuggerEventType = {
    action: string;
    data: any;
};

declare class Debugger {
    private events;
    private timer;
    constructor(events: DebuggerEventType[], timer?: number);
    private startProcessing;
    private handleEvent;
}

declare const isEnvBrowser: () => boolean;
declare const noop: () => void;

declare const useObserve: <T = unknown>(action: string, handler: (data: T) => void) => void;

declare class Post<T = unknown> {
    private eventName;
    private data?;
    private mockData?;
    private constructor();
    static create<T>(eventName: string, data?: unknown, mockData?: T): Promise<T>;
    private execute;
}

type EventHandlerSignature<T = Event> = (event: T) => void;
declare const useListen: <T extends Event = Event>(event: string, handler: EventHandlerSignature<T>, target?: EventTarget) => void;

type ObservedMessageType<T = any> = {
    action: string;
    data: T;
};

export { Debugger, type DebuggerEventType, type ObservedMessageType, Post, isEnvBrowser, noop, useListen, useObserve };
