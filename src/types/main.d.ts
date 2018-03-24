/*
 * For default interfaces that are frequently used and extensions:
 *   - HTMLElement: h5s and its inner objects.
 *   - Extension of objects that are external to the library.
*/

interface configuration {
    connectWith: boolean,
    acceptFrom: null,
    copy: boolean,
    placeholder: null,
    disableIEFix: boolean,
    placeholderClass: string,
    draggingClass: string,
    hoverClass: boolean,
    debounce: number,
    maxItems: number,
    itemSerializer: void,
    containerSerializer: void,
    items?: string,
    customDragImage: null
}

interface data {
    [index:string]: string|configuration,
    configuration: configuration,
    _disabled: string,
    items: string,
    connectWith: string
}

interface h5s {
    data: data
}
