/* eslint-env browser */
'use strict'

import { addData as _data, removeData as _removeData } from './data'
import _filter from './filter'
import { addEventListener as _on, removeEventListener as _off } from './eventListener'
import { addAttribute as _attr, removeAttribute as _removeAttr } from './attribute'
import _offset from './offset'
import _debounce from './debounce'
import _index from './index'
import isInDom from './isInDom'
import { insertBefore as _before, insertAfter as _after } from './insertHtmlElements'
import _serialize from './serialize'
import _makePlaceholder from './makePlaceholder'
import _getElementHeight from './elementHeight'
import _getHandles from './getHandles'
import setDragImage from './setDragImage'
import {default as store, stores} from './store'
/*
 * variables global to the plugin
 */
let dragging
let draggingHeight

/*
 * Keeps track of the initialy selected list, where 'dragstart' event was triggered
 * It allows us to move the data in between individual Sortable List instances
 */

// Origin List - data from before any item was changed
let originContainer
let originIndex
let originElementIndex
let originItemsBeforeUpdate

// Destination List - data from before any item was changed
let destinationItemsBeforeUpdate

/**
 * remove event handlers from items
 * @param {Array|NodeList} items
 */
const _removeItemEvents = function (items) {
  _off(items, 'dragstart')
  _off(items, 'dragend')
  _off(items, 'dragover')
  _off(items, 'dragenter')
  _off(items, 'drop')
  _off(items, 'mouseenter')
  _off(items, 'mouseleave')
}
/**
 * _getDragging returns the current element to drag or
 * a copy of the element.
 * Is Copy Active for sortable
 * @param {HTMLElement} draggedItem - the item that the user drags
 * @param {HTMLElement} sortable a single sortable
 */
const _getDragging = function (draggedItem, sortable) {
  let ditem = draggedItem
  if (_isCopyActive(sortable)) {
    ditem = draggedItem.cloneNode(true)
    _attr(ditem, 'aria-copied', 'true')
    draggedItem.parentElement.appendChild(ditem)
    ditem.style.display = 'none'
    ditem.oldDisplay = draggedItem.style.display
  }
  return ditem
}
/**
 * Remove data from sortable
 * @param {HTMLElement} sortable a single sortable
 */
const _removeSortableData = function (sortable) {
  _removeData(sortable)
  _removeAttr(sortable, 'aria-dropeffect')
}
/**
 * Remove data from items
 * @param {Array<HTMLElement>|HTMLElement} items
 */
const _removeItemData = function (items) {
  _removeAttr(items, 'aria-grabbed')
  _removeAttr(items, 'aria-copied')
  _removeAttr(items, 'draggable')
  _removeAttr(items, 'role')
}
/**
 * Check if two lists are connected
 * @param {HTMLElement} curList
 * @param {HTMLElement} destList
 */
const _listsConnected = function (curList, destList) {
  if (_isSortable(curList)) {
    const acceptFrom = _data(curList, 'opts').acceptFrom
    if (acceptFrom !== null) {
      return acceptFrom !== false && acceptFrom.split(',').filter(function (sel) {
        return sel.length > 0 && destList.matches(sel)
      }).length > 0
    }
    if (curList === destList) {
      return true
    }
    if (_data(curList, 'connectWith') !== undefined) {
      return _data(curList, 'connectWith') === _data(destList, 'connectWith')
    }
  }
  return false
}
/**
 * Is Copy Active for sortable
 * @param {HTMLElement} sortable a single sortable
 */
const _isCopyActive = function (sortable) {
  return _data(sortable, 'opts').copy === true
}
/**
 * Is {HTMLElement} a sortable.
 * @param {HTMLElement} element a single sortable
 */
function _isSortable (element) {
  return element !== undefined && element != null && _data(element, 'opts') !== undefined
}
/**
 * find sortable from element. travels up parent element until found or null.
 * @param {HTMLElement} element a single sortable
 */
function findSortable (element) {
  while ((element = element.parentElement) && !_isSortable(element));
  return element
}
/**
 * Dragging event is on the sortable element. finds the top child that
 * contains the element.
 * @param {HTMLElement} sortableElement a single sortable
 * @param {HTMLElement} element is that being dragged
 */
