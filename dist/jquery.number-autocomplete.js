/*! jquery.number-autocomplete 2014-05-05 */
!function(a){"use strict";function b(b,c){this.$element=a(b),this.options=a.extend({},i,c||{}),this.$element.on("keyup",a.proxy(this.keyup,this))}function c(b){return a("<div />").html(b).text()}function d(a){return a.toString().replace(/[^\d]/g,"")}function e(a){return parseInt("number"==typeof a.which?a.which:a.keyCode,10)}function f(a,b,c){var d=a+"0";return a.length<b?f(d,b,c):a.length<c?d:null}function g(a,b,c){var e,g=d(a),h=parseInt(g,10),i=[];if(!isNaN(h)&&0!==h)for(e=f(g,b,c);null!==e;)i.push(e),e=f(e,b,c);return i}var h="numberAutocomplete",i={formatter:null,formatterOptions:null,className:h,prefix:"",suffix:"",unmaskInput:!1,removeFixInput:!1,minDigits:4,maxDigits:8,positioning:!0};b.prototype={init:function(){if(this.$autocomplete=a("<ul></ul>",{"class":this.options.className}).hide(),a("body").append(this.$autocomplete),this.$autocomplete.on("mousedown","li",a.proxy(this.mousedown,this)),this.$autocomplete.on("mouseenter","li",a.proxy(this.mouseenter,this)),this.$autocomplete.on("mouseleave","li",a.proxy(this.mouseleave,this)),this.$element.on("blur",a.proxy(this.blur,this)),this.$element.on("keydown",a.proxy(this.keydown,this)),this.$element.on("focus",a.proxy(this.focus,this)),this.options.positioning){var b=this.$element.offset();b.top+=this.$element.height()+8,b.width=Math.max(this.$element.height(),100),this.$autocomplete.css(b)}},focus:function(){""!==this.$autocomplete.html()&&this.$autocomplete.show()},blur:function(){this.$autocomplete.hide()},keydown:function(a){switch(e(a)){case 13:a.preventDefault(),this.mousedown();break;case 40:a.preventDefault(),this.walk(1);break;case 38:a.preventDefault(),this.walk(-1);break;case 27:this.blur()}},keyup:function(b){if(-1===a.inArray(e(b),[13,40,38,27,37,39])){this.$autocomplete||this.init(),this.setValue(this.format(this.$element.val()));var c="";a.each(g(this.$element.val(),this.options.minDigits,this.options.maxDigits),a.proxy(function(a,b){c+="<li>"+this.format(b,!0)+"</li>"},this)),""!==c?this.$autocomplete.html(c).show():this.blur()}},mouseenter:function(b){this.$autocomplete.find("li").removeClass("selected"),a(b.target).addClass("selected")},mouseleave:function(b){a(b.target).removeClass("selected")},mousedown:function(){this.setValue(this.$autocomplete.find(".selected").html()),this.blur()},setValue:function(a){this.options.removeFixInput&&(a=a.replace(c(this.options.prefix),"").replace(c(this.options.suffix),"")),this.options.unmaskInput&&(a=d(a)),this.$element.val(a),this.$element.trigger("change")},walk:function(a){var b=this.$autocomplete.find(".selected");b.length?(b[a>0?"next":"prev"]().addClass("selected"),b.removeClass("selected")):this.$autocomplete.find("li:"+(a>0?"first":"last")).addClass("selected")},destroy:function(){this.$element.off(),this.$autocomplete&&this.$autocomplete.off().remove()},format:function(a,b){return a=d(a),this.options.formatter&&(a=this.options.formatter(a,this.options.formatterOptions)),b&&""!==a&&(a=this.options.prefix+a+this.options.suffix),a}},a.fn[h]=function(c){return this.each(function(){var d=a.data(this,"plugin_"+h);c&&"object"!=typeof c||d?"destroy"===c&&d&&(d.destroy(),a.data(this,"plugin_"+h,!1)):a.data(this,"plugin_"+h,new b(this,c))})},a[h]=function(b){a.extend(i,b||{})}}(jQuery);