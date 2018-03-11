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
import {insertBefore as _before, insertAfter as _after} from './insertHtmlElements'
import _serialize from './serialize'
import _makePlaceholder from './makePlaceholder'
import _getElementHeight from './elementHeight'

/*
 * variables global to the plugin
 */
var dragging
var draggingHeight
var placeholderMap = new Map()
let startParent
/**
 * remove event handlers from items
 * @param {Array|NodeList} items
 */
var _removeItemEvents = function (items) {
  _off(items, 'dragstart')
  _off(items, 'dragend')
  _off(items, 'selectstart')
  _off(items, 'dragover')
  _off(items, 'dragenter')
  _off(items, 'drop')
  _off(items, 'mouseenter')
  _off(items, 'mouseleave')
}
/**
 * Remove event handlers from sortable
 * @param {Element} sortable a single sortable
 */
var _removeSortableEvents = function (sortable) {
  _off(sortable, 'dragover')
  _off(sortable, 'dragenter')
  _off(sortable, 'drop')
}
/**
 * Attach ghost to dataTransfer object
 * @param {Event} original event
 * @param {object} ghost-object with item, x and y coordinates
 */
var _attachGhost = function (event, ghost) {
  // this needs to be set for HTML5 drag & drop to work
  event.dataTransfer.effectAllowed = 'copyMove'
  // Firefox requires some arbitrary content in the data in order for
  // the drag & drop functionality to work
  event.dataTransfer.setData('text', 'arbitrary-content')

  // check if setDragImage method is available
  if (event.dataTransfer.setDragImage) {
    event.dataTransfer.setDragImage(ghost.draggedItem, ghost.x, ghost.y)
  }
}
/**
 * _addGhostPos clones the dragged item and adds it as a Ghost item
 * @param {Event} event - the event fired when dragstart is triggered
 * @param {object} ghost - .draggedItem = Element
 */
var _addGhostPos = function (event, ghost) {
  if (!ghost.x) {
    ghost.x = parseInt(event.pageX - _offset(ghost.draggedItem).left)
  }
  if (!ghost.y) {
    ghost.y = parseInt(event.pageY - _offset(ghost.draggedItem).top)
  }
  return ghost
}
/**
 * _makeGhost decides which way to make a ghost and passes it to attachGhost
 * @param {Element} draggedItem - the item that the user drags
 */
var _makeGhost = function (draggedItem) {
  return {
    draggedItem: draggedItem
  }
}
/**
 * _getGhost constructs ghost and attaches it to dataTransfer
 * @param {Event} event - the original drag event object
 * @param {Element} draggedItem - the item that the user drags
 */
// TODO: could draggedItem be replaced by event.target in all instances
var _getGhost = function (event, draggedItem) {
  // add ghost item & draggedItem to ghost object
  var ghost = _makeGhost(draggedItem)
  // attach ghost position
  ghost = _addGhostPos(event, ghost)
  // attach ghost to dataTransfer
  _attachGhost(event, ghost)
}
/**
 * _getDragging returns the current element to drag or
 * a copy of the element.
 * Is Copy Active for sortable
 * @param {Element} draggedItem - the item that the user drags
 * @param {Element} sortable a single sortable
 */
