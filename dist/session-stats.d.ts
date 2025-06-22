import { EventEmitter } from 'events';
import { Session as UserAgentSession } from 'sip.js/lib/api/session';
declare class StatsAggregation {
    private stats;
    add(sample: number): void;
    get last(): number;
    get count(): number;
    get sum(): number;
    get lowest(): number;
    get highest(): number;
    get average(): number;
}
export declare class SessionStats extends EventEmitter {
    readonly mos: StatsAggregation;
    private statsTimer;
    private statsInterval;
    constructor(session: UserAgentSession, { statsInterval }: {
        statsInterval: number;
    });
    clearStatsTimer(): void;
    /**
     * Add stats for inbound RTP.
     *
     * See https://developer.mozilla.org/en-US/docs/Web/API/RTCStatsReport
     * @param {RTCStatsReport} stats - Stats returned by `pc.getStats()`
     * @return {boolean} False if report did not contain any useful stats.
     */
    private add;
}
export interface IMeasurement {
    rtt: number;
    jitter: number;
    fractionLost: number;
}
/**
 * Calculate a Mean Opinion Score (MOS).
 *
 * Calculation taken from:
 * https://www.pingman.com/kb/article/how-is-mos-calculated-in-pingplotter-pro-50.html
 *
 * @param {Object} options - Options.
 * @param {Number} options.rtt -  Trip Time in seconds.
 * @param {Number} options.jitter - Jitter in seconds.
 * @param {Number} options.fractionLost - Fraction of packets lost (0.0 - 1.0)
 * @returns {Number} MOS value in range 0.0 (very bad) to 5.0 (very good)
 */
export declare function calculateMOS({ rtt, jitter, fractionLost }: IMeasurement): number;
export {};