function findDragElement (sortableElement, element) {
  const options = _data(sortableElement, 'opts')
  const items = _filter(sortableElement.children, options.items)
  const itemlist = items.filter(function (ele) {
    return ele.contains(element)
  })

  return itemlist.length > 0 ? itemlist[0] : element
}
/**
 * Destroy the sortable
 * @param {HTMLElement} sortableElement a single sortable
 */
const _destroySortable = function (sortableElement) {
  const opts = _data(sortableElement, 'opts') || {}
  const items = _filter(sortableElement.children, opts.items)
  const handles = _getHandles(items, opts.handle)
  // remove event handlers & data from sortable
  _off(sortableElement, 'dragover')
  _off(sortableElement, 'dragenter')
  _off(sortableElement, 'drop')
  // remove event data from sortable
  _removeSortableData(sortableElement)
  // remove event handlers & data from items
  _off(handles, 'mousedown')
  _removeItemEvents(items)
  _removeItemData(items)
}
/**
 * Enable the sortable
 * @param {HTMLElement} sortableElement a single sortable
 */
const _enableSortable = function (sortableElement) {
  const opts = _data(sortableElement, 'opts')
  const items = _filter(sortableElement.children, opts.items)
  const handles = _getHandles(items, opts.handle)
  _attr(sortableElement, 'aria-dropeffect', 'move')
  _data(sortableElement, '_disabled', 'false')
  _attr(handles, 'draggable', 'true')
  // IE FIX for ghost
  // can be disabled as it has the side effect that other events
  // (e.g. click) will be ignored
  const spanEl = (document || window.document).createElement('span')
  if (typeof spanEl.dragDrop === 'function' && !opts.disableIEFix) {
    _on(handles, 'mousedown', function () {
      if (items.indexOf(this) !== -1) {
        this.dragDrop()
      } else {
        let parent = this.parentElement
        while (items.indexOf(parent) === -1) {
          parent = parent.parentElement
        }
        parent.dragDrop()
      }
    })
  }
}
/**
 * Disable the sortable
 * @param {HTMLElement} sortableElement a single sortable
 */
const _disableSortable = function (sortableElement) {
  const opts = _data(sortableElement, 'opts')
  const items = _filter(sortableElement.children, opts.items)
  const handles = _getHandles(items, opts.handle)
  _attr(sortableElement, 'aria-dropeffect', 'none')
  _data(sortableElement, '_disabled', 'true')
  _attr(handles, 'draggable', 'false')
  _off(handles, 'mousedown')
}
/**
 * Reload the sortable
 * @param {HTMLElement} sortableElement a single sortable
 * @description events need to be removed to not be double bound
 */
const _reloadSortable = function (sortableElement) {
  const opts = _data(sortableElement, 'opts')
  const items = _filter(sortableElement.children, opts.items)
  const handles = _getHandles(items, opts.handle)
  _data(sortableElement, '_disabled', 'false')
  // remove event handlers from items
  _removeItemEvents(items)
  _off(handles, 'mousedown')
  // remove event handlers from sortable
  _off(sortableElement, 'dragover')
  _off(sortableElement, 'dragenter')
  _off(sortableElement, 'drop')
}

/**
 * Public sortable object
 * @param {Array|NodeList} sortableElements
 * @param {object|string} options|method
 */
export default class Sortable {
  constructor (sortableElements, options) {
    this.sortableElements = sortableElements
    this.options = options
    return this.main()
  }

  get defaultOptions () {
    return {
      connectWith: false,
      acceptFrom: null,
      copy: false,
      placeholder: null,
      disableIEFix: false,
      placeholderClass: 'sortable-placeholder',
      draggingClass: 'sortable-dragging',
      hoverClass: false,
      debounce: 0,
      maxItems: 0,
      itemSerializer: undefined,
      containerSerializer: undefined,
      customDragImage: null
    }
  }

  serialize (method) {
    if (/serialize/.test(method)) {
      return this.sortableElements.map((sortableContainer) => {
        let opts = _data(sortableContainer, 'opts')
        return _serialize(sortableContainer, opts.itemSerializer, opts.containerSerializer)
      })
    }
  }

