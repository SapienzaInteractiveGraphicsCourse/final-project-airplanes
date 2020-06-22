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
plane = new THREE.Mesh(new THREE.PlaneGeometry( 100, 20000, 100 ), Planematerial);
plane.rotation.x = Math.PI/2;

var controls;

var collidableObject = [];  //TODO

var collidableTreeBoxes = [];  //TODO
var collidableRingAndBoxes = [];
var lifeBoxes = [];


var meshBB;
var firstBB;
var secondBB;
var testBB;

var collision;


//FOG
var fog_flag = true;


//HP BAR
var sprite_ico_array = [];
var lifes = 4;  //TODO DIFFICULTY
var maxlifes = 5;
var spriteMap;


// SCORE
var score = 0;
var loop = 0;

function init() {

    // Container element that hold the scene
    container = document.getElementById('scene-container');

    // create a Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x8FFFFF );

    //perspective cam
    const fov = 35; 
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.5;
    const far = 1000;

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
    


    const material2 = new THREE.MeshStandardMaterial( { color: 0xdfdf03 } );

    const ring1 = new THREE.Mesh( new THREE.TorusGeometry( 5, 1, 4  ) , material2 );

    const sphere1 = new THREE.Mesh( new THREE.SphereGeometry( 1, 3, 1 ) , material2 );
    
    ring1.position.y += 10.0;

    sphere1.position.y += 10.0;
    
    ring_s = new THREE.Group();

    ring_s.add( ring1 );

    ring_s.add( sphere1 );

    scene.add( ring_s );


    tree = new THREE.Group(); 

    log = new THREE.Mesh( new THREE.BoxBufferGeometry( 7, 30, 7 ), new THREE.MeshLambertMaterial ({ map : legnoTXT }) );

    tree.add(log);
    
    crown = new THREE.Mesh( new THREE.BoxBufferGeometry( 20, 15, 20 ), new THREE.MeshLambertMaterial({ map : greenpaintTXT }) ) ;

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
    


    scene.add(tree); //4DEBUGGING



    scene.add( plane );

    scene.add( mesh );


    // Create a directional light and add it to the scene
    const light = new THREE.DirectionalLight( 0xaaaaaa, 5.0 );
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
    
    for(var i =0;i < maxlifes; i++){
        sprite_ico_array[i]= new THREE.Sprite( new THREE.SpriteMaterial( { map : spriteMap, rotation : Math.PI } ) );
        if(i+1>lifes)
        sprite_ico_array[i].material= new THREE.SpriteMaterial( { map: spriteMap, color : 0x00ff00, rotation:Math.PI } );
        scene.add(sprite_ico_array[i]);
    }


    
    


    //FOG
    if(fog_flag) scene.fog = new THREE.Fog( 0x8FFFFF, 200, 300 );


    //TEST LOAD MODELLO



}




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
}

function moveMesh(){
    //move
    mesh.position.z += Math.sin(angle) * vel; 
    mesh.position.x += Math.cos(angle) * vel; 
    if(mesh.position.y < 5.0) mesh.position.y = 5.0;
    if(mesh.position.y > 40.0) mesh.position.y = 40.0;
    if(mesh.position.x > 50.0) mesh.position.x = 50.0;
    if(mesh.position.x < -50.0) mesh.position.x = -50.0;

    else  mesh.position.y += Math.sin(angleY) * vel; 
}

var n_ring_randring = 15; //min 3 or overlaps!


function randRing(count){

    if(count==0)collidableRingAndBoxes=[];
    if(count == n_ring_randring){return true;}

    new_rs= ring_s.clone();
    new_rs.position.z = mesh.position.z;
    new_rs.position.z -= 200.0;
    new_rs.position.x += (Math.random()-0.5)*50;
    if(count > 2) new_rs.position.y += (Math.random())*10;
    scene.add(new_rs);

    
    BB_ring = new THREE.Box3().setFromObject(new_rs).expandByScalar(1);

    collidableRingAndBoxes.push([count,BB_ring]);
    
    return false;
}

var timerRing = {};
var rings = {};

var dxr= 0.0;
var dyr= 0.0;

function MovingRandRing(count){   //TODO True quando finisce
 
    if(count==0)collidableRingAndBoxes=[];
    if(count == n_ring_randring)return true;

    rings[count]= ring_s.clone();

    new_rs= rings[count];
    new_rs.name = count;
    new_rs.position.z = mesh.position.z;
    new_rs.position.z -= 250.0;
    new_rs.position.x += (Math.random()-0.5)*50;
    new_rs.position.y = (Math.random()-0.4)*10;
    if(count>3) dxr = 1.2;
    if(count>6) dyr = 0.8;

    BB_ring = new THREE.Box3().setFromObject(new_rs).expandByScalar(1); 

    new_rs.userData=BB_ring;

    renderer.setAnimationLoop( function () {
        if(rings[count].position.x > 30.0) dxr= -dxr;
        if(rings[count].position.x < -30.0) dxr= -dxr;
        if(rings[count].position.y > 20.0) dyr= -dyr;
        if(rings[count].position.y < -5.0) dyr= -dyr;
        rings[count].position.x += dxr;
        rings[count].position.y += dyr;
        BB_ring.translate(new THREE.Vector3( dxr, dyr, 0 ));
      } );

    scene.add(rings[count]);

    
     
    collidableRingAndBoxes.push([count,BB_ring]);

 
}

