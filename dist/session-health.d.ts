import { Session as UserAgentSession } from 'sip.js/lib/api/session';
export declare function checkAudioConnected(session: UserAgentSession, { checkInterval, noAudioTimeout }: {
    checkInterval: number;
    noAudioTimeout: number;
}): Promise<void>;
