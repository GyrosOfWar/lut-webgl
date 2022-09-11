<script lang="ts">
  import "./app.css"
  import {onMount} from "svelte"
  import {initShaderProgram} from "./lib/shader"
  import fragmentShader from "./lib/shaders/fragment-shader.glsl"
  import vertexShader from "./lib/shaders/vertex-shader.glsl"
  import {renderImage} from "./lib/render"

  let canvasElement: HTMLCanvasElement
  let error: Error

  onMount(() => {
    const gl = canvasElement.getContext("webgl2")
    const image = new Image()
    image.src = "/example.jpeg"
    image.onload = () => {
      try {
        const aspectRatio = image.naturalWidth / image.naturalHeight
        const canvasWidth = canvasElement.width
        const newHeight = canvasWidth * (1 / aspectRatio)
        canvasElement.height = newHeight

        const shader = initShaderProgram(gl, vertexShader, fragmentShader)
        renderImage(gl, image, shader)
      } catch (e) {
        error = e as Error
      }
    }
  })
</script>

{#if error}
  <div class="bg-red-500 text-white px-8 pt-4">
    <strong>An error occurred:</strong>
    <pre>{error.message}</pre>
  </div>
{/if}
<canvas bind:this={canvasElement} width="1500" />
