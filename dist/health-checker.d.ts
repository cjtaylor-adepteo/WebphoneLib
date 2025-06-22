import { UserAgent } from 'sip.js/lib/api/user-agent';
export declare class HealthChecker {
    private userAgent;
    private optionsTimeout;
    private logger;
    constructor(userAgent: UserAgent);
    stop(): void;
    /**
     * Start a periodic OPTIONS message to be sent to the sip server, if it
     * does not respond, our connection is probably broken.
     */
    start(): any;
    private createOptionsMessage;
}
