/*
 * For default interfaces that are frequently used and extensions:
 *   - Extension of objects that are external to the library.
*/
interface data {
    [index:string]: string|configuration,
    configuration: configuration,
    _disabled: string,
    items: string,
    connectWith: string
}
