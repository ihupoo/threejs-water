// class ThreeDemo{
//     constructor(opts){
//         this.container = opts.el;
//         this.createScene();//场景
//         this.createLight();//灯光
//         this.createGeometry();//物体

//         this.addMouseListener();//鼠标事件
//         this.orbitControls = new THREE.OrbitControls(this.camera);//轨道控制插件
//         this.orbitControls.autoRotate = true;

//         this.initStats()//性能监控插件

//         this.update()//循环更新场景
//     }

//     createScene(){
//         this.WIDTH = this.container.innerWidth;
//         this.HEIGHT = this.container.innerHeight;

//     }
// }

// window.onload = function(){
//     new ThreeDemo({
//         el:document.getElementById("canvas3D"),

//     })
// }


if (module.hot) {
    module.hot.accept()
}