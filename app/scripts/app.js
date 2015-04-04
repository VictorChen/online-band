define(['jquery', 'howler'], function ($, Howler) {
	'use strict';

  var easy = window.easy = new Howler.Howl({
    src: ['loops/easy/Lemon.mp3', 'loops/easy/Lemon.ogg']
  });

  var hipHop = new Howler.Howl({
    src: ['loops/hip-hop/Party_All_Night_Long.mp3']
  });

  var pop = new Howler.Howl({
    src: ['loops/pop/super_sahil.mp3']
  });

  easy.play();
  // hipHop.play();
  pop.play();
});