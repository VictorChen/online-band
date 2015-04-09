require([
  'jquery',
  'howler',
  'models/categories_collection',
  'views/loops_pane',
  'views/tracks_pane',
  'views/controls_pane',
  'jquery_ui/ui/resizable'
],

function (
  $,
  Howler,
  CategoriesCollectionModel,
  LoopsPaneView,
  TracksPaneView,
  ControlsPane
) {
  'use strict';

  // Fetch the list of categories
  var categoriesModel = new CategoriesCollectionModel();
  categoriesModel.fetch().done(function () {
    // Create the loops pane view
    var loopsPaneView = new LoopsPaneView({
      el: '.loops-pane',
      collection: categoriesModel.get('collection')
    }).render();
  });

  // Create the tracks pane view
  var tracksPaneView = new TracksPaneView({
    el: '.loops-main'
  }).render();

  // Let's add a few tracks for the user
  tracksPaneView.addTrack();
  tracksPaneView.addTrack();
  tracksPaneView.addTrack();
  tracksPaneView.addTrack();

  // Create controls pane
  var controlsPaneView = new ControlsPane({
    el: '.controls'
  }).render();









  // var easy = new Howler.Howl({
  //   src: ['loops/Lemon.mp3', 'loops/Lemon.ogg']
  // });

  // var piano = new Howler.Howl({
  //   src: ['loops/looperman-l-1172109-0081261-widetip-what-i-did-for-love-remake.wav'],
  //   onend: function () {
  //     easy.play();      
  //   }
  // });

  // piano.play();
  // piano.play();
  // return [easy, piano];
});