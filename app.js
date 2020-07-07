var container;
var camera;
var renderer;
var scene;
var mesh;

var vel = 0.0;
var maxvel = 2.5;
var minvel = -0.3;
var Diff_vel = 2.0;  //2nd plane
var angleY = -Math.PI/2;//for Vel not orientation
var angleX = 0.0;
var dx = 0.0;
var dz = 0.0;

var baseAngleY = Math.PI;
var baseangleX = 0;

var ring1;
var ring2;
var ring3;

var three;

//texture
var legnoTXT = new THREE.TextureLoader().load( 'textures/marr.PNG' );
    legnoTXT.wrapS = legnoTXT.wrapT = THREE.RepeatWrapping;
    legnoTXT.offset.set( 1, 0 );
var greenpaintTXT = new THREE.TextureLoader().load( 'textures/green-paint.jpg' );
var realgrassTXT = new THREE.TextureLoader().load( 'textures/lightgrass.jpg' );
    realgrassTXT.wrapS = THREE.RepeatWrapping; 
    realgrassTXT.wrapT = THREE.RepeatWrapping;
    realgrassTXT.repeat.set( 1, 10 );
var grassTXT = new THREE.TextureLoader().load( 'textures/poligrass.jpg' );
    grassTXT.wrapS = THREE.RepeatWrapping; 
    grassTXT.wrapT = THREE.RepeatWrapping;
    grassTXT.repeat.set( 1, 200 );
var giraffeTXT = new THREE.TextureLoader().load( 'textures/giraffeTXT.jpg' );
var facefurTXT = new THREE.TextureLoader().load( 'textures/facefur.jpg' );

//plane 
var long_plane_lenght = 20000;
    Planematerial = new THREE.MeshPhongMaterial({ map : grassTXT , side: THREE.DoubleSide});
    plane = new THREE.Mesh(new THREE.PlaneGeometry( 100, long_plane_lenght, 100 ), Planematerial);
    plane.position.z = -long_plane_lenght/3 ;
    plane.rotation.x = Math.PI/2;


var controls; //Orbit controls, to debug


//Collision arrays
var collidableTreeBoxes = [];  //and rocks
var collidableRingAndBoxes = [];
var lifeBoxes = [];

//BB
var meshBB;
var firstBB;
var secondBB;
var testBB;

//no collision mode
var collision;

//FOG
var background_color= 0x8FFFFF;
var fog_flag = true;

//HP BAR
var sprite_ico_array = [];
var lifes = 5;  
var maxlifes = 5;
var spriteMap;

// SCORE
var score = 0;
var old_score = 0;
ring_score = 150;
light_score = 800;
life_score = 1500;

//LIGHTS
var light;
var spotLight;

//MODELS
var rock;
var boxRock;
var torso;

//PLANES
var bigp = 1;
var normalp = 2;
var smallp = 3;
var choosen_plane = 2; //default plane



var reallog = new THREE.Object3D();

