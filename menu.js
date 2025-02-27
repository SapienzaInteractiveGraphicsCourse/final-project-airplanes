
function init_starting_menu(){  //to avoid bug when reloading
    document.getElementById("opt_menu").style.display = "none";

    document.getElementById("com_menu").style.display = "none";

    document.getElementById("scene-container").style.display = "none";

    document.getElementById("endScene").style.display = "none";

    document.getElementById("menu").style.display = "block";

    setTimeout(() => {     play();   }, 500);  //audio

}

function show_options(){

    document.getElementById("menu").style.display = "none";

    document.getElementById("opt_menu").style.display = "block";
  };

  function show_commands(){
 
    document.getElementById("menu").style.display = "none";

    document.getElementById("com_menu").style.display = "block";
  }

  function back(){
      
    document.getElementById("opt_menu").style.display = "none";

    document.getElementById("com_menu").style.display = "none";

    document.getElementById("menu").style.display = "block";

  };

  
  function info(){
      window.alert();
  }

  
function setEasy(){
    choosen_plane = 1;
    Diff_vel = 1.0;
    maxvel = 2.0;
    ring_score = 100;
    light_score = 500;
    life_score = 1000;
    document.getElementById("1").style.background = "#f52b2b";
    document.getElementById("2").style.background = "#006680";
    document.getElementById("3").style.background = "#006680";
}

function setMedium(){
    choosen_plane = 2;
    Diff_vel = 2.0;
    maxvel = 2.5;
    ring_score = 150;
    light_score = 800;
    life_score = 1500;
    document.getElementById("1").style.background = "#006680";
    document.getElementById("2").style.background = "#f52b2b";
    document.getElementById("3").style.background = "#006680";
}

function setHard(){
    choosen_plane = 3;
    Diff_vel = 2.5;
    maxvel = 3.5;
    ring_score = 200;
    light_score = 1200;
    life_score = 1500;
    document.getElementById("1").style.background = "#006680";
    document.getElementById("2").style.background = "#006680";
    document.getElementById("3").style.background = "#f52b2b";
}

function setFog(){
    fog_flag = true;
    document.getElementById("yes_fog").style.background = "#f52b2b";
    document.getElementById("no_fog").style.background = "#006680";
}

function noFog(){
    fog_flag = false;
    document.getElementById("yes_fog").style.background = "#006680";
    document.getElementById("no_fog").style.background = "#f52b2b";
}

function setColl(){
    flagColl = true;
    document.getElementById("yes_coll").style.background = "#f52b2b";
    document.getElementById("no_coll").style.background = "#006680";
}

function noColl(){
    flagColl = false;
    document.getElementById("yes_coll").style.background = "#006680";
    document.getElementById("no_coll").style.background = "#f52b2b";
}

function endgame(){
    vel = 0.0;
    mesh.position.z = -300;
    document.getElementById("scene-container").style.display = "none";
    document.getElementById("endScene").style.display = "block";
    

    document.getElementById("endScene").style.height=1000;//  window.screen.height;
    document.getElementById("endScene").style.width=   window.screen.width;

    document.getElementById("endScene").style.backgroundImage =
     "url('https://sapienzainteractivegraphicscourse.github.io/final-project-airplanes/textures/background.png')";
    
    //document.getElementById("endScene").style.backgroundImage = "url('../textures/background.PNG')"; doesn't load on githubpage 

    document.getElementById("info").style.display = "none";
    document.getElementById("endText").innerHTML = "Final score: " + document.getElementById("info").innerHTML;
}

function restart(){
    location.reload();
}





