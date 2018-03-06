/*
 * HTML5Sortable package
 * https://github.com/lukasoppermann/html5sortable
 *
 * Maintained by Lukas Oppermann <lukas@vea.re>
 *
 * Released under the MIT license.
 */
var sortable = (function () {
'use strict';

/**
 * Get or set data on element
 * @param {Element} element
 * @param {string} key
 * @param {*} value
 * @return {*}
 */
function addData(element, key, value) {
    if (value === undefined) {
        return element && element.h5s && element.h5s.data && element.h5s.data[key];
    }
    else {
        element.h5s = element.h5s || {};
        element.h5s.data = element.h5s.data || {};
        element.h5s.data[key] = value;
    }
}
/**
 * Remove data from element
 * @param {Element} element
 */
function removeData(element) {
    if (element.h5s) {
        delete element.h5s.data;
    }
}

function _filter (nodes, selector) {
    if (!(nodes instanceof NodeList || nodes instanceof HTMLCollection)) {
        throw new Error('You must provide a nodeList/HTMLCollection of elements to be filtered.');
    }
    if (typeof selector !== 'string') {
        return Array.from(nodes);
    }
    return Array.from(nodes).filter(function (item) { return item.nodeType === 1 && item.matches(selector); });
}

/**
 * @param {Array|Element} element
 * @param {Array|string} event
 * @param {Function} callback
 */
function addEventListener(element, event, callback) {
    if (element instanceof Array) {
        for (var i = 0; i < element.length; ++i) {
            addEventListener(element[i], event, callback);
        }
        return;
    }
    element.addEventListener(event, callback);
    element.h5s = element.h5s || {};
    element.h5s.events = element.h5s.events || {};
    element.h5s.events[event] = callback;
}
/**
 * @param {Array|Element} element
 * @param {Array|string} event
 */
function removeEventListener(element, event) {
    if (element instanceof Array) {
        for (var i = 0; i < element.length; ++i) {
            removeEventListener(element[i], event);
        }
        return;
    }
    if (element.h5s && element.h5s.events && element.h5s.events[event]) {
        element.removeEventListener(event, element.h5s.events[event]);
        delete element.h5s.events[event];
    }
}

/**
 * @param {Array|Element} element
 * @param {string} attribute
 * @param {*} value
 */
function addAttribute(element, attribute, value) {
    if (element instanceof Array) {
        for (var i = 0; i < element.length; ++i) {
            addAttribute(element[i], attribute, value);
        }
        return;
    }
    element.setAttribute(attribute, value);
}
/**
 * @param {Array|Element} element
 * @param {string} attribute
 */
function removeAttribute(element, attribute) {
    if (element instanceof Array) {
        for (var i = 0; i < element.length; ++i) {
            removeAttribute(element[i], attribute);
        }
        return;
    }
    element.removeAttribute(attribute);
}

function _offset (element) {
    if (!element.parentElement) {
        throw new Error('target element must be part of the dom');
    }
    var rect = element.getClientRects()[0];
    return {
        left: rect.left + window.scrollX,
        right: rect.right + window.scrollX,
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY
    };
}

function _debounce (func, wait) {
    if (wait === void 0) { wait = 0; }
    var timeout;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            func.apply(void 0, args);
        }, wait);
    };
}

function _index (element) {
    if (!element.parentElement) {
        return -1;
    }
    return Array.prototype.indexOf.call(element.parentElement.children, element);
}

function isInDom (element) {
    if (!element || element.nodeType !== 1) {
        throw new Error('Element is not a node element.');
    }
    return element.parentNode !== null;
}

/**
 * Insert node before or after target
 * @param {Element} referenceNode - reference element
 * @param {Element} newElement - element to be inserted
 * @param {String} position - insert before or after reference element
 */
var insertNode = function (referenceNode, newElement, position) {
    if (position === void 0) { position = 'before'; }
    if ((referenceNode || {}).nodeType !== 1 || !referenceNode.parentElement || (newElement || {}).nodeType !== 1) {
        throw new Error('target and element must be a node');
    }
    referenceNode.parentElement.insertBefore(newElement, (position === 'before' ? referenceNode : referenceNode.nextElementSibling));
};
/**
 * Insert before target
 * @param {Element} target
 * @param {Element} element
 */
