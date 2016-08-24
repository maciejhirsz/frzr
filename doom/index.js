
export function el(tag, attributes) {
    var el = document.createElement(tag);
    var len = arguments.length;

    if (len === 1) return el;

    var i = 1;

    if (attributes != null && attributes.constructor === Object) {
        i = 2;

        var value;
        for (var attribute in attributes) {
            value = attributes[attribute];
            switch (attribute) {
                case 'class' : el.className = value; break;
                case 'id'    : el.id        = value; break;
                case 'name'  : el.name      = value; break;
                case 'src'   : el.src       = value; break;
                default      : el.setAttribute(attribute, value);
            }
        }

        if (len === 2) return el;
    }

    var content = arguments[i++];
    if (content && !content.nodeType) {
        el.textContent = content;
    } else {
        mount(el, content);
    }

    while (i < len) {
        mount(el, arguments[i++]);
    }

    return el;
}

el.extend = function (tag) {
    return function (a, b, c, d, e, f) {
        var len = arguments.length;

        switch (len) {
            case 0: return el(tag);
            case 1: return el(tag, a);
            case 2: return el(tag, a, b);
            case 3: return el(tag, a, b, c);
            case 4: return el(tag, a, b, c, d);
            case 5: return el(tag, a, b, c, d, e);
            case 6: return el(tag, a, b, c, d, e, f);
        }

        var args = new Array(len + 1);
        var arg, i = 0;

        args[0] = tag;

        while (i < len) {
            // args[1] = arguments[0] and so on
            arg = arguments[i++];
            args[i] = arg;
        }

        return el.apply(this, args);
    }
}

export function mount(el, content) {
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
