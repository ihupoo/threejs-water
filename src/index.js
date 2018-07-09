import './css/index.css'
import './css/app.scss'
import 'three'
import Stats from 'lib/stats.min.js'
import 'lib/OrbitControls.js'
import 'lib/DragControls.js'
import TWEEN from 'lib/tween.min.js'
import 'lib/MTLLoader.js'
import 'lib/inflate.min.js'
import 'lib/FBXLoader.js'
import 'lib/OBJLoader.js'

import crate from './img/crate.jpg'

import vertexShader from './glsl/vertex.glsl'
import fragmentShader from './glsl/fragment.glsl'

class ThreeDemo {
    constructor(opts) {
        this.container = opts.el;
        this.createScene(); //场景
        this.createLight(); //灯光
        this.createGeometry(); //物体

        this.orbitControls = new THREE.OrbitControls(this.camera); //轨道控制插件
        this.orbitControls.autoRotate = true;

        this.initStats() //性能监控插件

        this.update() //循环更新场景
    }

    createScene() {
        this.WIDTH = this.container.clientWidth;
        this.HEIGHT = this.container.clientHeight;
        //场景创建
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x090918, 1, 600); //雾化
        //相机创建
        this.camera = new THREE.PerspectiveCamera(60, this.WIDTH / this.HEIGHT, 1, 10000);
        this.camera.position.set(0, 0, 150); //位置
        //渲染
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setClearColor(this.scene.fog.color); //背景色同雾化颜色
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; //阴影类型-柔化边缘的软阴影映射

        this.container.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.handleWindowResize.bind(this))

    }

    handleWindowResize() {
        this.WIDTH = this.container.clientWidth;
        this.HEIGHT = this.container.clientHeight;

        this.camera.aspect = this.WIDTH / this.HEIGHT;
        this.camera.updateProjectionMatrix(); //更新相机投影矩阵
        this.renderer.setSize(this.WIDTH, this.HEIGHT);

    }

    createLight() {
        //户外光源
        this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);
        //环境光源
        this.ambientLight = new THREE.AmbientLight(0xdc8874, .2);
        //平行光
        this.directionalLight = new THREE.DirectionalLight(0xffffff, .9);
        this.directionalLight.position.set(50, 50, 50);
        this.directionalLight.castShadow = true; //动态阴影
        this.directionalLight.shadow.camera.left = -400;
        this.directionalLight.shadow.camera.right = 400;
        this.directionalLight.shadow.camera.top = 400;
        this.directionalLight.shadow.camera.bottom = -400;
        this.directionalLight.shadow.camera.near = 1;
        this.directionalLight.shadow.camera.far = 1000;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;

        this.scene.add(this.hemisphereLight);
        this.scene.add(this.ambientLight);
        this.scene.add(this.directionalLight);
    }


    createGeometry() {

        this.addPartice()
    }

    addMouseListener(objArr) {

        let dragControls = new THREE.DragControls(objArr, this.camera, this.renderer.domElement)
        dragControls.addEventListener("dragstart", (e) => { this.orbitControls.enabled = false })
        dragControls.addEventListener("dragend", (e) => { this.orbitControls.enabled = true })

    }


    addPartice() {

        let uniforms = {
            color: {
                type: 'v3',
                value: new THREE.Color(0xffffff)
            },
            texture: {
                value: this.getTexture()
            },
            val: {
                value: 1.0
            }
        }

        let shadowMaterial = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        })

        let particleSystem = new THREE.Points(moreObj, shadowMaterial)


        this.scene.add(particleSystem)
        this.particleSystem = particleSystem;
    }

    initStats() {
        this.stats = new Stats();
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.bottom = "0px";
        this.stats.domElement.style.zIndex = 100;

        this.container.appendChild(this.stats.domElement);
    }


    update() {
        TWEEN.update(); // 动画插件
        this.stats.update(); // 性能监测插件


        this.renderer.render(this.scene, this.camera); // 渲染器执行渲染
        requestAnimationFrame(() => {
            this.update() // 循环调用
        });

    }
}

// new ThreeDemo({
//     el: document.getElementsByClassName("container")[0],
// })


if (module.hot) {
    module.hot.accept()
}