import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { GLTFLoader } from './GLTFLoader.js';
import { DRACOLoader } from './DRACOLoader.js';

// Global variables
var model;
var model2;
var SCROLL_OFFSET_ROTATE = 500;

function main() {

    // Init ThreeJS
    const container = document.querySelector("#canvas-container");
    const canvas = document.querySelector('#c');
    const scene = new THREE.Scene();

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, logarithmicDepthBuffer: true });
    renderer.stencil = true;
    renderer.setPixelRatio(1);
    renderer.shadowMapSoft = true;
    renderer.powerPreference = "high-performance";
    renderer.shadowMap.enabled = true
    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
    renderer.physicallyCorrectLights = true;


    // Setup camera
    const fov = 20;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 1;
    const far = 400;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 15, 110);
    camera.lookAt(0, 0, 0);

    // Load model
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./js/')
    loader.setDRACOLoader(dracoLoader);
    loader.load(
        'gltf/carousel_compressed.glb',
        function (gltf) {
            gltf.scene.scale.set(5, 5, 5)
            gltf.scene.position.set(0, 5, 0)
            model = gltf.scene;

            // Shadow light should rotate too
            shadow1.parent = model;

            // Improve model materials
            model.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.flatShading = true;
                    node.blending = THREE.NoBlending;
                    const newMaterial = new THREE.MeshLambertMaterial({ map: node.material.map });
                    node.material = newMaterial;

                }
            });

            model.castShadow = true

            scene.add(model);
        });


    // Add lights

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, .7);

    // Hemi light
    const hemiLight = new THREE.HemisphereLight('white', 'orange', .5);

    // Directional light 1
    const dir1 = new THREE.DirectionalLight('white', 1);
    dir1.position.set(10, 10, 10);

    // Directional light 2 
    const dir2 = new THREE.DirectionalLight('white', 1);
    dir2.position.set(-10, 10, 5);

    // Directional light 3
    const dir3 = new THREE.DirectionalLight('white', 0.7);
    dir3.position.set(-10, -10, -5);

    // Directional light 4
    const dir4 = new THREE.DirectionalLight('white', 0.7);
    dir2.position.set(10, 10, -10);

    // Directional light 5
    const dir5 = new THREE.DirectionalLight('white', 0.7);
    dir2.position.set(-10, 10, -5);

    // Shadow light
    const shadow1 = new THREE.DirectionalLight('white', 1.5);
    shadow1.position.set(5, 9, 0);

    shadow1.shadow.mapSize.width = 2048;
    shadow1.shadow.mapSize.height = 2048;
    shadow1.shadow.camera.near = 3;
    shadow1.shadow.camera.far = 500;

    shadow1.shadow.camera.top = 250;
    shadow1.shadow.camera.bottom = -250;
    shadow1.shadow.camera.left = 250;
    shadow1.shadow.camera.right = -250;


    shadow1.castShadow = true;
    shadow1.shadow.bias = -0.01;

    scene.add(ambientLight);
    scene.add(hemiLight);
    scene.add(dir1);
    scene.add(dir2);
    scene.add(shadow1);


    // Update aspect ratio on windows resize
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio | 0;
        const height = canvas.clientHeight * pixelRatio | 0;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    // Render stuff
    function render() {
        if (model) {
            model.rotation.y = window.pageYOffset / SCROLL_OFFSET_ROTATE;
        }

        // Update aspect ratio on windows resize
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}

main();

function item() {
    const canvas = document.querySelector('#item');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setClearColor(0xffffff, 1);


    const container = document.querySelector("#canvas-container");

    const fov = 20;
    const aspect = 1;  // the canvas default
    const near = 0.01;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.enableZoom = false;
    controls.enablePan = false;

    camera.position.z = 70;
    controls.update()

    const scene = new THREE.Scene();



    {
        const ambientLight = new THREE.AmbientLight(0xffffff, .7);
        const hemiLight = new THREE.HemisphereLight('white', .5);

        const dir1 = new THREE.DirectionalLight('white', 1);
        dir1.position.set(10, 10, 5);

        const dir2 = new THREE.DirectionalLight('white', 1);
        dir2.position.set(5, -10, -5);



        scene.add(ambientLight);
        scene.add(hemiLight);
        scene.add(dir1);
        scene.add(dir2);
    }

    // Load model
    const loader = new GLTFLoader();
    loader.load(
        'gltf/shirt_03.glb',
        function (gltf2) {
            gltf2.scene.scale.set(3, 3, 3)
            gltf2.scene.position.set(0, 0, 0)
            model2 = gltf2.scene;

            // Improve model materials
            model2.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.flatShading = true;
                    node.blending = THREE.NoBlending;
                }
            });

            scene.add(model2);
        });

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        controls.update();

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

item();

function init_scroll() {
    var controller = new ScrollMagic.Controller({
        globalSceneOptions: {
            triggerHook: 'onLeave',
            duration: "150%"
        }
    });

    var carousel = document.getElementById("pin-title");

    new ScrollMagic.Scene({
        triggerElement: carousel
    })
        .setPin(carousel, { pushFollowers: true })
        .addTo(controller);
}
init_scroll()