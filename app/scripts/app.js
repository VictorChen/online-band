define(['jquery', 'howler'], function ($, Howler) {
	'use strict';

  var easy = new Howler.Howl({
    src: ['loops/Lemon.mp3', 'loops/Lemon.ogg']
  });


  var piano = new Howler.Howl({
    src: ['loops/looperman-l-1172109-0081261-widetip-what-i-did-for-love-remake.wav'],
    onend: function () {
      easy.play();      
    }
  });

  piano.play();
  // piano.play();
  return [easy, piano];
});