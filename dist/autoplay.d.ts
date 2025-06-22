import { EventEmitter } from 'events';
interface IAutoplay {
    listen(): void;
    stop(): void;
    on(event: 'allowed', listener: () => void): this;
}
declare class AutoplaySingleton extends EventEmitter implements IAutoplay {
    readonly allowed: Promise<void>;
    private timer;
    constructor();
    listen(): void;
    stop(): void;
    private update;
    private test;
}
export declare const Autoplay: AutoplaySingleton;
export {};
