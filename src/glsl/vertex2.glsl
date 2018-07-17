precision highp float;


varying vec2 ripplesCoord;
varying vec2 backgroundCoord;
void main(){
    backgroundCoord =  uv ;


    ripplesCoord = uv ;



    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);;
}