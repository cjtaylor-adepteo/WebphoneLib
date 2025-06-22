import { MediaDeviceId } from './types';
interface ISoundOptions {
    volume?: number;
    overlap?: boolean;
    sinkId?: MediaDeviceId;
}
export declare class Sound {
    readonly uri: string;
    private samples;
    private options;
    private stopTimer?;
    constructor(uri: string, options?: ISoundOptions);
    get playing(): boolean;
    get volume(): number;
    set volume(newVolume: number);
    get sinkId(): MediaDeviceId;
    set sinkId(newSinkId: MediaDeviceId);
    play({ loop, timeout }?: {
        loop: boolean;
        timeout: number;
    }): Promise<void>;
    stop(): void;
}
export {};
