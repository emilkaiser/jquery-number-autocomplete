/**
 * jQuery Number Autocomplete
 * Version: 0.1.0
 * URL: http://github.com/emilkaiser/jquery-number-autocomplete
 * Dependecies: jQuery
 * Author: Emil Kaiser (emilkaiser@gmail.com)
 * License: MIT
 */

;(function ($, undefined) {

  'use strict';

  var pluginName = 'numberAutocomplete',
  defaults = {
    formatter: null, // a custom formatter function formatter(strNumber[,options])
    formatterOptions: null, // a object with options to be sent on to the formatter
    className: pluginName, // for styling etc
    prefix: '', // something before ..
    suffix: '', // .. and something after
    unmaskInput: false, // only digits in input field or not
    removeFixInput: false, // allow separators but no prefix or suffix in input field
    minDigits: 4, // 1000 to ..
    maxDigits: 8, // .. 10 000 000
    positioning: true // doing some sane positioning below input field
  };

  function NumberAutocomplete (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, defaults, options || {});
    this.$element.on('keyup', $.proxy(this.keyup, this));
  }

  NumberAutocomplete.prototype = {

    init: function () {
      this.$autocomplete = $('<ul></ul>', {class: this.options.className}).hide();
      $('body').append(this.$autocomplete);

      this.$autocomplete.on('mousedown', 'li', $.proxy(this.mousedown, this));
      this.$autocomplete.on('mouseenter', 'li', $.proxy(this.mouseenter, this));
      this.$autocomplete.on('mouseleave', 'li', $.proxy(this.mouseleave, this));
      this.$element.on('blur', $.proxy(this.blur, this));
      this.$element.on('keydown', $.proxy(this.keydown, this));
      this.$element.on('focus', $.proxy(this.focus, this));

      if (this.options.positioning) {
        var css = this.$element.offset();
        css.top += this.$element.height() + 8;
        css.width = Math.max(this.$element.height(), 100);
        this.$autocomplete.css(css);
      }
    },

    focus: function () {
      if (this.$autocomplete.html() !== '') {
        this.$autocomplete.show();
      }
    },

    blur: function () {
      this.$autocomplete.hide();
    },

    keydown: function (event) {
      switch (getCharCode(event)) {
        case 13:
          event.preventDefault();
          this.mousedown();
          break;
        case 40:
          event.preventDefault();
          this.walk(1);
          break;
        case 38:
          event.preventDefault();
          this.walk(-1);
          break;
        case 27:
          this.blur();
          break;
      }
    },

    keyup: function (event) {
      if ([13, 40, 38, 27, 37, 39].indexOf(getCharCode(event)) !== -1) {
        return;
      }
      if (!this.$autocomplete) {
        this.init(); // lazy init
      }
      this.setValue(this.format(this.$element.val()));
      var html = '';
      $.each(
        getValues(this.$element.val(), this.options.minDigits, this.options.maxDigits),
        $.proxy(function (i, val) {
          html += '<li>' + this.format(val, true) + '</li>';
        }, this)
      );
      if (html !== '') {
        this.$autocomplete.html(html).show();
      } else {
        this.blur();
      }
    },

    mouseenter: function (event) {
      this.$autocomplete.find('li').removeClass('selected');
      $(event.target).addClass('selected');
    },

    mouseleave: function (event) {
      $(event.target).removeClass('selected');
    },

    mousedown: function () {
      this.setValue(this.$autocomplete.find('.selected').html());
      this.blur();
    },

    setValue: function (val) {
      if (this.options.removeFixInput) {
        val = val.replace(decodeHtmlEntities(this.options.prefix), '').replace(decodeHtmlEntities(this.options.suffix), '');
      }
      if (this.options.unmaskInput) {
        val = unmask(val);
      }
      this.$element.val(val);
      this.$element.trigger('change');
    },

    walk: function (inc) {
      var selected = this.$autocomplete.find('.selected');
      if (!selected.length) {
        this.$autocomplete.find('li:' + (inc > 0 ? 'first' : 'last')).addClass('selected');
      } else {
        selected[inc > 0 ? 'next' : 'prev']().addClass('selected');
        selected.removeClass('selected');
      }
    },

    destroy: function () {
      this.$element.off();
      if (this.$autocomplete) {
        this.$autocomplete.off().remove();
      }
    },

    format: function (val, fix) {
      val = unmask(val);
      if (this.options.formatter) {
        val = this.options.formatter(val, this.options.formatterOptions);
      }
      if (fix && val !== '') {
        val = this.options.prefix + val + this.options.suffix;
      }
      return val;
    }
  };

  // Private methods

  function decodeHtmlEntities (val) {
    return $('<div />').html(val).text();
  }

  function unmask (val) {
    return val.toString().replace(/[^\d]/g, '');
  }

  function getCharCode (event) {
    return parseInt((typeof event.which == 'number') ? event.which : event.keyCode, 10);
  }

  function getNextValue (value, min, max) {
    var nextValue = value + '0';
    if(value.length < min) {
      return getNextValue(nextValue, min, max);
    } else if(value.length < max) {
      return nextValue;
    }
    return null;
  }

  function getValues (value, min, max) {
    var strValue = unmask(value),
    intValue = parseInt(strValue, 10),
    values = [], next;
    if (!isNaN(intValue) && intValue !== 0) {
      next = getNextValue(strValue, min, max);
      while(next !== null) {
        values.push(next);
        next = getNextValue(next, min, max);
      }
    }
    return values;
  }

  // The jQuery part of the plugin
  $.fn[pluginName] = function (mixed) {
    return this.each(function() {
      var instance = $.data(this, 'plugin_' + pluginName);
      if ((!mixed || typeof mixed === 'object') && !instance) {
        $.data(this, 'plugin_' + pluginName, new NumberAutocomplete(this, mixed));
      } else if (mixed === 'destroy' && instance) {
        instance.destroy();
        $.data(this, 'plugin_' + pluginName, false);
      }
    });
  };

  $[pluginName] = function (options) {
    // override the defaults for all plugin calls.
    $.extend(defaults, options || {});
  };

})(jQuery);
