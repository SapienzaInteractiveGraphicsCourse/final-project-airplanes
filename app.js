var container;
var camera;
var renderer;
var scene;
var mesh;
var stop=false;

var vel = 1.1;
var maxvel = 2.5;
var minvel = -0.3;
var angle = -Math.PI/2;//0.0;
var angleY = 0.0;
var dx = 0.0;
var dz = 0.0;


var ring1;
var ring2;
var ring3;

var three;

//texture
var legnoTXT = new THREE.TextureLoader().load( 'textures/marr.PNG' );
legnoTXT.wrapS = legnoTXT.wrapT = THREE.RepeatWrapping;
legnoTXT.offset.set( 10, 0 );
var greenpaintTXT = new THREE.TextureLoader().load( 'textures/green-paint.jpg' );
var realgrassTXT = new THREE.TextureLoader().load( 'textures/lightgrass.jpg' );
realgrassTXT.wrapS = THREE.RepeatWrapping; 
realgrassTXT.wrapT = THREE.RepeatWrapping;
realgrassTXT.repeat.set( 1, 10 );
var grassTXT = new THREE.TextureLoader().load( 'textures/poligrass.jpg' );
grassTXT.wrapS = THREE.RepeatWrapping; 
grassTXT.wrapT = THREE.RepeatWrapping;
grassTXT.repeat.set( 0, 10 );
Planematerial = new THREE.MeshBasicMaterial({ map : grassTXT , side: THREE.DoubleSide});
plane = new THREE.Mesh(new THREE.PlaneGeometry( 100, 6000, 100 ), Planematerial);
plane.rotation.x = Math.PI/2;

var controls;

var collidableObject = [];  //TODO

var collidableTreeBoxes = [];  //TODO

var meshBB;
var firstBB;
var secondBB;
var testBB;

var collision;


//FOG
var fog_flag = false;


//HP BAR
var sprite_ico_array = [];
var lifes = 3;  //TODO DIFFICULTY
var maxlifes = 3;
var spriteMap;

function init() {

    // Container element that hold the scene
    container = document.querySelector( '#scene-container' );

    // create a Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x8FFCD4 );

    //perspective cam
    const fov = 35; 
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.01;
    const far = 10000;

    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    //camera = new THREE.OrthographicCamera( 150, 150, 150, 150, -10, 150);  //OrthographicCamera( left , right , top , bottom , near , far  )


    // reposition camera form  0 0 0
    camera.position.set( 0, 20, 70 );
    camera.lookAt( scene.position );

    // create two geometry


    

    const geometry = new THREE.BoxBufferGeometry( 10, 3, 5 );

    const material = new THREE.MeshStandardMaterial( { color: 0x800080 } );

    mesh = new THREE.Mesh( geometry, material );
    mesh.rotation.y = -angle;
    


    const material2 = new THREE.MeshStandardMaterial( { color: 0x101080 } );

    const ring1 = new THREE.Mesh( new THREE.TorusGeometry( 6, 1, 5  ) , material2 );

    const sphere1 = new THREE.Mesh( new THREE.SphereGeometry( 1, 2, 1 ) , material2 );
    
    ring1.position.y += 10.0;

    sphere1.position.y += 10.0;
    
    ring_s = new THREE.Group();

    ring_s.add( ring1 );

    ring_s.add( sphere1 );

    scene.add( ring_s );


    tree = new THREE.Group(); 

    log = new THREE.Mesh( new THREE.BoxBufferGeometry( 5, 30, 5 ), new THREE.MeshBasicMaterial({ map : legnoTXT }) );

    tree.add(log);
    
    crown = new THREE.Mesh( new THREE.BoxBufferGeometry( 20, 15, 20 ), new THREE.MeshBasicMaterial({ map : greenpaintTXT }) ) ;

    crown.position.y=20.0;

    tree.add(crown);

    tree.position.z = -150.0;
    tree.position.y = 10.0;
    tree.position.x = 35.0;

    tree.updateMatrixWorld();   //PER AGGIORANRE LE COLLISIONI

    meshBB = new THREE.Box3().setFromObject(mesh);

    firstBB = new THREE.Box3().setFromObject(tree.children[0]);

    collidableTreeBoxes.push(firstBB);

    secondBB = new THREE.Box3().setFromObject(tree.children[1]);

    collidableTreeBoxes.push(secondBB);

    testBB = new THREE.Box3().setFromObject(tree);
    


    scene.add(tree);

    
    
    //myBB = new THREE.Box3().setFromObject(mesh);

    //ringBB = new THREE.Box3().setFromObject(group)


    scene.add( plane );

    scene.add( mesh );

    //scene.add( mesh2);
    //scene.add( mesh3);


    // Create a directional light and add it to the scene
    const light = new THREE.DirectionalLight( 0xffff00, 5.0 );
    light.position.set( 30, 30, 30 ); //move light up 
    scene.add( light );


    // create a WebGLRenderer and set its width and height
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( container.clientWidth, container.clientHeight );
    renderer.setPixelRatio( window.devicePixelRatio );


    //controls = new THREE.OrbitControls( camera, renderer.domElement );

    //controls.update(); // have to be called after any manual changes to the camera's transform

    container.appendChild( renderer.domElement ); // add the automatically created <canvas> element to the page

    //HEALTH SPRITE
    spriteMap = new THREE.TextureLoader().load( "textures/heart.png" );
    var spriteMaterial = new THREE.SpriteMaterial( { map : spriteMap } );
    spriteMaterial.rotation=Math.PI;
    sprite_ico = new THREE.Sprite( spriteMaterial );

    for(var i =0;i < lifes; i++){
        sprite_ico_array[i]=sprite_ico.clone();
        scene.add(sprite_ico_array[i]);
    }
    


    //FOG
    if(fog_flag) scene.fog = new THREE.Fog( 0xbbbbbb, 150, 210 );




}

