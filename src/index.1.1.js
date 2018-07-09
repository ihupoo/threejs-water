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

    loader(arr) {
        let jsonLoader = new THREE.JSONLoader();
        let textureLoader = new THREE.TextureLoader();
        let mtlLoader = new THREE.MTLLoader();
        let fbxLoader = new THREE.FBXLoader();
        let objLoader = new THREE.OBJLoader();
        let promiseArr = arr.map((obj, i) => {
            switch (obj.loader) {
                case 'JSONLoader':
                    return new Promise(function(resolve, reject) {
                        jsonLoader.load(obj.texture, (geometry, materials) =>
                            resolve({ geometry, materials })
                        );
                    });
                    break;
                case 'TextureLoader':
                    return new Promise(function(resolve, reject) {
                        textureLoader.load(
                            obj.texture,
                            texture => resolve(texture),
                            xhr => console.log(`${xhr.loaded/xhr.total *100}%loaded`),
                            error => reject(error)
                        )
                    });
                    break;
                case 'MTLLoader':
                    return new Promise(function(resolve, reject) {
                        mtlLoader.load(
                            obj.texture,
                            texture => resolve(texture),
                            xhr => console.log(`${xhr.loaded/xhr.total *100}%loaded`),
                            error => reject(error)
                        )
                    });
                    break;
                case 'FBXLoader':
                    return new Promise(function(resolve, reject) {
                        fbxLoader.load(
                            obj.texture,
                            texture => resolve(texture),
                            xhr => console.log(`${xhr.loaded/xhr.total *100}%loaded`),
                            error => reject(error)
                        )
                    });
                    break;
                case 'OBJLoader':
                    return new Promise(function(resolve, reject) {
                        objLoader.load(
                            obj.texture,
                            texture => resolve(texture),
                            // xhr => console.log(`${xhr.loaded/xhr.total *100}%loaded`),
                            // error => reject(error)
                        )
                    });
                    break;
                case 'OBJMTLLoader':
                    return new Promise(function(resolve, reject) {
                        mtlLoader.load(
                            obj.texture,
                            texture => {
                                // texture.preload();
                                objLoader.setMaterials(texture);

                                objLoader.load(
                                    obj.texture2,
                                    resolve,
                                    // xhr => console.log(`${xhr.loaded/xhr.total *100}%loaded`),
                                    // error => reject(error)
                                )
                            },
                            xhr => console.log(`${xhr.loaded/xhr.total *100}%loaded`),
                            error => reject(error)
                        )

                    });
                    break;
                default:
                    return ''
            }
        });
        return Promise.all(promiseArr)
    }

    createGeometry() {
        let cube = new THREE.BoxGeometry(20, 20, 20);

        this.loader([
            { texture: crate, loader: 'TextureLoader' },
            { texture: './obj/bumblebee/bumblebee.FBX', loader: 'FBXLoader' },
            { texture: './obj/monu9.obj', loader: 'OBJLoader' },
        ]).then(texture => {

            let box1 = new THREE.Mesh(cube, new THREE.MeshPhongMaterial({
                map: texture[0]
            }))
            box1.castShadow = true;
            box1.receiveShadow = true;

            let fbx1 = texture[1];
            fbx1.scale.x = 0.03;
            fbx1.scale.y = 0.03;
            fbx1.scale.z = 0.03;
            fbx1.rotateX(-Math.PI / 2);
            fbx1.position.y -= 30;

            let myobj = new THREE.Object3D();
            myobj.add(fbx1)

            let monu = texture[2];
            monu.position.set(0, -30, 0);

            var texture = new THREE.Texture();
            var loader = new THREE.ImageLoader();
            //导入资源
            loader.load(
                //材质图片所在url
                './obj/monu9.png',
                function(image) {
                    texture.image = image;
                    texture.needsUpdate = true;
                });

            monu.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.material.map = texture;
                }
            });



            // this.onShadow(myobj)
            // this.onShadow(monu)


            // this.scene.add(box1);
            // this.scene.add(myobj);
            // this.scene.add(monu);


            // this.addMouseListener([myobj, monu]); //鼠标事件

            let ball = new THREE.SphereGeometry(40, 20, 20)
            let pMaterial = new THREE.PointsMaterial({
                color: '#f0f0f0',
                size: 2
            });
            let pSystem = new THREE.Points(ball, pMaterial);
            // this.scene.add(pSystem)


            // console.log(myobj, myobj.geometry) //mesh才有geometry，group等都没有

            // console.log(monu.children[0].geometry)

            // this.addPartice(monu.children[0].geometry)



            let particleCount = 1000,
                particles = new THREE.Geometry(),
                pMaterial2 = new THREE.PointsMaterial({
                    color: 0xffffff,
                    size: 2
                });

            for (let index = 0; index < particleCount; index++) {
                particles.vertices.push(new THREE.Vector3(
                    Math.random() * 200 - 100,
                    Math.random() * 200 - 100,
                    Math.random() * 200 - 100
                ))
            }

            for (let i = 0; i < particleCount - 3; i++) {
                particles.faces.push(new THREE.Face3(i, i + 1, i + 2));
            }


            // this.scene.add(new THREE.Points(
            //     particles,
            //     pMaterial2
            // ))



            // this.toBufferGeometry(particles)

            this.addPartice(monu.children[0].geometry, particles)

            console.log(monu.children[0].geometry)

            // this.addPartice(monu.children[0].geometry)

        }).catch(err =>
            console.log(err)
        );

    }

    onShadow(obj) {
        if (obj.type === 'Mesh') {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
        if (obj.children && obj.children.length > 0) {
            // console.log(1)
            obj.children.forEach((item) => {
                this.onShadow(item);
            })
        }
        return;
    }

    addMouseListener(objArr) {

        let dragControls = new THREE.DragControls(objArr, this.camera, this.renderer.domElement)
        dragControls.addEventListener("dragstart", (e) => { this.orbitControls.enabled = false })
        dragControls.addEventListener("dragend", (e) => { this.orbitControls.enabled = true })

    }
    toBufferGeometry(geometry) {
        if (geometry.type === "BufferGeometry") return geometry;
        return new THREE.BufferGeometry().fromGeometry(geometry)
    }

    addPartice(obj1, obj2) {
        obj1 = this.toBufferGeometry(obj1);
        obj2 = this.toBufferGeometry(obj2);
        let moreObj = obj1;
        let lessObj = obj2;

        if (obj2.attributes.position.array.lenth > obj1.attributes.position.array.lenth) {
            [moreObj, lessObj] = [lessObj, moreObj];
        }
        let morePos = moreObj.attributes.position.array;
        let lessPos = lessObj.attributes.position.array;
        let moreLen = morePos.length;
        let lessLen = lessPos.length;

        let position2 = new Float32Array(moreLen);

        position2.set(lessPos);

        for (let i = lessLen, j = 0; i < moreLen; i++, j++) {
            j %= lessLen;
            position2[i] = lessPos[j];
        }

        let sizes = new Float32Array(moreLen);
        for (let i = 0; i < moreLen; i++) {
            sizes[i] = 4;
        }

        moreObj.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
        moreObj.addAttribute('position2', new THREE.BufferAttribute(position2, 3));


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


        let pos = {
            val: 1
        };
        let tween = new TWEEN.Tween(pos).to({
            val: 0
        }, 1500).easing(TWEEN.Easing.Quadratic.InOut).delay(1000).onUpdate(callback)
        let tween2 = new TWEEN.Tween(pos).to({
            val: 1
        }, 1500).easing(TWEEN.Easing.Quadratic.InOut).delay(1000).onUpdate(callback);
        tween.chain(tween2);
        tween2.chain(tween)
        tween.start();

        function callback() {
            particleSystem.material.uniforms.val.value = this.val;
        }

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

    getTexture(canvasSize = 64) {
        let canvas = document.createElement('canvas');
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        canvas.style.background = "transparent";
        let context = canvas.getContext('2d');
        let gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width / 8, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, 'transparent');
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2, true);
        context.fill();
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }


    update() {
        TWEEN.update(); // 动画插件
        this.stats.update(); // 性能监测插件

        let time = Date.now() * 0.005
        if (this.particleSystem) {
            let bufferObj = this.particleSystem.geometry;
            // 粒子系统缓缓旋转
            this.particleSystem.rotation.y = 0.01 * time;
            let sizes = bufferObj.attributes.size.array;
            let len = sizes.length;
            for (let i = 0; i < len; i++) {
                sizes[i] = 1.5 * (2.0 + Math.sin(0.02 * i + time));
            }
            // 需指定属性需要被更新
            bufferObj.attributes.size.needsUpdate = true;

        }


        this.renderer.render(this.scene, this.camera); // 渲染器执行渲染
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