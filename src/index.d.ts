// declare var elem: any;

// // HTMLUListElement {
// //   h5s:
// //    { events:
// //       { dragstart: [Function],
// //         dragend: [Function],
// //         drop: [Function],
// //         dragover: [Function: onDragOverEnter],
// //         dragenter: [Function: onDragOverEnter] },
// //      data:
// //       { opts: [Object],
// //         _disabled: 'false',
// //         items: 'li:not(.disabled)',
// //         connectWith: '.test' } },
// //   isSortable: true,
// //   [Symbol(SameObject caches)]:
// //    { children:
// //       HTMLCollection {
// //         '0': [HTMLLIElement],
// //         '1': [HTMLLIElement],
// //         '2': [HTMLLIElement],
// //         '3': [HTMLLIElement] } } }

// // { opts:
// //   { connectWith: false,
// //     acceptFrom: null,
// //     copy: false,
// //     placeholder: null,
// //     disableIEFix: false,
// //     placeholderClass: 'test-placeholder',
// //     draggingClass: 'test-dragging',
// //     hoverClass: false,
// //     debounce: 0,
// //     maxItems: 0,
// //     itemSerializer: undefined,
// //     containerSerializer: undefined,
// //     items: 'li' },
// //  _disabled: 'false',
// //  items: 'li' }

// declare interface events {
//   dragStart: (any) => void,
//   dragEnd: (any) => void,
//   drop: (any) => void,
//   dragover: (any) => void,
//   dragenter: (any) => void
// }

// declare interface data {

// }

// declare module Elem {
//   export class El extends Element {
//     isSortable: () => boolean
//   }
// }

// declare interface Item {
//   parent: Element & Element,
//   node: Node,
//   html: any,
//   index: number
// }
