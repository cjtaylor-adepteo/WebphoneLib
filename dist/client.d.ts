import { EventEmitter } from 'events';
import { Publisher } from 'sip.js/lib/api/publisher';
import { PublisherOptions } from 'sip.js/lib/api/publisher-options';
import { ISession } from './session';
import { TransportFactory, UAFactory } from './transport';
import { IClientOptions, IMedia } from './types';
export interface IClient {
    /**
     * To setup a different voip account, sipserver or media devices. If you want
     * to adapt media devices it is better to do it on-the-fly by adapting the
     * media property on client (to change it globally) or by adapting the media
     * property on session.
     */
    reconfigure(options: IClientOptions): Promise<void>;
    /**
     * Connect (and subsequently register) to server.
     */
    connect(): Promise<boolean>;
    /**
     * Unregister (and subsequently disconnect) to server.
     */
    disconnect(): Promise<void>;
    /**
     * Call this before you want to delete an instance of this class.
     */
    close(): Promise<void>;
    isConnected(): boolean;
    /**
     * Make an outgoing call. Requires you to be registered to a sip server.
     *
     * Returns a promise which resolves as soon as the connected sip server
     * emits a progress response, or rejects when something goes wrong in that
     * process.
     *
     * @param uri  For example "sip:497920039@voipgrid.nl"
     */
    invite(uri: string): Promise<ISession>;
    subscribe(uri: string): Promise<void>;
    unsubscribe(uri: string): void;
    getSession(id: string): ISession;
    getSessions(): ISession[];
    /**
     * Enumerate available audio input and output devices.
     * @returns Promise that resolves to an array of MediaDeviceInfo for audio inputs/outputs.
     */
    listMediaDevices(): Promise<MediaDeviceInfo[]>;
    /**
     * Do an attended transfer from session a to session b.
     *
     * ```typescript
     * const sessionA = await client.invite(uri);
     * const sessionB = await client.invite(uri);
     *
     * if (await sessionA.accepted()) {
     *   await client.attendedTransfer(sessionA, sessionB);
     * }
     * ```
     */
    attendedTransfer(a: {
        id: string;
    }, b: {
        id: string;
    }): Promise<boolean>;
    createPublisher(contact: string, options: PublisherOptions): Publisher;
    /**
     * When receiving an invite, a (frozen) proxy session is returned which can be
     * used to display what is needed in your interface.
     *
     * ```typescript
     * client.on('invite', session => {
     *   const { number, displayName } = session.remoteIdentity;
     *
     *   // accept the incoming session after 5 seconds.
     *   setTimeout(() => session.accept(), 5000)
     *
     *   await session.accepted();
     *
     *   // session is accepted!
     *
     *   // terminate the session after 5 seconds.
     *   setTimeout(() => session.terminate(), 5000)
     * })
     *
     * ```
     */
    on(event: 'invite', listener: (session: ISession) => void): this;
    /**
     * Send an instant message (SIP MESSAGE) to a target URI.
     * @param target SIP URI to message (e.g. 'sip:alice@example.com')
     * @param body Message body text
     * @param extraHeaders Optional array of SIP header strings
     */
    sendMessage(target: string, body: string, extraHeaders?: string[]): Promise<void>;
    /**
     * Event fired when an out-of-dialog SIP MESSAGE is received.
     * Listener receives (from, body, headers).
     */
    on(event: 'message', listener: (from: string, body: string, headers: Record<string, string[]>) => void): this;
    /**
     * When a notify event for a specific subscription occurs, the status is
     * parsed from the XML request body and forwarded through the
     * `subscriptionNotify` event.
     *
     * ```typescript
     * const contact: string = 'sip:12345678@voipgrid.nl';
     *
     * client.on('subscriptionNotify', (contact, status) => {
     *   console.log(`${contact}: ${notification}`);
     * })
     *
     * await client.subscribe(contact);
     * ```
     */
    on(event: 'subscriptionNotify', listener: (contact: string, status: string) => void): this;
    /**
     * When a session is added to the sessions by an incoming or outgoing
     * call, a sessionAdded event is emitted.
     */
    on(event: 'sessionAdded', listener: (session: ISession) => void): this;
    /**
     * When a session is removed because it is terminated  a sessionRemoved event
     * is emitted.
     */
    on(event: 'sessionRemoved', listener: (session: ISession) => void): this;
    /**
     *
     * When the client's status is updated, the status event is emitted
     */
    on(event: 'statusUpdate', listener: (status: string) => void): this;
}
/**
 * @hidden
 */
export declare class ClientImpl extends EventEmitter implements IClient {
    defaultMedia: IMedia;
    private readonly sessions;
    private subscriptions;
    private connected;
    private transportFactory;
    private transport?;
    /** Custom SIP headers for REGISTER and INVITE */
    private extraHeaders;
    constructor(uaFactory: UAFactory, transportFactory: TransportFactory, options: IClientOptions);
    reconfigure(options: IClientOptions): Promise<void>;
    connect(): Promise<boolean>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    invite(uri: string): Promise<ISession>;
    close(): Promise<void>;
    subscribe(uri: string): Promise<void>;
    resubscribe(uri: string): Promise<void>;
    unsubscribe(uri: string): void;
    getSession(id: string): ISession;
    getSessions(): ISession[];
    /**
     * Enumerate available audio input and output devices.
     * @returns Promise resolving to array of MediaDeviceInfo
     */
    listMediaDevices(): Promise<MediaDeviceInfo[]>;
    attendedTransfer(a: ISession, b: ISession): Promise<boolean>;
    createPublisher(contact: string, options: PublisherOptions): Publisher;
    /**
     * Send an instant message (SIP MESSAGE) to a target URI.
     */
    sendMessage(target: string, body: string, extraHeaders?: string[]): Promise<void>;
    private configureTransport;
    private onSessionTerminated;
    private tryInvite;
    private removeSubscription;
    private addSession;
    private removeSession;
    private updatePriority;
}
type ClientCtor = new (options: IClientOptions) => IClient;
/**
 * A (frozen) proxy object for ClientImpl.
 * Only the properties listed here are exposed to the proxy.
 *
 * See [[IClient]] interface for more details on these properties.
 *
 * Typescript users of this library don't strictly need this, as Typescript
 * generally prevents using private attributes. But, even in Typescript there
 * are ways around this.
 */
export declare const Client: ClientCtor;
export {};