var flag_p = false;
var flag_endlvl = false;

var starting_pos;
var plane_lenght = 2200.0;

function treelvl(){

    if(!flag_p){ //crea il piano
        
        newPlanematerial = new THREE.MeshBasicMaterial({ map : realgrassTXT , side: THREE.DoubleSide});
        newplane = new THREE.Mesh(new THREE.PlaneGeometry( 100, plane_lenght, 100 ), newPlanematerial);
        newplane.rotation.x = Math.PI/2;
        newplane.position.z = mesh.position.z;
        newplane.position.z -= 1200.0;
        newplane.position.y += 1.0;
        //scene.add(newplane);

        
        
        for(i = 0; i< 200 ; i+=1){  //da mettere qualcosa che si muove onvece di un albero ogni tanto / monete
            
            newT = tree.clone();
            newT.position.z = mesh.position.z;
            newT.position.z -= (300 + i *9);
            newT.position.x = (Math.random()-0.5) * 95;

            r=Math.random()/2 + 0.8; //tra 1 e 1.5

            newT.scale.y = r

            //if (i ==0){alert(mesh.position.z);        alert(newT.position.z);}
            newT.updateMatrixWorld();   //PER AGGIORANRE LE COLLISIONI
        
            BB_log = new THREE.Box3().setFromObject(newT.children[0]).expandByScalar(1.5);  //TODO respect the model

            collidableTreeBoxes.push(BB_log);
        
            BB_crown = new THREE.Box3().setFromObject(newT.children[1]).expandByScalar(1);

            collidableTreeBoxes.push(BB_crown);
            
            scene.add(newT);
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
    window.alert("wait");
    if(count == 1)return true;
    return false;
}

function end(){
    //window.alert("end");
    fun_count=0;
}

function lifewell(){

    new_r= mesh.clone();
    new_r.position.z = mesh.position.z;
    new_r.position.x = 5.0;
    new_r.position.y = 5.0;
    new_r.position.z -= 100.0;

    box = new THREE.Box3().setFromObject(new_r);

    lifeBoxes.push(box);
    
    scene.add(new_r);

    return true;
}


var fun_count = 0;
var mode_idx = 0 ;

function createObs(){

    mode = [ lifewell ,end ]//, MovingRandRing, wait1,  treelvl, wait1,  MovingRandRing, treelvl ]; ///TODO SWITCH F

    
    ret_end = (mode[mode_idx])(fun_count);

    if(ret_end){
         mode_idx += 1;
         fun_count = 0;
         
    }

    fun_count += 1;


}

function remove1life(){
    lifes-=1;
    sprite_ico_array[lifes].material.color.r=0.0;
}

function gain1life(){
    if(lifes==maxlifes)return;
    sprite_ico_array[lifes].material.color.r=1.0;
    lifes+=1;
}

var flagColl=false;
var last_coll = -1;

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
    
    ring_coll = false;
    idx_col = -1;

    for(i=0; i<collidableRingAndBoxes.length;i++){ 
        ring_coll = ring_coll || collidableRingAndBoxes[i][1].containsPoint(mesh.position);  //[1] perché coppie
        if(ring_coll){
            idx_col= collidableRingAndBoxes[i][0];
            ring_coll = false;
        }
    }

    if(idx_col != -1){
        scene.remove( scene.getObjectByName(idx_col) );//collidableRingAndBoxes[idx_col][0]);
        
        if(last_coll != idx_col) {last_coll = idx_col; score+=10;}
    }

    for (i=0;i<lifeBoxes.length;i++){
        if(lifeBoxes[i].containsPoint(mesh.position) )
            {
            lifes+=1;   
            
            sprite_ico_array[lifes].material= new THREE.SpriteMaterial( { map: spriteMap, color : 0xffffff, rotation:Math.PI } );
            scene.add(sprite_ico_array[lifes]);

            window.alert();  //TODO GAIN LIFE
            }
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
      if(vel < maxvel) vel=vel*1.01;
    }
  
  repositionCam();
  
  if(!flagColl)
  CheckCollisions();
    
  renderer.render( scene, camera );  //render scene + cam

  //score
  loop+=1;
  if(loop % 10 == 0)  score +=0;
  //document.getElementById("info").innerHTML =score;
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
}

function godown(){
    if(angleY > -Math.PI/4){
    angleY -= Math.PI/70;
    mesh.rotation.z = angleY/4;
    }
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