var insertBefore = function (target, element) { return insertNode(target, element, 'before'); };
/**
 * Insert after target
 * @param {Element} target
 * @param {Element} element
 */
var insertAfter = function (target, element) { return insertNode(target, element, 'after'); };

/*
 * variables global to the plugin
 */
var dragging;
var draggingHeight;
var placeholderMap = new Map();
/*
 * remove event handlers from items
 * @param {Array|NodeList} items
 */
var _removeItemEvents = function (items) {
    removeEventListener(items, 'dragstart');
    removeEventListener(items, 'dragend');
    removeEventListener(items, 'selectstart');
    removeEventListener(items, 'dragover');
    removeEventListener(items, 'dragenter');
    removeEventListener(items, 'drop');
    removeEventListener(items, 'mouseenter');
    removeEventListener(items, 'mouseleave');
};
/*
 * Remove event handlers from sortable
 * @param {Element} sortable a single sortable
 */
var _removeSortableEvents = function (sortable) {
    removeEventListener(sortable, 'dragover');
    removeEventListener(sortable, 'dragenter');
    removeEventListener(sortable, 'drop');
};
/*
 * Attach ghost to dataTransfer object
 * @param {Event} original event
 * @param {object} ghost-object with item, x and y coordinates
 */
var _makePlaceholder = function (sortableElement, placeholder, placeholderClasses) {
    if (placeholder === void 0) { placeholder = undefined; }
    if (placeholderClasses === void 0) { placeholderClasses = 'sortable-placeholder'; }
    if (typeof placeholder === 'string') {
        var tempContainer = document.createElement(sortableElement.tagName);
        tempContainer.innerHTML = placeholder;
        placeholder = tempContainer.children[0];
    }
    else {
        switch (sortableElement.tagName) {
            case 'UL':
                placeholder = 'li';
                break;
            case 'OL':
                placeholder = 'li';
                break;
            case 'TABLE':
                placeholder = 'tr';
                break;
            case 'TBODY':
                placeholder = 'tr';
                break;
            default:
                placeholder = 'div';
        }
        placeholder = document.createElement(placeholder);
    }
    // add classes to placeholder
    (_a = placeholder.classList).add.apply(_a, placeholderClasses.split(' '));
    return placeholder;
    var _a;
};
/*
 * Attach ghost to dataTransfer object
 * @param {Event} original event
 * @param {object} ghost-object with item, x and y coordinates
 */
var _attachGhost = function (event, ghost) {
    // this needs to be set for HTML5 drag & drop to work
    event.dataTransfer.effectAllowed = 'copyMove';
    // Firefox requires some arbitrary content in the data in order for
    // the drag & drop functionality to work
    event.dataTransfer.setData('text', 'arbitrary-content');
    // check if setDragImage method is available
    if (event.dataTransfer.setDragImage) {
        event.dataTransfer.setDragImage(ghost.draggedItem, ghost.x, ghost.y);
    }
};
/**
 * _addGhostPos clones the dragged item and adds it as a Ghost item
 * @param {Event} event - the event fired when dragstart is triggered
 * @param {object} ghost - .draggedItem = Element
 */
var _addGhostPos = function (event, ghost) {
    if (!ghost.x) {
        ghost.x = parseInt(event.pageX - _offset(ghost.draggedItem).left);
    }
    if (!ghost.y) {
        ghost.y = parseInt(event.pageY - _offset(ghost.draggedItem).top);
    }
    return ghost;
};
/**
 * _makeGhost decides which way to make a ghost and passes it to attachGhost
 * @param {Element} draggedItem - the item that the user drags
 */
var _makeGhost = function (draggedItem) {
    return {
        draggedItem: draggedItem
    };
};
/**
 * _getGhost constructs ghost and attaches it to dataTransfer
 * @param {Event} event - the original drag event object
 * @param {Element} draggedItem - the item that the user drags
 */
