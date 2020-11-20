import config from '../config.js'

import * as THREE from './libs/three/build/three.module.js';

import { EffectComposer } from './libs/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './libs/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPassAlpha } from './postprocessing/UnrealBloomPassAlpha.js';
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
let twitchIfc = new TwitchInterface(config.TWITCH_CLIENT_ID, config.TWITCH_SECRET_ID, config.TWITCH_BEARER_TOKEN);
let lastFmIfc = new LastFmInterface(config.LASTFM_CLIENT_ID, config.LASTFM_SECRET_ID);
//twitchIfc.getAccessToken((res) => {
//    console.log("Access token :", res);
//});
//console.log(twitchIfc.getUsersFromName(["diffty"], (res) => { console.log(res); }));

const tickerSystemInstance = new BaseTickerSystem(16)

let followsTitleComponent = new TextBufferComponent("- Last Follows -");
let followsComponent = new TwitchFollowsComponent(twitchIfc, config.TWITCH_USER_ID, tickerSystemInstance.tickerSize);
let rightNowTitleComponent = new TextBufferComponent("- Right now -");
let rightNowComponent = new TextBufferComponent(config.NOW_PLAYING_TEXT);
let nowPlayingTitleComponent = new TextBufferComponent("- Now playing -");
let nowPlayingComponent = new LastFmComponent(lastFmIfc, "diffty");
let viewersComponent = new TwitchViewersComponent(twitchIfc, config.TWITCH_USER_ID);

nowPlayingTitleComponent.doShow = () => { return nowPlayingComponent.doShow(); }

let bounceEffect = new BounceBufferEffect(tickerSystemInstance.tickerSize);
bounceEffect.setLooped(true);
bounceEffect.play();
nowPlayingComponent.addEffect(bounceEffect);

followsComponent.addEffect(new ShrinkBufferEffect(tickerSystemInstance.tickerSize));

tickerSystemInstance.transitionsStack.push(new CharClearTransitionComponent(1));

tickerSystemInstance.addComponent(rightNowTitleComponent);
tickerSystemInstance.addComponent(rightNowComponent);
tickerSystemInstance.addComponent(nowPlayingTitleComponent);
tickerSystemInstance.addComponent(nowPlayingComponent);
tickerSystemInstance.addComponent(followsTitleComponent);
tickerSystemInstance.addComponent(followsComponent);
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
