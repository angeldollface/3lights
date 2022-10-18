// Standard three.js import.
import * as THREE from 'three';

// Importing the GLTF 2.0 loader.
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Importing the shader for object glow-up.
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

// Importing the orbit controls.
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Importing the "composer" to slap a filter on our scene.
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

// Importing the filter.
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Importing the environment for rendering, lighting, etc.
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { Camera, Scene } from 'three';
import { Renderer } from 'vue';

// A function to render our models.
export function renderModel(): void {

    // We make a new three.js scene.
    let scene: Scene = new THREE.Scene();

    // We make a new camera. Something has
    // to look at our scene.
    let camera: Camera = new THREE.PerspectiveCamera(
        75, // Angle.
        window.innerWidth/window.innerHeight, // FOV.
        0.01,
        1000
    );

    // Setting the background color.
    scene.background = new THREE.Color(0x241830);

    // Something has to render our scene.
    // We use the "standard" WebGL renderer.
    var renderer = new THREE.WebGLRenderer(
        {
          antialias: true
        }
    );

    // We set the width of and height of the renderer.
    renderer.setSize(window.innerWidth, window.innerHeight);

    // We add some controls for some fun. ;)
    const controls = new OrbitControls(camera, renderer.domElement);

    // We add the renderer to the document.
    document.body.appendChild(renderer.domElement);

    // We make a new environment to render the scene in.
    // Courtesy of Don McCurdy.
    const environment = new RoomEnvironment();

    // Not sure what this does.
    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    // A shader?
    const renderScene = new RenderPass( scene, camera );

    // Parameters for making named objects emit light.
    const params = {
        exposure: 0.5,
        bloomStrength: 0.8,
        bloomThreshold: 0,
        bloomRadius: 0.0001
    };

    // A shader to make individual meshes glow up. (Pillars on the corners.)
	const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
	bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
	bloomPass.radius = params.bloomRadius;

    // We use a composer instead of the standard renderer
    // and add relevant data, because the shader is a "filter"
    // on the scene.
    var composer = new EffectComposer( renderer );
	composer.addPass( renderScene );
	composer.addPass( bloomPass );

    // And generate the scene from an environment.
    scene.environment = pmremGenerator.fromScene( environment ).texture;

    // Since the model is external we need to load it in.
    // For this we use the GLTF 2.0 loader three.js gives us.
    var loader = new GLTFLoader();

    // Empty variables to
    // populate with meshes from the loaded model.
    let obj: any;
    let sign: any;
    let lightOne: any;
    let lightTwo: any;
    let lightThree: any;
    let lightFour: any;

    // Closure to load a model from a path (remote or local).
    loader.load(
        'https://angeldollface.art/assets/models/exp/LightingTest.glb',
        function(gltf){

          // Main model.
          obj = gltf.scene;

          // Model size.
          gltf.scene.scale.set( 1, 1, 1 );
          
          // Model pos.
          gltf.scene.position.x = 0;                   
          gltf.scene.position.y = 0;
          gltf.scene.position.z = 0;   
          gltf.scene.rotation.y = 0.15; 

          // We add it to our scene...
          scene.add(gltf.scene);

          // ...and populate our variables with different
          // objects.
          sign = gltf.scene.getObjectByName('Moon');

          // We fetch one of the corner pillars from the
          // GLTF model and set whether it can emit light,
          // what color that light should be and how strong
          // the emission should be. Same for the other three.
          lightOne = gltf.scene.getObjectByName('Light01');
          lightOne.material.emissive = new THREE.Color(0xFFFFFF);
          lightOne.material.emissiveIntensity = 2;

          lightTwo = gltf.scene.getObjectByName('Light02');
          lightTwo.material.emissive = new THREE.Color(0xFFFFFF);
          lightTwo.material.emissiveIntensity = 2;

          lightThree = gltf.scene.getObjectByName('Light03');
          lightThree.material.emissive = new THREE.Color(0xFFFFFF);
          lightThree.material.emissiveIntensity = 2;

          lightFour = gltf.scene.getObjectByName('Light04');
          lightFour.material.emissive = new THREE.Color(0xFFFFFF);
          lightFour.material.emissiveIntensity = 2;

          // We call the animation function
          // otherwise nothing happens.
          animate();

        }
    );

    // We set up the camera position.
    camera.position.set(14,3,15);

    // And animate the whole scene
    // recursively.
    const animate = () => {

        // Updates the controls on
        // every frame bounce.
        controls.update();

        // Re-renders the scene on
        // every frame bounce.
        composer.render();

        // We want some movement
        // so we animate the moon 
        // by rotating it on the Z-Axis.
        sign.rotation.z -= 0.015;

        // The "frame bounce".
        requestAnimationFrame(animate);
    }
}

export default renderModel;