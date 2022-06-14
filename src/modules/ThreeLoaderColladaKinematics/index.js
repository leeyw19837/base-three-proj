/**
 * 学习练习1-Three.js 官方demo
 * https://threejs.org/examples/#webgl_loader_collada_kinematics
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_collada_kinematics.html
 */
import styled from "styled-components";
import * as THREE from 'three';
import Stats from "three/examples/jsm/libs/stats.module";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";
import {ColladaLoader} from "three/examples/jsm/loaders/ColladaLoader";
import {useCallback, useEffect} from "react";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const abbModel = require('./model/collada/abb_irb52_7_120.dae')

export function ThreeLoaderColladaKinematics() {
    const initThree = useCallback(() => {
        let container, stats;
        let camera, scene, renderer;
        let particleLight;
        let dae;

        let control;

        let kinematics;
        let kinematicsTween;
        const tweenParameters = {};

        const loader = new ColladaLoader();
        loader.load(abbModel, function (collada) {
            dae = collada.scene;
            dae.traverse(function (child) {
                if (child.isMesh) {
                    child.material.flatShading = true;
                }
            })
            dae.scale.x = dae.scale.y = dae.scale.z = 10.0
            dae.updateMatrix()
            kinematics = collada.kinematics

            init()
            animate()
        })

        function init() {
            container = document.getElementById('WebGL-output')

            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)
            camera.position.set(2, 2, 3)

            scene = new THREE.Scene()

            // Grid
            const grid = new THREE.GridHelper(20, 20, '#888', '#444')
            scene.add(grid)

            // Add the COLLADA
            scene.add(dae)

            particleLight = new THREE.Mesh(
                new THREE.SphereGeometry(4, 8, 8),
                new THREE.MeshBasicMaterial({
                    color: '#fff'
                })
            )
            scene.add(particleLight)

            // Lights
            const light = new THREE.HemisphereLight('#ffeeee', '#111122')
            scene.add(light)

            const pointLight = new THREE.PointLight('#fff', 0.3)
            particleLight.add(pointLight)

            renderer = new THREE.WebGLRenderer()
            renderer.outputEncoding = THREE.sRGBEncoding
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(window.innerWidth, window.innerHeight)
            container.appendChild(renderer.domElement)

            stats = new Stats()
            container.appendChild(stats.dom)

            control = new OrbitControls(camera, renderer.domElement)
            // control.autoRotate = false
            control.listenToKeyEvents( window ); // optional

            //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

            control.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
            control.dampingFactor = 0.05;

            control.screenSpacePanning = false;

            control.minDistance = 100;
            control.maxDistance = 500;

            control.maxPolarAngle = Math.PI / 2;

            // control = new TrackballControls( camera, renderer.domElement );
            // control.minDistance = 200;
            // control.maxDistance = 500;

            setupTween()

            window.addEventListener('resize', onWindowResize)

        }

        function setupTween() {
            const duration = THREE.MathUtils.randInt(1000, 5000)
            const target = {}
            for (const prop in kinematics.joints) {
                if (kinematics.joints.hasOwnProperty(prop)) {
                    if (!kinematics.joints[prop].static) {
                        const joint = kinematics.joints[prop];
                        const old = tweenParameters[prop];
                        const position = old ? old : joint.zeroPosition;
                        tweenParameters[prop] = position;
                        target[prop] = THREE.MathUtils.randInt(joint.limits.min, joint.limits.max);
                    }
                }
            }
            kinematicsTween = new TWEEN.Tween(tweenParameters).to(target, duration).easing(TWEEN.Easing.Quadratic.Out)
            kinematicsTween.onUpdate(function (object) {
                for (const prop in kinematics.joints) {
                    if (kinematics.joints.hasOwnProperty(prop)) {
                        if (!kinematics.joints[prop].static) {
                            kinematics.setJointValue(prop, object[prop]);
                        }
                    }
                }
            })

            kinematicsTween.start()
            setTimeout(setupTween, duration)
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.resize(window.innerWidth, window.innerHeight)
        }

        function animate() {
            requestAnimationFrame(animate)
            stats.update()
            control.update()
            // TWEEN.update()
            render()
        }

        function render() {
            const timer = Date.now() * 0.0001
            camera.position.set(
                // Math.cos(timer) * 20,
                20,
                10,
                // Math.sin(timer) * 20,
                20
            )
            camera.lookAt(0, 5, 0)

            particleLight.position.set(
                Math.sin(timer * 4) * 3009,
                Math.cos(timer * 5) * 4000,
                Math.cos(timer * 4) * 3009,
            )

            renderer.render(scene, camera)
        }

    }, [])

    useEffect(() => {
        initThree()
    }, [initThree])

    return (
        <WebGlRootWrapper>
            <span style={{color: '#fff'}}>测试 THREE.js</span>
            <div id='WebGL-output'></div>
        </WebGlRootWrapper>
    )
}

const WebGlRootWrapper = styled.div`
  width: 100%;
  height: 100%;
  border: #61dafb 1px solid;
  padding: 10px;
`
