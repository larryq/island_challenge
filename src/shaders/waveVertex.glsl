precision mediump float;

//attribute vec3 position;
//attribute vec3 normal;

varying vec3 FragPos;
varying vec3 Normal;

uniform float time;
// uniform mat4 modelMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 projectionMatrix;
// uniform mat3 normalMatrix;

void main() {
    float amplitude = 0.05;
    float frequency = 14.9;
    float speed = 0.49;

    vec3 pos = position;
    pos.y += amplitude * sin(frequency * pos.x + time * speed);
    pos.y += amplitude * cos(frequency * pos.z + time * speed);

    FragPos = vec3(modelMatrix * vec4(pos, 1.0));
    Normal = mat3(normalMatrix) * normal;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
}