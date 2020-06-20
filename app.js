var container;
var camera;
var renderer;
var scene;
var mesh;
var stop=false;

var vel = 0.5;
var maxvel = 0.5;
var minvel = -0.3;
var angle = 0.0;
var angleY = 0.0;
var dx = 0.0;
var dz = 0.0;


var ring1;
var ring2;
var ring3;
var plane;

function init() {

    container = document.querySelector( '#scene-container' );

    // the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x8FFCD4 );

    //perspective cam
    const fov = 35; 
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 1000;

    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    //camera = new THREE.OrthographicCamera( 150, 150, 150, 150, -10, 150);  //OrthographicCamera( left , right , top , bottom , near , far  )


    // reposition camera form  0 0 0
    camera.position.set( 0, 0, 50 );

    const p = new THREE.PlaneGeometry( 5, 20, 32 );
    const pM = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

    plane = new THREE.Mesh( p, pM );

    

    const geometry = new THREE.BoxBufferGeometry( 3, 2, 2 );

    const ring = new THREE.TorusGeometry( 10, 1, 5 );

    const sphere = new THREE.SphereGeometry( 2, 8, 8 );

    const material = new THREE.MeshStandardMaterial( { color: 0x800080 } );
    const material2 = new THREE.MeshStandardMaterial( { color: 0x101080 } );

    mesh = new THREE.Mesh( geometry, material );

    const ring1 = new THREE.Mesh( ring, material2 );

    const sphere1 = new THREE.Mesh( sphere, material2 );


    ring1.position.y += 10.0;
    sphere1.position.y += 10.0;


    //ring2.position.x += 20.0;
    //ring2.position.z += 20.0;
    

    group = new THREE.Group();

    group.add( ring1 );
    group.add( sphere1 );

    scene.add( group );

    scene.add(plane);

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


    var controls = new THREE.OrbitControls( camera, renderer.domElement );

    //controls.update(); // have to be called after any manual changes to the camera's transform

    container.appendChild( renderer.domElement ); // add the automatically created <canvas> element to the page
}

function animate() {
  requestAnimationFrame( animate );

  //move
  mesh.position.z += Math.sin(angle) * vel; 
  mesh.position.x += Math.cos(angle) * vel; 
  mesh.position.y += Math.sin(angleY) * vel; 

  group.position.x += 0.01;  
  
  renderer.render( scene, camera );  //render scene + cam

}

// set everything up
init();

// render the scene
animate();


//controller

var map = {87: false, 65: false, 68: false, 83: false,75: false, 76:false };


function goup(){
    if(angleY < Math.PI/2){
    angleY += Math.PI/16;
    mesh.rotation.z = angleY/2;
    }
    //if(vel < maxvel)
    //vel += 0.05
}

function godown(){
    if(angleY > -Math.PI/2){
    angleY -= Math.PI/16;
    mesh.rotation.z = angleY/2;
    }
    //vel -= 0.05
}

function goright(){
    angle += Math.PI/16;
    mesh.rotation.y = -angle;
}

function goleft(){
    angle -= Math.PI/16;
    mesh.rotation.y = -angle;
}

function accelerate(){
    if(vel<maxvel)
        vel +=0.02;
}

function decelerate(){
    if(vel>minvel)
        vel -=0.02;
}


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





    /*
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







 */
/*
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