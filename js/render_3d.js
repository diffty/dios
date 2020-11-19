import * as THREE from './libs/three/build/three.module.js';

import { EffectComposer } from './libs/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './libs/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './libs/three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from './libs/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { UnrealBloomPassAlpha } from './libs/three/examples/jsm/postprocessing/UnrealBloomPassAlpha.js';
import { BloomPass } from './libs/three/examples/jsm/postprocessing/BloomPass.js';
import { GLTFLoader } from './libs/three/examples/jsm/loaders/GLTFLoader.js';


const renderWidth = 1920;
const renderHeight = 1080;


// VARS
let then = 0;


// ******** THREEJS STUFF ********
// LOADING TEXTURES
var texloader = new THREE.TextureLoader();
var clock = new THREE.Clock();
var gltfLoader = new GLTFLoader();

// SCENE & CAM
var scene = new THREE.Scene();
//scene.background = new THREE.Color(0, 0, 0);
var camera = new THREE.PerspectiveCamera( 50, renderWidth / renderHeight, 0.1, 1000 );
camera.position.y = 0.5;
camera.position.z = 2;

// LCD DISPLAY
var lcdDisplay = new LcdDisplay();
//scene.add(lcdDisplay.mesh);


function applyTickerMat(sceneElement, materialToApply) {
    if (sceneElement.children) {
        for (var i in sceneElement.children) {
            var o = sceneElement.children[i];
            applyTickerMat(o, materialToApply);
        }
    }

    if (sceneElement.material) {
        if (sceneElement.material.name == "_TICKER_MAT") {
            sceneElement.material = materialToApply;
        }
    }
}


gltfLoader.load(
    "./models/ticker_pager.gltf",
    function (gltf) {
        applyTickerMat(gltf.scene, lcdDisplay.material);
        gltf.scene.position.z = -1;
        gltf.scene.rotation.y = 0.2
        scene.add(gltf.scene);
    }
)

const light = new THREE.PointLight(0xffffff, 1, 10);
light.position.z = 2;
//scene.add(light)

//lcdDisplay.mesh.rotation.y = 0.8

// RENDERER
var renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
renderer.setSize( renderWidth, renderHeight );
renderer.setClearColor( 0x000000, 0 ); // the default
document.body.appendChild( renderer.domElement );

// RENDER TARGET
const rtWidth = renderWidth;
const rtHeight = renderHeight;
const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);


// ******** SHADER SHIT ********
var composer = new EffectComposer( renderer );

var renderPass = new RenderPass( scene, camera );
renderPass.clearAlpha = 0;
composer.addPass( renderPass );

// var bloomPass = new UnrealBloomPass( new THREE.Vector2( renderWidth, renderHeight ), 1.5, 0.4, 0.85 );
// bloomPass.threshold = 0.0;
// bloomPass.strength = 1.0;
// bloomPass.radius = 1.0;

var bloomPass = new UnrealBloomPassAlpha( new THREE.Vector2( renderWidth, renderHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = 0.0;
bloomPass.strength = 2.0;
bloomPass.radius = 1.0;

composer.addPass( bloomPass );


// ******** DIOS STUFF ********
const TWITCH_USER_ID = 27497503; // 64670756: kitcate / 27497503: diffty
const TWITCH_CLIENT_ID = "ulv1v7toq6fwfps9pmcrnlg6r6t7ex";

let twitchIfc = new TwitchInterface(TWITCH_CLIENT_ID);
//console.log(twitchIfc.getUsersFromName(["diffty"], (res) => { console.log(res); }));

const tickerSystemInstance = new BaseTickerSystem(16)

let followsTitleComponent = new TextBufferComponent("- Last Follows -");
let followsComponent = new TwitchFollowsComponent(TWITCH_USER_ID, TWITCH_CLIENT_ID, tickerSystemInstance.tickerSize);
let nowPlayingTitleComponent = new TextBufferComponent("- Now Playing -");
let nowPlayingComponent = new TextBufferComponent("TECH STUFF");
let viewersComponent = new TwitchViewersComponent(TWITCH_USER_ID, TWITCH_CLIENT_ID);

followsComponent.addEffect(new ShrinkBufferEffect(tickerSystemInstance.tickerSize));

tickerSystemInstance.transitionsStack.push(new CharClearTransitionComponent(1));

tickerSystemInstance.addComponent(followsTitleComponent);
tickerSystemInstance.addComponent(followsComponent);
tickerSystemInstance.addComponent(nowPlayingTitleComponent);
tickerSystemInstance.addComponent(nowPlayingComponent);
tickerSystemInstance.addComponent(viewersComponent);


function animate(now) {
    now *= 0.001;
    
    const deltaTime = now - then;
    then = now;

    tickerSystemInstance.update(deltaTime);
    tickerSystemInstance.draw(deltaTime);

    lcdDisplay.setText(tickerSystemInstance.getBuffer());
    lcdDisplay.drawCanvas();

    requestAnimationFrame(animate);

    //renderer.render(scene, camera);
    composer.render();

}

requestAnimationFrame(animate);
