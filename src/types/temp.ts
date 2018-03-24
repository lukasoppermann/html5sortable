export default class sortable {
    sortableElements: any
    options: object|string|undefined
    constructor(sortableElements, options: object|string|undefined) {
      this.sortableElements = sortableElements
      this.options = options
      this.setOptions();
      this.reformatSortableElements();
      this.serialize();
    }
    // get method string to see if a method is called
    method: string = String(this.options)
    // merge user this.options with defaults
    setOptions() {
      this.options = Object.assign({
        connectWith: false,
        acceptFrom: null,
        copy: false,
        disableIEFix: false,
        placeholder: null,
        placeholderClass: 'sortable-placeholder',
        draggingClass: 'sortable-dragging',
        hoverClass: false,
        debounce: 0,
        maxItems: 0,
        itemSerializer: undefined,
        containerSerializer: undefined,
        customDragImage: null
        // if this.options is an object, merge it, otherwise use empty object
      }, (typeof this.options === 'object') ? this.options : {})
    }
    reformatSortableElements() {
      // check if the user provided a selector instead of an element
      if (typeof this.sortableElements === 'string') {
        this.sortableElements = document.querySelectorAll(this.sortableElements)
      }
      // if the user provided an element, return it in an array to keep the return value consistant
      if (this.sortableElements instanceof Element) {
        this.sortableElements = [this.sortableElements]
      }
  
      this.sortableElements = Array.prototype.slice.call(this.sortableElements)
    }
  
    serialize() {
      if (/serialize/.test(method)) {
        return this.sortableElements.map((sortableContainer) => {
          let opts = _data(sortableContainer, 'opts')
          return _serialize(sortableContainer, opts.itemSerializer, opts.containerSerializer)
        })
      }
    }