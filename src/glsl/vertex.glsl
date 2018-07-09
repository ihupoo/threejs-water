attribute vec2 vertex;
const float PI = 3.141592653589793;


void main(){
    coord = vertex * 0.5 + 0.5;

    gl_Position = vec4(vertex, 0.0, 1.0);
}