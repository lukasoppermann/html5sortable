/*
 * For default interfaces that are frequently used and extensions:
 *   - HTMLElement: h5s and its inner objects.
 *   - Extension of objects that are external to the library.
*/

interface opts {
    connectWith: boolean,
    acceptFrom: void,
    copy: boolean,
    placeholder: void,
    disableIEFix: boolean,
    placeholderClass: string,
    draggingClass: string,
    hoverClass: boolean,
    debounce: number,
    maxItems: number,
    itemSerializer: void,
    containerSerializer: void,
    items: string
}

// Can these functions be better defined?
interface events {
    [index:string]: Function
    dragStart: () => void,
    dragEnd: () => void,
    drop: () => void,
    dragover: () => void,
    dragenter: () => void
}


interface data {
    [index:string]: string|opts,
    opts: opts,
    _disabled: string,
    items: string,
    connectWith: string
}

interface h5s {
    events: events,
    data: data
}
/* 
 * typescriptlang.org/docs/handbook/declaration-merging.html
 * ie. if this is done new properties can be 
 * added to previously defined objects
*/
interface HTMLElement {
    isSortable: boolean,
    h5s: h5s
}

interface Node {
    querySelector: Function
}

