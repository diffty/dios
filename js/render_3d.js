import config from '../config.js'

import * as THREE from './libs/three/build/three.module.js';

import { EffectComposer } from './libs/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './libs/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPassAlpha } from './postprocessing/UnrealBloomPassAlpha.js';
import { GLTFLoader } from './libs/three/examples/jsm/loaders/GLTFLoader.js';

import { TwitchInterface } from './interface_twitch.js'


// CONSTS
const renderWidth = 1280;
const renderHeight = 720;

const COLOR_TABLE = {
    "red": "#FF0000",
    "green": "#00FF00",
    "blue": "#0000FF",
    "hum": "#ba34eb",
    "captainhum": "#ba34eb",
    "kit": "#C0C0C0",
    "kitcate": "#C0C0C0",
    "chanella": "#FD6C9E",
    "typh": "#FD6C9E",
}

const HEX_LAXIST_REGEX = new RegExp(/#?([a-z0-9]{6})/i);
const HEX_REAL_REGEX = new RegExp(/#?([a-f0-9]{6})/i);


function get(object, key, default_value) {
    var result = object[key];
    return (typeof result !== "undefined") ? result : default_value;
}


let urlVars = getUrlVars();
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
};

var camPosArgs = get(urlVars, "campos", "");
if (camPosArgs) {
    camPosArgs = camPosArgs.split(",").map(x => parseFloat(x.trim()));
}
else {
    camPosArgs = [];
}
var camRotArgs = get(urlVars, "camrot", "");
if (camRotArgs) {
    camRotArgs = camRotArgs.split(",").map(x => parseFloat(x.trim()));
}
else {
    camRotArgs = [];
}

var objPosArgs = get(urlVars, "objpos", "");
if (objPosArgs) {
    objPosArgs = objPosArgs.split(",").map(x => parseFloat(x.trim()));
}
else {
    objPosArgs = [];
}
var objRotArgs = get(urlVars, "objrot", "");
if (objRotArgs) {
    objRotArgs = objRotArgs.split(",").map(x => parseFloat(x.trim()));
}
else {
    objRotArgs = [];
}


// VARS
let then = 0;

let swapRemainingTime = 0;
let swapTimer = null;


const obsWs = new OBSWebSocket();
obsWs.connect({ address: 'localhost:4444' });


const client = new tmi.Client({
    options: { debug: true, messagesLogLevel: "info" },
    connection: { reconnect: true },
    channels: [ 'diffty' ]
});
client.connect().catch(console.error);


function swapCams() {
    obsWs.send("SetSceneItemProperties", {
        "scene-name": "_Swapity",
        "item": "CAM_MainCam",
        "visible": true
    });
    obsWs.send("SetSceneItemProperties", {
        "scene-name": "_TiltedCam",
        "item": "_MainCapture",
        "visible": true
    });
}


function unswapCams() {
    obsWs.send("SetSceneItemProperties", {
        "scene-name": "_Swapity",
        "item": "CAM_MainCam",
        "visible": false
    });
    obsWs.send("SetSceneItemProperties", {
        "scene-name": "_TiltedCam",
        "item": "_MainCapture",
        "visible": false
    });
}


// ******** THREEJS STUFF ********
// LOADING TEXTURES
var texloader = new THREE.TextureLoader();
var clock = new THREE.Clock();
var gltfLoader = new GLTFLoader();

// SCENE & CAM
var scene = new THREE.Scene();
//scene.background = new THREE.Color(0, 0, 0);
var camera = new THREE.PerspectiveCamera( 50, renderWidth / renderHeight, 0.1, 1000 );
//camera.position.y = 0.5;
//camera.position.z = 2;

for (let i = 0; i < camPosArgs.length; i++) {
    camera.position[String.fromCharCode('x'.charCodeAt(0) + i)] = camPosArgs[i];
}

for (let i = 0; i < camRotArgs.length; i++) {
    camera.rotation[String.fromCharCode('x'.charCodeAt(0) + i)] = camRotArgs[i];
}


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

var collisionConfiguration;
var dispatcher;
var broadphase;
var solver;
var physicsWorld;

/*
Ammo().then(function(Ammo) {
    function initPhysics() {
        collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
        broadphase = new Ammo.btDbvtBroadphase();
        solver = new Ammo.btSequentialImpulseConstraintSolver();
        physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
        physicsWorld.setGravity( new Ammo.btVector3( 0, -9.82, 0 ) );
    }

    initPhysics();
});*/


gltfLoader.load(
    "./models/ticker_pager.gltf",
    function (gltf) {
        applyTickerMat(gltf.scene, lcdDisplay.material);
        //gltf.scene.position.z = -1;
        //gltf.scene.rotation.y = 0.2
        
        for (let i = 0; i < objPosArgs.length; i++) {
            gltf.scene.position[String.fromCharCode('x'.charCodeAt(0) + i)] = objPosArgs[i];
        }
        
        for (let i = 0; i < objRotArgs.length; i++) {
            gltf.scene.rotation[String.fromCharCode('x'.charCodeAt(0) + i)] = objRotArgs[i];
        }
        
        scene.add(gltf.scene);
    }
)

/*
gltfLoader.load(
    "./models/character.gltf",
    function (gltf) {
        gltf.scene.position.x = -1;
        gltf.scene.rotation.y = 0.2
        gltf.scene.scale.x = 0.3;
        gltf.scene.scale.y = 0.3;
        gltf.scene.scale.z = 0.3;
        scene.add(gltf.scene);
    }
)
*/

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

twitchIfc.getAccessToken((caca) => {
    console.log(caca);
})

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

let twitchPubSubIfc = new TwitchPubSubInterface(config.TWITCH_BEARER_TOKEN, (msg) => {
    if (msg.data && msg.data.topic) {
        let msgTopic = msg.data.topic;
        let msgContent = JSON.parse(msg.data.message);

        if (msgContent.type == "reward-redeemed") {
            let redemptionMsgComponent = new TextBufferComponent(
                `${msgContent.data.redemption.user.display_name} a recupere ${msgContent.data.redemption.reward.title} !`
            );
            redemptionMsgComponent.setIsOneShot(true);
            redemptionMsgComponent.duration = 5000;

            let bounceEffect = new BounceBufferEffect(tickerSystemInstance.tickerSize);
            bounceEffect.setLooped(true);
            bounceEffect.play();
            redemptionMsgComponent.addEffect(bounceEffect);

            tickerSystemInstance.componentsStack.unshift(redemptionMsgComponent);
            tickerSystemInstance.switchToNextComponent();

            if (msgContent.data.redemption.reward.title == "PimpMyOverlay") {
                let userMessage = msgContent.data.redemption.user_input;
                let regRes = HEX_LAXIST_REGEX[Symbol.match](userMessage);

                if (regRes) {
                    if (["NI69CE", "LGBTQI"].includes(regRes[1].toUpperCase())) {
                        lcdDisplay.setColorFunc((i, c) => {
                            let timeOffset = Math.floor(Date.now() * 0.01) % 16;
                            let idx = parseInt(i);
                            return `hsl(${350. * ((idx + timeOffset) / 16.)}, 100%, 50%)`;
                        });
                        lcdDisplay.colorMode = "func";
                    }
                    else {
                        let regRes = HEX_REAL_REGEX[Symbol.match](userMessage);
                        if (regRes) {
                            lcdDisplay.setColor("#" + regRes[1].toUpperCase());
                            lcdDisplay.colorMode = "hex";
                        }
                    }
                }
                else if (userMessage in COLOR_TABLE) {
                    lcdDisplay.setColor(COLOR_TABLE[userMessage]);
                    lcdDisplay.colorMode = "hex";
                }
            }

            if (msgContent.data.redemption.reward.title == "SWAPITY SWAP") {
                swapRemainingTime = 30000;

                swapCams();

                if (swapTimer != null) {
                    clearTimeout(swapTimer);
                }
                swapTimer = setTimeout(
                    () => {
                        unswapCams();
                        clearTimeout(swapTimer);
                    },
                    swapRemainingTime
                );
            }

            if (msgContent.data.redemption.reward.title == "LIGHTS OUT") {
                var request = new XMLHttpRequest();
                request.open('GET', 'http://192.168.1.33:5000/lights/set/0');
                request.send();

                request.onload = async function () {
                    var data = await JSON.parse(this.response);
                    console.log(data);
                }
            }

            if (msgContent.data.redemption.reward.title == "SHINE IN") {
                var request = new XMLHttpRequest();
                request.open('GET', 'http://192.168.1.33:5000/lights/set/1');
                request.send();

                request.onload = async function () {
                    var data = await JSON.parse(this.response);
                    console.log(data);
                }
            }
        }
    }
})
twitchPubSubIfc.connect();

function makeLightsBlink(speed, duration) {
    var request = new XMLHttpRequest();
    request.open('GET', `http://192.168.1.33:5000/lights/blink/?speed=${speed}&duration=${duration}`);
    request.send();

    request.onload = async function () {
        var data = await JSON.parse(this.response);
        console.log(data);
    }
}

setInterval(
    () => {
        twitchIfc.watchNewFollowers(
            config.TWITCH_USER_ID,
            (newFollowers) => {
                if (newFollowers.length > 0) {
                    makeLightsBlink(5, 10 * newFollowers.length);
                }

                for (let i in newFollowers) {
                    let user = newFollowers[i];
                    console.log(user)

                    let newFollowMsgComponent = new TextBufferComponent(
                        `${user.from_name} just followed <3`
                    );
                    newFollowMsgComponent.setIsOneShot(true);
                    newFollowMsgComponent.duration = 10000;
                
                    let bounceEffect = new BounceBufferEffect(tickerSystemInstance.tickerSize);
                    bounceEffect.setLooped(true);
                    bounceEffect.play();
                    newFollowMsgComponent.addEffect(bounceEffect);
                
                    tickerSystemInstance.componentsStack.unshift(newFollowMsgComponent);
                    tickerSystemInstance.switchToNextComponent();
                }
            });
    },
    20000
);


client.on('raided', (channel, username, viewers) => {
    let raidMsgComponent = new TextBufferComponent(
        `${username} just raided with ${viewers} beautiful persons`
    );
    raidMsgComponent.setIsOneShot(true);
    raidMsgComponent.duration = 10000;

    let bounceEffect = new BounceBufferEffect(tickerSystemInstance.tickerSize);
    bounceEffect.setLooped(true);
    bounceEffect.play();
    raidMsgComponent.addEffect(bounceEffect);

    tickerSystemInstance.componentsStack.unshift(raidMsgComponent);
    tickerSystemInstance.switchToNextComponent();

    makeLightsBlink(5, 10);
});


function animate(now) {
    now *= 0.001;
    
    const deltaTime = now - then;
    then = now;

    //physicsWorld.stepSimulation( deltaTime, 10 );

    tickerSystemInstance.update(deltaTime);
    tickerSystemInstance.draw(deltaTime);

    lcdDisplay.setText(tickerSystemInstance.getBuffer());
    lcdDisplay.drawCanvas();

    requestAnimationFrame(animate);

    //renderer.render(scene, camera);
    composer.render();

}

requestAnimationFrame(animate);
