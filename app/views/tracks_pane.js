define([
  'backbone',
  'jquery',
  'underscore',
  '../util/drag_drop_helper',
  '../util/loop_helper',
  'text!../templates/tracks_pane.html',
  'jquery_ui/ui/droppable',
  'jquery_ui/ui/resizable'
],

function (Backbone, $, _, dragDropHelper, loopHelper, Template) {
  'use strict';

  return Backbone.View.extend({
    template: _.template(Template),
    events: {
      'click .add-track': 'addTrack'
    },
    initialize: function () {
      this.listenTo(dragDropHelper.events, 'drop', this.resizeTracks);
    },
    resizeTracks: function ($track, $loop) {
      var trackWidth = $track.width();
      var rightPosition = loopHelper.right($loop);
      if (Math.abs(trackWidth - rightPosition) < 500) {
        this.$('.track').width(trackWidth*1.5);
      }
    },
    addTrack: function () {
      var $track = $('<div class="track"></div>');
      var $trackInfo = $('<div class="track-info"></div>');
      var $trackName = $('<div class="track-name">Track</div>');
      this.$('.loops').append($track);
      dragDropHelper.applyTracksPaneDroppable($track);
      $trackInfo.append($trackName);
      $trackInfo.insertBefore(this.$('.add-track'));
      var $seeker = this.$('.seeker');
      $seeker.height($seeker.height() + $track.height());
    },
    bufferAudio: function () {
      var promises = this.$('.track-loop').map(function () {
        var deferred = $.Deferred();
        var audio = loopHelper.audio($(this));
        if ($(this).data('buffered')) {
          audio.pause();
          audio.currentTime = 0;  
          deferred.resolve();
        } else {
          var oldVolume = audio.volume;
          audio.volume = 0;
          audio.play();
          audio.oncanplaythrough = function () {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = oldVolume;
            deferred.resolve();
            // chome and firefox have different behaviors.
            // Chrome only fires this event once whereas
            // firefox fires it everytime the currentTime
            // is changed. Let's make it a noop the second
            // time.
            audio.oncanplaythrough = $.noop;
          }
        }
        return deferred.promise();
      });

      return $.when.apply($, promises);
    },
    play: function () {
      var self = this;
      var $seeker = this.$('.seeker');

      // Reset seeker
      $seeker.css('left', 0);
      
      // Sort loops by their left position
      var loops = self.$('.track-loop').sort(function (a, b) {
        return loopHelper.left($(a)) > loopHelper.left($(b));
      });

      // Convert to actual array
      loops = $.makeArray(loops);

      // Find the last loop that will be played
      var lastLoop = _.max(loops, function (loop) {
        return loopHelper.right($(loop));
      });

      // Buffer all the loops so we can play without stopping
      this.bufferAudio().done(function () {
        var length = loopHelper.right($(lastLoop));

        $seeker.animate({left: length}, {
          easing: 'linear',
          duration: length/0.05,
          step: function (now) {
            if (loops.length && loopHelper.left($(loops[0])) < now) {
              loopHelper.audio($(loops.shift())).play();
            }
          }
        });
      });
    },
    syncScrollbars: function () {
      var self = this;
      this.$('.loops').scroll(function () { 
        self.$('.tracks').scrollTop($(this).scrollTop());
      });
    },
    initializeSeeker: function () {
      var $seeker = this.$('.seeker');
      $seeker.draggable({
        axis: 'x'
      });
    },
    render: function () {
      this.$el.html(this.template({}));
      this.syncScrollbars();
      this.initializeSeeker();
      return this;
    }
  });
});