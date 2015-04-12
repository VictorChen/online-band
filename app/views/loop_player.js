define([
  'underscore',
  'backbone',
  'howler',
  'text!../templates/loop.html',
  '../util/drag_drop_helper',
  'jquery_ui/ui/slider'
],

function (_, Backbone, Howler, Template, dragDropHelper) {
  'use strict';

  return Backbone.View.extend({
    template: _.template(Template),
    className: 'loop',
    events: {
      'click .loop-play': 'playHandler',
      'click .loop-volume': 'toggleVolume'
    },
    initialize: function (options) {
      var self = this;
      this.oldVolume = 0;
      this.name = options.name;
      this.loaded = false;
      this.howler = new Howler.Howl({
        src: options.src,
        loop: true,
        volume: 0.5,
        preload: false
      });
      this.howler.once('load', function () {
        self.loaded = true;
        self.howler.volume(self.$volumeSlider.slider('value') / 100);
        var durationText = self.formatTime(self.howler.duration());
        self.$('.loop-duration').text(durationText);
        self.playHandler();
      });
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
      var currentVolume = this.$volumeSlider.slider('value')
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
    playHandler: function () {
      if (!this.loaded) {
        this.howler.load();
        return;
      }
      if (this.$('.loop-play-icon').hasClass('icono-play')) {
        this.syncPlayer();
        this.howler.play();
      } else {
        this.stopSyncPlayer();
        this.howler.pause();
      }
      this.$('.loop-play-icon').toggleClass('icono-play icono-pause');
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
          self.howler.seek(time);
          self.updateTime();
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
    render: function () {
      this.$el.html(this.template({
        name: this.name
      }));
      dragDropHelper.applyLoopsPaneDraggable(this.$el);
      this.hookUpPlayer();
      return this;
    }
  });
});