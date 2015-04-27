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
(function($) {
  'use strict';

  var dragging;
  var draggingHeight;
  var placeholders = $();
  $.fn.sortable = function(options) {

    var method = String(options);

    options = $.extend({
      connectWith: false,
      placeholder: null,
      dragImage: null
    }, options);

    return this.each(function() {
      var index;
      var $sortable = $(this);
      var $items = $sortable.children(options.items);
      var $handles = options.handle ? $items.find(options.handle) : $items;

      // TODO: replace need for reload with bind event on sortable

      if (method === 'reload') {
        $(this).children(options.items).off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
        $(this).off('dragover.h5s dragenter.h5s drop.h5s');
      }

      if (/^enable|disable|destroy$/.test(method)) {
        var citems = $sortable.children($sortable.data('items')).attr('draggable', method === 'enable');
        if (method === 'destroy') {
          $sortable.off('sortstart sortupdate');
          $sortable.removeData('opts');
          $sortable.attr('aria-dropeffect', (/^disable|destroy$/.test(method) ? 'none' : 'move'));
          citems.add(this).removeData('connectWith items')
            .off('dragstart.h5s dragend.h5s dragover.h5s dragenter.h5s drop.h5s').off('sortupdate');
          $handles.off('selectstart.h5s');
        }
        return;
      }

      var soptions = $sortable.data('opts');

      if (typeof soptions === 'undefined') {
        $sortable.data('opts', options);
      } else {
        options = soptions;
      }

      var startParent;
      var newParent;
      var placeholder = (options.placeholder === null) ? $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder"/>') : $(options.placeholder).addClass('sortable-placeholder');

      $sortable.data('items', options.items);
      placeholders = placeholders.add(placeholder);

      if (options.connectWith) {
        $(options.connectWith).add(this).data('connectWith', options.connectWith);
      }

      // WAI-Aria attributes https://dev.opera.com/articles/accessible-drag-and-drop/
      $items.attr('role', 'option');
      $items.attr('aria-grabbed', 'false');

      // Setup drag handles
      $handles.attr('draggable', 'true').not('a[href], img').on('selectstart.h5s', function() {
        if (this.dragDrop) {
          this.dragDrop();
        }
        return false;
      }).end();

      // Handle drag events on draggable items
      $items.on('dragstart.h5s', function(e) {
        e.stopImmediatePropagation();
        var dt = e.originalEvent.dataTransfer;
        dt.effectAllowed = 'move';
        dt.setData('text', '');

        if (options.dragImage && dt.setDragImage) {
          dt.setDragImage(options.dragImage, 0, 0);
        }

        index = (dragging = $(this)).addClass('sortable-dragging').attr('aria-grabbed', 'true').index();
        draggingHeight = dragging.outerHeight();
        startParent = $(this).parent();

        dragging.parent().triggerHandler('sortstart', {
          item: dragging,
          startparent: startParent
        });
      });

      // handles dragend event on items
      $items.on('dragend.h5s',function () {
        if (!dragging) {
          return;
        }
        dragging.removeClass('sortable-dragging').attr('aria-grabbed', 'false').show();
        placeholders.detach();
        newParent = $(this).parent();

        if (index !== dragging.index() || startParent.get(0) !== newParent.get(0)) {
          dragging.parent().triggerHandler('sortupdate', {
            item: dragging,
            oldindex: index,
            startparent: startParent,
            endparent: newParent
          });
        }
        dragging = null;
        draggingHeight = null;
      });
      // handles drop events for items and sortable
      $items.add([this, placeholder]).on('dragover.h5s dragenter.h5s drop.h5s', function(e) {
        if (!$items.is(dragging) && options.connectWith !== $(dragging).parent().data('connectWith')) {
          return true;
        }

        if (e.type === 'drop') {
          e.stopPropagation();
          placeholders.filter(':visible').after(dragging);
          dragging.trigger('dragend.h5s');
          return false;
        }
        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = 'move';
        if ($items.is(this)) {
          var thisHeight = $(this).outerHeight();
          if (options.forcePlaceholderSize) {
            placeholder.height(draggingHeight);
          }

          // Check if $(this) is bigger than the draggable. If it is, we have to define a dead zone to prevent flickering
          if (thisHeight > draggingHeight) {
            // Dead zone?
            var deadZone = thisHeight - draggingHeight;
            var offsetTop = $(this).offset().top;
            if (placeholder.index() < $(this).index() && e.originalEvent.pageY < offsetTop + deadZone) {
              return false;
            }
            if (placeholder.index() > $(this).index() && e.originalEvent.pageY > offsetTop + thisHeight - deadZone) {
              return false;
            }
          }

          dragging.hide();
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
})(jQuery);
