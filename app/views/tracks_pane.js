define([
  'backbone',
  'jquery',
  'underscore',
  './track',
  './loop_player',
  '../util/drag_drop_helper',
  '../util/loop_helper',
  '../util/constants',
  'text!../templates/tracks_pane.html',
  'jquery_ui/ui/droppable',
  'jquery_ui/ui/resizable'
],

function (Backbone, $, _, TrackView, LoopPlayerView, dragDropHelper, loopHelper, constants, Template) {
  'use strict';

  return Backbone.View.extend({
    template: _.template(Template),
    events: {
      'click .add-track': 'addTrack'
    },
    trackViews: [],
    initialize: function () {
      this.listenTo(dragDropHelper.events, 'new', this.addLoop);
      this.listenTo(dragDropHelper.events, 'move', this.moveLoop);
    },
    addLoop: function (meta) {
      var trackView = this.trackViews[meta.trackIndex];
      var loopPlayerView = new LoopPlayerView(meta.loopData);
      loopPlayerView.$el.css({left: meta.left, top: 0});
      trackView.addLoop(loopPlayerView);
      this.resizeTracks(meta.trackIndex, loopPlayerView);
    },
    moveLoop: function (meta) {
      var trackView = this.trackViews[meta.prevTrackIndex];
      var loopPlayerView = trackView.removeLoop(meta.id);
      this.trackViews[meta.trackIndex].addLoop(loopPlayerView, meta.id);
    },
    resizeTracks: function (trackIndex, loopPlayerView) {
      var trackWidth = this.trackViews[trackIndex].loopsView.$el.width();
      var rightPosition = loopHelper.right(loopPlayerView.$el);
      if (Math.abs(trackWidth-rightPosition) < constants.pixelsBeforeResize) {
        this.$('.track').width(trackWidth*constants.resizeFactor);
      }
    },
    addTrack: function () {
      // Create a new track
      var trackView = new TrackView();
      // Append the track
      trackView.infoView.$el.insertBefore(this.$('.add-track'));
      this.$('.loops').append(trackView.loopsView.$el);
      // Increase height of seeker
      var $seeker = this.$('.seeker');
      $seeker.height($seeker.height() + trackView.loopsView.$el.height());
      this.trackViews.push(trackView);
    },
    isPlayable: function () {
      return !_.some(this.trackViews, function (trackView) {
        return !trackView.isPlayable();
      });

      // var promises = this.$('.track-loop').map(function () {
      //   var deferred = $.Deferred();
      //   var audio = loopHelper.audio($(this));
      //   if ($(this).data('buffered')) {
      //     audio.pause();
      //     audio.currentTime = 0;  
      //     deferred.resolve();
      //   } else {
      //     var oldVolume = audio.volume;
      //     audio.volume = 0;
      //     audio.play();
      //     audio.onended = function () {
      //       audio.pause();
      //       audio.currentTime = 0;
      //       audio.volume = oldVolume;
      //       // chome and firefox have different behaviors.
      //       // Chrome only fires this event once whereas
      //       // firefox fires it everytime the currentTime
      //       // is changed. Let's make it a noop the second
      //       // time.
      //       audio.onended = $.noop;
      //       deferred.resolve();
      //     };
      //   }
      //   return deferred.promise();
      // });

      // return $.when.apply($, promises);
    },
    play: function () {
      if (!this.isPlayable()) {
        // TODO: better handling
        alert('Please wait until the audios are loaded');
        return;
      }

      var self = this;
      var $seeker = this.$('.seeker').stop().css('left', 0);

      var allLoops = [];

      _.each(this.trackViews, function (trackView) {
        allLoops.push.apply(allLoops, trackView.getLoops());
      });
      
      // Sort loops by their left position
      allLoops.sort(function (a, b) {
        return loopHelper.left(a.$el) > loopHelper.left(b.$el);
      });

      // Find the last loop that will be played
      var lastLoop = _.max(allLoops, function (loopPlayerView) {
        return loopHelper.right(loopPlayerView.$el);
      });

      // TODO:
      // Keep track of disjoint sections of loops
      // and play each loop chanined to the next with the
      // "onended" event instead. Join the sections together with
      // setTimeout
      var length = loopHelper.right(lastLoop.$el);
      $seeker.animate({left: length}, {
        easing: 'linear',
        duration: length / (constants.pixelsPerSecond / 1000),
        step: function (now) {
          if (allLoops.length && loopHelper.left(allLoops[0].$el) < now) {
            allLoops.shift().seek(0).play();
          }
        }
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
        axis: 'x',
        containment: 'parent'
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