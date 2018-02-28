'use strict'

import _matches from './matches'
import { addData as _data, removeData as _removeData } from './data'
import _filter from './filter'
import { addEventListener as _on, removeEventListener as _off } from './eventListener'
import { addAttribute as _attr, removeAttribute as _removeAttr } from './attribute'
import _offset from './offset'
import _debounce from './debounce'
import _index from './index'
import _detach from './removeElement'
import {makeElement as _html2element, insertBefore as _before, insertAfter as _after} from './insertHtmlElements'
/*
 * variables global to the plugin
 */
var dragging
var draggingHeight
var placeholderMap = new Map()
var startParent
var startList
var startIndex

/*
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
/*
 * Remove event handlers from sortable
 * @param {Element} sortable a single sortable
 */
var _removeSortableEvents = function (sortable) {
  _off(sortable, 'dragover')
  _off(sortable, 'dragenter')
  _off(sortable, 'drop')
}
/*
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
/*
 * Remove data from sortable
 * @param {Element} sortable a single sortable
 */
var _removeSortableData = function (sortable) {
  _removeData(sortable)
  _removeAttr(sortable, 'aria-dropeffect')
}
/*
 * Remove data from items
 * @param {Array|Element} items
 */
var _removeItemData = function (items) {
  _removeAttr(items, 'aria-grabbed')
  _removeAttr(items, 'aria-copied')
  _removeAttr(items, 'draggable')
  _removeAttr(items, 'role')
}
/*
 * Check if two lists are connected
 * @param {Element} curList
 * @param {Element} destList
 */
var _listsConnected = function (curList, destList) {
  var acceptFrom = _data(curList, 'opts').acceptFrom
  if (acceptFrom !== null) {
    return acceptFrom !== false && acceptFrom.split(',').filter(function (sel) {
      return sel.length > 0 && _matches(destList, sel)
    }).length > 0
  }
  if (curList === destList) {
    return true
  }
  if (_data(curList, 'connectWith') !== undefined) {
    return _data(curList, 'connectWith') === _data(destList, 'connectWith')
  }
  return false
}
/*
 * Is Copy Active for sortable
 * @param {Element} sortable a single sortable
 */
var _isCopyActive = function (sortable) {
  return _data(sortable, 'opts').copy === true
}
/*
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
/*
 * Destroy the sortable
 * @param {Element} sortableElement a single sortable
 */
var _destroySortable = function (sortableElement) {
  var opts = _data(sortableElement, 'opts') || {}
  var items = _filter(_getChildren(sortableElement), opts.items)
  var handles = _getHandles(items, opts.handle)
  // remove event handlers & data from sortable
  _removeSortableEvents(sortableElement)
  _removeSortableData(sortableElement)
  // remove event handlers & data from items
  _off(handles, 'mousedown')
  _removeItemEvents(items)
  _removeItemData(items)
}
/*
 * Enable the sortable
 * @param {Element} sortableElement a single sortable
 */