var _getDragging = function (draggedItem, sortable) {
  var ditem = draggedItem
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
 * @param {Element} sortable a single sortable
 */
var _removeSortableData = function (sortable) {
  _removeData(sortable)
  _removeAttr(sortable, 'aria-dropeffect')
}
/**
 * Remove data from items
 * @param {Array|Element} items
 */
var _removeItemData = function (items) {
  _removeAttr(items, 'aria-grabbed')
  _removeAttr(items, 'aria-copied')
  _removeAttr(items, 'draggable')
  _removeAttr(items, 'role')
}
/**
 * Check if two lists are connected
 * @param {Element} curList
 * @param {Element} destList
 */
var _listsConnected = function (curList, destList) {
  if (_isSortable(curList)) {
    var acceptFrom = _data(curList, 'opts').acceptFrom
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
 * @param {Element} sortable a single sortable
 */
var _isCopyActive = function (sortable) {
  return _data(sortable, 'opts').copy === true
}
/**
 * get handle or return item
 * @param {Array} items
 * @param {selector} handle
 */
var _getHandles = function (items, handle) {
  var result = []
  var handles
  if (!handle) {
    return items
  }
  for (var i = 0; i < items.length; ++i) {
    handles = items[i].querySelectorAll(handle)
    result = result.concat(Array.prototype.slice.call(handles))
  }
  return result
}
/**
 * Is {Element} a sortable.
 * @param {Element} sortable a single sortable
 */
function _isSortable (element) {
  return element !== undefined && element != null && _data(element, 'opts') !== undefined
}
/**
 * find sortable from element. travels up parent element until found or null.
 * @param {Element} sortable a single sortable
 */
function findSortable (element) {
  while ((element = element.parentElement) && !_isSortable(element));
  return element
}
/**
 * Dragging event is on the sortable element. finds the top child that
 * contains the element.
 * @param {Element} sortable a single sortable
 * @param {Element} element is that being dragged
 */
function findDragElement (sortableElement, element) {
  var options = _data(sortableElement, 'opts')
  var items = _filter(sortableElement.children, options.items)
  var itemlist = items.filter(function (ele) {
    return ele.contains(element)
  })

  return itemlist.length > 0 ? itemlist[0] : element
}
/**
 * Destroy the sortable
 * @param {Element} sortableElement a single sortable
 */
var _destroySortable = function (sortableElement) {
  var opts = _data(sortableElement, 'opts') || {}
  var items = _filter(sortableElement.children, opts.items)
  var handles = _getHandles(items, opts.handle)
  // remove event handlers & data from sortable
  _removeSortableEvents(sortableElement)
  _removeSortableData(sortableElement)
  // remove event handlers & data from items
  _off(handles, 'mousedown')
  _removeItemEvents(items)
  _removeItemData(items)
}
/**
 * Enable the sortable
 * @param {Element} sortableElement a single sortable
 */
var _enableSortable = function (sortableElement) {
  var opts = _data(sortableElement, 'opts')
  var items = _filter(sortableElement.children, opts.items)
  var handles = _getHandles(items, opts.handle)
  _attr(sortableElement, 'aria-dropeffect', 'move')
  _data(sortableElement, '_disabled', 'false')
  _attr(handles, 'draggable', 'true')
  // IE FIX for ghost
  // can be disabled as it has the side effect that other events
  // (e.g. click) will be ignored
  var spanEl = (document || window.document).createElement('span')
  if (typeof spanEl.dragDrop === 'function' && !opts.disableIEFix) {
    _on(handles, 'mousedown', function () {
      if (items.indexOf(this) !== -1) {
        this.dragDrop()
      } else {
        var parent = this.parentElement
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
 * @param {Element} sortableElement a single sortable
 */
var _disableSortable = function (sortableElement) {
  var opts = _data(sortableElement, 'opts')
  var items = _filter(sortableElement.children, opts.items)
  var handles = _getHandles(items, opts.handle)
  _attr(sortableElement, 'aria-dropeffect', 'none')
  _data(sortableElement, '_disabled', 'true')
  _attr(handles, 'draggable', 'false')
  _off(handles, 'mousedown')
}
/**
 * Reload the sortable
 * @param {Element} sortableElement a single sortable
 * @description events need to be removed to not be double bound
 */
var _reloadSortable = function (sortableElement) {
  var opts = _data(sortableElement, 'opts')
  var items = _filter(sortableElement.children, opts.items)
  var handles = _getHandles(items, opts.handle)
  _data(sortableElement, '_disabled', 'false')
  // remove event handlers from items
  _removeItemEvents(items)
  _off(handles, 'mousedown')
  // remove event handlers from sortable
  _removeSortableEvents(sortableElement)
}

/**
 * Public sortable object
 * @param {Array|NodeList} sortableElements
 * @param {object|string} options|method
 */
export default function sortable (sortableElements, options: object|string|undefined) {
  // get method string to see if a method is called
  var method = String(options)
  // merge user options with defaults
  options = Object.assign({
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
    containerSerializer: undefined
    // if options is an object, merge it, otherwise use empty object
  }, (typeof options === 'object') ? options : {})
  // check if the user provided a selector instead of an element
  if (typeof sortableElements === 'string') {
    sortableElements = document.querySelectorAll(sortableElements)
  }
  // if the user provided an element, return it in an array to keep the return value consistant
  if (sortableElements instanceof Element) {
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

    // get options & set options on sortable
    options = _data(sortableElement, 'opts') || options
    _data(sortableElement, 'opts', options)
    // property to define as sortable
    sortableElement.isSortable = true
    // reset sortable
    _reloadSortable(sortableElement)
    // initialize
    var items = _filter(sortableElement.children, options.items)
    var index
    var startList
    // create element if user defined a placeholder element as a string
    let customPlaceholder
    if (options.placeholder !== null && options.placeholder !== undefined) {
      let tempContainer = document.createElement(sortableElement.tagName)
      tempContainer.innerHTML = options.placeholder
      customPlaceholder = tempContainer.children[0]
    }
    let placeholder = _makePlaceholder(sortableElement, customPlaceholder, options.placeholderClass)

    _data(sortableElement, 'items', options.items)
    placeholderMap.set(sortableElement, placeholder)
    if (options.acceptFrom) {
      _data(sortableElement, 'acceptFrom', options.acceptFrom)
    } else if (options.connectWith) {
      _data(sortableElement, 'connectWith', options.connectWith)
    }

    _enableSortable(sortableElement)
    _attr(items, 'role', 'option')
    _attr(items, 'aria-grabbed', 'false')

    // Mouse over class
    if (typeof options.hoverClass === 'string') {
      let hoverClasses = options.hoverClass.split(' ')
      // add class on hover
      _on(items, 'mouseenter', function (e) {
        e.target.classList.add(...hoverClasses)
      })
      // remove class on leave
      _on(items, 'mouseleave', function (e) {
        e.target.classList.remove(...hoverClasses)
      })
    }

    // Handle drag events on draggable items
    // Handle set at sortableelement level as it will bubble up
    // from the item
    _on(sortableElement, 'dragstart', function (e) {
      // ignore dragstart events
      if (_isSortable(e.target)) {
        return
      }
      e.stopImmediatePropagation()

      if ((options.handle && !e.target.matches(options.handle)) || e.target.getAttribute('draggable') === 'false') {
        return
      }

      var sortableElement = findSortable(e.target)
      var dragitem = findDragElement(sortableElement, e.target)
      // add transparent clone or other ghost to cursor
      _getGhost(e, dragitem)
      // cache selsection & add attr for dragging
      draggingHeight = _getElementHeight(dragitem)
      dragitem.classList.add(options.draggingClass)
      dragging = _getDragging(dragitem, sortableElement)
      _attr(dragging, 'aria-grabbed', 'true')
      // grab values
      index = _index(dragging, dragging.parentElement.children)
      startParent = findSortable(e.target)
      startList = _serialize(startParent)
      // dispatch sortstart event on each element in group

      sortableElement.dispatchEvent(new CustomEvent('sortstart', {
        detail: {
          item: dragging,
          placeholder: placeholderMap.get(sortableElement),
          startparent: startParent
        }
      }))
    })
    // Handle drag events on draggable items
    _on(sortableElement, 'dragend', function (e) {
      var newParent
      if (!dragging) {
        return
      }
      var sortableElement = findSortable(e.target)
      // remove dragging attributes and show item
      dragging.classList.remove(options.draggingClass)
      _attr(dragging, 'aria-grabbed', 'false')

      if (dragging.getAttribute('aria-copied') === 'true' && _data(dragging, 'dropped') !== 'true') {
        dragging.remove()
      }

      dragging.style.display = dragging.oldDisplay
      delete dragging.oldDisplay

      placeholderMap.forEach((element) => element.remove())
      newParent = this.parentElement

      if (_listsConnected(newParent, startParent)) {
        sortableElement.dispatchEvent(new CustomEvent('sortstop', {
          detail: {
            item: dragging,
            startparent: startParent
          }
        }))
        if (index !== _index(dragging, dragging.parentElement.children) || startParent !== newParent) {
          sortableElement.dispatchEvent(new CustomEvent('sortupdate', {
            detail: {
              item: dragging,
              index: _filter(newParent.children, _data(newParent, 'items'))
                .indexOf(dragging),
              oldindex: items.indexOf(dragging),
              elementIndex: _index(dragging, dragging.parentElement.children),
              oldElementIndex: index,
              startparent: startParent,
              endparent: newParent,
              newEndList: _serialize(newParent),
              newStartList: _serialize(startParent),
              oldStartList: startList
            }
          }))
        }
      }
      dragging = null
      draggingHeight = null
    })
    // Handle drop event on sortable & placeholder
    _on(sortableElement, 'drop', function (e) {
      if (!_listsConnected(sortableElement, dragging.parentElement)) {
        return
      }
      e.preventDefault()
      e.stopPropagation()

      _data(dragging, 'dropped', 'true')
      var visiblePlaceholder = Array.from(placeholderMap.values()).filter(isInDom)[0]
      _after(visiblePlaceholder, dragging)
      // fire sortstop
      sortableElement.dispatchEvent(new CustomEvent('sortstop', {
        detail: {
          item: dragging,
          startparent: startParent
        }
      }))

      let newParent = _isSortable(this) ? this : this.parentElement
      // fire sortupdate if index or parent changed
      if (index !== _index(dragging, dragging.parentElement.children) || startParent !== newParent) {
        sortableElement.dispatchEvent(new CustomEvent('sortupdate', {
          detail: {
            item: dragging,
            index: _index(dragging, _filter(newParent.children, _data(newParent, 'items'))),
            oldindex: items.indexOf(dragging),
            elementIndex: _index(dragging, dragging.parentElement.children),
            oldElementIndex: index,
            startparent: startParent,
            endparent: newParent,
            newEndList: _serialize(newParent),
            newStartList: _serialize(startParent),
            oldStartList: startList
          }
        }))
      }
    })

    var debouncedDragOverEnter = _debounce((sortableElement, element, pageY) => {
      if (!dragging) {
        return
      }

      var placeholder = placeholderMap.get(sortableElement)
      // set placeholder height if forcePlaceholderSize option is set
      if (options.forcePlaceholderSize) {
        placeholder.style.height = draggingHeight + 'px'
      }
      // if element the draggedItem is dragged onto is within the array of all elements in list
      // (not only items, but also disabled, etc.)
      if (Array.from(sortableElement.children).indexOf(element) > -1) {
        let thisHeight = _getElementHeight(element)
        var placeholderIndex = _index(placeholder, element.parentElement.children)
        var thisIndex = _index(element, element.parentElement.children)
        // Check if `element` is bigger than the draggable. If it is, we have to define a dead zone to prevent flickering
        if (thisHeight > draggingHeight) {
          // Dead zone?
          var deadZone = thisHeight - draggingHeight
          var offsetTop = _offset(element).top
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
          _after(element, placeholder)
        } else {
          _before(element, placeholder)
        }
        // Intentionally violated chaining, it is more complex otherwise
        Array.from(placeholderMap.values())
          .filter(function (element) { return element !== placeholder })
          .forEach((element) => element.remove())
      } else {
        if (Array.from(placeholderMap.values()).indexOf(element) === -1 &&
            sortableElement === element &&
            !_filter(element.children, options.items).length) {
          placeholderMap.forEach((element) => element.remove())
          element.appendChild(placeholder)
        }
      }
    }, options.debounce)
    // Handle dragover and dragenter events on draggable items
    var onDragOverEnter = function (e) {
      var element = e.target
      var sortableElement = _isSortable(element) ? element : findSortable(element)
      element = findDragElement(sortableElement, element)
      if (!dragging || !_listsConnected(sortableElement, dragging.parentElement) || _data(sortableElement, '_disabled') === 'true') {
        return
      }
      var options = _data(sortableElement, 'opts')
      if (parseInt(options.maxItems) && _filter(sortableElement.children, _data(sortableElement, 'items')).length >= parseInt(options.maxItems)) {
        return
      }
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer.dropEffect = _isCopyActive(sortableElement) ? 'copy' : 'move'
      debouncedDragOverEnter(sortableElement, element, e.pageY)
    }

    _on(items.concat(sortableElement), 'dragover', onDragOverEnter)
    _on(items.concat(sortableElement), 'dragenter', onDragOverEnter)
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
  _removeSortableEvents: _removeSortableEvents,
  _removeItemEvents: _removeItemEvents,
  _removeItemData: _removeItemData,
  _removeSortableData: _removeSortableData,
  _listsConnected: _listsConnected,
  _attachGhost: _attachGhost,
  _addGhostPos: _addGhostPos,
  _getGhost: _getGhost,
  _getHandles: _getHandles,
  _makeGhost: _makeGhost,
  _index: _index,
  _getPlaceholders: () => placeholderMap,
  _resetPlaceholders: () => {
    placeholderMap.clear()
  }
}
/* END.TESTS_ONLY */
