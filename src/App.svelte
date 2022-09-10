<script lang="ts">
  import "./app.css"
  import {onMount} from "svelte"
  import {initShaderProgram} from "./lib/shader"
  import fragmentShader from "./lib/shaders/fragment-shader.glsl"
  import vertexShader from "./lib/shaders/vertex-shader.glsl"

  let canvasElement: HTMLCanvasElement
  let error: Error

  onMount(() => {
    const gl = canvasElement.getContext("webgl2")
    try {
      initShaderProgram(gl, vertexShader, fragmentShader)
    } catch (e) {
      error = e
    }
  })
</script>

{#if error}
  <div class="bg-red-500 text-white px-4 pt-4">
    <strong>An error occurred:</strong>
    <pre>{error.message}</pre>
  </div>
{/if}
<canvas bind:this={canvasElement} width="500" height="500" />