// TODO: could draggedItem be replaced by event.target in all instances
var _getGhost = function (event, draggedItem) {
    // add ghost item & draggedItem to ghost object
    var ghost = _makeGhost(draggedItem);
    // attach ghost position
    ghost = _addGhostPos(event, ghost);
    // attach ghost to dataTransfer
    _attachGhost(event, ghost);
};
/**
 * _getDragging returns the current element to drag or
 * a copy of the element.
 * Is Copy Active for sortable
 * @param {Element} draggedItem - the item that the user drags
 * @param {Element} sortable a single sortable
 */
var _getDragging = function (draggedItem, sortable) {
    var ditem = draggedItem;
    if (_isCopyActive(sortable)) {
        ditem = draggedItem.cloneNode(true);
        addAttribute(ditem, 'aria-copied', 'true');
        draggedItem.parentElement.appendChild(ditem);
        ditem.style.display = 'none';
        ditem.oldDisplay = draggedItem.style.display;
    }
    return ditem;
};
/*
 * Remove data from sortable
 * @param {Element} sortable a single sortable
 */
var _removeSortableData = function (sortable) {
    removeData(sortable);
    removeAttribute(sortable, 'aria-dropeffect');
};
/*
 * Remove data from items
 * @param {Array|Element} items
 */
var _removeItemData = function (items) {
    removeAttribute(items, 'aria-grabbed');
    removeAttribute(items, 'aria-copied');
    removeAttribute(items, 'draggable');
    removeAttribute(items, 'role');
};
/*
 * Check if two lists are connected
 * @param {Element} curList
 * @param {Element} destList
 */
var _listsConnected = function (curList, destList) {
    if (_isSortable(curList)) {
        var acceptFrom = addData(curList, 'opts').acceptFrom;
        if (acceptFrom !== null) {
            return acceptFrom !== false && acceptFrom.split(',').filter(function (sel) {
                return sel.length > 0 && destList.matches(sel);
            }).length > 0;
        }
        if (curList === destList) {
            return true;
        }
        if (addData(curList, 'connectWith') !== undefined) {
            return addData(curList, 'connectWith') === addData(destList, 'connectWith');
        }
    }
    return false;
};
/*
 * Is Copy Active for sortable
 * @param {Element} sortable a single sortable
 */
var _isCopyActive = function (sortable) {
    return addData(sortable, 'opts').copy === true;
};
/*
 * Get height of an element including padding
 * @param {Element} sortable a single sortable
 */
var _getElementHeight = function (element) {
    // get calculated style of element
    var style = window.getComputedStyle(element);
    // pick applicable properties, convert to int and reduce by adding
    return ['height', 'padding-top', 'padding-bottom']
        .map(function (key) {
        var int = parseInt(style.getPropertyValue(key), 10);
        return isNaN(int) ? 0 : int;
    })
        .reduce(function (prev, cur) { return prev + cur; });
};
/*
 * get handle or return item
 * @param {Array} items
 * @param {selector} handle
 */
var _getHandles = function (items, handle) {
    var result = [];
    var handles;
    if (!handle) {
        return items;
    }
    for (var i = 0; i < items.length; ++i) {
        handles = items[i].querySelectorAll(handle);
        result = result.concat(Array.prototype.slice.call(handles));
    }
    return result;
};
/**
 * Is {Element} a sortable.
 * @param {Element} sortable a single sortable
 */
function _isSortable(element) {
    return element !== undefined && element != null && addData(element, 'opts') !== undefined;
}
/**
 * find sortable from element. travels up parent element until found or null.
 * @param {Element} sortable a single sortable
 */
function findSortable(element) {
    while ((element = element.parentElement) && !_isSortable(element))
        ;
    return element;
}
/**
 * Dragging event is on the sortable element. finds the top child that
 * contains the element.
 * @param {Element} sortable a single sortable
 * @param {Element} element is that being dragged
 */
