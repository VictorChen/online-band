define([
  'underscore',
  'backbone',
  'howler',
  'text!../templates/loop.html',
  '../util/drag_drop_helper',
  '../util/loop_helper',
  '../util/constants',
  'jquery_ui/ui/slider'
],

function (_, Backbone, Howler, Template, dragDropHelper, loopHelper, constants) {
  'use strict';

  return Backbone.View.extend({
    template: _.template(Template),
    className: 'loop',
    events: {
      'click .loop-play': 'play',
      'click .loop-volume': 'toggleVolume'
    },
    initialize: function (options) {
      this.oldVolume = 0;
      this.name = options.name;
      this.estimateDuration = options.estimateDuration;
      this.loaded = false;
      this.inTrack = !!options.inTrack;
      this.createHowler(options.src);
      // Save the data so we can re-create the view
      // on drag/drop
      this.$el.attr('id', _.uniqueId('loop-'));
      this.$el.data('options', options);
    },
    createHowler: function (src) {
      var self = this;
      this.howler = new Howler.Howl({
        src: src,
        loop: !self.inTrack,
        volume: 0.5,
        preload: self.inTrack,
        onload: _.bind(this.onLoad, this),
        onloaderror: this.onLoadError,
        onend: function () {
          if (!self.howler.loop()) {
            self.togglePlayButton();
          }
        }
      });
    },
    onLoad: function () {
      this.loaded = true;
      if (this.$volumeSlider) {
        this.howler.volume(this.$volumeSlider.slider('value') / 100);
      }
      var durationText = this.formatTime(this.howler.duration());
      this.$('.loop-duration').text(durationText);
      if (!this.inTrack) {
        this.play();
      }
    },
    onLoadError: function () {
      // TODO: add better handling
      window.alert('Error loading the audio');
    },
    toggleVolume: function (event) {
      var $target = $(event.target);
      if ($target.hasClass('loop-volume') ||
        $target.hasClass('loop-volume-icon')) {
        var tempVolume = this.$volumeSlider.slider('value');
        this.$volumeSlider.slider('value', this.oldVolume);
        this.oldVolume = tempVolume;
      }
    },
    syncVolume: function () {
      var currentVolume = this.$volumeSlider.slider('value');
      var $volume = this.$('.loop-volume-icon');
      $volume.attr('class', 'loop-volume-icon');
      if (currentVolume > 70) {
        $volume.addClass('icono-volumeHigh');
      } else if (currentVolume > 40) {
        $volume.addClass('icono-volumeMedium');
      } else if (currentVolume > 0) {
        $volume.addClass('icono-volumeLow');
      } else {
        $volume.addClass('icono-volumeMute');
      }
    },
    syncPlayer: function () {
      var self = this;
      this.syncInterval = setInterval(function () {
        var currentTime = self.howler.seek();
        var currentPercent = currentTime / self.howler.duration();
        self.updateTime();
        self.$timeSlider.slider('value', currentPercent * 100);
      }, 200);
    },
    stopSyncPlayer: function () {
      if (this.syncInterval) {
        clearInterval(this.syncInterval);
        this.syncInterval = null;
      }
    },
    formatTime: function (time) {
      // Don't care about miliseconds
      time = Math.floor(time);

      var minutes = Math.floor(time / 60);
      var seconds = time - (minutes * 60);

      if (seconds < 10) {
        seconds = '0' + seconds;
      }

      return minutes + ':' + seconds;
    },
    updateTime: function () {
      var $currentTime = this.$('.loop-current-time');
      var currentTime = this.howler.seek();
      $currentTime.text(this.formatTime(currentTime));
    },
    getLeft: function () {
      return loopHelper.left(this.$el);
    },
    getRight: function () {
      return loopHelper.right(this.$el);
    },
    getStart: function () {
      return this.getLeft() / constants.pixelsPerSecond;
    },
    togglePlayButton: function () {
      this.$('.loop-play-icon').toggleClass('icono-play icono-pause');
    },
    play: function () {
      if (!this.loaded) {
        this.howler.load();
      } else {
        if (this.$('.loop-play-icon').hasClass('icono-play')) {
          this.syncPlayer();
          this.howler.play();
        } else {
          this.stopSyncPlayer();
          this.howler.pause();
        }
        this.togglePlayButton();
      }
      return this;
    },
    seek: function (time) {
      this.howler.seek(time);
      this.updateTime();
      return this;
    },
    hookUpPlayer: function () {
      var self = this;
      var setVolume = function (event, ui) {
        self.howler.volume(ui.value / 100);
        self.syncVolume();
      };
      var setTime = function (event, ui) {
        // Ignore if it's changed programmatically
        if (self.loaded && event.currentTarget) {
          var time = self.howler.duration() * (ui.value / 100);
          self.seek(time);
        }
      };
      this.$timeSlider = this.$('.loop-time-track').slider({
        orientation: 'horizontal',
        range: 'min',
        slide: setTime,
        change: setTime
      });
      this.$volumeSlider = this.$('.volume-slider').slider({
        orientation: 'vertical',
        range: 'min',
        value: 50,
        slide: setVolume,
        change: setVolume
      });
    },
    makeDraggable: function () {
      if (this.inTrack) {
        dragDropHelper.applyTracksPaneDraggable(this.$el);
      } else {
        dragDropHelper.applyLoopsPaneDraggable(this.$el);
      }
    },
    render: function () {
      this.$el.html(this.template({
        name: this.name,
        duration: this.formatTime(this.estimateDuration)
      }));
      this.hookUpPlayer();
      this.makeDraggable();
      return this;
    }
  });
});