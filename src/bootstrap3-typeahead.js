/*!
* bootstrap3-typeahead
*   https://github.com/thumnet/Bootstrap-3-Typeahead
*
*   Original written by @mdo and @fat
*   Forked from: https://github.com/bassjobsen/Bootstrap-3-Typeahead
*
*/

/*
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


(function (root, factory) {

  'use strict';

  // CommonJS module is defined
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('jquery'), root.minitemplate);
  }
  // AMD module is defined
  else if (typeof define === 'function' && define.amd) {
    define(['jquery'], function ($) {
      return factory($, root.minitemplate);
    });
  } else {
    factory(root.jQuery, root.minitemplate);
  }

} (this, function ($, minitemplate) {

  'use strict';
  // jshint laxcomma: true


  /* TYPEAHEAD PUBLIC CLASS DEFINITION
   * ================================= */

  var Typeahead = function (element, options) {
    this.options = $.extend({}, $.fn.typeahead.defaults, options);
    this.$element = $(element);
    this.$menu = $(this.options.menu);
    this.$appendTo = this.options.appendTo ? $(this.options.appendTo) : null;
    this.autoSelect = typeof this.options.autoSelect == 'boolean' ? this.options.autoSelect : true;
    this.showHintOnFocus = typeof this.options.showHintOnFocus == 'boolean' ? this.options.showHintOnFocus : false;
    this.onSearch = typeof this.options.onSearch == 'function' ? this.options.onSearch : $.noop;
    this.onNew = typeof this.options.onNew == 'function' ? this.options.onNew : $.noop;
    this.onSelect = typeof this.options.onSelect == 'function' ? this.options.onSelect : $.noop;
    this.shown = false;
    this.listen();
    this.setSource(this.options.source);
  };

  Typeahead.prototype = {

    constructor: Typeahead,

    select: function () {
      var val = this.$menu.find('.active').data('value');

      // No active item or active item is searchItem -> afterSearch()
      if (!val || val === this.options.searchItem) {
        this.onSearch(this.$element.val());
      }
      // active item is newItem -> onNew()
      else if (val === this.options.newItem) {
        this.onNew(this.$element.val());
      }
      // autoselect or active item -> afterSelect()
      else if (this.autoSelect || val) {
        this.onSelect(val);
        this.$element
          .val(val[this.options.compareTo[0]])
          .change();
      }

      return this.shown ? this.hide() : this;
    },

    setSource: function (source) {
      if ($.isArray(source) && source.length > 0) {
        // if a string array is the source convert it to an object array to work with minitemplate
        if (typeof source[0] == 'string') {
          source = $.map(source, function (val) {
            return { value: val };
          });
        }
      }
      this.source = source;
    },

    show: function () {
      var pos = $.extend({}, this.$element.position(), { height: this.$element[0].offsetHeight });
      var scrollHeight = typeof this.options.scrollHeight == 'function' ?
        this.options.scrollHeight.call() :
        this.options.scrollHeight;

      (this.$appendTo ? this.$menu.appendTo(this.$appendTo) : this.$menu.insertAfter(this.$element))
        .css({
          top: pos.top + pos.height + scrollHeight,
          left: pos.left
        })
        .show();

      this.shown = true;
      return this;
    },

    hide: function () {
      this.$menu.hide();
      this.shown = false;
      return this;
    },

    lookup: function (query) {
      if (typeof (query) != 'undefined' && query !== null) {
        this.query = query;
      } else {
        this.query = this.$element.val() || '';
      }

      if (this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this;
      }

      var worker = $.proxy(function () {

        if ($.isFunction(this.source)) this.source(this.query, $.proxy(this.process, this));
        else if (this.source) {
          this.process(this.source);
        }
      }, this);

      clearTimeout(this.lookupWorker);
      this.lookupWorker = setTimeout(worker, this.options.delay);
    },

    process: function (items) {
      var that = this;
      var extras = [];

      items = $.grep(items, function (item) {
        return that.matcher(item);
      });

      items = this.sorter(items);

      if (!items.length && !this.options.newItem) {
        return this.shown ? this.hide() : this;
      }

      if (items.length > 0) {
        this.$element.data('active', items[0]);
      } else {
        this.$element.data('active', null);
      }

      // Limit the items to show if needed
      if (this.options.items != 'all' && items.length > this.options.items) {
        items = items.slice(0, this.options.items);

        // Add search items
        if (this.options.searchItem) {
          extras.push(this.options.searchItem);
        }
      }

      // Add item
      if (this.options.newItem) {
        extras.push(this.options.newItem);
      }

      return this.render(items, extras).show();
    },

    matcher: function (item) {
      var q = this.query.toLowerCase();
      var compareTo = this.options.compareTo;
      for (var i = 0, l = compareTo.length; i < l; i++) {
        if (~item[compareTo[i]].toLowerCase().indexOf(q)) { return true; } // ~-1 = 0 -> false if not indexOf
      }
      return false;
    },

    sorter: function (items) {
      var beginswith = [],
        caseSensitive = [],
        caseInsensitive = [],
        item;

      while ((item = items.shift())) {
        var it = item[this.options.compareTo[0]];
        if (!it.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item);
        else if (~it.indexOf(this.query)) caseSensitive.push(item);
        else caseInsensitive.push(item);
      }

      return beginswith.concat(caseSensitive, caseInsensitive);
    },

    highlighter: function (text) {
      var regex = new RegExp(this.query, 'gi');
      return text.replace(regex, function (match) {
        return '<strong>' + match + '</strong>';
      });
    },

    highlightItem: function (item) {
      var that = this;
      var highlighted = {};
      $.each(item, function (key, value) {
        highlighted[key] = that.highlighter(value);
      });
      return highlighted;
    },

    render: function (items, extras) {
      var that = this;
      var activeFound = false;
      items = $(items).map(function (i, item) {
        i = $(that.options.item).data('value', item);
        var html = minitemplate(that.options.displayTemplate, that.highlightItem(item));
        i.find('a').html(html);

        if (item[that.options.compareTo[0]] == that.$element.val()) {
          i.addClass('active');
          that.$element.data('active', item);
          activeFound = true;
        }
        return i[0];
      });

      if (this.autoSelect && !activeFound) {
        items.first().addClass('active');
        this.$element.data('active', items.first().data('value'));
      }

      if (items.length > 0 && extras.length > 0) {
        items.push($(that.options.divider)[0]);
      }

      $.each(extras, function (i, extra) {
        i = $(that.options.item).data('value', extra);
        i.find('a').text(extra);
        items.push(i[0]);
      });

      this.$menu.html(items);
      return this;
    },

    next: function (event) {
      var active = this.$menu.find('.active').removeClass('active'),
        next = active.next();

      if (next.hasClass('divider')) next = next.next();
      if (!next.length) next = $(this.$menu.find('li')[0]);

      next.addClass('active');
    },

    prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active'),
        prev = active.prev();

      if (prev.hasClass('divider')) prev = prev.prev();
      if (!prev.length) prev = this.$menu.find('li').last();

      prev.addClass('active');
    },

    listen: function () {
      this.$element
        .on('focus', $.proxy(this.focus, this))
        .on('blur', $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup', $.proxy(this.keyup, this));

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this));
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this));
    },

    destroy: function () {
      this.$element.data('typeahead', null);
      this.$element.data('active', null);
      this.$element
        .off('focus')
        .off('blur')
        .off('keypress')
        .off('keyup');

      if (this.eventSupported('keydown')) {
        this.$element.off('keydown');
      }

      this.$menu.remove();
    },

    eventSupported: function (eventName) {
      var isSupported = eventName in this.$element;
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;');
        isSupported = typeof this.$element[eventName] === 'function';
      }
      return isSupported;
    },

    move: function (e) {
      if (!this.shown) return;

      switch (e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault();
          break;

        case 38: // up arrow
          // with the shiftKey (this is actually the left parenthesis)
          if (e.shiftKey) return;
          e.preventDefault();
          this.prev();
          break;

        case 40: // down arrow
          // with the shiftKey (this is actually the right parenthesis)
          if (e.shiftKey) return;
          e.preventDefault();
          this.next();
          break;
      }
    },

    keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40, 38, 9, 13, 27]);
      if (!this.shown && e.keyCode == 40) {
        this.lookup();
      } else {
        this.move(e);
      }
    },

    keypress: function (e) {
      if (this.suppressKeyPressRepeat) return;
      this.move(e);
    },

    keyup: function (e) {
      switch (e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break;

        case 9: // tab
          if (this.shown) this.hide();
          break;

        case 13: // enter
          this.select();
          break;

        case 27: // escape
          if (!this.shown) return;
          this.hide();
          break;
        default:
          this.lookup();
      }

      e.preventDefault();
    },

    focus: function (e) {
      if (!this.focused) {
        this.focused = true;
        if (this.options.showHintOnFocus) {
          this.lookup();
        }
      }
    },

    blur: function (e) {
      this.focused = false;
      if (!this.mousedover && this.shown) this.hide();
    },

    click: function (e) {
      e.preventDefault();
      this.select();
      this.$element.focus();
    },

    mouseenter: function (e) {
      this.mousedover = true;
      this.$menu.find('.active').removeClass('active');
      $(e.currentTarget).addClass('active');
    },

    mouseleave: function (e) {
      this.mousedover = false;
      if (!this.focused && this.shown) this.hide();
    }

  };


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead;

  $.fn.typeahead = function (option) {
    var arg = arguments;
    if (typeof option == 'string' && option == 'getActive') {
      return this.data('active');
    }
    return this.each(function () {
      var $this = $(this),
        data = $this.data('typeahead'),
        options = typeof option == 'object' && option;
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)));
      if (typeof option == 'string') {
        if (arg.length > 1) {
          data[option].apply(data, Array.prototype.slice.call(arg, 1));
        } else {
          data[option]();
        }
      }
    });
  };

  $.fn.typeahead.defaults = {
    source: [],
    items: 8,
    menu: '<ul class="typeahead dropdown-menu" role="listbox"></ul>',
    item: '<li><a href="#" role="option"></a></li>',
    divider: '<li role="separator" class="divider"></li>',
    compareTo: ['value'],
    displayTemplate: '{{value}}',
    minLength: 1,
    scrollHeight: 0,
    autoSelect: true,
    newItem: false,
    searchItem: false,
    delay: 0
  };

  $.fn.typeahead.Constructor = Typeahead;


  /* TYPEAHEAD NO CONFLICT
   * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old;
    return this;
  };


  /* TYPEAHEAD DATA-API
   * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this);
    if ($this.data('typeahead')) return;
    $this.typeahead($this.data());
  });

}));
