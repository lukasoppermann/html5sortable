interface configuration {
  items?: string,
  handle?: string,
  forcePlaceholderSize?:boolean;
  connectWith?: string,
  acceptFrom?: void,
  placeholder?: void,
  placeholderClass?: string,
  hoverClass?: string,
  draggingClass?: string,
  maxItems?: number,
  copy?: boolean,
  itemSerializer?: (serializedItem: serializedItem, sortableContainer: HTMLElement) => serializedItem,
  containerSerializer?: (serializedContainer: object) => object,
  customDragImage?:void,
  disableIEFix?: boolean,
  debounce?: number,
  throttleTime?: number,
  orientation?: 'vertical'|'horizontal'
}
