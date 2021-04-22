/*! jQuery v1.7.1 jquery.com | jquery.org/license */
(function (window, undefined) {






















   // Use the correct document accordingly with window argument (sandbox)
   var document = window.document,
      navigator = window.navigator,
      location = window.location;
   var jQuery = (function () {

      // Define a local copy of jQuery
      var jQuery = function (selector, context) {
         // The jQuery object is actually just the init constructor 'enhanced'
         return new jQuery.fn.init(selector, context, rootjQuery);
      },

         // Map over jQuery in case of overwrite
         _jQuery = window.jQuery,

         // Map over the $ in case of overwrite
         _$ = window.$,

         // A central reference to the root jQuery(document)
         rootjQuery,

         // A simple way to check for HTML strings or ID strings
         // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
         quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

         // Check if a string has a non-whitespace character in it
         rnotwhite = /\S/,

         // Used for trimming whitespace
         trimLeft = /^\s+/,
         trimRight = /\s+$/,

         // Match a standalone tag
         rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

         // JSON RegExp
         rvalidchars = /^[\],:{}\s]*$/,
         rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
         rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
         rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

         // Useragent RegExp
         rwebkit = /(webkit)[ \/]([\w.]+)/,
         ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
         rmsie = /(msie) ([\w.]+)/,
         rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

         // Matches dashed string for camelizing
         rdashAlpha = /-([a-z]|[0-9])/ig,
         rmsPrefix = /^-ms-/,

         // Used by jQuery.camelCase as callback to replace()
         fcamelCase = function (all, letter) {
            return (letter + "").toUpperCase();
         },

         // Keep a UserAgent string for use with jQuery.browser
         userAgent = navigator.userAgent,

         // For matching the engine and version of the browser
         browserMatch,

         // The deferred used on DOM ready
         readyList,

         // The ready event handler
         DOMContentLoaded,

         // Save a reference to some core methods
         toString = Object.prototype.toString,
         hasOwn = Object.prototype.hasOwnProperty,
         push = Array.prototype.push,
         slice = Array.prototype.slice,
         trim = String.prototype.trim,
         indexOf = Array.prototype.indexOf,

         // [[Class]] -> type pairs
         class2type = {};

      jQuery.fn = jQuery.prototype = {
         constructor: jQuery,
         init: function (selector, context, rootjQuery) {
            var match, elem, ret, doc;

            // Handle $(""), $(null), or $(undefined)
            if (!selector) {
               return this;
            }

            // Handle $(DOMElement)
            if (selector.nodeType) {
               this.context = this[0] = selector;
               this.length = 1;
               return this;
            }

            // The body element only exists once, optimize finding it
            if (selector === "body" && !context && document.body) {
               this.context = document;
               this[0] = document.body;
               this.selector = selector;
               this.length = 1;
               return this;
            }

            // Handle HTML strings
            if (typeof selector === "string") {
               // Are we dealing with HTML string or an ID?
               if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                  // Assume that strings that start and end with <> are HTML and skip the regex check
                  match = [null, selector, null];

               } else {
                  match = quickExpr.exec(selector);
               }

               // Verify a match, and that no context was specified for #id
               if (match && (match[1] || !context)) {

                  // HANDLE: $(html) -> $(array)
                  if (match[1]) {
                     context = context instanceof jQuery ? context[0] : context;
                     doc = (context ? context.ownerDocument || context : document);

                     // If a single string is passed in and it's a single tag
                     // just do a createElement and skip the rest
                     ret = rsingleTag.exec(selector);

                     if (ret) {
                        if (jQuery.isPlainObject(context)) {
                           selector = [document.createElement(ret[1])];
                           jQuery.fn.attr.call(selector, context, true);

                        } else {
                           selector = [doc.createElement(ret[1])];
                        }

                     } else {
                        ret = jQuery.buildFragment([match[1]], [doc]);
                        selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
                     }

                     return jQuery.merge(this, selector);

                     // HANDLE: $("#id")
                  } else {
                     elem = document.getElementById(match[2]);

                     // Check parentNode to catch when Blackberry 4.6 returns
                     // nodes that are no longer in the document #6963
                     if (elem && elem.parentNode) {
                        // Handle the case where IE and Opera return items
                        // by name instead of ID
                        if (elem.id !== match[2]) {
                           return rootjQuery.find(selector);
                        }

                        // Otherwise, we inject the element directly into the jQuery object
                        this.length = 1;
                        this[0] = elem;
                     }

                     this.context = document;
                     this.selector = selector;
                     return this;
                  }

                  // HANDLE: $(expr, $(...))
               } else if (!context || context.jquery) {
                  return (context || rootjQuery).find(selector);

                  // HANDLE: $(expr, context)
                  // (which is just equivalent to: $(context).find(expr)
               } else {
                  return this.constructor(context).find(selector);
               }

               // HANDLE: $(function)
               // Shortcut for document ready
            } else if (jQuery.isFunction(selector)) {
               return rootjQuery.ready(selector);
            }

            if (selector.selector !== undefined) {
               this.selector = selector.selector;
               this.context = selector.context;
            }

            return jQuery.makeArray(selector, this);
         },

         // Start with an empty selector
         selector: "",

         // The current version of jQuery being used
         jquery: "1.7.1",

         // The default length of a jQuery object is 0
         length: 0,

         // The number of elements contained in the matched element set
         size: function () {
            return this.length;
         },

         toArray: function () {
            return slice.call(this, 0);
         },

         // Get the Nth element in the matched element set OR
         // Get the whole matched element set as a clean array
         get: function (num) {
            return num == null ?

               // Return a 'clean' array
               this.toArray() :

               // Return just the object
               (num < 0 ? this[this.length + num] : this[num]);
         },

         // Take an array of elements and push it onto the stack
         // (returning the new matched element set)
         pushStack: function (elems, name, selector) {
            // Build a new jQuery matched element set
            var ret = this.constructor();

            if (jQuery.isArray(elems)) {
               push.apply(ret, elems);

            } else {
               jQuery.merge(ret, elems);
            }

            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;

            ret.context = this.context;

            if (name === "find") {
               ret.selector = this.selector + (this.selector ? " " : "") + selector;
            } else if (name) {
               ret.selector = this.selector + "." + name + "(" + selector + ")";
            }

            // Return the newly-formed element set
            return ret;
         },

         // Execute a callback for every element in the matched set.
         // (You can seed the arguments with an array of args, but this is
         // only used internally.)
         each: function (callback, args) {
            return jQuery.each(this, callback, args);
         },

         ready: function (fn) {
            // Attach the listeners
            jQuery.bindReady();

            // Add the callback
            readyList.add(fn);

            return this;
         },

         eq: function (i) {
            i = +i;
            return i === -1 ?
               this.slice(i) :
               this.slice(i, i + 1);
         },

         first: function () {
            return this.eq(0);
         },

         last: function () {
            return this.eq(-1);
         },

         slice: function () {
            return this.pushStack(slice.apply(this, arguments),
               "slice", slice.call(arguments).join(","));
         },

         map: function (callback) {
            return this.pushStack(jQuery.map(this, function (elem, i) {
               return callback.call(elem, i, elem);
            }));
         },

         end: function () {
            return this.prevObject || this.constructor(null);
         },

         // For internal use only.
         // Behaves like an Array's method, not like a jQuery method.
         push: push,
         sort: [].sort,
         splice: [].splice
      };

      // Give the init function the jQuery prototype for later instantiation
      jQuery.fn.init.prototype = jQuery.fn;

      jQuery.extend = jQuery.fn.extend = function () {
         var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

         // Handle a deep copy situation
         if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
         }

         // Handle case when target is a string or something (possible in deep copy)
         if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
         }

         // extend jQuery itself if only one argument is passed
         if (length === i) {
            target = this;
            --i;
         }

         for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
               // Extend the base object
               for (name in options) {
                  src = target[name];
                  copy = options[name];

                  // Prevent never-ending loop
                  if (target === copy) {
                     continue;
                  }

                  // Recurse if we're merging plain objects or arrays
                  if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                     if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : [];

                     } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                     }

                     // Never move original objects, clone them
                     target[name] = jQuery.extend(deep, clone, copy);

                     // Don't bring in undefined values
                  } else if (copy !== undefined) {
                     target[name] = copy;
                  }
               }
            }
         }

         // Return the modified object
         return target;
      };

      jQuery.extend({
         noConflict: function (deep) {
            if (window.$ === jQuery) {
               window.$ = _$;
            }

            if (deep && window.jQuery === jQuery) {
               window.jQuery = _jQuery;
            }

            return jQuery;
         },

         // Is the DOM ready to be used? Set to true once it occurs.
         isReady: false,

         // A counter to track how many items to wait for before
         // the ready event fires. See #6781
         readyWait: 1,

         // Hold (or release) the ready event
         holdReady: function (hold) {
            if (hold) {
               jQuery.readyWait++;
            } else {
               jQuery.ready(true);
            }
         },

         // Handle when the DOM is ready
         ready: function (wait) {
            // Either a released hold or an DOMready/load event and not yet ready
            if ((wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady)) {
               // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
               if (!document.body) {
                  return setTimeout(jQuery.ready, 1);
               }

               // Remember that the DOM is ready
               jQuery.isReady = true;

               // If a normal DOM Ready event fired, decrement, and wait if need be
               if (wait !== true && --jQuery.readyWait > 0) {
                  return;
               }

               // If there are functions bound, to execute
               readyList.fireWith(document, [jQuery]);

               // Trigger any bound ready events
               if (jQuery.fn.trigger) {
                  jQuery(document).trigger("ready").off("ready");
               }
            }
         },

         bindReady: function () {
            if (readyList) {
               return;
            }

            readyList = jQuery.Callbacks("once memory");

            // Catch cases where $(document).ready() is called after the
            // browser event has already occurred.
            if (document.readyState === "complete") {
               // Handle it asynchronously to allow scripts the opportunity to delay ready
               return setTimeout(jQuery.ready, 1);
            }

            // Mozilla, Opera and webkit nightlies currently support this event
            if (document.addEventListener) {
               // Use the handy event callback
               document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

               // A fallback to window.onload, that will always work
               window.addEventListener("load", jQuery.ready, false);

               // If IE event model is used
            } else if (document.attachEvent) {
               // ensure firing before onload,
               // maybe late but safe also for iframes
               document.attachEvent("onreadystatechange", DOMContentLoaded);

               // A fallback to window.onload, that will always work
               window.attachEvent("onload", jQuery.ready);

               // If IE and not a frame
               // continually check to see if the document is ready
               var toplevel = false;

               try {
                  toplevel = window.frameElement == null;
               } catch (e) { }

               if (document.documentElement.doScroll && toplevel) {
                  doScrollCheck();
               }
            }
         },

         // See test/unit/core.js for details concerning isFunction.
         // Since version 1.3, DOM methods and functions like alert
         // aren't supported. They return false on IE (#2968).
         isFunction: function (obj) {
            return jQuery.type(obj) === "function";
         },

         isArray: Array.isArray || function (obj) {
            return jQuery.type(obj) === "array";
         },

         // A crude way of determining if an object is a window
         isWindow: function (obj) {
            return obj && typeof obj === "object" && "setInterval" in obj;
         },

         isNumeric: function (obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
         },

         type: function (obj) {
            return obj == null ?
               String(obj) :
               class2type[toString.call(obj)] || "object";
         },

         isPlainObject: function (obj) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
               return false;
            }

            try {
               // Not own constructor property must be Object
               if (obj.constructor &&
                  !hasOwn.call(obj, "constructor") &&
                  !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                  return false;
               }
            } catch (e) {
               // IE8,9 Will throw exceptions on certain host objects #9897
               return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.

            var key;
            for (key in obj) { }

            return key === undefined || hasOwn.call(obj, key);
         },

         isEmptyObject: function (obj) {
            for (var name in obj) {
               return false;
            }
            return true;
         },

         error: function (msg) {
            throw new Error(msg);
         },

         parseJSON: function (data) {
            if (typeof data !== "string" || !data) {
               return null;
            }

            // Make sure leading/trailing whitespace is removed (IE can't handle it)
            data = jQuery.trim(data);

            // Attempt to parse using the native JSON parser first
            if (window.JSON && window.JSON.parse) {
               return window.JSON.parse(data);
            }

            // Make sure the incoming data is actual JSON
            // Logic borrowed from http://json.org/json2.js
            if (rvalidchars.test(data.replace(rvalidescape, "@")
               .replace(rvalidtokens, "]")
               .replace(rvalidbraces, ""))) {

               return (new Function("return " + data))();

            }
            jQuery.error("Invalid JSON: " + data);
         },

         // Cross-browser xml parsing
         parseXML: function (data) {
            var xml, tmp;
            try {
               if (window.DOMParser) { // Standard
                  tmp = new DOMParser();
                  xml = tmp.parseFromString(data, "text/xml");
               } else { // IE
                  xml = new ActiveXObject("Microsoft.XMLDOM");
                  xml.async = "false";
                  xml.loadXML(data);
               }
            } catch (e) {
               xml = undefined;
            }
            if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
               jQuery.error("Invalid XML: " + data);
            }
            return xml;
         },

         noop: function () { },

         // Evaluates a script in a global context
         // Workarounds based on findings by Jim Driscoll
         // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
         globalEval: function (data) {
            if (data && rnotwhite.test(data)) {
               // We use execScript on Internet Explorer
               // We use an anonymous function so that context is window
               // rather than jQuery in Firefox
               (window.execScript || function (data) {
                  window["eval"].call(window, data);
               })(data);
            }
         },

         // Convert dashed to camelCase; used by the css and data modules
         // Microsoft forgot to hump their vendor prefix (#9572)
         camelCase: function (string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
         },

         nodeName: function (elem, name) {
            return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
         },

         // args is for internal usage only
         each: function (object, callback, args) {
            var name, i = 0,
               length = object.length,
               isObj = length === undefined || jQuery.isFunction(object);

            if (args) {
               if (isObj) {
                  for (name in object) {
                     if (callback.apply(object[name], args) === false) {
                        break;
                     }
                  }
               } else {
                  for (; i < length;) {
                     if (callback.apply(object[i++], args) === false) {
                        break;
                     }
                  }
               }

               // A special, fast, case for the most common use of each
            } else {
               if (isObj) {
                  for (name in object) {
                     if (callback.call(object[name], name, object[name]) === false) {
                        break;
                     }
                  }
               } else {
                  for (; i < length;) {
                     if (callback.call(object[i], i, object[i++]) === false) {
                        break;
                     }
                  }
               }
            }

            return object;
         },

         // Use native String.trim function wherever possible
         trim: trim ?
            function (text) {
               return text == null ?
                  "" :
                  trim.call(text);
            } :

            // Otherwise use our own trimming functionality
            function (text) {
               return text == null ?
                  "" :
                  text.toString().replace(trimLeft, "").replace(trimRight, "");
            },

         // results is for internal usage only
         makeArray: function (array, results) {
            var ret = results || [];

            if (array != null) {
               // The window, strings (and functions) also have 'length'
               // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
               var type = jQuery.type(array);

               if (array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow(array)) {
                  push.call(ret, array);
               } else {
                  jQuery.merge(ret, array);
               }
            }

            return ret;
         },

         inArray: function (elem, array, i) {
            var len;

            if (array) {
               if (indexOf) {
                  return indexOf.call(array, elem, i);
               }

               len = array.length;
               i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

               for (; i < len; i++) {
                  // Skip accessing in sparse arrays
                  if (i in array && array[i] === elem) {
                     return i;
                  }
               }
            }

            return -1;
         },

         merge: function (first, second) {
            var i = first.length,
               j = 0;

            if (typeof second.length === "number") {
               for (var l = second.length; j < l; j++) {
                  first[i++] = second[j];
               }

            } else {
               while (second[j] !== undefined) {
                  first[i++] = second[j++];
               }
            }

            first.length = i;

            return first;
         },

         grep: function (elems, callback, inv) {
            var ret = [], retVal;
            inv = !!inv;

            // Go through the array, only saving the items
            // that pass the validator function
            for (var i = 0, length = elems.length; i < length; i++) {
               retVal = !!callback(elems[i], i);
               if (inv !== retVal) {
                  ret.push(elems[i]);
               }
            }

            return ret;
         },

         // arg is for internal usage only
         map: function (elems, callback, arg) {
            var value, key, ret = [],
               i = 0,
               length = elems.length,
               // jquery objects are treated as arrays
               isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ((length > 0 && elems[0] && elems[length - 1]) || length === 0 || jQuery.isArray(elems));

            // Go through the array, translating each of the items to their
            if (isArray) {
               for (; i < length; i++) {
                  value = callback(elems[i], i, arg);

                  if (value != null) {
                     ret[ret.length] = value;
                  }
               }

               // Go through every key on the object
            } else {
               for (key in elems) {
                  value = callback(elems[key], key, arg);

                  if (value != null) {
                     ret[ret.length] = value;
                  }
               }
            }

            // Flatten any nested arrays
            return ret.concat.apply([], ret);
         },

         // A global GUID counter for objects
         guid: 1,

         // Bind a function to a context, optionally partially applying any
         // arguments.
         proxy: function (fn, context) {
            if (typeof context === "string") {
               var tmp = fn[context];
               context = fn;
               fn = tmp;
            }

            // Quick check to determine if target is callable, in the spec
            // this throws a TypeError, but we will just return undefined.
            if (!jQuery.isFunction(fn)) {
               return undefined;
            }

            // Simulated bind
            var args = slice.call(arguments, 2),
               proxy = function () {
                  return fn.apply(context, args.concat(slice.call(arguments)));
               };

            // Set the guid of unique handler to the same of original handler, so it can be removed
            proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

            return proxy;
         },

         // Mutifunctional method to get and set values to a collection
         // The value/s can optionally be executed if it's a function
         access: function (elems, key, value, exec, fn, pass) {
            var length = elems.length;

            // Setting many attributes
            if (typeof key === "object") {
               for (var k in key) {
                  jQuery.access(elems, k, key[k], exec, fn, value);
               }
               return elems;
            }

            // Setting one attribute
            if (value !== undefined) {
               // Optionally, function values get executed if exec is true
               exec = !pass && exec && jQuery.isFunction(value);

               for (var i = 0; i < length; i++) {
                  fn(elems[i], key, exec ? value.call(elems[i], i, fn(elems[i], key)) : value, pass);
               }

               return elems;
            }

            // Getting an attribute
            return length ? fn(elems[0], key) : undefined;
         },

         now: function () {
            return (new Date()).getTime();
         },

         // Use of jQuery.browser is frowned upon.
         // More details: http://docs.jquery.com/Utilities/jQuery.browser
         uaMatch: function (ua) {
            ua = ua.toLowerCase();

            var match = rwebkit.exec(ua) ||
               ropera.exec(ua) ||
               rmsie.exec(ua) ||
               ua.indexOf("compatible") < 0 && rmozilla.exec(ua) ||
               [];

            return { browser: match[1] || "", version: match[2] || "0" };
         },

         sub: function () {
            function jQuerySub(selector, context) {
               return new jQuerySub.fn.init(selector, context);
            }
            jQuery.extend(true, jQuerySub, this);
            jQuerySub.superclass = this;
            jQuerySub.fn = jQuerySub.prototype = this();
            jQuerySub.fn.constructor = jQuerySub;
            jQuerySub.sub = this.sub;
            jQuerySub.fn.init = function init(selector, context) {
               if (context && context instanceof jQuery && !(context instanceof jQuerySub)) {
                  context = jQuerySub(context);
               }

               return jQuery.fn.init.call(this, selector, context, rootjQuerySub);
            };
            jQuerySub.fn.init.prototype = jQuerySub.fn;
            var rootjQuerySub = jQuerySub(document);
            return jQuerySub;
         },

         browser: {}
      });

      // Populate the class2type map
      jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (i, name) {
         class2type["[object " + name + "]"] = name.toLowerCase();
      });

      browserMatch = jQuery.uaMatch(userAgent);
      if (browserMatch.browser) {
         jQuery.browser[browserMatch.browser] = true;
         jQuery.browser.version = browserMatch.version;
      }

      // Deprecated, use jQuery.browser.webkit instead
      if (jQuery.browser.webkit) {
         jQuery.browser.safari = true;
      }

      // IE doesn't match non-breaking spaces with \s
      if (rnotwhite.test("\xA0")) {
         trimLeft = /^[\s\xA0]+/;
         trimRight = /[\s\xA0]+$/;
      }

      // All jQuery objects should point back to these
      rootjQuery = jQuery(document);

      // Cleanup functions for the document ready method
      if (document.addEventListener) {
         DOMContentLoaded = function () {
            document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
            jQuery.ready();
         };

      } else if (document.attachEvent) {
         DOMContentLoaded = function () {
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if (document.readyState === "complete") {
               document.detachEvent("onreadystatechange", DOMContentLoaded);
               jQuery.ready();
            }
         };
      }

      // The DOM ready check for Internet Explorer
      function doScrollCheck() {
         if (jQuery.isReady) {
            return;
         }

         try {
            // If IE is used, use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            document.documentElement.doScroll("left");
         } catch (e) {
            setTimeout(doScrollCheck, 1);
            return;
         }

         // and execute any waiting functions
         jQuery.ready();
      }

      return jQuery;

   })();


   // String to Object flags format cache
   var flagsCache = {};

   // Convert String-formatted flags into Object-formatted ones and store in cache
   function createFlags(flags) {
      var object = flagsCache[flags] = {},
         i, length;
      flags = flags.split(/\s+/);
      for (i = 0, length = flags.length; i < length; i++) {
         object[flags[i]] = true;
      }
      return object;
   }

   /*
    * Create a callback list using the following parameters:
    *
    *	flags:	an optional list of space-separated flags that will change how
    *			the callback list behaves
    *
    * By default a callback list will act like an event callback list and can be
    * "fired" multiple times.
    *
    * Possible flags:
    *
    *	once:			will ensure the callback list can only be fired once (like a Deferred)
    *
    *	memory:			will keep track of previous values and will call any callback added
    *					after the list has been fired right away with the latest "memorized"
    *					values (like a Deferred)
    *
    *	unique:			will ensure a callback can only be added once (no duplicate in the list)
    *
    *	stopOnFalse:	interrupt callings when a callback returns false
    *
    */
   jQuery.Callbacks = function (flags) {

      // Convert flags from String-formatted to Object-formatted
      // (we check in cache first)
      flags = flags ? (flagsCache[flags] || createFlags(flags)) : {};

      var // Actual callback list
         list = [],
         // Stack of fire calls for repeatable lists
         stack = [],
         // Last fire value (for non-forgettable lists)
         memory,
         // Flag to know if list is currently firing
         firing,
         // First callback to fire (used internally by add and fireWith)
         firingStart,
         // End of the loop when firing
         firingLength,
         // Index of currently firing callback (modified by remove if needed)
         firingIndex,
         // Add one or several callbacks to the list
         add = function (args) {
            var i,
               length,
               elem,
               type,
               actual;
            for (i = 0, length = args.length; i < length; i++) {
               elem = args[i];
               type = jQuery.type(elem);
               if (type === "array") {
                  // Inspect recursively
                  add(elem);
               } else if (type === "function") {
                  // Add if not in unique mode and callback is not in
                  if (!flags.unique || !self.has(elem)) {
                     list.push(elem);
                  }
               }
            }
         },
         // Fire callbacks
         fire = function (context, args) {
            args = args || [];
            memory = !flags.memory || [context, args];
            firing = true;
            firingIndex = firingStart || 0;
            firingStart = 0;
            firingLength = list.length;
            for (; list && firingIndex < firingLength; firingIndex++) {
               if (list[firingIndex].apply(context, args) === false && flags.stopOnFalse) {
                  memory = true; // Mark as halted
                  break;
               }
            }
            firing = false;
            if (list) {
               if (!flags.once) {
                  if (stack && stack.length) {
                     memory = stack.shift();
                     self.fireWith(memory[0], memory[1]);
                  }
               } else if (memory === true) {
                  self.disable();
               } else {
                  list = [];
               }
            }
         },
         // Actual Callbacks object
         self = {
            // Add a callback or a collection of callbacks to the list
            add: function () {
               if (list) {
                  var length = list.length;
                  add(arguments);
                  // Do we need to add the callbacks to the
                  // current firing batch?
                  if (firing) {
                     firingLength = list.length;
                     // With memory, if we're not firing then
                     // we should call right away, unless previous
                     // firing was halted (stopOnFalse)
                  } else if (memory && memory !== true) {
                     firingStart = length;
                     fire(memory[0], memory[1]);
                  }
               }
               return this;
            },
            // Remove a callback from the list
            remove: function () {
               if (list) {
                  var args = arguments,
                     argIndex = 0,
                     argLength = args.length;
                  for (; argIndex < argLength; argIndex++) {
                     for (var i = 0; i < list.length; i++) {
                        if (args[argIndex] === list[i]) {
                           // Handle firingIndex and firingLength
                           if (firing) {
                              if (i <= firingLength) {
                                 firingLength--;
                                 if (i <= firingIndex) {
                                    firingIndex--;
                                 }
                              }
                           }
                           // Remove the element
                           list.splice(i--, 1);
                           // If we have some unicity property then
                           // we only need to do this once
                           if (flags.unique) {
                              break;
                           }
                        }
                     }
                  }
               }
               return this;
            },
            // Control if a given callback is in the list
            has: function (fn) {
               if (list) {
                  var i = 0,
                     length = list.length;
                  for (; i < length; i++) {
                     if (fn === list[i]) {
                        return true;
                     }
                  }
               }
               return false;
            },
            // Remove all callbacks from the list
            empty: function () {
               list = [];
               return this;
            },
            // Have the list do nothing anymore
            disable: function () {
               list = stack = memory = undefined;
               return this;
            },
            // Is it disabled?
            disabled: function () {
               return !list;
            },
            // Lock the list in its current state
            lock: function () {
               stack = undefined;
               if (!memory || memory === true) {
                  self.disable();
               }
               return this;
            },
            // Is it locked?
            locked: function () {
               return !stack;
            },
            // Call all callbacks with the given context and arguments
            fireWith: function (context, args) {
               if (stack) {
                  if (firing) {
                     if (!flags.once) {
                        stack.push([context, args]);
                     }
                  } else if (!(flags.once && memory)) {
                     fire(context, args);
                  }
               }
               return this;
            },
            // Call all the callbacks with the given arguments
            fire: function () {
               self.fireWith(this, arguments);
               return this;
            },
            // To know if the callbacks have already been called at least once
            fired: function () {
               return !!memory;
            }
         };

      return self;
   };




   var // Static reference to slice
      sliceDeferred = [].slice;

   jQuery.extend({

      Deferred: function (func) {
         var doneList = jQuery.Callbacks("once memory"),
            failList = jQuery.Callbacks("once memory"),
            progressList = jQuery.Callbacks("memory"),
            state = "pending",
            lists = {
               resolve: doneList,
               reject: failList,
               notify: progressList
            },
            promise = {
               done: doneList.add,
               fail: failList.add,
               progress: progressList.add,

               state: function () {
                  return state;
               },

               // Deprecated
               isResolved: doneList.fired,
               isRejected: failList.fired,

               then: function (doneCallbacks, failCallbacks, progressCallbacks) {
                  deferred.done(doneCallbacks).fail(failCallbacks).progress(progressCallbacks);
                  return this;
               },
               always: function () {
                  deferred.done.apply(deferred, arguments).fail.apply(deferred, arguments);
                  return this;
               },
               pipe: function (fnDone, fnFail, fnProgress) {
                  return jQuery.Deferred(function (newDefer) {
                     jQuery.each({
                        done: [fnDone, "resolve"],
                        fail: [fnFail, "reject"],
                        progress: [fnProgress, "notify"]
                     }, function (handler, data) {
                        var fn = data[0],
                           action = data[1],
                           returned;
                        if (jQuery.isFunction(fn)) {
                           deferred[handler](function () {
                              returned = fn.apply(this, arguments);
                              if (returned && jQuery.isFunction(returned.promise)) {
                                 returned.promise().then(newDefer.resolve, newDefer.reject, newDefer.notify);
                              } else {
                                 newDefer[action + "With"](this === deferred ? newDefer : this, [returned]);
                              }
                           });
                        } else {
                           deferred[handler](newDefer[action]);
                        }
                     });
                  }).promise();
               },
               // Get a promise for this deferred
               // If obj is provided, the promise aspect is added to the object
               promise: function (obj) {
                  if (obj == null) {
                     obj = promise;
                  } else {
                     for (var key in promise) {
                        obj[key] = promise[key];
                     }
                  }
                  return obj;
               }
            },
            deferred = promise.promise({}),
            key;

         for (key in lists) {
            deferred[key] = lists[key].fire;
            deferred[key + "With"] = lists[key].fireWith;
         }

         // Handle state
         deferred.done(function () {
            state = "resolved";
         }, failList.disable, progressList.lock).fail(function () {
            state = "rejected";
         }, doneList.disable, progressList.lock);

         // Call given func if any
         if (func) {
            func.call(deferred, deferred);
         }

         // All done!
         return deferred;
      },

      // Deferred helper
      when: function (firstParam) {
         var args = sliceDeferred.call(arguments, 0),
            i = 0,
            length = args.length,
            pValues = new Array(length),
            count = length,
            pCount = length,
            deferred = length <= 1 && firstParam && jQuery.isFunction(firstParam.promise) ?
               firstParam :
               jQuery.Deferred(),
            promise = deferred.promise();
         function resolveFunc(i) {
            return function (value) {
               args[i] = arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value;
               if (!(--count)) {
                  deferred.resolveWith(deferred, args);
               }
            };
         }
         function progressFunc(i) {
            return function (value) {
               pValues[i] = arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value;
               deferred.notifyWith(promise, pValues);
            };
         }
         if (length > 1) {
            for (; i < length; i++) {
               if (args[i] && args[i].promise && jQuery.isFunction(args[i].promise)) {
                  args[i].promise().then(resolveFunc(i), deferred.reject, progressFunc(i));
               } else {
                  --count;
               }
            }
            if (!count) {
               deferred.resolveWith(deferred, args);
            }
         } else if (deferred !== firstParam) {
            deferred.resolveWith(deferred, length ? [firstParam] : []);
         }
         return promise;
      }
   });




   jQuery.support = (function () {

      var support,
         all,
         a,
         select,
         opt,
         input,
         marginDiv,
         fragment,
         tds,
         events,
         eventName,
         i,
         isSupported,
         div = document.createElement("div"),
         documentElement = document.documentElement;

      // Preliminary tests
      div.setAttribute("className", "t");
      div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

      all = div.getElementsByTagName("*");
      a = div.getElementsByTagName("a")[0];

      // Can't get basic test support
      if (!all || !all.length || !a) {
         return {};
      }

      // First batch of supports tests
      select = document.createElement("select");
      opt = select.appendChild(document.createElement("option"));
      input = div.getElementsByTagName("input")[0];

      support = {
         // IE strips leading whitespace when .innerHTML is used
         leadingWhitespace: (div.firstChild.nodeType === 3),

         // Make sure that tbody elements aren't automatically inserted
         // IE will insert them into empty tables
         tbody: !div.getElementsByTagName("tbody").length,

         // Make sure that link elements get serialized correctly by innerHTML
         // This requires a wrapper element in IE
         htmlSerialize: !!div.getElementsByTagName("link").length,

         // Get the style information from getAttribute
         // (IE uses .cssText instead)
         style: /top/.test(a.getAttribute("style")),

         // Make sure that URLs aren't manipulated
         // (IE normalizes it by default)
         hrefNormalized: (a.getAttribute("href") === "/a"),

         // Make sure that element opacity exists
         // (IE uses filter instead)
         // Use a regex to work around a WebKit issue. See #5145
         opacity: /^0.55/.test(a.style.opacity),

         // Verify style float existence
         // (IE uses styleFloat instead of cssFloat)
         cssFloat: !!a.style.cssFloat,

         // Make sure that if no value is specified for a checkbox
         // that it defaults to "on".
         // (WebKit defaults to "" instead)
         checkOn: (input.value === "on"),

         // Make sure that a selected-by-default option has a working selected property.
         // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
         optSelected: opt.selected,

         // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
         getSetAttribute: div.className !== "t",

         // Tests for enctype support on a form(#6743)
         enctype: !!document.createElement("form").enctype,

         // Makes sure cloning an html5 element does not cause problems
         // Where outerHTML is undefined, this still works
         html5Clone: document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>",

         // Will be defined later
         submitBubbles: true,
         changeBubbles: true,
         focusinBubbles: false,
         deleteExpando: true,
         noCloneEvent: true,
         inlineBlockNeedsLayout: false,
         shrinkWrapBlocks: false,
         reliableMarginRight: true
      };

      // Make sure checked status is properly cloned
      input.checked = true;
      support.noCloneChecked = input.cloneNode(true).checked;

      // Make sure that the options inside disabled selects aren't marked as disabled
      // (WebKit marks them as disabled)
      select.disabled = true;
      support.optDisabled = !opt.disabled;

      // Test to see if it's possible to delete an expando from an element
      // Fails in Internet Explorer
      try {
         delete div.test;
      } catch (e) {
         support.deleteExpando = false;
      }

      if (!div.addEventListener && div.attachEvent && div.fireEvent) {
         div.attachEvent("onclick", function () {
            // Cloning a node shouldn't copy over any
            // bound event handlers (IE does this)
            support.noCloneEvent = false;
         });
         div.cloneNode(true).fireEvent("onclick");
      }

      // Check if a radio maintains its value
      // after being appended to the DOM
      input = document.createElement("input");
      input.value = "t";
      input.setAttribute("type", "radio");
      support.radioValue = input.value === "t";

      input.setAttribute("checked", "checked");
      div.appendChild(input);
      fragment = document.createDocumentFragment();
      fragment.appendChild(div.lastChild);

      // WebKit doesn't clone checked state correctly in fragments
      support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

      // Check if a disconnected checkbox will retain its checked
      // value of true after appended to the DOM (IE6/7)
      support.appendChecked = input.checked;

      fragment.removeChild(input);
      fragment.appendChild(div);

      div.innerHTML = "";

      // Check if div with explicit width and no margin-right incorrectly
      // gets computed margin-right based on width of container. For more
      // info see bug #3333
      // Fails in WebKit before Feb 2011 nightlies
      // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
      if (window.getComputedStyle) {
         marginDiv = document.createElement("div");
         marginDiv.style.width = "0";
         marginDiv.style.marginRight = "0";
         div.style.width = "2px";
         div.appendChild(marginDiv);
         support.reliableMarginRight =
            (parseInt((window.getComputedStyle(marginDiv, null) || { marginRight: 0 }).marginRight, 10) || 0) === 0;
      }

      // Technique from Juriy Zaytsev
      // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
      // We only care about the case where non-standard event systems
      // are used, namely in IE. Short-circuiting here helps us to
      // avoid an eval call (in setAttribute) which can cause CSP
      // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
      if (div.attachEvent) {
         for (i in {
            submit: 1,
            change: 1,
            focusin: 1
         }) {
            eventName = "on" + i;
            isSupported = (eventName in div);
            if (!isSupported) {
               div.setAttribute(eventName, "return;");
               isSupported = (typeof div[eventName] === "function");
            }
            support[i + "Bubbles"] = isSupported;
         }
      }

      fragment.removeChild(div);

      // Null elements to avoid leaks in IE
      fragment = select = opt = marginDiv = div = input = null;

      // Run tests that need a body at doc ready
      jQuery(function () {
         var container, outer, inner, table, td, offsetSupport,
            conMarginTop, ptlm, vb, style, html,
            body = document.getElementsByTagName("body")[0];

         if (!body) {
            // Return for frameset docs that don't have a body
            return;
         }

         conMarginTop = 1;
         ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
         vb = "visibility:hidden;border:0;";
         style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
         html = "<div " + style + "><div></div></div>" +
            "<table " + style + " cellpadding='0' cellspacing='0'>" +
            "<tr><td></td></tr></table>";

         container = document.createElement("div");
         container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
         body.insertBefore(container, body.firstChild);

         // Construct the test element
         div = document.createElement("div");
         container.appendChild(div);

         // Check if table cells still have offsetWidth/Height when they are set
         // to display:none and there are still other visible table cells in a
         // table row; if so, offsetWidth/Height are not reliable for use when
         // determining if an element has been hidden directly using
         // display:none (it is still safe to use offsets if a parent element is
         // hidden; don safety goggles and see bug #4512 for more information).
         // (only IE 8 fails this test)
         div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
         tds = div.getElementsByTagName("td");
         isSupported = (tds[0].offsetHeight === 0);

         tds[0].style.display = "";
         tds[1].style.display = "none";

         // Check if empty table cells still have offsetWidth/Height
         // (IE <= 8 fail this test)
         support.reliableHiddenOffsets = isSupported && (tds[0].offsetHeight === 0);

         // Figure out if the W3C box model works as expected
         div.innerHTML = "";
         div.style.width = div.style.paddingLeft = "1px";
         jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

         if (typeof div.style.zoom !== "undefined") {
            // Check if natively block-level elements act like inline-block
            // elements when setting their display to 'inline' and giving
            // them layout
            // (IE < 8 does this)
            div.style.display = "inline";
            div.style.zoom = 1;
            support.inlineBlockNeedsLayout = (div.offsetWidth === 2);

            // Check if elements with layout shrink-wrap their children
            // (IE 6 does this)
            div.style.display = "";
            div.innerHTML = "<div style='width:4px;'></div>";
            support.shrinkWrapBlocks = (div.offsetWidth !== 2);
         }

         div.style.cssText = ptlm + vb;
         div.innerHTML = html;

         outer = div.firstChild;
         inner = outer.firstChild;
         td = outer.nextSibling.firstChild.firstChild;

         offsetSupport = {
            doesNotAddBorder: (inner.offsetTop !== 5),
            doesAddBorderForTableAndCells: (td.offsetTop === 5)
         };

         inner.style.position = "fixed";
         inner.style.top = "20px";

         // safari subtracts parent border width here which is 5px
         offsetSupport.fixedPosition = (inner.offsetTop === 20 || inner.offsetTop === 15);
         inner.style.position = inner.style.top = "";

         outer.style.overflow = "hidden";
         outer.style.position = "relative";

         offsetSupport.subtractsBorderForOverflowNotVisible = (inner.offsetTop === -5);
         offsetSupport.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== conMarginTop);

         body.removeChild(container);
         div = container = null;

         jQuery.extend(support, offsetSupport);
      });

      return support;
   })();




   var rbrace = /^(?:\{.*\}|\[.*\])$/,
      rmultiDash = /([A-Z])/g;

   jQuery.extend({
      cache: {},

      // Please use with caution
      uuid: 0,

      // Unique for each copy of jQuery on the page
      // Non-digits removed to match rinlinejQuery
      expando: "jQuery" + (jQuery.fn.jquery + Math.random()).replace(/\D/g, ""),

      // The following elements throw uncatchable exceptions if you
      // attempt to add expando properties to them.
      noData: {
         "embed": true,
         // Ban all objects except for Flash (which handle expandos)
         "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
         "applet": true
      },

      hasData: function (elem) {
         elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
         return !!elem && !isEmptyDataObject(elem);
      },

      data: function (elem, name, data, pvt /* Internal Use Only */) {
         if (!jQuery.acceptData(elem)) {
            return;
         }

         var privateCache, thisCache, ret,
            internalKey = jQuery.expando,
            getByName = typeof name === "string",

            // We have to handle DOM nodes and JS objects differently because IE6-7
            // can't GC object references properly across the DOM-JS boundary
            isNode = elem.nodeType,

            // Only DOM nodes need the global jQuery cache; JS object data is
            // attached directly to the object so GC can occur automatically
            cache = isNode ? jQuery.cache : elem,

            // Only defining an ID for JS objects if its cache already exists allows
            // the code to shortcut on the same path as a DOM node with no cache
            id = isNode ? elem[internalKey] : elem[internalKey] && internalKey,
            isEvents = name === "events";

         // Avoid doing any more work than we need to when trying to get data on an
         // object that has no data at all
         if ((!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined) {
            return;
         }

         if (!id) {
            // Only DOM nodes need a new unique ID for each element since their data
            // ends up in the global cache
            if (isNode) {
               elem[internalKey] = id = ++jQuery.uuid;
            } else {
               id = internalKey;
            }
         }

         if (!cache[id]) {
            cache[id] = {};

            // Avoids exposing jQuery metadata on plain JS objects when the object
            // is serialized using JSON.stringify
            if (!isNode) {
               cache[id].toJSON = jQuery.noop;
            }
         }

         // An object can be passed to jQuery.data instead of a key/value pair; this gets
         // shallow copied over onto the existing cache
         if (typeof name === "object" || typeof name === "function") {
            if (pvt) {
               cache[id] = jQuery.extend(cache[id], name);
            } else {
               cache[id].data = jQuery.extend(cache[id].data, name);
            }
         }

         privateCache = thisCache = cache[id];

         // jQuery data() is stored in a separate object inside the object's internal data
         // cache in order to avoid key collisions between internal data and user-defined
         // data.
         if (!pvt) {
            if (!thisCache.data) {
               thisCache.data = {};
            }

            thisCache = thisCache.data;
         }

         if (data !== undefined) {
            thisCache[jQuery.camelCase(name)] = data;
         }

         // Users should not attempt to inspect the internal events object using jQuery.data,
         // it is undocumented and subject to change. But does anyone listen? No.
         if (isEvents && !thisCache[name]) {
            return privateCache.events;
         }

         // Check for both converted-to-camel and non-converted data property names
         // If a data property was specified
         if (getByName) {

            // First Try to find as-is property data
            ret = thisCache[name];

            // Test for null|undefined property data
            if (ret == null) {

               // Try to find the camelCased property
               ret = thisCache[jQuery.camelCase(name)];
            }
         } else {
            ret = thisCache;
         }

         return ret;
      },

      removeData: function (elem, name, pvt /* Internal Use Only */) {
         if (!jQuery.acceptData(elem)) {
            return;
         }

         var thisCache, i, l,

            // Reference to internal data cache key
            internalKey = jQuery.expando,

            isNode = elem.nodeType,

            // See jQuery.data for more information
            cache = isNode ? jQuery.cache : elem,

            // See jQuery.data for more information
            id = isNode ? elem[internalKey] : internalKey;

         // If there is already no cache entry for this object, there is no
         // purpose in continuing
         if (!cache[id]) {
            return;
         }

         if (name) {

            thisCache = pvt ? cache[id] : cache[id].data;

            if (thisCache) {

               // Support array or space separated string names for data keys
               if (!jQuery.isArray(name)) {

                  // try the string as a key before any manipulation
                  if (name in thisCache) {
                     name = [name];
                  } else {

                     // split the camel cased version by spaces unless a key with the spaces exists
                     name = jQuery.camelCase(name);
                     if (name in thisCache) {
                        name = [name];
                     } else {
                        name = name.split(" ");
                     }
                  }
               }

               for (i = 0, l = name.length; i < l; i++) {
                  delete thisCache[name[i]];
               }

               // If there is no data left in the cache, we want to continue
               // and let the cache object itself get destroyed
               if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache)) {
                  return;
               }
            }
         }

         // See jQuery.data for more information
         if (!pvt) {
            delete cache[id].data;

            // Don't destroy the parent cache unless the internal data object
            // had been the only thing left in it
            if (!isEmptyDataObject(cache[id])) {
               return;
            }
         }

         // Browsers that fail expando deletion also refuse to delete expandos on
         // the window, but it will allow it on all other JS objects; other browsers
         // don't care
         // Ensure that `cache` is not a window object #10080
         if (jQuery.support.deleteExpando || !cache.setInterval) {
            delete cache[id];
         } else {
            cache[id] = null;
         }

         // We destroyed the cache and need to eliminate the expando on the node to avoid
         // false lookups in the cache for entries that no longer exist
         if (isNode) {
            // IE does not allow us to delete expando properties from nodes,
            // nor does it have a removeAttribute function on Document nodes;
            // we must handle all of these cases
            if (jQuery.support.deleteExpando) {
               delete elem[internalKey];
            } else if (elem.removeAttribute) {
               elem.removeAttribute(internalKey);
            } else {
               elem[internalKey] = null;
            }
         }
      },

      // For internal use only.
      _data: function (elem, name, data) {
         return jQuery.data(elem, name, data, true);
      },

      // A method for determining if a DOM node can handle the data expando
      acceptData: function (elem) {
         if (elem.nodeName) {
            var match = jQuery.noData[elem.nodeName.toLowerCase()];

            if (match) {
               return !(match === true || elem.getAttribute("classid") !== match);
            }
         }

         return true;
      }
   });

   jQuery.fn.extend({
      data: function (key, value) {
         var parts, attr, name,
            data = null;

         if (typeof key === "undefined") {
            if (this.length) {
               data = jQuery.data(this[0]);

               if (this[0].nodeType === 1 && !jQuery._data(this[0], "parsedAttrs")) {
                  attr = this[0].attributes;
                  for (var i = 0, l = attr.length; i < l; i++) {
                     name = attr[i].name;

                     if (name.indexOf("data-") === 0) {
                        name = jQuery.camelCase(name.substring(5));

                        dataAttr(this[0], name, data[name]);
                     }
                  }
                  jQuery._data(this[0], "parsedAttrs", true);
               }
            }

            return data;

         } else if (typeof key === "object") {
            return this.each(function () {
               jQuery.data(this, key);
            });
         }

         parts = key.split(".");
         parts[1] = parts[1] ? "." + parts[1] : "";

         if (value === undefined) {
            data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

            // Try to fetch any internally stored data first
            if (data === undefined && this.length) {
               data = jQuery.data(this[0], key);
               data = dataAttr(this[0], key, data);
            }

            return data === undefined && parts[1] ?
               this.data(parts[0]) :
               data;

         } else {
            return this.each(function () {
               var self = jQuery(this),
                  args = [parts[0], value];

               self.triggerHandler("setData" + parts[1] + "!", args);
               jQuery.data(this, key, value);
               self.triggerHandler("changeData" + parts[1] + "!", args);
            });
         }
      },

      removeData: function (key) {
         return this.each(function () {
            jQuery.removeData(this, key);
         });
      }
   });

   function dataAttr(elem, key, data) {
      // If nothing was found internally, try to fetch any
      // data from the HTML5 data-* attribute
      if (data === undefined && elem.nodeType === 1) {

         var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();

         data = elem.getAttribute(name);

         if (typeof data === "string") {
            try {
               data = data === "true" ? true :
                  data === "false" ? false :
                     data === "null" ? null :
                        jQuery.isNumeric(data) ? parseFloat(data) :
                           rbrace.test(data) ? jQuery.parseJSON(data) :
                              data;
            } catch (e) { }

            // Make sure we set the data so it isn't changed later
            jQuery.data(elem, key, data);

         } else {
            data = undefined;
         }
      }

      return data;
   }

   // checks a cache object for emptiness
   function isEmptyDataObject(obj) {
      for (var name in obj) {

         // if the public data object is empty, the private is still empty
         if (name === "data" && jQuery.isEmptyObject(obj[name])) {
            continue;
         }
         if (name !== "toJSON") {
            return false;
         }
      }

      return true;
   }




   function handleQueueMarkDefer(elem, type, src) {
      var deferDataKey = type + "defer",
         queueDataKey = type + "queue",
         markDataKey = type + "mark",
         defer = jQuery._data(elem, deferDataKey);
      if (defer &&
         (src === "queue" || !jQuery._data(elem, queueDataKey)) &&
         (src === "mark" || !jQuery._data(elem, markDataKey))) {
         // Give room for hard-coded callbacks to fire first
         // and eventually mark/queue something else on the element
         setTimeout(function () {
            if (!jQuery._data(elem, queueDataKey) &&
               !jQuery._data(elem, markDataKey)) {
               jQuery.removeData(elem, deferDataKey, true);
               defer.fire();
            }
         }, 0);
      }
   }

   jQuery.extend({

      _mark: function (elem, type) {
         if (elem) {
            type = (type || "fx") + "mark";
            jQuery._data(elem, type, (jQuery._data(elem, type) || 0) + 1);
         }
      },

      _unmark: function (force, elem, type) {
         if (force !== true) {
            type = elem;
            elem = force;
            force = false;
         }
         if (elem) {
            type = type || "fx";
            var key = type + "mark",
               count = force ? 0 : ((jQuery._data(elem, key) || 1) - 1);
            if (count) {
               jQuery._data(elem, key, count);
            } else {
               jQuery.removeData(elem, key, true);
               handleQueueMarkDefer(elem, type, "mark");
            }
         }
      },

      queue: function (elem, type, data) {
         var q;
         if (elem) {
            type = (type || "fx") + "queue";
            q = jQuery._data(elem, type);

            // Speed up dequeue by getting out quickly if this is just a lookup
            if (data) {
               if (!q || jQuery.isArray(data)) {
                  q = jQuery._data(elem, type, jQuery.makeArray(data));
               } else {
                  q.push(data);
               }
            }
            return q || [];
         }
      },

      dequeue: function (elem, type) {
         type = type || "fx";

         var queue = jQuery.queue(elem, type),
            fn = queue.shift(),
            hooks = {};

         // If the fx queue is dequeued, always remove the progress sentinel
         if (fn === "inprogress") {
            fn = queue.shift();
         }

         if (fn) {
            // Add a progress sentinel to prevent the fx queue from being
            // automatically dequeued
            if (type === "fx") {
               queue.unshift("inprogress");
            }

            jQuery._data(elem, type + ".run", hooks);
            fn.call(elem, function () {
               jQuery.dequeue(elem, type);
            }, hooks);
         }

         if (!queue.length) {
            jQuery.removeData(elem, type + "queue " + type + ".run", true);
            handleQueueMarkDefer(elem, type, "queue");
         }
      }
   });

   jQuery.fn.extend({
      queue: function (type, data) {
         if (typeof type !== "string") {
            data = type;
            type = "fx";
         }

         if (data === undefined) {
            return jQuery.queue(this[0], type);
         }
         return this.each(function () {
            var queue = jQuery.queue(this, type, data);

            if (type === "fx" && queue[0] !== "inprogress") {
               jQuery.dequeue(this, type);
            }
         });
      },
      dequeue: function (type) {
         return this.each(function () {
            jQuery.dequeue(this, type);
         });
      },
      // Based off of the plugin by Clint Helfers, with permission.
      // http://blindsignals.com/index.php/2009/07/jquery-delay/
      delay: function (time, type) {
         time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
         type = type || "fx";

         return this.queue(type, function (next, hooks) {
            var timeout = setTimeout(next, time);
            hooks.stop = function () {
               clearTimeout(timeout);
            };
         });
      },
      clearQueue: function (type) {
         return this.queue(type || "fx", []);
      },
      // Get a promise resolved when queues of a certain type
      // are emptied (fx is the type by default)
      promise: function (type, object) {
         if (typeof type !== "string") {
            object = type;
            type = undefined;
         }
         type = type || "fx";
         var defer = jQuery.Deferred(),
            elements = this,
            i = elements.length,
            count = 1,
            deferDataKey = type + "defer",
            queueDataKey = type + "queue",
            markDataKey = type + "mark",
            tmp;
         function resolve() {
            if (!(--count)) {
               defer.resolveWith(elements, [elements]);
            }
         }
         while (i--) {
            if ((tmp = jQuery.data(elements[i], deferDataKey, undefined, true) ||
               (jQuery.data(elements[i], queueDataKey, undefined, true) ||
                  jQuery.data(elements[i], markDataKey, undefined, true)) &&
               jQuery.data(elements[i], deferDataKey, jQuery.Callbacks("once memory"), true))) {
               count++;
               tmp.add(resolve);
            }
         }
         resolve();
         return defer.promise();
      }
   });




   var rclass = /[\n\t\r]/g,
      rspace = /\s+/,
      rreturn = /\r/g,
      rtype = /^(?:button|input)$/i,
      rfocusable = /^(?:button|input|object|select|textarea)$/i,
      rclickable = /^a(?:rea)?$/i,
      rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
      getSetAttribute = jQuery.support.getSetAttribute,
      nodeHook, boolHook, fixSpecified;

   jQuery.fn.extend({
      attr: function (name, value) {
         return jQuery.access(this, name, value, true, jQuery.attr);
      },

      removeAttr: function (name) {
         return this.each(function () {
            jQuery.removeAttr(this, name);
         });
      },

      prop: function (name, value) {
         return jQuery.access(this, name, value, true, jQuery.prop);
      },

      removeProp: function (name) {
         name = jQuery.propFix[name] || name;
         return this.each(function () {
            // try/catch handles cases where IE balks (such as removing a property on window)
            try {
               this[name] = undefined;
               delete this[name];
            } catch (e) { }
         });
      },

      addClass: function (value) {
         var classNames, i, l, elem,
            setClass, c, cl;

         if (jQuery.isFunction(value)) {
            return this.each(function (j) {
               jQuery(this).addClass(value.call(this, j, this.className));
            });
         }

         if (value && typeof value === "string") {
            classNames = value.split(rspace);

            for (i = 0, l = this.length; i < l; i++) {
               elem = this[i];

               if (elem.nodeType === 1) {
                  if (!elem.className && classNames.length === 1) {
                     elem.className = value;

                  } else {
                     setClass = " " + elem.className + " ";

                     for (c = 0, cl = classNames.length; c < cl; c++) {
                        if (!~setClass.indexOf(" " + classNames[c] + " ")) {
                           setClass += classNames[c] + " ";
                        }
                     }
                     elem.className = jQuery.trim(setClass);
                  }
               }
            }
         }

         return this;
      },

      removeClass: function (value) {
         var classNames, i, l, elem, className, c, cl;

         if (jQuery.isFunction(value)) {
            return this.each(function (j) {
               jQuery(this).removeClass(value.call(this, j, this.className));
            });
         }

         if ((value && typeof value === "string") || value === undefined) {
            classNames = (value || "").split(rspace);

            for (i = 0, l = this.length; i < l; i++) {
               elem = this[i];

               if (elem.nodeType === 1 && elem.className) {
                  if (value) {
                     className = (" " + elem.className + " ").replace(rclass, " ");
                     for (c = 0, cl = classNames.length; c < cl; c++) {
                        className = className.replace(" " + classNames[c] + " ", " ");
                     }
                     elem.className = jQuery.trim(className);

                  } else {
                     elem.className = "";
                  }
               }
            }
         }

         return this;
      },

      toggleClass: function (value, stateVal) {
         var type = typeof value,
            isBool = typeof stateVal === "boolean";

         if (jQuery.isFunction(value)) {
            return this.each(function (i) {
               jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
            });
         }

         return this.each(function () {
            if (type === "string") {
               // toggle individual class names
               var className,
                  i = 0,
                  self = jQuery(this),
                  state = stateVal,
                  classNames = value.split(rspace);

               while ((className = classNames[i++])) {
                  // check each className given, space seperated list
                  state = isBool ? state : !self.hasClass(className);
                  self[state ? "addClass" : "removeClass"](className);
               }

            } else if (type === "undefined" || type === "boolean") {
               if (this.className) {
                  // store className if set
                  jQuery._data(this, "__className__", this.className);
               }

               // toggle whole className
               this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || "";
            }
         });
      },

      hasClass: function (selector) {
         var className = " " + selector + " ",
            i = 0,
            l = this.length;
         for (; i < l; i++) {
            if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) > -1) {
               return true;
            }
         }

         return false;
      },

      val: function (value) {
         var hooks, ret, isFunction,
            elem = this[0];

         if (!arguments.length) {
            if (elem) {
               hooks = jQuery.valHooks[elem.nodeName.toLowerCase()] || jQuery.valHooks[elem.type];

               if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
                  return ret;
               }

               ret = elem.value;

               return typeof ret === "string" ?
                  // handle most common string cases
                  ret.replace(rreturn, "") :
                  // handle cases where value is null/undef or number
                  ret == null ? "" : ret;
            }

            return;
         }

         isFunction = jQuery.isFunction(value);

         return this.each(function (i) {
            var self = jQuery(this), val;

            if (this.nodeType !== 1) {
               return;
            }

            if (isFunction) {
               val = value.call(this, i, self.val());
            } else {
               val = value;
            }

            // Treat null/undefined as ""; convert numbers to string
            if (val == null) {
               val = "";
            } else if (typeof val === "number") {
               val += "";
            } else if (jQuery.isArray(val)) {
               val = jQuery.map(val, function (value) {
                  return value == null ? "" : value + "";
               });
            }

            hooks = jQuery.valHooks[this.nodeName.toLowerCase()] || jQuery.valHooks[this.type];

            // If set returns undefined, fall back to normal setting
            if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
               this.value = val;
            }
         });
      }
   });

   jQuery.extend({
      valHooks: {
         option: {
            get: function (elem) {
               // attributes.value is undefined in Blackberry 4.7 but
               // uses .value. See #6932
               var val = elem.attributes.value;
               return !val || val.specified ? elem.value : elem.text;
            }
         },
         select: {
            get: function (elem) {
               var value, i, max, option,
                  index = elem.selectedIndex,
                  values = [],
                  options = elem.options,
                  one = elem.type === "select-one";

               // Nothing was selected
               if (index < 0) {
                  return null;
               }

               // Loop through all the selected options
               i = one ? index : 0;
               max = one ? index + 1 : options.length;
               for (; i < max; i++) {
                  option = options[i];

                  // Don't return options that are disabled or in a disabled optgroup
                  if (option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
                     (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {

                     // Get the specific value for the option
                     value = jQuery(option).val();

                     // We don't need an array for one selects
                     if (one) {
                        return value;
                     }

                     // Multi-Selects return an array
                     values.push(value);
                  }
               }

               // Fixes Bug #2551 -- select.val() broken in IE after form.reset()
               if (one && !values.length && options.length) {
                  return jQuery(options[index]).val();
               }

               return values;
            },

            set: function (elem, value) {
               var values = jQuery.makeArray(value);

               jQuery(elem).find("option").each(function () {
                  this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
               });

               if (!values.length) {
                  elem.selectedIndex = -1;
               }
               return values;
            }
         }
      },

      attrFn: {
         val: true,
         css: true,
         html: true,
         text: true,
         data: true,
         width: true,
         height: true,
         offset: true
      },

      attr: function (elem, name, value, pass) {
         var ret, hooks, notxml,
            nType = elem.nodeType;

         // don't get/set attributes on text, comment and attribute nodes
         if (!elem || nType === 3 || nType === 8 || nType === 2) {
            return;
         }

         if (pass && name in jQuery.attrFn) {
            return jQuery(elem)[name](value);
         }

         // Fallback to prop when attributes are not supported
         if (typeof elem.getAttribute === "undefined") {
            return jQuery.prop(elem, name, value);
         }

         notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

         // All attributes are lowercase
         // Grab necessary hook if one is defined
         if (notxml) {
            name = name.toLowerCase();
            hooks = jQuery.attrHooks[name] || (rboolean.test(name) ? boolHook : nodeHook);
         }

         if (value !== undefined) {

            if (value === null) {
               jQuery.removeAttr(elem, name);
               return;

            } else if (hooks && "set" in hooks && notxml && (ret = hooks.set(elem, value, name)) !== undefined) {
               return ret;

            } else {
               elem.setAttribute(name, "" + value);
               return value;
            }

         } else if (hooks && "get" in hooks && notxml && (ret = hooks.get(elem, name)) !== null) {
            return ret;

         } else {

            ret = elem.getAttribute(name);

            // Non-existent attributes return null, we normalize to undefined
            return ret === null ?
               undefined :
               ret;
         }
      },

      removeAttr: function (elem, value) {
         var propName, attrNames, name, l,
            i = 0;

         if (value && elem.nodeType === 1) {
            attrNames = value.toLowerCase().split(rspace);
            l = attrNames.length;

            for (; i < l; i++) {
               name = attrNames[i];

               if (name) {
                  propName = jQuery.propFix[name] || name;

                  // See #9699 for explanation of this approach (setting first, then removal)
                  jQuery.attr(elem, name, "");
                  elem.removeAttribute(getSetAttribute ? name : propName);

                  // Set corresponding property to false for boolean attributes
                  if (rboolean.test(name) && propName in elem) {
                     elem[propName] = false;
                  }
               }
            }
         }
      },

      attrHooks: {
         type: {
            set: function (elem, value) {
               // We can't allow the type property to be changed (since it causes problems in IE)
               if (rtype.test(elem.nodeName) && elem.parentNode) {
                  jQuery.error("type property can't be changed");
               } else if (!jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
                  // Setting the type on a radio button after the value resets the value in IE6-9
                  // Reset value to it's default in case type is set after value
                  // This is for element creation
                  var val = elem.value;
                  elem.setAttribute("type", value);
                  if (val) {
                     elem.value = val;
                  }
                  return value;
               }
            }
         },
         // Use the value property for back compat
         // Use the nodeHook for button elements in IE6/7 (#1954)
         value: {
            get: function (elem, name) {
               if (nodeHook && jQuery.nodeName(elem, "button")) {
                  return nodeHook.get(elem, name);
               }
               return name in elem ?
                  elem.value :
                  null;
            },
            set: function (elem, value, name) {
               if (nodeHook && jQuery.nodeName(elem, "button")) {
                  return nodeHook.set(elem, value, name);
               }
               // Does not return so that setAttribute is also used
               elem.value = value;
            }
         }
      },

      propFix: {
         tabindex: "tabIndex",
         readonly: "readOnly",
         "for": "htmlFor",
         "class": "className",
         maxlength: "maxLength",
         cellspacing: "cellSpacing",
         cellpadding: "cellPadding",
         rowspan: "rowSpan",
         colspan: "colSpan",
         usemap: "useMap",
         frameborder: "frameBorder",
         contenteditable: "contentEditable"
      },

      prop: function (elem, name, value) {
         var ret, hooks, notxml,
            nType = elem.nodeType;

         // don't get/set properties on text, comment and attribute nodes
         if (!elem || nType === 3 || nType === 8 || nType === 2) {
            return;
         }

         notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

         if (notxml) {
            // Fix name and attach hooks
            name = jQuery.propFix[name] || name;
            hooks = jQuery.propHooks[name];
         }

         if (value !== undefined) {
            if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
               return ret;

            } else {
               return (elem[name] = value);
            }

         } else {
            if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
               return ret;

            } else {
               return elem[name];
            }
         }
      },

      propHooks: {
         tabIndex: {
            get: function (elem) {
               // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
               // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
               var attributeNode = elem.getAttributeNode("tabindex");

               return attributeNode && attributeNode.specified ?
                  parseInt(attributeNode.value, 10) :
                  rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ?
                     0 :
                     undefined;
            }
         }
      }
   });

   // Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
   jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

   // Hook for boolean attributes
   boolHook = {
      get: function (elem, name) {
         // Align boolean attributes with corresponding properties
         // Fall back to attribute presence where some booleans are not supported
         var attrNode,
            property = jQuery.prop(elem, name);
         return property === true || typeof property !== "boolean" && (attrNode = elem.getAttributeNode(name)) && attrNode.nodeValue !== false ?
            name.toLowerCase() :
            undefined;
      },
      set: function (elem, value, name) {
         var propName;
         if (value === false) {
            // Remove boolean attributes when set to false
            jQuery.removeAttr(elem, name);
         } else {
            // value is true since we know at this point it's type boolean and not false
            // Set boolean attributes to the same name and set the DOM property
            propName = jQuery.propFix[name] || name;
            if (propName in elem) {
               // Only set the IDL specifically if it already exists on the element
               elem[propName] = true;
            }

            elem.setAttribute(name, name.toLowerCase());
         }
         return name;
      }
   };

   // IE6/7 do not support getting/setting some attributes with get/setAttribute
   if (!getSetAttribute) {

      fixSpecified = {
         name: true,
         id: true
      };

      // Use this for any attribute in IE6/7
      // This fixes almost every IE6/7 issue
      nodeHook = jQuery.valHooks.button = {
         get: function (elem, name) {
            var ret;
            ret = elem.getAttributeNode(name);
            return ret && (fixSpecified[name] ? ret.nodeValue !== "" : ret.specified) ?
               ret.nodeValue :
               undefined;
         },
         set: function (elem, value, name) {
            // Set the existing or create a new attribute node
            var ret = elem.getAttributeNode(name);
            if (!ret) {
               ret = document.createAttribute(name);
               elem.setAttributeNode(ret);
            }
            return (ret.nodeValue = value + "");
         }
      };

      // Apply the nodeHook to tabindex
      jQuery.attrHooks.tabindex.set = nodeHook.set;

      // Set width and height to auto instead of 0 on empty string( Bug #8150 )
      // This is for removals
      jQuery.each(["width", "height"], function (i, name) {
         jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
            set: function (elem, value) {
               if (value === "") {
                  elem.setAttribute(name, "auto");
                  return value;
               }
            }
         });
      });

      // Set contenteditable to false on removals(#10429)
      // Setting to empty string throws an error as an invalid value
      jQuery.attrHooks.contenteditable = {
         get: nodeHook.get,
         set: function (elem, value, name) {
            if (value === "") {
               value = "false";
            }
            nodeHook.set(elem, value, name);
         }
      };
   }


   // Some attributes require a special call on IE
   if (!jQuery.support.hrefNormalized) {
      jQuery.each(["href", "src", "width", "height"], function (i, name) {
         jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
            get: function (elem) {
               var ret = elem.getAttribute(name, 2);
               return ret === null ? undefined : ret;
            }
         });
      });
   }

   if (!jQuery.support.style) {
      jQuery.attrHooks.style = {
         get: function (elem) {
            // Return undefined in the case of empty string
            // Normalize to lowercase since IE uppercases css property names
            return elem.style.cssText.toLowerCase() || undefined;
         },
         set: function (elem, value) {
            return (elem.style.cssText = "" + value);
         }
      };
   }

   // Safari mis-reports the default selected property of an option
   // Accessing the parent's selectedIndex property fixes it
   if (!jQuery.support.optSelected) {
      jQuery.propHooks.selected = jQuery.extend(jQuery.propHooks.selected, {
         get: function (elem) {
            var parent = elem.parentNode;

            if (parent) {
               parent.selectedIndex;

               // Make sure that it also works with optgroups, see #5701
               if (parent.parentNode) {
                  parent.parentNode.selectedIndex;
               }
            }
            return null;
         }
      });
   }

   // IE6/7 call enctype encoding
   if (!jQuery.support.enctype) {
      jQuery.propFix.enctype = "encoding";
   }

   // Radios and checkboxes getter/setter
   if (!jQuery.support.checkOn) {
      jQuery.each(["radio", "checkbox"], function () {
         jQuery.valHooks[this] = {
            get: function (elem) {
               // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
               return elem.getAttribute("value") === null ? "on" : elem.value;
            }
         };
      });
   }
   jQuery.each(["radio", "checkbox"], function () {
      jQuery.valHooks[this] = jQuery.extend(jQuery.valHooks[this], {
         set: function (elem, value) {
            if (jQuery.isArray(value)) {
               return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0);
            }
         }
      });
   });




   var rformElems = /^(?:textarea|input|select)$/i,
      rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
      rhoverHack = /\bhover(\.\S+)?\b/,
      rkeyEvent = /^key/,
      rmouseEvent = /^(?:mouse|contextmenu)|click/,
      rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
      rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
      quickParse = function (selector) {
         var quick = rquickIs.exec(selector);
         if (quick) {
            //   0  1    2   3
            // [ _, tag, id, class ]
            quick[1] = (quick[1] || "").toLowerCase();
            quick[3] = quick[3] && new RegExp("(?:^|\\s)" + quick[3] + "(?:\\s|$)");
         }
         return quick;
      },
      quickIs = function (elem, m) {
         var attrs = elem.attributes || {};
         return (
            (!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
            (!m[2] || (attrs.id || {}).value === m[2]) &&
            (!m[3] || m[3].test((attrs["class"] || {}).value))
         );
      },
      hoverHack = function (events) {
         return jQuery.event.special.hover ? events : events.replace(rhoverHack, "mouseenter$1 mouseleave$1");
      };

   /*
    * Helper functions for managing events -- not part of the public interface.
    * Props to Dean Edwards' addEvent library for many of the ideas.
    */
   jQuery.event = {

      add: function (elem, types, handler, data, selector) {

         var elemData, eventHandle, events,
            t, tns, type, namespaces, handleObj,
            handleObjIn, quick, handlers, special;

         // Don't attach events to noData or text/comment nodes (allow plain objects tho)
         if (elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data(elem))) {
            return;
         }

         // Caller can pass in an object of custom data in lieu of the handler
         if (handler.handler) {
            handleObjIn = handler;
            handler = handleObjIn.handler;
         }

         // Make sure that the handler has a unique ID, used to find/remove it later
         if (!handler.guid) {
            handler.guid = jQuery.guid++;
         }

         // Init the element's event structure and main handler, if this is the first
         events = elemData.events;
         if (!events) {
            elemData.events = events = {};
         }
         eventHandle = elemData.handle;
         if (!eventHandle) {
            elemData.handle = eventHandle = function (e) {
               // Discard the second event of a jQuery.event.trigger() and
               // when an event is called after a page has unloaded
               return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
                  jQuery.event.dispatch.apply(eventHandle.elem, arguments) :
                  undefined;
            };
            // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
            eventHandle.elem = elem;
         }

         // Handle multiple events separated by a space
         // jQuery(...).bind("mouseover mouseout", fn);
         types = jQuery.trim(hoverHack(types)).split(" ");
         for (t = 0; t < types.length; t++) {

            tns = rtypenamespace.exec(types[t]) || [];
            type = tns[1];
            namespaces = (tns[2] || "").split(".").sort();

            // If event changes its type, use the special event handlers for the changed type
            special = jQuery.event.special[type] || {};

            // If selector defined, determine special event api type, otherwise given type
            type = (selector ? special.delegateType : special.bindType) || type;

            // Update special based on newly reset type
            special = jQuery.event.special[type] || {};

            // handleObj is passed to all event handlers
            handleObj = jQuery.extend({
               type: type,
               origType: tns[1],
               data: data,
               handler: handler,
               guid: handler.guid,
               selector: selector,
               quick: quickParse(selector),
               namespace: namespaces.join(".")
            }, handleObjIn);

            // Init the event handler queue if we're the first
            handlers = events[type];
            if (!handlers) {
               handlers = events[type] = [];
               handlers.delegateCount = 0;

               // Only use addEventListener/attachEvent if the special events handler returns false
               if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                  // Bind the global event handler to the element
                  if (elem.addEventListener) {
                     elem.addEventListener(type, eventHandle, false);

                  } else if (elem.attachEvent) {
                     elem.attachEvent("on" + type, eventHandle);
                  }
               }
            }

            if (special.add) {
               special.add.call(elem, handleObj);

               if (!handleObj.handler.guid) {
                  handleObj.handler.guid = handler.guid;
               }
            }

            // Add to the element's handler list, delegates in front
            if (selector) {
               handlers.splice(handlers.delegateCount++, 0, handleObj);
            } else {
               handlers.push(handleObj);
            }

            // Keep track of which events have ever been used, for event optimization
            jQuery.event.global[type] = true;
         }

         // Nullify elem to prevent memory leaks in IE
         elem = null;
      },

      global: {},

      // Detach an event or set of events from an element
      remove: function (elem, types, handler, selector, mappedTypes) {

         var elemData = jQuery.hasData(elem) && jQuery._data(elem),
            t, tns, type, origType, namespaces, origCount,
            j, events, special, handle, eventType, handleObj;

         if (!elemData || !(events = elemData.events)) {
            return;
         }

         // Once for each type.namespace in types; type may be omitted
         types = jQuery.trim(hoverHack(types || "")).split(" ");
         for (t = 0; t < types.length; t++) {
            tns = rtypenamespace.exec(types[t]) || [];
            type = origType = tns[1];
            namespaces = tns[2];

            // Unbind all events (on this namespace, if provided) for the element
            if (!type) {
               for (type in events) {
                  jQuery.event.remove(elem, type + types[t], handler, selector, true);
               }
               continue;
            }

            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            eventType = events[type] || [];
            origCount = eventType.length;
            namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

            // Remove matching events
            for (j = 0; j < eventType.length; j++) {
               handleObj = eventType[j];

               if ((mappedTypes || origType === handleObj.origType) &&
                  (!handler || handler.guid === handleObj.guid) &&
                  (!namespaces || namespaces.test(handleObj.namespace)) &&
                  (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                  eventType.splice(j--, 1);

                  if (handleObj.selector) {
                     eventType.delegateCount--;
                  }
                  if (special.remove) {
                     special.remove.call(elem, handleObj);
                  }
               }
            }

            // Remove generic event handler if we removed something and no more handlers exist
            // (avoids potential for endless recursion during removal of special event handlers)
            if (eventType.length === 0 && origCount !== eventType.length) {
               if (!special.teardown || special.teardown.call(elem, namespaces) === false) {
                  jQuery.removeEvent(elem, type, elemData.handle);
               }

               delete events[type];
            }
         }

         // Remove the expando if it's no longer used
         if (jQuery.isEmptyObject(events)) {
            handle = elemData.handle;
            if (handle) {
               handle.elem = null;
            }

            // removeData also checks for emptiness and clears the expando if empty
            // so use it instead of delete
            jQuery.removeData(elem, ["events", "handle"], true);
         }
      },

      // Events that are safe to short-circuit if no handlers are attached.
      // Native DOM events should not be added, they may have inline handlers.
      customEvent: {
         "getData": true,
         "setData": true,
         "changeData": true
      },

      trigger: function (event, data, elem, onlyHandlers) {
         // Don't do events on text and comment nodes
         if (elem && (elem.nodeType === 3 || elem.nodeType === 8)) {
            return;
         }

         // Event object or event type
         var type = event.type || event,
            namespaces = [],
            cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

         // focus/blur morphs to focusin/out; ensure we're not firing them right now
         if (rfocusMorph.test(type + jQuery.event.triggered)) {
            return;
         }

         if (type.indexOf("!") >= 0) {
            // Exclusive events trigger only for the exact event (no namespaces)
            type = type.slice(0, -1);
            exclusive = true;
         }

         if (type.indexOf(".") >= 0) {
            // Namespaced trigger; create a regexp to match event type in handle()
            namespaces = type.split(".");
            type = namespaces.shift();
            namespaces.sort();
         }

         if ((!elem || jQuery.event.customEvent[type]) && !jQuery.event.global[type]) {
            // No jQuery handlers for this event type, and it can't have inline handlers
            return;
         }

         // Caller can pass in an Event, Object, or just an event type string
         event = typeof event === "object" ?
            // jQuery.Event object
            event[jQuery.expando] ? event :
               // Object literal
               new jQuery.Event(type, event) :
            // Just the event type (string)
            new jQuery.Event(type);

         event.type = type;
         event.isTrigger = true;
         event.exclusive = exclusive;
         event.namespace = namespaces.join(".");
         event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
         ontype = type.indexOf(":") < 0 ? "on" + type : "";

         // Handle a global trigger
         if (!elem) {

            // TODO: Stop taunting the data cache; remove global events and always attach to document
            cache = jQuery.cache;
            for (i in cache) {
               if (cache[i].events && cache[i].events[type]) {
                  jQuery.event.trigger(event, data, cache[i].handle.elem, true);
               }
            }
            return;
         }

         // Clean up the event in case it is being reused
         event.result = undefined;
         if (!event.target) {
            event.target = elem;
         }

         // Clone any incoming data and prepend the event, creating the handler arg list
         data = data != null ? jQuery.makeArray(data) : [];
         data.unshift(event);

         // Allow special events to draw outside the lines
         special = jQuery.event.special[type] || {};
         if (special.trigger && special.trigger.apply(elem, data) === false) {
            return;
         }

         // Determine event propagation path in advance, per W3C events spec (#9951)
         // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
         eventPath = [[elem, special.bindType || type]];
         if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {

            bubbleType = special.delegateType || type;
            cur = rfocusMorph.test(bubbleType + type) ? elem : elem.parentNode;
            old = null;
            for (; cur; cur = cur.parentNode) {
               eventPath.push([cur, bubbleType]);
               old = cur;
            }

            // Only add window if we got to document (e.g., not plain obj or detached DOM)
            if (old && old === elem.ownerDocument) {
               eventPath.push([old.defaultView || old.parentWindow || window, bubbleType]);
            }
         }

         // Fire handlers on the event path
         for (i = 0; i < eventPath.length && !event.isPropagationStopped(); i++) {

            cur = eventPath[i][0];
            event.type = eventPath[i][1];

            handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");
            if (handle) {
               handle.apply(cur, data);
            }
            // Note that this is a bare JS function and not a jQuery handler
            handle = ontype && cur[ontype];
            if (handle && jQuery.acceptData(cur) && handle.apply(cur, data) === false) {
               event.preventDefault();
            }
         }
         event.type = type;

         // If nobody prevented the default action, do it now
         if (!onlyHandlers && !event.isDefaultPrevented()) {

            if ((!special._default || special._default.apply(elem.ownerDocument, data) === false) &&
               !(type === "click" && jQuery.nodeName(elem, "a")) && jQuery.acceptData(elem)) {

               // Call a native DOM method on the target with the same name name as the event.
               // Can't use an .isFunction() check here because IE6/7 fails that test.
               // Don't do default actions on window, that's where global variables be (#6170)
               // IE<9 dies on focus/blur to hidden element (#1486)
               if (ontype && elem[type] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow(elem)) {

                  // Don't re-trigger an onFOO event when we call its FOO() method
                  old = elem[ontype];

                  if (old) {
                     elem[ontype] = null;
                  }

                  // Prevent re-triggering of the same event, since we already bubbled it above
                  jQuery.event.triggered = type;
                  elem[type]();
                  jQuery.event.triggered = undefined;

                  if (old) {
                     elem[ontype] = old;
                  }
               }
            }
         }

         return event.result;
      },

      dispatch: function (event) {

         // Make a writable jQuery.Event from the native event object
         event = jQuery.event.fix(event || window.event);

         var handlers = ((jQuery._data(this, "events") || {})[event.type] || []),
            delegateCount = handlers.delegateCount,
            args = [].slice.call(arguments, 0),
            run_all = !event.exclusive && !event.namespace,
            handlerQueue = [],
            i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

         // Use the fix-ed jQuery.Event rather than the (read-only) native event
         args[0] = event;
         event.delegateTarget = this;

         // Determine handlers that should run if there are delegated events
         // Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
         if (delegateCount && !event.target.disabled && !(event.button && event.type === "click")) {

            // Pregenerate a single jQuery object for reuse with .is()
            jqcur = jQuery(this);
            jqcur.context = this.ownerDocument || this;

            for (cur = event.target; cur != this; cur = cur.parentNode || this) {
               selMatch = {};
               matches = [];
               jqcur[0] = cur;
               for (i = 0; i < delegateCount; i++) {
                  handleObj = handlers[i];
                  sel = handleObj.selector;

                  if (selMatch[sel] === undefined) {
                     selMatch[sel] = (
                        handleObj.quick ? quickIs(cur, handleObj.quick) : jqcur.is(sel)
                     );
                  }
                  if (selMatch[sel]) {
                     matches.push(handleObj);
                  }
               }
               if (matches.length) {
                  handlerQueue.push({ elem: cur, matches: matches });
               }
            }
         }

         // Add the remaining (directly-bound) handlers
         if (handlers.length > delegateCount) {
            handlerQueue.push({ elem: this, matches: handlers.slice(delegateCount) });
         }

         // Run delegates first; they may want to stop propagation beneath us
         for (i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++) {
            matched = handlerQueue[i];
            event.currentTarget = matched.elem;

            for (j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++) {
               handleObj = matched.matches[j];

               // Triggered event must either 1) be non-exclusive and have no namespace, or
               // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
               if (run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test(handleObj.namespace)) {

                  event.data = handleObj.data;
                  event.handleObj = handleObj;

                  ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler)
                     .apply(matched.elem, args);

                  if (ret !== undefined) {
                     event.result = ret;
                     if (ret === false) {
                        event.preventDefault();
                        event.stopPropagation();
                     }
                  }
               }
            }
         }

         return event.result;
      },

      // Includes some event props shared by KeyEvent and MouseEvent
      // *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
      props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

      fixHooks: {},

      keyHooks: {
         props: "char charCode key keyCode".split(" "),
         filter: function (event, original) {

            // Add which for key events
            if (event.which == null) {
               event.which = original.charCode != null ? original.charCode : original.keyCode;
            }

            return event;
         }
      },

      mouseHooks: {
         props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
         filter: function (event, original) {
            var eventDoc, doc, body,
               button = original.button,
               fromElement = original.fromElement;

            // Calculate pageX/Y if missing and clientX/Y available
            if (event.pageX == null && original.clientX != null) {
               eventDoc = event.target.ownerDocument || document;
               doc = eventDoc.documentElement;
               body = eventDoc.body;

               event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
               event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
            }

            // Add relatedTarget, if necessary
            if (!event.relatedTarget && fromElement) {
               event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
            }

            // Add which for click: 1 === left; 2 === middle; 3 === right
            // Note: button is not normalized, so don't use it
            if (!event.which && button !== undefined) {
               event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
            }

            return event;
         }
      },

      fix: function (event) {
         if (event[jQuery.expando]) {
            return event;
         }

         // Create a writable copy of the event object and normalize some properties
         var i, prop,
            originalEvent = event,
            fixHook = jQuery.event.fixHooks[event.type] || {},
            copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

         event = jQuery.Event(originalEvent);

         for (i = copy.length; i;) {
            prop = copy[--i];
            event[prop] = originalEvent[prop];
         }

         // Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
         if (!event.target) {
            event.target = originalEvent.srcElement || document;
         }

         // Target should not be a text node (#504, Safari)
         if (event.target.nodeType === 3) {
            event.target = event.target.parentNode;
         }

         // For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
         if (event.metaKey === undefined) {
            event.metaKey = event.ctrlKey;
         }

         return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
      },

      special: {
         ready: {
            // Make sure the ready event is setup
            setup: jQuery.bindReady
         },

         load: {
            // Prevent triggered image.load events from bubbling to window.load
            noBubble: true
         },

         focus: {
            delegateType: "focusin"
         },
         blur: {
            delegateType: "focusout"
         },

         beforeunload: {
            setup: function (data, namespaces, eventHandle) {
               // We only want to do this special case on windows
               if (jQuery.isWindow(this)) {
                  this.onbeforeunload = eventHandle;
               }
            },

            teardown: function (namespaces, eventHandle) {
               if (this.onbeforeunload === eventHandle) {
                  this.onbeforeunload = null;
               }
            }
         }
      },

      simulate: function (type, elem, event, bubble) {
         // Piggyback on a donor event to simulate a different one.
         // Fake originalEvent to avoid donor's stopPropagation, but if the
         // simulated event prevents default then we do the same on the donor.
         var e = jQuery.extend(
            new jQuery.Event(),
            event,
            {
               type: type,
               isSimulated: true,
               originalEvent: {}
            }
         );
         if (bubble) {
            jQuery.event.trigger(e, null, elem);
         } else {
            jQuery.event.dispatch.call(elem, e);
         }
         if (e.isDefaultPrevented()) {
            event.preventDefault();
         }
      }
   };

   // Some plugins are using, but it's undocumented/deprecated and will be removed.
   // The 1.7 special event interface should provide all the hooks needed now.
   jQuery.event.handle = jQuery.event.dispatch;

   jQuery.removeEvent = document.removeEventListener ?
      function (elem, type, handle) {
         if (elem.removeEventListener) {
            elem.removeEventListener(type, handle, false);
         }
      } :
      function (elem, type, handle) {
         if (elem.detachEvent) {
            elem.detachEvent("on" + type, handle);
         }
      };

   jQuery.Event = function (src, props) {
      // Allow instantiation without the 'new' keyword
      if (!(this instanceof jQuery.Event)) {
         return new jQuery.Event(src, props);
      }

      // Event object
      if (src && src.type) {
         this.originalEvent = src;
         this.type = src.type;

         // Events bubbling up the document may have been marked as prevented
         // by a handler lower down the tree; reflect the correct value.
         this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
            src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

         // Event type
      } else {
         this.type = src;
      }

      // Put explicitly provided properties onto the event object
      if (props) {
         jQuery.extend(this, props);
      }

      // Create a timestamp if incoming event doesn't have one
      this.timeStamp = src && src.timeStamp || jQuery.now();

      // Mark it as fixed
      this[jQuery.expando] = true;
   };

   function returnFalse() {
      return false;
   }
   function returnTrue() {
      return true;
   }

   // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
   // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
   jQuery.Event.prototype = {
      preventDefault: function () {
         this.isDefaultPrevented = returnTrue;

         var e = this.originalEvent;
         if (!e) {
            return;
         }

         // if preventDefault exists run it on the original event
         if (e.preventDefault) {
            e.preventDefault();

            // otherwise set the returnValue property of the original event to false (IE)
         } else {
            e.returnValue = false;
         }
      },
      stopPropagation: function () {
         this.isPropagationStopped = returnTrue;

         var e = this.originalEvent;
         if (!e) {
            return;
         }
         // if stopPropagation exists run it on the original event
         if (e.stopPropagation) {
            e.stopPropagation();
         }
         // otherwise set the cancelBubble property of the original event to true (IE)
         e.cancelBubble = true;
      },
      stopImmediatePropagation: function () {
         this.isImmediatePropagationStopped = returnTrue;
         this.stopPropagation();
      },
      isDefaultPrevented: returnFalse,
      isPropagationStopped: returnFalse,
      isImmediatePropagationStopped: returnFalse
   };

   // Create mouseenter/leave events using mouseover/out and event-time checks
   jQuery.each({
      mouseenter: "mouseover",
      mouseleave: "mouseout"
   }, function (orig, fix) {
      jQuery.event.special[orig] = {
         delegateType: fix,
         bindType: fix,

         handle: function (event) {
            var target = this,
               related = event.relatedTarget,
               handleObj = event.handleObj,
               selector = handleObj.selector,
               ret;

            // For mousenter/leave call the handler if related is outside the target.
            // NB: No relatedTarget if the mouse left/entered the browser window
            if (!related || (related !== target && !jQuery.contains(target, related))) {
               event.type = handleObj.origType;
               ret = handleObj.handler.apply(this, arguments);
               event.type = fix;
            }
            return ret;
         }
      };
   });

   // IE submit delegation
   if (!jQuery.support.submitBubbles) {

      jQuery.event.special.submit = {
         setup: function () {
            // Only need this for delegated form submit events
            if (jQuery.nodeName(this, "form")) {
               return false;
            }

            // Lazy-add a submit handler when a descendant form may potentially be submitted
            jQuery.event.add(this, "click._submit keypress._submit", function (e) {
               // Node name check avoids a VML-related crash in IE (#9807)
               var elem = e.target,
                  form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
               if (form && !form._submit_attached) {
                  jQuery.event.add(form, "submit._submit", function (event) {
                     // If form was submitted by the user, bubble the event up the tree
                     if (this.parentNode && !event.isTrigger) {
                        jQuery.event.simulate("submit", this.parentNode, event, true);
                     }
                  });
                  form._submit_attached = true;
               }
            });
            // return undefined since we don't need an event listener
         },

         teardown: function () {
            // Only need this for delegated form submit events
            if (jQuery.nodeName(this, "form")) {
               return false;
            }

            // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
            jQuery.event.remove(this, "._submit");
         }
      };
   }

   // IE change delegation and checkbox/radio fix
   if (!jQuery.support.changeBubbles) {

      jQuery.event.special.change = {

         setup: function () {

            if (rformElems.test(this.nodeName)) {
               // IE doesn't fire change on a check/radio until blur; trigger it on click
               // after a propertychange. Eat the blur-change in special.change.handle.
               // This still fires onchange a second time for check/radio after blur.
               if (this.type === "checkbox" || this.type === "radio") {
                  jQuery.event.add(this, "propertychange._change", function (event) {
                     if (event.originalEvent.propertyName === "checked") {
                        this._just_changed = true;
                     }
                  });
                  jQuery.event.add(this, "click._change", function (event) {
                     if (this._just_changed && !event.isTrigger) {
                        this._just_changed = false;
                        jQuery.event.simulate("change", this, event, true);
                     }
                  });
               }
               return false;
            }
            // Delegated event; lazy-add a change handler on descendant inputs
            jQuery.event.add(this, "beforeactivate._change", function (e) {
               var elem = e.target;

               if (rformElems.test(elem.nodeName) && !elem._change_attached) {
                  jQuery.event.add(elem, "change._change", function (event) {
                     if (this.parentNode && !event.isSimulated && !event.isTrigger) {
                        jQuery.event.simulate("change", this.parentNode, event, true);
                     }
                  });
                  elem._change_attached = true;
               }
            });
         },

         handle: function (event) {
            var elem = event.target;

            // Swallow native change events from checkbox/radio, we already triggered them above
            if (this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox")) {
               return event.handleObj.handler.apply(this, arguments);
            }
         },

         teardown: function () {
            jQuery.event.remove(this, "._change");

            return rformElems.test(this.nodeName);
         }
      };
   }

   // Create "bubbling" focus and blur events
   if (!jQuery.support.focusinBubbles) {
      jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {

         // Attach a single capturing handler while someone wants focusin/focusout
         var attaches = 0,
            handler = function (event) {
               jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
            };

         jQuery.event.special[fix] = {
            setup: function () {
               if (attaches++ === 0) {
                  document.addEventListener(orig, handler, true);
               }
            },
            teardown: function () {
               if (--attaches === 0) {
                  document.removeEventListener(orig, handler, true);
               }
            }
         };
      });
   }

   jQuery.fn.extend({

      on: function (types, selector, data, fn, /*INTERNAL*/ one) {
         var origFn, type;

         // Types can be a map of types/handlers
         if (typeof types === "object") {
            // ( types-Object, selector, data )
            if (typeof selector !== "string") {
               // ( types-Object, data )
               data = selector;
               selector = undefined;
            }
            for (type in types) {
               this.on(type, selector, data, types[type], one);
            }
            return this;
         }

         if (data == null && fn == null) {
            // ( types, fn )
            fn = selector;
            data = selector = undefined;
         } else if (fn == null) {
            if (typeof selector === "string") {
               // ( types, selector, fn )
               fn = data;
               data = undefined;
            } else {
               // ( types, data, fn )
               fn = data;
               data = selector;
               selector = undefined;
            }
         }
         if (fn === false) {
            fn = returnFalse;
         } else if (!fn) {
            return this;
         }

         if (one === 1) {
            origFn = fn;
            fn = function (event) {
               // Can use an empty set, since event contains the info
               jQuery().off(event);
               return origFn.apply(this, arguments);
            };
            // Use same guid so caller can remove using origFn
            fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
         }
         return this.each(function () {
            jQuery.event.add(this, types, fn, data, selector);
         });
      },
      one: function (types, selector, data, fn) {
         return this.on.call(this, types, selector, data, fn, 1);
      },
      off: function (types, selector, fn) {
         if (types && types.preventDefault && types.handleObj) {
            // ( event )  dispatched jQuery.Event
            var handleObj = types.handleObj;
            jQuery(types.delegateTarget).off(
               handleObj.namespace ? handleObj.type + "." + handleObj.namespace : handleObj.type,
               handleObj.selector,
               handleObj.handler
            );
            return this;
         }
         if (typeof types === "object") {
            // ( types-object [, selector] )
            for (var type in types) {
               this.off(type, selector, types[type]);
            }
            return this;
         }
         if (selector === false || typeof selector === "function") {
            // ( types [, fn] )
            fn = selector;
            selector = undefined;
         }
         if (fn === false) {
            fn = returnFalse;
         }
         return this.each(function () {
            jQuery.event.remove(this, types, fn, selector);
         });
      },

      bind: function (types, data, fn) {
         return this.on(types, null, data, fn);
      },
      unbind: function (types, fn) {
         return this.off(types, null, fn);
      },

      live: function (types, data, fn) {
         jQuery(this.context).on(types, this.selector, data, fn);
         return this;
      },
      die: function (types, fn) {
         jQuery(this.context).off(types, this.selector || "**", fn);
         return this;
      },

      delegate: function (selector, types, data, fn) {
         return this.on(types, selector, data, fn);
      },
      undelegate: function (selector, types, fn) {
         // ( namespace ) or ( selector, types [, fn] )
         return arguments.length == 1 ? this.off(selector, "**") : this.off(types, selector, fn);
      },

      trigger: function (type, data) {
         return this.each(function () {
            jQuery.event.trigger(type, data, this);
         });
      },
      triggerHandler: function (type, data) {
         if (this[0]) {
            return jQuery.event.trigger(type, data, this[0], true);
         }
      },

      toggle: function (fn) {
         // Save reference to arguments for access in closure
         var args = arguments,
            guid = fn.guid || jQuery.guid++,
            i = 0,
            toggler = function (event) {
               // Figure out which function to execute
               var lastToggle = (jQuery._data(this, "lastToggle" + fn.guid) || 0) % i;
               jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1);

               // Make sure that clicks stop
               event.preventDefault();

               // and execute the function
               return args[lastToggle].apply(this, arguments) || false;
            };

         // link all the functions, so any of them can unbind this click handler
         toggler.guid = guid;
         while (i < args.length) {
            args[i++].guid = guid;
         }

         return this.click(toggler);
      },

      hover: function (fnOver, fnOut) {
         return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
      }
   });

   jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
      "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
      "change select submit keydown keypress keyup error contextmenu").split(" "), function (i, name) {

         // Handle event binding
         jQuery.fn[name] = function (data, fn) {
            if (fn == null) {
               fn = data;
               data = null;
            }

            return arguments.length > 0 ?
               this.on(name, null, data, fn) :
               this.trigger(name);
         };

         if (jQuery.attrFn) {
            jQuery.attrFn[name] = true;
         }

         if (rkeyEvent.test(name)) {
            jQuery.event.fixHooks[name] = jQuery.event.keyHooks;
         }

         if (rmouseEvent.test(name)) {
            jQuery.event.fixHooks[name] = jQuery.event.mouseHooks;
         }
      });



   /*!
    * Sizzle CSS Selector Engine
    *  Copyright 2012, The Dojo Foundation
    *  Released under the MIT, BSD, and GPL Licenses.
    *  More information: http://sizzlejs.com/
    */
   (function () {

      var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
         expando = "sizcache" + (Math.random() + '').replace('.', ''),
         done = 0,
         toString = Object.prototype.toString,
         hasDuplicate = false,
         baseHasDuplicate = true,
         rBackslash = /\\/g,
         rReturn = /\r\n/g,
         rNonWord = /\W/;

      // Here we check if the JavaScript engine is using some sort of
      // optimization where it does not always call our comparision
      // function. If that is the case, discard the hasDuplicate value.
      //   Thus far that includes Google Chrome.
      [0, 0].sort(function () {
         baseHasDuplicate = false;
         return 0;
      });

      var Sizzle = function (selector, context, results, seed) {
         results = results || [];
         context = context || document;

         var origContext = context;

         if (context.nodeType !== 1 && context.nodeType !== 9) {
            return [];
         }

         if (!selector || typeof selector !== "string") {
            return results;
         }

         var m, set, checkSet, extra, ret, cur, pop, i,
            prune = true,
            contextXML = Sizzle.isXML(context),
            parts = [],
            soFar = selector;

         // Reset the position of the chunker regexp (start from head)
         do {
            chunker.exec("");
            m = chunker.exec(soFar);

            if (m) {
               soFar = m[3];

               parts.push(m[1]);

               if (m[2]) {
                  extra = m[3];
                  break;
               }
            }
         } while (m);

         if (parts.length > 1 && origPOS.exec(selector)) {

            if (parts.length === 2 && Expr.relative[parts[0]]) {
               set = posProcess(parts[0] + parts[1], context, seed);

            } else {
               set = Expr.relative[parts[0]] ?
                  [context] :
                  Sizzle(parts.shift(), context);

               while (parts.length) {
                  selector = parts.shift();

                  if (Expr.relative[selector]) {
                     selector += parts.shift();
                  }

                  set = posProcess(selector, set, seed);
               }
            }

         } else {
            // Take a shortcut and set the context if the root selector is an ID
            // (but not if it'll be faster if the inner selector is an ID)
            if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
               Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {

               ret = Sizzle.find(parts.shift(), context, contextXML);
               context = ret.expr ?
                  Sizzle.filter(ret.expr, ret.set)[0] :
                  ret.set[0];
            }

            if (context) {
               ret = seed ?
                  { expr: parts.pop(), set: makeArray(seed) } :
                  Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);

               set = ret.expr ?
                  Sizzle.filter(ret.expr, ret.set) :
                  ret.set;

               if (parts.length > 0) {
                  checkSet = makeArray(set);

               } else {
                  prune = false;
               }

               while (parts.length) {
                  cur = parts.pop();
                  pop = cur;

                  if (!Expr.relative[cur]) {
                     cur = "";
                  } else {
                     pop = parts.pop();
                  }

                  if (pop == null) {
                     pop = context;
                  }

                  Expr.relative[cur](checkSet, pop, contextXML);
               }

            } else {
               checkSet = parts = [];
            }
         }

         if (!checkSet) {
            checkSet = set;
         }

         if (!checkSet) {
            Sizzle.error(cur || selector);
         }

         if (toString.call(checkSet) === "[object Array]") {
            if (!prune) {
               results.push.apply(results, checkSet);

            } else if (context && context.nodeType === 1) {
               for (i = 0; checkSet[i] != null; i++) {
                  if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i]))) {
                     results.push(set[i]);
                  }
               }

            } else {
               for (i = 0; checkSet[i] != null; i++) {
                  if (checkSet[i] && checkSet[i].nodeType === 1) {
                     results.push(set[i]);
                  }
               }
            }

         } else {
            makeArray(checkSet, results);
         }

         if (extra) {
            Sizzle(extra, origContext, results, seed);
            Sizzle.uniqueSort(results);
         }

         return results;
      };

      Sizzle.uniqueSort = function (results) {
         if (sortOrder) {
            hasDuplicate = baseHasDuplicate;
            results.sort(sortOrder);

            if (hasDuplicate) {
               for (var i = 1; i < results.length; i++) {
                  if (results[i] === results[i - 1]) {
                     results.splice(i--, 1);
                  }
               }
            }
         }

         return results;
      };

      Sizzle.matches = function (expr, set) {
         return Sizzle(expr, null, null, set);
      };

      Sizzle.matchesSelector = function (node, expr) {
         return Sizzle(expr, null, null, [node]).length > 0;
      };

      Sizzle.find = function (expr, context, isXML) {
         var set, i, len, match, type, left;

         if (!expr) {
            return [];
         }

         for (i = 0, len = Expr.order.length; i < len; i++) {
            type = Expr.order[i];

            if ((match = Expr.leftMatch[type].exec(expr))) {
               left = match[1];
               match.splice(1, 1);

               if (left.substr(left.length - 1) !== "\\") {
                  match[1] = (match[1] || "").replace(rBackslash, "");
                  set = Expr.find[type](match, context, isXML);

                  if (set != null) {
                     expr = expr.replace(Expr.match[type], "");
                     break;
                  }
               }
            }
         }

         if (!set) {
            set = typeof context.getElementsByTagName !== "undefined" ?
               context.getElementsByTagName("*") :
               [];
         }

         return { set: set, expr: expr };
      };

      Sizzle.filter = function (expr, set, inplace, not) {
         var match, anyFound,
            type, found, item, filter, left,
            i, pass,
            old = expr,
            result = [],
            curLoop = set,
            isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);

         while (expr && set.length) {
            for (type in Expr.filter) {
               if ((match = Expr.leftMatch[type].exec(expr)) != null && match[2]) {
                  filter = Expr.filter[type];
                  left = match[1];

                  anyFound = false;

                  match.splice(1, 1);

                  if (left.substr(left.length - 1) === "\\") {
                     continue;
                  }

                  if (curLoop === result) {
                     result = [];
                  }

                  if (Expr.preFilter[type]) {
                     match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);

                     if (!match) {
                        anyFound = found = true;

                     } else if (match === true) {
                        continue;
                     }
                  }

                  if (match) {
                     for (i = 0; (item = curLoop[i]) != null; i++) {
                        if (item) {
                           found = filter(item, match, i, curLoop);
                           pass = not ^ found;

                           if (inplace && found != null) {
                              if (pass) {
                                 anyFound = true;

                              } else {
                                 curLoop[i] = false;
                              }

                           } else if (pass) {
                              result.push(item);
                              anyFound = true;
                           }
                        }
                     }
                  }

                  if (found !== undefined) {
                     if (!inplace) {
                        curLoop = result;
                     }

                     expr = expr.replace(Expr.match[type], "");

                     if (!anyFound) {
                        return [];
                     }

                     break;
                  }
               }
            }

            // Improper expression
            if (expr === old) {
               if (anyFound == null) {
                  Sizzle.error(expr);

               } else {
                  break;
               }
            }

            old = expr;
         }

         return curLoop;
      };

      Sizzle.error = function (msg) {
         throw new Error("Syntax error, unrecognized expression: " + msg);
      };

      /**
       * Utility function for retreiving the text value of an array of DOM nodes
       * @param {Array|Element} elem
       */
      var getText = Sizzle.getText = function (elem) {
         var i, node,
            nodeType = elem.nodeType,
            ret = "";

         if (nodeType) {
            if (nodeType === 1 || nodeType === 9) {
               // Use textContent || innerText for elements
               if (typeof elem.textContent === 'string') {
                  return elem.textContent;
               } else if (typeof elem.innerText === 'string') {
                  // Replace IE's carriage returns
                  return elem.innerText.replace(rReturn, '');
               } else {
                  // Traverse it's children
                  for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                     ret += getText(elem);
                  }
               }
            } else if (nodeType === 3 || nodeType === 4) {
               return elem.nodeValue;
            }
         } else {

            // If no nodeType, this is expected to be an array
            for (i = 0; (node = elem[i]); i++) {
               // Do not traverse comment nodes
               if (node.nodeType !== 8) {
                  ret += getText(node);
               }
            }
         }
         return ret;
      };

      var Expr = Sizzle.selectors = {
         order: ["ID", "NAME", "TAG"],

         match: {
            ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
            ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
            TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
            CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
            POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
            PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
         },

         leftMatch: {},

         attrMap: {
            "class": "className",
            "for": "htmlFor"
         },

         attrHandle: {
            href: function (elem) {
               return elem.getAttribute("href");
            },
            type: function (elem) {
               return elem.getAttribute("type");
            }
         },

         relative: {
            "+": function (checkSet, part) {
               var isPartStr = typeof part === "string",
                  isTag = isPartStr && !rNonWord.test(part),
                  isPartStrNotTag = isPartStr && !isTag;

               if (isTag) {
                  part = part.toLowerCase();
               }

               for (var i = 0, l = checkSet.length, elem; i < l; i++) {
                  if ((elem = checkSet[i])) {
                     while ((elem = elem.previousSibling) && elem.nodeType !== 1) { }

                     checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
                        elem || false :
                        elem === part;
                  }
               }

               if (isPartStrNotTag) {
                  Sizzle.filter(part, checkSet, true);
               }
            },

            ">": function (checkSet, part) {
               var elem,
                  isPartStr = typeof part === "string",
                  i = 0,
                  l = checkSet.length;

               if (isPartStr && !rNonWord.test(part)) {
                  part = part.toLowerCase();

                  for (; i < l; i++) {
                     elem = checkSet[i];

                     if (elem) {
                        var parent = elem.parentNode;
                        checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                     }
                  }

               } else {
                  for (; i < l; i++) {
                     elem = checkSet[i];

                     if (elem) {
                        checkSet[i] = isPartStr ?
                           elem.parentNode :
                           elem.parentNode === part;
                     }
                  }

                  if (isPartStr) {
                     Sizzle.filter(part, checkSet, true);
                  }
               }
            },

            "": function (checkSet, part, isXML) {
               var nodeCheck,
                  doneName = done++,
                  checkFn = dirCheck;

               if (typeof part === "string" && !rNonWord.test(part)) {
                  part = part.toLowerCase();
                  nodeCheck = part;
                  checkFn = dirNodeCheck;
               }

               checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
            },

            "~": function (checkSet, part, isXML) {
               var nodeCheck,
                  doneName = done++,
                  checkFn = dirCheck;

               if (typeof part === "string" && !rNonWord.test(part)) {
                  part = part.toLowerCase();
                  nodeCheck = part;
                  checkFn = dirNodeCheck;
               }

               checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
            }
         },

         find: {
            ID: function (match, context, isXML) {
               if (typeof context.getElementById !== "undefined" && !isXML) {
                  var m = context.getElementById(match[1]);
                  // Check parentNode to catch when Blackberry 4.6 returns
                  // nodes that are no longer in the document #6963
                  return m && m.parentNode ? [m] : [];
               }
            },

            NAME: function (match, context) {
               if (typeof context.getElementsByName !== "undefined") {
                  var ret = [],
                     results = context.getElementsByName(match[1]);

                  for (var i = 0, l = results.length; i < l; i++) {
                     if (results[i].getAttribute("name") === match[1]) {
                        ret.push(results[i]);
                     }
                  }

                  return ret.length === 0 ? null : ret;
               }
            },

            TAG: function (match, context) {
               if (typeof context.getElementsByTagName !== "undefined") {
                  return context.getElementsByTagName(match[1]);
               }
            }
         },
         preFilter: {
            CLASS: function (match, curLoop, inplace, result, not, isXML) {
               match = " " + match[1].replace(rBackslash, "") + " ";

               if (isXML) {
                  return match;
               }

               for (var i = 0, elem; (elem = curLoop[i]) != null; i++) {
                  if (elem) {
                     if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0)) {
                        if (!inplace) {
                           result.push(elem);
                        }

                     } else if (inplace) {
                        curLoop[i] = false;
                     }
                  }
               }

               return false;
            },

            ID: function (match) {
               return match[1].replace(rBackslash, "");
            },

            TAG: function (match, curLoop) {
               return match[1].replace(rBackslash, "").toLowerCase();
            },

            CHILD: function (match) {
               if (match[1] === "nth") {
                  if (!match[2]) {
                     Sizzle.error(match[0]);
                  }

                  match[2] = match[2].replace(/^\+|\s*/g, '');

                  // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
                  var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
                     match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
                     !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);

                  // calculate the numbers (first)n+(last) including if they are negative
                  match[2] = (test[1] + (test[2] || 1)) - 0;
                  match[3] = test[3] - 0;
               }
               else if (match[2]) {
                  Sizzle.error(match[0]);
               }

               // TODO: Move to normal caching system
               match[0] = done++;

               return match;
            },

            ATTR: function (match, curLoop, inplace, result, not, isXML) {
               var name = match[1] = match[1].replace(rBackslash, "");

               if (!isXML && Expr.attrMap[name]) {
                  match[1] = Expr.attrMap[name];
               }

               // Handle if an un-quoted value was used
               match[4] = (match[4] || match[5] || "").replace(rBackslash, "");

               if (match[2] === "~=") {
                  match[4] = " " + match[4] + " ";
               }

               return match;
            },

            PSEUDO: function (match, curLoop, inplace, result, not) {
               if (match[1] === "not") {
                  // If we're dealing with a complex expression, or a simple one
                  if ((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3])) {
                     match[3] = Sizzle(match[3], null, null, curLoop);

                  } else {
                     var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

                     if (!inplace) {
                        result.push.apply(result, ret);
                     }

                     return false;
                  }

               } else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
                  return true;
               }

               return match;
            },

            POS: function (match) {
               match.unshift(true);

               return match;
            }
         },

         filters: {
            enabled: function (elem) {
               return elem.disabled === false && elem.type !== "hidden";
            },

            disabled: function (elem) {
               return elem.disabled === true;
            },

            checked: function (elem) {
               return elem.checked === true;
            },

            selected: function (elem) {
               // Accessing this property makes selected-by-default
               // options in Safari work properly
               if (elem.parentNode) {
                  elem.parentNode.selectedIndex;
               }

               return elem.selected === true;
            },

            parent: function (elem) {
               return !!elem.firstChild;
            },

            empty: function (elem) {
               return !elem.firstChild;
            },

            has: function (elem, i, match) {
               return !!Sizzle(match[3], elem).length;
            },

            header: function (elem) {
               return (/h\d/i).test(elem.nodeName);
            },

            text: function (elem) {
               var attr = elem.getAttribute("type"), type = elem.type;
               // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
               // use getAttribute instead to test this case
               return elem.nodeName.toLowerCase() === "input" && "text" === type && (attr === type || attr === null);
            },

            radio: function (elem) {
               return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
            },

            checkbox: function (elem) {
               return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
            },

            file: function (elem) {
               return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
            },

            password: function (elem) {
               return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
            },

            submit: function (elem) {
               var name = elem.nodeName.toLowerCase();
               return (name === "input" || name === "button") && "submit" === elem.type;
            },

            image: function (elem) {
               return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
            },

            reset: function (elem) {
               var name = elem.nodeName.toLowerCase();
               return (name === "input" || name === "button") && "reset" === elem.type;
            },

            button: function (elem) {
               var name = elem.nodeName.toLowerCase();
               return name === "input" && "button" === elem.type || name === "button";
            },

            input: function (elem) {
               return (/input|select|textarea|button/i).test(elem.nodeName);
            },

            focus: function (elem) {
               return elem === elem.ownerDocument.activeElement;
            }
         },
         setFilters: {
            first: function (elem, i) {
               return i === 0;
            },

            last: function (elem, i, match, array) {
               return i === array.length - 1;
            },

            even: function (elem, i) {
               return i % 2 === 0;
            },

            odd: function (elem, i) {
               return i % 2 === 1;
            },

            lt: function (elem, i, match) {
               return i < match[3] - 0;
            },

            gt: function (elem, i, match) {
               return i > match[3] - 0;
            },

            nth: function (elem, i, match) {
               return match[3] - 0 === i;
            },

            eq: function (elem, i, match) {
               return match[3] - 0 === i;
            }
         },
         filter: {
            PSEUDO: function (elem, match, i, array) {
               var name = match[1],
                  filter = Expr.filters[name];

               if (filter) {
                  return filter(elem, i, match, array);

               } else if (name === "contains") {
                  return (elem.textContent || elem.innerText || getText([elem]) || "").indexOf(match[3]) >= 0;

               } else if (name === "not") {
                  var not = match[3];

                  for (var j = 0, l = not.length; j < l; j++) {
                     if (not[j] === elem) {
                        return false;
                     }
                  }

                  return true;

               } else {
                  Sizzle.error(name);
               }
            },

            CHILD: function (elem, match) {
               var first, last,
                  doneName, parent, cache,
                  count, diff,
                  type = match[1],
                  node = elem;

               switch (type) {
                  case "only":
                  case "first":
                     while ((node = node.previousSibling)) {
                        if (node.nodeType === 1) {
                           return false;
                        }
                     }

                     if (type === "first") {
                        return true;
                     }

                     node = elem;

                  case "last":
                     while ((node = node.nextSibling)) {
                        if (node.nodeType === 1) {
                           return false;
                        }
                     }

                     return true;

                  case "nth":
                     first = match[2];
                     last = match[3];

                     if (first === 1 && last === 0) {
                        return true;
                     }

                     doneName = match[0];
                     parent = elem.parentNode;

                     if (parent && (parent[expando] !== doneName || !elem.nodeIndex)) {
                        count = 0;

                        for (node = parent.firstChild; node; node = node.nextSibling) {
                           if (node.nodeType === 1) {
                              node.nodeIndex = ++count;
                           }
                        }

                        parent[expando] = doneName;
                     }

                     diff = elem.nodeIndex - last;

                     if (first === 0) {
                        return diff === 0;

                     } else {
                        return (diff % first === 0 && diff / first >= 0);
                     }
               }
            },

            ID: function (elem, match) {
               return elem.nodeType === 1 && elem.getAttribute("id") === match;
            },

            TAG: function (elem, match) {
               return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
            },

            CLASS: function (elem, match) {
               return (" " + (elem.className || elem.getAttribute("class")) + " ")
                  .indexOf(match) > -1;
            },

            ATTR: function (elem, match) {
               var name = match[1],
                  result = Sizzle.attr ?
                     Sizzle.attr(elem, name) :
                     Expr.attrHandle[name] ?
                        Expr.attrHandle[name](elem) :
                        elem[name] != null ?
                           elem[name] :
                           elem.getAttribute(name),
                  value = result + "",
                  type = match[2],
                  check = match[4];

               return result == null ?
                  type === "!=" :
                  !type && Sizzle.attr ?
                     result != null :
                     type === "=" ?
                        value === check :
                        type === "*=" ?
                           value.indexOf(check) >= 0 :
                           type === "~=" ?
                              (" " + value + " ").indexOf(check) >= 0 :
                              !check ?
                                 value && result !== false :
                                 type === "!=" ?
                                    value !== check :
                                    type === "^=" ?
                                       value.indexOf(check) === 0 :
                                       type === "$=" ?
                                          value.substr(value.length - check.length) === check :
                                          type === "|=" ?
                                             value === check || value.substr(0, check.length + 1) === check + "-" :
                                             false;
            },

            POS: function (elem, match, i, array) {
               var name = match[2],
                  filter = Expr.setFilters[name];

               if (filter) {
                  return filter(elem, i, match, array);
               }
            }
         }
      };

      var origPOS = Expr.match.POS,
         fescape = function (all, num) {
            return "\\" + (num - 0 + 1);
         };

      for (var type in Expr.match) {
         Expr.match[type] = new RegExp(Expr.match[type].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
         Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
      }

      var makeArray = function (array, results) {
         array = Array.prototype.slice.call(array, 0);

         if (results) {
            results.push.apply(results, array);
            return results;
         }

         return array;
      };

      // Perform a simple check to determine if the browser is capable of
      // converting a NodeList to an array using builtin methods.
      // Also verifies that the returned array holds DOM nodes
      // (which is not the case in the Blackberry browser)
      try {
         Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;

         // Provide a fallback method if it does not work
      } catch (e) {
         makeArray = function (array, results) {
            var i = 0,
               ret = results || [];

            if (toString.call(array) === "[object Array]") {
               Array.prototype.push.apply(ret, array);

            } else {
               if (typeof array.length === "number") {
                  for (var l = array.length; i < l; i++) {
                     ret.push(array[i]);
                  }

               } else {
                  for (; array[i]; i++) {
                     ret.push(array[i]);
                  }
               }
            }

            return ret;
         };
      }

      var sortOrder, siblingCheck;

      if (document.documentElement.compareDocumentPosition) {
         sortOrder = function (a, b) {
            if (a === b) {
               hasDuplicate = true;
               return 0;
            }

            if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
               return a.compareDocumentPosition ? -1 : 1;
            }

            return a.compareDocumentPosition(b) & 4 ? -1 : 1;
         };

      } else {
         sortOrder = function (a, b) {
            // The nodes are identical, we can exit early
            if (a === b) {
               hasDuplicate = true;
               return 0;

               // Fallback to using sourceIndex (in IE) if it's available on both nodes
            } else if (a.sourceIndex && b.sourceIndex) {
               return a.sourceIndex - b.sourceIndex;
            }

            var al, bl,
               ap = [],
               bp = [],
               aup = a.parentNode,
               bup = b.parentNode,
               cur = aup;

            // If the nodes are siblings (or identical) we can do a quick check
            if (aup === bup) {
               return siblingCheck(a, b);

               // If no parents were found then the nodes are disconnected
            } else if (!aup) {
               return -1;

            } else if (!bup) {
               return 1;
            }

            // Otherwise they're somewhere else in the tree so we need
            // to build up a full list of the parentNodes for comparison
            while (cur) {
               ap.unshift(cur);
               cur = cur.parentNode;
            }

            cur = bup;

            while (cur) {
               bp.unshift(cur);
               cur = cur.parentNode;
            }

            al = ap.length;
            bl = bp.length;

            // Start walking down the tree looking for a discrepancy
            for (var i = 0; i < al && i < bl; i++) {
               if (ap[i] !== bp[i]) {
                  return siblingCheck(ap[i], bp[i]);
               }
            }

            // We ended someplace up the tree so do a sibling check
            return i === al ?
               siblingCheck(a, bp[i], -1) :
               siblingCheck(ap[i], b, 1);
         };

         siblingCheck = function (a, b, ret) {
            if (a === b) {
               return ret;

               var cur = a.nextSibling;
            }

            while (cur) {
               if (cur === b) {
                  return -1;
               }

               cur = cur.nextSibling;
            }

            return 1;
         };
      }

      // Check to see if the browser returns elements by name when
      // querying by getElementById (and provide a workaround)
      (function () {
         // We're going to inject a fake input element with a specified name
         var form = document.createElement("div"),
            id = "script" + (new Date()).getTime(),
            root = document.documentElement;

         form.innerHTML = "<a name='" + id + "'/>";

         // Inject it into the root element, check its status, and remove it quickly
         root.insertBefore(form, root.firstChild);

         // The workaround has to do additional checks after a getElementById
         // Which slows things down for other browsers (hence the branching)
         if (document.getElementById(id)) {
            Expr.find.ID = function (match, context, isXML) {
               if (typeof context.getElementById !== "undefined" && !isXML) {
                  var m = context.getElementById(match[1]);

                  return m ?
                     m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
                        [m] :
                        undefined :
                     [];
               }
            };

            Expr.filter.ID = function (elem, match) {
               var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

               return elem.nodeType === 1 && node && node.nodeValue === match;
            };
         }

         root.removeChild(form);

         // release memory in IE
         root = form = null;
      })();

      (function () {
         // Check to see if the browser returns only elements
         // when doing getElementsByTagName("*")

         // Create a fake element
         var div = document.createElement("div");
         div.appendChild(document.createComment(""));

         // Make sure no comments are found
         if (div.getElementsByTagName("*").length > 0) {
            Expr.find.TAG = function (match, context) {
               var results = context.getElementsByTagName(match[1]);

               // Filter out possible comments
               if (match[1] === "*") {
                  var tmp = [];

                  for (var i = 0; results[i]; i++) {
                     if (results[i].nodeType === 1) {
                        tmp.push(results[i]);
                     }
                  }

                  results = tmp;
               }

               return results;
            };
         }

         // Check to see if an attribute returns normalized href attributes
         div.innerHTML = "<a href='#'></a>";

         if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
            div.firstChild.getAttribute("href") !== "#") {

            Expr.attrHandle.href = function (elem) {
               return elem.getAttribute("href", 2);
            };
         }

         // release memory in IE
         div = null;
      })();

      if (document.querySelectorAll) {
         (function () {
            var oldSizzle = Sizzle,
               div = document.createElement("div"),
               id = "__sizzle__";

            div.innerHTML = "<p class='TEST'></p>";

            // Safari can't handle uppercase or unicode characters when
            // in quirks mode.
            if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
               return;
            }

            Sizzle = function (query, context, extra, seed) {
               context = context || document;

               // Only use querySelectorAll on non-XML documents
               // (ID selectors don't work in non-HTML documents)
               if (!seed && !Sizzle.isXML(context)) {
                  // See if we find a selector to speed up
                  var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(query);

                  if (match && (context.nodeType === 1 || context.nodeType === 9)) {
                     // Speed-up: Sizzle("TAG")
                     if (match[1]) {
                        return makeArray(context.getElementsByTagName(query), extra);

                        // Speed-up: Sizzle(".CLASS")
                     } else if (match[2] && Expr.find.CLASS && context.getElementsByClassName) {
                        return makeArray(context.getElementsByClassName(match[2]), extra);
                     }
                  }

                  if (context.nodeType === 9) {
                     // Speed-up: Sizzle("body")
                     // The body element only exists once, optimize finding it
                     if (query === "body" && context.body) {
                        return makeArray([context.body], extra);

                        // Speed-up: Sizzle("#ID")
                     } else if (match && match[3]) {
                        var elem = context.getElementById(match[3]);

                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        if (elem && elem.parentNode) {
                           // Handle the case where IE and Opera return items
                           // by name instead of ID
                           if (elem.id === match[3]) {
                              return makeArray([elem], extra);
                           }

                        } else {
                           return makeArray([], extra);
                        }
                     }

                     try {
                        return makeArray(context.querySelectorAll(query), extra);
                     } catch (qsaError) { }

                     // qSA works strangely on Element-rooted queries
                     // We can work around this by specifying an extra ID on the root
                     // and working up from there (Thanks to Andrew Dupont for the technique)
                     // IE 8 doesn't work on object elements
                  } else if (context.nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                     var oldContext = context,
                        old = context.getAttribute("id"),
                        nid = old || id,
                        hasParent = context.parentNode,
                        relativeHierarchySelector = /^\s*[+~]/.test(query);

                     if (!old) {
                        context.setAttribute("id", nid);
                     } else {
                        nid = nid.replace(/'/g, "\\$&");
                     }
                     if (relativeHierarchySelector && hasParent) {
                        context = context.parentNode;
                     }

                     try {
                        if (!relativeHierarchySelector || hasParent) {
                           return makeArray(context.querySelectorAll("[id='" + nid + "'] " + query), extra);
                        }

                     } catch (pseudoError) {
                     } finally {
                        if (!old) {
                           oldContext.removeAttribute("id");
                        }
                     }
                  }
               }

               return oldSizzle(query, context, extra, seed);
            };

            for (var prop in oldSizzle) {
               Sizzle[prop] = oldSizzle[prop];
            }

            // release memory in IE
            div = null;
         })();
      }

      (function () {
         var html = document.documentElement,
            matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

         if (matches) {
            // Check to see if it's possible to do matchesSelector
            // on a disconnected node (IE 9 fails this)
            var disconnectedMatch = !matches.call(document.createElement("div"), "div"),
               pseudoWorks = false;

            try {
               // This should fail with an exception
               // Gecko does not error, returns false instead
               matches.call(document.documentElement, "[test!='']:sizzle");

            } catch (pseudoError) {
               pseudoWorks = true;
            }

            Sizzle.matchesSelector = function (node, expr) {
               // Make sure that attribute selectors are quoted
               expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

               if (!Sizzle.isXML(node)) {
                  try {
                     if (pseudoWorks || !Expr.match.PSEUDO.test(expr) && !/!=/.test(expr)) {
                        var ret = matches.call(node, expr);

                        // IE 9's matchesSelector returns false on disconnected nodes
                        if (ret || !disconnectedMatch ||
                           // As well, disconnected nodes are said to be in a document
                           // fragment in IE 9, so check for that
                           node.document && node.document.nodeType !== 11) {
                           return ret;
                        }
                     }
                  } catch (e) { }
               }

               return Sizzle(expr, null, null, [node]).length > 0;
            };
         }
      })();

      (function () {
         var div = document.createElement("div");

         div.innerHTML = "<div class='test e'></div><div class='test'></div>";

         // Opera can't find a second classname (in 9.6)
         // Also, make sure that getElementsByClassName actually exists
         if (!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
            return;
         }

         // Safari caches class attributes, doesn't catch changes (in 3.2)
         div.lastChild.className = "e";

         if (div.getElementsByClassName("e").length === 1) {
            return;
         }

         Expr.order.splice(1, 0, "CLASS");
         Expr.find.CLASS = function (match, context, isXML) {
            if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
               return context.getElementsByClassName(match[1]);
            }
         };

         // release memory in IE
         div = null;
      })();

      function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
         for (var i = 0, l = checkSet.length; i < l; i++) {
            var elem = checkSet[i];

            if (elem) {
               var match = false;

               elem = elem[dir];

               while (elem) {
                  if (elem[expando] === doneName) {
                     match = checkSet[elem.sizset];
                     break;
                  }

                  if (elem.nodeType === 1 && !isXML) {
                     elem[expando] = doneName;
                     elem.sizset = i;
                  }

                  if (elem.nodeName.toLowerCase() === cur) {
                     match = elem;
                     break;
                  }

                  elem = elem[dir];
               }

               checkSet[i] = match;
            }
         }
      }

      function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
         for (var i = 0, l = checkSet.length; i < l; i++) {
            var elem = checkSet[i];

            if (elem) {
               var match = false;

               elem = elem[dir];

               while (elem) {
                  if (elem[expando] === doneName) {
                     match = checkSet[elem.sizset];
                     break;
                  }

                  if (elem.nodeType === 1) {
                     if (!isXML) {
                        elem[expando] = doneName;
                        elem.sizset = i;
                     }

                     if (typeof cur !== "string") {
                        if (elem === cur) {
                           match = true;
                           break;
                        }

                     } else if (Sizzle.filter(cur, [elem]).length > 0) {
                        match = elem;
                        break;
                     }
                  }

                  elem = elem[dir];
               }

               checkSet[i] = match;
            }
         }
      }

      if (document.documentElement.contains) {
         Sizzle.contains = function (a, b) {
            return a !== b && (a.contains ? a.contains(b) : true);
         };

      } else if (document.documentElement.compareDocumentPosition) {
         Sizzle.contains = function (a, b) {
            return !!(a.compareDocumentPosition(b) & 16);
         };

      } else {
         Sizzle.contains = function () {
            return false;
         };
      }

      Sizzle.isXML = function (elem) {
         // documentElement is verified for cases where it doesn't yet exist
         // (such as loading iframes in IE - #4833)
         var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

         return documentElement ? documentElement.nodeName !== "HTML" : false;
      };

      var posProcess = function (selector, context, seed) {
         var match,
            tmpSet = [],
            later = "",
            root = context.nodeType ? [context] : context;

         // Position selectors must be done after the filter
         // And so must :not(positional) so we move all PSEUDOs to the end
         while ((match = Expr.match.PSEUDO.exec(selector))) {
            later += match[0];
            selector = selector.replace(Expr.match.PSEUDO, "");
         }

         selector = Expr.relative[selector] ? selector + "*" : selector;

         for (var i = 0, l = root.length; i < l; i++) {
            Sizzle(selector, root[i], tmpSet, seed);
         }

         return Sizzle.filter(later, tmpSet);
      };

      // EXPOSE
      // Override sizzle attribute retrieval
      Sizzle.attr = jQuery.attr;
      Sizzle.selectors.attrMap = {};
      jQuery.find = Sizzle;
      jQuery.expr = Sizzle.selectors;
      jQuery.expr[":"] = jQuery.expr.filters;
      jQuery.unique = Sizzle.uniqueSort;
      jQuery.text = Sizzle.getText;
      jQuery.isXMLDoc = Sizzle.isXML;
      jQuery.contains = Sizzle.contains;


   })();


   var runtil = /Until$/,
      rparentsprev = /^(?:parents|prevUntil|prevAll)/,
      // Note: This RegExp should be improved, or likely pulled from Sizzle
      rmultiselector = /,/,
      isSimple = /^.[^:#\[\.,]*$/,
      slice = Array.prototype.slice,
      POS = jQuery.expr.match.POS,
      // methods guaranteed to produce a unique set when starting from a unique set
      guaranteedUnique = {
         children: true,
         contents: true,
         next: true,
         prev: true
      };

   jQuery.fn.extend({
      find: function (selector) {
         var self = this,
            i, l;

         if (typeof selector !== "string") {
            return jQuery(selector).filter(function () {
               for (i = 0, l = self.length; i < l; i++) {
                  if (jQuery.contains(self[i], this)) {
                     return true;
                  }
               }
            });
         }

         var ret = this.pushStack("", "find", selector),
            length, n, r;

         for (i = 0, l = this.length; i < l; i++) {
            length = ret.length;
            jQuery.find(selector, this[i], ret);

            if (i > 0) {
               // Make sure that the results are unique
               for (n = length; n < ret.length; n++) {
                  for (r = 0; r < length; r++) {
                     if (ret[r] === ret[n]) {
                        ret.splice(n--, 1);
                        break;
                     }
                  }
               }
            }
         }

         return ret;
      },

      has: function (target) {
         var targets = jQuery(target);
         return this.filter(function () {
            for (var i = 0, l = targets.length; i < l; i++) {
               if (jQuery.contains(this, targets[i])) {
                  return true;
               }
            }
         });
      },

      not: function (selector) {
         return this.pushStack(winnow(this, selector, false), "not", selector);
      },

      filter: function (selector) {
         return this.pushStack(winnow(this, selector, true), "filter", selector);
      },

      is: function (selector) {
         return !!selector && (
            typeof selector === "string" ?
               // If this is a positional selector, check membership in the returned set
               // so $("p:first").is("p:last") won't return true for a doc with two "p".
               POS.test(selector) ?
                  jQuery(selector, this.context).index(this[0]) >= 0 :
                  jQuery.filter(selector, this).length > 0 :
               this.filter(selector).length > 0);
      },

      closest: function (selectors, context) {
         var ret = [], i, l, cur = this[0];

         // Array (deprecated as of jQuery 1.7)
         if (jQuery.isArray(selectors)) {
            var level = 1;

            while (cur && cur.ownerDocument && cur !== context) {
               for (i = 0; i < selectors.length; i++) {

                  if (jQuery(cur).is(selectors[i])) {
                     ret.push({ selector: selectors[i], elem: cur, level: level });
                  }
               }

               cur = cur.parentNode;
               level++;
            }

            return ret;
         }

         // String
         var pos = POS.test(selectors) || typeof selectors !== "string" ?
            jQuery(selectors, context || this.context) :
            0;

         for (i = 0, l = this.length; i < l; i++) {
            cur = this[i];

            while (cur) {
               if (pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors)) {
                  ret.push(cur);
                  break;

               } else {
                  cur = cur.parentNode;
                  if (!cur || !cur.ownerDocument || cur === context || cur.nodeType === 11) {
                     break;
                  }
               }
            }
         }

         ret = ret.length > 1 ? jQuery.unique(ret) : ret;

         return this.pushStack(ret, "closest", selectors);
      },

      // Determine the position of an element within
      // the matched set of elements
      index: function (elem) {

         // No argument, return index in parent
         if (!elem) {
            return (this[0] && this[0].parentNode) ? this.prevAll().length : -1;
         }

         // index in selector
         if (typeof elem === "string") {
            return jQuery.inArray(this[0], jQuery(elem));
         }

         // Locate the position of the desired element
         return jQuery.inArray(
            // If it receives a jQuery object, the first element is used
            elem.jquery ? elem[0] : elem, this);
      },

      add: function (selector, context) {
         var set = typeof selector === "string" ?
            jQuery(selector, context) :
            jQuery.makeArray(selector && selector.nodeType ? [selector] : selector),
            all = jQuery.merge(this.get(), set);

         return this.pushStack(isDisconnected(set[0]) || isDisconnected(all[0]) ?
            all :
            jQuery.unique(all));
      },

      andSelf: function () {
         return this.add(this.prevObject);
      }
   });

   // A painfully simple check to see if an element is disconnected
   // from a document (should be improved, where feasible).
   function isDisconnected(node) {
      return !node || !node.parentNode || node.parentNode.nodeType === 11;
   }

   jQuery.each({
      parent: function (elem) {
         var parent = elem.parentNode;
         return parent && parent.nodeType !== 11 ? parent : null;
      },
      parents: function (elem) {
         return jQuery.dir(elem, "parentNode");
      },
      parentsUntil: function (elem, i, until) {
         return jQuery.dir(elem, "parentNode", until);
      },
      next: function (elem) {
         return jQuery.nth(elem, 2, "nextSibling");
      },
      prev: function (elem) {
         return jQuery.nth(elem, 2, "previousSibling");
      },
      nextAll: function (elem) {
         return jQuery.dir(elem, "nextSibling");
      },
      prevAll: function (elem) {
         return jQuery.dir(elem, "previousSibling");
      },
      nextUntil: function (elem, i, until) {
         return jQuery.dir(elem, "nextSibling", until);
      },
      prevUntil: function (elem, i, until) {
         return jQuery.dir(elem, "previousSibling", until);
      },
      siblings: function (elem) {
         return jQuery.sibling(elem.parentNode.firstChild, elem);
      },
      children: function (elem) {
         return jQuery.sibling(elem.firstChild);
      },
      contents: function (elem) {
         return jQuery.nodeName(elem, "iframe") ?
            elem.contentDocument || elem.contentWindow.document :
            jQuery.makeArray(elem.childNodes);
      }
   }, function (name, fn) {
      jQuery.fn[name] = function (until, selector) {
         var ret = jQuery.map(this, fn, until);

         if (!runtil.test(name)) {
            selector = until;
         }

         if (selector && typeof selector === "string") {
            ret = jQuery.filter(selector, ret);
         }

         ret = this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret;

         if ((this.length > 1 || rmultiselector.test(selector)) && rparentsprev.test(name)) {
            ret = ret.reverse();
         }

         return this.pushStack(ret, name, slice.call(arguments).join(","));
      };
   });

   jQuery.extend({
      filter: function (expr, elems, not) {
         if (not) {
            expr = ":not(" + expr + ")";
         }

         return elems.length === 1 ?
            jQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : [] :
            jQuery.find.matches(expr, elems);
      },

      dir: function (elem, dir, until) {
         var matched = [],
            cur = elem[dir];

         while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
            if (cur.nodeType === 1) {
               matched.push(cur);
            }
            cur = cur[dir];
         }
         return matched;
      },

      nth: function (cur, result, dir, elem) {
         result = result || 1;
         var num = 0;

         for (; cur; cur = cur[dir]) {
            if (cur.nodeType === 1 && ++num === result) {
               break;
            }
         }

         return cur;
      },

      sibling: function (n, elem) {
         var r = [];

         for (; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== elem) {
               r.push(n);
            }
         }

         return r;
      }
   });

   // Implement the identical functionality for filter and not
   function winnow(elements, qualifier, keep) {

      // Can't pass null or undefined to indexOf in Firefox 4
      // Set to 0 to skip string check
      qualifier = qualifier || 0;

      if (jQuery.isFunction(qualifier)) {
         return jQuery.grep(elements, function (elem, i) {
            var retVal = !!qualifier.call(elem, i, elem);
            return retVal === keep;
         });

      } else if (qualifier.nodeType) {
         return jQuery.grep(elements, function (elem, i) {
            return (elem === qualifier) === keep;
         });

      } else if (typeof qualifier === "string") {
         var filtered = jQuery.grep(elements, function (elem) {
            return elem.nodeType === 1;
         });

         if (isSimple.test(qualifier)) {
            return jQuery.filter(qualifier, filtered, !keep);
         } else {
            qualifier = jQuery.filter(qualifier, filtered);
         }
      }

      return jQuery.grep(elements, function (elem, i) {
         return (jQuery.inArray(elem, qualifier) >= 0) === keep;
      });
   }




   function createSafeFragment(document) {
      var list = nodeNames.split("|"),
         safeFrag = document.createDocumentFragment();

      if (safeFrag.createElement) {
         while (list.length) {
            safeFrag.createElement(
               list.pop()
            );
         }
      }
      return safeFrag;
   }

   var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
      "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
      rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
      rleadingWhitespace = /^\s+/,
      rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
      rtagName = /<([\w:]+)/,
      rtbody = /<tbody/i,
      rhtml = /<|&#?\w+;/,
      rnoInnerhtml = /<(?:script|style)/i,
      rnocache = /<(?:script|object|embed|option|style)/i,
      rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
      // checked="checked" or checked
      rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
      rscriptType = /\/(java|ecma)script/i,
      rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
      wrapMap = {
         option: [1, "<select multiple='multiple'>", "</select>"],
         legend: [1, "<fieldset>", "</fieldset>"],
         thead: [1, "<table>", "</table>"],
         tr: [2, "<table><tbody>", "</tbody></table>"],
         td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
         col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
         area: [1, "<map>", "</map>"],
         _default: [0, "", ""]
      },
      safeFragment = createSafeFragment(document);

   wrapMap.optgroup = wrapMap.option;
   wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
   wrapMap.th = wrapMap.td;

   // IE can't serialize <link> and <script> tags normally
   if (!jQuery.support.htmlSerialize) {
      wrapMap._default = [1, "div<div>", "</div>"];
   }

   jQuery.fn.extend({
      text: function (text) {
         if (jQuery.isFunction(text)) {
            return this.each(function (i) {
               var self = jQuery(this);

               self.text(text.call(this, i, self.text()));
            });
         }

         if (typeof text !== "object" && text !== undefined) {
            return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(text));
         }

         return jQuery.text(this);
      },

      wrapAll: function (html) {
         if (jQuery.isFunction(html)) {
            return this.each(function (i) {
               jQuery(this).wrapAll(html.call(this, i));
            });
         }

         if (this[0]) {
            // The elements to wrap the target around
            var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

            if (this[0].parentNode) {
               wrap.insertBefore(this[0]);
            }

            wrap.map(function () {
               var elem = this;

               while (elem.firstChild && elem.firstChild.nodeType === 1) {
                  elem = elem.firstChild;
               }

               return elem;
            }).append(this);
         }

         return this;
      },

      wrapInner: function (html) {
         if (jQuery.isFunction(html)) {
            return this.each(function (i) {
               jQuery(this).wrapInner(html.call(this, i));
            });
         }

         return this.each(function () {
            var self = jQuery(this),
               contents = self.contents();

            if (contents.length) {
               contents.wrapAll(html);

            } else {
               self.append(html);
            }
         });
      },

      wrap: function (html) {
         var isFunction = jQuery.isFunction(html);

         return this.each(function (i) {
            jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
         });
      },

      unwrap: function () {
         return this.parent().each(function () {
            if (!jQuery.nodeName(this, "body")) {
               jQuery(this).replaceWith(this.childNodes);
            }
         }).end();
      },

      append: function () {
         return this.domManip(arguments, true, function (elem) {
            if (this.nodeType === 1) {
               this.appendChild(elem);
            }
         });
      },

      prepend: function () {
         return this.domManip(arguments, true, function (elem) {
            if (this.nodeType === 1) {
               this.insertBefore(elem, this.firstChild);
            }
         });
      },

      before: function () {
         if (this[0] && this[0].parentNode) {
            return this.domManip(arguments, false, function (elem) {
               this.parentNode.insertBefore(elem, this);
            });
         } else if (arguments.length) {
            var set = jQuery.clean(arguments);
            set.push.apply(set, this.toArray());
            return this.pushStack(set, "before", arguments);
         }
      },

      after: function () {
         if (this[0] && this[0].parentNode) {
            return this.domManip(arguments, false, function (elem) {
               this.parentNode.insertBefore(elem, this.nextSibling);
            });
         } else if (arguments.length) {
            var set = this.pushStack(this, "after", arguments);
            set.push.apply(set, jQuery.clean(arguments));
            return set;
         }
      },

      // keepData is for internal use only--do not document
      remove: function (selector, keepData) {
         for (var i = 0, elem; (elem = this[i]) != null; i++) {
            if (!selector || jQuery.filter(selector, [elem]).length) {
               if (!keepData && elem.nodeType === 1) {
                  jQuery.cleanData(elem.getElementsByTagName("*"));
                  jQuery.cleanData([elem]);
               }

               if (elem.parentNode) {
                  elem.parentNode.removeChild(elem);
               }
            }
         }

         return this;
      },

      empty: function () {
         for (var i = 0, elem; (elem = this[i]) != null; i++) {
            // Remove element nodes and prevent memory leaks
            if (elem.nodeType === 1) {
               jQuery.cleanData(elem.getElementsByTagName("*"));
            }

            // Remove any remaining nodes
            while (elem.firstChild) {
               elem.removeChild(elem.firstChild);
            }
         }

         return this;
      },

      clone: function (dataAndEvents, deepDataAndEvents) {
         dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
         deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

         return this.map(function () {
            return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
         });
      },

      html: function (value) {
         if (value === undefined) {
            return this[0] && this[0].nodeType === 1 ?
               this[0].innerHTML.replace(rinlinejQuery, "") :
               null;

            // See if we can take a shortcut and just use innerHTML
         } else if (typeof value === "string" && !rnoInnerhtml.test(value) &&
            (jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) &&
            !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

            value = value.replace(rxhtmlTag, "<$1></$2>");

            try {
               for (var i = 0, l = this.length; i < l; i++) {
                  // Remove element nodes and prevent memory leaks
                  if (this[i].nodeType === 1) {
                     jQuery.cleanData(this[i].getElementsByTagName("*"));
                     this[i].innerHTML = value;
                  }
               }

               // If using innerHTML throws an exception, use the fallback method
            } catch (e) {
               this.empty().append(value);
            }

         } else if (jQuery.isFunction(value)) {
            this.each(function (i) {
               var self = jQuery(this);

               self.html(value.call(this, i, self.html()));
            });

         } else {
            this.empty().append(value);
         }

         return this;
      },

      replaceWith: function (value) {
         if (this[0] && this[0].parentNode) {
            // Make sure that the elements are removed from the DOM before they are inserted
            // this can help fix replacing a parent with child elements
            if (jQuery.isFunction(value)) {
               return this.each(function (i) {
                  var self = jQuery(this), old = self.html();
                  self.replaceWith(value.call(this, i, old));
               });
            }

            if (typeof value !== "string") {
               value = jQuery(value).detach();
            }

            return this.each(function () {
               var next = this.nextSibling,
                  parent = this.parentNode;

               jQuery(this).remove();

               if (next) {
                  jQuery(next).before(value);
               } else {
                  jQuery(parent).append(value);
               }
            });
         } else {
            return this.length ?
               this.pushStack(jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value) :
               this;
         }
      },

      detach: function (selector) {
         return this.remove(selector, true);
      },

      domManip: function (args, table, callback) {
         var results, first, fragment, parent,
            value = args[0],
            scripts = [];

         // We can't cloneNode fragments that contain checked, in WebKit
         if (!jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test(value)) {
            return this.each(function () {
               jQuery(this).domManip(args, table, callback, true);
            });
         }

         if (jQuery.isFunction(value)) {
            return this.each(function (i) {
               var self = jQuery(this);
               args[0] = value.call(this, i, table ? self.html() : undefined);
               self.domManip(args, table, callback);
            });
         }

         if (this[0]) {
            parent = value && value.parentNode;

            // If we're in a fragment, just use that instead of building a new one
            if (jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length) {
               results = { fragment: parent };

            } else {
               results = jQuery.buildFragment(args, this, scripts);
            }

            fragment = results.fragment;

            if (fragment.childNodes.length === 1) {
               first = fragment = fragment.firstChild;
            } else {
               first = fragment.firstChild;
            }

            if (first) {
               table = table && jQuery.nodeName(first, "tr");

               for (var i = 0, l = this.length, lastIndex = l - 1; i < l; i++) {
                  callback.call(
                     table ?
                        root(this[i], first) :
                        this[i],
                     // Make sure that we do not leak memory by inadvertently discarding
                     // the original fragment (which might have attached data) instead of
                     // using it; in addition, use the original fragment object for the last
                     // item instead of first because it can end up being emptied incorrectly
                     // in certain situations (Bug #8070).
                     // Fragments from the fragment cache must always be cloned and never used
                     // in place.
                     results.cacheable || (l > 1 && i < lastIndex) ?
                        jQuery.clone(fragment, true, true) :
                        fragment
                  );
               }
            }

            if (scripts.length) {
               jQuery.each(scripts, evalScript);
            }
         }

         return this;
      }
   });

   function root(elem, cur) {
      return jQuery.nodeName(elem, "table") ?
         (elem.getElementsByTagName("tbody")[0] ||
            elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
         elem;
   }

   function cloneCopyEvent(src, dest) {

      if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
         return;
      }

      var type, i, l,
         oldData = jQuery._data(src),
         curData = jQuery._data(dest, oldData),
         events = oldData.events;

      if (events) {
         delete curData.handle;
         curData.events = {};

         for (type in events) {
            for (i = 0, l = events[type].length; i < l; i++) {
               jQuery.event.add(dest, type + (events[type][i].namespace ? "." : "") + events[type][i].namespace, events[type][i], events[type][i].data);
            }
         }
      }

      // make the cloned public data object a copy from the original
      if (curData.data) {
         curData.data = jQuery.extend({}, curData.data);
      }
   }

   function cloneFixAttributes(src, dest) {
      var nodeName;

      // We do not need to do anything for non-Elements
      if (dest.nodeType !== 1) {
         return;
      }

      // clearAttributes removes the attributes, which we don't want,
      // but also removes the attachEvent events, which we *do* want
      if (dest.clearAttributes) {
         dest.clearAttributes();
      }

      // mergeAttributes, in contrast, only merges back on the
      // original attributes, not the events
      if (dest.mergeAttributes) {
         dest.mergeAttributes(src);
      }

      nodeName = dest.nodeName.toLowerCase();

      // IE6-8 fail to clone children inside object elements that use
      // the proprietary classid attribute value (rather than the type
      // attribute) to identify the type of content to display
      if (nodeName === "object") {
         dest.outerHTML = src.outerHTML;

      } else if (nodeName === "input" && (src.type === "checkbox" || src.type === "radio")) {
         // IE6-8 fails to persist the checked state of a cloned checkbox
         // or radio button. Worse, IE6-7 fail to give the cloned element
         // a checked appearance if the defaultChecked value isn't also set
         if (src.checked) {
            dest.defaultChecked = dest.checked = src.checked;
         }

         // IE6-7 get confused and end up setting the value of a cloned
         // checkbox/radio button to an empty string instead of "on"
         if (dest.value !== src.value) {
            dest.value = src.value;
         }

         // IE6-8 fails to return the selected option to the default selected
         // state when cloning options
      } else if (nodeName === "option") {
         dest.selected = src.defaultSelected;

         // IE6-8 fails to set the defaultValue to the correct value when
         // cloning other types of input fields
      } else if (nodeName === "input" || nodeName === "textarea") {
         dest.defaultValue = src.defaultValue;
      }

      // Event data gets referenced instead of copied if the expando
      // gets copied too
      dest.removeAttribute(jQuery.expando);
   }

   jQuery.buildFragment = function (args, nodes, scripts) {
      var fragment, cacheable, cacheresults, doc,
         first = args[0];

      // nodes may contain either an explicit document object,
      // a jQuery collection or context object.
      // If nodes[0] contains a valid object to assign to doc
      if (nodes && nodes[0]) {
         doc = nodes[0].ownerDocument || nodes[0];
      }

      // Ensure that an attr object doesn't incorrectly stand in as a document object
      // Chrome and Firefox seem to allow this to occur and will throw exception
      // Fixes #8950
      if (!doc.createDocumentFragment) {
         doc = document;
      }

      // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
      // Cloning options loses the selected state, so don't cache them
      // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
      // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
      // Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
      if (args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
         first.charAt(0) === "<" && !rnocache.test(first) &&
         (jQuery.support.checkClone || !rchecked.test(first)) &&
         (jQuery.support.html5Clone || !rnoshimcache.test(first))) {

         cacheable = true;

         cacheresults = jQuery.fragments[first];
         if (cacheresults && cacheresults !== 1) {
            fragment = cacheresults;
         }
      }

      if (!fragment) {
         fragment = doc.createDocumentFragment();
         jQuery.clean(args, doc, fragment, scripts);
      }

      if (cacheable) {
         jQuery.fragments[first] = cacheresults ? fragment : 1;
      }

      return { fragment: fragment, cacheable: cacheable };
   };

   jQuery.fragments = {};

   jQuery.each({
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith"
   }, function (name, original) {
      jQuery.fn[name] = function (selector) {
         var ret = [],
            insert = jQuery(selector),
            parent = this.length === 1 && this[0].parentNode;

         if (parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1) {
            insert[original](this[0]);
            return this;

         } else {
            for (var i = 0, l = insert.length; i < l; i++) {
               var elems = (i > 0 ? this.clone(true) : this).get();
               jQuery(insert[i])[original](elems);
               ret = ret.concat(elems);
            }

            return this.pushStack(ret, name, insert.selector);
         }
      };
   });

   function getAll(elem) {
      if (typeof elem.getElementsByTagName !== "undefined") {
         return elem.getElementsByTagName("*");

      } else if (typeof elem.querySelectorAll !== "undefined") {
         return elem.querySelectorAll("*");

      } else {
         return [];
      }
   }

   // Used in clean, fixes the defaultChecked property
   function fixDefaultChecked(elem) {
      if (elem.type === "checkbox" || elem.type === "radio") {
         elem.defaultChecked = elem.checked;
      }
   }
   // Finds all inputs and passes them to fixDefaultChecked
   function findInputs(elem) {
      var nodeName = (elem.nodeName || "").toLowerCase();
      if (nodeName === "input") {
         fixDefaultChecked(elem);
         // Skip scripts, get other children
      } else if (nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined") {
         jQuery.grep(elem.getElementsByTagName("input"), fixDefaultChecked);
      }
   }

   // Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
   function shimCloneNode(elem) {
      var div = document.createElement("div");
      safeFragment.appendChild(div);

      div.innerHTML = elem.outerHTML;
      return div.firstChild;
   }

   jQuery.extend({
      clone: function (elem, dataAndEvents, deepDataAndEvents) {
         var srcElements,
            destElements,
            i,
            // IE<=8 does not properly clone detached, unknown element nodes
            clone = jQuery.support.html5Clone || !rnoshimcache.test("<" + elem.nodeName) ?
               elem.cloneNode(true) :
               shimCloneNode(elem);

         if ((!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
            (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
            // IE copies events bound via attachEvent when using cloneNode.
            // Calling detachEvent on the clone will also remove the events
            // from the original. In order to get around this, we use some
            // proprietary methods to clear the events. Thanks to MooTools
            // guys for this hotness.

            cloneFixAttributes(elem, clone);

            // Using Sizzle here is crazy slow, so we use getElementsByTagName instead
            srcElements = getAll(elem);
            destElements = getAll(clone);

            // Weird iteration because IE will replace the length property
            // with an element if you are cloning the body and one of the
            // elements on the page has a name or id of "length"
            for (i = 0; srcElements[i]; ++i) {
               // Ensure that the destination node is not null; Fixes #9587
               if (destElements[i]) {
                  cloneFixAttributes(srcElements[i], destElements[i]);
               }
            }
         }

         // Copy the events from the original to the clone
         if (dataAndEvents) {
            cloneCopyEvent(elem, clone);

            if (deepDataAndEvents) {
               srcElements = getAll(elem);
               destElements = getAll(clone);

               for (i = 0; srcElements[i]; ++i) {
                  cloneCopyEvent(srcElements[i], destElements[i]);
               }
            }
         }

         srcElements = destElements = null;

         // Return the cloned set
         return clone;
      },

      clean: function (elems, context, fragment, scripts) {
         var checkScriptType;

         context = context || document;

         // !context.createElement fails in IE with an error but returns typeof 'object'
         if (typeof context.createElement === "undefined") {
            context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
         }

         var ret = [], j;

         for (var i = 0, elem; (elem = elems[i]) != null; i++) {
            if (typeof elem === "number") {
               elem += "";
            }

            if (!elem) {
               continue;
            }

            // Convert html string into DOM nodes
            if (typeof elem === "string") {
               if (!rhtml.test(elem)) {
                  elem = context.createTextNode(elem);
               } else {
                  // Fix "XHTML"-style tags in all browsers
                  elem = elem.replace(rxhtmlTag, "<$1></$2>");

                  // Trim whitespace, otherwise indexOf won't work as expected
                  var tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase(),
                     wrap = wrapMap[tag] || wrapMap._default,
                     depth = wrap[0],
                     div = context.createElement("div");

                  // Append wrapper element to unknown element safe doc fragment
                  if (context === document) {
                     // Use the fragment we've already created for this document
                     safeFragment.appendChild(div);
                  } else {
                     // Use a fragment created with the owner document
                     createSafeFragment(context).appendChild(div);
                  }

                  // Go to html and back, then peel off extra wrappers
                  div.innerHTML = wrap[1] + elem + wrap[2];

                  // Move to the right depth
                  while (depth--) {
                     div = div.lastChild;
                  }

                  // Remove IE's autoinserted <tbody> from table fragments
                  if (!jQuery.support.tbody) {

                     // String was a <table>, *may* have spurious <tbody>
                     var hasBody = rtbody.test(elem),
                        tbody = tag === "table" && !hasBody ?
                           div.firstChild && div.firstChild.childNodes :

                           // String was a bare <thead> or <tfoot>
                           wrap[1] === "<table>" && !hasBody ?
                              div.childNodes :
                              [];

                     for (j = tbody.length - 1; j >= 0; --j) {
                        if (jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length) {
                           tbody[j].parentNode.removeChild(tbody[j]);
                        }
                     }
                  }

                  // IE completely kills leading whitespace when innerHTML is used
                  if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem)) {
                     div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]), div.firstChild);
                  }

                  elem = div.childNodes;
               }
            }

            // Resets defaultChecked for any radios and checkboxes
            // about to be appended to the DOM in IE 6/7 (#8060)
            var len;
            if (!jQuery.support.appendChecked) {
               if (elem[0] && typeof (len = elem.length) === "number") {
                  for (j = 0; j < len; j++) {
                     findInputs(elem[j]);
                  }
               } else {
                  findInputs(elem);
               }
            }

            if (elem.nodeType) {
               ret.push(elem);
            } else {
               ret = jQuery.merge(ret, elem);
            }
         }

         if (fragment) {
            checkScriptType = function (elem) {
               return !elem.type || rscriptType.test(elem.type);
            };
            for (i = 0; ret[i]; i++) {
               if (scripts && jQuery.nodeName(ret[i], "script") && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript")) {
                  scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i]);

               } else {
                  if (ret[i].nodeType === 1) {
                     var jsTags = jQuery.grep(ret[i].getElementsByTagName("script"), checkScriptType);

                     ret.splice.apply(ret, [i + 1, 0].concat(jsTags));
                  }
                  fragment.appendChild(ret[i]);
               }
            }
         }

         return ret;
      },

      cleanData: function (elems) {
         var data, id,
            cache = jQuery.cache,
            special = jQuery.event.special,
            deleteExpando = jQuery.support.deleteExpando;

         for (var i = 0, elem; (elem = elems[i]) != null; i++) {
            if (elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) {
               continue;
            }

            id = elem[jQuery.expando];

            if (id) {
               data = cache[id];

               if (data && data.events) {
                  for (var type in data.events) {
                     if (special[type]) {
                        jQuery.event.remove(elem, type);

                        // This is a shortcut to avoid jQuery.event.remove's overhead
                     } else {
                        jQuery.removeEvent(elem, type, data.handle);
                     }
                  }

                  // Null the DOM reference to avoid IE6/7/8 leak (#7054)
                  if (data.handle) {
                     data.handle.elem = null;
                  }
               }

               if (deleteExpando) {
                  delete elem[jQuery.expando];

               } else if (elem.removeAttribute) {
                  elem.removeAttribute(jQuery.expando);
               }

               delete cache[id];
            }
         }
      }
   });

   function evalScript(i, elem) {
      if (elem.src) {
         jQuery.ajax({
            url: elem.src,
            async: false,
            dataType: "script"
         });
      } else {
         jQuery.globalEval((elem.text || elem.textContent || elem.innerHTML || "").replace(rcleanScript, "/*$0*/"));
      }

      if (elem.parentNode) {
         elem.parentNode.removeChild(elem);
      }
   }




   var ralpha = /alpha\([^)]*\)/i,
      ropacity = /opacity=([^)]*)/,
      // fixed for IE9, see #8346
      rupper = /([A-Z]|^ms)/g,
      rnumpx = /^-?\d+(?:px)?$/i,
      rnum = /^-?\d/,
      rrelNum = /^([\-+])=([\-+.\de]+)/,

      cssShow = { position: "absolute", visibility: "hidden", display: "block" },
      cssWidth = ["Left", "Right"],
      cssHeight = ["Top", "Bottom"],
      curCSS,

      getComputedStyle,
      currentStyle;

   jQuery.fn.css = function (name, value) {
      // Setting 'undefined' is a no-op
      if (arguments.length === 2 && value === undefined) {
         return this;
      }

      return jQuery.access(this, name, value, true, function (elem, name, value) {
         return value !== undefined ?
            jQuery.style(elem, name, value) :
            jQuery.css(elem, name);
      });
   };

   jQuery.extend({
      // Add in style property hooks for overriding the default
      // behavior of getting and setting a style property
      cssHooks: {
         opacity: {
            get: function (elem, computed) {
               if (computed) {
                  // We should always get a number back from opacity
                  var ret = curCSS(elem, "opacity", "opacity");
                  return ret === "" ? "1" : ret;

               } else {
                  return elem.style.opacity;
               }
            }
         }
      },

      // Exclude the following css properties to add px
      cssNumber: {
         "fillOpacity": true,
         "fontWeight": true,
         "lineHeight": true,
         "opacity": true,
         "orphans": true,
         "widows": true,
         "zIndex": true,
         "zoom": true
      },

      // Add in properties whose names you wish to fix before
      // setting or getting the value
      cssProps: {
         // normalize float css property
         "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
      },

      // Get and set the style property on a DOM Node
      style: function (elem, name, value, extra) {
         // Don't set styles on text and comment nodes
         if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
            return;
         }

         // Make sure that we're working with the right name
         var ret, type, origName = jQuery.camelCase(name),
            style = elem.style, hooks = jQuery.cssHooks[origName];

         name = jQuery.cssProps[origName] || origName;

         // Check if we're setting a value
         if (value !== undefined) {
            type = typeof value;

            // convert relative number strings (+= or -=) to relative numbers. #7345
            if (type === "string" && (ret = rrelNum.exec(value))) {
               value = (+(ret[1] + 1) * +ret[2]) + parseFloat(jQuery.css(elem, name));
               // Fixes bug #9237
               type = "number";
            }

            // Make sure that NaN and null values aren't set. See: #7116
            if (value == null || type === "number" && isNaN(value)) {
               return;
            }

            // If a number was passed in, add 'px' to the (except for certain CSS properties)
            if (type === "number" && !jQuery.cssNumber[origName]) {
               value += "px";
            }

            // If a hook was provided, use that value, otherwise just set the specified value
            if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value)) !== undefined) {
               // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
               // Fixes bug #5509
               try {
                  style[name] = value;
               } catch (e) { }
            }

         } else {
            // If a hook was provided get the non-computed value from there
            if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
               return ret;
            }

            // Otherwise just get the value from the style object
            return style[name];
         }
      },

      css: function (elem, name, extra) {
         var ret, hooks;

         // Make sure that we're working with the right name
         name = jQuery.camelCase(name);
         hooks = jQuery.cssHooks[name];
         name = jQuery.cssProps[name] || name;

         // cssFloat needs a special treatment
         if (name === "cssFloat") {
            name = "float";
         }

         // If a hook was provided get the computed value from there
         if (hooks && "get" in hooks && (ret = hooks.get(elem, true, extra)) !== undefined) {
            return ret;

            // Otherwise, if a way to get the computed value exists, use that
         } else if (curCSS) {
            return curCSS(elem, name);
         }
      },

      // A method for quickly swapping in/out CSS properties to get correct calculations
      swap: function (elem, options, callback) {
         var old = {};

         // Remember the old values, and insert the new ones
         for (var name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
         }

         callback.call(elem);

         // Revert the old values
         for (name in options) {
            elem.style[name] = old[name];
         }
      }
   });

   // DEPRECATED, Use jQuery.css() instead
   jQuery.curCSS = jQuery.css;

   jQuery.each(["height", "width"], function (i, name) {
      jQuery.cssHooks[name] = {
         get: function (elem, computed, extra) {
            var val;

            if (computed) {
               if (elem.offsetWidth !== 0) {
                  return getWH(elem, name, extra);
               } else {
                  jQuery.swap(elem, cssShow, function () {
                     val = getWH(elem, name, extra);
                  });
               }

               return val;
            }
         },

         set: function (elem, value) {
            if (rnumpx.test(value)) {
               // ignore negative width and height values #1599
               value = parseFloat(value);

               if (value >= 0) {
                  return value + "px";
               }

            } else {
               return value;
            }
         }
      };
   });

   if (!jQuery.support.opacity) {
      jQuery.cssHooks.opacity = {
         get: function (elem, computed) {
            // IE uses filters for opacity
            return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ?
               (parseFloat(RegExp.$1) / 100) + "" :
               computed ? "1" : "";
         },

         set: function (elem, value) {
            var style = elem.style,
               currentStyle = elem.currentStyle,
               opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "",
               filter = currentStyle && currentStyle.filter || style.filter || "";

            // IE has trouble with opacity if it does not have layout
            // Force it by setting the zoom level
            style.zoom = 1;

            // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
            if (value >= 1 && jQuery.trim(filter.replace(ralpha, "")) === "") {

               // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
               // if "filter:" is present at all, clearType is disabled, we want to avoid this
               // style.removeAttribute is IE Only, but so apparently is this code path...
               style.removeAttribute("filter");

               // if there there is no filter style applied in a css rule, we are done
               if (currentStyle && !currentStyle.filter) {
                  return;
               }
            }

            // otherwise, set new filter values
            style.filter = ralpha.test(filter) ?
               filter.replace(ralpha, opacity) :
               filter + " " + opacity;
         }
      };
   }

   jQuery(function () {
      // This hook cannot be added until DOM ready because the support test
      // for it is not run until after DOM ready
      if (!jQuery.support.reliableMarginRight) {
         jQuery.cssHooks.marginRight = {
            get: function (elem, computed) {
               // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
               // Work around by temporarily setting element display to inline-block
               var ret;
               jQuery.swap(elem, { "display": "inline-block" }, function () {
                  if (computed) {
                     ret = curCSS(elem, "margin-right", "marginRight");
                  } else {
                     ret = elem.style.marginRight;
                  }
               });
               return ret;
            }
         };
      }
   });

   if (document.defaultView && document.defaultView.getComputedStyle) {
      getComputedStyle = function (elem, name) {
         var ret, defaultView, computedStyle;

         name = name.replace(rupper, "-$1").toLowerCase();

         if ((defaultView = elem.ownerDocument.defaultView) &&
            (computedStyle = defaultView.getComputedStyle(elem, null))) {
            ret = computedStyle.getPropertyValue(name);
            if (ret === "" && !jQuery.contains(elem.ownerDocument.documentElement, elem)) {
               ret = jQuery.style(elem, name);
            }
         }

         return ret;
      };
   }

   if (document.documentElement.currentStyle) {
      currentStyle = function (elem, name) {
         var left, rsLeft, uncomputed,
            ret = elem.currentStyle && elem.currentStyle[name],
            style = elem.style;

         // Avoid setting ret to empty string here
         // so we don't default to auto
         if (ret === null && style && (uncomputed = style[name])) {
            ret = uncomputed;
         }

         // From the awesome hack by Dean Edwards
         // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

         // If we're not dealing with a regular pixel number
         // but a number that has a weird ending, we need to convert it to pixels
         if (!rnumpx.test(ret) && rnum.test(ret)) {

            // Remember the original values
            left = style.left;
            rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

            // Put in the new values to get a computed value out
            if (rsLeft) {
               elem.runtimeStyle.left = elem.currentStyle.left;
            }
            style.left = name === "fontSize" ? "1em" : (ret || 0);
            ret = style.pixelLeft + "px";

            // Revert the changed values
            style.left = left;
            if (rsLeft) {
               elem.runtimeStyle.left = rsLeft;
            }
         }

         return ret === "" ? "auto" : ret;
      };
   }

   curCSS = getComputedStyle || currentStyle;

   function getWH(elem, name, extra) {

      // Start with offset property
      var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
         which = name === "width" ? cssWidth : cssHeight,
         i = 0,
         len = which.length;

      if (val > 0) {
         if (extra !== "border") {
            for (; i < len; i++) {
               if (!extra) {
                  val -= parseFloat(jQuery.css(elem, "padding" + which[i])) || 0;
               }
               if (extra === "margin") {
                  val += parseFloat(jQuery.css(elem, extra + which[i])) || 0;
               } else {
                  val -= parseFloat(jQuery.css(elem, "border" + which[i] + "Width")) || 0;
               }
            }
         }

         return val + "px";
      }

      // Fall back to computed then uncomputed css if necessary
      val = curCSS(elem, name, name);
      if (val < 0 || val == null) {
         val = elem.style[name] || 0;
      }
      // Normalize "", auto, and prepare for extra
      val = parseFloat(val) || 0;

      // Add padding, border, margin
      if (extra) {
         for (; i < len; i++) {
            val += parseFloat(jQuery.css(elem, "padding" + which[i])) || 0;
            if (extra !== "padding") {
               val += parseFloat(jQuery.css(elem, "border" + which[i] + "Width")) || 0;
            }
            if (extra === "margin") {
               val += parseFloat(jQuery.css(elem, extra + which[i])) || 0;
            }
         }
      }

      return val + "px";
   }

   if (jQuery.expr && jQuery.expr.filters) {
      jQuery.expr.filters.hidden = function (elem) {
         var width = elem.offsetWidth,
            height = elem.offsetHeight;

         return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css(elem, "display")) === "none");
      };

      jQuery.expr.filters.visible = function (elem) {
         return !jQuery.expr.filters.hidden(elem);
      };
   }




   var r20 = /%20/g,
      rbracket = /\[\]$/,
      rCRLF = /\r?\n/g,
      rhash = /#.*$/,
      rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
      rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
      // #7653, #8125, #8152: local protocol detection
      rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
      rnoContent = /^(?:GET|HEAD)$/,
      rprotocol = /^\/\//,
      rquery = /\?/,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      rselectTextarea = /^(?:select|textarea)/i,
      rspacesAjax = /\s+/,
      rts = /([?&])_=[^&]*/,
      rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

      // Keep a copy of the old load method
      _load = jQuery.fn.load,

      /* Prefilters
       * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
       * 2) These are called:
       *    - BEFORE asking for a transport
       *    - AFTER param serialization (s.data is a string if s.processData is true)
       * 3) key is the dataType
       * 4) the catchall symbol "*" can be used
       * 5) execution will start with transport dataType and THEN continue down to "*" if needed
       */
      prefilters = {},

      /* Transports bindings
       * 1) key is the dataType
       * 2) the catchall symbol "*" can be used
       * 3) selection will start with transport dataType and THEN go to "*" if needed
       */
      transports = {},

      // Document location
      ajaxLocation,

      // Document location segments
      ajaxLocParts,

      // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
      allTypes = ["*/"] + ["*"];

   // #8138, IE may throw an exception when accessing
   // a field from window.location if document.domain has been set
   try {
      ajaxLocation = location.href;
   } catch (e) {
      // Use the href attribute of an A element
      // since IE will modify it given document.location
      ajaxLocation = document.createElement("a");
      ajaxLocation.href = "";
      ajaxLocation = ajaxLocation.href;
   }

   // Segment location into parts
   ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

   // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
   function addToPrefiltersOrTransports(structure) {

      // dataTypeExpression is optional and defaults to "*"
      return function (dataTypeExpression, func) {

         if (typeof dataTypeExpression !== "string") {
            func = dataTypeExpression;
            dataTypeExpression = "*";
         }

         if (jQuery.isFunction(func)) {
            var dataTypes = dataTypeExpression.toLowerCase().split(rspacesAjax),
               i = 0,
               length = dataTypes.length,
               dataType,
               list,
               placeBefore;

            // For each dataType in the dataTypeExpression
            for (; i < length; i++) {
               dataType = dataTypes[i];
               // We control if we're asked to add before
               // any existing element
               placeBefore = /^\+/.test(dataType);
               if (placeBefore) {
                  dataType = dataType.substr(1) || "*";
               }
               list = structure[dataType] = structure[dataType] || [];
               // then we add to the structure accordingly
               list[placeBefore ? "unshift" : "push"](func);
            }
         }
      };
   }

   // Base inspection function for prefilters and transports
   function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR,
      dataType /* internal */, inspected /* internal */) {

      dataType = dataType || options.dataTypes[0];
      inspected = inspected || {};

      inspected[dataType] = true;

      var list = structure[dataType],
         i = 0,
         length = list ? list.length : 0,
         executeOnly = (structure === prefilters),
         selection;

      for (; i < length && (executeOnly || !selection); i++) {
         selection = list[i](options, originalOptions, jqXHR);
         // If we got redirected to another dataType
         // we try there if executing only and not done already
         if (typeof selection === "string") {
            if (!executeOnly || inspected[selection]) {
               selection = undefined;
            } else {
               options.dataTypes.unshift(selection);
               selection = inspectPrefiltersOrTransports(
                  structure, options, originalOptions, jqXHR, selection, inspected);
            }
         }
      }
      // If we're only executing or nothing was selected
      // we try the catchall dataType if not done already
      if ((executeOnly || !selection) && !inspected["*"]) {
         selection = inspectPrefiltersOrTransports(
            structure, options, originalOptions, jqXHR, "*", inspected);
      }
      // unnecessary when only executing (prefilters)
      // but it'll be ignored by the caller in that case
      return selection;
   }

   // A special extend for ajax options
   // that takes "flat" options (not to be deep extended)
   // Fixes #9887
   function ajaxExtend(target, src) {
      var key, deep,
         flatOptions = jQuery.ajaxSettings.flatOptions || {};
      for (key in src) {
         if (src[key] !== undefined) {
            (flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
         }
      }
      if (deep) {
         jQuery.extend(true, target, deep);
      }
   }

   jQuery.fn.extend({
      load: function (url, params, callback) {
         if (typeof url !== "string" && _load) {
            return _load.apply(this, arguments);

            // Don't do a request if no elements are being requested
         } else if (!this.length) {
            return this;
         }

         var off = url.indexOf(" ");
         if (off >= 0) {
            var selector = url.slice(off, url.length);
            url = url.slice(0, off);
         }

         // Default to a GET request
         var type = "GET";

         // If the second parameter was provided
         if (params) {
            // If it's a function
            if (jQuery.isFunction(params)) {
               // We assume that it's the callback
               callback = params;
               params = undefined;

               // Otherwise, build a param string
            } else if (typeof params === "object") {
               params = jQuery.param(params, jQuery.ajaxSettings.traditional);
               type = "POST";
            }
         }

         var self = this;

         // Request the remote document
         jQuery.ajax({
            url: url,
            type: type,
            dataType: "html",
            data: params,
            // Complete callback (responseText is used internally)
            complete: function (jqXHR, status, responseText) {
               // Store the response as specified by the jqXHR object
               responseText = jqXHR.responseText;
               // If successful, inject the HTML into all the matched elements
               if (jqXHR.isResolved()) {
                  // #4825: Get the actual response in case
                  // a dataFilter is present in ajaxSettings
                  jqXHR.done(function (r) {
                     responseText = r;
                  });
                  // See if a selector was specified
                  self.html(selector ?
                     // Create a dummy div to hold the results
                     jQuery("<div>")
                        // inject the contents of the document in, removing the scripts
                        // to avoid any 'Permission Denied' errors in IE
                        .append(responseText.replace(rscript, ""))

                        // Locate the specified elements
                        .find(selector) :

                     // If not, just inject the full result
                     responseText);
               }

               if (callback) {
                  self.each(callback, [responseText, status, jqXHR]);
               }
            }
         });

         return this;
      },

      serialize: function () {
         return jQuery.param(this.serializeArray());
      },

      serializeArray: function () {
         return this.map(function () {
            return this.elements ? jQuery.makeArray(this.elements) : this;
         })
            .filter(function () {
               return this.name && !this.disabled &&
                  (this.checked || rselectTextarea.test(this.nodeName) ||
                     rinput.test(this.type));
            })
            .map(function (i, elem) {
               var val = jQuery(this).val();

               return val == null ?
                  null :
                  jQuery.isArray(val) ?
                     jQuery.map(val, function (val, i) {
                        return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
                     }) :
                     { name: elem.name, value: val.replace(rCRLF, "\r\n") };
            }).get();
      }
   });

   // Attach a bunch of functions for handling common AJAX events
   jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (i, o) {
      jQuery.fn[o] = function (f) {
         return this.on(o, f);
      };
   });

   jQuery.each(["get", "post"], function (i, method) {
      jQuery[method] = function (url, data, callback, type) {
         // shift arguments if data argument was omitted
         if (jQuery.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = undefined;
         }

         return jQuery.ajax({
            type: method,
            url: url,
            data: data,
            success: callback,
            dataType: type
         });
      };
   });

   jQuery.extend({

      getScript: function (url, callback) {
         return jQuery.get(url, undefined, callback, "script");
      },

      getJSON: function (url, data, callback) {
         return jQuery.get(url, data, callback, "json");
      },

      // Creates a full fledged settings object into target
      // with both ajaxSettings and settings fields.
      // If target is omitted, writes into ajaxSettings.
      ajaxSetup: function (target, settings) {
         if (settings) {
            // Building a settings object
            ajaxExtend(target, jQuery.ajaxSettings);
         } else {
            // Extending ajaxSettings
            settings = target;
            target = jQuery.ajaxSettings;
         }
         ajaxExtend(target, settings);
         return target;
      },

      ajaxSettings: {
         url: ajaxLocation,
         isLocal: rlocalProtocol.test(ajaxLocParts[1]),
         global: true,
         type: "GET",
         contentType: "application/x-www-form-urlencoded",
         processData: true,
         async: true,
         /*
         timeout: 0,
         data: null,
         dataType: null,
         username: null,
         password: null,
         cache: null,
         traditional: false,
         headers: {},
         */

         accepts: {
            xml: "application/xml, text/xml",
            html: "text/html",
            text: "text/plain",
            json: "application/json, text/javascript",
            "*": allTypes
         },

         contents: {
            xml: /xml/,
            html: /html/,
            json: /json/
         },

         responseFields: {
            xml: "responseXML",
            text: "responseText"
         },

         // List of data converters
         // 1) key format is "source_type destination_type" (a single space in-between)
         // 2) the catchall symbol "*" can be used for source_type
         converters: {

            // Convert anything to text
            "* text": window.String,

            // Text to html (true = no transformation)
            "text html": true,

            // Evaluate text as a json expression
            "text json": jQuery.parseJSON,

            // Parse text as xml
            "text xml": jQuery.parseXML
         },

         // For options that shouldn't be deep extended:
         // you can add your own custom options here if
         // and when you create one that shouldn't be
         // deep extended (see ajaxExtend)
         flatOptions: {
            context: true,
            url: true
         }
      },

      ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
      ajaxTransport: addToPrefiltersOrTransports(transports),

      // Main method
      ajax: function (url, options) {

         // If url is an object, simulate pre-1.5 signature
         if (typeof url === "object") {
            options = url;
            url = undefined;
         }

         // Force options to be an object
         options = options || {};

         var // Create the final options object
            s = jQuery.ajaxSetup({}, options),
            // Callbacks context
            callbackContext = s.context || s,
            // Context for global events
            // It's the callbackContext if one was provided in the options
            // and if it's a DOM node or a jQuery collection
            globalEventContext = callbackContext !== s &&
               (callbackContext.nodeType || callbackContext instanceof jQuery) ?
               jQuery(callbackContext) : jQuery.event,
            // Deferreds
            deferred = jQuery.Deferred(),
            completeDeferred = jQuery.Callbacks("once memory"),
            // Status-dependent callbacks
            statusCode = s.statusCode || {},
            // ifModified key
            ifModifiedKey,
            // Headers (they are sent all at once)
            requestHeaders = {},
            requestHeadersNames = {},
            // Response headers
            responseHeadersString,
            responseHeaders,
            // transport
            transport,
            // timeout handle
            timeoutTimer,
            // Cross-domain detection vars
            parts,
            // The jqXHR state
            state = 0,
            // To know if global events are to be dispatched
            fireGlobals,
            // Loop variable
            i,
            // Fake xhr
            jqXHR = {

               readyState: 0,

               // Caches the header
               setRequestHeader: function (name, value) {
                  if (!state) {
                     var lname = name.toLowerCase();
                     name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
                     requestHeaders[name] = value;
                  }
                  return this;
               },

               // Raw string
               getAllResponseHeaders: function () {
                  return state === 2 ? responseHeadersString : null;
               },

               // Builds headers hashtable if needed
               getResponseHeader: function (key) {
                  var match;
                  if (state === 2) {
                     if (!responseHeaders) {
                        responseHeaders = {};
                        while ((match = rheaders.exec(responseHeadersString))) {
                           responseHeaders[match[1].toLowerCase()] = match[2];
                        }
                     }
                     match = responseHeaders[key.toLowerCase()];
                  }
                  return match === undefined ? null : match;
               },

               // Overrides response content-type header
               overrideMimeType: function (type) {
                  if (!state) {
                     s.mimeType = type;
                  }
                  return this;
               },

               // Cancel the request
               abort: function (statusText) {
                  statusText = statusText || "abort";
                  if (transport) {
                     transport.abort(statusText);
                  }
                  done(0, statusText);
                  return this;
               }
            };

         // Callback for when everything is done
         // It is defined here because jslint complains if it is declared
         // at the end of the function (which would be more logical and readable)
         function done(status, nativeStatusText, responses, headers) {

            // Called once
            if (state === 2) {
               return;
            }

            // State is "done" now
            state = 2;

            // Clear timeout if it exists
            if (timeoutTimer) {
               clearTimeout(timeoutTimer);
            }

            // Dereference transport for early garbage collection
            // (no matter how long the jqXHR object will be used)
            transport = undefined;

            // Cache response headers
            responseHeadersString = headers || "";

            // Set readyState
            jqXHR.readyState = status > 0 ? 4 : 0;

            var isSuccess,
               success,
               error,
               statusText = nativeStatusText,
               response = responses ? ajaxHandleResponses(s, jqXHR, responses) : undefined,
               lastModified,
               etag;

            // If successful, handle type chaining
            if (status >= 200 && status < 300 || status === 304) {

               // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
               if (s.ifModified) {

                  if ((lastModified = jqXHR.getResponseHeader("Last-Modified"))) {
                     jQuery.lastModified[ifModifiedKey] = lastModified;
                  }
                  if ((etag = jqXHR.getResponseHeader("Etag"))) {
                     jQuery.etag[ifModifiedKey] = etag;
                  }
               }

               // If not modified
               if (status === 304) {

                  statusText = "notmodified";
                  isSuccess = true;

                  // If we have data
               } else {

                  try {
                     success = ajaxConvert(s, response);
                     statusText = "success";
                     isSuccess = true;
                  } catch (e) {
                     // We have a parsererror
                     statusText = "parsererror";
                     error = e;
                  }
               }
            } else {
               // We extract error from statusText
               // then normalize statusText and status for non-aborts
               error = statusText;
               if (!statusText || status) {
                  statusText = "error";
                  if (status < 0) {
                     status = 0;
                  }
               }
            }

            // Set data for the fake xhr object
            jqXHR.status = status;
            jqXHR.statusText = "" + (nativeStatusText || statusText);

            // Success/Error
            if (isSuccess) {
               deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
            } else {
               deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
            }

            // Status-dependent callbacks
            jqXHR.statusCode(statusCode);
            statusCode = undefined;

            if (fireGlobals) {
               globalEventContext.trigger("ajax" + (isSuccess ? "Success" : "Error"),
                  [jqXHR, s, isSuccess ? success : error]);
            }

            // Complete
            completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

            if (fireGlobals) {
               globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
               // Handle the global AJAX counter
               if (!(--jQuery.active)) {
                  jQuery.event.trigger("ajaxStop");
               }
            }
         }

         // Attach deferreds
         deferred.promise(jqXHR);
         jqXHR.success = jqXHR.done;
         jqXHR.error = jqXHR.fail;
         jqXHR.complete = completeDeferred.add;

         // Status-dependent callbacks
         jqXHR.statusCode = function (map) {
            if (map) {
               var tmp;
               if (state < 2) {
                  for (tmp in map) {
                     statusCode[tmp] = [statusCode[tmp], map[tmp]];
                  }
               } else {
                  tmp = map[jqXHR.status];
                  jqXHR.then(tmp, tmp);
               }
            }
            return this;
         };

         // Remove hash character (#7531: and string promotion)
         // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
         // We also use the url parameter if available
         s.url = ((url || s.url) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");

         // Extract dataTypes list
         s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().split(rspacesAjax);

         // Determine if a cross-domain request is in order
         if (s.crossDomain == null) {
            parts = rurl.exec(s.url.toLowerCase());
            s.crossDomain = !!(parts &&
               (parts[1] != ajaxLocParts[1] || parts[2] != ajaxLocParts[2] ||
                  (parts[3] || (parts[1] === "http:" ? 80 : 443)) !=
                  (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443)))
            );
         }

         // Convert data if not already a string
         if (s.data && s.processData && typeof s.data !== "string") {
            s.data = jQuery.param(s.data, s.traditional);
         }

         // Apply prefilters
         inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

         // If request was aborted inside a prefiler, stop there
         if (state === 2) {
            return false;
         }

         // We can fire global events as of now if asked to
         fireGlobals = s.global;

         // Uppercase the type
         s.type = s.type.toUpperCase();

         // Determine if request has content
         s.hasContent = !rnoContent.test(s.type);

         // Watch for a new set of requests
         if (fireGlobals && jQuery.active++ === 0) {
            jQuery.event.trigger("ajaxStart");
         }

         // More options handling for requests with no content
         if (!s.hasContent) {

            // If data is available, append data to url
            if (s.data) {
               s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
               // #9682: remove data so that it's not used in an eventual retry
               delete s.data;
            }

            // Get ifModifiedKey before adding the anti-cache parameter
            ifModifiedKey = s.url;

            // Add anti-cache in url if needed
            if (s.cache === false) {

               var ts = jQuery.now(),
                  // try replacing _= if it is there
                  ret = s.url.replace(rts, "$1_=" + ts);

               // if nothing was replaced, add timestamp to the end
               s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
            }
         }

         // Set the correct header, if data is being sent
         if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
            jqXHR.setRequestHeader("Content-Type", s.contentType);
         }

         // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
         if (s.ifModified) {
            ifModifiedKey = ifModifiedKey || s.url;
            if (jQuery.lastModified[ifModifiedKey]) {
               jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[ifModifiedKey]);
            }
            if (jQuery.etag[ifModifiedKey]) {
               jqXHR.setRequestHeader("If-None-Match", jQuery.etag[ifModifiedKey]);
            }
         }

         // Set the Accepts header for the server, depending on the dataType
         jqXHR.setRequestHeader(
            "Accept",
            s.dataTypes[0] && s.accepts[s.dataTypes[0]] ?
               s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") :
               s.accepts["*"]
         );

         // Check for headers option
         for (i in s.headers) {
            jqXHR.setRequestHeader(i, s.headers[i]);
         }

         // Allow custom headers/mimetypes and early abort
         if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
            // Abort if not done already
            jqXHR.abort();
            return false;

         }

         // Install callbacks on deferreds
         for (i in { success: 1, error: 1, complete: 1 }) {
            jqXHR[i](s[i]);
         }

         // Get transport
         transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

         // If no transport, we auto-abort
         if (!transport) {
            done(-1, "No Transport");
         } else {
            jqXHR.readyState = 1;
            // Send global event
            if (fireGlobals) {
               globalEventContext.trigger("ajaxSend", [jqXHR, s]);
            }
            // Timeout
            if (s.async && s.timeout > 0) {
               timeoutTimer = setTimeout(function () {
                  jqXHR.abort("timeout");
               }, s.timeout);
            }

            try {
               state = 1;
               transport.send(requestHeaders, done);
            } catch (e) {
               // Propagate exception as error if not done
               if (state < 2) {
                  done(-1, e);
                  // Simply rethrow otherwise
               } else {
                  throw e;
               }
            }
         }

         return jqXHR;
      },

      // Serialize an array of form elements or a set of
      // key/values into a query string
      param: function (a, traditional) {
         var s = [],
            add = function (key, value) {
               // If value is a function, invoke it and return its value
               value = jQuery.isFunction(value) ? value() : value;
               s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            };

         // Set traditional to true for jQuery <= 1.3.2 behavior.
         if (traditional === undefined) {
            traditional = jQuery.ajaxSettings.traditional;
         }

         // If an array was passed in, assume that it is an array of form elements.
         if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
            // Serialize the form elements
            jQuery.each(a, function () {
               add(this.name, this.value);
            });

         } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for (var prefix in a) {
               buildParams(prefix, a[prefix], traditional, add);
            }
         }

         // Return the resulting serialization
         return s.join("&").replace(r20, "+");
      }
   });

   function buildParams(prefix, obj, traditional, add) {
      if (jQuery.isArray(obj)) {
         // Serialize array item.
         jQuery.each(obj, function (i, v) {
            if (traditional || rbracket.test(prefix)) {
               // Treat each array item as a scalar.
               add(prefix, v);

            } else {
               // If array item is non-scalar (array or object), encode its
               // numeric index to resolve deserialization ambiguity issues.
               // Note that rack (as of 1.0.0) can't currently deserialize
               // nested arrays properly, and attempting to do so may cause
               // a server error. Possible fixes are to modify rack's
               // deserialization algorithm or to provide an option or flag
               // to force array serialization to be shallow.
               buildParams(prefix + "[" + (typeof v === "object" || jQuery.isArray(v) ? i : "") + "]", v, traditional, add);
            }
         });

      } else if (!traditional && obj != null && typeof obj === "object") {
         // Serialize object item.
         for (var name in obj) {
            buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
         }

      } else {
         // Serialize scalar item.
         add(prefix, obj);
      }
   }

   // This is still on the jQuery object... for now
   // Want to move this to jQuery.ajax some day
   jQuery.extend({

      // Counter for holding the number of active queries
      active: 0,

      // Last-Modified header cache for next request
      lastModified: {},
      etag: {}

   });

   /* Handles responses to an ajax request:
    * - sets all responseXXX fields accordingly
    * - finds the right dataType (mediates between content-type and expected dataType)
    * - returns the corresponding response
    */
   function ajaxHandleResponses(s, jqXHR, responses) {

      var contents = s.contents,
         dataTypes = s.dataTypes,
         responseFields = s.responseFields,
         ct,
         type,
         finalDataType,
         firstDataType;

      // Fill responseXXX fields
      for (type in responseFields) {
         if (type in responses) {
            jqXHR[responseFields[type]] = responses[type];
         }
      }

      // Remove auto dataType and get content-type in the process
      while (dataTypes[0] === "*") {
         dataTypes.shift();
         if (ct === undefined) {
            ct = s.mimeType || jqXHR.getResponseHeader("content-type");
         }
      }

      // Check if we're dealing with a known content-type
      if (ct) {
         for (type in contents) {
            if (contents[type] && contents[type].test(ct)) {
               dataTypes.unshift(type);
               break;
            }
         }
      }

      // Check to see if we have a response for the expected dataType
      if (dataTypes[0] in responses) {
         finalDataType = dataTypes[0];
      } else {
         // Try convertible dataTypes
         for (type in responses) {
            if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
               finalDataType = type;
               break;
            }
            if (!firstDataType) {
               firstDataType = type;
            }
         }
         // Or just use first one
         finalDataType = finalDataType || firstDataType;
      }

      // If we found a dataType
      // We add the dataType to the list if needed
      // and return the corresponding response
      if (finalDataType) {
         if (finalDataType !== dataTypes[0]) {
            dataTypes.unshift(finalDataType);
         }
         return responses[finalDataType];
      }
   }

   // Chain conversions given the request and the original response
   function ajaxConvert(s, response) {

      // Apply the dataFilter if provided
      if (s.dataFilter) {
         response = s.dataFilter(response, s.dataType);
      }

      var dataTypes = s.dataTypes,
         converters = {},
         i,
         key,
         length = dataTypes.length,
         tmp,
         // Current and previous dataTypes
         current = dataTypes[0],
         prev,
         // Conversion expression
         conversion,
         // Conversion function
         conv,
         // Conversion functions (transitive conversion)
         conv1,
         conv2;

      // For each dataType in the chain
      for (i = 1; i < length; i++) {

         // Create converters map
         // with lowercased keys
         if (i === 1) {
            for (key in s.converters) {
               if (typeof key === "string") {
                  converters[key.toLowerCase()] = s.converters[key];
               }
            }
         }

         // Get the dataTypes
         prev = current;
         current = dataTypes[i];

         // If current is auto dataType, update it to prev
         if (current === "*") {
            current = prev;
            // If no auto and dataTypes are actually different
         } else if (prev !== "*" && prev !== current) {

            // Get the converter
            conversion = prev + " " + current;
            conv = converters[conversion] || converters["* " + current];

            // If there is no direct converter, search transitively
            if (!conv) {
               conv2 = undefined;
               for (conv1 in converters) {
                  tmp = conv1.split(" ");
                  if (tmp[0] === prev || tmp[0] === "*") {
                     conv2 = converters[tmp[1] + " " + current];
                     if (conv2) {
                        conv1 = converters[conv1];
                        if (conv1 === true) {
                           conv = conv2;
                        } else if (conv2 === true) {
                           conv = conv1;
                        }
                        break;
                     }
                  }
               }
            }
            // If we found no converter, dispatch an error
            if (!(conv || conv2)) {
               jQuery.error("No conversion from " + conversion.replace(" ", " to "));
            }
            // If found converter is not an equivalence
            if (conv !== true) {
               // Convert with 1 or 2 converters accordingly
               response = conv ? conv(response) : conv2(conv1(response));
            }
         }
      }
      return response;
   }




   var jsc = jQuery.now(),
      jsre = /(\=)\?(&|$)|\?\?/i;

   // Default jsonp settings
   jQuery.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function () {
         return jQuery.expando + "_" + (jsc++);
      }
   });

   // Detect, normalize options and install callbacks for jsonp requests
   jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

      var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
         (typeof s.data === "string");

      if (s.dataTypes[0] === "jsonp" ||
         s.jsonp !== false && (jsre.test(s.url) ||
            inspectData && jsre.test(s.data))) {

         var responseContainer,
            jsonpCallback = s.jsonpCallback =
               jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback,
            previous = window[jsonpCallback],
            url = s.url,
            data = s.data,
            replace = "$1" + jsonpCallback + "$2";

         if (s.jsonp !== false) {
            url = url.replace(jsre, replace);
            if (s.url === url) {
               if (inspectData) {
                  data = data.replace(jsre, replace);
               }
               if (s.data === data) {
                  // Add callback manually
                  url += (/\?/.test(url) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
               }
            }
         }

         s.url = url;
         s.data = data;

         // Install callback
         window[jsonpCallback] = function (response) {
            responseContainer = [response];
         };

         // Clean-up function
         jqXHR.always(function () {
            // Set callback back to previous value
            window[jsonpCallback] = previous;
            // Call if it was a function and we have a response
            if (responseContainer && jQuery.isFunction(previous)) {
               window[jsonpCallback](responseContainer[0]);
            }
         });

         // Use data converter to retrieve json after script execution
         s.converters["script json"] = function () {
            if (!responseContainer) {
               jQuery.error(jsonpCallback + " was not called");
            }
            return responseContainer[0];
         };

         // force json dataType
         s.dataTypes[0] = "json";

         // Delegate to script
         return "script";
      }
   });




   // Install script dataType
   jQuery.ajaxSetup({
      accepts: {
         script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
      },
      contents: {
         script: /javascript|ecmascript/
      },
      converters: {
         "text script": function (text) {
            jQuery.globalEval(text);
            return text;
         }
      }
   });

   // Handle cache's special case and global
   jQuery.ajaxPrefilter("script", function (s) {
      if (s.cache === undefined) {
         s.cache = false;
      }
      if (s.crossDomain) {
         s.type = "GET";
         s.global = false;
      }
   });

   // Bind script tag hack transport
   jQuery.ajaxTransport("script", function (s) {

      // This transport only deals with cross domain requests
      if (s.crossDomain) {

         var script,
            head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

         return {

            send: function (_, callback) {

               script = document.createElement("script");

               script.async = "async";

               if (s.scriptCharset) {
                  script.charset = s.scriptCharset;
               }

               script.src = s.url;

               // Attach handlers for all browsers
               script.onload = script.onreadystatechange = function (_, isAbort) {

                  if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {

                     // Handle memory leak in IE
                     script.onload = script.onreadystatechange = null;

                     // Remove the script
                     if (head && script.parentNode) {
                        head.removeChild(script);
                     }

                     // Dereference the script
                     script = undefined;

                     // Callback if not abort
                     if (!isAbort) {
                        callback(200, "success");
                     }
                  }
               };
               // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
               // This arises when a base node is used (#2709 and #4378).
               head.insertBefore(script, head.firstChild);
            },

            abort: function () {
               if (script) {
                  script.onload(0, 1);
               }
            }
         };
      }
   });




   var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
      xhrOnUnloadAbort = window.ActiveXObject ? function () {
         // Abort all pending requests
         for (var key in xhrCallbacks) {
            xhrCallbacks[key](0, 1);
         }
      } : false,
      xhrId = 0,
      xhrCallbacks;

   // Functions to create xhrs
   function createStandardXHR() {
      try {
         return new window.XMLHttpRequest();
      } catch (e) { }
   }

   function createActiveXHR() {
      try {
         return new window.ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) { }
   }

   // Create the request object
   // (This is still attached to ajaxSettings for backward compatibility)
   jQuery.ajaxSettings.xhr = window.ActiveXObject ?
      /* Microsoft failed to properly
       * implement the XMLHttpRequest in IE7 (can't request local files),
       * so we use the ActiveXObject when it is available
       * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
       * we need a fallback.
       */
      function () {
         return !this.isLocal && createStandardXHR() || createActiveXHR();
      } :
      // For all other browsers, use the standard XMLHttpRequest object
      createStandardXHR;

   // Determine support properties
   (function (xhr) {
      jQuery.extend(jQuery.support, {
         ajax: !!xhr,
         cors: !!xhr && ("withCredentials" in xhr)
      });
   })(jQuery.ajaxSettings.xhr());

   // Create transport if the browser can provide an xhr
   if (jQuery.support.ajax) {

      jQuery.ajaxTransport(function (s) {
         // Cross domain only allowed if supported through XMLHttpRequest
         if (!s.crossDomain || jQuery.support.cors) {

            var callback;

            return {
               send: function (headers, complete) {

                  // Get a new xhr
                  var xhr = s.xhr(),
                     handle,
                     i;

                  // Open the socket
                  // Passing null username, generates a login popup on Opera (#2865)
                  if (s.username) {
                     xhr.open(s.type, s.url, s.async, s.username, s.password);
                  } else {
                     xhr.open(s.type, s.url, s.async);
                  }

                  // Apply custom fields if provided
                  if (s.xhrFields) {
                     for (i in s.xhrFields) {
                        xhr[i] = s.xhrFields[i];
                     }
                  }

                  // Override mime type if needed
                  if (s.mimeType && xhr.overrideMimeType) {
                     xhr.overrideMimeType(s.mimeType);
                  }

                  // X-Requested-With header
                  // For cross-domain requests, seeing as conditions for a preflight are
                  // akin to a jigsaw puzzle, we simply never set it to be sure.
                  // (it can always be set on a per-request basis or even using ajaxSetup)
                  // For same-domain requests, won't change header if already provided.
                  if (!s.crossDomain && !headers["X-Requested-With"]) {
                     headers["X-Requested-With"] = "XMLHttpRequest";
                  }

                  // Need an extra try/catch for cross domain requests in Firefox 3
                  try {
                     for (i in headers) {
                        xhr.setRequestHeader(i, headers[i]);
                     }
                  } catch (_) { }

                  // Do send the request
                  // This may raise an exception which is actually
                  // handled in jQuery.ajax (so no try/catch here)
                  xhr.send((s.hasContent && s.data) || null);

                  // Listener
                  callback = function (_, isAbort) {

                     var status,
                        statusText,
                        responseHeaders,
                        responses,
                        xml;

                     // Firefox throws exceptions when accessing properties
                     // of an xhr when a network error occured
                     // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
                     try {

                        // Was never called and is aborted or complete
                        if (callback && (isAbort || xhr.readyState === 4)) {

                           // Only called once
                           callback = undefined;

                           // Do not keep as active anymore
                           if (handle) {
                              xhr.onreadystatechange = jQuery.noop;
                              if (xhrOnUnloadAbort) {
                                 delete xhrCallbacks[handle];
                              }
                           }

                           // If it's an abort
                           if (isAbort) {
                              // Abort it manually if needed
                              if (xhr.readyState !== 4) {
                                 xhr.abort();
                              }
                           } else {
                              status = xhr.status;
                              responseHeaders = xhr.getAllResponseHeaders();
                              responses = {};
                              xml = xhr.responseXML;

                              // Construct response list
                              if (xml && xml.documentElement /* #4958 */) {
                                 responses.xml = xml;
                              }
                              responses.text = xhr.responseText;

                              // Firefox throws an exception when accessing
                              // statusText for faulty cross-domain requests
                              try {
                                 statusText = xhr.statusText;
                              } catch (e) {
                                 // We normalize with Webkit giving an empty statusText
                                 statusText = "";
                              }

                              // Filter status for non standard behaviors

                              // If the request is local and we have data: assume a success
                              // (success with no data won't get notified, that's the best we
                              // can do given current implementations)
                              if (!status && s.isLocal && !s.crossDomain) {
                                 status = responses.text ? 200 : 404;
                                 // IE - #1450: sometimes returns 1223 when it should be 204
                              } else if (status === 1223) {
                                 status = 204;
                              }
                           }
                        }
                     } catch (firefoxAccessException) {
                        if (!isAbort) {
                           complete(-1, firefoxAccessException);
                        }
                     }

                     // Call complete if needed
                     if (responses) {
                        complete(status, statusText, responses, responseHeaders);
                     }
                  };

                  // if we're in sync mode or it's in cache
                  // and has been retrieved directly (IE6 & IE7)
                  // we need to manually fire the callback
                  if (!s.async || xhr.readyState === 4) {
                     callback();
                  } else {
                     handle = ++xhrId;
                     if (xhrOnUnloadAbort) {
                        // Create the active xhrs callbacks list if needed
                        // and attach the unload handler
                        if (!xhrCallbacks) {
                           xhrCallbacks = {};
                           jQuery(window).unload(xhrOnUnloadAbort);
                        }
                        // Add to list of active xhrs callbacks
                        xhrCallbacks[handle] = callback;
                     }
                     xhr.onreadystatechange = callback;
                  }
               },

               abort: function () {
                  if (callback) {
                     callback(0, 1);
                  }
               }
            };
         }
      });
   }




   var elemdisplay = {},
      iframe, iframeDoc,
      rfxtypes = /^(?:toggle|show|hide)$/,
      rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
      timerId,
      fxAttrs = [
         // height animations
         ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
         // width animations
         ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
         // opacity animations
         ["opacity"]
      ],
      fxNow;

   jQuery.fn.extend({
      show: function (speed, easing, callback) {
         var elem, display;

         if (speed || speed === 0) {
            return this.animate(genFx("show", 3), speed, easing, callback);

         } else {
            for (var i = 0, j = this.length; i < j; i++) {
               elem = this[i];

               if (elem.style) {
                  display = elem.style.display;

                  // Reset the inline display of this element to learn if it is
                  // being hidden by cascaded rules or not
                  if (!jQuery._data(elem, "olddisplay") && display === "none") {
                     display = elem.style.display = "";
                  }

                  // Set elements which have been overridden with display: none
                  // in a stylesheet to whatever the default browser style is
                  // for such an element
                  if (display === "" && jQuery.css(elem, "display") === "none") {
                     jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
                  }
               }
            }

            // Set the display of most of the elements in a second loop
            // to avoid the constant reflow
            for (i = 0; i < j; i++) {
               elem = this[i];

               if (elem.style) {
                  display = elem.style.display;

                  if (display === "" || display === "none") {
                     elem.style.display = jQuery._data(elem, "olddisplay") || "";
                  }
               }
            }

            return this;
         }
      },

      hide: function (speed, easing, callback) {
         if (speed || speed === 0) {
            return this.animate(genFx("hide", 3), speed, easing, callback);

         } else {
            var elem, display,
               i = 0,
               j = this.length;

            for (; i < j; i++) {
               elem = this[i];
               if (elem.style) {
                  display = jQuery.css(elem, "display");

                  if (display !== "none" && !jQuery._data(elem, "olddisplay")) {
                     jQuery._data(elem, "olddisplay", display);
                  }
               }
            }

            // Set the display of the elements in a second loop
            // to avoid the constant reflow
            for (i = 0; i < j; i++) {
               if (this[i].style) {
                  this[i].style.display = "none";
               }
            }

            return this;
         }
      },

      // Save the old toggle function
      _toggle: jQuery.fn.toggle,

      toggle: function (fn, fn2, callback) {
         var bool = typeof fn === "boolean";

         if (jQuery.isFunction(fn) && jQuery.isFunction(fn2)) {
            this._toggle.apply(this, arguments);

         } else if (fn == null || bool) {
            this.each(function () {
               var state = bool ? fn : jQuery(this).is(":hidden");
               jQuery(this)[state ? "show" : "hide"]();
            });

         } else {
            this.animate(genFx("toggle", 3), fn, fn2, callback);
         }

         return this;
      },

      fadeTo: function (speed, to, easing, callback) {
         return this.filter(":hidden").css("opacity", 0).show().end()
            .animate({ opacity: to }, speed, easing, callback);
      },

      animate: function (prop, speed, easing, callback) {
         var optall = jQuery.speed(speed, easing, callback);

         if (jQuery.isEmptyObject(prop)) {
            return this.each(optall.complete, [false]);
         }

         // Do not change referenced properties as per-property easing will be lost
         prop = jQuery.extend({}, prop);

         function doAnimation() {
            // XXX 'this' does not always have a nodeName when running the
            // test suite

            if (optall.queue === false) {
               jQuery._mark(this);
            }

            var opt = jQuery.extend({}, optall),
               isElement = this.nodeType === 1,
               hidden = isElement && jQuery(this).is(":hidden"),
               name, val, p, e,
               parts, start, end, unit,
               method;

            // will store per property easing and be used to determine when an animation is complete
            opt.animatedProperties = {};

            for (p in prop) {

               // property name normalization
               name = jQuery.camelCase(p);
               if (p !== name) {
                  prop[name] = prop[p];
                  delete prop[p];
               }

               val = prop[name];

               // easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
               if (jQuery.isArray(val)) {
                  opt.animatedProperties[name] = val[1];
                  val = prop[name] = val[0];
               } else {
                  opt.animatedProperties[name] = opt.specialEasing && opt.specialEasing[name] || opt.easing || 'swing';
               }

               if (val === "hide" && hidden || val === "show" && !hidden) {
                  return opt.complete.call(this);
               }

               if (isElement && (name === "height" || name === "width")) {
                  // Make sure that nothing sneaks out
                  // Record all 3 overflow attributes because IE does not
                  // change the overflow attribute when overflowX and
                  // overflowY are set to the same value
                  opt.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY];

                  // Set display property to inline-block for height/width
                  // animations on inline elements that are having width/height animated
                  if (jQuery.css(this, "display") === "inline" &&
                     jQuery.css(this, "float") === "none") {

                     // inline-level elements accept inline-block;
                     // block-level elements need to be inline with layout
                     if (!jQuery.support.inlineBlockNeedsLayout || defaultDisplay(this.nodeName) === "inline") {
                        this.style.display = "inline-block";

                     } else {
                        this.style.zoom = 1;
                     }
                  }
               }
            }

            if (opt.overflow != null) {
               this.style.overflow = "hidden";
            }

            for (p in prop) {
               e = new jQuery.fx(this, opt, p);
               val = prop[p];

               if (rfxtypes.test(val)) {

                  // Tracks whether to show or hide based on private
                  // data attached to the element
                  method = jQuery._data(this, "toggle" + p) || (val === "toggle" ? hidden ? "show" : "hide" : 0);
                  if (method) {
                     jQuery._data(this, "toggle" + p, method === "show" ? "hide" : "show");
                     e[method]();
                  } else {
                     e[val]();
                  }

               } else {
                  parts = rfxnum.exec(val);
                  start = e.cur();

                  if (parts) {
                     end = parseFloat(parts[2]);
                     unit = parts[3] || (jQuery.cssNumber[p] ? "" : "px");

                     // We need to compute starting value
                     if (unit !== "px") {
                        jQuery.style(this, p, (end || 1) + unit);
                        start = ((end || 1) / e.cur()) * start;
                        jQuery.style(this, p, start + unit);
                     }

                     // If a +=/-= token was provided, we're doing a relative animation
                     if (parts[1]) {
                        end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
                     }

                     e.custom(start, end, unit);

                  } else {
                     e.custom(start, val, "");
                  }
               }
            }

            // For JS strict compliance
            return true;
         }

         return optall.queue === false ?
            this.each(doAnimation) :
            this.queue(optall.queue, doAnimation);
      },

      stop: function (type, clearQueue, gotoEnd) {
         if (typeof type !== "string") {
            gotoEnd = clearQueue;
            clearQueue = type;
            type = undefined;
         }
         if (clearQueue && type !== false) {
            this.queue(type || "fx", []);
         }

         return this.each(function () {
            var index,
               hadTimers = false,
               timers = jQuery.timers,
               data = jQuery._data(this);

            // clear marker counters if we know they won't be
            if (!gotoEnd) {
               jQuery._unmark(true, this);
            }

            function stopQueue(elem, data, index) {
               var hooks = data[index];
               jQuery.removeData(elem, index, true);
               hooks.stop(gotoEnd);
            }

            if (type == null) {
               for (index in data) {
                  if (data[index] && data[index].stop && index.indexOf(".run") === index.length - 4) {
                     stopQueue(this, data, index);
                  }
               }
            } else if (data[index = type + ".run"] && data[index].stop) {
               stopQueue(this, data, index);
            }

            for (index = timers.length; index--;) {
               if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                  if (gotoEnd) {

                     // force the next step to be the last
                     timers[index](true);
                  } else {
                     timers[index].saveState();
                  }
                  hadTimers = true;
                  timers.splice(index, 1);
               }
            }

            // start the next in the queue if the last step wasn't forced
            // timers currently will call their complete callbacks, which will dequeue
            // but only if they were gotoEnd
            if (!(gotoEnd && hadTimers)) {
               jQuery.dequeue(this, type);
            }
         });
      }

   });

   // Animations created synchronously will run synchronously
   function createFxNow() {
      setTimeout(clearFxNow, 0);
      return (fxNow = jQuery.now());
   }

   function clearFxNow() {
      fxNow = undefined;
   }

   // Generate parameters to create a standard animation
   function genFx(type, num) {
      var obj = {};

      jQuery.each(fxAttrs.concat.apply([], fxAttrs.slice(0, num)), function () {
         obj[this] = type;
      });

      return obj;
   }

   // Generate shortcuts for custom animations
   jQuery.each({
      slideDown: genFx("show", 1),
      slideUp: genFx("hide", 1),
      slideToggle: genFx("toggle", 1),
      fadeIn: { opacity: "show" },
      fadeOut: { opacity: "hide" },
      fadeToggle: { opacity: "toggle" }
   }, function (name, props) {
      jQuery.fn[name] = function (speed, easing, callback) {
         return this.animate(props, speed, easing, callback);
      };
   });

   jQuery.extend({
      speed: function (speed, easing, fn) {
         var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing ||
               jQuery.isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
         };

         opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
            opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

         // normalize opt.queue - true/undefined/null -> "fx"
         if (opt.queue == null || opt.queue === true) {
            opt.queue = "fx";
         }

         // Queueing
         opt.old = opt.complete;

         opt.complete = function (noUnmark) {
            if (jQuery.isFunction(opt.old)) {
               opt.old.call(this);
            }

            if (opt.queue) {
               jQuery.dequeue(this, opt.queue);
            } else if (noUnmark !== false) {
               jQuery._unmark(this);
            }
         };

         return opt;
      },

      easing: {
         linear: function (p, n, firstNum, diff) {
            return firstNum + diff * p;
         },
         swing: function (p, n, firstNum, diff) {
            return ((-Math.cos(p * Math.PI) / 2) + 0.5) * diff + firstNum;
         }
      },

      timers: [],

      fx: function (elem, options, prop) {
         this.options = options;
         this.elem = elem;
         this.prop = prop;

         options.orig = options.orig || {};
      }

   });

   jQuery.fx.prototype = {
      // Simple function for setting a style value
      update: function () {
         if (this.options.step) {
            this.options.step.call(this.elem, this.now, this);
         }

         (jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this);
      },

      // Get the current size
      cur: function () {
         if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) {
            return this.elem[this.prop];
         }

         var parsed,
            r = jQuery.css(this.elem, this.prop);
         // Empty strings, null, undefined and "auto" are converted to 0,
         // complex values such as "rotate(1rad)" are returned as is,
         // simple values such as "10px" are parsed to Float.
         return isNaN(parsed = parseFloat(r)) ? !r || r === "auto" ? 0 : r : parsed;
      },

      // Start an animation from one number to another
      custom: function (from, to, unit) {
         var self = this,
            fx = jQuery.fx;

         this.startTime = fxNow || createFxNow();
         this.end = to;
         this.now = this.start = from;
         this.pos = this.state = 0;
         this.unit = unit || this.unit || (jQuery.cssNumber[this.prop] ? "" : "px");

         function t(gotoEnd) {
            return self.step(gotoEnd);
         }

         t.queue = this.options.queue;
         t.elem = this.elem;
         t.saveState = function () {
            if (self.options.hide && jQuery._data(self.elem, "fxshow" + self.prop) === undefined) {
               jQuery._data(self.elem, "fxshow" + self.prop, self.start);
            }
         };

         if (t() && jQuery.timers.push(t) && !timerId) {
            timerId = setInterval(fx.tick, fx.interval);
         }
      },

      // Simple 'show' function
      show: function () {
         var dataShow = jQuery._data(this.elem, "fxshow" + this.prop);

         // Remember where we started, so that we can go back to it later
         this.options.orig[this.prop] = dataShow || jQuery.style(this.elem, this.prop);
         this.options.show = true;

         // Begin the animation
         // Make sure that we start at a small width/height to avoid any flash of content
         if (dataShow !== undefined) {
            // This show is picking up where a previous hide or show left off
            this.custom(this.cur(), dataShow);
         } else {
            this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());
         }

         // Start by showing the element
         jQuery(this.elem).show();
      },

      // Simple 'hide' function
      hide: function () {
         // Remember where we started, so that we can go back to it later
         this.options.orig[this.prop] = jQuery._data(this.elem, "fxshow" + this.prop) || jQuery.style(this.elem, this.prop);
         this.options.hide = true;

         // Begin the animation
         this.custom(this.cur(), 0);
      },

      // Each step of an animation
      step: function (gotoEnd) {
         var p, n, complete,
            t = fxNow || createFxNow(),
            done = true,
            elem = this.elem,
            options = this.options;

         if (gotoEnd || t >= options.duration + this.startTime) {
            this.now = this.end;
            this.pos = this.state = 1;
            this.update();

            options.animatedProperties[this.prop] = true;

            for (p in options.animatedProperties) {
               if (options.animatedProperties[p] !== true) {
                  done = false;
               }
            }

            if (done) {
               // Reset the overflow
               if (options.overflow != null && !jQuery.support.shrinkWrapBlocks) {

                  jQuery.each(["", "X", "Y"], function (index, value) {
                     elem.style["overflow" + value] = options.overflow[index];
                  });
               }

               // Hide the element if the "hide" operation was done
               if (options.hide) {
                  jQuery(elem).hide();
               }

               // Reset the properties, if the item has been hidden or shown
               if (options.hide || options.show) {
                  for (p in options.animatedProperties) {
                     jQuery.style(elem, p, options.orig[p]);
                     jQuery.removeData(elem, "fxshow" + p, true);
                     // Toggle data is no longer needed
                     jQuery.removeData(elem, "toggle" + p, true);
                  }
               }

               // Execute the complete function
               // in the event that the complete function throws an exception
               // we must ensure it won't be called twice. #5684

               complete = options.complete;
               if (complete) {

                  options.complete = false;
                  complete.call(elem);
               }
            }

            return false;

         } else {
            // classical easing cannot be used with an Infinity duration
            if (options.duration == Infinity) {
               this.now = t;
            } else {
               n = t - this.startTime;
               this.state = n / options.duration;

               // Perform the easing function, defaults to swing
               this.pos = jQuery.easing[options.animatedProperties[this.prop]](this.state, n, 0, 1, options.duration);
               this.now = this.start + ((this.end - this.start) * this.pos);
            }
            // Perform the next step of the animation
            this.update();
         }

         return true;
      }
   };

   jQuery.extend(jQuery.fx, {
      tick: function () {
         var timer,
            timers = jQuery.timers,
            i = 0;

         for (; i < timers.length; i++) {
            timer = timers[i];
            // Checks the timer has not already been removed
            if (!timer() && timers[i] === timer) {
               timers.splice(i--, 1);
            }
         }

         if (!timers.length) {
            jQuery.fx.stop();
         }
      },

      interval: 13,

      stop: function () {
         clearInterval(timerId);
         timerId = null;
      },

      speeds: {
         slow: 600,
         fast: 200,
         // Default speed
         _default: 400
      },

      step: {
         opacity: function (fx) {
            jQuery.style(fx.elem, "opacity", fx.now);
         },

         _default: function (fx) {
            if (fx.elem.style && fx.elem.style[fx.prop] != null) {
               fx.elem.style[fx.prop] = fx.now + fx.unit;
            } else {
               fx.elem[fx.prop] = fx.now;
            }
         }
      }
   });

   // Adds width/height step functions
   // Do not set anything below 0
   jQuery.each(["width", "height"], function (i, prop) {
      jQuery.fx.step[prop] = function (fx) {
         jQuery.style(fx.elem, prop, Math.max(0, fx.now) + fx.unit);
      };
   });

   if (jQuery.expr && jQuery.expr.filters) {
      jQuery.expr.filters.animated = function (elem) {
         return jQuery.grep(jQuery.timers, function (fn) {
            return elem === fn.elem;
         }).length;
      };
   }

   // Try to restore the default display value of an element
   function defaultDisplay(nodeName) {

      if (!elemdisplay[nodeName]) {

         var body = document.body,
            elem = jQuery("<" + nodeName + ">").appendTo(body),
            display = elem.css("display");
         elem.remove();

         // If the simple way fails,
         // get element's real default display by attaching it to a temp iframe
         if (display === "none" || display === "") {
            // No iframe to use yet, so create it
            if (!iframe) {
               iframe = document.createElement("iframe");
               iframe.frameBorder = iframe.width = iframe.height = 0;
            }

            body.appendChild(iframe);

            // Create a cacheable copy of the iframe document on first call.
            // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
            // document to it; WebKit & Firefox won't allow reusing the iframe document.
            if (!iframeDoc || !iframe.createElement) {
               iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
               iframeDoc.write((document.compatMode === "CSS1Compat" ? "<!doctype html>" : "") + "<html><body>");
               iframeDoc.close();
            }

            elem = iframeDoc.createElement(nodeName);

            iframeDoc.body.appendChild(elem);

            display = jQuery.css(elem, "display");
            body.removeChild(iframe);
         }

         // Store the correct default display
         elemdisplay[nodeName] = display;
      }

      return elemdisplay[nodeName];
   }




   var rtable = /^t(?:able|d|h)$/i,
      rroot = /^(?:body|html)$/i;

   if ("getBoundingClientRect" in document.documentElement) {
      jQuery.fn.offset = function (options) {
         var elem = this[0], box;

         if (options) {
            return this.each(function (i) {
               jQuery.offset.setOffset(this, options, i);
            });
         }

         if (!elem || !elem.ownerDocument) {
            return null;
         }

         if (elem === elem.ownerDocument.body) {
            return jQuery.offset.bodyOffset(elem);
         }

         try {
            box = elem.getBoundingClientRect();
         } catch (e) { }

         var doc = elem.ownerDocument,
            docElem = doc.documentElement;

         // Make sure we're not dealing with a disconnected DOM node
         if (!box || !jQuery.contains(docElem, elem)) {
            return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
         }

         var body = doc.body,
            win = getWindow(doc),
            clientTop = docElem.clientTop || body.clientTop || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0,
            scrollTop = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop || body.scrollTop,
            scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
            top = box.top + scrollTop - clientTop,
            left = box.left + scrollLeft - clientLeft;

         return { top: top, left: left };
      };

   } else {
      jQuery.fn.offset = function (options) {
         var elem = this[0];

         if (options) {
            return this.each(function (i) {
               jQuery.offset.setOffset(this, options, i);
            });
         }

         if (!elem || !elem.ownerDocument) {
            return null;
         }

         if (elem === elem.ownerDocument.body) {
            return jQuery.offset.bodyOffset(elem);
         }

         var computedStyle,
            offsetParent = elem.offsetParent,
            prevOffsetParent = elem,
            doc = elem.ownerDocument,
            docElem = doc.documentElement,
            body = doc.body,
            defaultView = doc.defaultView,
            prevComputedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle,
            top = elem.offsetTop,
            left = elem.offsetLeft;

         while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
            if (jQuery.support.fixedPosition && prevComputedStyle.position === "fixed") {
               break;
            }

            computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
            top -= elem.scrollTop;
            left -= elem.scrollLeft;

            if (elem === offsetParent) {
               top += elem.offsetTop;
               left += elem.offsetLeft;

               if (jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName))) {
                  top += parseFloat(computedStyle.borderTopWidth) || 0;
                  left += parseFloat(computedStyle.borderLeftWidth) || 0;
               }

               prevOffsetParent = offsetParent;
               offsetParent = elem.offsetParent;
            }

            if (jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible") {
               top += parseFloat(computedStyle.borderTopWidth) || 0;
               left += parseFloat(computedStyle.borderLeftWidth) || 0;
            }

            prevComputedStyle = computedStyle;
         }

         if (prevComputedStyle.position === "relative" || prevComputedStyle.position === "static") {
            top += body.offsetTop;
            left += body.offsetLeft;
         }

         if (jQuery.support.fixedPosition && prevComputedStyle.position === "fixed") {
            top += Math.max(docElem.scrollTop, body.scrollTop);
            left += Math.max(docElem.scrollLeft, body.scrollLeft);
         }

         return { top: top, left: left };
      };
   }

   jQuery.offset = {

      bodyOffset: function (body) {
         var top = body.offsetTop,
            left = body.offsetLeft;

         if (jQuery.support.doesNotIncludeMarginInBodyOffset) {
            top += parseFloat(jQuery.css(body, "marginTop")) || 0;
            left += parseFloat(jQuery.css(body, "marginLeft")) || 0;
         }

         return { top: top, left: left };
      },

      setOffset: function (elem, options, i) {
         var position = jQuery.css(elem, "position");

         // set position first, in-case top/left are set even on static elem
         if (position === "static") {
            elem.style.position = "relative";
         }

         var curElem = jQuery(elem),
            curOffset = curElem.offset(),
            curCSSTop = jQuery.css(elem, "top"),
            curCSSLeft = jQuery.css(elem, "left"),
            calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
            props = {}, curPosition = {}, curTop, curLeft;

         // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
         if (calculatePosition) {
            curPosition = curElem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;
         } else {
            curTop = parseFloat(curCSSTop) || 0;
            curLeft = parseFloat(curCSSLeft) || 0;
         }

         if (jQuery.isFunction(options)) {
            options = options.call(elem, i, curOffset);
         }

         if (options.top != null) {
            props.top = (options.top - curOffset.top) + curTop;
         }
         if (options.left != null) {
            props.left = (options.left - curOffset.left) + curLeft;
         }

         if ("using" in options) {
            options.using.call(elem, props);
         } else {
            curElem.css(props);
         }
      }
   };


   jQuery.fn.extend({

      position: function () {
         if (!this[0]) {
            return null;
         }

         var elem = this[0],

            // Get *real* offsetParent
            offsetParent = this.offsetParent(),

            // Get correct offsets
            offset = this.offset(),
            parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

         // Subtract element margins
         // note: when an element has margin: auto the offsetLeft and marginLeft
         // are the same in Safari causing offset.left to incorrectly be 0
         offset.top -= parseFloat(jQuery.css(elem, "marginTop")) || 0;
         offset.left -= parseFloat(jQuery.css(elem, "marginLeft")) || 0;

         // Add offsetParent borders
         parentOffset.top += parseFloat(jQuery.css(offsetParent[0], "borderTopWidth")) || 0;
         parentOffset.left += parseFloat(jQuery.css(offsetParent[0], "borderLeftWidth")) || 0;

         // Subtract the two offsets
         return {
            top: offset.top - parentOffset.top,
            left: offset.left - parentOffset.left
         };
      },

      offsetParent: function () {
         return this.map(function () {
            var offsetParent = this.offsetParent || document.body;
            while (offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static")) {
               offsetParent = offsetParent.offsetParent;
            }
            return offsetParent;
         });
      }
   });


   // Create scrollLeft and scrollTop methods
   jQuery.each(["Left", "Top"], function (i, name) {
      var method = "scroll" + name;

      jQuery.fn[method] = function (val) {
         var elem, win;

         if (val === undefined) {
            elem = this[0];

            if (!elem) {
               return null;
            }

            win = getWindow(elem);

            // Return the scroll offset
            return win ? ("pageXOffset" in win) ? win[i ? "pageYOffset" : "pageXOffset"] :
               jQuery.support.boxModel && win.document.documentElement[method] ||
               win.document.body[method] :
               elem[method];
         }

         // Set the scroll offset
         return this.each(function () {
            win = getWindow(this);

            if (win) {
               win.scrollTo(
                  !i ? val : jQuery(win).scrollLeft(),
                  i ? val : jQuery(win).scrollTop()
               );

            } else {
               this[method] = val;
            }
         });
      };
   });

   function getWindow(elem) {
      return jQuery.isWindow(elem) ?
         elem :
         elem.nodeType === 9 ?
            elem.defaultView || elem.parentWindow :
            false;
   }




   // Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
   jQuery.each(["Height", "Width"], function (i, name) {

      var type = name.toLowerCase();

      // innerHeight and innerWidth
      jQuery.fn["inner" + name] = function () {
         var elem = this[0];
         return elem ?
            elem.style ?
               parseFloat(jQuery.css(elem, type, "padding")) :
               this[type]() :
            null;
      };

      // outerHeight and outerWidth
      jQuery.fn["outer" + name] = function (margin) {
         var elem = this[0];
         return elem ?
            elem.style ?
               parseFloat(jQuery.css(elem, type, margin ? "margin" : "border")) :
               this[type]() :
            null;
      };

      jQuery.fn[type] = function (size) {
         // Get window width or height
         var elem = this[0];
         if (!elem) {
            return size == null ? null : this;
         }

         if (jQuery.isFunction(size)) {
            return this.each(function (i) {
               var self = jQuery(this);
               self[type](size.call(this, i, self[type]()));
            });
         }

         if (jQuery.isWindow(elem)) {
            // Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
            // 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
            var docElemProp = elem.document.documentElement["client" + name],
               body = elem.document.body;
            return elem.document.compatMode === "CSS1Compat" && docElemProp ||
               body && body["client" + name] || docElemProp;

            // Get document width or height
         } else if (elem.nodeType === 9) {
            // Either scroll[Width/Height] or offset[Width/Height], whichever is greater
            return Math.max(
               elem.documentElement["client" + name],
               elem.body["scroll" + name], elem.documentElement["scroll" + name],
               elem.body["offset" + name], elem.documentElement["offset" + name]
            );

            // Get or set width or height on the element
         } else if (size === undefined) {
            var orig = jQuery.css(elem, type),
               ret = parseFloat(orig);

            return jQuery.isNumeric(ret) ? ret : orig;

            // Set the width or height on the element (default to pixels if value is unitless)
         } else {
            return this.css(type, typeof size === "string" ? size : size + "px");
         }
      };

   });




   // Expose jQuery to the global object
   window.jQuery = window.$ = jQuery;

   // Expose jQuery as an AMD module, but only for AMD loaders that
   // understand the issues with loading multiple versions of jQuery
   // in a page that all might call define(). The loader will indicate
   // they have special allowances for multiple jQuery versions by
   // specifying define.amd.jQuery = true. Register as a named module,
   // since jQuery can be concatenated with other files that may use define,
   // but not use a proper concatenation script that understands anonymous
   // AMD modules. A named AMD is safest and most robust way to register.
   // Lowercase jquery is used because AMD module names are derived from
   // file names, and jQuery is normally delivered in a lowercase file name.
   // Do this after creating the global so that if an AMD module wants to call
   // noConflict to hide this version of jQuery, it will work.
   if (typeof define === "function" && define.amd && define.amd.jQuery) {
      define("jquery", [], function () { return jQuery; });
   }



})(window);




/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function (name, value, options) {
   if (typeof value != 'undefined') { // name and value given, set cookie
      options = options || {};
      if (value === null) {
         value = '';
         options.expires = -1;
      }
      var expires = '';
      if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
         var date;
         if (typeof options.expires == 'number') {
            date = new Date();
            date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
         } else {
            date = options.expires;
         }
         expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
      }
      // CAUTION: Needed to parenthesize options.path and options.domain
      // in the following expressions, otherwise they evaluate to undefined
      // in the packed version for some reason...
      var path = options.path ? '; path=' + (options.path) : '';
      var domain = options.domain ? '; domain=' + (options.domain) : '';
      var secure = options.secure ? '; secure' : '';
      document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
   } else { // only name given, get cookie
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
         var cookies = document.cookie.split(';');
         for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
               break;
            }
         }
      }
      return cookieValue;
   }
};
; (function ($) {

   /*
      Usage Note:
      -----------
      Do not use both ajaxSubmit and ajaxForm on the same form.  These
      functions are intended to be exclusive.  Use ajaxSubmit if you want
      to bind your own submit handler to the form.  For example,
   
      $(document).ready(function() {
         $('#myForm').bind('submit', function(e) {
            e.preventDefault(); // <-- important
            $(this).ajaxSubmit({
               target: '#output'
            });
         });
      });
   
      Use ajaxForm when you want the plugin to manage all the event binding
      for you.  For example,
   
      $(document).ready(function() {
         $('#myForm').ajaxForm({
            target: '#output'
         });
      });
   
      When using ajaxForm, the ajaxSubmit function will be invoked for you
      at the appropriate time.
   */

   /**
    * ajaxSubmit() provides a mechanism for immediately submitting
    * an HTML form using AJAX.
    */
   $.fn.ajaxSubmit = function (options) {
      // fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
      if (!this.length) {
         log('ajaxSubmit: skipping submit process - no element selected');
         return this;
      }

      var method, action, url, $form = this;

      if (typeof options == 'function') {
         options = { success: options };
      }

      method = this.attr('method');
      action = this.attr('action');
      url = (typeof action === 'string') ? $.trim(action) : '';
      url = url || window.location.href || '';
      if (url) {
         // clean url (don't include hash vaue)
         url = (url.match(/^([^#]+)/) || [])[1];
      }

      options = $.extend(true, {
         url: url,
         success: $.ajaxSettings.success,
         type: method || 'GET',
         iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
      }, options);

      // hook for manipulating the form data before it is extracted;
      // convenient for use with rich editors like tinyMCE or FCKEditor
      var veto = {};
      this.trigger('form-pre-serialize', [this, options, veto]);
      if (veto.veto) {
         log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
         return this;
      }

      // provide opportunity to alter form data before it is serialized
      if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
         log('ajaxSubmit: submit aborted via beforeSerialize callback');
         return this;
      }

      var n, v, a = this.formToArray(options.semantic);
      if (options.data) {
         options.extraData = options.data;
         for (n in options.data) {
            if ($.isArray(options.data[n])) {
               for (var k in options.data[n]) {
                  a.push({ name: n, value: options.data[n][k] });
               }
            }
            else {
               v = options.data[n];
               v = $.isFunction(v) ? v() : v; // if value is fn, invoke it
               a.push({ name: n, value: v });
            }
         }
      }

      // give pre-submit callback an opportunity to abort the submit
      if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
         log('ajaxSubmit: submit aborted via beforeSubmit callback');
         return this;
      }

      // fire vetoable 'validate' event
      this.trigger('form-submit-validate', [a, this, options, veto]);
      if (veto.veto) {
         log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
         return this;
      }

      var q = $.param(a);

      if (options.type.toUpperCase() == 'GET') {
         options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
         options.data = null;  // data is null for 'get'
      }
      else {
         options.data = q; // data is the query string for 'post'
      }

      var callbacks = [];
      if (options.resetForm) {
         callbacks.push(function () { $form.resetForm(); });
      }
      if (options.clearForm) {
         callbacks.push(function () { $form.clearForm(); });
      }

      // perform a load on the target only if dataType is not provided
      if (!options.dataType && options.target) {
         var oldSuccess = options.success || function () { };
         callbacks.push(function (data) {
            var fn = options.replaceTarget ? 'replaceWith' : 'html';
            $(options.target)[fn](data).each(oldSuccess, arguments);
         });
      }
      else if (options.success) {
         callbacks.push(options.success);
      }

      options.success = function (data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
         var context = options.context || options;   // jQuery 1.4+ supports scope context
         for (var i = 0, max = callbacks.length; i < max; i++) {
            callbacks[i].apply(context, [data, status, xhr || $form, $form]);
         }
      };

      // are there files to upload?
      var fileInputs = $('input:file', this).length > 0;
      var mp = 'multipart/form-data';
      var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

      // options.iframe allows user to force iframe mode
      // 06-NOV-09: now defaulting to iframe mode if file input is detected
      if (options.iframe !== false && (fileInputs || options.iframe || multipart)) {
         // hack to fix Safari hang (thanks to Tim Molendijk for this)
         // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
         if (options.closeKeepAlive) {
            $.get(options.closeKeepAlive, function () { fileUpload(a); });
         }
         else {
            fileUpload(a);
         }
      }
      else {
         // IE7 massage (see issue 57)
         if ($.browser.msie && method == 'get') {
            var ieMeth = $form[0].getAttribute('method');
            if (typeof ieMeth === 'string')
               options.type = ieMeth;
         }
         $.ajax(options);
      }

      // fire 'notify' event
      this.trigger('form-submit-notify', [this, options]);
      return this;


      // private function for handling file uploads (hat tip to YAHOO!)
      function fileUpload(a) {
         var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;
         var useProp = !!$.fn.prop;

         if (a) {
            // ensure that every serialized input is still enabled
            for (i = 0; i < a.length; i++) {
               el = $(form[a[i].name]);
               el[useProp ? 'prop' : 'attr']('disabled', false);
            }
         }

         if ($(':input[name=submit],:input[id=submit]', form).length) {
            // if there is an input with a name or id of 'submit' then we won't be
            // able to invoke the submit fn on the form (at least not x-browser)
            alert('Error: Form elements must not have name or id of "submit".');
            return;
         }

         s = $.extend(true, {}, $.ajaxSettings, options);
         s.context = s.context || s;
         id = 'jqFormIO' + (new Date().getTime());
         if (s.iframeTarget) {
            $io = $(s.iframeTarget);
            n = $io.attr('name');
            if (n == null)
               $io.attr('name', id);
            else
               id = n;
         }
         else {
            $io = $('<iframe name="' + id + '" src="' + s.iframeSrc + '" />');
            $io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
         }
         io = $io[0];


         xhr = { // mock object
            aborted: 0,
            responseText: null,
            responseXML: null,
            status: 0,
            statusText: 'n/a',
            getAllResponseHeaders: function () { },
            getResponseHeader: function () { },
            setRequestHeader: function () { },
            abort: function (status) {
               var e = (status === 'timeout' ? 'timeout' : 'aborted');
               log('aborting upload... ' + e);
               this.aborted = 1;
               $io.attr('src', s.iframeSrc); // abort op in progress
               xhr.error = e;
               s.error && s.error.call(s.context, xhr, e, status);
               g && $.event.trigger("ajaxError", [xhr, s, e]);
               s.complete && s.complete.call(s.context, xhr, e);
            }
         };

         g = s.global;
         // trigger ajax global events so that activity/block indicators work like normal
         if (g && !$.active++) {
            $.event.trigger("ajaxStart");
         }
         if (g) {
            $.event.trigger("ajaxSend", [xhr, s]);
         }

         if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
            if (s.global) {
               $.active--;
            }
            return;
         }
         if (xhr.aborted) {
            return;
         }

         // add submitting element to data if we know it
         sub = form.clk;
         if (sub) {
            n = sub.name;
            if (n && !sub.disabled) {
               s.extraData = s.extraData || {};
               s.extraData[n] = sub.value;
               if (sub.type == "image") {
                  s.extraData[n + '.x'] = form.clk_x;
                  s.extraData[n + '.y'] = form.clk_y;
               }
            }
         }

         var CLIENT_TIMEOUT_ABORT = 1;
         var SERVER_ABORT = 2;

         function getDoc(frame) {
            var doc = frame.contentWindow ? frame.contentWindow.document : frame.contentDocument ? frame.contentDocument : frame.document;
            return doc;
         }

         // take a breath so that pending repaints get some cpu time before the upload starts
         function doSubmit() {
            // make sure form attrs are set
            var t = $form.attr('target'), a = $form.attr('action');

            // update form attrs in IE friendly way
            form.setAttribute('target', id);
            if (!method) {
               form.setAttribute('method', 'POST');
            }
            if (a != s.url) {
               form.setAttribute('action', s.url);
            }

            // ie borks in some cases when setting encoding
            if (!s.skipEncodingOverride && (!method || /post/i.test(method))) {
               $form.attr({
                  encoding: 'multipart/form-data',
                  enctype: 'multipart/form-data'
               });
            }

            // support timout
            if (s.timeout) {
               timeoutHandle = setTimeout(function () { timedOut = true; cb(CLIENT_TIMEOUT_ABORT); }, s.timeout);
            }

            // look for server aborts
            function checkState() {
               try {
                  var state = getDoc(io).readyState;
                  log('state = ' + state);
                  if (state.toLowerCase() == 'uninitialized')
                     setTimeout(checkState, 50);
               }
               catch (e) {
                  log('Server abort: ', e, ' (', e.name, ')');
                  cb(SERVER_ABORT);
                  timeoutHandle && clearTimeout(timeoutHandle);
                  timeoutHandle = undefined;
               }
            }

            // add "extra" data to form if provided in options
            var extraInputs = [];
            try {
               if (s.extraData) {
                  for (var n in s.extraData) {
                     extraInputs.push(
                        $('<input type="hidden" name="' + n + '" />').attr('value', s.extraData[n])
                           .appendTo(form)[0]);
                  }
               }

               if (!s.iframeTarget) {
                  // add iframe to doc and submit the form
                  $io.appendTo('body');
                  io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);
               }
               setTimeout(checkState, 15);
               form.submit();
            }
            finally {
               // reset attrs and remove "extra" input elements
               form.setAttribute('action', a);
               if (t) {
                  form.setAttribute('target', t);
               } else {
                  $form.removeAttr('target');
               }
               $(extraInputs).remove();
            }
         }

         if (s.forceSync) {
            doSubmit();
         }
         else {
            setTimeout(doSubmit, 10); // this lets dom updates render
         }

         var data, doc, domCheckCount = 50, callbackProcessed;

         function cb(e) {
            if (xhr.aborted || callbackProcessed) {
               return;
            }
            try {
               doc = getDoc(io);
            }
            catch (ex) {
               log('cannot access response document: ', ex);
               e = SERVER_ABORT;
            }
            if (e === CLIENT_TIMEOUT_ABORT && xhr) {
               xhr.abort('timeout');
               return;
            }
            else if (e == SERVER_ABORT && xhr) {
               xhr.abort('server abort');
               return;
            }

            if (!doc || doc.location.href == s.iframeSrc) {
               // response not received yet
               if (!timedOut)
                  return;
            }
            io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);

            var status = 'success', errMsg;
            try {
               if (timedOut) {
                  throw 'timeout';
               }

               var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
               log('isXml=' + isXml);
               if (!isXml && window.opera && (doc.body == null || doc.body.innerHTML == '')) {
                  if (--domCheckCount) {
                     // in some browsers (Opera) the iframe DOM is not always traversable when
                     // the onload callback fires, so we loop a bit to accommodate
                     log('requeing onLoad callback, DOM not available');
                     setTimeout(cb, 250);
                     return;
                  }
                  // let this fall through because server response could be an empty document
                  //log('Could not access iframe DOM after mutiple tries.');
                  //throw 'DOMException: not available';
               }

               //log('response detected');
               var docRoot = doc.body ? doc.body : doc.documentElement;
               xhr.responseText = docRoot ? docRoot.innerHTML : null;
               xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
               if (isXml)
                  s.dataType = 'xml';
               xhr.getResponseHeader = function (header) {
                  var headers = { 'content-type': s.dataType };
                  return headers[header];
               };
               // support for XHR 'status' & 'statusText' emulation :
               if (docRoot) {
                  xhr.status = Number(docRoot.getAttribute('status')) || xhr.status;
                  xhr.statusText = docRoot.getAttribute('statusText') || xhr.statusText;
               }

               var dt = s.dataType || '';
               var scr = /(json|script|text)/.test(dt.toLowerCase());
               if (scr || s.textarea) {
                  // see if user embedded response in textarea
                  var ta = doc.getElementsByTagName('textarea')[0];
                  if (ta) {
                     xhr.responseText = ta.value;
                     // support for XHR 'status' & 'statusText' emulation :
                     xhr.status = Number(ta.getAttribute('status')) || xhr.status;
                     xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
                  }
                  else if (scr) {
                     // account for browsers injecting pre around json response
                     var pre = doc.getElementsByTagName('pre')[0];
                     var b = doc.getElementsByTagName('body')[0];
                     if (pre) {
                        xhr.responseText = pre.textContent ? pre.textContent : pre.innerHTML;
                     }
                     else if (b) {
                        xhr.responseText = b.innerHTML;
                     }
                  }
               }
               else if (s.dataType == 'xml' && !xhr.responseXML && xhr.responseText != null) {
                  xhr.responseXML = toXml(xhr.responseText);
               }

               try {
                  data = httpData(xhr, s.dataType, s);
               }
               catch (e) {
                  status = 'parsererror';
                  xhr.error = errMsg = (e || status);
               }
            }
            catch (e) {
               log('error caught: ', e);
               status = 'error';
               xhr.error = errMsg = (e || status);
            }

            if (xhr.aborted) {
               log('upload aborted');
               status = null;
            }

            if (xhr.status) { // we've set xhr.status
               status = (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) ? 'success' : 'error';
            }

            // ordering of these callbacks/triggers is odd, but that's how $.ajax does it
            if (status === 'success') {
               s.success && s.success.call(s.context, data, 'success', xhr);
               g && $.event.trigger("ajaxSuccess", [xhr, s]);
            }
            else if (status) {
               if (errMsg == undefined)
                  errMsg = xhr.statusText;
               s.error && s.error.call(s.context, xhr, status, errMsg);
               g && $.event.trigger("ajaxError", [xhr, s, errMsg]);
            }

            g && $.event.trigger("ajaxComplete", [xhr, s]);

            if (g && ! --$.active) {
               $.event.trigger("ajaxStop");
            }

            s.complete && s.complete.call(s.context, xhr, status);

            callbackProcessed = true;
            if (s.timeout)
               clearTimeout(timeoutHandle);

            // clean up
            setTimeout(function () {
               if (!s.iframeTarget)
                  $io.remove();
               xhr.responseXML = null;
            }, 100);
         }

         var toXml = $.parseXML || function (s, doc) { // use parseXML if available (jQuery 1.5+)
            if (window.ActiveXObject) {
               doc = new ActiveXObject('Microsoft.XMLDOM');
               doc.async = 'false';
               doc.loadXML(s);
            }
            else {
               doc = (new DOMParser()).parseFromString(s, 'text/xml');
            }
            return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
         };
         var parseJSON = $.parseJSON || function (s) {
            return window['eval']('(' + s + ')');
         };

         var httpData = function (xhr, type, s) { // mostly lifted from jq1.4.4

            var ct = xhr.getResponseHeader('content-type') || '',
               xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
               data = xml ? xhr.responseXML : xhr.responseText;

            if (xml && data.documentElement.nodeName === 'parsererror') {
               $.error && $.error('parsererror');
            }
            if (s && s.dataFilter) {
               data = s.dataFilter(data, type);
            }
            if (typeof data === 'string') {
               if (type === 'json' || !type && ct.indexOf('json') >= 0) {
                  data = parseJSON(data);
               } else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
                  $.globalEval(data);
               }
            }
            return data;
         };
      }
   };

   /**
    * ajaxForm() provides a mechanism for fully automating form submission.
    *
    * The advantages of using this method instead of ajaxSubmit() are:
    *
    * 1: This method will include coordinates for <input type="image" /> elements (if the element
    *	is used to submit the form).
    * 2. This method will include the submit element's name/value data (for the element that was
    *	used to submit the form).
    * 3. This method binds the submit() method to the form for you.
    *
    * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
    * passes the options argument along after properly binding events for submit elements and
    * the form itself.
    */
   $.fn.ajaxForm = function (options) {
      // in jQuery 1.3+ we can fix mistakes with the ready state
      if (this.length === 0) {
         var o = { s: this.selector, c: this.context };
         if (!$.isReady && o.s) {
            log('DOM not ready, queuing ajaxForm');
            $(function () {
               $(o.s, o.c).ajaxForm(options);
            });
            return this;
         }
         // is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
         log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
         return this;
      }

      return this.ajaxFormUnbind().bind('submit.form-plugin', function (e) {
         if (!e.isDefaultPrevented()) { // if event has been canceled, don't proceed
            e.preventDefault();
            $(this).ajaxSubmit(options);
         }
      }).bind('click.form-plugin', function (e) {
         var target = e.target;
         var $el = $(target);
         if (!($el.is(":submit,input:image"))) {
            // is this a child element of the submit el?  (ex: a span within a button)
            var t = $el.closest(':submit');
            if (t.length == 0) {
               return;
            }
            target = t[0];
         }
         var form = this;
         form.clk = target;
         if (target.type == 'image') {
            if (e.offsetX != undefined) {
               form.clk_x = e.offsetX;
               form.clk_y = e.offsetY;
            } else if (typeof $.fn.offset == 'function') { // try to use dimensions plugin
               var offset = $el.offset();
               form.clk_x = e.pageX - offset.left;
               form.clk_y = e.pageY - offset.top;
            } else {
               form.clk_x = e.pageX - target.offsetLeft;
               form.clk_y = e.pageY - target.offsetTop;
            }
         }
         // clear form vars
         setTimeout(function () { form.clk = form.clk_x = form.clk_y = null; }, 100);
      });
   };

   // ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
   $.fn.ajaxFormUnbind = function () {
      return this.unbind('submit.form-plugin click.form-plugin');
   };

   /**
    * formToArray() gathers form element data into an array of objects that can
    * be passed to any of the following ajax functions: $.get, $.post, or load.
    * Each object in the array has both a 'name' and 'value' property.  An example of
    * an array for a simple login form might be:
    *
    * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
    *
    * It is this array that is passed to pre-submit callback functions provided to the
    * ajaxSubmit() and ajaxForm() methods.
    */
   $.fn.formToArray = function (semantic) {
      var a = [];
      if (this.length === 0) {
         return a;
      }

      var form = this[0];
      var els = semantic ? form.getElementsByTagName('*') : form.elements;
      if (!els) {
         return a;
      }

      var i, j, n, v, el, max, jmax;
      for (i = 0, max = els.length; i < max; i++) {
         el = els[i];
         n = el.name;
         if (!n) {
            continue;
         }

         if (semantic && form.clk && el.type == "image") {
            // handle image inputs on the fly when semantic == true
            if (!el.disabled && form.clk == el) {
               a.push({ name: n, value: $(el).val() });
               a.push({ name: n + '.x', value: form.clk_x }, { name: n + '.y', value: form.clk_y });
            }
            continue;
         }

         v = $.fieldValue(el, true);
         if (v && v.constructor == Array) {
            for (j = 0, jmax = v.length; j < jmax; j++) {
               a.push({ name: n, value: v[j] });
            }
         }
         else if (v !== null && typeof v != 'undefined') {
            a.push({ name: n, value: v });
         }
      }

      if (!semantic && form.clk) {
         // input type=='image' are not found in elements array! handle it here
         var $input = $(form.clk), input = $input[0];
         n = input.name;
         if (n && !input.disabled && input.type == 'image') {
            a.push({ name: n, value: $input.val() });
            a.push({ name: n + '.x', value: form.clk_x }, { name: n + '.y', value: form.clk_y });
         }
      }
      return a;
   };

   /**
    * Serializes form data into a 'submittable' string. This method will return a string
    * in the format: name1=value1&amp;name2=value2
    */
   $.fn.formSerialize = function (semantic) {
      //hand off to jQuery.param for proper encoding
      return $.param(this.formToArray(semantic));
   };

   /**
    * Serializes all field elements in the jQuery object into a query string.
    * This method will return a string in the format: name1=value1&amp;name2=value2
    */
   $.fn.fieldSerialize = function (successful) {
      var a = [];
      this.each(function () {
         var n = this.name;
         if (!n) {
            return;
         }
         var v = $.fieldValue(this, successful);
         if (v && v.constructor == Array) {
            for (var i = 0, max = v.length; i < max; i++) {
               a.push({ name: n, value: v[i] });
            }
         }
         else if (v !== null && typeof v != 'undefined') {
            a.push({ name: this.name, value: v });
         }
      });
      //hand off to jQuery.param for proper encoding
      return $.param(a);
   };

   /**
    * Returns the value(s) of the element in the matched set.  For example, consider the following form:
    *
    *  <form><fieldset>
    *	  <input name="A" type="text" />
    *	  <input name="A" type="text" />
    *	  <input name="B" type="checkbox" value="B1" />
    *	  <input name="B" type="checkbox" value="B2"/>
    *	  <input name="C" type="radio" value="C1" />
    *	  <input name="C" type="radio" value="C2" />
    *  </fieldset></form>
    *
    *  var v = $(':text').fieldValue();
    *  // if no values are entered into the text inputs
    *  v == ['','']
    *  // if values entered into the text inputs are 'foo' and 'bar'
    *  v == ['foo','bar']
    *
    *  var v = $(':checkbox').fieldValue();
    *  // if neither checkbox is checked
    *  v === undefined
    *  // if both checkboxes are checked
    *  v == ['B1', 'B2']
    *
    *  var v = $(':radio').fieldValue();
    *  // if neither radio is checked
    *  v === undefined
    *  // if first radio is checked
    *  v == ['C1']
    *
    * The successful argument controls whether or not the field element must be 'successful'
    * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
    * The default value of the successful argument is true.  If this value is false the value(s)
    * for each element is returned.
    *
    * Note: This method *always* returns an array.  If no valid value can be determined the
    *	   array will be empty, otherwise it will contain one or more values.
    */
   $.fn.fieldValue = function (successful) {
      for (var val = [], i = 0, max = this.length; i < max; i++) {
         var el = this[i];
         var v = $.fieldValue(el, successful);
         if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
            continue;
         }
         v.constructor == Array ? $.merge(val, v) : val.push(v);
      }
      return val;
   };

   /**
    * Returns the value of the field element.
    */
   $.fieldValue = function (el, successful) {
      var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
      if (successful === undefined) {
         successful = true;
      }

      if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
         (t == 'checkbox' || t == 'radio') && !el.checked ||
         (t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
         tag == 'select' && el.selectedIndex == -1)) {
         return null;
      }

      if (tag == 'select') {
         var index = el.selectedIndex;
         if (index < 0) {
            return null;
         }
         var a = [], ops = el.options;
         var one = (t == 'select-one');
         var max = (one ? index + 1 : ops.length);
         for (var i = (one ? index : 0); i < max; i++) {
            var op = ops[i];
            if (op.selected) {
               var v = op.value;
               if (!v) { // extra pain for IE...
                  v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
               }
               if (one) {
                  return v;
               }
               a.push(v);
            }
         }
         return a;
      }
      return $(el).val();
   };

   /**
    * Clears the form data.  Takes the following actions on the form's input fields:
    *  - input text fields will have their 'value' property set to the empty string
    *  - select elements will have their 'selectedIndex' property set to -1
    *  - checkbox and radio inputs will have their 'checked' property set to false
    *  - inputs of type submit, button, reset, and hidden will *not* be effected
    *  - button elements will *not* be effected
    */
   $.fn.clearForm = function () {
      return this.each(function () {
         $('input,select,textarea', this).clearFields();
      });
   };

   /**
    * Clears the selected form elements.
    */
   $.fn.clearFields = $.fn.clearInputs = function () {
      var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
      return this.each(function () {
         var t = this.type, tag = this.tagName.toLowerCase();
         if (re.test(t) || tag == 'textarea') {
            this.value = '';
         }
         else if (t == 'checkbox' || t == 'radio') {
            this.checked = false;
         }
         else if (tag == 'select') {
            this.selectedIndex = -1;
         }
      });
   };

   /**
    * Resets the form data.  Causes all form elements to be reset to their original value.
    */
   $.fn.resetForm = function () {
      return this.each(function () {
         // guard against an input with the name of 'reset'
         // note that IE reports the reset function as an 'object'
         if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
            this.reset();
         }
      });
   };

   /**
    * Enables or disables any matching elements.
    */
   $.fn.enable = function (b) {
      if (b === undefined) {
         b = true;
      }
      return this.each(function () {
         this.disabled = !b;
      });
   };

   /**
    * Checks/unchecks any matching checkboxes or radio buttons and
    * selects/deselects and matching option elements.
    */
   $.fn.selected = function (select) {
      if (select === undefined) {
         select = true;
      }
      return this.each(function () {
         var t = this.type;
         if (t == 'checkbox' || t == 'radio') {
            this.checked = select;
         }
         else if (this.tagName.toLowerCase() == 'option') {
            var $sel = $(this).parent('select');
            if (select && $sel[0] && $sel[0].type == 'select-one') {
               // deselect all other options
               $sel.find('option').selected(false);
            }
            this.selected = select;
         }
      });
   };

   // helper fn for console logging
   function log() {
      var msg = '[jquery.form] ' + Array.prototype.join.call(arguments, '');
      if (window.console && window.console.log) {
         window.console.log(msg);
      }
      else if (window.opera && window.opera.postError) {
         window.opera.postError(msg);
      }
   };

})(jQuery);
/***
@title:
Ajax Loader

@version:
1.0

@author:
Andreas Lagerkvist

@date:
2008-09-25

@url:
http://andreaslagerkvist.com/jquery/ajax-loader/

@license:
http://creativecommons.org/licenses/by/3.0/

@copyright:
2008 Andreas Lagerkvist (andreaslagerkvist.com)

@requires:
jquery, jquery.ajaxLoader.css, jquery.ajaxLoader.gif

@does:
Use this plug-in when you want to inform your visitors that a certain part of your page is currently loading. The plug-in adds a faded 'loading-div' on top of the selected element(s). The div is of course completely stylable.

@howto:
jQuery('#contact').ajaxLoader(); would add the overlay on top of the #contact-element.

When you want to remove the loader simply run jQuery('#contact').ajaxLoaderRemove();

@exampleHTML:
I should start loading after a couple of seconds, then load for a couple more and then stop loading only to start again after a couple of seconds. And so on.

@exampleJS:
setInterval(function () {
   jQuery('#jquery-ajax-loader-example').ajaxLoader();
   setTimeout(function () {
      jQuery('#jquery-ajax-loader-example').ajaxLoaderRemove();
   }, 2000);
}, 4000);
***/
jQuery.fn.ajaxLoader = function (conf) {
   var config = jQuery.extend({
      className: 'jquery-ajax-loader',
      fadeDuration: 500
   }, conf);

   return this.each(function () {
      var t = jQuery(this);

      if (!this.ajaxLoaderObject) {
         var offset = t.offset();
         var dim = {
            left: offset.left,
            top: offset.top,
            width: t.outerWidth(),
            height: t.outerHeight()
         };

         this.ajaxLoaderObject = jQuery('<div class="' + config.className + '"></div>').css({
            position: 'absolute',
            left: dim.left + 'px',
            top: dim.top + 'px',
            width: dim.width + 'px',
            height: dim.height + 'px'
         }).appendTo(document.body).hide();
      }

      this.ajaxLoaderObject.fadeIn(config.fadeDuration);
   });
};

jQuery.fn.ajaxLoaderRemove = function () {
   return this.each(function () {
      if (this.ajaxLoaderObject) {
         this.ajaxLoaderObject.fadeOut(500);
      }
   });
};

/**
 * BxSlider v4.1 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2012, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the WTFPL license - http://sam.zoy.org/wtfpl/
 */

; (function ($) {

   var plugin = {};

   var defaults = {

      // GENERAL
      mode: 'horizontal',
      slideSelector: '',
      infiniteLoop: true,
      hideControlOnEnd: false,
      speed: 500,
      easing: null,
      slideMargin: 0,
      startSlide: 0,
      randomStart: false,
      captions: false,
      ticker: false,
      tickerHover: false,
      adaptiveHeight: false,
      adaptiveHeightSpeed: 500,
      video: false,
      useCSS: true,
      preloadImages: 'visible',

      // TOUCH
      touchEnabled: true,
      swipeThreshold: 50,
      oneToOneTouch: true,
      preventDefaultSwipeX: true,
      preventDefaultSwipeY: false,

      // PAGER
      pager: true,
      pagerType: 'full',
      pagerShortSeparator: ' / ',
      pagerSelector: null,
      buildPager: null,
      pagerCustom: null,

      // CONTROLS
      controls: true,
      nextText: 'Next',
      prevText: 'Prev',
      nextSelector: null,
      prevSelector: null,
      autoControls: false,
      startText: 'Start',
      stopText: 'Stop',
      autoControlsCombine: false,
      autoControlsSelector: null,

      // AUTO
      auto: false,
      pause: 4000,
      autoStart: true,
      autoDirection: 'next',
      autoHover: false,
      autoDelay: 0,

      // CAROUSEL
      minSlides: 1,
      maxSlides: 1,
      moveSlides: 0,
      slideWidth: 0,

      // CALLBACKS
      onSliderLoad: function () { },
      onSlideBefore: function () { },
      onSlideAfter: function () { },
      onSlideNext: function () { },
      onSlidePrev: function () { }
   }

   $.fn.bxSlider = function (options) {

      if (this.length == 0) return this;

      // support mutltiple elements
      if (this.length > 1) {
         this.each(function () { $(this).bxSlider(options) });
         return this;
      }

      // create a namespace to be used throughout the plugin
      var slider = {};
      // set a reference to our slider element
      var el = this;
      plugin.el = this;

      /**
       * Makes slideshow responsive
       */
      // first get the original window dimens (thanks alot IE)
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();



      /**
       * ===================================================================================
       * = PRIVATE FUNCTIONS
       * ===================================================================================
       */

      /**
       * Initializes namespace settings to be used throughout plugin
       */
      var init = function () {
         // merge user-supplied options with the defaults
         slider.settings = $.extend({}, defaults, options);
         // parse slideWidth setting
         slider.settings.slideWidth = parseInt(slider.settings.slideWidth);
         // store the original children
         slider.children = el.children(slider.settings.slideSelector);
         // check if actual number of slides is less than minSlides / maxSlides
         if (slider.children.length < slider.settings.minSlides) slider.settings.minSlides = slider.children.length;
         if (slider.children.length < slider.settings.maxSlides) slider.settings.maxSlides = slider.children.length;
         // if random start, set the startSlide setting to random number
         if (slider.settings.randomStart) slider.settings.startSlide = Math.floor(Math.random() * slider.children.length);
         // store active slide information
         slider.active = { index: slider.settings.startSlide }
         // store if the slider is in carousel mode (displaying / moving multiple slides)
         slider.carousel = slider.settings.minSlides > 1 || slider.settings.maxSlides > 1;
         // if carousel, force preloadImages = 'all'
         if (slider.carousel) slider.settings.preloadImages = 'all';
         // calculate the min / max width thresholds based on min / max number of slides
         // used to setup and update carousel slides dimensions
         slider.minThreshold = (slider.settings.minSlides * slider.settings.slideWidth) + ((slider.settings.minSlides - 1) * slider.settings.slideMargin);
         slider.maxThreshold = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
         // store the current state of the slider (if currently animating, working is true)
         slider.working = false;
         // initialize the controls object
         slider.controls = {};
         // initialize an auto interval
         slider.interval = null;
         // determine which property to use for transitions
         slider.animProp = slider.settings.mode == 'vertical' ? 'top' : 'left';
         // determine if hardware acceleration can be used
         slider.usingCSS = slider.settings.useCSS && slider.settings.mode != 'fade' && (function () {
            // create our test div element
            var div = document.createElement('div');
            // css transition properties
            var props = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
            // test for each property
            for (var i in props) {
               if (div.style[props[i]] !== undefined) {
                  slider.cssPrefix = props[i].replace('Perspective', '').toLowerCase();
                  slider.animProp = '-' + slider.cssPrefix + '-transform';
                  return true;
               }
            }
            return false;
         }());
         // if vertical mode always make maxSlides and minSlides equal
         if (slider.settings.mode == 'vertical') slider.settings.maxSlides = slider.settings.minSlides;
         // perform all DOM / CSS modifications
         setup();
      }

      /**
       * Performs all DOM and CSS modifications
       */
      var setup = function () {
         // wrap el in a wrapper
         el.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>');
         // store a namspace reference to .bx-viewport
         slider.viewport = el.parent();
         // add a loading div to display while images are loading
         slider.loader = $('<div class="bx-loading" />');
         slider.viewport.prepend(slider.loader);
         // set el to a massive width, to hold any needed slides
         // also strip any margin and padding from el
         el.css({
            width: slider.settings.mode == 'horizontal' ? slider.children.length * 215 + '%' : 'auto',
            position: 'relative'
         });
         // if using CSS, add the easing property
         if (slider.usingCSS && slider.settings.easing) {
            el.css('-' + slider.cssPrefix + '-transition-timing-function', slider.settings.easing);
            // if not using CSS and no easing value was supplied, use the default JS animation easing (swing)
         } else if (!slider.settings.easing) {
            slider.settings.easing = 'swing';
         }
         var slidesShowing = getNumberSlidesShowing();
         // make modifications to the viewport (.bx-viewport)
         slider.viewport.css({
            width: '100%',
            overflow: 'hidden',
            position: 'relative'
         });
         slider.viewport.parent().css({
            maxWidth: getViewportMaxWidth()
         });
         // apply css to all slider children
         slider.children.css({
            'float': slider.settings.mode == 'horizontal' ? 'left' : 'none',
            listStyle: 'none',
            position: 'relative'
         });
         // apply the calculated width after the float is applied to prevent scrollbar interference
         slider.children.width(getSlideWidth());
         // if slideMargin is supplied, add the css
         if (slider.settings.mode == 'horizontal' && slider.settings.slideMargin > 0) slider.children.css('marginRight', slider.settings.slideMargin);
         if (slider.settings.mode == 'vertical' && slider.settings.slideMargin > 0) slider.children.css('marginBottom', slider.settings.slideMargin);
         // if "fade" mode, add positioning and z-index CSS
         if (slider.settings.mode == 'fade') {
            slider.children.css({
               position: 'absolute',
               zIndex: 0,
               display: 'none'
            });
            // prepare the z-index on the showing element
            slider.children.eq(slider.settings.startSlide).css({ zIndex: 50, display: 'block' });
         }
         // create an element to contain all slider controls (pager, start / stop, etc)
         slider.controls.el = $('<div class="bx-controls" />');
         // if captions are requested, add them
         if (slider.settings.captions) appendCaptions();
         // if infinite loop, prepare additional slides
         if (slider.settings.infiniteLoop && slider.settings.mode != 'fade' && !slider.settings.ticker) {
            var slice = slider.settings.mode == 'vertical' ? slider.settings.minSlides : slider.settings.maxSlides;
            var sliceAppend = slider.children.slice(0, slice).clone().addClass('bx-clone');
            var slicePrepend = slider.children.slice(-slice).clone().addClass('bx-clone');
            el.append(sliceAppend).prepend(slicePrepend);
         }
         // check if startSlide is last slide
         slider.active.last = slider.settings.startSlide == getPagerQty() - 1;
         // if video is true, set up the fitVids plugin
         if (slider.settings.video) el.fitVids();
         // set the default preload selector (visible)
         var preloadSelector = slider.children.eq(slider.settings.startSlide);
         if (slider.settings.preloadImages == "all") preloadSelector = el.children();
         // only check for control addition if not in "ticker" mode
         if (!slider.settings.ticker) {
            // if pager is requested, add it
            if (slider.settings.pager) appendPager();
            // if controls are requested, add them
            if (slider.settings.controls) appendControls();
            // if auto is true, and auto controls are requested, add them
            if (slider.settings.auto && slider.settings.autoControls) appendControlsAuto();
            // if any control option is requested, add the controls wrapper
            if (slider.settings.controls || slider.settings.autoControls || slider.settings.pager) slider.viewport.after(slider.controls.el);
            // if ticker mode, do not allow a pager
         } else {
            slider.settings.pager = false;
         }
         // preload all images, then perform final DOM / CSS modifications that depend on images being loaded
         preloadSelector.imagesLoaded(start);
      }

      /**
       * Start the slider
       */
      var start = function () {
         // remove the loading DOM element
         slider.loader.remove();
         // set the left / top position of "el"
         setSlidePosition();
         // if "vertical" mode, always use adaptiveHeight to prevent odd behavior
         if (slider.settings.mode == 'vertical') slider.settings.adaptiveHeight = true;
         // set the viewport height
         slider.viewport.height(getViewportHeight());
         // make sure everything is positioned just right (same as a window resize)
         el.redrawSlider();
         // onSliderLoad callback
         slider.settings.onSliderLoad(slider.active.index);
         // slider has been fully initialized
         slider.initialized = true;
         // bind the resize call to the window
         $(window).bind('resize', resizeWindow);
         // if auto is true, start the show
         if (slider.settings.auto && slider.settings.autoStart) initAuto();
         // if ticker is true, start the ticker
         if (slider.settings.ticker) initTicker();
         // if pager is requested, make the appropriate pager link active
         if (slider.settings.pager) updatePagerActive(slider.settings.startSlide);
         // check for any updates to the controls (like hideControlOnEnd updates)
         if (slider.settings.controls) updateDirectionControls();
         // if touchEnabled is true, setup the touch events
         if (slider.settings.touchEnabled && !slider.settings.ticker) initTouch();
      }

      /**
       * Returns the calculated height of the viewport, used to determine either adaptiveHeight or the maxHeight value
       */
      var getViewportHeight = function () {
         var height = 0;
         // first determine which children (slides) should be used in our height calculation
         var children = $();
         // if mode is not "vertical" and adaptiveHeight is false, include all children
         if (slider.settings.mode != 'vertical' && !slider.settings.adaptiveHeight) {
            children = slider.children;
         } else {
            // if not carousel, return the single active child
            if (!slider.carousel) {
               children = slider.children.eq(slider.active.index);
               // if carousel, return a slice of children
            } else {
               // get the individual slide index
               var currentIndex = slider.settings.moveSlides == 1 ? slider.active.index : slider.active.index * getMoveBy();
               // add the current slide to the children
               children = slider.children.eq(currentIndex);
               // cycle through the remaining "showing" slides
               for (i = 1; i <= slider.settings.maxSlides - 1; i++) {
                  // if looped back to the start
                  if (currentIndex + i >= slider.children.length) {
                     children = children.add(slider.children.eq(i - 1));
                  } else {
                     children = children.add(slider.children.eq(currentIndex + i));
                  }
               }
            }
         }
         // if "vertical" mode, calculate the sum of the heights of the children
         if (slider.settings.mode == 'vertical') {
            children.each(function (index) {
               height += $(this).outerHeight();
            });
            // add user-supplied margins
            if (slider.settings.slideMargin > 0) {
               height += slider.settings.slideMargin * (slider.settings.minSlides - 1);
            }
            // if not "vertical" mode, calculate the max height of the children
         } else {
            height = Math.max.apply(Math, children.map(function () {
               return $(this).outerHeight(false);
            }).get());
         }
         return height;
      }

      /**
       * Returns the calculated width to be used for the outer wrapper / viewport
       */
      var getViewportMaxWidth = function () {
         var width = '100%';
         if (slider.settings.slideWidth > 0) {
            if (slider.settings.mode == 'horizontal') {
               width = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
            } else {
               width = slider.settings.slideWidth;
            }
         }
         return width;
      }

      /**
       * Returns the calculated width to be applied to each slide
       */
      var getSlideWidth = function () {
         // start with any user-supplied slide width
         var newElWidth = slider.settings.slideWidth;
         // get the current viewport width
         var wrapWidth = slider.viewport.width();
         // if slide width was not supplied, or is larger than the viewport use the viewport width
         if (slider.settings.slideWidth == 0 ||
            (slider.settings.slideWidth > wrapWidth && !slider.carousel) ||
            slider.settings.mode == 'vertical') {
            newElWidth = wrapWidth;
            // if carousel, use the thresholds to determine the width
         } else if (slider.settings.maxSlides > 1 && slider.settings.mode == 'horizontal') {
            if (wrapWidth > slider.maxThreshold) {
               // newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.maxSlides - 1))) / slider.settings.maxSlides;
            } else if (wrapWidth < slider.minThreshold) {
               newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.minSlides - 1))) / slider.settings.minSlides;
            }
         }
         return newElWidth;
      }

      /**
       * Returns the number of slides currently visible in the viewport (includes partially visible slides)
       */
      var getNumberSlidesShowing = function () {
         var slidesShowing = 1;
         if (slider.settings.mode == 'horizontal' && slider.settings.slideWidth > 0) {
            // if viewport is smaller than minThreshold, return minSlides
            if (slider.viewport.width() < slider.minThreshold) {
               slidesShowing = slider.settings.minSlides;
               // if viewport is larger than minThreshold, return maxSlides
            } else if (slider.viewport.width() > slider.maxThreshold) {
               slidesShowing = slider.settings.maxSlides;
               // if viewport is between min / max thresholds, divide viewport width by first child width
            } else {
               var childWidth = slider.children.first().width();
               slidesShowing = Math.floor(slider.viewport.width() / childWidth);
            }
            // if "vertical" mode, slides showing will always be minSlides
         } else if (slider.settings.mode == 'vertical') {
            slidesShowing = slider.settings.minSlides;
         }
         return slidesShowing;
      }

      /**
       * Returns the number of pages (one full viewport of slides is one "page")
       */
      var getPagerQty = function () {
         var pagerQty = 0;
         // if moveSlides is specified by the user
         if (slider.settings.moveSlides > 0) {
            if (slider.settings.infiniteLoop) {
               pagerQty = slider.children.length / getMoveBy();
            } else {
               // use a while loop to determine pages
               var breakPoint = 0;
               var counter = 0
               // when breakpoint goes above children length, counter is the number of pages
               while (breakPoint < slider.children.length) {
                  ++pagerQty;
                  breakPoint = counter + getNumberSlidesShowing();
                  counter += slider.settings.moveSlides <= getNumberSlidesShowing() ? slider.settings.moveSlides : getNumberSlidesShowing();
               }
            }
            // if moveSlides is 0 (auto) divide children length by sides showing, then round up
         } else {
            pagerQty = Math.ceil(slider.children.length / getNumberSlidesShowing());
         }
         return pagerQty;
      }

      /**
       * Returns the number of indivual slides by which to shift the slider
       */
      var getMoveBy = function () {
         // if moveSlides was set by the user and moveSlides is less than number of slides showing
         if (slider.settings.moveSlides > 0 && slider.settings.moveSlides <= getNumberSlidesShowing()) {
            return slider.settings.moveSlides;
         }
         // if moveSlides is 0 (auto)
         return getNumberSlidesShowing();
      }

      /**
       * Sets the slider's (el) left or top position
       */
      var setSlidePosition = function () {
         // if last slide, not infinite loop, and number of children is larger than specified maxSlides
         if (slider.children.length > slider.settings.maxSlides && slider.active.last && !slider.settings.infiniteLoop) {
            if (slider.settings.mode == 'horizontal') {
               // get the last child's position
               var lastChild = slider.children.last();
               var position = lastChild.position();
               // set the left position
               setPositionProperty(-(position.left - (slider.viewport.width() - lastChild.width())), 'reset', 0);
            } else if (slider.settings.mode == 'vertical') {
               // get the last showing index's position
               var lastShowingIndex = slider.children.length - slider.settings.minSlides;
               var position = slider.children.eq(lastShowingIndex).position();
               // set the top position
               setPositionProperty(-position.top, 'reset', 0);
            }
            // if not last slide
         } else {
            // get the position of the first showing slide
            var position = slider.children.eq(slider.active.index * getMoveBy()).position();
            // check for last slide
            if (slider.active.index == getPagerQty() - 1) slider.active.last = true;
            // set the repective position
            if (position != undefined) {
               if (slider.settings.mode == 'horizontal') setPositionProperty(-position.left, 'reset', 0);
               else if (slider.settings.mode == 'vertical') setPositionProperty(-position.top, 'reset', 0);
            }
         }
      }

      /**
       * Sets the el's animating property position (which in turn will sometimes animate el).
       * If using CSS, sets the transform property. If not using CSS, sets the top / left property.
       *
       * @param value (int) 
       *  - the animating property's value
       *
       * @param type (string) 'slider', 'reset', 'ticker'
       *  - the type of instance for which the function is being
       *
       * @param duration (int) 
       *  - the amount of time (in ms) the transition should occupy
       *
       * @param params (array) optional
       *  - an optional parameter containing any variables that need to be passed in
       */
      var setPositionProperty = function (value, type, duration, params) {
         // use CSS transform
         if (slider.usingCSS) {
            // determine the translate3d value
            var propValue = slider.settings.mode == 'vertical' ? 'translate3d(0, ' + value + 'px, 0)' : 'translate3d(' + value + 'px, 0, 0)';
            // add the CSS transition-duration
            el.css('-' + slider.cssPrefix + '-transition-duration', duration / 1000 + 's');
            if (type == 'slide') {
               // set the property value
               el.css(slider.animProp, propValue);
               // bind a callback method - executes when CSS transition completes
               el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
                  // unbind the callback
                  el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                  updateAfterSlideTransition();
               });
            } else if (type == 'reset') {
               el.css(slider.animProp, propValue);
            } else if (type == 'ticker') {
               // make the transition use 'linear'
               el.css('-' + slider.cssPrefix + '-transition-timing-function', 'linear');
               el.css(slider.animProp, propValue);
               // bind a callback method - executes when CSS transition completes
               el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
                  // unbind the callback
                  el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                  // reset the position
                  setPositionProperty(params['resetValue'], 'reset', 0);
                  // start the loop again
                  tickerLoop();
               });
            }
            // use JS animate
         } else {
            var animateObj = {};
            animateObj[slider.animProp] = value;
            if (type == 'slide') {
               el.animate(animateObj, duration, slider.settings.easing, function () {
                  updateAfterSlideTransition();
               });
            } else if (type == 'reset') {
               el.css(slider.animProp, value)
            } else if (type == 'ticker') {
               el.animate(animateObj, speed, 'linear', function () {
                  setPositionProperty(params['resetValue'], 'reset', 0);
                  // run the recursive loop after animation
                  tickerLoop();
               });
            }
         }
      }

      /**
       * Populates the pager with proper amount of pages
       */
      var populatePager = function () {
         var pagerHtml = '';
         var pagerQty = getPagerQty();
         // loop through each pager item
         for (var i = 0; i < pagerQty; i++) {
            var linkContent = '';
            // if a buildPager function is supplied, use it to get pager link value, else use index + 1
            if (slider.settings.buildPager && $.isFunction(slider.settings.buildPager)) {
               linkContent = slider.settings.buildPager(i);
               slider.pagerEl.addClass('bx-custom-pager');
            } else {
               linkContent = i + 1;
               slider.pagerEl.addClass('bx-default-pager');
            }
            // var linkContent = slider.settings.buildPager && $.isFunction(slider.settings.buildPager) ? slider.settings.buildPager(i) : i + 1;
            // add the markup to the string
            pagerHtml += '<div class="bx-pager-item"><a href="" data-slide-index="' + i + '" class="bx-pager-link">' + linkContent + '</a></div>';
         };
         // populate the pager element with pager links
         slider.pagerEl.html(pagerHtml);
      }

      /**
       * Appends the pager to the controls element
       */
      var appendPager = function () {
         if (!slider.settings.pagerCustom) {
            // create the pager DOM element
            slider.pagerEl = $('<div class="bx-pager" />');
            // if a pager selector was supplied, populate it with the pager
            if (slider.settings.pagerSelector) {
               $(slider.settings.pagerSelector).html(slider.pagerEl);
               // if no pager selector was supplied, add it after the wrapper
            } else {
               slider.controls.el.addClass('bx-has-pager').append(slider.pagerEl);
            }
            // populate the pager
            populatePager();
         } else {
            slider.pagerEl = $(slider.settings.pagerCustom);
         }
         // assign the pager click binding
         slider.pagerEl.delegate('a', 'click', clickPagerBind);
      }

      /**
       * Appends prev / next controls to the controls element
       */
      var appendControls = function () {
         slider.controls.next = $('<a class="bx-next" href=""><i class="icon-angle-circled-right"></i></a>');
         slider.controls.prev = $('<a class="bx-prev" href=""><i class="icon-angle-circled-left"></i></a>');
         // bind click actions to the controls
         slider.controls.next.bind('click', clickNextBind);
         slider.controls.prev.bind('click', clickPrevBind);
         // if nextSlector was supplied, populate it
         if (slider.settings.nextSelector) {
            $(slider.settings.nextSelector).append(slider.controls.next);
         }
         // if prevSlector was supplied, populate it
         if (slider.settings.prevSelector) {
            $(slider.settings.prevSelector).append(slider.controls.prev);
         }
         // if no custom selectors were supplied
         if (!slider.settings.nextSelector && !slider.settings.prevSelector) {
            // add the controls to the DOM
            slider.controls.directionEl = $('<div class="bx-controls-direction" />');
            // add the control elements to the directionEl
            slider.controls.directionEl.append(slider.controls.prev).append(slider.controls.next);
            // slider.viewport.append(slider.controls.directionEl);
            slider.controls.el.addClass('bx-has-controls-direction').append(slider.controls.directionEl);
         }
      }

      /**
       * Appends start / stop auto controls to the controls element
       */
      var appendControlsAuto = function () {
         slider.controls.start = $('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + slider.settings.startText + '</a></div>');
         slider.controls.stop = $('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + slider.settings.stopText + '</a></div>');
         // add the controls to the DOM
         slider.controls.autoEl = $('<div class="bx-controls-auto" />');
         // bind click actions to the controls
         slider.controls.autoEl.delegate('.bx-start', 'click', clickStartBind);
         slider.controls.autoEl.delegate('.bx-stop', 'click', clickStopBind);
         // if autoControlsCombine, insert only the "start" control
         if (slider.settings.autoControlsCombine) {
            slider.controls.autoEl.append(slider.controls.start);
            // if autoControlsCombine is false, insert both controls
         } else {
            slider.controls.autoEl.append(slider.controls.start).append(slider.controls.stop);
         }
         // if auto controls selector was supplied, populate it with the controls
         if (slider.settings.autoControlsSelector) {
            $(slider.settings.autoControlsSelector).html(slider.controls.autoEl);
            // if auto controls selector was not supplied, add it after the wrapper
         } else {
            slider.controls.el.addClass('bx-has-controls-auto').append(slider.controls.autoEl);
         }
         // update the auto controls
         updateAutoControls(slider.settings.autoStart ? 'stop' : 'start');
      }

      /**
       * Appends image captions to the DOM
       */
      var appendCaptions = function () {
         // cycle through each child
         slider.children.each(function (index) {
            // get the image title attribute
            var title = $(this).find('img:first').attr('title');
            // append the caption
            if (title != undefined) $(this).append('<div class="bx-caption"><span>' + title + '</span></div>');
         });
      }

      /**
       * Click next binding
       *
       * @param e (event) 
       *  - DOM event object
       */
      var clickNextBind = function (e) {
         // if auto show is running, stop it
         if (slider.settings.auto) el.stopAuto();
         el.goToNextSlide();
         e.preventDefault();
      }

      /**
       * Click prev binding
       *
       * @param e (event) 
       *  - DOM event object
       */
      var clickPrevBind = function (e) {
         // if auto show is running, stop it
         if (slider.settings.auto) el.stopAuto();
         el.goToPrevSlide();
         e.preventDefault();
      }

      /**
       * Click start binding
       *
       * @param e (event) 
       *  - DOM event object
       */
      var clickStartBind = function (e) {
         el.startAuto();
         e.preventDefault();
      }

      /**
       * Click stop binding
       *
       * @param e (event) 
       *  - DOM event object
       */
      var clickStopBind = function (e) {
         el.stopAuto();
         e.preventDefault();
      }

      /**
       * Click pager binding
       *
       * @param e (event) 
       *  - DOM event object
       */
      var clickPagerBind = function (e) {
         // if auto show is running, stop it
         if (slider.settings.auto) el.stopAuto();
         var pagerLink = $(e.currentTarget);
         var pagerIndex = parseInt(pagerLink.attr('data-slide-index'));
         // if clicked pager link is not active, continue with the goToSlide call
         if (pagerIndex != slider.active.index) el.goToSlide(pagerIndex);
         e.preventDefault();
      }

      /**
       * Updates the pager links with an active class
       *
       * @param slideIndex (int) 
       *  - index of slide to make active
       */
      var updatePagerActive = function (slideIndex) {
         // if "short" pager type
         if (slider.settings.pagerType == 'short') {
            slider.pagerEl.html((slideIndex + 1) + slider.settings.pagerShortSeparator + slider.children.length);
            return;
         }
         // remove all pager active classes
         slider.pagerEl.find('a').removeClass('active');
         // apply the active class for all pagers
         slider.pagerEl.each(function (i, el) { $(el).find('a').eq(slideIndex).addClass('active'); });
      }

      /**
       * Performs needed actions after a slide transition
       */
      var updateAfterSlideTransition = function () {
         // if infinte loop is true
         if (slider.settings.infiniteLoop) {
            var position = '';
            // first slide
            if (slider.active.index == 0) {
               // set the new position
               position = slider.children.eq(0).position();
               // carousel, last slide
            } else if (slider.active.index == getPagerQty() - 1 && slider.carousel) {
               position = slider.children.eq((getPagerQty() - 1) * getMoveBy()).position();
               // last slide
            } else if (slider.active.index == slider.children.length - 1) {
               position = slider.children.eq(slider.children.length - 1).position();
            }
            if (slider.settings.mode == 'horizontal') { setPositionProperty(-position.left, 'reset', 0);; }
            else if (slider.settings.mode == 'vertical') { setPositionProperty(-position.top, 'reset', 0);; }
         }
         // declare that the transition is complete
         slider.working = false;
         // onSlideAfter callback
         slider.settings.onSlideAfter(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
      }

      /**
       * Updates the auto controls state (either active, or combined switch)
       *
       * @param state (string) "start", "stop"
       *  - the new state of the auto show
       */
      var updateAutoControls = function (state) {
         // if autoControlsCombine is true, replace the current control with the new state 
         if (slider.settings.autoControlsCombine) {
            slider.controls.autoEl.html(slider.controls[state]);
            // if autoControlsCombine is false, apply the "active" class to the appropriate control 
         } else {
            slider.controls.autoEl.find('a').removeClass('active');
            slider.controls.autoEl.find('a:not(.bx-' + state + ')').addClass('active');
         }
      }

      /**
       * Updates the direction controls (checks if either should be hidden)
       */
      var updateDirectionControls = function () {
         if (getPagerQty() == 1) {
            slider.controls.prev.addClass('disabled');
            slider.controls.next.addClass('disabled');
            touchEnabled: false;
         } else if (!slider.settings.infiniteLoop && slider.settings.hideControlOnEnd) {
            // if first slide
            if (slider.active.index == 0) {
               slider.controls.prev.addClass('disabled');
               slider.controls.next.removeClass('disabled');
               // if last slide
            } else if (slider.active.index == getPagerQty() - 1) {
               slider.controls.next.addClass('disabled');
               slider.controls.prev.removeClass('disabled');
               // if any slide in the middle
            } else {
               slider.controls.prev.removeClass('disabled');
               slider.controls.next.removeClass('disabled');
            }
         }
      }

      /**
       * Initialzes the auto process
       */
      var initAuto = function () {
         // if autoDelay was supplied, launch the auto show using a setTimeout() call
         if (slider.settings.autoDelay > 0) {
            var timeout = setTimeout(el.startAuto, slider.settings.autoDelay);
            // if autoDelay was not supplied, start the auto show normally
         } else {
            el.startAuto();
         }
         // if autoHover is requested
         if (slider.settings.autoHover) {
            // on el hover
            el.hover(function () {
               // if the auto show is currently playing (has an active interval)
               if (slider.interval) {
                  // stop the auto show and pass true agument which will prevent control update
                  el.stopAuto(true);
                  // create a new autoPaused value which will be used by the relative "mouseout" event
                  slider.autoPaused = true;
               }
            }, function () {
               // if the autoPaused value was created be the prior "mouseover" event
               if (slider.autoPaused) {
                  // start the auto show and pass true agument which will prevent control update
                  el.startAuto(true);
                  // reset the autoPaused value
                  slider.autoPaused = null;
               }
            });
         }
      }

      /**
       * Initialzes the ticker process
       */
      var initTicker = function () {
         var startPosition = 0;
         // if autoDirection is "next", append a clone of the entire slider
         if (slider.settings.autoDirection == 'next') {
            el.append(slider.children.clone().addClass('bx-clone'));
            // if autoDirection is "prev", prepend a clone of the entire slider, and set the left position
         } else {
            el.prepend(slider.children.clone().addClass('bx-clone'));
            var position = slider.children.first().position();
            startPosition = slider.settings.mode == 'horizontal' ? -position.left : -position.top;
         }
         setPositionProperty(startPosition, 'reset', 0);
         // do not allow controls in ticker mode
         slider.settings.pager = false;
         slider.settings.controls = false;
         slider.settings.autoControls = false;
         // if autoHover is requested
         if (slider.settings.tickerHover && !slider.usingCSS) {
            // on el hover
            slider.viewport.hover(function () {
               el.stop();
            }, function () {
               // calculate the total width of children (used to calculate the speed ratio)
               var totalDimens = 0;
               slider.children.each(function (index) {
                  totalDimens += slider.settings.mode == 'horizontal' ? $(this).outerWidth(true) : $(this).outerHeight(true);
               });
               // calculate the speed ratio (used to determine the new speed to finish the paused animation)
               var ratio = slider.settings.speed / totalDimens;
               // determine which property to use
               var property = slider.settings.mode == 'horizontal' ? 'left' : 'top';
               // calculate the new speed
               var newSpeed = ratio * (totalDimens - (Math.abs(parseInt(el.css(property)))));
               tickerLoop(newSpeed);
            });
         }
         // start the ticker loop
         tickerLoop();
      }

      /**
       * Runs a continuous loop, news ticker-style
       */
      var tickerLoop = function (resumeSpeed) {
         speed = resumeSpeed ? resumeSpeed : slider.settings.speed;
         var position = { left: 0, top: 0 };
         var reset = { left: 0, top: 0 };
         // if "next" animate left position to last child, then reset left to 0
         if (slider.settings.autoDirection == 'next') {
            position = el.find('.bx-clone').first().position();
            // if "prev" animate left position to 0, then reset left to first non-clone child
         } else {
            reset = slider.children.first().position();
         }
         var animateProperty = slider.settings.mode == 'horizontal' ? -position.left : -position.top;
         var resetValue = slider.settings.mode == 'horizontal' ? -reset.left : -reset.top;
         var params = { resetValue: resetValue };
         setPositionProperty(animateProperty, 'ticker', speed, params);
      }

      /**
       * Initializes touch events
       */
      var initTouch = function () {
         // initialize object to contain all touch values
         slider.touch = {
            start: { x: 0, y: 0 },
            end: { x: 0, y: 0 }
         }
         slider.viewport.bind('touchstart', onTouchStart);
      }

      /**
       * Event handler for "touchstart"
       *
       * @param e (event) 
       *  - DOM event object
       */
      var onTouchStart = function (e) {
         if (slider.working) {
            e.preventDefault();
         } else {
            // record the original position when touch starts
            slider.touch.originalPos = el.position();
            var orig = e.originalEvent;
            // record the starting touch x, y coordinates
            slider.touch.start.x = orig.changedTouches[0].pageX;
            slider.touch.start.y = orig.changedTouches[0].pageY;
            // bind a "touchmove" event to the viewport
            slider.viewport.bind('touchmove', onTouchMove);
            // bind a "touchend" event to the viewport
            slider.viewport.bind('touchend', onTouchEnd);
         }
      }

      /**
       * Event handler for "touchmove"
       *
       * @param e (event) 
       *  - DOM event object
       */
      var onTouchMove = function (e) {
         var orig = e.originalEvent;
         // if scrolling on y axis, do not prevent default
         var xMovement = Math.abs(orig.changedTouches[0].pageX - slider.touch.start.x);
         var yMovement = Math.abs(orig.changedTouches[0].pageY - slider.touch.start.y);
         // x axis swipe
         if ((xMovement * 3) > yMovement && slider.settings.preventDefaultSwipeX) {
            e.preventDefault();
            // y axis swipe
         } else if ((yMovement * 3) > xMovement && slider.settings.preventDefaultSwipeY) {
            e.preventDefault();
         }
         if (slider.settings.mode != 'fade' && slider.settings.oneToOneTouch) {
            var value = 0;
            // if horizontal, drag along x axis
            if (slider.settings.mode == 'horizontal') {
               var change = orig.changedTouches[0].pageX - slider.touch.start.x;
               value = slider.touch.originalPos.left + change;
               // if vertical, drag along y axis
            } else {
               var change = orig.changedTouches[0].pageY - slider.touch.start.y;
               value = slider.touch.originalPos.top + change;
            }
            setPositionProperty(value, 'reset', 0);
         }
      }

      /**
       * Event handler for "touchend"
       *
       * @param e (event) 
       *  - DOM event object
       */
      var onTouchEnd = function (e) {
         slider.viewport.unbind('touchmove', onTouchMove);
         var orig = e.originalEvent;
         var value = 0;
         // record end x, y positions
         slider.touch.end.x = orig.changedTouches[0].pageX;
         slider.touch.end.y = orig.changedTouches[0].pageY;
         // if fade mode, check if absolute x distance clears the threshold
         if (slider.settings.mode == 'fade') {
            var distance = Math.abs(slider.touch.start.x - slider.touch.end.x);
            if (distance >= slider.settings.swipeThreshold) {
               slider.touch.start.x > slider.touch.end.x ? el.goToNextSlide() : el.goToPrevSlide();
               el.stopAuto();
            }
            // not fade mode
         } else {
            var distance = 0;
            // calculate distance and el's animate property
            if (slider.settings.mode == 'horizontal') {
               distance = slider.touch.end.x - slider.touch.start.x;
               value = slider.touch.originalPos.left;
            } else {
               distance = slider.touch.end.y - slider.touch.start.y;
               value = slider.touch.originalPos.top;
            }
            // if not infinite loop and first / last slide, do not attempt a slide transition
            if (!slider.settings.infiniteLoop && ((slider.active.index == 0 && distance > 0) || (slider.active.last && distance < 0))) {
               setPositionProperty(value, 'reset', 200);
            } else {
               // check if distance clears threshold
               if (Math.abs(distance) >= slider.settings.swipeThreshold) {
                  distance < 0 ? el.goToNextSlide() : el.goToPrevSlide();
                  el.stopAuto();
               } else {
                  // el.animate(property, 200);
                  setPositionProperty(value, 'reset', 200);
               }
            }
         }
         slider.viewport.unbind('touchend', onTouchEnd);
      }

      /**
       * Window resize event callback
       */
      var resizeWindow = function (e) {
         // get the new window dimens (again, thank you IE)
         var windowWidthNew = $(window).width();
         var windowHeightNew = $(window).height();
         // make sure that it is a true window resize
         // *we must check this because our dinosaur friend IE fires a window resize event when certain DOM elements
         // are resized. Can you just die already?*
         if (windowWidth != windowWidthNew || windowHeight != windowHeightNew) {
            // set the new window dimens
            windowWidth = windowWidthNew;
            windowHeight = windowHeightNew;
            // update all dynamic elements
            el.redrawSlider();
         }
      }

      /**
       * ===================================================================================
       * = PUBLIC FUNCTIONS
       * ===================================================================================
       */

      /**
       * Performs slide transition to the specified slide
       *
       * @param slideIndex (int) 
       *  - the destination slide's index (zero-based)
       *
       * @param direction (string) 
       *  - INTERNAL USE ONLY - the direction of travel ("prev" / "next")
       */
      el.goToSlide = function (slideIndex, direction) {
         // if plugin is currently in motion, ignore request
         if (slider.working || slider.active.index == slideIndex) return;
         // declare that plugin is in motion
         slider.working = true;
         // store the old index
         slider.oldIndex = slider.active.index;
         // if slideIndex is less than zero, set active index to last child (this happens during infinite loop)
         if (slideIndex < 0) {
            slider.active.index = getPagerQty() - 1;
            // if slideIndex is greater than children length, set active index to 0 (this happens during infinite loop)
         } else if (slideIndex >= getPagerQty()) {
            slider.active.index = 0;
            // set active index to requested slide
         } else {
            slider.active.index = slideIndex;
         }
         // onSlideBefore, onSlideNext, onSlidePrev callbacks
         slider.settings.onSlideBefore(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
         if (direction == 'next') {
            slider.settings.onSlideNext(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
         } else if (direction == 'prev') {
            slider.settings.onSlidePrev(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
         }
         // check if last slide
         slider.active.last = slider.active.index >= getPagerQty() - 1;
         // update the pager with active class
         if (slider.settings.pager) updatePagerActive(slider.active.index);
         // // check for direction control update
         if (slider.settings.controls) updateDirectionControls();
         // if slider is set to mode: "fade"
         if (slider.settings.mode == 'fade') {
            // if adaptiveHeight is true and next height is different from current height, animate to the new height
            if (slider.settings.adaptiveHeight && slider.viewport.height() != getViewportHeight()) {
               slider.viewport.animate({ height: getViewportHeight() }, slider.settings.adaptiveHeightSpeed);
            }
            // fade out the visible child and reset its z-index value
            slider.children.filter(':visible').fadeOut(slider.settings.speed).css({ zIndex: 0 });
            // fade in the newly requested slide
            slider.children.eq(slider.active.index).css('zIndex', 51).fadeIn(slider.settings.speed, function () {
               $(this).css('zIndex', 50);
               updateAfterSlideTransition();
            });
            // slider mode is not "fade"
         } else {
            // if adaptiveHeight is true and next height is different from current height, animate to the new height
            if (slider.settings.adaptiveHeight && slider.viewport.height() != getViewportHeight()) {
               slider.viewport.animate({ height: getViewportHeight() }, slider.settings.adaptiveHeightSpeed);
            }
            var moveBy = 0;
            var position = { left: 0, top: 0 };
            // if carousel and not infinite loop
            if (!slider.settings.infiniteLoop && slider.carousel && slider.active.last) {
               if (slider.settings.mode == 'horizontal') {
                  // get the last child position
                  var lastChild = slider.children.eq(slider.children.length - 1);
                  position = lastChild.position();
                  // calculate the position of the last slide
                  moveBy = slider.viewport.width() - lastChild.width();
               } else {
                  // get last showing index position
                  var lastShowingIndex = slider.children.length - slider.settings.minSlides;
                  position = slider.children.eq(lastShowingIndex).position();
               }
               // horizontal carousel, going previous while on first slide (infiniteLoop mode)
            } else if (slider.carousel && slider.active.last && direction == 'prev') {
               // get the last child position
               var eq = slider.settings.moveSlides == 1 ? slider.settings.maxSlides - getMoveBy() : ((getPagerQty() - 1) * getMoveBy()) - (slider.children.length - slider.settings.maxSlides);
               var lastChild = el.children('.bx-clone').eq(eq);
               position = lastChild.position();
               // if infinite loop and "Next" is clicked on the last slide
            } else if (direction == 'next' && slider.active.index == 0) {
               // get the last clone position
               position = el.find('> .bx-clone').eq(slider.settings.maxSlides).position();
               slider.active.last = false;
               // normal non-zero requests
            } else if (slideIndex >= 0) {
               var requestEl = slideIndex * getMoveBy();
               position = slider.children.eq(requestEl).position();
            }

            /* If the position doesn't exist 
             * (e.g. if you destroy the slider on a next click),
             * it doesn't throw an error.
             */
            if ("undefined" !== typeof (position)) {
               var value = slider.settings.mode == 'horizontal' ? -(position.left - moveBy) : -position.top;
               // plugin values to be animated
               setPositionProperty(value, 'slide', slider.settings.speed);
            }
         }
      }

      /**
       * Transitions to the next slide in the show
       */
      el.goToNextSlide = function () {
         // if infiniteLoop is false and last page is showing, disregard call
         if (!slider.settings.infiniteLoop && slider.active.last) return;
         var pagerIndex = parseInt(slider.active.index) + 1;
         el.goToSlide(pagerIndex, 'next');
      }

      /**
       * Transitions to the prev slide in the show
       */
      el.goToPrevSlide = function () {
         // if infiniteLoop is false and last page is showing, disregard call
         if (!slider.settings.infiniteLoop && slider.active.index == 0) return;
         var pagerIndex = parseInt(slider.active.index) - 1;
         el.goToSlide(pagerIndex, 'prev');
      }

      /**
       * Starts the auto show
       *
       * @param preventControlUpdate (boolean) 
       *  - if true, auto controls state will not be updated
       */
      el.startAuto = function (preventControlUpdate) {
         // if an interval already exists, disregard call
         if (slider.interval) return;
         // create an interval
         slider.interval = setInterval(function () {
            slider.settings.autoDirection == 'next' ? el.goToNextSlide() : el.goToPrevSlide();
         }, slider.settings.pause);
         // if auto controls are displayed and preventControlUpdate is not true
         if (slider.settings.autoControls && preventControlUpdate != true) updateAutoControls('stop');
      }

      /**
       * Stops the auto show
       *
       * @param preventControlUpdate (boolean) 
       *  - if true, auto controls state will not be updated
       */
      el.stopAuto = function (preventControlUpdate) {
         // if no interval exists, disregard call
         if (!slider.interval) return;
         // clear the interval
         clearInterval(slider.interval);
         slider.interval = null;
         // if auto controls are displayed and preventControlUpdate is not true
         if (slider.settings.autoControls && preventControlUpdate != true) updateAutoControls('start');
      }

      /**
       * Returns current slide index (zero-based)
       */
      el.getCurrentSlide = function () {
         return slider.active.index;
      }

      /**
       * Returns number of slides in show
       */
      el.getSlideCount = function () {
         return slider.children.length;
      }

      /**
       * Update all dynamic slider elements
       */
      el.redrawSlider = function () {
         // resize all children in ratio to new screen size
         slider.children.add(el.find('.bx-clone')).width(getSlideWidth());
         // adjust the height
         slider.viewport.css('height', getViewportHeight());
         // update the slide position
         if (!slider.settings.ticker) setSlidePosition();
         // if active.last was true before the screen resize, we want
         // to keep it last no matter what screen size we end on
         if (slider.active.last) slider.active.index = getPagerQty() - 1;
         // if the active index (page) no longer exists due to the resize, simply set the index as last
         if (slider.active.index >= getPagerQty()) slider.active.last = true;
         // if a pager is being displayed and a custom pager is not being used, update it
         if (slider.settings.pager && !slider.settings.pagerCustom) {
            populatePager();
            updatePagerActive(slider.active.index);
         }
      }

      /**
       * Destroy the current instance of the slider (revert everything back to original state)
       */
      el.destroySlider = function () {
         // don't do anything if slider has already been destroyed
         if (!slider.initialized) return;
         slider.initialized = false;
         $('.bx-clone', this).remove();
         slider.children.removeAttr('style');
         this.removeAttr('style').unwrap().unwrap();
         if (slider.controls.el) slider.controls.el.remove();
         if (slider.controls.next) slider.controls.next.remove();
         if (slider.controls.prev) slider.controls.prev.remove();
         if (slider.pagerEl) slider.pagerEl.remove();
         $('.bx-caption', this).remove();
         if (slider.controls.autoEl) slider.controls.autoEl.remove();
         clearInterval(slider.interval);
         $(window).unbind('resize', resizeWindow);
      }

      /**
       * Reload the slider (revert all DOM changes, and re-initialize)
       */
      el.reloadSlider = function (settings) {
         if (settings != undefined) options = settings;
         el.destroySlider();
         init();
      }

      init();

      // returns the current jQuery object
      return this;
   }

})(jQuery);

/*!
 * jQuery imagesLoaded plugin v2.1.0
 * http://github.com/desandro/imagesloaded
 *
 * MIT License. by Paul Irish et al.
 */

/*jshint curly: true, eqeqeq: true, noempty: true, strict: true, undef: true, browser: true */
/*global jQuery: false */

(function (c, n) {
   var l = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="; c.fn.imagesLoaded = function (f) {
      function m() { var b = c(i), a = c(h); d && (h.length ? d.reject(e, b, a) : d.resolve(e)); c.isFunction(f) && f.call(g, e, b, a) } function j(b, a) { b.src === l || -1 !== c.inArray(b, k) || (k.push(b), a ? h.push(b) : i.push(b), c.data(b, "imagesLoaded", { isBroken: a, src: b.src }), o && d.notifyWith(c(b), [a, e, c(i), c(h)]), e.length === k.length && (setTimeout(m), e.unbind(".imagesLoaded"))) } var g = this, d = c.isFunction(c.Deferred) ? c.Deferred() :
         0, o = c.isFunction(d.notify), e = g.find("img").add(g.filter("img")), k = [], i = [], h = []; c.isPlainObject(f) && c.each(f, function (b, a) { if ("callback" === b) f = a; else if (d) d[b](a) }); e.length ? e.bind("load.imagesLoaded error.imagesLoaded", function (b) { j(b.target, "error" === b.type) }).each(function (b, a) { var d = a.src, e = c.data(a, "imagesLoaded"); if (e && e.src === d) j(a, e.isBroken); else if (a.complete && a.naturalWidth !== n) j(a, 0 === a.naturalWidth || 0 === a.naturalHeight); else if (a.readyState || a.complete) a.src = l, a.src = d }) : m(); return d ? d.promise(g) :
            g
   }
})(jQuery);

/*
 * FancyBox - jQuery Plugin
 * Simple and fancy lightbox alternative
 *
 * Examples and documentation at: http://fancybox.net
 * 
 * Copyright (c) 2008 - 2010 Janis Skarnelis
 * That said, it is hardly a one-person project. Many people have submitted bugs, code, and offered their advice freely. Their support is greatly appreciated.
 * 
 * Version: 1.3.4 (11/11/2010)
 * Requires: jQuery v1.3+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

; (function (b) {
   var m, t, u, f, D, j, E, n, z, A, q = 0, e = {}, o = [], p = 0, d = {}, l = [], G = null, v = new Image, J = /\.(jpg|gif|png|bmp|jpeg)(.*)?$/i, W = /[^\.]\.(swf)\s*$/i, K, L = 1, y = 0, s = "", r, i, h = false, B = b.extend(b("<div/>")[0], { prop: 0 }), M = b.browser.msie && b.browser.version < 7 && !window.XMLHttpRequest, N = function () { t.hide(); v.onerror = v.onload = null; G && G.abort(); m.empty() }, O = function () {
      if (false === e.onError(o, q, e)) { t.hide(); h = false } else {
         e.titleShow = false; e.width = "auto"; e.height = "auto"; m.html('<p id="fancybox-error">The requested content cannot be loaded.<br />Please try again later.</p>');
         F()
      }
   }, I = function () {
      var a = o[q], c, g, k, C, P, w; N(); e = b.extend({}, b.fn.fancybox.defaults, typeof b(a).data("fancybox") == "undefined" ? e : b(a).data("fancybox")); w = e.onStart(o, q, e); if (w === false) h = false; else {
         if (typeof w == "object") e = b.extend(e, w); k = e.title || (a.nodeName ? b(a).attr("title") : a.title) || ""; if (a.nodeName && !e.orig) e.orig = b(a).children("img:first").length ? b(a).children("img:first") : b(a); if (k === "" && e.orig && e.titleFromAlt) k = e.orig.attr("alt"); c = e.href || (a.nodeName ? b(a).attr("href") : a.href) || null; if (/^(?:javascript)/i.test(c) ||
            c == "#") c = null; if (e.type) { g = e.type; if (!c) c = e.content } else if (e.content) g = "html"; else if (c) g = c.match(J) ? "image" : c.match(W) ? "swf" : b(a).hasClass("iframe") ? "iframe" : c.indexOf("#") === 0 ? "inline" : "ajax"; if (g) {
               if (g == "inline") { a = c.substr(c.indexOf("#")); g = b(a).length > 0 ? "inline" : "ajax" } e.type = g; e.href = c; e.title = k; if (e.autoDimensions) if (e.type == "html" || e.type == "inline" || e.type == "ajax") { e.width = "auto"; e.height = "auto" } else e.autoDimensions = false; if (e.modal) {
                  e.overlayShow = true; e.hideOnOverlayClick = false; e.hideOnContentClick =
                     false; e.enableEscapeButton = false; e.showCloseButton = false
               } e.padding = parseInt(e.padding, 10); e.margin = parseInt(e.margin, 10); m.css("padding", e.padding + e.margin); b(".fancybox-inline-tmp").unbind("fancybox-cancel").bind("fancybox-change", function () { b(this).replaceWith(j.children()) }); switch (g) {
                  case "html": m.html(e.content); F(); break; case "inline": if (b(a).parent().is("#fancybox-content") === true) { h = false; break } b('<div class="fancybox-inline-tmp" />').hide().insertBefore(b(a)).bind("fancybox-cleanup", function () { b(this).replaceWith(j.children()) }).bind("fancybox-cancel",
                     function () { b(this).replaceWith(m.children()) }); b(a).appendTo(m); F(); break; case "image": h = false; b.fancybox.showActivity(); v = new Image; v.onerror = function () { O() }; v.onload = function () { h = true; v.onerror = v.onload = null; e.width = v.width; e.height = v.height; b("<img />").attr({ id: "fancybox-img", src: v.src, alt: e.title }).appendTo(m); Q() }; v.src = c; break; case "swf": e.scrolling = "no"; C = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + e.width + '" height="' + e.height + '"><param name="movie" value="' + c +
                        '"></param>'; P = ""; b.each(e.swf, function (x, H) { C += '<param name="' + x + '" value="' + H + '"></param>'; P += " " + x + '="' + H + '"' }); C += '<embed src="' + c + '" type="application/x-shockwave-flash" width="' + e.width + '" height="' + e.height + '"' + P + "></embed></object>"; m.html(C); F(); break; case "ajax": h = false; b.fancybox.showActivity(); e.ajax.win = e.ajax.success; G = b.ajax(b.extend({}, e.ajax, {
                           url: c, data: e.ajax.data || {}, error: function (x) { x.status > 0 && O() }, success: function (x, H, R) {
                              if ((typeof R == "object" ? R : G).status == 200) {
                                 if (typeof e.ajax.win ==
                                    "function") { w = e.ajax.win(c, x, H, R); if (w === false) { t.hide(); return } else if (typeof w == "string" || typeof w == "object") x = w } m.html(x); F()
                              }
                           }
                        })); break; case "iframe": Q()
               }
            } else O()
      }
   }, F = function () {
      var a = e.width, c = e.height; a = a.toString().indexOf("%") > -1 ? parseInt((b(window).width() - e.margin * 2) * parseFloat(a) / 100, 10) + "px" : a == "auto" ? "auto" : a + "px"; c = c.toString().indexOf("%") > -1 ? parseInt((b(window).height() - e.margin * 2) * parseFloat(c) / 100, 10) + "px" : c == "auto" ? "auto" : c + "px"; m.wrapInner('<div style="width:' + a + ";height:" + c +
         ";overflow: " + (e.scrolling == "auto" ? "auto" : e.scrolling == "yes" ? "scroll" : "hidden") + ';position:relative;"></div>'); e.width = m.width(); e.height = m.height(); Q()
   }, Q = function () {
      var a, c; t.hide(); if (f.is(":visible") && false === d.onCleanup(l, p, d)) { b.event.trigger("fancybox-cancel"); h = false } else {
         h = true; b(j.add(u)).unbind(); b(window).unbind("resize.fb scroll.fb"); b(document).unbind("keydown.fb"); f.is(":visible") && d.titlePosition !== "outside" && f.css("height", f.height()); l = o; p = q; d = e; if (d.overlayShow) {
            u.css({
               "background-color": d.overlayColor,
               opacity: d.overlayOpacity, cursor: d.hideOnOverlayClick ? "pointer" : "auto", height: b(document).height()
            }); if (!u.is(":visible")) { M && b("select:not(#fancybox-tmp select)").filter(function () { return this.style.visibility !== "hidden" }).css({ visibility: "hidden" }).one("fancybox-cleanup", function () { this.style.visibility = "inherit" }); u.show() }
         } else u.hide(); i = X(); s = d.title || ""; y = 0; n.empty().removeAttr("style").removeClass(); if (d.titleShow !== false) {
            if (b.isFunction(d.titleFormat)) a = d.titleFormat(s, l, p, d); else a = s && s.length ?
               d.titlePosition == "float" ? '<table id="fancybox-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="fancybox-title-float-left"></td><td id="fancybox-title-float-main">' + s + '</td><td id="fancybox-title-float-right"></td></tr></table>' : '<div id="fancybox-title-' + d.titlePosition + '">' + s + "</div>" : false; s = a; if (!(!s || s === "")) {
                  n.addClass("fancybox-title-" + d.titlePosition).html(s).appendTo("body").show(); switch (d.titlePosition) {
                     case "inside": n.css({ width: i.width - d.padding * 2, marginLeft: d.padding, marginRight: d.padding });
                        y = n.outerHeight(true); n.appendTo(D); i.height += y; break; case "over": n.css({ marginLeft: d.padding, width: i.width - d.padding * 2, bottom: d.padding }).appendTo(D); break; case "float": n.css("left", parseInt((n.width() - i.width - 40) / 2, 10) * -1).appendTo(f); break; default: n.css({ width: i.width - d.padding * 2, paddingLeft: d.padding, paddingRight: d.padding }).appendTo(f)
                  }
               }
         } n.hide(); if (f.is(":visible")) {
            b(E.add(z).add(A)).hide(); a = f.position(); r = { top: a.top, left: a.left, width: f.width(), height: f.height() }; c = r.width == i.width && r.height ==
               i.height; j.fadeTo(d.changeFade, 0.3, function () { var g = function () { j.html(m.contents()).fadeTo(d.changeFade, 1, S) }; b.event.trigger("fancybox-change"); j.empty().removeAttr("filter").css({ "border-width": d.padding, width: i.width - d.padding * 2, height: e.autoDimensions ? "auto" : i.height - y - d.padding * 2 }); if (c) g(); else { B.prop = 0; b(B).animate({ prop: 1 }, { duration: d.changeSpeed, easing: d.easingChange, step: T, complete: g }) } })
         } else {
            f.removeAttr("style"); j.css("border-width", d.padding); if (d.transitionIn == "elastic") {
               r = V(); j.html(m.contents());
               f.show(); if (d.opacity) i.opacity = 0; B.prop = 0; b(B).animate({ prop: 1 }, { duration: d.speedIn, easing: d.easingIn, step: T, complete: S })
            } else { d.titlePosition == "inside" && y > 0 && n.show(); j.css({ width: i.width - d.padding * 2, height: e.autoDimensions ? "auto" : i.height - y - d.padding * 2 }).html(m.contents()); f.css(i).fadeIn(d.transitionIn == "none" ? 0 : d.speedIn, S) }
         }
      }
   }, Y = function () {
      if (d.enableEscapeButton || d.enableKeyboardNav) b(document).bind("keydown.fb", function (a) {
         if (a.keyCode == 27 && d.enableEscapeButton) { a.preventDefault(); b.fancybox.close() } else if ((a.keyCode ==
            37 || a.keyCode == 39) && d.enableKeyboardNav && a.target.tagName !== "INPUT" && a.target.tagName !== "TEXTAREA" && a.target.tagName !== "SELECT") { a.preventDefault(); b.fancybox[a.keyCode == 37 ? "prev" : "next"]() }
      }); if (d.showNavArrows) { if (d.cyclic && l.length > 1 || p !== 0) z.show(); if (d.cyclic && l.length > 1 || p != l.length - 1) A.show() } else { z.hide(); A.hide() }
   }, S = function () {
      if (!b.support.opacity) { j.get(0).style.removeAttribute("filter"); f.get(0).style.removeAttribute("filter") } e.autoDimensions && j.css("height", "auto"); f.css("height", "auto");
      s && s.length && n.show(); d.showCloseButton && E.show(); Y(); d.hideOnContentClick && j.bind("click", b.fancybox.close); d.hideOnOverlayClick && u.bind("click", b.fancybox.close); b(window).bind("resize.fb", b.fancybox.resize); d.centerOnScroll && b(window).bind("scroll.fb", b.fancybox.center); if (d.type == "iframe") b('<iframe id="fancybox-frame" name="fancybox-frame' + (new Date).getTime() + '" frameborder="0" hspace="0" ' + (b.browser.msie ? 'allowtransparency="true""' : "") + ' scrolling="' + e.scrolling + '" src="' + d.href + '"></iframe>').appendTo(j);
      f.show(); h = false; b.fancybox.center(); d.onComplete(l, p, d); var a, c; if (l.length - 1 > p) { a = l[p + 1].href; if (typeof a !== "undefined" && a.match(J)) { c = new Image; c.src = a } } if (p > 0) { a = l[p - 1].href; if (typeof a !== "undefined" && a.match(J)) { c = new Image; c.src = a } }
   }, T = function (a) {
      var c = { width: parseInt(r.width + (i.width - r.width) * a, 10), height: parseInt(r.height + (i.height - r.height) * a, 10), top: parseInt(r.top + (i.top - r.top) * a, 10), left: parseInt(r.left + (i.left - r.left) * a, 10) }; if (typeof i.opacity !== "undefined") c.opacity = a < 0.5 ? 0.5 : a; f.css(c);
      j.css({ width: c.width - d.padding * 2, height: c.height - y * a - d.padding * 2 })
   }, U = function () { return [b(window).width() - d.margin * 2, b(window).height() - d.margin * 2, b(document).scrollLeft() + d.margin, b(document).scrollTop() + d.margin] }, X = function () {
      var a = U(), c = {}, g = d.autoScale, k = d.padding * 2; c.width = d.width.toString().indexOf("%") > -1 ? parseInt(a[0] * parseFloat(d.width) / 100, 10) : d.width + k; c.height = d.height.toString().indexOf("%") > -1 ? parseInt(a[1] * parseFloat(d.height) / 100, 10) : d.height + k; if (g && (c.width > a[0] || c.height > a[1])) if (e.type ==
         "image" || e.type == "swf") { g = d.width / d.height; if (c.width > a[0]) { c.width = a[0]; c.height = parseInt((c.width - k) / g + k, 10) } if (c.height > a[1]) { c.height = a[1]; c.width = parseInt((c.height - k) * g + k, 10) } } else { c.width = Math.min(c.width, a[0]); c.height = Math.min(c.height, a[1]) } c.top = parseInt(Math.max(a[3] - 20, a[3] + (a[1] - c.height - 40) * 0.5), 10); c.left = parseInt(Math.max(a[2] - 20, a[2] + (a[0] - c.width - 40) * 0.5), 10); return c
   }, V = function () {
      var a = e.orig ? b(e.orig) : false, c = {}; if (a && a.length) {
         c = a.offset(); c.top += parseInt(a.css("paddingTop"),
            10) || 0; c.left += parseInt(a.css("paddingLeft"), 10) || 0; c.top += parseInt(a.css("border-top-width"), 10) || 0; c.left += parseInt(a.css("border-left-width"), 10) || 0; c.width = a.width(); c.height = a.height(); c = { width: c.width + d.padding * 2, height: c.height + d.padding * 2, top: c.top - d.padding - 20, left: c.left - d.padding - 20 }
      } else { a = U(); c = { width: d.padding * 2, height: d.padding * 2, top: parseInt(a[3] + a[1] * 0.5, 10), left: parseInt(a[2] + a[0] * 0.5, 10) } } return c
   }, Z = function () { if (t.is(":visible")) { b("div", t).css("top", L * -40 + "px"); L = (L + 1) % 12 } else clearInterval(K) };
   b.fn.fancybox = function (a) { if (!b(this).length) return this; b(this).data("fancybox", b.extend({}, a, b.metadata ? b(this).metadata() : {})).unbind("click.fb").bind("click.fb", function (c) { c.preventDefault(); if (!h) { h = true; b(this).blur(); o = []; q = 0; c = b(this).data("fancybox-group") || ""; if (!c || c == "" || c === "nofollow") o.push(this); else { o = b("a[data-fancybox-group=" + c + "], area[data-fancybox-group=" + c + "]"); q = o.index(this) } I() } }); return this }; b.fancybox = function (a, c) {
      var g; if (!h) {
         h = true; g = typeof c !== "undefined" ? c : {}; o = []; q = parseInt(g.index, 10) || 0; if (b.isArray(a)) {
            for (var k =
               0, C = a.length; k < C; k++)if (typeof a[k] == "object") b(a[k]).data("fancybox", b.extend({}, g, a[k])); else a[k] = b({}).data("fancybox", b.extend({ content: a[k] }, g)); o = jQuery.merge(o, a)
         } else { if (typeof a == "object") b(a).data("fancybox", b.extend({}, g, a)); else a = b({}).data("fancybox", b.extend({ content: a }, g)); o.push(a) } if (q > o.length || q < 0) q = 0; I()
      }
   }; b.fancybox.showActivity = function () { clearInterval(K); t.show(); K = setInterval(Z, 66) }; b.fancybox.hideActivity = function () { t.hide() }; b.fancybox.next = function () {
      return b.fancybox.pos(p +
         1)
   }; b.fancybox.prev = function () { return b.fancybox.pos(p - 1) }; b.fancybox.pos = function (a) { if (!h) { a = parseInt(a); o = l; if (a > -1 && a < l.length) { q = a; I() } else if (d.cyclic && l.length > 1) { q = a >= l.length ? 0 : l.length - 1; I() } } }; b.fancybox.cancel = function () { if (!h) { h = true; b.event.trigger("fancybox-cancel"); N(); e.onCancel(o, q, e); h = false } }; b.fancybox.close = function () {
      function a() { u.fadeOut("fast"); n.empty().hide(); f.hide(); b.event.trigger("fancybox-cleanup"); j.empty(); d.onClosed(l, p, d); l = e = []; p = q = 0; d = e = {}; h = false } if (!(h || f.is(":hidden"))) {
         h =
            true; if (d && false === d.onCleanup(l, p, d)) h = false; else {
               N(); b(E.add(z).add(A)).hide(); b(j.add(u)).unbind(); b(window).unbind("resize.fb scroll.fb"); b(document).unbind("keydown.fb"); j.find("iframe").attr("src", M && /^https/i.test(window.location.href || "") ? "javascript:void(false)" : "about:blank"); d.titlePosition !== "inside" && n.empty(); f.stop(); if (d.transitionOut == "elastic") {
                  r = V(); var c = f.position(); i = { top: c.top, left: c.left, width: f.width(), height: f.height() }; if (d.opacity) i.opacity = 1; n.empty().hide(); B.prop = 1;
                  b(B).animate({ prop: 0 }, { duration: d.speedOut, easing: d.easingOut, step: T, complete: a })
               } else f.fadeOut(d.transitionOut == "none" ? 0 : d.speedOut, a)
            }
      }
   }; b.fancybox.resize = function () { u.is(":visible") && u.css("height", b(document).height()); b.fancybox.center(true) }; b.fancybox.center = function (a) {
      var c, g; if (!h) {
         g = a === true ? 1 : 0; c = U(); !g && (f.width() > c[0] || f.height() > c[1]) || f.stop().animate({
            top: parseInt(Math.max(c[3] - 20, c[3] + (c[1] - j.height() - 40) * 0.5 - d.padding)), left: parseInt(Math.max(c[2] - 20, c[2] + (c[0] - j.width() - 40) * 0.5 -
               d.padding))
         }, typeof a == "number" ? a : 200)
      }
   }; b.fancybox.init = function () {
      if (!b("#fancybox-wrap").length) {
         b("body").append(m = b('<div id="fancybox-tmp"></div>'), t = b('<div id="fancybox-loading"><div></div></div>'), u = b('<div id="fancybox-overlay"></div>'), f = b('<div id="fancybox-wrap"></div>')); D = b('<div id="fancybox-outer"></div>').append('<div class="fancybox-bg" id="fancybox-bg-n"></div><div class="fancybox-bg" id="fancybox-bg-ne"></div><div class="fancybox-bg" id="fancybox-bg-e"></div><div class="fancybox-bg" id="fancybox-bg-se"></div><div class="fancybox-bg" id="fancybox-bg-s"></div><div class="fancybox-bg" id="fancybox-bg-sw"></div><div class="fancybox-bg" id="fancybox-bg-w"></div><div class="fancybox-bg" id="fancybox-bg-nw"></div>').appendTo(f);
         D.append(j = b('<div id="fancybox-content"></div>'), E = b('<a id="fancybox-close"></a>'), n = b('<div id="fancybox-title"></div>'), z = b('<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'), A = b('<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>')); E.click(b.fancybox.close); t.click(b.fancybox.cancel); z.click(function (a) { a.preventDefault(); b.fancybox.prev() }); A.click(function (a) { a.preventDefault(); b.fancybox.next() });
         b.fn.mousewheel && f.bind("mousewheel.fb", function (a, c) { if (h) a.preventDefault(); else if (b(a.target).get(0).clientHeight == 0 || b(a.target).get(0).scrollHeight === b(a.target).get(0).clientHeight) { a.preventDefault(); b.fancybox[c > 0 ? "prev" : "next"]() } }); b.support.opacity || f.addClass("fancybox-ie"); if (M) { t.addClass("fancybox-ie6"); f.addClass("fancybox-ie6"); b('<iframe id="fancybox-hide-sel-frame" src="' + (/^https/i.test(window.location.href || "") ? "javascript:void(false)" : "about:blank") + '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').prependTo(D) }
      }
   };
   b.fn.fancybox.defaults = {
      padding: 10, margin: 40, opacity: false, modal: false, cyclic: false, scrolling: "auto", width: 560, height: 340, autoScale: true, autoDimensions: true, centerOnScroll: false, ajax: {}, swf: { wmode: "transparent" }, hideOnOverlayClick: true, hideOnContentClick: false, overlayShow: true, overlayOpacity: 0.7, overlayColor: "#777", titleShow: true, titlePosition: "float", titleFormat: null, titleFromAlt: false, transitionIn: "fade", transitionOut: "fade", speedIn: 300, speedOut: 300, changeSpeed: 300, changeFade: "fast", easingIn: "swing",
      easingOut: "swing", showCloseButton: true, showNavArrows: true, enableEscapeButton: true, enableKeyboardNav: true, onStart: function () { }, onCancel: function () { }, onComplete: function () { }, onCleanup: function () { }, onClosed: function () { }, onError: function () { }
   }; b(document).ready(function () { b.fancybox.init() })
})(jQuery);
/*
   Masked Input plugin for jQuery
   Copyright (c) 2007-2011 Josh Bush (digitalbush.com)
   Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license) 
   Version: 1.3
*/
(function (a) { var b = (a.browser.msie ? "paste" : "input") + ".mask", c = window.orientation != undefined; a.mask = { definitions: { 9: "[0-9]", a: "[A-Za-z]", "*": "[A-Za-z0-9]" }, dataName: "rawMaskFn" }, a.fn.extend({ caret: function (a, b) { if (this.length != 0) { if (typeof a == "number") { b = typeof b == "number" ? b : a; return this.each(function () { if (this.setSelectionRange) this.setSelectionRange(a, b); else if (this.createTextRange) { var c = this.createTextRange(); c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", a), c.select() } }) } if (this[0].setSelectionRange) a = this[0].selectionStart, b = this[0].selectionEnd; else if (document.selection && document.selection.createRange) { var c = document.selection.createRange(); a = 0 - c.duplicate().moveStart("character", -1e5), b = a + c.text.length } return { begin: a, end: b } } }, unmask: function () { return this.trigger("unmask") }, mask: function (d, e) { if (!d && this.length > 0) { var f = a(this[0]); return f.data(a.mask.dataName)() } e = a.extend({ placeholder: "_", completed: null }, e); var g = a.mask.definitions, h = [], i = d.length, j = null, k = d.length; a.each(d.split(""), function (a, b) { b == "?" ? (k--, i = a) : g[b] ? (h.push(new RegExp(g[b])), j == null && (j = h.length - 1)) : h.push(null) }); return this.trigger("unmask").each(function () { function v(a) { var b = f.val(), c = -1; for (var d = 0, g = 0; d < k; d++)if (h[d]) { l[d] = e.placeholder; while (g++ < b.length) { var m = b.charAt(g - 1); if (h[d].test(m)) { l[d] = m, c = d; break } } if (g > b.length) break } else l[d] == b.charAt(g) && d != i && (g++, c = d); if (!a && c + 1 < i) f.val(""), t(0, k); else if (a || c + 1 >= i) u(), a || f.val(f.val().substring(0, c + 1)); return i ? d : j } function u() { return f.val(l.join("")).val() } function t(a, b) { for (var c = a; c < b && c < k; c++)h[c] && (l[c] = e.placeholder) } function s(a) { var b = a.which, c = f.caret(); if (a.ctrlKey || a.altKey || a.metaKey || b < 32) return !0; if (b) { c.end - c.begin != 0 && (t(c.begin, c.end), p(c.begin, c.end - 1)); var d = n(c.begin - 1); if (d < k) { var g = String.fromCharCode(b); if (h[d].test(g)) { q(d), l[d] = g, u(); var i = n(d); f.caret(i), e.completed && i >= k && e.completed.call(f) } } return !1 } } function r(a) { var b = a.which; if (b == 8 || b == 46 || c && b == 127) { var d = f.caret(), e = d.begin, g = d.end; g - e == 0 && (e = b != 46 ? o(e) : g = n(e - 1), g = b == 46 ? n(g) : g), t(e, g), p(e, g - 1); return !1 } if (b == 27) { f.val(m), f.caret(0, v()); return !1 } } function q(a) { for (var b = a, c = e.placeholder; b < k; b++)if (h[b]) { var d = n(b), f = l[b]; l[b] = c; if (d < k && h[d].test(f)) c = f; else break } } function p(a, b) { if (!(a < 0)) { for (var c = a, d = n(b); c < k; c++)if (h[c]) { if (d < k && h[c].test(l[d])) l[c] = l[d], l[d] = e.placeholder; else break; d = n(d) } u(), f.caret(Math.max(j, a)) } } function o(a) { while (--a >= 0 && !h[a]); return a } function n(a) { while (++a <= k && !h[a]); return a } var f = a(this), l = a.map(d.split(""), function (a, b) { if (a != "?") return g[a] ? e.placeholder : a }), m = f.val(); f.data(a.mask.dataName, function () { return a.map(l, function (a, b) { return h[b] && a != e.placeholder ? a : null }).join("") }), f.attr("readonly") || f.one("unmask", function () { f.unbind(".mask").removeData(a.mask.dataName) }).bind("focus.mask", function () { m = f.val(); var b = v(); u(); var c = function () { b == d.length ? f.caret(0, b) : f.caret(b) }; (a.browser.msie ? c : function () { setTimeout(c, 0) })() }).bind("blur.mask", function () { v(), f.val() != m && f.change() }).bind("keydown.mask", r).bind("keypress.mask", s).bind(b, function () { setTimeout(function () { f.caret(v(!0)) }, 0) }), v() }) } }) })(jQuery)
/*! lazysizes - v4.0.1 */
!function (a, b) { var c = b(a, a.document); a.lazySizes = c, "object" == typeof module && module.exports && (module.exports = c) }(window, function (a, b) { "use strict"; if (b.getElementsByClassName) { var c, d, e = b.documentElement, f = a.Date, g = a.HTMLPictureElement, h = "addEventListener", i = "getAttribute", j = a[h], k = a.setTimeout, l = a.requestAnimationFrame || k, m = a.requestIdleCallback, n = /^picture$/i, o = ["load", "error", "lazyincluded", "_lazyloaded"], p = {}, q = Array.prototype.forEach, r = function (a, b) { return p[b] || (p[b] = new RegExp("(\\s|^)" + b + "(\\s|$)")), p[b].test(a[i]("class") || "") && p[b] }, s = function (a, b) { r(a, b) || a.setAttribute("class", (a[i]("class") || "").trim() + " " + b) }, t = function (a, b) { var c; (c = r(a, b)) && a.setAttribute("class", (a[i]("class") || "").replace(c, " ")) }, u = function (a, b, c) { var d = c ? h : "removeEventListener"; c && u(a, b), o.forEach(function (c) { a[d](c, b) }) }, v = function (a, d, e, f, g) { var h = b.createEvent("CustomEvent"); return e || (e = {}), e.instance = c, h.initCustomEvent(d, !f, !g, e), a.dispatchEvent(h), h }, w = function (b, c) { var e; !g && (e = a.picturefill || d.pf) ? e({ reevaluate: !0, elements: [b] }) : c && c.src && (b.src = c.src) }, x = function (a, b) { return (getComputedStyle(a, null) || {})[b] }, y = function (a, b, c) { for (c = c || a.offsetWidth; c < d.minSize && b && !a._lazysizesWidth;)c = b.offsetWidth, b = b.parentNode; return c }, z = function () { var a, c, d = [], e = [], f = d, g = function () { var b = f; for (f = d.length ? e : d, a = !0, c = !1; b.length;)b.shift()(); a = !1 }, h = function (d, e) { a && !e ? d.apply(this, arguments) : (f.push(d), c || (c = !0, (b.hidden ? k : l)(g))) }; return h._lsFlush = g, h }(), A = function (a, b) { return b ? function () { z(a) } : function () { var b = this, c = arguments; z(function () { a.apply(b, c) }) } }, B = function (a) { var b, c = 0, e = 125, g = d.ricTimeout, h = function () { b = !1, c = f.now(), a() }, i = m && d.ricTimeout ? function () { m(h, { timeout: g }), g !== d.ricTimeout && (g = d.ricTimeout) } : A(function () { k(h) }, !0); return function (a) { var d; (a = a === !0) && (g = 33), b || (b = !0, d = e - (f.now() - c), 0 > d && (d = 0), a || 9 > d && m ? i() : k(i, d)) } }, C = function (a) { var b, c, d = 99, e = function () { b = null, a() }, g = function () { var a = f.now() - c; d > a ? k(g, d - a) : (m || e)(e) }; return function () { c = f.now(), b || (b = k(g, d)) } }; !function () { var b, c = { lazyClass: "lazyload", loadedClass: "lazyloaded", loadingClass: "lazyloading", preloadClass: "lazypreload", errorClass: "lazyerror", autosizesClass: "lazyautosizes", srcAttr: "data-src", srcsetAttr: "data-srcset", sizesAttr: "data-sizes", minSize: 40, customMedia: {}, init: !0, expFactor: 1.5, hFac: .8, loadMode: 1, loadHidden: !0, ricTimeout: 300 }; d = a.lazySizesConfig || a.lazysizesConfig || {}; for (b in c) b in d || (d[b] = c[b]); a.lazySizesConfig = d, k(function () { d.init && F() }) }(); var D = function () { var g, l, m, o, p, y, D, F, G, H, I, J, K, L, M = /^img$/i, N = /^iframe$/i, O = "onscroll" in a && !/glebot/.test(navigator.userAgent), P = 0, Q = 0, R = 0, S = -1, T = function (a) { R--, a && a.target && u(a.target, T), (!a || 0 > R || !a.target) && (R = 0) }, U = function (a, c) { var d, f = a, g = "hidden" == x(b.body, "visibility") || "hidden" != x(a, "visibility"); for (F -= c, I += c, G -= c, H += c; g && (f = f.offsetParent) && f != b.body && f != e;)g = (x(f, "opacity") || 1) > 0, g && "visible" != x(f, "overflow") && (d = f.getBoundingClientRect(), g = H > d.left && G < d.right && I > d.top - 1 && F < d.bottom + 1); return g }, V = function () { var a, f, h, j, k, m, n, p, q, r = c.elements; if ((o = d.loadMode) && 8 > R && (a = r.length)) { f = 0, S++, null == K && ("expand" in d || (d.expand = e.clientHeight > 500 && e.clientWidth > 500 ? 500 : 370), J = d.expand, K = J * d.expFactor), K > Q && 1 > R && S > 2 && o > 2 && !b.hidden ? (Q = K, S = 0) : Q = o > 1 && S > 1 && 6 > R ? J : P; for (; a > f; f++)if (r[f] && !r[f]._lazyRace) if (O) if ((p = r[f][i]("data-expand")) && (m = 1 * p) || (m = Q), q !== m && (y = innerWidth + m * L, D = innerHeight + m, n = -1 * m, q = m), h = r[f].getBoundingClientRect(), (I = h.bottom) >= n && (F = h.top) <= D && (H = h.right) >= n * L && (G = h.left) <= y && (I || H || G || F) && (d.loadHidden || "hidden" != x(r[f], "visibility")) && (l && 3 > R && !p && (3 > o || 4 > S) || U(r[f], m))) { if (ba(r[f]), k = !0, R > 9) break } else !k && l && !j && 4 > R && 4 > S && o > 2 && (g[0] || d.preloadAfterLoad) && (g[0] || !p && (I || H || G || F || "auto" != r[f][i](d.sizesAttr))) && (j = g[0] || r[f]); else ba(r[f]); j && !k && ba(j) } }, W = B(V), X = function (a) { s(a.target, d.loadedClass), t(a.target, d.loadingClass), u(a.target, Z), v(a.target, "lazyloaded") }, Y = A(X), Z = function (a) { Y({ target: a.target }) }, $ = function (a, b) { try { a.contentWindow.location.replace(b) } catch (c) { a.src = b } }, _ = function (a) { var b, c = a[i](d.srcsetAttr); (b = d.customMedia[a[i]("data-media") || a[i]("media")]) && a.setAttribute("media", b), c && a.setAttribute("srcset", c) }, aa = A(function (a, b, c, e, f) { var g, h, j, l, o, p; (o = v(a, "lazybeforeunveil", b)).defaultPrevented || (e && (c ? s(a, d.autosizesClass) : a.setAttribute("sizes", e)), h = a[i](d.srcsetAttr), g = a[i](d.srcAttr), f && (j = a.parentNode, l = j && n.test(j.nodeName || "")), p = b.firesLoad || "src" in a && (h || g || l), o = { target: a }, p && (u(a, T, !0), clearTimeout(m), m = k(T, 2500), s(a, d.loadingClass), u(a, Z, !0)), l && q.call(j.getElementsByTagName("source"), _), h ? a.setAttribute("srcset", h) : g && !l && (N.test(a.nodeName) ? $(a, g) : a.src = g), f && (h || l) && w(a, { src: g })), a._lazyRace && delete a._lazyRace, t(a, d.lazyClass), z(function () { (!p || a.complete && a.naturalWidth > 1) && (p ? T(o) : R--, X(o)) }, !0) }), ba = function (a) { var b, c = M.test(a.nodeName), e = c && (a[i](d.sizesAttr) || a[i]("sizes")), f = "auto" == e; (!f && l || !c || !a[i]("src") && !a.srcset || a.complete || r(a, d.errorClass) || !r(a, d.lazyClass)) && (b = v(a, "lazyunveilread").detail, f && E.updateElem(a, !0, a.offsetWidth), a._lazyRace = !0, R++, aa(a, b, f, e, c)) }, ca = function () { if (!l) { if (f.now() - p < 999) return void k(ca, 999); var a = C(function () { d.loadMode = 3, W() }); l = !0, d.loadMode = 3, W(), j("scroll", function () { 3 == d.loadMode && (d.loadMode = 2), a() }, !0) } }; return { _: function () { p = f.now(), c.elements = b.getElementsByClassName(d.lazyClass), g = b.getElementsByClassName(d.lazyClass + " " + d.preloadClass), L = d.hFac, j("scroll", W, !0), j("resize", W, !0), a.MutationObserver ? new MutationObserver(W).observe(e, { childList: !0, subtree: !0, attributes: !0 }) : (e[h]("DOMNodeInserted", W, !0), e[h]("DOMAttrModified", W, !0), setInterval(W, 999)), j("hashchange", W, !0), ["focus", "mouseover", "click", "load", "transitionend", "animationend", "webkitAnimationEnd"].forEach(function (a) { b[h](a, W, !0) }), /d$|^c/.test(b.readyState) ? ca() : (j("load", ca), b[h]("DOMContentLoaded", W), k(ca, 2e4)), c.elements.length ? (V(), z._lsFlush()) : W() }, checkElems: W, unveil: ba } }(), E = function () { var a, c = A(function (a, b, c, d) { var e, f, g; if (a._lazysizesWidth = d, d += "px", a.setAttribute("sizes", d), n.test(b.nodeName || "")) for (e = b.getElementsByTagName("source"), f = 0, g = e.length; g > f; f++)e[f].setAttribute("sizes", d); c.detail.dataAttr || w(a, c.detail) }), e = function (a, b, d) { var e, f = a.parentNode; f && (d = y(a, f, d), e = v(a, "lazybeforesizes", { width: d, dataAttr: !!b }), e.defaultPrevented || (d = e.detail.width, d && d !== a._lazysizesWidth && c(a, f, e, d))) }, f = function () { var b, c = a.length; if (c) for (b = 0; c > b; b++)e(a[b]) }, g = C(f); return { _: function () { a = b.getElementsByClassName(d.autosizesClass), j("resize", g) }, checkElems: g, updateElem: e } }(), F = function () { F.i || (F.i = !0, E._(), D._()) }; return c = { cfg: d, autoSizer: E, loader: D, init: F, uP: w, aC: s, rC: t, hC: r, fire: v, gW: y, rAF: z } } });
(function ($) {

   var reEscape = new RegExp('(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'].join('|\\') + ')', 'g');

   function fnFormatResult(value, data, currentValue) {
      var pattern = '(' + currentValue.replace(reEscape, '\\$1') + ')';
      return value.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
   }

   function Autocomplete(el, options) {
      this.el = $(el);
      this.el.attr('autocomplete', 'off');
      this.suggestions = [];
      this.data = [];
      this.badQueries = [];
      this.selectedIndex = -1;
      this.currentValue = this.el.val();
      this.intervalId = 0;
      this.cachedResponse = [];
      this.onChangeInterval = null;
      this.ignoreValueChange = false;
      this.serviceUrl = options.serviceUrl;
      this.isLocal = false;
      this.options = {
         autoSubmit: false,
         minChars: 1,
         maxHeight: 300,
         deferRequestBy: 0,
         width: 0,
         highlight: true,
         params: {},
         fnFormatResult: fnFormatResult,
         delimiter: null,
         zIndex: 9999
      };
      this.initialize();
      this.setOptions(options);
   }

   $.fn.autocomplete = function (options) {
      return new Autocomplete(this.get(0) || $('<input />'), options);
   };


   Autocomplete.prototype = {

      killerFn: null,

      initialize: function () {

         var me, uid, autocompleteElId;
         me = this;
         uid = Math.floor(Math.random() * 0x100000).toString(16);
         autocompleteElId = 'Autocomplete_' + uid;

         this.killerFn = function (e) {
            if ($(e.target).parents('.autocomplete').size() === 0) {
               me.killSuggestions();
               me.disableKillerFn();
            }
         };

         if (!this.options.width) { this.options.width = this.el.width(); }
         this.mainContainerId = 'AutocompleteContainter_' + uid;

         $('<div id="' + this.mainContainerId + '" style="position:absolute;z-index:9999;"><div class="autocomplete-w1"><div class="autocomplete" id="' + autocompleteElId + '" style="display:none; width:300px;"></div></div></div>').appendTo('body');

         this.container = $('#' + autocompleteElId);
         this.fixPosition();
         if (window.opera) {
            this.el.keypress(function (e) { me.onKeyPress(e); });
         } else {
            this.el.keydown(function (e) { me.onKeyPress(e); });
         }
         this.el.keyup(function (e) { me.onKeyUp(e); });
         this.el.blur(function () { me.enableKillerFn(); });
         this.el.focus(function () { me.fixPosition(); });
      },

      setOptions: function (options) {
         var o = this.options;
         $.extend(o, options);
         if (o.lookup) {
            this.isLocal = true;
            if ($.isArray(o.lookup)) { o.lookup = { suggestions: o.lookup, data: [] }; }
         }
         $('#' + this.mainContainerId).css({ zIndex: o.zIndex });
         this.container.css({ maxHeight: o.maxHeight + 'px', width: o.width });
      },

      clearCache: function () {
         this.cachedResponse = [];
         this.badQueries = [];
      },

      disable: function () {
         this.disabled = true;
      },

      enable: function () {
         this.disabled = false;
      },

      fixPosition: function () {
         var offset = this.el.offset();
         $('#' + this.mainContainerId).css({ top: (offset.top + this.el.innerHeight()) + 'px', left: offset.left + 'px' });
      },

      enableKillerFn: function () {
         var me = this;
         $(document).bind('click', me.killerFn);
      },

      disableKillerFn: function () {
         var me = this;
         $(document).unbind('click', me.killerFn);
      },

      killSuggestions: function () {
         var me = this;
         this.stopKillSuggestions();
         this.intervalId = window.setInterval(function () { me.hide(); me.stopKillSuggestions(); }, 300);
      },

      stopKillSuggestions: function () {
         window.clearInterval(this.intervalId);
      },

      onKeyPress: function (e) {
         if (this.disabled || !this.enabled) { return; }
         // return will exit the function
         // and event will not be prevented
         switch (e.keyCode) {
            case 27: //KEY_ESC:
               this.el.val(this.currentValue);
               this.hide();
               break;
            case 9: //KEY_TAB:
            case 13: //KEY_RETURN:
               if (this.selectedIndex === -1) {
                  this.hide();
                  return;
               }
               this.select(this.selectedIndex);
               if (e.keyCode === 9) { return; }
               break;
            case 38: //KEY_UP:
               this.moveUp();
               break;
            case 40: //KEY_DOWN:
               this.moveDown();
               break;
            default:
               return;
         }
         e.stopImmediatePropagation();
         e.preventDefault();
      },

      onKeyUp: function (e) {
         if (this.disabled) { return; }
         switch (e.keyCode) {
            case 38: //KEY_UP:
            case 40: //KEY_DOWN:
               return;
         }
         clearInterval(this.onChangeInterval);
         if (this.currentValue !== this.el.val()) {
            if (this.options.deferRequestBy > 0) {
               // Defer lookup in case when value changes very quickly:
               var me = this;
               this.onChangeInterval = setInterval(function () { me.onValueChange(); }, this.options.deferRequestBy);
            } else {
               this.onValueChange();
            }
         }
      },

      onValueChange: function () {
         clearInterval(this.onChangeInterval);
         this.currentValue = this.el.val();
         var q = this.getQuery(this.currentValue);
         this.selectedIndex = -1;
         if (this.ignoreValueChange) {
            this.ignoreValueChange = false;
            return;
         }
         if (q === '' || q.length < this.options.minChars) {
            this.hide();
         } else {
            $('#search').css('background', 'url(/catalog/view/image/loader.gif) no-repeat center');
            //        this.el.attr('disabled','disabled');
            this.getSuggestions(q);
            var mq = this;
            function wait() {
               $('#search').css('background', '');
               //           mq.el.removeAttr('disabled') 
            }
            setTimeout(wait, 500);
         }
      },

      getQuery: function (val) {
         var d, arr;
         d = this.options.delimiter;
         if (!d) { return $.trim(val); }
         arr = val.split(d);
         return $.trim(arr[arr.length - 1]);
      },

      getSuggestionsLocal: function (q) {
         var ret, arr, len, val, i;
         arr = this.options.lookup;
         len = arr.suggestions.length;
         ret = { suggestions: [], data: [] };
         q = q.toLowerCase();
         for (i = 0; i < len; i++) {
            val = arr.suggestions[i];
            if (val.toLowerCase().indexOf(q) === 0) {
               ret.suggestions.push(val);
               ret.data.push(arr.data[i]);
            }
         }
         return ret;
      },

      getSuggestions: function (q) {
         var cr, me;
         cr = this.isLocal ? this.getSuggestionsLocal(q) : this.cachedResponse[q];
         if (cr && $.isArray(cr.suggestions)) {
            this.suggestions = cr.suggestions;
            this.data = cr.data;
            this.suggest();
         } else if (!this.isBadQuery(q)) {
            me = this;
            me.options.params.query = q;
            $.get(this.serviceUrl, me.options.params, function (txt) { me.processResponse(txt); }, 'text');
         }
      },

      isBadQuery: function (q) {
         var i = this.badQueries.length;
         while (i--) {
            if (q.indexOf(this.badQueries[i]) === 0) { return true; }
         }
         return false;
      },

      hide: function () {
         this.enabled = false;
         this.selectedIndex = -1;
         this.container.hide();
      },

      suggest: function () {
         if (this.suggestions.length === 0) {
            this.hide();
            return;
         }

         var me, len, div, f, v, i, s, mOver, mClick;
         me = this;
         len = this.suggestions.length;
         f = this.options.fnFormatResult;
         v = this.getQuery(this.currentValue);
         mOver = function (xi) { return function () { me.activate(xi); }; };
         mClick = function (xi) { return function () { me.select(xi); }; };
         this.container.hide().empty();
         var img = '';
         for (i = 0; i < len; i++) {
            s = this.suggestions[i];

            if (this.data && this.data.length) {
               img = '<img src="' + this.data[i].thumb + '" />';
            }
            div = $((me.selectedIndex === i ? '<div class="selected"' : '<div') + ' style="overflow:auto;" title="' + s + '">' + img + f(s, this.data[i], v) + '</div>');
            div.mouseover(mOver(i));
            div.click(mClick(i));
            this.container.append(div);
         }
         this.container.append($('<div style="overflow:auto;text-align: center;"><a href="/search?q=' + v + '">посмотреть все результаты по запросу</a></div>'));
         this.enabled = true;
         this.container.show();
      },

      processResponse: function (text) {
         var response;
         try {
            response = eval('(' + text + ')');
         } catch (err) { return; }
         if (!$.isArray(response.data)) { response.data = []; }
         if (!this.options.noCache) {
            this.cachedResponse[response.query] = response;
            if (response.suggestions.length === 0) { this.badQueries.push(response.query); }
         }
         if (response.query === this.getQuery(this.currentValue)) {
            this.suggestions = response.suggestions;
            this.data = response.data;
            this.suggest();
         }
      },

      activate: function (index) {
         var divs, activeItem;
         divs = this.container.children();
         // Clear previous selection:
         if (this.selectedIndex !== -1 && divs.length > this.selectedIndex) {
            $(divs.get(this.selectedIndex)).removeClass();
         }
         this.selectedIndex = index;
         if (this.selectedIndex !== -1 && divs.length > this.selectedIndex) {
            activeItem = divs.get(this.selectedIndex);
            $(activeItem).addClass('selected');
         }
         return activeItem;
      },

      deactivate: function (div, index) {
         div.className = '';
         if (this.selectedIndex === index) { this.selectedIndex = -1; }
      },

      select: function (i) {
         var selectedValue, f;
         selectedValue = this.suggestions[i];
         if (selectedValue) {
            this.el.val(selectedValue);
            if (this.options.autoSubmit) {
               f = this.el.parents('form');
               if (f.length > 0) { f.get(0).submit(); }
            }
            this.ignoreValueChange = true;
            this.hide();
            this.onSelect(i);
         }
      },

      moveUp: function () {
         if (this.selectedIndex === -1) { return; }
         if (this.selectedIndex === 0) {
            this.container.children().get(0).className = '';
            this.selectedIndex = -1;
            this.el.val(this.currentValue);
            return;
         }
         this.adjustScroll(this.selectedIndex - 1);
      },

      moveDown: function () {
         if (this.selectedIndex === (this.suggestions.length - 1)) { return; }
         this.adjustScroll(this.selectedIndex + 1);
      },

      adjustScroll: function (i) {
         var activeItem, offsetTop, upperBound, lowerBound;
         activeItem = this.activate(i);
         offsetTop = activeItem.offsetTop;
         upperBound = this.container.scrollTop();
         lowerBound = upperBound + this.options.maxHeight - 25;
         if (offsetTop < upperBound) {
            this.container.scrollTop(offsetTop);
         } else if (offsetTop > lowerBound) {
            this.container.scrollTop(offsetTop - this.options.maxHeight + 25);
         }
         this.el.val(this.getValue(this.suggestions[i]));
      },

      onSelect: function (i) {
         var me, fn, s, d;
         me = this;
         fn = me.options.onSelect;
         s = me.suggestions[i];
         d = me.data[i];
         me.el.val(me.getValue(s));
         if ($.isFunction(fn)) { fn(s, d, me.el); }
      },

      getValue: function (value) {
         var del, currVal, arr, me;
         me = this;
         del = me.options.delimiter;
         if (!del) { return value; }
         currVal = me.currentValue;
         arr = currVal.split(del);
         if (arr.length === 1) { return value; }
         return currVal.substr(0, currVal.length - arr[arr.length - 1].length) + value;
      }

   };

}(jQuery));

$(document).ready(function () {

   window.lazySizesConfig.loadMode = 1;

   $(".phone").mask('+7(999)9999999');

   $('#name').focus();

   $('.add-to-cart').live('click', function () {
      var button = $(this);
      if (button.hasClass('in-cart')) {
         location.href = '/cart';
      } else {
         var product_id = button.data('product_id');
         button.ajaxLoader();
         $.ajax({
            url: '/ajaxcart_add',
            dataType: 'json',
            data: {
               product_id: product_id,
               quantity: $('.cart-item-numpad-quantity').val() ? $('.cart-item-numpad-quantity').val() : 1,
               ajax: '1'
            },
            type: 'POST',
            success: function (data) {
               $('.cart-bar').html(data.html).fadeIn().fadeOut().fadeIn().fadeOut().fadeIn();
               $('.header-cart .cart-comment').html(data.num + ' на сумму ' + data.amount + ' руб.').fadeIn().fadeOut().fadeIn();
               if (button.hasClass('one-step')) {
                  location.href = '/cart';
               } else {
                  button.html('<i class="icon-basket"></i>&nbsp;в корзине').addClass('in-cart');
               }
               button.ajaxLoaderRemove();
               ym(34992845, 'reachGoal', 'add-to-cart');
               ga('send', 'event', 'order', 'add-to-cart');
            }
         });
      }
      return false;
   });

   $('.rental-add-to-cart').live('click', function () {
      var button = $(this);
      var product_id = button.data('product_id');
      $.ajax({
         url: '/ajaxcart_add',
         dataType: 'json',
         data: {
            product_id: product_id,
            quantity: $('.quantity').val() ? $('.quantity').val() : 1,
            ajax: '1',
            one_click: '1'
         },
         type: 'POST',
         success: function (data) {
            $.fancybox(data.html);
            $(".phone").mask('+7(999)9999999');
         }
      });
      return false;
   });

   $('.cart-button').live('click', function () {
      var button = $(this);
      var product_id = button.data('product_id');
      $.ajax({
         url: '/ajaxcart_add',
         dataType: 'json',
         data: {
            product_id: product_id,
            quantity: 1
         },
         type: 'POST',
         success: function (data) {
            location.href = '/cart';
         }
      });
      return false;
   });

   $('.mobile-version-link').click(function () {
      $.cookie('full_site', null, {
         expires: 7,
         path: '/',
         domain: '.ivankalyan.ru'
      });
      location.href = 'http://m.ivankalyan.ru' + location.pathname;
      return false;
   });

   $('.similars').bxSlider({
      minSlides: 2,
      maxSlides: 5,
      pager: false,
      slideWidth: 210,
      infiniteLoop: false
   });

   $('.product_images').bxSlider({
      minSlides: 1,
      maxSlides: 4,
      slideWidth: 150,
      pager: false,
      infiniteLoop: false
   });

   $('.product_images li a').fancybox();
   $('.single-image').fancybox();

   $('.bxslider').bxSlider({
      auto: true,
      autoHover: true,
      minSlides: 2,
      maxSlides: 4,
      slideWidth: 300,
      slideMargin: 30
   });

   $('.blog-short,.event-short').click(function () {
      location.href = $(this).data('link');
   });

   $('.order-status-history').click(function () {
      var me = $(this);
      var content = me.next().clone();
      $.fancybox({
         content: content.html()
      });
   });

   $('.order-tracking').click(function () {
      var me = $(this);
      var content = me.next().clone();
      $.fancybox({
         content: content.html()
      });
   });

   if (typeof account_zone_id !== 'undefined') {
      $('select[name=\'zone_id\']').load('address_zone&country_id=176&zone_id=' + account_zone_id);
      $('#postcode').load('address_postcode&country_id=176');
   }

   $('.update-photo').click(function () {
      $(this).next().click();
   });

   $('.update-photo').next().change(function () {
      if ($(this).val()) {
         $('.user-photo').css('opacity', 0.5);
         $('#photoUploadForm').ajaxSubmit({
            dataType: 'text',
            success: function (data) {
               $('.user-photo img').attr('src', data + '?' + Date.now());
               $('.user-photo').css('opacity', 1);
            }
         });
      }
   });

   $('.rsrv-btn').click(function () {
      $('.search').submit();
   });

   if (!$.cookie('law_ok')) {
      if ($('.law-notify').length > 0) {
         $('.law-ok').live('click', function () {
            $.cookie('law_ok', '1', {
               expires: 100,
               path: '/',
               domain: '.shop.ivankalyan.ru'
            });
            $.fancybox.close();
         });
         $('.law-no').live('click', function () {
            location.href = "https://yandex.ru/search/?text=%D0%B7%D0%BE%D0%B6";
         });
         $.fancybox({
            content: $('.law-notify').html(),
            hideOnOverlayClick: false,
            showCloseButton: false
         });
      }
   }

   $('.color_block').click(function () {
      location.href = $(this).data('location');
   })

   $('#feedbackForm .star-rating .star').live('click', function () {
      $(this).siblings('.star').removeClass('active');
      //$(this).parent().find('.star').removeClass('active');
      //$('#feedbackForm .star-rating .star').removeClass('active');
      $(this).prevAll('.star').addClass('active');
      $(this).addClass('active');
      $(this).parent().prev('select').find('option').removeAttr('selected');
      $(this).parent().prev('select').find("option[value=" + $(this).data('value') + "]").attr('selected', 'selected');
      //$('#feedbackForm select').val($(this).data('value'));
   });

   $("#leave-feedback").toggle(function () {
      if ($('.product-feedback-form').hasClass('form-loaded')) {
         $('.product-feedback-form').show('normal');
      } else {
         params = {};
         if ($('.add-to-cart').data('product_id')) {
            params = {
               product_id: $('.add-to-cart').data('product_id')
            };
         }
         $.ajax({
            url: '/feedback_form',
            type: 'POST',
            dataType: 'json',
            data: params,
            success: function (data) {
               $('.product-feedback-form').html(data.html);
               $('.product-feedback-form').show('normal').addClass('form-loaded');
            }
         });
      }
   }, function () {
      $('.product-feedback-form').hide('normal');
   });

   $('a[href*=#]:not([href=#])').click(function () {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
         var target = $(this.hash);
         target = target.length ? target : $('[id=' + this.hash.slice(1) + ']');
         if (target.length) {
            $('html,body').animate({
               scrollTop: target.offset().top
            }, 1000);
            return false;
         }
      }
   });

   $('.insta-scroller').bxSlider({
      minSlides: 2,
      maxSlides: 4,
      slideWidth: 'auto',
      auto: true,
      pager: false,
      pause: 2500
   });
   $('.insta-scroller a').fancybox({
      titleFromAlt: true
   });

   $('.home-category-c li').hover(
      function () {
         var span = $(this).find('span');
         var originalText = span.html();
         span.text(span.data('brief'));
         span.data('brief', originalText);
         span.addClass('brief-displayed');
      },
      function () {
         var span = $(this).find('span');
         var brief = span.text();
         span.text(span.data('brief'));
         span.data('brief', brief);
         span.removeClass('brief-displayed');
      }
   );
   $('#search').autocomplete({
      serviceUrl: '/autocomplete',
      minChars: 2,
      delimiter: /(,|;)\s*/,
      maxHeight: 300,
      width: 'auto',
      zIndex: 9999,
      deferRequestBy: 350,
      onSelect: function (data, value) {
         location.href = value.href;
      }
   });

   $('.notify-in-stock').on('click', function (e) {
      var me = $(this);
      $.ajax({
         url: '/notify_stock',
         data: { product_id: me.data('product_id'), email: $('#notifystockemail').val() },
         type: 'POST',
         dataType: 'json',
         success: function (json) {
            $.fancybox(json.text);
         }
      });
   });

   $('.product-accessory-add-type').on('click', function (e) {
      console.log('fire');
      $(this).next().find('span').trigger('click');
   });

   $('.product-accessory-add-btn').on('click', function (e) {
      var me = $(this);
      $.ajax({
         url: me.data('link') + '&accessories-load=1&accessory_type=' + me.data('accessory-type'),
         type: 'GET',
         dataType: 'html',
         success: function (html) {
            $.fancybox(html);
         }
      })
   });

   $('.home-banners').bxSlider({
      minSlides: 1,
      maxSlides: 1,
      auto: true,
      pager: false,
      pause: 2500,
      infiniteLoop: true,
      easing: 'ease-in-out',
      responsive: true,
      shrinkItems: true
   });

});

$(document).ready(function () {

   function updateQuantity(me) {
      $('.cart_totals').css('opacity', '0.7');
      $('.cart_totals').ajaxLoader();
      $.ajax({
         url: '/update_quantity',
         type: 'POST',
         dataType: 'json',
         data: {
            key: me.data('product_key'),
            product_id: me.data('product_id'),
            quantity: parseInt(me.text())
         },
         success: function (data) {
            $.ajax({
               url: '/cart_totals',
               type: 'POST',
               dataType: 'html',
               data: {
                  shipping_method: $('.delivery-method option:selected').val()
               },
               success: function (data) {
                  $('.cart_totals').html(data);
                  $('.cart_totals').css('opacity', '1');
                  $('.cart_totals').ajaxLoaderRemove();
               }
            });
            $('.cart-bar').html(data.text).fadeIn().fadeOut().fadeIn().fadeOut().fadeIn();
            $('#header .cart-btn').find('span.count').html(data.num).fadeIn().fadeOut().fadeIn().fadeOut().fadeIn();
         }
      });
   }

   $(".delete-item").live('click', function () {
      var me = $(this);
      $('.cart_totals').css('opacity', '0.7');
      $('.cart_totals').ajaxLoader();
      $.ajax({
         url: me.attr('href'),
         dataType: 'json',
         success: function (data) {
            me.parent().remove();
            var cartData = data;
            $('.header-cart .cart-comment').html(data.num + ' на сумму ' + data.amount + ' &#8381;').fadeIn().fadeOut().fadeIn();
            $.ajax({
               url: '/cart_totals',
               type: 'POST',
               dataType: 'html',
               data: {
                  shipping_method: $('.delivery-method').val()
               },
               success: function (data) {
                  if (!cartData.amount) {
                     location.href = '/cart';
                  } else {
                     $('.cart_totals').html(data);
                     $('.cart_totals').css('opacity', '1');
                     $('.cart_totals').ajaxLoaderRemove();
                  }
               }
            });
         }
      });
      return false;
   });

   $('.cart-item-numpad-min').click(function () {
      if ($(this).hasClass('no-cart-update')) {
         var q = parseInt($(this).next().val());
         $(this).next().val(q - 1);
      } else {
         var q = parseInt($(this).next().text());
         $(this).next().text(q - 1);
      }
      if (!$(this).hasClass('no-cart-update')) {
         updateQuantity($(this).next());
      }
      if (q - 1 <= 0) {
         $(this).parent().parent().next().click();
      }
   });

   $('.cart-item-numpad-plus').click(function () {
      if ($(this).hasClass('no-cart-update')) {
         var q = parseInt($(this).prev().val());
         $(this).prev().val(q + 1);
      } else {
         var q = parseInt($(this).prev().text());
         $(this).prev().text(q + 1);
      }
      if (!$(this).hasClass('no-cart-update')) {
         updateQuantity($(this).prev());
      }
   });

   $('.delivery-method').change(function () {
      var me = $(this).find(':selected');
      $('.customer-info').html('');
      $('.ajax-loader').show();
      $('.cart_totals').css('opacity', '0.7');
      $('.cart_totals').ajaxLoader();
      $.ajax({
         url: '/checkout_fields',
         type: 'POST',
         dataType: 'html',
         data: {
            shipping_method: me.val()
         },
         success: function (html) {
            if (html) {
               $('.customer-info').html($(html));
               $('.ajax-loader').hide();
               $.ajax({
                  url: '/cart_totals',
                  type: 'POST',
                  dataType: 'html',
                  data: {
                     shipping_method: me.val()
                  },
                  success: function (data) {
                     $('.cart_totals').html(data);
                     $('.cart_totals').css('opacity', '1');
                     $('.cart_totals').ajaxLoaderRemove();
                  }
               });
               $(".phone").mask('+7(999)9999999');
            }
         }
      })
   });

   $('.order-confirm').click(function () {
      var me = $(this);
      $('#cartForm input, #cartForm textarea').removeClass('invalid');
      me.html('<img src="/image/data/30.gif" />');
      $('#cartForm').ajaxSubmit({
         dataType: 'json',
         beforeSubmit: function () {
            me.attr('disabled', 'disabled');
         },
         success: function (data) {
            if (!data.code) {
               for (var key in data.errors) {
                  $('#cartForm input[name="' + key + '"],#cartForm textarea[name="' + key + '"]').addClass('invalid');
               }
               me.removeAttr('disabled');
            } else {
               if (data.redirect_url) {
                  location.href = data.redirect_url;
               } else {
                  location.href = '/success';
               }
            }
            me.html('Подтвердить заказ');
         }
      });
   });

   $("#cartForm input").each(function () {
      $(this).blur(function () {
         if ($(this).val()) {
            $(this).next('.ajax-error').html('');
         }
      });
   });

   $(".phone").mask('+7(999)9999999');

   $('.customer-info input,.customer-info textarea').live('blur', function () {
      $.cookie('ivk[' + $(this).attr('name') + ']', $(this).val());
   });

   if (!is_logged) {
      $('.customer-info input[type=text]').each(function () {
         $(this).val($.cookie('ivk[' + $(this).attr('name') + ']'));
      });
      $('.customer-info textarea').each(function () {
         $(this).val($.cookie('ivk[' + $(this).attr('name') + ']'));
      });
   }
});

$(document).ready(function () {
   $('.catering-confirm').live('click', function () {
      var me = $(this);
      var text = me.html();
      $('#cartForm .ajax-error').html('');
      me.html('<img src="/image/data/30.gif" />');
      $('#cartForm').ajaxSubmit({
         dataType: 'json',
         beforeSubmit: function () {
            me.attr('disabled', 'disabled');
         },
         success: function (data) {
            if (!data.code) {
               for (var key in data.errors) {
                  if (key == 'warning') {
                     $('#cartForm span#email').html(data.errors[key]);
                  }
                  $('#cartForm span#' + key).html(data.errors[key]);
               }
               me.removeAttr('disabled');
            }
            else {
               if (data.redirect_url) {
                  location.href = data.redirect_url;
               }
               else {
                  location.href = '/success';
               }
            }
            me.html(text);
         }
      });
      return false;
   });

});


$(document).ready(function () {
   $('#region-select').click(function () {
      $.ajax({
         url: '/region_select',
         type: 'POST',
         data: {
            region: $('#region-selector-input').val()
         },
         success: function (data) {
            location.href = location.href;
         }
      })
   });
   $('#region-selector-input').live('keyup', function (e) {
      var me = $(this);
      $('.city-list').html('');
      $('.region-loader').show();
      $.ajax({
         url: '/city_by_letter',
         type: 'POST',
         dataType: 'json',
         data: {
            letter: me.val()
         },
         success: function (data) {
            $('.region-loader').hide();
            $('.city-list').html(data.html);
         }
      });
      return false;
   });
   $('.select-region-link').click(function () {
      $.ajax({
         url: '/region_select_form',
         success: function (data) {
            $.fancybox({ content: data });
         }
      });
   });
});

$(document).ready(function () {

   var filterClicked = false;

   $(".filter_section .filter_section_title").live('click', function () {
      var title = $(this);
      var section = title.parent();
      var content = title.next();
      // if (!section.hasClass('filter-open')) {
      //    content.slideDown("slow");
      //    title.css("border-bottom", "none");
      //    section.addClass("filter-open");
      // } else {
      //    content.slideUp("slow");
      //    title.css("border-bottom", "1px solid #D4DFE2");
      //    section.removeClass("filter-open");
      // }
   });

   $('#flush-filters').live('click', function () {
      location.href = pages_url;
   });

   $('.filter-section-flush').live('click', function () {
      $(this).parent().parent().next().find('input').removeAttr('checked').val('');
      runFilter($(this));
   });

   var historyApi = !!(window.history && history.pushState);

   function runFilter(obj) {
      if ('<?= $manufacturer_id ?>') {
         url = 'index.php?route=product/manufacturer';
      } else {
         url = 'index.php?route=product/category';
      }

      $sep = '&';
      urlu = pages_url;
      url = new Array();

      var sort = '';
      var initiator = '';
      sort = $('.sort-option .selected').data('sort');

      var price_min = $('.price-filter input[name="price[min]"]');
      var price_max = $('.price-filter input[name="price[max]"]');
      if (price_min.val()) {
         url.push("price[min]=" + price_min.val());
      }
      if (price_max.val()) {
         url.push("price[max]=" + price_max.val());
      }

      var attributes_list = '';
      var elements_attributes = $('#filter_box .attributes');
      var name = '';
      var inputs = '';
      var input = '';
      var element = '';
      var sep1 = '';
      var sep2 = '';
      for (var i = 0; i < elements_attributes.length; ++i) {
         element = $(elements_attributes.get(i));
         name = element.data('name');
         inputs = element.find('input:checked');
         if (inputs.length) {
            attributes_list += sep1 + name + '=';
            for (var j = 0; j < inputs.length; ++j) {
               input = $(inputs.get(j));
               attributes_list += sep2 + input.val();
               sep2 = ','
            }
            sep2 = '';
            sep1 = '&';
         }
      }

      if (sort) {
         url.push('sort=' + sort);
      }

      if (attributes_list) {
         url.push(attributes_list);
      }
      if (obj.data('initiator-id')) {
         url.push('init=' + obj.data('initiator-id'));
      }
      var finalUrl = urlu + (url.length ? $sep : '') + url.join('&');

      if (finalUrl == urlu) {
         location.href = finalUrl;
      } else {

         if (historyApi) {
            $.ajax({
               url: finalUrl,
               type: 'GET',
               dataType: 'html',
               data: {
                  ajax_load: 1
               },
               beforeSend: function () {
                  $('#filter').css('opacity', '0.6');
               },
               success: function (html) {
                  html = html.split('<!--SPLIT-->');
                  $('.category-content-block').html(html[0]);
                  //$('.pagination').html(html[2]);
                  $('#filter').replaceWith(html[1]);
                  $('#filter').css('opacity', '1');
                  window.history.pushState(null, null, finalUrl);
                  $('body').addClass('history-pushed');
               }
            });
         } else {
            location.href = urlu + (url.length ? $sep : '') + url.join('&');
         }
      }
   }

   if (historyApi) {
      $(window).bind('popstate', function () {
         if ($('body').hasClass("history-pushed")) {
            $.ajax({
               url: location.pathname + location.search,
               type: 'GET',
               dataType: 'html',
               data: {
                  ajax_load: 1
               },
               beforeSend: function () {
                  $('#filter').css('opacity', '0.6');
               },
               success: function (html) {
                  html = html.split('<!--SPLIT-->');
                  $('.category-content-block').html(html[0]);
                  //$('.pagination').html(html[2]);
                  $('#filter').replaceWith(html[1]);
                  $('#filter').css('opacity', '1');
               }
            });
         }
      });
   }

   $(".sort-option span").live('click', function () {
      var me = $(this);
      $.ajax({
         url: me.data('href'),
         type: 'GET',
         dataType: 'html',
         data: {
            ajax_load: 1
         },
         beforeSend: function () {
            $('#filter').css('opacity', '0.6');
         },
         success: function (html) {
            html = html.split('<!--SPLIT-->');
            $('.category-content-block').html(html[0]);
            //$('.pagination').html(html[2]);
            $('#filter').replaceWith(html[1]);
            $('#filter').css('opacity', '1');
         }
      });
   });

   $("#filter_box input[type=checkbox]").live('change', function () {
      runFilter($(this));
   });

   $(".price-filter input[type=text]").live('blur', function () {
      runFilter($(this));
   });

   if (!$('#colors').hasClass('sub-options')) {
      $('#colors .color_block').live('click', function () {
         if (!$(this).hasClass('selected')) {
            $(this).children('input').attr('checked', 'checked');
            $(this).addClass('selected');
         } else {
            $(this).children('input').removeAttr('checked');
            $(this).removeClass('selected');
         }
         runFilter($(this).children('input'));
      });
   }
   $('.slide-menu__control, .nav-close').click(function (event) {
      $('.menu').toggleClass('_active');
      $('body').toggleClass('lock');
   });
   $('.open-kalians, .nav-back-menu1').click(function (event) {
      $('.nav-kalians').toggleClass('_active');
      $('.menu').toggleClass('_active');
   });
   $('.open-tobaco, .nav-back-menu2').click(function (event) {
      $('.tobaco').toggleClass('_active');
      $('.menu').toggleClass('_active');
   });
   $('.open-coal, .nav-back-menu3').click(function (event) {
      $('.coal').toggleClass('_active');
      $('.menu').toggleClass('_active');
   });
   $('.open-accessories, .nav-back-menu4').click(function (event) {
      $('.accessories').toggleClass('_active');
      $('.menu').toggleClass('_active');
   });
   $('.footer-column-title0').click(function (event) {
      $('.footer-column-title0').next().toggleClass('_active');
      $('.footer-column-title0').toggleClass('_active');
   });
   $('.footer-column-title1').click(function (event) {
      $('.footer-column-title1').next().toggleClass('_active');
      $('.footer-column-title1').toggleClass('_active');
   });
   $('.footer-column-title2').click(function (event) {
      $('.footer-column-title2').next().toggleClass('_active');
      $('.footer-column-title2').toggleClass('_active');
   });

});