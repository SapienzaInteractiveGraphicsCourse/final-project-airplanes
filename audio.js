
var listener = new THREE.AudioListener();

var sound = new THREE.Audio( listener );

var audioLoader = new THREE.AudioLoader();
audioLoader.load( "url(https://sapienzainteractivegraphicscourse.github.io/final-project-airplanes/audio/BigCarTheft.MP3)", function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
});

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
