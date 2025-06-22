import { EventEmitter } from 'events';
import { Web } from 'sip.js';
import { Invitation } from 'sip.js/lib/api/invitation';
import { Inviter } from 'sip.js/lib/api/inviter';
import { Publisher } from 'sip.js/lib/api/publisher';
import { PublisherOptions } from 'sip.js/lib/api/publisher-options';
import { Subscriber } from 'sip.js/lib/api/subscriber';
import { UserAgent } from 'sip.js/lib/api/user-agent';
import { UserAgentOptions } from 'sip.js/lib/api/user-agent-options';
import { ClientStatus, ReconnectionMode } from './enums';
import { IClientOptions } from './types';
export type UAFactory = (options: UserAgentOptions) => UserAgent;
/**
 * @hidden
 */
export interface ITransportDelegate {
    /**
     * Do something with the invitation before onInvite is called.
     * @param invitation the SIP Invitation instance.
     * @returns {boolean} if true it will stop the onInvite early.
     */
    onBeforeInvite(invitation: Invitation): boolean;
}
/**
 * @hidden
 */
export interface ITransport extends EventEmitter {
    registeredPromise: Promise<any>;
    registered: boolean;
    status: ClientStatus;
    delegate?: ITransportDelegate;
    configure(options: IClientOptions): void;
    connect(): Promise<boolean>;
    disconnect(options?: {
        hasRegistered: boolean;
    }): Promise<void>;
    updatePriority(flag: boolean): void;
    getConnection(mode: ReconnectionMode): Promise<boolean>;
    close(): void;
    createInviter(phoneNumber: string): Inviter;
    createSubscriber(contact: string): Subscriber;
    createPublisher(contact: string, options: PublisherOptions): Publisher;
}
/**
 * @hidden
 */
export type TransportFactory = (uaFactory: UAFactory, options: IClientOptions) => ITransport;
/**
 * @hidden
 */
export declare class WrappedTransport extends Web.Transport {
    /**
     * Disconnect socket. It could happen that the user switches network
     * interfaces while calling. If this happens, closing a websocket will
     * cause it to be blocked. To make sure that UA gets to the proper internal
     * state so that it is ready to 'switch over' to the new network interface
     * with a new websocket, we call the function that normally causes the
     * disconnectPromise to be resolved after a timeout.
     */
    protected disconnectPromise(options?: any): Promise<any>;
}
/**
 * @hidden
 */
export declare class ReconnectableTransport extends EventEmitter implements ITransport {
    registeredPromise: Promise<any>;
    registered: boolean;
    status: ClientStatus;
    delegate?: ITransportDelegate;
    private priority;
    private unregisteredPromise;
    private uaFactory;
    private uaOptions;
    private userAgent;
    /** Custom SIP headers for REGISTER and INVITE */
    private extraHeaders;
    private dyingCounter;
    private wsTimeout;
    private dyingIntervalID;
    private retry;
    private registerer;
    private unregisterer;
    private boundOnWindowOffline;
    private boundOnWindowOnline;
    private wasWindowOffline;
    private healthChecker;
    constructor(uaFactory: UAFactory, options: IClientOptions);
    configure(options: IClientOptions): void;
    connect(): Promise<any>;
    disconnect({ hasRegistered }: {
        hasRegistered?: boolean;
    }): Promise<void>;
    createInviter(phoneNumber: string): Inviter;
    createSubscriber(contact: string): Subscriber;
    createPublisher(contact: string, options: PublisherOptions): Publisher;
    isRegistered(): Promise<any>;
    getConnection(mode?: ReconnectionMode): Promise<boolean>;
    updatePriority(flag: boolean): void;
    close(): void;
    private updateStatus;
    private isOnlinePromise;
    private configureUA;
    private isOnline;
    /**
     * This function is generally called after a window 'online' event or
     * after an ua.transport 'disconnected' event.
     *
     * In the scenario where the SIP server goes offline, or a socket stops
     * working, ua.transport emits a 'disconnected' event. When this happens
     * for a multitude of clients, all of those clients would be
     * reconnecting at the same time.
     *
     * To avoid this, we divide those clients in two groups:
     *  - Clients that are in a call (priority === true)
     *  - Clients that are not in a call (priority === false)
     *
     *  Clients that are in a call can recover as soon as possible, where
     *  clients that are not in a call have to wait an amount of time which
     *  increments every failure, before reconnecting to the server.
     */
    private tryUntilConnected;
    private createRegisteredPromise;
    private createUnregisteredPromise;
    private onWindowOffline;
    private stopHealthChecker;
    private createHealthChecker;
    private onTransportDisconnected;
    private onAfterGetConnection;
    /**
     * Convert a comma-separated string like:
     * `SIP;cause=200;text="Call completed elsewhere` to a Map.
     * @param {string} header - The header to parse.
     * @returns {Map} - A map of key/values of the header.
     */
    private parseHeader;
}
