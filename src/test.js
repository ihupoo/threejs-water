class a {

    constructor() {
        this.bufferTexture = new THREE.WebGLRenderTarget(
            512, 512, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter
            });
        this.bufferTexture2 = new THREE.WebGLRenderTarget(
            512, 512, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter
            });
        this.aorb = true;
    }


    drop() {
        let bufferScene = new THREE.Scene();


        let plane = new THREE.PlaneBufferGeometry(512, 512);
        let camera = new THREE.OrthographicCamera(-512, 512, 512, -512, 0, 512);

        let uniforms = {
            texture: {
                value: this.aorb ? this.bufferTexture.texture : this.bufferTexture2.texture
            },
            center: {
                value: new THREE.Vector2(0.0, 0.0)
            },
            radius: {
                value: 20.0
            },
            strength: {
                value: 1.0
            }
        }
        let material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: ``,
            fragmentShader: ``,
            blending: THREE.AdditiveBlending,
            depthTest: false
        })


        let mesh = new THREE.Mesh(plane, material);

        bufferScene.add(mesh);

        this.renderer.render(bufferScene, camera,
            this.aorb ? this.bufferTexture2 : this.bufferTexture
        );
        this.bufferTexture.texture.needsUpdate = true;

        this.aorb = !this.aorb;
    }


    update() {
        let bufferScene = new THREE.Scene();


        let plane = new THREE.PlaneBufferGeometry(512, 512);
        let camera = new THREE.OrthographicCamera(-512, 512, 512, -512, 0, 512);

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
            vertexShader: ``,
            fragmentShader: ``,
            blending: THREE.AdditiveBlending,
            depthTest: false
        })


        let mesh = new THREE.Mesh(plane, material);

        bufferScene.add(mesh);

        this.renderer.render(bufferScene, camera,
            this.aorb ? this.bufferTexture : this.bufferTexture2
        );
        this.bufferTexture.texture.needsUpdate = true;

        this.aorb = !this.aorb;
    }


    render() {
        let plane = new THREE.PlaneBufferGeometry(512, 512, 512, 512);

        let uniforms = {
            samplerBackground: {
                value: texture
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
            vertexShader: ``,
            fragmentShader: ``,
            blending: THREE.AdditiveBlending,
            depthTest: false
        })


        let mesh = new THREE.Mesh(plane, material);

        this.scene.add(mesh)

        this.renderer.render(this.scene, this.camera);


    }





}