  createCustomPlaceholder (sortableElement) {
    if (this.options.placeholder !== null && this.options.placeholder !== undefined) {
      let tempContainer = document.createElement(sortableElement.tagName)
      tempContainer.innerHTML = this.options.placeholder
      return tempContainer.children[0]
    }
  }

  addData (sortableElement) {
    _data(sortableElement, 'items', this.options.items)
    if (this.options.acceptFrom) {
      _data(sortableElement, 'acceptFrom', this.options.acceptFrom)
    } else if (this.options.connectWith) {
      _data(sortableElement, 'connectWith', this.options.connectWith)
    }
  }

  mouseOverClass (listItems) {
    if (typeof this.options.hoverClass === 'string') {
      let hoverClasses = this.options.hoverClass.split(' ')
      // add class on hover
      _on(listItems, 'mouseenter', (e) => {
        e.target.classList.add(...hoverClasses)
      })
      // remove class on leave
      _on(listItems, 'mouseleave', (e) => {
        e.target.classList.remove(...hoverClasses)
      })
    }
  }

  dragstartEvent (e, sortableElement) {
    // ignore dragstart events
    if (_isSortable(e.target)) {
      return
    }
    e.stopImmediatePropagation()

    if ((this.options.handle && !e.target.matches(this.options.handle)) || e.target.getAttribute('draggable') === 'false') {
      return
    }
    const sortableContainer = findSortable(e.target)
    const dragItem = findDragElement(sortableContainer, e.target)

    // grab values
    originItemsBeforeUpdate = _filter(sortableContainer.children, this.options.items)
    originIndex = originItemsBeforeUpdate.indexOf(dragItem)
    originElementIndex = _index(dragItem, sortableContainer.children)
    originContainer = sortableContainer

    // add transparent clone or other ghost to cursor
    setDragImage(e, dragItem, this.options.customDragImage)
    // cache selsection & add attr for dragging
    draggingHeight = _getElementHeight(dragItem)
    dragItem.classList.add(this.options.draggingClass)
    dragging = _getDragging(dragItem, sortableElement)
    _attr(dragging, 'aria-grabbed', 'true')

    // dispatch sortstart event on each element in group
    sortableContainer.dispatchEvent(new CustomEvent('sortstart', {
      detail: {
        origin: {
          elementIndex: originElementIndex,
          index: originIndex,
          container: originContainer
        },
        item: dragging
      }
    }))
  }

  dragenterEvent (e, sortableElement) {
    if (_isSortable(e.target)) {
      return
    }
    const sortableContainer = findSortable(e.target)
    destinationItemsBeforeUpdate = _filter(sortableContainer.children, _data(sortableContainer, 'items'))
      .filter(item => item !== store(sortableElement).placeholder)
  }

  dragendEvent (e, sortableElement) {
    if (!dragging) {
      return
    }

    dragging.classList.remove(this.options.draggingClass)
    _attr(dragging, 'aria-grabbed', 'false')

    if (dragging.getAttribute('aria-copied') === 'true' && _data(dragging, 'dropped') !== 'true') {
      dragging.remove()
    }

    dragging.style.display = dragging.oldDisplay
    delete dragging.oldDisplay

    const visiblePlaceholder = Array.from(stores.values()).map(data => data.placeholder)
      .filter(placeholder => placeholder instanceof HTMLElement)
      .filter(isInDom)[0]

    if (visiblePlaceholder) {
      visiblePlaceholder.remove()
    }
    // dispatch sortstart event on each element in group
    sortableElement.dispatchEvent(new CustomEvent('sortstop', {
      detail: {
        origin: {
          elementIndex: originElementIndex,
          index: originIndex,
          container: originContainer
        },
        item: dragging
      }
    }))
    dragging = null
    draggingHeight = null
  }