/*
function passed_inside(p){
    myBB=myBB.applyMatrix4( mesh.matrixWorld );
    
    if( myBB.containsPoint(p))return true;
    return false;
}*/

function repositionCam(){
    camera.position.x = mesh.position.x;
    camera.position.y = mesh.position.y;
    camera.position.y +=10.0;
    camera.position.z = mesh.position.z;
    camera.position.z += 35.0; 

    for(var i =0;i<maxlifes;i++){
        sprite_ico_array[i].position.x= mesh.position.x;
        sprite_ico_array[i].position.y= mesh.position.y;
        sprite_ico_array[i].position.z= mesh.position.z;
        sprite_ico_array[i].position.x+= 6.0+(i+1)*1.5;
        sprite_ico_array[i].position.y-=1.0;
        sprite_ico_array[i].position.z+=15.0;
    }
/*
    sprite_bar.position.x= mesh.position.x;
    sprite_bar.position.y= mesh.position.y;
    sprite_bar.position.z= mesh.position.z;
    sprite_bar.position.x += 10.0;
*/
}

function moveMesh(){
    //move
    mesh.position.z += Math.sin(angle) * vel; 
    mesh.position.x += Math.cos(angle) * vel; 
    if(mesh.position.y < 5.0) mesh.position.y = 5.0;
    if(mesh.position.y > 30.0) mesh.position.y = 30.0;
    if(mesh.position.x > 50.0) mesh.position.x = 50.0;
    if(mesh.position.x < -50.0) mesh.position.x = -50.0;

    else  mesh.position.y += Math.sin(angleY) * vel; 
}

var n_ring_randring = 5;

function randRing(count){
    if(count == n_ring_randring)return true;

    new_rs= ring_s.clone();
    new_rs.position.z = mesh.position.z;
    new_rs.position.z -= 200.0;
    new_rs.position.x += (Math.random()-0.5)*50;
    if(count > 2) new_rs.position.y += (Math.random())*10;
    scene.add(new_rs);
    
    return false;
}

var timerRing = {};
var rings = {};

var dxr= 1.2;

function MovingRandRing(count){

    rings[count]= ring_s.clone();

    new_rs= rings[count];
    new_rs.position.z = mesh.position.z;
    new_rs.position.z -= 200.0;
    new_rs.position.x += (Math.random()-0.5)*50;

    renderer.setAnimationLoop( function () {
        if(rings[count].position.x > 25.0) dxr= -dxr;
        if(rings[count].position.x < -25.0) dxr= -dxr;
        rings[count].position.x += dxr;
      } );

    scene.add(rings[count]);

    
}

