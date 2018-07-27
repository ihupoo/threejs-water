import './css/index.css'
import './css/app.scss'
import 'three'
import 'lib/OrbitControls.js'
import Stats from 'lib/stats.min.js'

import tiles from './img/crate.jpg'

import vertexShader from './glsl/vertex.glsl'
import vertex2Shader from './glsl/vertex2.glsl'
import renderfragmentShader from './glsl/renderfragment.glsl'
import dropfragmentShader from './glsl/dropfragment.glsl'
import updatefragmentShader from './glsl/updatefragment.glsl'

class ThreeDemo {
    constructor(opts) {
        this.container = opts.el;
        this.createScene(); //场景
        this.createLight(); //灯光


        this.bufferTexture = new THREE.WebGLRenderTarget(
            512, 512, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                type: THREE.FloatType,
                stencilBuffer: false,
                depthBuffer: false
            });
        this.bufferTexture2 = new THREE.WebGLRenderTarget(
            512, 512, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                type: THREE.FloatType,
                stencilBuffer: false,
                depthBuffer: false
            });

        this.bufferTexture.texture = this.getTexture();
        this.bufferTexture2.texture = this.getTexture();


        this.aorb = true;
        this.mouse = new THREE.Vector2(0.0, 0.0)


        this.addDrop()
        this.updateProgram()

        this.addMouseListener();
        this.load();

        // this.orbitControls = new THREE.OrbitControls(this.camera); //轨道控制插件
        // this.orbitControls.autoRotate = true;

        this.initStats() //性能监控插件

        this.update() //循环更新场景
    }

    getTexture(canvasSize = 512) {
        let canvas = document.createElement('canvas');
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        let context = canvas.getContext('2d');

        context.fillStyle = "#000000";

        context.fillRect(0, 0, 512, 512);
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }


    createScene() {
        this.WIDTH = this.container.clientWidth;
        this.HEIGHT = this.container.clientHeight;
        //场景创建
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xffffff, 1, 600); //雾化
        //相机创建
        this.camera = new THREE.OrthographicCamera(-this.WIDTH / 2,
            this.WIDTH / 2,
            this.HEIGHT / 2, -this.HEIGHT / 2,
            150, -150
        );
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
        this.ambientLight = new THREE.AmbientLight(0xffffff, .2);
        //平行光
        this.directionalLight = new THREE.DirectionalLight(0xffffff, .8);
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


    load() {
        let textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            tiles,
            texture => {
                this.texturebase = texture;
                this.renderfn();
            },
            xhr => console.log(`${xhr.loaded/xhr.total *100}%loaded`),
            error => console.log(error)
        )
    }


    renderfn() {

        let plane = new THREE.PlaneBufferGeometry(512, 512, 512, 512);


        let uniforms = {
            samplerBackground: {
                value: this.texturebase
            },
            samplerRipples: {
                value: this.bufferTexture.texture
            },
            delta: {
                value: new THREE.Vector2(1 / 512, 1 / 512)
            },
            perturbance: {
                value: 0.03
            }
        }
        let material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: vertex2Shader,
            fragmentShader: renderfragmentShader,
            blending: THREE.AdditiveBlending,
            depthTest: false
        })


        this.rendermesh = new THREE.Mesh(plane, material);

        this.scene.add(this.rendermesh)

        this.renderer.render(this.scene, this.camera);


    }

    updateProgram() {
        this.bufferScene2 = new THREE.Scene();


        let plane = new THREE.PlaneBufferGeometry(512, 512, 512, 512);

        let uniforms = {
            texture: {
                value: this.aorb ? this.bufferTexture2.texture : this.bufferTexture.texture
            },
            delta: {
                value: new THREE.Vector2(1 / 512, 1 / 512)
            }
        }
        let material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: vertexShader,
            fragmentShader: updatefragmentShader,
            blending: THREE.AdditiveBlending,
            depthTest: false
        })


        this.mesh2 = new THREE.Mesh(plane, material);

        this.bufferScene.add(this.mesh2);


        this.renderer.render(this.bufferScene2, this.camera, this.aorb ? this.bufferTexture : this.bufferTexture2);

        this.aorb = !this.aorb;
    }

    addDrop() {
        this.bufferScene = new THREE.Scene();


        let plane = new THREE.PlaneBufferGeometry(512, 512, 512, 512);

        let uniforms = {
            texture: {
                value: this.aorb ? this.bufferTexture.texture : this.bufferTexture2.texture
            },
            center: {
                value: this.mouse
            },
            radius: {
                value: 0.1
            },
            strength: {
                value: 1.0
            }
        }
        let material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: vertexShader,
            fragmentShader: dropfragmentShader,
            blending: THREE.AdditiveBlending,
            depthTest: false
        })


        this.mesh = new THREE.Mesh(plane, material);

        this.bufferScene.add(this.mesh);

        // this.mesh.material.uniforms.center.value = this.mouse;

        this.renderer.render(this.bufferScene, this.camera, this.aorb ? this.bufferTexture2 : this.bufferTexture);
        // this.bufferTexture.texture.needsUpdate = true;
        // this.bufferTexture2.texture.needsUpdate = true;

        this.aorb = !this.aorb;
    }

    addMouseListener() {
        this.container.addEventListener("mousedown", event => {

            let rect = this.renderer.domElement.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;


            this.mesh.material.uniforms.center.value = this.mouse;
            this.mesh.material.uniforms.texture.value = this.aorb ? this.bufferTexture.texture : this.bufferTexture2.texture

            this.renderer.render(this.bufferScene, this.camera, this.aorb ? this.bufferTexture2 : this.bufferTexture);
            this.aorb = !this.aorb;




        })

    }

    initStats() {
        this.stats = new Stats();
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.bottom = "0px";
        this.stats.domElement.style.zIndex = 100;

        this.container.appendChild(this.stats.domElement);
    }


    update() {
        this.stats.update(); // 性能监测插件

        if (this.texturebase) {

            this.mesh2.material.uniforms.texture.value = this.aorb ? this.bufferTexture2.texture : this.bufferTexture.texture;

            this.renderer.render(this.bufferScene2, this.camera,
                this.aorb ? this.bufferTexture : this.bufferTexture2
            );
            this.aorb = !this.aorb;


            this.rendermesh.material.uniforms.samplerRipples.value = this.bufferTexture.texture


            this.bufferTexture.texture.needsUpdate = true;
            this.bufferTexture2.texture.needsUpdate = true;
        }



        // this.renderer.render(this.scene, this.camera); // 渲染器执行渲染
        requestAnimationFrame(() => {
            this.update() // 循环调用
        });

    }
}

new ThreeDemo({
    el: document.getElementsByClassName("container")[0],
})


if (module.hot) {
    module.hot.accept()
}