var _enableSortable = function (sortableElement) {
  var opts = _data(sortableElement, 'opts')
  var items = _filter(_getChildren(sortableElement), opts.items)
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
/*
 * Disable the sortable
 * @param {Element} sortableElement a single sortable
 */
var _disableSortable = function (sortableElement) {
  var opts = _data(sortableElement, 'opts')
  var items = _filter(_getChildren(sortableElement), opts.items)
  var handles = _getHandles(items, opts.handle)
  _attr(sortableElement, 'aria-dropeffect', 'none')
  _data(sortableElement, '_disabled', 'true')
  _attr(handles, 'draggable', 'false')
  _off(handles, 'mousedown')
}
/*
 * Reload the sortable
 * @param {Element} sortableElement a single sortable
 * @description events need to be removed to not be double bound
 */
var _reloadSortable = function (sortableElement) {
  var opts = _data(sortableElement, 'opts')
  var items = _filter(_getChildren(sortableElement), opts.items)
  var handles = _getHandles(items, opts.handle)
  _data(sortableElement, '_disabled', 'false')
  // remove event handlers from items
  _removeItemEvents(items)
  _off(handles, 'mousedown')
  // remove event handlers from sortable
  _removeSortableEvents(sortableElement)
}
/**
 * Whether element is in DOM
 * @param {Element} element
 * @returns {boolean}
 */
var _attached = function (element) {
  // document.body.contains(element)
  return !!element.parentNode
}
/**
 * Make native event that can be dispatched afterwards
 * @param {string} name
 * @param {object} detail
 * @returns {CustomEvent}
 */
var _makeEvent = function (name, detail) {
  var e = document.createEvent('Event')
  if (detail) {
    e.detail = detail
  }
  e.initEvent(name, false, true)
  return e
}

var _getChildren = function (element) {
  return element.children
}

var _serialize = function (list) {
  var children = _filter(_getChildren(list), _data(list, 'items'))
  return children
}

var _dragStart = function (e) {
  var sortableElement = e.target.parentElement
  var options = _data(sortableElement, 'opts')
  e.stopImmediatePropagation()
  if ((options.handle && !_matches(e.target, options.handle)) || e.target.getAttribute('draggable') === 'false') {
    return
  }

  // add transparent clone or other ghost to cursor
  _getGhost(e, e.target)
  // cache selsection & add attr for dragging
  e.target.classList.add(options.draggingClass)
  dragging = _getDragging(e.target, sortableElement)

  _attr(dragging, 'aria-grabbed', 'true')
  // grab values
  startIndex = _index(dragging)
  draggingHeight = parseInt(window.getComputedStyle(dragging).height)
  startParent = e.target.parentElement
  startList = _serialize(startParent)
  // dispatch sortstart event on each element in group
  sortableElement.dispatchEvent(_makeEvent('sortstart', {
    item: dragging,
    placeholder: placeholderMap.get(sortableElement),
    startparent: startParent
  }))
}

/*
 * Public sortable object
 * @param {Array|NodeList} sortableElements
 * @param {object|string} options|method
 */
export default function sortable (sortableElements, options) {
  var method = String(options)
  options = (function (options) {
    var result = {
      connectWith: false,
      acceptFrom: null,
      copy: false,
      placeholder: null,
      disableIEFix: false,
      placeholderClass: 'sortable-placeholder',
      draggingClass: 'sortable-dragging',
      hoverClass: false,
      debounce: 0,
      maxItems: 0
    }
    for (var option in options) {
      result[option] = options[option]
    }
    return result
  })(options)

  if (options && typeof options.getChildren === 'function') {
    _getChildren = options.getChildren
  }

  if (typeof sortableElements === 'string') {
    sortableElements = document.querySelectorAll(sortableElements)
  }

  if (sortableElements instanceof window.Element) {
    sortableElements = [sortableElements]
  }

  sortableElements = Array.prototype.slice.call(sortableElements)

  if (/serialize/.test(method)) {
    var serialized = []
    sortableElements.forEach(function (sortableElement) {
      serialized.push({
        list: sortableElement,
        children: _serialize(sortableElement)
      })
    })
    return serialized
  }

  /* TODO: maxstatements should be 25, fix and remove line below */
  /* jshint maxstatements:false */
  sortableElements.forEach(function (sortableElement) {
    if (/enable|disable|destroy/.test(method)) {
      return sortable[method](sortableElement)
    }

    // get options & set options on sortable
    options = _data(sortableElement, 'opts') || options
    _data(sortableElement, 'opts', options)
    // reset sortable
    _reloadSortable(sortableElement)
    // initialize
    var items = _filter(_getChildren(sortableElement), options.items)
    var placeholder = options.placeholder
    if (!placeholder) {
      placeholder = document.createElement(
        /^ul|ol$/i.test(sortableElement.tagName) ? 'li' : 'div'
      )
    }
    placeholder = _html2element(placeholder, sortableElement.tagName)
    placeholder.classList.add.apply(
      placeholder.classList,
      options.placeholderClass.split(' ')
    )

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
    _on(items, 'dragstart', _dragStart)

    // Handle drag events on draggable items
    _on(items, 'dragend', function (e) {
      var newParent
      if (!dragging) {
        return
      }
      var sortableElement = e.target.parentElement
      var options = _data(sortableElement, 'opts')
      // remove dragging attributes and show item
      dragging.classList.remove(options.draggingClass)
      _attr(dragging, 'aria-grabbed', 'false')

      if (dragging.getAttribute('aria-copied') === 'true' && _data(dragging, 'dropped') !== 'true') {
        _detach(dragging)
      }

      dragging.style.display = dragging.oldDisplay
      delete dragging.oldDisplay

      Array.from(placeholderMap.values()).forEach(_detach)
      newParent = e.target.parentElement

      if (_listsConnected(newParent, startParent)) {
        sortableElement.dispatchEvent(_makeEvent('sortstop', {
          item: dragging,
          startparent: startParent
        }))
        if (startIndex !== _index(dragging) || startParent !== newParent) {
          sortableElement.dispatchEvent(_makeEvent('sortupdate', {
            item: dragging,
            index: _filter(_getChildren(newParent), _data(newParent, 'items'))
              .indexOf(dragging),
            oldindex: startList.indexOf(dragging),
            elementIndex: _index(dragging),
            oldElementIndex: startIndex,
            startparent: startParent,
            endparent: newParent,
            newEndList: _serialize(newParent),
            newStartList: _serialize(startParent),
            oldStartList: startList
          }))
        }
      }
      dragging = null
      draggingHeight = null
    })
    // Handle drop event on sortable & placeholder
    // TODO: REMOVE placeholder?????
    _on([sortableElement, placeholder], 'drop', function (e) {
      if (!_listsConnected(sortableElement, dragging.parentElement)) {
        return
      }
      e.preventDefault()
      e.stopPropagation()

      _data(dragging, 'dropped', 'true')
      var visiblePlaceholder = Array.from(placeholderMap.values()).filter(_attached)[0]
      _after(visiblePlaceholder, dragging)
    })

    var debouncedDragOverEnter = _debounce((element, pageY) => {
      if (!dragging) {
        return
      }

      if (items.indexOf(element) !== -1) {
        var thisHeight = parseInt(window.getComputedStyle(element).height)
        var placeholderIndex = _index(placeholder)
        var thisIndex = _index(element)
        if (options.forcePlaceholderSize) {
          placeholder.style.height = draggingHeight + 'px'
        }

        // Check if `element` is bigger than the draggable. If it is, we have to define a dead zone to prevent flickering
        if (thisHeight > draggingHeight) {
          // Dead zone?
          var deadZone = thisHeight - draggingHeight
          var offsetTop = _offset(element).top
          if (placeholderIndex < thisIndex &&
              pageY < offsetTop + deadZone) {
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
          .forEach(_detach)
      } else {
        if (Array.from(placeholderMap.values()).indexOf(element) === -1 &&
            !_filter(_getChildren(element), options.items).length) {
          Array.from(placeholderMap.values()).forEach(_detach)
          element.appendChild(placeholder)
        }
      }
    }, options.debounce)
    // Handle dragover and dragenter events on draggable items
    var onDragOverEnter = function (e) {
      if (!dragging || !_listsConnected(sortableElement, dragging.parentElement) || _data(sortableElement, '_disabled') === 'true') {
        return
      }
      var options = _data(sortableElement, 'opts')
      if (parseInt(options.maxItems) && _filter(_getChildren(sortableElement), _data(sortableElement, 'items')).length >= parseInt(options.maxItems)) {
        return
      }
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer.dropEffect = _isCopyActive(sortableElement) ? 'copy' : 'move'
      debouncedDragOverEnter(this, e.pageY)
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
  _attached: _attached,
  _data: _data,
  _serialize: _serialize,
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
  _makeEvent: _makeEvent,
  _getPlaceholders: () => placeholderMap,
  _resetPlaceholders: () => {
    placeholderMap.clear()
  }
}
/* END.TESTS_ONLY */
