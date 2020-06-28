/*
var listener = new THREE.AudioListener();

var sound = new THREE.Audio( listener );

var audioLoader = new THREE.AudioLoader();
audioLoader.load( " audio/BigCarTheft.MP3",  
function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
});
*/
var BG_audio = new Audio("https://sapienzainteractivegraphicscourse.github.io/final-project-airplanes/audio/BigCarTheft.mp3");


function play(){

    BG_audio.play();

    //sound.play();

    BG_audio.loop = true;

    document.getElementById("playB").style.background = "#f52b2b";
    document.getElementById("stopB").style.background = "#006680";

  }

  function stop_music(){

  //sound.pause();

  BG_audio.pause();
  document.getElementById("playB").style.background = "#006680";
  document.getElementById("stopB").style.background = "#f52b2b";

  }
