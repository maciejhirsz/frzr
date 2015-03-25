(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.frzr=f()}})(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){"use strict";function clean(e){e.innerHTML=""}module.exports=clean},{}],2:[function(require,module,exports){"use strict";module.exports=function(e,t,o){Object.defineProperty(e,t,{value:o})}},{}],3:[function(require,module,exports){"use strict";function each(e,t){for(var c=e.length,o=0;c>o;o++)t(e[o],o)}module.exports=each},{}],4:[function(require,module,exports){"use strict";function eachReverse(e,r){for(var s=e.length,t=s;t;t--)r(e[t-1],t-1)}module.exports=eachReverse},{}],5:[function(require,module,exports){"use strict";var frzr={tags:{}};module.exports=frzr,frzr.clean=require(1),frzr.defProperty=require(2),frzr.each=require(3),frzr.eachReverse=require(4),frzr.observable=require(12),frzr.inherits=require(13),frzr.tag=require(9),frzr.times=require(10),frzr.mount=require(6),frzr.mountAll=require(7),frzr.parse=require(8),frzr.raf=require(14),frzr.observable.prototype.one=frzr.observable.prototype.once,frzr.observable.prototype.trigger=frzr.observable.prototype.emit},{1:1,10:10,12:12,13:13,14:14,2:2,3:3,4:4,6:6,7:7,8:8,9:9}],6:[function(require,module,exports){"use strict";function mount(r,t,n){var o=new Tag(frzr.tags[t],r,n);return o}function Tag(r,t,n){var o=this,e=o instanceof Tag;if(!e)return new Tag(r,t,n);var i=r.tmpl.cloneNode(!0);o.$root=t,o.$el=i;for(var u in n)o[u]=n[u];r.constructor.call(o),t&&frzr.raf(function(){t.appendChild(i),o.trigger("mount"),o.$mounted=!0})}var frzr=require(5);module.exports=mount,frzr.inherits(Tag,frzr.observable);var proto=Tag.prototype;proto.$find=function(r){return this.$el.querySelector(r)},proto.$findAll=function(r){return this.$el.querySelectorAll(r)},proto.update=function(r){var t=this;t.trigger("update",t);var r=r||{};for(var n in r)t[n]=r[n];t.trigger("updated",t)},proto.mount=function(r,t,n){var o=this,r=r;"string"==typeof r&&(r=o.$find(r));var e=frzr.mount(r,t,n);return e.$parent=o,e},proto.mountAll=function(r,t,n){var o=this,r=r;"string"==typeof r&&(r=o.$find(r));var e=frzr.mountAll(r,t,n);return e.$parent=o,e},proto.unmount=function(){var r=this;r.trigger("unmount"),r.off(),r.$root.removeChild(r.$el)}},{5:5}],7:[function(require,module,exports){"use strict";function mountAll(t,r,e){return Tags(e,t,r)}function Tags(t,r,e){var o=this,n=o instanceof Tags;return n?(o.$root="string"==typeof r?o.$find(r):r,o.$tags=[],o.$rendered=[],o.$items=t,o.$tagName=e,o.$uid=1,o.$posLookup=[],void o.update()):new Tags(t,r,e)}var frzr=require(5);module.exports=mountAll,frzr.inherits(Tags,frzr.observable);var proto=Tags.prototype;proto.update=function(t){var r,e=this,o=[],n=0;t&&(e.$items=t),e.trigger("update",e.$items),e.trigger("updated",e.$items),e.$parent=e.$root.parentNode,frzr.raf(function(){e.trigger("render");var t=[];frzr.each(e.$items,function(r,o){r.$uid||(frzr.defProperty(r,"$uid",e.$uid),e.$uid++),t[r.$uid]=o}),frzr.each(e.$rendered,function(r,o){var i=e.$tags[o],u=t[r.$uid];i.offset=n,void 0===u&&(i.unmount(),n--)}),n=0,frzr.each(e.$items,function(t,i){var u,a=e.$posLookup[t.$uid];void 0===a?(u=frzr.mount(void 0,e.$tagName,t),u.$item=t,u.$parent=e,u.$root=e.$root,r||(r=document.createDocumentFragment()),r.appendChild(u.$el),u.offset=u.offset+n,n++):(u=e.$tags[a],u.offset=u.offset+n,i!==a+u.offset?(r||(r=document.createDocumentFragment()),r.appendChild(u.$el)):r&&(e.$root.insertBefore(r,u.$el),r=void 0)),u&&o.push(u)}),r&&e.$root.appendChild(r),e.$tags=o,e.$rendered=e.$items.slice(),e.$posLookup=t,e.trigger("rendered")})},proto.mount=function(t,r,e){var o=this,t=t;"string"==typeof t&&(t=o.$find(t));var n=frzr.mount(t,r,e);return n.$parent=o,n},proto.mountAll=function(t,r,e){var o=this,t=t;"string"==typeof t&&(t=o.$find(t));var n=frzr.mountAll(t,r,e);return n.$parent=o,n},proto.unmount=function(){self.update([]),self.trigger("unmount"),self.off()}},{5:5}],8:[function(require,module,exports){"use strict";function parse(e){return"string"==typeof e?document.querySelector(e).innerHTML:e.innerHTML}module.exports=parse},{}],9:[function(require,module,exports){"use strict";function Tag(t,e,r){if(templates[t])return templates[t].childNodes[0].cloneNode();var s,e=String(e||"").trim();s=document.createElement(startsWith(e,["<td>"])?"tr":startsWith(e,["<tr>","<td>"])?"tbody":startsWith(e,["<thead>","<tbody>"])?"table":"div"),templates[t]=s,s.innerHTML=e,frzr.tags[t]={constructor:r,tmpl:templates[t].childNodes[0]}}function startsWith(t,e){for(var r,s=e.length,a=0;s>a;a++)if(t.slice(0,e[a].length)===e[a]){r=!0;break}return r}var frzr=require(5),templates={};module.exports=Tag},{5:5}],10:[function(require,module,exports){"use strict";function times(t,e){for(var s=0;t>s;s++)e(s)}module.exports=times},{}],11:[function(require,module,exports){function drainQueue(){if(!draining){draining=!0;for(var e,o=queue.length;o;){e=queue,queue=[];for(var r=-1;++r<o;)e[r]();o=queue.length}draining=!1}}function noop(){}var process=module.exports={},queue=[],draining=!1;process.nextTick=function(e){queue.push(e),draining||setTimeout(drainQueue,0)},process.title="browser",process.browser=!0,process.env={},process.argv=[],process.version="",process.versions={},process.on=noop,process.addListener=noop,process.once=noop,process.off=noop,process.removeListener=noop,process.removeAllListeners=noop,process.emit=noop,process.binding=function(){throw new Error("process.binding is not supported")},process.cwd=function(){return"/"},process.chdir=function(){throw new Error("process.chdir is not supported")},process.umask=function(){return 0}},{}],12:[function(require,module,exports){function Emitter(t){return t?mixin(t):void 0}function mixin(t){for(var e in Emitter.prototype)t[e]=Emitter.prototype[e];return t}module.exports=Emitter,Emitter.prototype.on=Emitter.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},Emitter.prototype.once=function(t,e){function i(){this.off(t,i),e.apply(this,arguments)}return i.fn=e,this.on(t,i),this},Emitter.prototype.off=Emitter.prototype.removeListener=Emitter.prototype.removeAllListeners=Emitter.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var i=this._callbacks["$"+t];if(!i)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var r,s=0;s<i.length;s++)if(r=i[s],r===e||r.fn===e){i.splice(s,1);break}return this},Emitter.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),i=this._callbacks["$"+t];if(i){i=i.slice(0);for(var r=0,s=i.length;s>r;++r)i[r].apply(this,e)}return this},Emitter.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},Emitter.prototype.hasListeners=function(t){return!!this.listeners(t).length}},{}],13:[function(require,module,exports){module.exports="function"==typeof Object.create?function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:function(t,e){t.super_=e;var o=function(){};o.prototype=e.prototype,t.prototype=new o,t.prototype.constructor=t}},{}],14:[function(require,module,exports){for(var now=require(15),global="undefined"==typeof window?{}:window,vendors=["moz","webkit"],suffix="AnimationFrame",raf=global["request"+suffix],caf=global["cancel"+suffix]||global["cancelRequest"+suffix],isNative=!0,i=0;i<vendors.length&&!raf;i++)raf=global[vendors[i]+"Request"+suffix],caf=global[vendors[i]+"Cancel"+suffix]||global[vendors[i]+"CancelRequest"+suffix];if(!raf||!caf){isNative=!1;var last=0,id=0,queue=[],frameDuration=1e3/60;raf=function(e){if(0===queue.length){var a=now(),l=Math.max(0,frameDuration-(a-last));last=l+a,setTimeout(function(){var e=queue.slice(0);queue.length=0;for(var a=0;a<e.length;a++)if(!e[a].cancelled)try{e[a].callback(last)}catch(l){setTimeout(function(){throw l},0)}},Math.round(l))}return queue.push({handle:++id,callback:e,cancelled:!1}),id},caf=function(e){for(var a=0;a<queue.length;a++)queue[a].handle===e&&(queue[a].cancelled=!0)}}module.exports=function(e){return isNative?raf.call(global,function(){try{e.apply(this,arguments)}catch(a){setTimeout(function(){throw a},0)}}):raf.call(global,e)},module.exports.cancel=function(){caf.apply(global,arguments)}},{15:15}],15:[function(require,module,exports){(function(process){(function(){var e,n,r;"undefined"!=typeof performance&&null!==performance&&performance.now?module.exports=function(){return performance.now()}:"undefined"!=typeof process&&null!==process&&process.hrtime?(module.exports=function(){return(e()-r)/1e6},n=process.hrtime,e=function(){var e;return e=n(),1e9*e[0]+e[1]},r=e()):Date.now?(module.exports=function(){return Date.now()-r},r=Date.now()):(module.exports=function(){return(new Date).getTime()-r},r=(new Date).getTime())}).call(this)}).call(this,require(11))},{11:11}]},{},[5])(5)});
