declare interface opts {
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

declare interface events {
    [index:string]: Function
    dragStart: () => void,
    dragEnd: () => void,
    drop: () => void,
    dragover: () => void,
    dragenter: () => void
}


declare interface data {
    [index:string]: string|opts,
    opts: opts,
    _disabled: string,
    items: string,
    connectWith: string
}

declare interface h5s {
    events: events,
    data: data
}

declare interface offsetObject {
    'left': number,
    'right': number,
    'top': number,
    'bottom': number
}

declare interface serializedItems {
    parent: Element,
    node: Element,
    html: string,
    index: number
}

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html
declare interface Element {
    isSortable: boolean,
    h5s: h5s
}

declare interface Node {
    querySelector: Function
}

