import { EventEmitter } from 'events';
import { Session } from 'sip.js/lib/api/session';
import { IncomingInviteRequest } from 'sip.js/lib/core';
import { SessionImpl } from './session';
import { IMedia, IMediaInput, IMediaOutput } from './types';
interface IRTCPeerConnectionLegacy extends RTCPeerConnection {
    getRemoteStreams: () => MediaStream[];
    getLocalStreams: () => MediaStream[];
}
export type InternalSession = Session & {
    _sessionDescriptionHandler: {
        peerConnection: IRTCPeerConnectionLegacy;
    };
    __streams: {
        localStream: MediaStreamAudioDestinationNode;
        remoteStream: MediaStream;
    };
    __media: SessionMedia;
    on(event: 'reinvite', listener: (session: InternalSession, request: IncomingInviteRequest) => void): InternalSession;
};
interface ISessionMedia extends IMedia {
    on(event: 'setupFailed', listener: () => void): this;
}
export declare class SessionMedia extends EventEmitter implements ISessionMedia {
    readonly input: IMediaInput;
    readonly output: IMediaOutput;
    private session;
    private media;
    private audioOutput;
    private inputStream;
    private inputNode;
    constructor(session: SessionImpl, media: IMedia);
    setInput(newInput?: IMediaInput): Promise<void>;
    setOutput(newOutput?: IMediaOutput): Promise<void>;
    private setInputDevice;
    private setInputAudioProcessing;
    private setInputVolume;
    private setInputMuted;
    private setOutputDevice;
    private setOutputVolume;
    private setOutputMuted;
    private stopInput;
    private stopOutput;
}
export {};
