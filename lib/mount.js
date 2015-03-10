
'use strict'

var frzr = require('./index')

module.exports = mount

function mount (target, name, data) {
  var tag = new Tag(frzr.tags[name], target, data)

  return tag
}

function Tag (tag, target, data) {
  var self = this
  var isTag = self instanceof Tag

  if (!isTag) {
    return new Tag(tag, target, data)
  }

  var el = tag.tmpl.cloneNode(true)

  self.$root = target
  self.$el = el

  for (var key in data) {
    self[key] = data[key]
  }

  tag.constructor.call(self)

  frzr.render(function () {
    if (target) {
      target.appendChild(el)
      self.trigger('mount')
      self.$mounted = true
    }
  })
}

frzr.inherits(Tag, frzr.observable)

var proto = Tag.prototype

proto.$find = function (query) {
  return this.$el.querySelector(query)
}

proto.$findAll = function (query) {
  return this.$el.querySelectorAll(query)
}

proto.update = function (data) {
  this.trigger('update', this)
  var data = data || {}
  for (var key in data) {
    this[key] = data[key]
  }
  this.trigger('updated', this)
}

proto.unmount = function () {
  this.trigger('unmount')
  this.off()
  this.$root.removeChild(this.$el)
}