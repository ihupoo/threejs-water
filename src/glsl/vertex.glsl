

varying vec2 coord;

void main(){
    coord = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}