/**
 * Generic class type T. For example: `Type<Session>`
 */
export type Type<T> = new (...args: any[]) => T;
export declare function eqSet<T>(a: Set<T>, b: Set<T>): boolean;
export declare function isPrivateIP(ip: string): boolean;
export declare function fetchStream(url: string): Promise<() => Promise<AudioBufferSourceNode>>;
/**
 * Calculate a jitter from interval.
 * @param {number} interval - The interval in ms to calculate jitter for.
 * @param {number} percentage - The jitter range in percentage.
 * @returns {number} The calculated jitter in ms.
 */
export declare function jitter(interval: number, percentage: number): number;
/**
 * This doubles the retry interval in each run and adds jitter.
 * @param {any} retry - The reference retry object.
 * @returns {any & { interval: number } } The updated retry object.
 */
export declare function increaseTimeout(retry: any): any & {
    interval: number;
};
/**
 * Clamp a value between `min` and `max`, both inclusive.
 * @param {number} value - Value.
 * @param {number} min - Minimum value, inclusive.
 * @param {number} max - Maximum value, inclusive.
 * @returns {number} Clamped value.
 */
export declare function clamp(value: number, min: number, max: number): number;