function findDragElement(sortableElement, element) {
    var options = addData(sortableElement, 'opts');
    var items = _filter(sortableElement.children, options.items);
    var itemlist = items.filter(function (ele) {
        return ele.contains(element);
    });
    return itemlist.length > 0 ? itemlist[0] : element;
}
/*
 * Destroy the sortable
 * @param {Element} sortableElement a single sortable
 */
var _destroySortable = function (sortableElement) {
    var opts = addData(sortableElement, 'opts') || {};
    var items = _filter(sortableElement.children, opts.items);
    var handles = _getHandles(items, opts.handle);
    // remove event handlers & data from sortable
    _removeSortableEvents(sortableElement);
    _removeSortableData(sortableElement);
    // remove event handlers & data from items
    removeEventListener(handles, 'mousedown');
    _removeItemEvents(items);
    _removeItemData(items);
};
/*
 * Enable the sortable
 * @param {Element} sortableElement a single sortable
 */
var _enableSortable = function (sortableElement) {
    var opts = addData(sortableElement, 'opts');
    var items = _filter(sortableElement.children, opts.items);
    var handles = _getHandles(items, opts.handle);
    addAttribute(sortableElement, 'aria-dropeffect', 'move');
    addData(sortableElement, '_disabled', 'false');
    addAttribute(handles, 'draggable', 'true');
    // IE FIX for ghost
    // can be disabled as it has the side effect that other events
    // (e.g. click) will be ignored
    var spanEl = (document || window.document).createElement('span');
    if (typeof spanEl.dragDrop === 'function' && !opts.disableIEFix) {
        addEventListener(handles, 'mousedown', function () {
            if (items.indexOf(this) !== -1) {
                this.dragDrop();
            }
            else {
                var parent = this.parentElement;
                while (items.indexOf(parent) === -1) {
                    parent = parent.parentElement;
                }
                parent.dragDrop();
            }
        });
    }
};
/*
 * Disable the sortable
 * @param {Element} sortableElement a single sortable
 */
var _disableSortable = function (sortableElement) {
    var opts = addData(sortableElement, 'opts');
    var items = _filter(sortableElement.children, opts.items);
    var handles = _getHandles(items, opts.handle);
    addAttribute(sortableElement, 'aria-dropeffect', 'none');
    addData(sortableElement, '_disabled', 'true');
    addAttribute(handles, 'draggable', 'false');
    removeEventListener(handles, 'mousedown');
};
/*
 * Reload the sortable
 * @param {Element} sortableElement a single sortable
 * @description events need to be removed to not be double bound
 */
var _reloadSortable = function (sortableElement) {
    var opts = addData(sortableElement, 'opts');
    var items = _filter(sortableElement.children, opts.items);
    var handles = _getHandles(items, opts.handle);
    addData(sortableElement, '_disabled', 'false');
    // remove event handlers from items
    _removeItemEvents(items);
    removeEventListener(handles, 'mousedown');
    // remove event handlers from sortable
    _removeSortableEvents(sortableElement);
};
/**
 * Make native event that can be dispatched afterwards
 * @param {string} name
 * @param {object} detail
 * @returns {CustomEvent}
 */
var _makeEvent = function (name, detail) {
    var e = document.createEvent('Event');
    if (detail) {
        e.detail = detail;
    }
    e.initEvent(name, false, true);
    return e;
};
var _serialize = function (list) {
    var children = _filter(list.children, addData(list, 'items'));
    return children;
};
/*
 * Public sortable object
 * @param {Array|NodeList} sortableElements
 * @param {object|string} options|method
 */
