/*
 * HTML5 Sortable jQuery Plugin
 * https://github.com/voidberg/html5sortable
 *
 * Original code copyright 2012 Ali Farhadi.
 * This version is mantained by Alexandru Badiu <andu@ctrlz.ro>
 *
 * Thanks to the following contributors: andyburke, bistoco, daemianmack, drskullster, flying-sheep, OscarGodson, Parikshit N. Samant, rodolfospalenza, ssafejava
 *
 * Released under the MIT license.
 */
'use strict';

(function ($) {
  var dragging, draggingHeight, startParent, placeholders = $();
  $.fn.sortable = function (options) {
    var method = String(options),
        $sortableLists = this;

    options = $.extend({
      connectWith: false,
      placeholder: null,
      dragImage: null
    }, options);

    return $sortableLists.each(function (index, sortableList) {
      var $sortableList = $(sortableList);
      if (method === 'reload') {
        $sortableList.children(options.items).off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
      }
      if (/^enable|disable|destroy$/.test(method)) {
        var citems = $sortableList.children($sortableList.data('items')).attr('draggable', method === 'enable');
        if (method === 'destroy') {
          $sortableList.off('sortupdate');
          citems.add(this).removeData('connectWith items')
            .off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s').off('sortupdate');
        }
        return;
      }

      var soptions = $sortableList.data('opts');

      if (typeof soptions === 'undefined') {
        $sortableList.data('opts', options);
      }
      else {
        options = soptions;
      }

      var isHandle, index, items = $sortableList.children(options.items);
      var newParent;
      var placeholder = ( options.placeholder === null ) ? $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">') : $(options.placeholder).addClass('sortable-placeholder');
      items.find(options.handle).mousedown(function () {
        isHandle = true;
      }).mouseup(function () {
          isHandle = false;
        });
      $sortableList.data('items', options.items);
      placeholders = placeholders.add(placeholder);
      if (options.connectWith) {
        $(options.connectWith).add(this).data('connectWith', options.connectWith);
      }
      items.attr('draggable', 'true').on('dragstart.h5s',function (e) {
        e.stopImmediatePropagation();
        if (options.handle && !isHandle) {
          return false;
        }
        isHandle = false;
        var dt = e.originalEvent.dataTransfer;
        dt.effectAllowed = 'move';
        dt.setData('Text', 'dummy');

        if (options.dragImage && dt.setDragImage) {
          dt.setDragImage(options.dragImage, 0, 0);
        }

        index = (dragging = $(this)).addClass('sortable-dragging').index();
        startParent = $(this).parent();
        draggingHeight = dragging.outerHeight();
      }).on('dragend.h5s',function () {
          if (!dragging) {
            return;
          }
          dragging.removeClass('sortable-dragging');
          placeholders.detach();
          if (!$sortableLists.is(dragging.parent())) {
            /* Reinsert dragged item at original location if drag did not end
               on a sortable list. */
            var currentItems = startParent.children(options.items);
            if (index === currentItems.length) {
              dragging.insertAfter(currentItems.last());
            } else {
              dragging.insertBefore(currentItems.eq(index));
            }
          }
          newParent = $(this).parent();
          if (index !== dragging.index() || startParent !== newParent) {
            dragging.parent().triggerHandler('sortupdate', {item: dragging, oldindex: index, startparent: startParent, endparent: newParent});
          }
          dragging = null;
        }).not('a[href], img').on('selectstart.h5s',function () {
          if (options.handle && !isHandle) {
            return true;
          }

          if (this.dragDrop) {
            this.dragDrop();
          }
          return false;
        }).end().add([this, placeholder]).on('dragover.h5s dragenter.h5s drop.h5s', function (e) {
          if (!items.is(dragging) && options.connectWith !== startParent.data('connectWith')) {
            return true;
          }
          if (e.type === 'drop') {
            e.stopPropagation();
            if(dragging !== null) {
              placeholders.filter(':visible').after(dragging);
              dragging.trigger('dragend.h5s');
            }
            return false;
          }
          e.preventDefault();
          e.originalEvent.dataTransfer.dropEffect = 'move';
          if (items.is(this)) {
            var thisHeight = $(this).outerHeight();
            if (options.forcePlaceholderSize) {
              placeholder.height(draggingHeight);
            }

            // Check if $(this) is bigger than the draggable. If it is, we have to define a dead zone to prevent flickering
            if (thisHeight > draggingHeight) {
              // Dead zone?
              var deadZone = thisHeight - draggingHeight, offsetTop = $(this).offset().top;
              if (placeholder.index() < $(this).index() && e.originalEvent.pageY < offsetTop + deadZone) {
                return false;
              }
              else if (placeholder.index() > $(this).index() && e.originalEvent.pageY > offsetTop + thisHeight - deadZone) {
                return false;
              }
            }

            dragging.detach();
            $(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
            placeholders.not(placeholder).detach();
          } else if (!placeholders.is(this) && !$(this).children(options.items).length) {
            placeholders.detach();
            $(this).append(placeholder);
          }
          return false;
        });
    });
  };
})($);
