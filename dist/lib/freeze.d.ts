/**
 * Create immutable proxies for all `properties` on `obj` proxying to `impl`.
 * @hidden
 */
export declare function createFrozenProxy<T>(obj: object, impl: T, properties: string[]): Readonly<object>;