function sortable(sortableElements, options) {
    var method = String(options);
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
        };
        for (var option in options) {
            result[option] = options[option];
        }
        return result;
    })(options);
    if (typeof sortableElements === 'string') {
        sortableElements = document.querySelectorAll(sortableElements);
    }
    if (sortableElements instanceof window.Element) {
        sortableElements = [sortableElements];
    }
    sortableElements = Array.prototype.slice.call(sortableElements);
    if (/serialize/.test(method)) {
        var serialized = [];
        sortableElements.forEach(function (sortableElement) {
            serialized.push({
                list: sortableElement,
                children: _serialize(sortableElement)
            });
        });
        return serialized;
    }
    /* TODO: maxstatements should be 25, fix and remove line below */
    /* jshint maxstatements:false */
    sortableElements.forEach(function (sortableElement) {
        if (/enable|disable|destroy/.test(method)) {
            return sortable[method](sortableElement);
        }
        // get options & set options on sortable
        options = addData(sortableElement, 'opts') || options;
        addData(sortableElement, 'opts', options);
        // reset sortable
        _reloadSortable(sortableElement);
        // initialize
        var items = _filter(sortableElement.children, options.items);
        var index;
        var startParent;
        var startList;
        var placeholder = _makePlaceholder(sortableElement, options.placeholder, options.placeholderClass);
        addData(sortableElement, 'items', options.items);
        placeholderMap.set(sortableElement, placeholder);
        if (options.acceptFrom) {
            addData(sortableElement, 'acceptFrom', options.acceptFrom);
        }
        else if (options.connectWith) {
            addData(sortableElement, 'connectWith', options.connectWith);
        }
        _enableSortable(sortableElement);
        addAttribute(items, 'role', 'option');
        addAttribute(items, 'aria-grabbed', 'false');
        // Mouse over class
        if (typeof options.hoverClass === 'string') {
            var hoverClasses_1 = options.hoverClass.split(' ');
            // add class on hover
            addEventListener(items, 'mouseenter', function (e) {
                (_a = e.target.classList).add.apply(_a, hoverClasses_1);
                var _a;
            });
            // remove class on leave
            addEventListener(items, 'mouseleave', function (e) {
                (_a = e.target.classList).remove.apply(_a, hoverClasses_1);
                var _a;
            });
        }
        // Handle drag events on draggable items
        // Handle set at sortableelement level as it will bubble up
        // from the item
        addEventListener(sortableElement, 'dragstart', function (e) {
            // ignore dragstart events
            if (_isSortable(e.target)) {
                return;
            }
            e.stopImmediatePropagation();
            if ((options.handle && !e.target.matches(options.handle)) || e.target.getAttribute('draggable') === 'false') {
                return;
            }
            var sortableElement = findSortable(e.target);
            var dragitem = findDragElement(sortableElement, e.target);
            // add transparent clone or other ghost to cursor
            _getGhost(e, dragitem);
            // cache selsection & add attr for dragging
            draggingHeight = _getElementHeight(dragitem);
            dragitem.classList.add(options.draggingClass);
            dragging = _getDragging(dragitem, sortableElement);
            addAttribute(dragging, 'aria-grabbed', 'true');
            // grab values
            index = _index(dragging);
            startParent = findSortable(e.target);
            startList = _serialize(startParent);
            // dispatch sortstart event on each element in group
            sortableElement.dispatchEvent(_makeEvent('sortstart', {
                item: dragging,
                placeholder: placeholderMap.get(sortableElement),
                startparent: startParent
            }));
        });
        // Handle drag events on draggable items
        addEventListener(sortableElement, 'dragend', function (e) {
            var newParent;
            if (!dragging) {
                return;
            }
            var sortableElement = findSortable(e.target);
            // remove dragging attributes and show item
            dragging.classList.remove(options.draggingClass);
            addAttribute(dragging, 'aria-grabbed', 'false');
            if (dragging.getAttribute('aria-copied') === 'true' && addData(dragging, 'dropped') !== 'true') {
                dragging.remove();
            }
            dragging.style.display = dragging.oldDisplay;
            delete dragging.oldDisplay;
            placeholderMap.forEach(function (element) { return element.remove(); });
            newParent = this.parentElement;
            if (_listsConnected(newParent, startParent)) {
                sortableElement.dispatchEvent(_makeEvent('sortstop', {
                    item: dragging,
                    startparent: startParent
                }));
                if (index !== _index(dragging) || startParent !== newParent) {
                    sortableElement.dispatchEvent(_makeEvent('sortupdate', {
                        item: dragging,
                        index: _filter(newParent.children, addData(newParent, 'items'))
                            .indexOf(dragging),
                        oldindex: items.indexOf(dragging),
                        elementIndex: _index(dragging),
                        oldElementIndex: index,
                        startparent: startParent,
                        endparent: newParent,
                        newEndList: _serialize(newParent),
                        newStartList: _serialize(startParent),
                        oldStartList: startList
                    }));
                }
            }
            dragging = null;
            draggingHeight = null;
        });
        // Handle drop event on sortable & placeholder
        addEventListener(sortableElement, 'drop', function (e) {
            if (!_listsConnected(sortableElement, dragging.parentElement)) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            addData(dragging, 'dropped', 'true');
            var visiblePlaceholder = Array.from(placeholderMap.values()).filter(isInDom)[0];
            insertAfter(visiblePlaceholder, dragging);
        });
        var debouncedDragOverEnter = _debounce(function (sortableElement, element, pageY) {
            if (!dragging) {
                return;
            }
            var placeholder = placeholderMap.get(sortableElement);
            // set placeholder height if forcePlaceholderSize option is set
            if (options.forcePlaceholderSize) {
                placeholder.style.height = draggingHeight + 'px';
            }
            var items = _filter(sortableElement.children, options.items);
            if (items.indexOf(element) !== -1) {
                var thisHeight = _getElementHeight(element);
                var placeholderIndex = _index(placeholder);
                var thisIndex = _index(element);
                // Check if `element` is bigger than the draggable. If it is, we have to define a dead zone to prevent flickering
                if (thisHeight > draggingHeight) {
                    // Dead zone?
                    var deadZone = thisHeight - draggingHeight;
                    var offsetTop = _offset(element).top;
                    if (placeholderIndex < thisIndex &&
                        pageY < offsetTop + deadZone) {
                        return;
                    }
                    if (placeholderIndex > thisIndex &&
                        pageY > offsetTop + thisHeight - deadZone) {
                        return;
                    }
                }
                if (dragging.oldDisplay === undefined) {
                    dragging.oldDisplay = dragging.style.display;
                }
                if (dragging.style.display !== 'none') {
                    dragging.style.display = 'none';
                }
                if (placeholderIndex < thisIndex) {
                    insertAfter(element, placeholder);
                }
                else {
                    insertBefore(element, placeholder);
                }
                // Intentionally violated chaining, it is more complex otherwise
                Array.from(placeholderMap.values())
                    .filter(function (element) { return element !== placeholder; })
                    .forEach(function (element) { return element.remove(); });
            }
            else {
                if (Array.from(placeholderMap.values()).indexOf(element) === -1 &&
                    sortableElement === element &&
                    !_filter(element.children, options.items).length) {
                    placeholderMap.forEach(function (element) { return element.remove(); });
                    element.appendChild(placeholder);
                }
            }
        }, options.debounce);
        // Handle dragover and dragenter events on draggable items
        var onDragOverEnter = function (e) {
            var element = e.target;
            var sortableElement = _isSortable(element) ? element : findSortable(element);
            element = findDragElement(sortableElement, element);
            if (!dragging || !_listsConnected(sortableElement, dragging.parentElement) || addData(sortableElement, '_disabled') === 'true') {
                return;
            }
            var options = addData(sortableElement, 'opts');
            if (parseInt(options.maxItems) && _filter(sortableElement.children, addData(sortableElement, 'items')).length >= parseInt(options.maxItems)) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = _isCopyActive(sortableElement) ? 'copy' : 'move';
            debouncedDragOverEnter(sortableElement, element, e.pageY);
        };
        addEventListener(items.concat(sortableElement), 'dragover', onDragOverEnter);
        addEventListener(items.concat(sortableElement), 'dragenter', onDragOverEnter);
    });
    return sortableElements;
}
sortable.destroy = function (sortableElement) {
    _destroySortable(sortableElement);
};
sortable.enable = function (sortableElement) {
    _enableSortable(sortableElement);
};
sortable.disable = function (sortableElement) {
    _disableSortable(sortableElement);
};

return sortable;

}());
