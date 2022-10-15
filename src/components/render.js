import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

export function renderModel(){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth/window.innerHeight,
        0.01,
        1000
    );
    scene.background = new THREE.Color(0x241830);
    var renderer = new THREE.WebGLRenderer(
        {
          antialias: true
        }
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    const controls = new OrbitControls(camera, renderer.domElement);
    document.body.appendChild(renderer.domElement);
    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    const renderScene = new RenderPass( scene, camera );

    // NEW START
    const params = {
        exposure: 0.5,
        bloomStrength: 0.3,
        bloomThreshold: 0,
        bloomRadius: 0.0001
    };
	const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
	bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
	bloomPass.radius = params.bloomRadius;
    var composer = new EffectComposer( renderer );
	composer.addPass( renderScene );
	composer.addPass( bloomPass );
    // NEW OLD

    scene.environment = pmremGenerator.fromScene( environment ).texture;
    var loader = new GLTFLoader();
    var obj;
    var sign;
    var lightOne;
    var lightTwo;
    var lightThree;
    var lightFour;
    loader.load(
        'https://angeldollface.art/assets/models/exp/LightingTest.glb',
        function(gltf){
          obj = gltf.scene;
          gltf.scene.scale.set( 1, 1, 1 );             
          gltf.scene.position.x = 0;                   
          gltf.scene.position.y = 0;
          gltf.scene.position.z = 0;   
          gltf.scene.rotation.y = 0.15; 
          scene.add(gltf.scene);
          sign = gltf.scene.getObjectByName('Moon');
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

          animate();
        }
    );
    var Hemilight = new THREE.HemisphereLight(0x999999, 0xDF0045, 8);
    var light = new THREE.AmbientLight(0xDF0045)
    scene.add(light);
    scene.add(Hemilight);
    camera.position.set(14,3,15);
    const animate = () => {
        controls.update();
        composer.render(); // NEW
        sign.rotation.z -= 0.015;
        requestAnimationFrame(animate);
    }
}

export default renderModel;