#version 300 es

in vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
out vec4 position;

void main() {
    position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}