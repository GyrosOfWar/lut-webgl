#version 300 es

precision highp float;
precision highp sampler3D;

in vec2 texCoord;
uniform sampler3D lut;
uniform sampler2D image;
uniform vec3 lutSize;
out vec4 colorOut;

void main() {
  vec3 scale = (lutSize - 1.0) / lutSize;    
  vec3 offset = 1.0 / (2.0 * lutSize);
  vec3 rawColor = texture(image, texCoord).rgb;
  colorOut = texture(lut, scale * rawColor + offset);
}
