var Speech = (function (undefined) {

  var eventSplitter = /\s+/,
      Events = function () {}

  Events.prototype.on = function (events, callback, context) {
      var cache, event, list
      if (!callback) return this

      cache = this.__events || (this.__events = {})
      events = events.split(eventSplitter)

      while (event = events.shift()) {
          list = cache[event] || (cache[event] = [])
          list.push(callback, context)
      }

      return this
  }

  Events.prototype.off = function (events, callback, context) {
      var cache, event, list, i

      if (!(cache = this.__events)) return this
      if (!(events || callback || context)) {
          delete this.__events
          return this
      }

      events = events ? events.split(eventSplitter) : Object.keys(cache)

      while (event = events.shift()) {
          list = cache[event]
          if (!list) continue

          if (!(callback || context)) {
              delete cache[event]
              continue
          }

          for (i = list.length - 2; i >= 0; i -= 2) {
              if (!(callback && list[i] !== callback ||
                      context && list[i + 1] !== context)) {
                  list.splice(i, 2)
              }
          }
      }

      return this
  }

  Events.prototype.emit = function(events) {
      var cache, event, all, list, i, len, rest = [], args
      if (!(cache = this.__events)) return this

      events = events.split(eventSplitter)

      for (i = 1, len = arguments.length; i < len; i++) {
          rest[i - 1] = arguments[i]
      }

      while (event = events.shift()) {
          if (all = cache.all) all = all.slice()
          if (list = cache[event]) list = list.slice()

          if (list) {
              for (i = 0, len = list.length; i < len; i += 2) {
                  list[i].apply(list[i + 1] || this, rest)
              }
          }

          if (all) {
              args = [event].concat(rest)
              for (i = 0, len = all.length; i < len; i += 2) {
                  all[i].apply(all[i + 1] || this, args)
              }
          }
      }

      return this
  }

  Events.mixTo = function(receiver) {
      receiver = receiver.prototype || receiver
      var proto = Events.prototype

      for (var p in proto) {
          if (proto.hasOwnProperty(p)) {
              receiver[p] = proto[p]
          }
      }
  }

  function Speech (options) {

      this.options = {
          debugging: false,
          continuous: false,
          interimResults: false,
          autoRestart: false
      }

      if (Object.prototype.toString.call(options) === '[object Object]') {
          for (var op in options) {
              this.options[op] = options[op]
          }
      }

      this.active         = false
      this.manualStopped  = false
      this.history        = []
      this.lastIndex      = -1
      this.lastResult     = ''
      this.recognition    = new webkitSpeechRecognition()

      var rec = this.recognition,
          self = this

      rec.continuous = true
      rec.interimResults = true      
      rec.lang = 'ar'

      rec.onstart = function () {
          self.active = true
          this.manualStopped = false
          self.emit('start')
      }

      rec.onresult = function (e) {
          if (!e.results || !e.results.length) return

          var updatedResult = e.results[e.resultIndex],
              transcript = updatedResult[0].transcript.replace(/^\s*/, '')

          
          if (e.resultIndex !== self.lastIndex) {
              self.lastIndex = e.resultIndex
              self.lastResult = ''
          }

          if (transcript === self.lastResult && !updatedResult.isFinal) return
          if (transcript.length < self.lastResult.length) return

          self.lastResult = transcript

          if (updatedResult.isFinal) {
              self.history.push(transcript)
              self.emit('finalResult', transcript)
          } else {
              self.emit('interimResult', transcript)
          }
      }

      rec.onerror = function (e) {
          self.emit('error', e)
      }

      rec.onend = function () {
          self.active = false
          self.lastIndex  = -1
      }
  }

  Speech.prototype.start = function () {
      if (this.active) return
      document.getElementById("btnMicStart").style.display = 'none'
      document.getElementById("btnMicStop").style.display = 'block'
      this.recognition.start()
  }

  Speech.prototype.stop = function () {
      if (!this.active) return
      this.manualStopped = true
      document.getElementById("btnMicStart").style.display = 'block'
      document.getElementById("btnMicStop").style.display = 'none'
      this.recognition.stop()
  }

  Events.mixTo(Speech)

  return Speech

})()
