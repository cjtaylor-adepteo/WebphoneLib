import { Core } from 'sip.js';
import { Inviter as SIPInviter } from 'sip.js/lib/api/inviter';
import { ISessionAccept, SessionImpl } from './session';
export declare class Inviter extends SessionImpl {
    protected session: SIPInviter;
    private progressedPromise;
    private triedPromise;
    constructor(options: any);
    progressed(): Promise<void>;
    tried(): Promise<void>;
    accepted(): Promise<ISessionAccept>;
    invite(): Promise<Core.OutgoingInviteRequest>;
    accept(): Promise<void>;
    reject(): Promise<void>;
    cancel(): Promise<void>;
}