function loadModels(){

    //TEST LOAD MODELLO
     // Instantiate a loader
     var loader = new THREE.GLTFLoader();

     // Load a glTF resource
    { loader.load(// resource URL
         'models/planee/scene.gltf',
         // called when the resource is loaded
         function ( gltf ) {
             gltf.scene.position.y = 0.0;
             gltf.scene.position.x = 0.0;
             gltf.scene.position.z = 0.0;
             gltf.scene.rotation.y = baseAngleY;
             gltf.scene.scale.set(0.75, 1, 1); 

             if(choosen_plane == normalp){
                scene.add(gltf.scene);
                mesh=gltf.scene ;
                lifes=3;
                maxlifes=3;
             }

             //scene.add( gltf.scene );
             gltf.scene; // THREE.Group
             gltf.scenes; // Array<THREE.Group>
             gltf.cameras; // Array<THREE.Camera>
             gltf.asset; // Object
         },
         // called while loading is progressing
         function ( xhr ) {
 
             console.log( 'loading normal plane model' );
 
         },
         // called when loading has errors
         function ( error ) {  console.log( "[MODEL LOADER] " + error );
 
         }
     );
    }

    //REALLOG
     {
    /*
     loader.load(// resource URL
         'models/log/scene.gltf',
         // called when the resource is loaded
         function ( gltf ) {
             
             gltf.scene.position.x = 10.0;
             gltf.scene.position.z =-300.0;
             gltf.scene.position.y = 20.0; 
             gltf.scene.rotation.z = -Math.PI/2;
             gltf.scene.rotation.y = Math.PI/2;
             gltf.scene.scale.set(0.015,0.02,0.02);  //Y X Z
             reallog = gltf.scene ;
             gltf.scene; // THREE.Group
             gltf.scenes; // Array<THREE.Group>
             gltf.cameras; // Array<THREE.Camera>
             gltf.asset; // Object
 
         },
         // called while loading is progressing
         function ( xhr ) {
             console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
         },
         // called when loading has errors
         function ( error ) {
             console.log( "[MODEL LOADER] " + error ); 
         }
     );
        */
       }

     loader.load(
        'models/rocks/scene.gltf',
        function ( gltf ) {
            gltf.scene.position.y = 0.0;
            gltf.scene.position.x = 10.0;
            gltf.scene.position.z =0.0;
            gltf.scene.scale.set(0.02,0.04,0.02);
           
            scene.add( gltf.scene );

            window.rock=gltf.scene;

            boxRock = new THREE.Box3().setFromObject(rock);

            collidableTreeBoxes.push(boxRock);

            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            
        },
        // called while loading is progressing
        function ( xhr ) {

            console.log( 'loading rock model' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( "[MODEL LOADER] " + error );

        }
    );

    loader.load(
        'models/statue/scene.gltf',
        function ( gltf ) {
            gltf.scene.position.y = 10.0;
            gltf.scene.position.x = 0.0;
            gltf.scene.scale.set(14,18,14);
            window.statue =  gltf.scene;

            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            
        },
        function ( xhr ) {   console.log( 'loading statue model' );    },
        function ( error ) { console.log( "[MODEL LOADER] " + error );   }
    );

    loader.load(
        'models/bigPlane/scene.gltf',
        function ( gltf ) {
            gltf.scene.position.y = 0.0;
            gltf.scene.position.x = -10.0;
            gltf.scene.position.z = 0.0;
            gltf.scene.scale.set(0.015,0.015,0.015);
            gltf.scene.rotation.y = baseAngleY;
            

            if(choosen_plane == bigp){
                scene.add( gltf.scene);
                lifes=5;
                maxlifes=5;
                mesh=gltf.scene;
            }

            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object
            
        },
        function ( xhr ) {   console.log( 'loading big plane model' );    },
        function ( error ) {    console.log( "[MODEL LOADER] " + error );  } );

    loader.load(
        'models/paperPlane/scene.gltf',
        function ( gltf ) {
            gltf.scene.position.y = -10.0;
            gltf.scene.position.x = -5.0;
            gltf.scene.position.z = 0.0;
            gltf.scene.scale.set(0.6,0.4,0.4);

            if(choosen_plane == smallp){
                scene.add( gltf.scene);
                lifes=1;
                maxlifes=1;
                baseAngleY=0.0;
                mesh=gltf.scene;
            }

            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object  
        },
        function ( xhr ) {
            console.log( 'loading paper plane model' );

        },
        function ( error ) {
            console.log( "[MODEL LOADER] " + error );
        }
    );

    loader.load(
        'models/cloud/scene.gltf',
        function ( gltf ) {
            gltf.scene.position.y = 10.0;
            gltf.scene.position.z = -100.0;
            gltf.scene.scale.set(5,5,5);

            window.cloud = gltf.scene ;

            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object  
        },
        function ( xhr ) {
            console.log( 'loading paper plane model' );

        },
        function ( error ) {
            console.log( "[MODEL LOADER] " + error );
        }
    );
}


function init() {

    // Container element that hold the scene
    container = document.getElementById('scene-container');

    // create a Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( background_color );

    //perspective cam
    const fov = 35; 
    const aspect = container.clientWidth / container.clientHeight;
    const near = 20;
    const far = 500;

    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    //camera = new THREE.OrthographicCamera( 150, 150, 150, 150, -10, 150);  
    //OrthographicCamera( left , right , top , bottom , near , far  )


    // reposition camera form  0 0 0
    camera.position.set( 0, 20, 70 );
    camera.lookAt( scene.position );

    // create mesh geometry

    const geometry = new THREE.BoxBufferGeometry( 10, 3, 5 );

    const material = new THREE.MeshStandardMaterial( { color: 0x800080 } );

    mesh = new THREE.Mesh( geometry, material );
    mesh.rotation.y = -Math.PI/2;
    mesh.position.z=300;

    loadModels();
    
    //-----// RING model //-----//

    const material2 = new THREE.MeshPhongMaterial ( { color: 0xdfdf03 } );

    const ring1 = new THREE.Mesh( new THREE.TorusGeometry( 5, 1, 4  ) , material2 );

    const sphere1 = new THREE.Mesh( new THREE.SphereGeometry( 1, 3, 1 ) , material2 );
    
    ring1.position.y += 10.0;

    sphere1.position.y += 10.0;
    
    ring_s = new THREE.Group();

    ring_s.add( ring1 );
    ring_s.add( sphere1 );
    //scene.add( ring_s );


    //-----// TREE model //-----//

    tree = new THREE.Group(); 

    log = new THREE.Mesh( new THREE.BoxBufferGeometry( 7, 30, 7 ), new THREE.MeshPhongMaterial ({ map : legnoTXT }) );

    tree.add( log );
    
    // TEST CON new THREE.SphereGeometry( 12, 4, 5 ,3 ,10 ,3 ,6)
    crown = new THREE.Mesh( new THREE.BoxBufferGeometry( 20, 15, 20 ), new THREE.MeshPhongMaterial({ map : greenpaintTXT }) ) ;

    crown.position.y=20.0;

    tree.add(crown);

    topcrown = new THREE.Mesh( new THREE.BoxBufferGeometry( 16, 3, 16 ), new THREE.MeshPhongMaterial({ map : greenpaintTXT }) ) ;

    topcrown.position.y=9.0;

    crown.add(topcrown);

    smallLog = new THREE.Mesh( new THREE.BoxBufferGeometry( 2, 10, 2 ), new THREE.MeshPhongMaterial ({ map : legnoTXT }) );
    smallLog.position.y=10.0;
    smallLog.position.x=-5.0;
    smallLog.rotation.z=Math.PI/4;
    tree.add(smallLog);

    smallLog = new THREE.Mesh( new THREE.BoxBufferGeometry( 2, 10, 2 ), new THREE.MeshPhongMaterial ({ map : legnoTXT }) );
    smallLog.position.y=10.0;
    smallLog.position.x=5.0;
    smallLog.rotation.z=-Math.PI/4;
    tree.add(smallLog);

    tree.position.z = -500.0;
    tree.position.y = 10.0;
    tree.position.x = 35.0;

    scene.add(tree);    

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


    //-----//  giraffe  //-----//

    torso = new THREE.Mesh( new THREE.BoxBufferGeometry( 9, 8, 25 ), new THREE.MeshPhongMaterial ({ map : giraffeTXT }) );

    torso.position.z = -150;
    torso.position.y = 15;

    left_upper_arm = new THREE.Mesh( new THREE.BoxBufferGeometry( 2, 8, 4 ), new THREE.MeshPhongMaterial ({ map : giraffeTXT }) );
    left_upper_arm.position.x += 5;
    left_upper_arm.position.y -=3;
    left_upper_arm.position.z +=9;

    torso.add(left_upper_arm);

    left_lower_arm = new THREE.Mesh( new THREE.BoxBufferGeometry( 1.5, 6.2, 1.5 ), new THREE.MeshPhongMaterial ({ map : giraffeTXT }) );

    left_lower_arm.position.y -=6;
    left_upper_arm.add(left_lower_arm);

    left_lower_arm_paw = new THREE.Mesh( new THREE.CylinderGeometry( 1.2, 1.5 ,2 ,4 ), new THREE.MeshPhongMaterial ({ color: 0x302217 }) );
    //left_lower_arm_paw.position.z +=1;
    left_lower_arm_paw.rotation.y = Math.PI/4;
    left_lower_arm_paw.position.y -=4;
    left_lower_arm.add(left_lower_arm_paw);

    right_upper_arm = left_upper_arm.clone();
    right_upper_arm.position.x -=10;
    torso.add(right_upper_arm);

    left_upper_leg= left_upper_arm.clone();
    left_upper_leg.position.z -=18;
    torso.add(left_upper_leg);

    right_upper_leg = left_upper_leg.clone();
    right_upper_leg.position.x -=10;
    torso.add(right_upper_leg);

    lower_neck =  new THREE.Mesh( new THREE.CylinderGeometry( 4, 5, 8 ,4 ), new THREE.MeshPhongMaterial ({ map : giraffeTXT }) );
    lower_neck.rotation.y = Math.PI/4;
    //lower_neck.rotation.x = Math.PI/32;
    lower_neck.position.y += 6;
    lower_neck.position.z += 8;
    torso.add(lower_neck);

    upper_neck = new THREE.Mesh( new THREE.BoxBufferGeometry( 4 , 13, 5 ), new THREE.MeshPhongMaterial ({ map : giraffeTXT }) );
    upper_neck.rotation.y = -Math.PI/4;
    upper_neck.position.y +=10;
    lower_neck.add(upper_neck);

    head = new THREE.Mesh( new THREE.CylinderGeometry( 2.5,  3, 4, 4 ), new THREE.MeshPhongMaterial ({ map : giraffeTXT }) );
    head.scale.z = 1.4 ;
    head.scale.x = 1.4 ;
    //head.rotation.x = -Math.PI/42;
    head.rotation.y = Math.PI/4;
    
    head.position.y +=8;
    head.position.z +=0.5;
    upper_neck.add(head);
    
    front_head = head.clone();
    front_head.material = new THREE.MeshPhongMaterial ({ map : facefurTXT });
    front_head.scale.x = 0.8;
    front_head.scale.y = 0.6;
    front_head.scale.z = 0.8;
    front_head.position.y -= 1.0;
    front_head.position.z += 4;
    upper_neck.add(front_head);

    //G_neck_Box = new THREE.Box3().setFromObject(upper_neck); 

    left_horn = new THREE.Mesh( new THREE.BoxBufferGeometry( 0.5, 0.5, 2.7 ), new THREE.MeshPhongMaterial ({ color: 0x8A4117}) );
    left_horn.position.y += 2.5;
    left_horn.position.z += -0.6;
    left_horn.position.x += 1.9;
    left_horn.rotation.z += Math.PI/4;
    left_horn.rotation.x += Math.PI/2;

    head.add(left_horn);

    right_horn = left_horn.clone();
    right_horn.position.z += -1.2;
    right_horn.position.x -= 1.2;
    head.add(right_horn);

    left_eye = new THREE.Mesh( new THREE.BoxBufferGeometry( 0.6, 0.8, 0.81 ), new THREE.MeshLambertMaterial ({ color: 0x111111  }) );
    left_eye.position.y += 1.5;
    left_eye.position.z += 2.1;
    left_eye.position.x += -0.4;
    left_eye.rotation.z += Math.PI/4;
    left_eye.rotation.x += Math.PI/2;
    head.add(left_eye);

    right_eye = left_eye.clone();
    right_eye.position.z += -1.4;
    right_eye.position.x += -1.8;
    head.add(right_eye);


    tail = new THREE.Mesh( new THREE.BoxBufferGeometry(1,5, 1 ), new THREE.MeshPhongMaterial ({ color: 0x8A4117 }) );
    tail.position.x += 0;
    tail.position.y -= 2;
    tail.position.z -= 13;
    tail.rotation.x = Math.PI/8;
    torso.add(tail);

    //torso.rotation.y = Math.PI/2;

    //scene.add(torso);



    // create a WebGLRenderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( container.clientWidth, container.clientHeight );
    renderer.setPixelRatio( window.devicePixelRatio );


    //ORBIT//
    //controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.update(); // have to be called after any manual changes to the camera's transform


    // add the automatically created <canvas> element to the page
    container.appendChild( renderer.domElement ); 


    //HEALTH SPRITE//
    spriteMap = new THREE.TextureLoader().load( "textures/heart.png" );
    var spriteMaterial = new THREE.SpriteMaterial( { map : spriteMap } );
    spriteMaterial.rotation=Math.PI;
    sprite_ico = new THREE.Sprite( spriteMaterial );
    
    for(var i =0;i < maxlifes; i++){
        sprite_ico_array[i]= new THREE.Sprite( new THREE.SpriteMaterial( { map : spriteMap, rotation : Math.PI } ) );
        if(i+1>lifes)
        sprite_ico_array[i].material= new THREE.SpriteMaterial( { map: spriteMap, color : 0x00ffff, rotation:Math.PI } );
        scene.add(sprite_ico_array[i]);
    }


    //FOG
    if(fog_flag) scene.fog = new THREE.Fog( 0x8FFFFF, 300, 400 );

    ////

    // Create a directional light
    light = new THREE.DirectionalLight( 0xaaaaaa, 1.25);
    light.position.set( 30, 30, 30 ); //move light up 
    scene.add( light );

    spotLight = new THREE.SpotLight( 0x888855, 1 );

        spotLight.position.set( 0, -10, -300 );
        spotLight.angle = Math.PI / 10;
        spotLight.penumbra = 0.05;
        spotLight.decay = 0.0;
        spotLight.distance = 200;
        spotLight.target.position.set(0,-100,-1000);
        spotLight.target.updateMatrixWorld();
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = -10;
        spotLight.shadow.camera.far = -200;
    
        scene.add( spotLight );

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

    spotLight.position.set( mesh.position.x, mesh.position.y, mesh.position.z );
    spotLight.target.position.set(  mesh.position.x + Math.cos(angleY),
                                    mesh.position.y + Math.sin(angleX)/5, 
                                    mesh.position.z + Math.sin(angleY));
    spotLight.target.updateMatrixWorld();
}

function moveMesh(){
    //move
    mesh.position.z += Math.sin(angleY) * vel; 
    mesh.position.x += Math.cos(angleY) * vel; 
    if(mesh.position.y < 5.0) mesh.position.y = 5.0;
    if(mesh.position.y > 40.0) mesh.position.y = 40.0;
    if(mesh.position.x > 50.0) mesh.position.x = 50.0;
    if(mesh.position.x < -50.0) mesh.position.x = -50.0;

    else  mesh.position.y += Math.sin(angleX) * vel; 
}

var n_ring_randring = 15; //min 3 or overlaps!

var timerRing = {};
var rings = {};

var dxr= 0.0;
var dyr= 0.0;

var new_rock;

function createRock(x,y,z){
    new_rock = window.rock.clone();
    new_rock.position.x = x;
    new_rock.position.y = y;
    new_rock.position.z = z;
    scene.add(new_rock);
    new_rock.updateMatrixWorld();  
    boxRock = new THREE.Box3().setFromObject(new_rock);
    collidableTreeBoxes.push(boxRock);
}


function MovingRandRing(count){  
    if(count==0)collidableRingAndBoxes=[];
    if(count == n_ring_randring){renderer.setAnimationLoop( 
                                    function (){});
                                    setTimeout(() => {
                                        collidableRingAndBoxes= []; 
                                    }, 3000); 
                                    return true;}

    //createRock(-1,0,-200);

    rings[count]= ring_s.clone();

    new_rs= rings[count];
    new_rs.name = count;
    new_rs.position.z = mesh.position.z;
    new_rs.position.z -= 280.0;
    new_rs.position.x += (Math.random()-0.5)*50;
    new_rs.position.y = (Math.random()-0.4)*10;

    ////

    if(count>3) dxr = 1.2;
    if(count>7) dyr = 0.8;
    if(count>12) dyr += 0.5;
    
    BB_ring = new THREE.Box3().setFromObject(new_rs).expandByScalar(1); 

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

    if(count%2 == 0){
        xr = mesh.position.x +(Math.random()-0.5)*25
        if(xr > 50.0 ) xr = 50.0 
        if(xr < -50.0 ) xr = -50.0 
        createRock(xr ,-1,mesh.position.z -400);
    }
 
}

var flag_p = false;
var flag_endlvl = false;

var starting_pos;
var n_tree= 100;
var space = 20;
var plane_lenght = n_tree * space;

function treelvl(){

    if(!flag_p){ 
        //plane under the trees
        //newPlanematerial = new THREE.MeshPhongMaterial({ map : realgrassTXT , side: THREE.DoubleSide});
        //newplane = new THREE.Mesh(new THREE.PlaneGeometry( 100, n_tree*space , 100 ), newPlanematerial);
        //newplane.rotation.x = Math.PI/2;
        //newplane.position.z = mesh.position.z;
        //newplane.position.z -= 1000.0;
        //newplane.position.y += 1.0;
        //scene.add(newplane);
        
        for(i = 0; i< n_tree ; i+=1){  //forest obstacles
            
            newT = tree.clone();
            newT.position.z = mesh.position.z;
            newT.position.z -= (400 + i *  space );  
            newT.position.x = (Math.random()-0.5) * 95; 

            r=Math.random()/2 + 0.8; //tra 1 e 1.5

            newT.scale.y = r

            newT.updateMatrixWorld();   //PER AGGIORANRE LE COLLISIONI     
            
            if(i%10==0){
                createRock(newT.position.x ,-1,newT.position.z);
                createRock((newT.position.x + 25.0) % 40 ,-1,newT.position.z);
            }
            else{
                BB_log = new THREE.Box3().setFromObject(newT.children[0]).expandByScalar(1.5);  //
                collidableTreeBoxes.push(BB_log);
                BB_crown = new THREE.Box3().setFromObject(newT.children[1]).expandByScalar(1.2);   
                collidableTreeBoxes.push(BB_crown);
                scene.add(newT);
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

function end(){
    //window.alert("end");
    fun_count=0;
}

var interval;

function lifewell(x,y,z){ //life cube

    new_r = new THREE.Mesh( new THREE.BoxBufferGeometry( 10, 10, 10 ),  new THREE.MeshStandardMaterial( { map: spriteMap } ) );
    new_r.position.x = x;
    new_r.position.y = y;
    new_r.position.z = z;
    new_r.rotation.z = Math.PI;

    var interval = setInterval(() => {
        new_r.rotation.y += Math.PI/32;
    }, 50);
    setTimeout(() => {
        clearInterval(interval);
    }, 10000);

    new_r.updateMatrixWorld();

    box = new THREE.Box3().setFromObject(new_r);

    lifeBoxes.push([new_r,box]);
    
    scene.add(new_r);

    return true;
}

function lifelvl(count){
    if(count==1){
    
    z= mesh.position.z - 500;

    create_giraffe(0,z + 75);

    statue = window.statue.clone();
    statue.position.x = 20;
    statue.position.z = z ;
    statue.rotation.y = -Math.PI/12;
    scene.add(statue);

    boxStatue = new THREE.Box3().setFromObject( statue );
    collidableTreeBoxes.push(boxStatue);

    statue = window.statue.clone();
    statue.position.x = -20;
    statue.position.z = z ;
    statue.rotation.y = Math.PI/12;
    scene.add(statue);

    boxStatue = new THREE.Box3().setFromObject( statue );
    collidableTreeBoxes.push(boxStatue);
    
    createRock(30,-1,z+10);
    createRock(-30,-1,z+10);
    createRock(10,-1,z-5);
    createRock(-10,-1,z-5);

    lifewell(  0, 20, z );
    }
    if(count==3)return true;
    else return false;
}

function changeLight(count){
    if(background_color == 0x11110F)background_color = 0x8FFFFF;
    else background_color = 0x11110F;
    
    scene.background = new THREE.Color( background_color );
    if(fog_flag)
    scene.fog = new THREE.Fog( background_color, 200, 300 );

    if(light.intensity==0.1)light.intensity=1.25;
    else light.intensity = 0.1;

    score += light_score;
    vel += 0.25;
    return true;
}

function start(count){

    if(count ==1){
        
        return true;
    }
}


function create_giraffe(x,z){
    
    new_giraffe = torso.clone();
    new_giraffe.position.x = x;
    new_giraffe.position.z = z;
    scene.add(new_giraffe);

    G_torso_Box = new THREE.Box3().setFromObject(new_giraffe); 
    G_torso_Box.min.z += 10;
    collidableTreeBoxes.push(G_torso_Box);

    var beta = -Math.PI/40;

    delta_x =  0.8;
    delta_z = 1;

    var interv = setInterval(() => {
        if(new_giraffe.position.x > mesh.position.x + 1.8 ){
            new_giraffe.rotation.y = - Math.PI/80;
            new_giraffe.position.x -= delta_x; 
            G_torso_Box.translate(new THREE.Vector3( -delta_x, 0, 0 ));
        }else if(new_giraffe.position.x < mesh.position.x  - 1.8){
            new_giraffe.rotation.y = Math.PI/80;
            new_giraffe.position.x += delta_x ; 
            G_torso_Box.translate(new THREE.Vector3( delta_x, 0, 0 ));
        }else {
            new_giraffe.rotation.y = 0;
        }

        if(new_giraffe.children[0].rotation.x > -Math.PI/12) beta = -beta;
        if(new_giraffe.children[0].rotation.x < Math.PI/12) beta = -beta;

        new_giraffe.children[0].rotation.x += beta;
        new_giraffe.children[1].rotation.x -= beta;
        new_giraffe.children[2].rotation.x += beta;
        new_giraffe.children[3].rotation.x -= beta;
        new_giraffe.position.z += delta_z ; 

        G_torso_Box.translate(new THREE.Vector3( 0, 0, delta_z ));
        
       if(new_giraffe.position.z > mesh.position.z - 10 )clearInterval(interv);
    }, 50);

}

var fun_count = 0;
var mode_idx = 0 ;

function createObs(){

    mode = [ MovingRandRing, treelvl, wait1, wait1 , lifelvl, wait1, wait1, changeLight ]; ///TODO SWITCH F

    ret_end = (mode[mode_idx])(fun_count);

    if(ret_end){
         mode_idx += 1;
         fun_count = 0;
         
    }
    if(mode_idx >= mode.length) mode_idx = 0;  //repeat

    fun_count += 1;

    if(mesh.position.z - 4000  < -long_plane_lenght) { //if the plane ends
        plane.position.z = mesh.position.z ;
    }

}

function remove1life(){
    lifes-=1;
    if(lifes==0){ endgame(); return;}
    sprite_ico_array[lifes].material.color.r=0.0;
}

function gain1life(){
    if(lifes==maxlifes){score += life_score; return;}
    sprite_ico_array[lifes].material.color.r=1.0;
    lifes+=1;
}

var flagColl=false;
var last_coll = -1;

var life_flag_coll = true;


function CheckCollisions(){
    collision = false;

    for(i=0; i<collidableTreeBoxes.length;i++){
    collision = collision || collidableTreeBoxes[i].containsPoint(mesh.position);
    }
  
    if(collision && !flagColl) {

        //window.alert("COLLISION!");

        remove1life();

        //sprite_ico_array[lifes-1].material.color=0x000000;

        flagColl = true;

        mesh.visible = false;
        
        window.setTimeout(function(){ mesh.visible = true; sprite_ico_array[lifes].material.color.r=1.0; },300);
        
        window.setTimeout(function(){ mesh.visible = false; sprite_ico_array[lifes].material.color.r=0.0; },600);

        window.setTimeout(function(){ mesh.visible = true; sprite_ico_array[lifes].material.color.r=1.0; },900);
        
        window.setTimeout(function(){  mesh.visible = false; sprite_ico_array[lifes].material.color.r=0.0; },1200);

        window.setTimeout(function(){  mesh.visible = true;  flagColl=false; },1800);
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
        
        if(last_coll != idx_col) {last_coll = idx_col; score+=ring_score; }
    }

    if(life_flag_coll)
    for (i=0;i<lifeBoxes.length;i++){
        if(lifeBoxes[i][1].containsPoint(mesh.position) && life_flag_coll ){
            life_flag_coll = false; //no subsequent life coll
            gain1life();
            scene.remove(lifeBoxes[i][0]);
            window.setTimeout(function(){ life_flag_coll=true; },200);
        }
    }
}


function createCloud() {
    if(Math.random()<0.8){
        r = Math.random();
        cloud = window.cloud.clone();
        cloud.scale.set(5+5*r,5+5*r,5+5*r);
        cloud.position.x = r > 0.5 ? -130 : 130 ;
        cloud.position.y = 20.0 + r * 10;
        cloud.position.z = mesh.position.z - 400.0;
        cloud.rotation.y = -Math.PI/1.8 + (0.4*r);
        scene.add(cloud)
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
      createCloud();
      //if(vel < maxvel) vel=vel*1.01; 
    }
  
  repositionCam();
  
  CheckCollisions();

  renderer.render( scene, camera );  //render scene + cam

  //score
  if(old_score != score )  {
  document.getElementById("info").innerHTML =score;
  old_score =score;
  }
}

function start(){
    document.getElementById("info").style.display="block";
    
    document.getElementById("scene-container").style.display = "block";
    //document.body.style.cursor = 'none';
    document.getElementById("menu").style.display="none";
    init();
    // render the scene
    animate();

    setTimeout(() => {
        vel=Diff_vel; //short delay before it starts
    }, 1000);
    
}





//controller
{
    var map = {87: false, 65: false, 68: false, 83: false,75: false, 76:false };


    function goup(){
        if(angleX < Math.PI/4){
        angleX += Math.PI/70;
        mesh.rotation.x =  angleX/4;
        }
    }

    function godown(){
        if(angleX > -Math.PI/4){
        angleX -= Math.PI/70;
        mesh.rotation.x =  angleX/4;
        }
    }

    function goright(){
        if(angleY < -Math.PI/12  ){
        angleY += Math.PI/100;
        mesh.rotation.y = -angleY + Math.PI/2 + baseAngleY + Math.PI  ;
        }
    }

    function goleft(){
        if(angleY > -11*Math.PI/12  ){
        angleY -= Math.PI/100;
        mesh.rotation.y = -angleY + Math.PI/2 + baseAngleY + Math.PI ;
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

    document.addEventListener('keydown', function(event){
        if(event.keyCode == 76) spotLight.intensity = (spotLight.intensity+1 )% 2;
        } );

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

}