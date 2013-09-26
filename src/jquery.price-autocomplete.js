/**
 * jQuery Price Autocomplete
 * Version: 0.1.0
 * URL: http://github.com/emilkaiser/jquery-price-autocomplete
 * Dependecies: jQuery
 * Author: Emil Kaiser (emilkaiser@gmail.com)
 * License: MIT
 */

;(function ($, undefined) {

'use strict';

var pluginName = 'priceAutocomplete',
defaults = {
  formatter: null,
  formatterOptions: null,
  className: pluginName,
  prefix: '',
  suffix: ' kr'
};

function PriceAutocomplete (element, options) {
  this.$element = $(element);
  this.options = $.extend({}, defaults, options);
  this.$element.on('focus', $.proxy(this.focus, this));
}

PriceAutocomplete.prototype = {
    init: function () {
      this.$autocomplete = $('<ul></ul>', {class: this.options.className}).hide();
      $('body').append(this.$autocomplete);
      this.$autocomplete.on('mousedown', 'li', $.proxy(this.mousedown, this));
      this.$autocomplete.on('mouseenter', 'li', $.proxy(this.mouseenter, this));
      this.$autocomplete.on('mouseleave', 'li', $.proxy(this.mouseleave, this));
      this.$element.on('blur', $.proxy(this.blur, this));
      this.$element.on('keydown', $.proxy(this.keydown, this));
      this.$element.on('keyup', $.proxy(this.keyup, this));

      var css = this.$element.offset();
      css.top += this.$element.height() + 8;
      css.width = Math.max(this.$element.height(), 100);
      this.$autocomplete.css(css);
    },
    focus: function () {
      if (!this.$autocomplete) {
        this.init();
      } else {
        this.$autocomplete.show();
      }
    },
    blur: function () {
      this.$autocomplete.hide();
    },
    keydown: function (event) {
      var key = getCharCode(event);
      switch (getCharCode(event)) {
        case 13:
          event.preventDefault();
          this.click();
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
      this.setValue(this.format(this.$element.val()));
      var html = '';
      $.each(getValues(this.$element.val()), $.proxy(function (i, val) {
        html += '<li>' + this.format(val, true) + '</li>';
      }, this));
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
    },
    setValue: function (val) {
      val = val.replace(this.options.suffix, '');
      this.$element.val(val);
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
    remove: function () {
      this.$element.off();
      this.$autocomplete.off().remove();
    },
    format: function (val, fix) {
      val = val.toString().replace(/[^\d]/g, '');
      if (this.options.formatter) {
        val = this.options.formatter(val, this.options.formatterOptions);
      }
      if (fix && val !== '') {
        val = this.options.prefix + val + this.options.suffix;
      }
      return val;
    }
};

$.fn[pluginName] = function (options) {
  return this.each(function() {
    if (!$.data(this, 'plugin_' + pluginName)) {
      $.data(this, 'plugin_' + pluginName, new PriceAutocomplete(this, options));
    }
  });
};

function getCharCode (event) {
  return parseInt((typeof event.which == 'number') ? event.which : event.keyCode, 10);
}

function getNextValue (value) {
  var nextValue = value + '0';
  if(value.length < 4) {
    return getNextValue(nextValue);
  } else if(value.length < 8) {
    return nextValue;
  }
  return null;
}

function getValues (value) {
  var strValue = value.toString().replace(/[^\d]/g, ''),
  intValue = parseInt(strValue, 10),
  values = [];
  if (!isNaN(intValue)) {
    if(intValue > 9999) {
      values.push(strValue);
    }
    if(intValue !== 0) {
      var next = getNextValue(strValue);
      while(next !== null) {
        values.push(next);
        next = getNextValue(next);
      }
    }
  }
  return values;
}

})(jQuery);