var flag_p = false;
var flag_endlvl = false;

var starting_pos;
var plane_lenght = 2200.0;

function planelvl(){

    if(!flag_p){ //crea il piano
        
        scene.background = new THREE.Color( 0x8FFFFF );

        newPlanematerial = new THREE.MeshBasicMaterial({ map : realgrassTXT , side: THREE.DoubleSide});
        newplane = new THREE.Mesh(new THREE.PlaneGeometry( 100, plane_lenght, 100 ), newPlanematerial);
        newplane.rotation.x = Math.PI/2;
        newplane.position.z = mesh.position.z;
        newplane.position.z -= 1200.0;
        newplane.position.y += 1.0;
        scene.add(newplane);

        

        for(var i = 0; i< 200 ; i+=1){  //da mettere qualcosa che si muove onvece di un albero ogni tanto / monete
            
            newT = tree.clone();
            newT.position.z = mesh.position.z;
            newT.position.z -= (300 + i *9);
            newT.position.x = (Math.random()-0.5) * 95;

            r=Math.random()/2 + 0.5; //tra 1 e 1.5

            newT.scale.y = r

            //if (i ==0){alert(mesh.position.z);        alert(newT.position.z);}
            newT.updateMatrixWorld();   //PER AGGIORANRE LE COLLISIONI
        
            BB_log = new THREE.Box3().setFromObject(newT.children[0]);
        
            collidableTreeBoxes.push(BB_log);
        
            BB_crown = new THREE.Box3().setFromObject(newT.children[1]);

            collidableTreeBoxes.push(BB_crown);
            
            scene.add(newT);
    
            if(i%10 == 0){  //ogni tanto mette sassi cose che si muovono?

                    //TODO

            }
        }
        flag_p = true;
        starting_pos = mesh.position.z ;
    }
    
    if(starting_pos - plane_lenght > mesh.position.z ) {
        flag_p=false;    
        collidableTreeBoxes = [];
        return true;
    }

}

function wait1(count){
    if(count == 1)return true;
    return false;
}




var fun_count = 0;
var mode_idx = 0 ;

function createObs(){

    mode = [planelvl, planelvl, wait1, planelvl, randRing,  MovingRandRing ]; ///TODO SWITCH F

    
    ret_end = (mode[mode_idx])(fun_count);

    if(ret_end){
         mode_idx += 1;
         fun_count = 0;
    }

    fun_count += 1;


}

function remove1life(){
    lifes-=1;
    sprite_ico_array[lifes].material= new THREE.SpriteMaterial( { map: spriteMap, color : 0x00ff00, rotation:Math.PI } );
    scene.add(sprite_ico_array[lifes]);
}

var flagColl=false;

function CheckCollisions(){
    collision = false;

    for(i=0; i<collidableTreeBoxes.length;i++){
    collision = collision || collidableTreeBoxes[i].containsPoint(mesh.position);
    }
  
    if(collision) {

        window.alert("COLLIDE!");

        remove1life();

        //sprite_ico_array[lifes-1].material.color=0x000000;

        flagColl = true;

        currentHex=mesh.material.emissive.getHex();

        mesh.material.emissive.setHex(0xff00ff);
        
        window.setTimeout(function(){ mesh.material.emissive.setHex(  currentHex  );  },500);
        
        window.setTimeout(function(){  mesh.material.emissive.setHex(  0xff00ff  );  },1000);

        window.setTimeout(function(){ mesh.material.emissive.setHex(  currentHex  );  },1500);
        
        window.setTimeout(function(){  mesh.material.emissive.setHex(  0xff00ff  );  },2000);

        window.setTimeout(function(){  mesh.material.emissive.setHex(  currentHex  );  flagColl=false; },3000);
        }
}


var old_pos = 0.0;
var obs_delay = 100.0;

