precision highp float;

uniform sampler2D texture;
uniform vec2 delta;

varying vec2 coord;


void main(){
    vec4 info = texture2D(texture, coord);
    vec2 dx = vec2(delta.x, 0.0);
    vec2 dy = vec2(0.0, delta.y);

    float average = (
        texture2D(texture, coord - dx).r +
        texture2D(texture, coord - dy).r +
        texture2D(texture, coord + dx).r +
        texture2D(texture, coord + dy).r)*0.25;

    // info.g += (average - info.r) * 2.0;
    float a = info.r;
    float b = info.g;

    info.g  = b + average  * 2.0  -  a * 2.0 ;

    info.r = b  + average  * 2.0  -  a ;



    gl_FragColor = info;

}