import { SubscriptionStatus } from './enums';
export { Subscription } from 'sip.js';
/**
 * Parse an incoming dialog XML request body and return
 * the account state from it.
 * @param {Request} notification - A SIP.js Request object.
 * @returns {string} - The state of the account.
 */
export declare function statusFromDialog(notification: any): SubscriptionStatus | string;
