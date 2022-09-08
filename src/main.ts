import "./style.css"
import fragmentShader from "./fragment-shader.glsl"
import vertexShader from "./vertex-shader.glsl"
import {initShaderProgram} from "./shader"

function showError(error: Error) {
  const errorElement = document.querySelector("#error")!
  errorElement.classList.remove("hidden")
  errorElement.classList.add("shown")
  errorElement.innerHTML = error.message
}

function main() {
  const canvas = document.querySelector("#canvas") as HTMLCanvasElement
  // Initialize the GL context
  const gl = canvas.getContext("webgl2")

  // Only continue if WebGL is available and working
  if (gl === null) {
    console.error(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    )
    return
  }

  try {
    const shader = initShaderProgram(gl, vertexShader, fragmentShader)
  } catch (error) {
    showError(error as Error)
    return
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT)
}

window.onload = main
