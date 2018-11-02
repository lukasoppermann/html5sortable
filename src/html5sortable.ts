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
import { default as store, stores } from './store' /* eslint-disable-line */
import _listsConnected from './isConnected'
import defaultConfiguration from './defaultConfiguration'
import enableHoverClass from './hoverClass'
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
  if (store(sortable).getConfig('copy') === true) {
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
 * find sortable from element. travels up parent element until found or null.
 * @param {HTMLElement} element a single sortable
 */
function findSortable (element) {
  while (element.isSortable !== true) {
    element = element.parentElement
  }
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
  // @todo: remove this fix
  // IE FIX for ghost
  // can be disabled as it has the side effect that other events
  // (e.g. click) will be ignored
  if (opts.disableIEFix === false) {
    const spanEl = (document || window.document).createElement('span')
    if (typeof spanEl.dragDrop === 'function') {
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
export default function sortable (sortableElements, options: object|string|undefined): sortable {
  // get method string to see if a method is called
  const method = String(options)
  options = options || {}
  // check if the user provided a selector instead of an element
  if (typeof sortableElements === 'string') {
    sortableElements = document.querySelectorAll(sortableElements)
  }
  // if the user provided an element, return it in an array to keep the return value consistant
  if (sortableElements instanceof HTMLElement) {
    sortableElements = [sortableElements]
  }

  sortableElements = Array.prototype.slice.call(sortableElements)

  if (/serialize/.test(method)) {
    return sortableElements.map((sortableContainer) => {
      let opts = _data(sortableContainer, 'opts')
      return _serialize(sortableContainer, opts.itemSerializer, opts.containerSerializer)
    })
  }

  sortableElements.forEach(function (sortableElement) {
    if (/enable|disable|destroy/.test(method)) {
      return sortable[method](sortableElement)
    }
    // log deprecation
    ['connectWith', 'disableIEFix'].forEach((configKey) => {
      if (options.hasOwnProperty(configKey) && options[configKey] !== null) {
        console.warn(`HTML5Sortable: You are using the deprecated configuration "${configKey}". This will be removed in an upcoming version, make sure to migrate to the new options when updating.`)
      }
    })
    // merge options with default options
    options = Object.assign({}, defaultConfiguration, store(sortableElement).config, options)
    // init data store for sortable
    store(sortableElement).config = options
    // set options on sortable
    _data(sortableElement, 'opts', options)
    // property to define as sortable
    sortableElement.isSortable = true
    // reset sortable
    _reloadSortable(sortableElement)
    // initialize
    const listItems = _filter(sortableElement.children, options.items)
    // create element if user defined a placeholder element as a string
    let customPlaceholder
    if (options.placeholder !== null && options.placeholder !== undefined) {
      let tempContainer = document.createElement(sortableElement.tagName)
      tempContainer.innerHTML = options.placeholder
      customPlaceholder = tempContainer.children[0]
    }
    // add placeholder
    store(sortableElement).placeholder = _makePlaceholder(sortableElement, customPlaceholder, options.placeholderClass)

    _data(sortableElement, 'items', options.items)

    if (options.acceptFrom) {
      _data(sortableElement, 'acceptFrom', options.acceptFrom)
    } else if (options.connectWith) {
      _data(sortableElement, 'connectWith', options.connectWith)
    }

    _enableSortable(sortableElement)
    _attr(listItems, 'role', 'option')
    _attr(listItems, 'aria-grabbed', 'false')
    // enable hover class
    enableHoverClass(sortableElement, true)
    /*
     Handle drag events on draggable items
     Handle is set at the sortableElement level as it will bubble up
     from the item
     */
    _on(sortableElement, 'dragstart', function (e) {
      // ignore dragstart events
      if (e.target.isSortable === true) {
        return
      }
      e.stopImmediatePropagation()

      if ((options.handle && !e.target.matches(options.handle)) || e.target.getAttribute('draggable') === 'false') {
        return
      }

      const sortableContainer = findSortable(e.target)
      const dragItem = findDragElement(sortableContainer, e.target)

      // grab values
      originItemsBeforeUpdate = _filter(sortableContainer.children, options.items)
      originIndex = originItemsBeforeUpdate.indexOf(dragItem)
      originElementIndex = _index(dragItem, sortableContainer.children)
      originContainer = sortableContainer

      // add transparent clone or other ghost to cursor
      setDragImage(e, dragItem, options.customDragImage)
      // cache selsection & add attr for dragging
      draggingHeight = _getElementHeight(dragItem)
      dragItem.classList.add(options.draggingClass)
      dragging = _getDragging(dragItem, sortableContainer)
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
    })

    /*
     We are capturing targetSortable before modifications with 'dragenter' event
    */
    _on(sortableElement, 'dragenter', (e) => {
      if (e.target.isSortable === true) {
        return
      }
      const sortableContainer = findSortable(e.target)
      destinationItemsBeforeUpdate = _filter(sortableContainer.children, _data(sortableContainer, 'items'))
        .filter(item => item !== store(sortableElement).placeholder)
    })
    /*
     * Dragend Event - https://developer.mozilla.org/en-US/docs/Web/Events/dragend
     * Fires each time dragEvent end, or ESC pressed
     * We are using it to clean up any draggable elements and placeholders
     */
    _on(sortableElement, 'dragend', function (e) {
      if (!dragging) {
        return
      }

      dragging.classList.remove(options.draggingClass)
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
    })

    /*
     * Drop Event - https://developer.mozilla.org/en-US/docs/Web/Events/drop
     * Fires when valid drop target area is hit
     */
    _on(sortableElement, 'drop', function (e) {
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
      const originItems = _filter(originContainer.children, options.items)
        .filter(item => item !== placeholder)
      const destinationContainer = this.isSortable === true ? this : this.parentElement
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
    })

    const debouncedDragOverEnter = _debounce((sortableElement, element, pageY) => {
      if (!dragging) {
        return
      }

      // set placeholder height if forcePlaceholderSize option is set
      if (options.forcePlaceholderSize) {
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
        // To avoid flicker, determine where to position the placeholder
        // based on where the mouse pointer is relative to the elements
        // vertical center.
        let placeAfter = false
        try {
          let elementMiddle = _offset(element).top + element.offsetHeight / 2
          placeAfter = pageY >= elementMiddle
        } catch (e) {
          placeAfter = placeholderIndex < thisIndex
        }

        if (placeAfter) {
          _after(element, store(sortableElement).placeholder)
        } else {
          _before(element, store(sortableElement).placeholder)
        }
        // get placeholders from all stores & remove all but current one
        Array.from(stores.values())
          // remove empty values
          .filter(data => data.placeholder !== undefined)
          // foreach placeholder in array if outside of current sorableContainer -> remove from DOM
          .forEach((data) => {
            if (data.placeholder !== store(sortableElement).placeholder) {
              data.placeholder.remove()
            }
          })
      } else {
        // get all placeholders from store
        let placeholders = Array.from(stores.values())
          .filter((data) => data.placeholder !== undefined)
          .map((data) => {
            return data.placeholder
          })
        // check if element is not in placeholders
        if (placeholders.indexOf(element) === -1 && sortableElement === element && !_filter(element.children, options.items).length) {
          placeholders.forEach((element) => element.remove())
          element.appendChild(store(sortableElement).placeholder)
        }
      }
    }, options.debounce)
    // Handle dragover and dragenter events on draggable items
    const onDragOverEnter = function (e) {
      let element = e.target
      const sortableElement = element.isSortable === true ? element : findSortable(element)
      element = findDragElement(sortableElement, element)
      if (!dragging || !_listsConnected(sortableElement, dragging.parentElement) || _data(sortableElement, '_disabled') === 'true') {
        return
      }
      const options = _data(sortableElement, 'opts')
      if (parseInt(options.maxItems) && _filter(sortableElement.children, _data(sortableElement, 'items')).length >= parseInt(options.maxItems) && dragging.parentElement !== sortableElement) {
        return
      }
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer.dropEffect = store(sortableElement).getConfig('copy') === true ? 'copy' : 'move'
      debouncedDragOverEnter(sortableElement, element, e.pageY)
    }

    _on(listItems.concat(sortableElement), 'dragover', onDragOverEnter)
    _on(listItems.concat(sortableElement), 'dragenter', onDragOverEnter)
  })

  return sortableElements
}

sortable.destroy = function (sortableElement) {
  _destroySortable(sortableElement)
}

sortable.enable = function (sortableElement) {
  _enableSortable(sortableElement)
}

sortable.disable = function (sortableElement) {
  _disableSortable(sortableElement)
}

/* START.TESTS_ONLY */
sortable.__testing = {
  // add internal methods here for testing purposes
  _data: _data,
  _removeItemEvents: _removeItemEvents,
  _removeItemData: _removeItemData,
  _removeSortableData: _removeSortableData
}
/* END.TESTS_ONLY */
