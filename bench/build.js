(function () {
    'use strict';

    function bench(name, iter) {
        console.log(`Benching ${name}`);

        const maxIterations = 1000000;
        let iterations = maxIterations;

        const start = performance.now();

        while (iterations--) iter();

        const totalNanos = (performance.now() - start) * 1e6;
        const average = totalNanos / maxIterations;
        const iterPerSec = 1e9 / average;


        console.log(`- ${Math.round(average)}ns per iteration (${iterPerSec | 0} ops/sec)`);
        console.log('');
    }

    function text (str) {
      return document.createTextNode(str);
    }

    var customElements;
    var customAttributes;

    function el (tagName) {
      if (customElements) {
        var customElement = customElements[tagName];

        var args = new Array(arguments);

        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }

        if (customElement) {
          return customElement.apply(this, args);
        }
      }

      if (typeof tagName === 'function') {
        var args = new Array(arguments.length);
        args[0] = this;
        for (var i = 1; i < arguments.length; i++) {
          args[i] = arguments[i];
        }
        return new (Function.prototype.bind.apply(tagName, args));
      } else {
        var element = document.createElement(tagName);
      }

      for (var i = 1; i < arguments.length; i++) {
        var arg = arguments[i];

        if (arg == null) {
          continue;
        } else if (mount(element, arg)) {
          continue;
        } else if (typeof arg === 'object') {
          for (var attr in arg) {
            if (customAttributes) {
              var customAttribute = customAttributes[attr];
              if (customAttribute) {
                customAttribute(element, arg[attr]);
                continue;
              }
            }
            var value = arg[attr];
            if (attr === 'style' || (element[attr] == null && typeof value != 'function')) {
              element.setAttribute(attr, value);
            } else {
              element[attr] = value;
            }
          }
        }
      }

      return element;
    }

    el.extend = function (tagName) {
      return function (a, b, c, d, e, f) {
        var len = arguments.length;

        switch (len) {
          case 0: return el(tagName);
          case 1: return el(tagName, a);
          case 2: return el(tagName, a, b);
          case 3: return el(tagName, a, b, c);
          case 4: return el(tagName, a, b, c, d);
          case 5: return el(tagName, a, b, c, d, e);
          case 6: return el(tagName, a, b, c, d, e, f);
        }

        var args = new Array(len + 1);
        var arg, i = 0;

        args[0] = tagName;

        while (i < len) {
            // args[1] = arguments[0] and so on
            arg = arguments[i++];
            args[i] = arg;
        }

        return el.apply(this, args);
      }
    }

    function mount (parent, child, before) {
      var parentEl = parent.el || parent;
      var childEl = child.el || child;
      var childWasMounted = childEl.parentNode != null;

      if (childWasMounted) {
        child.remounting && child.remounting();
      } else {
        child.mounting && child.mounting();
      }

      if (childEl instanceof Node) {
        if (before) {
          var beforeEl = before.el || before;
          parentEl.insertBefore(childEl, beforeEl);
        } else {
          parentEl.appendChild(childEl);
        }

        if (childWasMounted) {
          child.remounted && child.remounted();
        } else {
          child.mounted && child.mounted();
        }
        if (childEl !== child) {
          childEl.view = child;
          child.parent = parent;
        }

      } else if (typeof childEl === 'string' || typeof childEl === 'number') {
        mount(parentEl, text(childEl), before);

      } else if (childEl instanceof Array) {
        for (var i = 0; i < childEl.length; i++) {
          mount(parentEl, childEl[i], before);
        }

      } else if (child.views) {
        child.parent = parent;
        setChildren(parentEl, child.views);

      } else {
        return false;
      }
      return true;
    }

    function unmount (parent, child) {
      var parentEl = parent.el || parent;
      var childEl = child.el || child;

      child.unmounting && child.unmounting();

      parentEl.removeChild(childEl);

      child.unmounted && child.unmounted();

      if (childEl !== child) {
        child.parent = null;
      }
    }

    function setChildren (parent, children) {
      var parentEl = parent.el || parent;
      var traverse = parentEl.firstChild;

      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (!child) {
          continue;
        }
        var childEl = child.el || child;

        if (traverse === childEl) {
          traverse = traverse.nextSibling;
          continue;
        }

        mount(parent, child, traverse);
      }

      while (traverse) {
        var next = traverse.nextSibling;

        unmount(parent, traverse.view || traverse);

        traverse = next;
      }
    }

    function el$1(tag, attributes) {
        var el = document.createElement(tag);
        var len = arguments.length;

        if (len === 1) return el;

        var i = 1;

        if (attributes != null && attributes.constructor === Object) {
            i = 2;

            for (var attribute in attributes) {
                el.setAttribute(attribute, attributes[attribute]);
            }

            if (len === 2) return el;
        }

        var content = arguments[i++];
        if (content.constructor === String) {
            el.textContent = content;
        } else {
            mount$1(el, content);
        }

        while (i < len) {
            mount$1(el, arguments[i++]);
        }

        return el;
    }

    el$1.extend = function (tag) {
        return function (a, b, c, d, e, f) {
            var len = arguments.length;

            switch (len) {
                case 0: return el$1(tag);
                case 1: return el$1(tag, a);
                case 2: return el$1(tag, a, b);
                case 3: return el$1(tag, a, b, c);
                case 4: return el$1(tag, a, b, c, d);
                case 5: return el$1(tag, a, b, c, d, e);
                case 6: return el$1(tag, a, b, c, d, e, f);
            }

            var args = new Array(len + 1);
            var arg, i = 0;

            args[0] = tag;

            while (i < len) {
                // args[1] = arguments[0] and so on
                arg = arguments[i++];
                args[i] = arg;
            }

            return el$1.apply(this, args);
        }
    }

    function mount$1(el, content) {
        if (content.constructor === Array) {
            var child;

            for (var i = 0, len = content.length; i < len; i++) {
                child = content[i];
                el.appendChild(child.nodeType ? child : document.createTextNode(child));
            }
        } else {
            el.appendChild(content.nodeType ? content : document.createTextNode(content));
        }
    }

    // function List(root, transformer, items) {
    //     this.root = root;
    //     this.items = items || [];
    //     this.transformer = transformer;

    //     if (items != null) {
    //         mountAll(root, this.items.map(transformer));
    //     }
    // }

    // List.prototype = {
    //     at: function(index) {
    //         return this.items[index];
    //     },

    //     len: function() {
    //         return this.items.length|0;
    //     },

    //     push: function(item) {
    //         this.root.appendChild(this.transformer(item));
    //         this.items.push(item);
    //     },

    //     pop: function() {
    //         this.root.removeChild(this.root.lastChild);
    //         return this.items.pop();
    //     },

    //     shift: function() {
    //         this.root.removeChild(this.root.firstChild);
    //         return this.items.shift();
    //     },

    //     unshift: function(item) {
    //         this.root.insertBefore(this.transformer(item), this.root.firstChild);
    //         return this.items.unshift(item);
    //     },

    //     includes: function(item) {
    //         return this.items.indexOf(item) !== -1;
    //     },

    //     indexOf: function(item) {
    //         return this.items.indexOf(item);
    //     },

    //     insertAt: function(index, item) {
    //         this.items.splice(index, 0, item);
    //         this.root.insertBefore(this.transformer(item), this.root.childNodes[index]);
    //     },

    //     removeAt: function(index) {
    //         this.items.splice(index, 1);
    //         this.root.removeChild(this.root.childNodes[index]);
    //     },

    //     splice: function(index, deleteCount) {
    //         deleteCount = deleteCount|0;

    //         var removed = Array.prototype.splice.apply(this.items, arguments);
    //         var root = this.root;
    //         var ref;

    //         while (deleteCount--) {
    //             ref = root.childNodes[index];
    //             if (ref == null) break;
    //             root.removeChild(ref);
    //         }

    //         var i = 2;
    //         var len = arguments.length;
    //         var frag = document.createDocumentFragment();

    //         while (i < len) frag.appendChild(this.transformer(arguments[i++]));

    //         ref = root.childNodes[index];

    //         if (ref != null) {
    //             root.insertBefore(frag, ref);
    //         } else {
    //             root.appendChild(frag);
    //         }

    //         return removed;
    //     }
    // };

    // function SortedList(root, items, compare, transformer) {
    //     items.sort(compare);
    //     this.compare = compare;
    //     this.list = new List(root, items, tran);
    // }

    // SortedList.prototype = {
    //     add: function(item) {
    //         var compare = this.compare;
    //         var list = this.list;

    //         var lowerBound = 0;
    //         var upperBound = list.len();
    //         var splitPoint;

    //         if (upperBound === 0) {
    //             list.push(item);
    //             return;
    //         }

    //         while (lowerBound !== upperBound) {
    //             splitPoint = (lowerBound + upperBound) >> 1; // Integer divide by two

    //             if (compare(item, list.at(splitPoint)) < 0) {
    //                 upperBound = splitPoint;
    //             } else {
    //                 lowerBound = splitPoint + 1;
    //             }
    //         }

    //         list.insertAt(lowerBound, item);
    //     },

    //     remove: function(item) {
    //         var list = this.list;
    //         list.removeAt(list.indexOf(item));
    //     }
    // };

    var frzr_b = el.extend('b');
    var frzr_div = el.extend('div');
    var frzr_h1 = el.extend('h1');
    var frzr_p = el.extend('p');

    var doom_b = el$1.extend('b');
    var doom_div = el$1.extend('div');
    var doom_h1 = el$1.extend('h1');
    var doom_p = el$1.extend('p');

    bench('DOOM create an empty <div> tag', function() {
        el$1('div');
    });

    bench('FRZR create an empty <div> tag', function() {
        el('div');
    });

    bench('DOOM create an <h1> tag with class="doom" and content', function() {
        doom_h1({ 'class': 'doom' }, "Hello DOOM!");
    });

    bench('FRZR create an <h1> tag with class="frzr" and content', function() {
        frzr_h1({ 'class': 'frzr' }, "Hello FRZR!");
    });

    bench('DOOM create an empty <div> tag via extend', function() {
        doom_div();
    });

    bench('FRZR create an empty <div> tag via extend', function() {
        frzr_div();
    });

    bench('DOOM create a <b> tag with text', function() {
        el$1('b', 'Foo bar!');
    });

    bench('FRZR create a <b> tag with text', function() {
        el('b', 'Foo bar!');
    });

    bench('DOOM create a <b> tag with text via extend', function() {
        doom_b('Foo bar!');
    });

    bench('FRZR create a <b> tag with text via extend', function() {
        frzr_b('Foo bar!');
    });

    // bench('DOOM <div> with multiple child nodes', function() {
    //     doom_div(
    //         doom_h1({ 'class': 'doom' }, 'Hello ', doom_b('DOOM'), '!'),
    //         doom_p('Bacon ipsum dolor amet meatloaf meatball shank porchetta \
    //             picanha bresaola short loin short ribs capicola fatback beef \
    //             ribs corned beef ham hock.')
    //     );
    // });

    // bench('FRZR <div> with multiple child nodes', function() {
    //     frzr_div(
    //         frzr_h1({ 'class': 'frzr' }, 'Hello ', frzr_b('FRZR'), '!'),
    //         frzr_p('Bacon ipsum dolor amet meatloaf meatball shank porchetta \
    //             picanha bresaola short loin short ribs capicola fatback beef \
    //             ribs corned beef ham hock.')
    //     );
    // });

    console.log('DOOM', doom_div(
        doom_h1({ 'class': 'doom' }, 'Hello ', doom_b('DOOM'), '!'),
        doom_p('Bacon ipsum dolor amet meatloaf meatball shank porchetta \
        picanha bresaola short loin short ribs capicola fatback beef \
        ribs corned beef ham hock.')
    ));

    console.log('FRZR', frzr_div(
        frzr_h1({ 'class': 'frzr' }, 'Hello ', frzr_b('FRZR'), '!'),
        frzr_p('Bacon ipsum dolor amet meatloaf meatball shank porchetta \
        picanha bresaola short loin short ribs capicola fatback beef \
        ribs corned beef ham hock.')
    ));

}());