  dropEvent (e, sortableElement) {
    if (!_listsConnected(sortableElement, dragging.parentElement)) {
      return
    }
    e.preventDefault()
    e.stopPropagation()

    _data(dragging, 'dropped', 'true')
    // get the one placeholder that is currently visible
    const visiblePlaceholder = Array.from(stores.values()).map((data) => {
      return data.placeholder
    })
      // filter only HTMLElements
      .filter(placeholder => placeholder instanceof HTMLElement)
      // filter only elements in DOM
      .filter(isInDom)[0]
    // attach element after placeholder
    _after(visiblePlaceholder, dragging)
    // remove placeholder from dom
    visiblePlaceholder.remove()

    /*
      * Fires Custom Event - 'sortstop'
      */
    sortableElement.dispatchEvent(new CustomEvent('sortstop', {
      detail: {
        origin: {
          elementIndex: originElementIndex,
          index: originIndex,
          container: originContainer
        },
        item: dragging
      }
    }))

    const placeholder = store(sortableElement).placeholder
    const originItems = _filter(originContainer.children, this.options.items)
      .filter(item => item !== placeholder)
    const destinationContainer = _isSortable(this) ? this : this.parentElement
    const destinationItems = _filter(destinationContainer.children, _data(destinationContainer, 'items'))
      .filter(item => item !== placeholder)
    const destinationElementIndex = _index(dragging, Array.from(dragging.parentElement.children)
      .filter(item => item !== placeholder))
    const destinationIndex = _index(dragging, destinationItems)
    /*
      * When a list item changed container lists or index within a list
      * Fires Custom Event - 'sortupdate'
      */
    if (originElementIndex !== destinationElementIndex || originContainer !== destinationContainer) {
      sortableElement.dispatchEvent(new CustomEvent('sortupdate', {
        detail: {
          origin: {
            elementIndex: originElementIndex,
            index: originIndex,
            container: originContainer,
            itemsBeforeUpdate: originItemsBeforeUpdate,
            items: originItems
          },
          destination: {
            index: destinationIndex,
            elementIndex: destinationElementIndex,
            container: destinationContainer,
            itemsBeforeUpdate: destinationItemsBeforeUpdate,
            items: destinationItems
          },
          item: dragging
        }
      }))
    }
  }

