uniform vec3 color;

varying vec3 vColor;

varying float opacity;

uniform sampler2D texture;
void main(){
    gl_FragColor = vec4(color*vColor,opacity) * texture2D(texture,gl_PointCoord);
}