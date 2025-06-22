import { Invitation as SIPInvitation } from 'sip.js/lib/api/invitation';
import { InvitationRejectOptions } from 'sip.js/lib/api/invitation-reject-options';
import { ISessionAccept, SessionImpl } from './session';
export declare class Invitation extends SessionImpl {
    protected session: SIPInvitation;
    private acceptedRef;
    constructor(options: any);
    accept(): Promise<void>;
    accepted(): Promise<ISessionAccept>;
    reject(rejectOptions?: InvitationRejectOptions): Promise<void>;
    tried(): Promise<void>;
    cancel(): Promise<void>;
}