function animate() {
    
  requestAnimationFrame( animate );
  
  moveMesh();  

  var pos = mesh.position.z;

  if( pos < old_pos - obs_delay && pos != 0.0 ) {
      old_pos = pos;
      createObs(); 
      if(vel < maxvel) vel=vel*1.05;
    }
  
  repositionCam();
  
  if(!flagColl)
  CheckCollisions();
  

  


  //group.position.x += 0.01;  

  //if( passed_inside(group.children[1].position) ) group.children[1].material.color.setHex( 0x0fffff );

 
  
  renderer.render( scene, camera );  //render scene + cam

}

// set everything up
init();

// render the scene
animate();



//controller

var map = {87: false, 65: false, 68: false, 83: false,75: false, 76:false };


function goup(){
    if(angleY < Math.PI/4){
    angleY += Math.PI/70;
    mesh.rotation.z = angleY/4;
    }
    //if(vel < maxvel)
    //vel += 0.05
}

function godown(){
    if(angleY > -Math.PI/4){
    angleY -= Math.PI/70;
    mesh.rotation.z = angleY/4;
    }
    //vel -= 0.05
}

function goright(){
    if(angle < -Math.PI/12  ){
    angle += Math.PI/100;
    mesh.rotation.y = -angle;
    }
}

function goleft(){
    if(angle > -11*Math.PI/12  ){
    angle -= Math.PI/100;
    mesh.rotation.y = -angle;
    }
}

function accelerate(){
    if(vel<maxvel)
        vel +=0.02;
}

function decelerate(){
    if(vel>minvel)
        vel -=0.02;
}

function pause(){
    window.alert("gioco in pausa");
}



function Controller(keys, repeat) {
    
    var timers= {};

    // if is pressed for the first time => true + timer to repeat the f
    document.onkeydown= function(event) {
        var key= (event || window.event).keyCode;
        if (!(key in keys))
            return true;
        if (!(key in timers)) {
            timers[key]= null;
            keys[key]();
            if (repeat!==0)
                timers[key]= setInterval(keys[key], repeat);
        }
        return false;
    };

    // Cancel timeout & release key onkeyup

    document.onkeyup= function(event) {
        var key= (event || window.event).keyCode;
        if (key in timers) {
            if (timers[key]!==null)
                clearInterval(timers[key]);
            delete timers[key];
        }
    }

    window.onblur= function() {  //to fix when window unfocused, relase all
        for (key in timers)
            if (timers[key]!==null)
                clearInterval(timers[key]);
        timers= {};
    }
}

Controller({
    87: function() {  goup(); },
    83: function() { godown(); },
    65: function() { goleft();},
    68: function() { goright();},
    32: function() { pause();}
}, 30);



/*
document.onkeydown = function(e) {

    if(e.keyCode in map){
        map[e.keyCode] = true;

        if ( map[87])  goup();

        if ( map[83]) godown();
        
        if ( map[65])  goleft();
        
        if ( map[68])  goright();

        if ( map[75]) accelerate();

        if ( map[76]) decelerate();
        
    }else if(e.keyCode == 32){
        if( Math.abs(vel) < maxvel) 
            vel = vel * 1.1;
    }
}

document.onkeyup = function(e) {
    if(e.keyCode in map){
        map[e.keyCode] = false;
    }
}






    switch (e.keyCode) {

        case 87:  //w
            if(angleY < Math.PI/2)
            angleY += Math.PI/16;
            
            //vel += 0.05
            
            break;

        case 65: //a

            angle -= Math.PI/16;
            mesh.rotation.y = -angle;
            break;

        case 68: //d
            angle += Math.PI/16;
            mesh.rotation.y = -angle;
            break;

        case 83: //s
            if(angleY > -Math.PI/2)
            angleY -= Math.PI/16;
            //vel -= 0.05
            break;

        case 32://space
            if( Math.abs(vel) < maxvel) 
                vel = vel * 1.1;
            break;
    }
   
};


document.onkeyup = function(e) {
    if(e.keyCode == 32)stop = !stop; 
    if(stop)return;

    switch (e.keyCode) {

        case 87:  //w

            dx =0.0;
            
            break;

        case 65: //a

            mesh.position.x -=0.5;
            break;

        case 68: //d
            mesh.position.x +=0.5;
            break;

        case 83: //s
            mesh.position.y -=0.5;
            break;

        case 32://space
            stop = !stop;
            break;
    }
};*/