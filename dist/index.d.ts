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

declare class Post<T = unknown> {
    private eventName;
    private data?;
    private mockData?;
    private constructor();
    static create<T>(eventName: string, data?: unknown, mockData?: T): Promise<T>;
    private execute;
}

declare const isEnvBrowser: () => boolean;

declare const lazyLoad: <T extends Record<string, any>, U extends keyof T>(loader: (x?: string) => Promise<T>) => T;

declare const sleep: (delay: number) => Promise<unknown>;

declare const noop: () => void;

declare const useObserve: <T = unknown>(action: string, handler: (data: T) => void) => void;

type EventHandlerSignature<T = Event> = (event: T) => void;
declare const useListen: <T extends Event = Event>(event: keyof WindowEventMap, handler: EventHandlerSignature<T>, target?: EventTarget) => void;

declare const useImageValidation: (imageUrl: string) => {
    isImageValid: boolean;
    imageUrl: string;
};

interface UseSoundOptionsInterface {
    volume?: number;
    loop?: boolean;
}

declare const useSound: (src: string, options?: UseSoundOptionsInterface) => {
    play: () => void;
    pause: () => void;
    isPlaying: boolean;
};

type KeyPressHandler = (event: KeyboardEvent) => void;
interface UseKeyPressOptions {
    enabled?: boolean;
    preventDefault?: boolean;
    stopPropagation?: boolean;
}
declare const useKeyPress: (key: string, handler: KeyPressHandler, options?: UseKeyPressOptions) => void;

type ObservedMessageType<T = any> = {
    action: string;
    data: T;
};

export { Debugger, type DebuggerEventType, type ObservedMessageType, Post, isEnvBrowser, lazyLoad, noop, sleep, useImageValidation, useKeyPress, useListen, useObserve, useSound };
