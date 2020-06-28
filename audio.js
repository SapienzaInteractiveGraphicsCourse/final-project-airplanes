
var listener = new THREE.AudioListener();

var sound = new THREE.Audio( listener );

var audioLoader = new THREE.AudioLoader();
audioLoader.load( "/audio/BigCarTheft.mp3", function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});

/*
var coinSound = new THREE.Audio( listener );
var audioLoader2 = new THREE.AudioLoader();
audioLoader2.load( "/audio/coinAudio.wav", function( buffer2 ) {
	coinSound.setBuffer( buffer2 );
	coinSound.setVolume( 0.2 );
});
*/




function play(){

    

    //document.getElementById('audio').play();

    sound.play();

    //document.getElementById("audio").loop = true;

    document.getElementById("playB").style.background = "#f52b2b";
    document.getElementById("stopB").style.background = "#006680";

  }

  function stop_music(){

  sound.pause();

  document.getElementById("playB").style.background = "#006680";
  document.getElementById("stopB").style.background = "#f52b2b";

  }
