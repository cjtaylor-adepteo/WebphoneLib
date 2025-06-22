import { EventEmitter } from 'events';
import { Core, SessionDescriptionHandlerModifiers } from 'sip.js';
import { Invitation } from 'sip.js/lib/api/invitation';
import { InvitationRejectOptions } from 'sip.js/lib/api/invitation-reject-options';
import { Inviter } from 'sip.js/lib/api/inviter';
import { InviterInviteOptions } from 'sip.js/lib/api/inviter-invite-options';
import { SessionStatus } from './enums';
import { SessionMedia } from './session-media';
import { SessionStats } from './session-stats';
import { IMedia, IRemoteIdentity } from './types';
export interface ISession {
    readonly id: string;
    readonly media: SessionMedia;
    readonly stats: SessionStats;
    readonly audioConnected: Promise<void>;
    readonly isIncoming: boolean;
    saidBye: boolean;
    holdState: boolean;
    status: SessionStatus;
    /**
     * The remote identity of this session.
     * @returns {IRemoteIdentity}
     */
    remoteIdentity: IRemoteIdentity;
    /**
     * The local stream of this session.
     * @returns {MediaStream}
     */
    localStream: MediaStream;
    /**
     * The remote stream of this session.
     * @returns {MediaStream}
     */
    remoteStream: MediaStream;
    /**
     * @returns {boolean} if auto answer is on for this session.
     */
    autoAnswer: boolean;
    /**
     * @returns {string} Phone number of the remote identity.
     */
    phoneNumber: string;
    /**
     * @returns {Date} Starting time of the call.
     */
    startTime: any;
    /**
     * @returns {Date} End time of the call.
     */
    endTime: any;
    accept(): Promise<ISessionAccept | void>;
    reject(rejectOptions?: InvitationRejectOptions): Promise<void>;
    /**
     * Terminate the session.
     */
    terminate(): Promise<Core.OutgoingByeRequest>;
    /**
     * Promise that resolves when the session is accepted or rejected.
     * @returns Promise<ISessionAccept>
     */
    accepted(): Promise<ISessionAccept>;
    /**
     * Promise that resolves when the session is terminated.
     */
    terminated(): Promise<string | void>;
    reinvite(): Promise<void>;
    /**
     * Put the session on hold.
     */
    hold(): Promise<boolean>;
    /**
     * Take the session out of hold.
     */
    unhold(): Promise<boolean>;
    /**
     * Blind transfer the current session to a target number.
     * @param {string} target - Number to transfer to.
     */
    blindTransfer(target: string): Promise<boolean>;
    bye(): void;
    /**
     * Send one or more DTMF tones.
     * @param tones May only contain the characters `0-9A-D#*,`
     */
    dtmf(tones: string): void;
    on(event: 'terminated', listener: ({ id }: {
        id: string;
    }) => void): this;
    on(event: 'statusUpdate', listener: (session: {
        id: string;
        status: string;
    }) => void): this;
    on(event: 'muteUpdate', listener: ({ newMuted }: {
        newMuted: boolean;
    }) => void): this;
    on(event: 'callQualityUpdate', listener: ({ id }: {
        id: string;
    }, stats: SessionStats) => void): this;
    on(event: 'remoteIdentityUpdate', listener: ({ id }: {
        id: string;
    }, remoteIdentity: IRemoteIdentity) => void): this;
}
export interface ISessionAccept {
    accepted: boolean;
    rejectCode?: number;
    rejectCause?: string;
    rejectPhrase?: string;
}
export interface ISessionCancelled {
    reason?: string;
}
/**
 * @hidden
 */
export declare class SessionImpl extends EventEmitter implements ISession {
    readonly id: string;
    readonly media: SessionMedia;
    readonly stats: SessionStats;
    readonly audioConnected: Promise<void>;
    readonly isIncoming: boolean;
    saidBye: boolean;
    holdState: boolean;
    status: SessionStatus;
    protected acceptedPromise: Promise<ISessionAccept>;
    protected inviteOptions: InviterInviteOptions;
    protected session: Inviter | Invitation;
    protected terminatedReason?: string;
    protected cancelled?: ISessionCancelled;
    protected _remoteIdentity: IRemoteIdentity;
    private acceptedSession;
    private acceptPromise;
    private rejectPromise;
    private terminatedPromise;
    private reinvitePromise;
    private onTerminated;
    /** Custom SIP headers for outgoing requests */
    private extraHeaders;
    protected constructor({ session, media, onTerminated, isIncoming, extraHeaders }: {
        session: Inviter | Invitation;
        media: IMedia;
        onTerminated: (sessionId: string) => void;
        isIncoming: boolean;
        extraHeaders?: string[];
    });
    get remoteIdentity(): IRemoteIdentity;
    get autoAnswer(): boolean;
    get phoneNumber(): string;
    get startTime(): Date;
    get endTime(): Date;
    accept(): Promise<void>;
    reject(): Promise<void>;
    accepted(): Promise<ISessionAccept>;
    terminate(): Promise<Core.OutgoingByeRequest>;
    terminated(): Promise<string | void>;
    reinvite(modifiers?: SessionDescriptionHandlerModifiers): Promise<void>;
    hold(): Promise<boolean>;
    unhold(): Promise<boolean>;
    blindTransfer(target: string): Promise<boolean>;
    attendedTransfer(target: SessionImpl): Promise<boolean>;
    /**
     * Reconfigure the WebRTC peerconnection.
     */
    rebuildSessionDescriptionHandler(): void;
    bye(): Promise<Core.OutgoingByeRequest>;
    /**
     * Returns true if the DTMF was successful.
     */
    dtmf(tones: string, options?: any): boolean;
    get localStream(): any;
    get remoteStream(): any;
    freeze(): ISession;
    protected makeInviteOptions({ onAccept, onReject, onRejectThrow, onProgress, onTrying, sessionDescriptionHandlerModifiers }: {
        onAccept: any;
        onReject: any;
        onRejectThrow: any;
        onProgress: any;
        onTrying: any;
        sessionDescriptionHandlerModifiers?: any[];
    }): {
        requestDelegate: {
            onAccept: () => void;
            onReject: ({ message }: Core.IncomingResponse) => void;
            onProgress: ({ message }: Core.IncomingResponse) => void;
            onTrying: () => void;
        };
        sessionDescriptionHandlerOptions: {
            constraints: {
                audio: boolean;
                video: boolean;
            };
        };
        sessionDescriptionHandlerModifiers: any[];
        requestOptions: {
            extraHeaders: string[];
        };
    };
    protected extractRemoteIdentity(): {
        phoneNumber: string;
        displayName: string;
    };
    private setHoldState;
    /**
     * Generic transfer function that either does a blind or attended
     * transfer. Which kind of transfer is done is dependent on the type of
     * `target` passed.
     *
     * In the case of a BLIND transfer, a string can be passed along with a
     * number.
     *
     * In the case of an ATTENDED transfer, a NEW call should be made. This NEW
     * session (a.k.a. InviteClientContext/InviteServerContext depending on
     * whether it is outbound or inbound) should then be passed to this function.
     *
     * @param {UserAgentSession | string} target - Target to transfer this session to.
     * @returns {Promise<boolean>} Promise that resolves when the transfer is made.
     */
    private transfer;
    private isTransferredPromise;
}
