import { EventEmitter } from 'events';
import { IMediaInput } from './types';
export interface IAudioDevice {
    /**
     * Unique identifier for the presented device that is persisted across
     * sessions. It is reset when the user clears cookies. See
     * `MediaDeviceInfo.deviceId`.
     */
    id: string;
    name: string;
    kind: 'audioinput' | 'audiooutput';
}
interface IMediaDevices {
    readonly devices: IAudioDevice[];
    readonly inputs: IAudioDevice[];
    readonly outputs: IAudioDevice[];
    on(event: 'devicesChanged' | 'permissionGranted' | 'permissionRevoked', listener: () => void): this;
}
/**
 * Offers an abstraction over Media permissions and device enumeration for use
 * with WebRTC.
 */
declare class MediaSingleton extends EventEmitter implements IMediaDevices {
    private allDevices;
    private requestPermissionPromise;
    private timer;
    private hadPermission;
    init(): void;
    get devices(): IAudioDevice[];
    get inputs(): IAudioDevice[];
    get outputs(): IAudioDevice[];
    /**
     * Check if we (still) have permission to getUserMedia and enumerateDevices.
     * This only checks the permission and does not ask the user for anything. Use
     * `requestPermission` to ask the user to approve the request.
     */
    checkPermission(): Promise<boolean>;
    requestPermission(): Promise<void>;
    openInputStream(input: IMediaInput): Promise<MediaStream>;
    closeStream(stream: MediaStream): void;
    private enumerateDevices;
    private update;
    private updateDevices;
}
export declare const Media: MediaSingleton;
export {};