  main () {
    // get method string to see if a method is called
    const method = String(this.options)
    // merge user this.options with defaults
    this.options = Object.assign(this.defaultOptions,
      // if this.options is an object, merge it, otherwise use empty object
      (typeof this.options === 'object') ? this.options : {})
    // check if the user provided a selector instead of an element
    if (typeof this.sortableElements === 'string') {
      this.sortableElements = document.querySelectorAll(this.sortableElements)
    }
    // if the user provided an element, return it in an array to keep the return value consistant
    if (this.sortableElements instanceof HTMLElement) {
      this.sortableElements = [this.sortableElements]
    }

    this.sortableElements = Array.prototype.slice.call(this.sortableElements)

    this.serialize(method)

    this.sortableElements.forEach((sortableElement) => {
      if (/enable|disable|destroy/.test(method)) {
        return Sortable[method](sortableElement)
      }
      // init data store for sortable
      store(sortableElement).config = this.options
      // get options & set options on sortable
      this.options = _data(sortableElement, 'opts') || this.options
      _data(sortableElement, 'opts', this.options)
      // property to define as sortable
      sortableElement.isSortable = true
      // reset sortable
      _reloadSortable(sortableElement)
      // initialize
      const listItems = _filter(sortableElement.children, this.options.items)
      // create element if user defined a placeholder element as a string
      let customPlaceholder = this.createCustomPlaceholder(sortableElement)
      // add placeholder
      store(sortableElement).placeholder = _makePlaceholder(sortableElement, customPlaceholder, this.options.placeholderClass)
      // add specified data to element (items and connectWith or acceptFrom)
      this.addData(sortableElement)
      _enableSortable(sortableElement)
      // add attributes
      _attr(listItems, 'role', 'option')
      _attr(listItems, 'aria-grabbed', 'false')
      // add mouse over classes
      this.mouseOverClass(listItems)
      /*
       Handle drag events on draggable items
       Handle is set at the sortableElement level as it will bubble up
       from the item
       */
      _on(sortableElement, 'dragstart', (e) => { this.dragstartEvent(e, sortableElement) })
      /*
       We are capturing targetSortable before modifications with 'dragenter' event
      */
      _on(sortableElement, 'dragenter', (e) => { this.dragenterEvent(e, sortableElement) })
      /*
        * Dragend Event - https://developer.mozilla.org/en-US/docs/Web/Events/dragend
        * Fires each time dragEvent end, or ESC pressed
        * We are using it to clean up any draggable elements and placeholders
        */
      _on(sortableElement, 'dragend', (e) => { this.dragendEvent(e, sortableElement) })
      /*
        * Drop Event - https://developer.mozilla.org/en-US/docs/Web/Events/drop
        * Fires when valid drop target area is hit
        */
      _on(sortableElement, 'drop', (e) => { this.dropEvent(e, sortableElement) })
      const debouncedDragOverEnter = _debounce((sortableElement, element, pageY) => {
        if (!dragging) {
          return
        }
        // set placeholder height if forcePlaceholderSize option is set
        if (this.options.forcePlaceholderSize) {
          store(sortableElement).placeholder.style.height = draggingHeight + 'px'
        }
        // if element the draggedItem is dragged onto is within the array of all elements in list
        // (not only items, but also disabled, etc.)
        if (Array.from(sortableElement.children).indexOf(element) > -1) {
          const thisHeight = _getElementHeight(element)
          const placeholderIndex = _index(store(sortableElement).placeholder, element.parentElement.children)
          const thisIndex = _index(element, element.parentElement.children)
          // Check if `element` is bigger than the draggable. If it is, we have to define a dead zone to prevent flickering
          if (thisHeight > draggingHeight) {
            // Dead zone?
            const deadZone = thisHeight - draggingHeight
            const offsetTop = _offset(element).top
            if (placeholderIndex < thisIndex && pageY < offsetTop) {
              return
            }
            if (placeholderIndex > thisIndex &&
                pageY > offsetTop + thisHeight - deadZone) {
              return
            }
          }

          if (dragging.oldDisplay === undefined) {
            dragging.oldDisplay = dragging.style.display
          }

          if (dragging.style.display !== 'none') {
            dragging.style.display = 'none'
          }
          if (placeholderIndex < thisIndex) {
            _after(element, store(sortableElement).placeholder)
          } else {
            _before(element, store(sortableElement).placeholder)
          }
          // get placeholders from all stores & remove all but current one
          Array.from(stores.values())
            // remove empty values
            .filter(data => data.placeholder !== null)
            // foreach placeholder in array if outside of current sorableContainer -> remove from DOM
            .forEach((data) => {
              if (data.placeholder !== store(sortableElement).placeholder) {
                data.placeholder.remove()
              }
            })
        } else {
          // get all placeholders from store
          let placeholders = Array.from(stores.values())
            .filter((data) => data.placeholder !== null)
            .map((data) => {
              return data.placeholder
            })
          // check if element is not in placeholders
          if (placeholders.indexOf(element) === -1 && sortableElement === element && !_filter(element.children, this.options.items).length) {
            placeholders.forEach((element) => element.remove())
            element.appendChild(store(sortableElement).placeholder)
          }
        }
      }, this.options.debounce)
      // Handle dragover and dragenter events on draggable items
      const onDragOverEnter = (e) => {
        let element = e.target
        const sortableElement = _isSortable(element) ? element : findSortable(element)
        element = findDragElement(sortableElement, element)
        if (!dragging || !_listsConnected(sortableElement, dragging.parentElement) || _data(sortableElement, '_disabled') === 'true') {
          return
        }
        var options = _data(sortableElement, 'opts')
        if (parseInt(this.options.maxItems) && _filter(sortableElement.children, _data(sortableElement, 'items')).length >= parseInt(options.maxItems)) {
          return
        }
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = _isCopyActive(sortableElement) ? 'copy' : 'move'
        debouncedDragOverEnter(sortableElement, element, e.pageY)
      }

      _on(listItems.concat(sortableElement), 'dragover', onDragOverEnter)
      _on(listItems.concat(sortableElement), 'dragenter', onDragOverEnter)
    })
    return this.sortableElements
  }
}

Sortable.destroy = function (sortableElement) {
  _destroySortable(sortableElement)
}

Sortable.enable = function (sortableElement) {
  _enableSortable(sortableElement)
}

Sortable.disable = function (sortableElement) {
  _disableSortable(sortableElement)
}

/* START.TESTS_ONLY */
Sortable.__testing = {
  // add internal methods here for testing purposes
  _data: _data,
  _removeItemEvents: _removeItemEvents,
  _removeItemData: _removeItemData,
  _removeSortableData: _removeSortableData,
  _listsConnected: _listsConnected
}
/* END.TESTS_ONLY */
