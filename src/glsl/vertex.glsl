attribute float size;
attribute vec3 position2;
uniform float val;

varying float opacity;
varying vec3 vColor;
void main(){
    float border = -150.0;
    float min_border = -160.0;
    float max_opacity = 1.0;
    float min_opacity = 0.03;
    float sizeAdd = 20.0;



    vec3 vPos;
    vPos.x = position.x *val + position2.x *(1.-val);
    vPos.y = position.y *val + position2.y *(1.-val);
    vPos.z = position.z *val + position2.z *(1.-val);

    vec4 mvPosition = modelViewMatrix * vec4(vPos,1.0);
   
   

    if(mvPosition.z > border){
        opacity = max_opacity;
        gl_PointSize = size ;
    }else if(mvPosition.z < min_border){
         opacity = min_opacity;
        gl_PointSize = size +sizeAdd;
    }else{
        float percent = (border-mvPosition.z)/(border-min_border);
        opacity = (1.0-percent)*(max_opacity-min_opacity)+min_opacity;
        gl_PointSize = percent*(sizeAdd)+size;
    }

    vColor.x = abs(sin(vPos.y));
    vColor.y = abs(cos(vPos.y));
    vColor.z = abs(cos(vPos.y));



    gl_Position = projectionMatrix * mvPosition;
}