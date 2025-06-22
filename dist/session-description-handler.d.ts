import { SessionDescriptionHandler } from 'sip.js/lib/Web';
export declare function stripPrivateIps(description: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit>;
export declare function sessionDescriptionHandlerFactory(session: any, options: any): SessionDescriptionHandler;
