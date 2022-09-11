function setRectangle(
  gl: WebGL2RenderingContext,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const x1 = x
  const x2 = x + width
  const y1 = y
  const y2 = y + height
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  )
}

export function renderImage(
  gl: WebGL2RenderingContext,
  image: HTMLImageElement,
  program: WebGLProgram
) {
  // const program = initShaderProgram(gl, vertexShader, fragmentShader)

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
  const texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord")

  // lookup uniforms
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution")
  const imageLocation = gl.getUniformLocation(program, "u_image")

  // Create a vertex array object (attribute state)
  const vao = gl.createVertexArray()

  // and make it the one we're currently working with
  gl.bindVertexArray(vao)

  // Create a buffer and put a single pixel space rectangle in
  // it (2 triangles)
  const positionBuffer = gl.createBuffer()

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation)

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  let size = 2 // 2 components per iteration
  let type = gl.FLOAT // the data is 32bit floats
  let normalize = false // don't normalize the data
  let stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
  let offset = 0 // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  )

  // provide texture coordinates for the rectangle.
  const texCoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
    ]),
    gl.STATIC_DRAW
  )

  // Turn on the attribute
  gl.enableVertexAttribArray(texCoordAttributeLocation)

  // Tell the attribute how to get data out of texCoordBuffer (ARRAY_BUFFER)
  size = 2 // 2 components per iteration
  type = gl.FLOAT // the data is 32bit floats
  normalize = false // don't normalize the data
  stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
  offset = 0 // start at the beginning of the buffer
  gl.vertexAttribPointer(
    texCoordAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  )

  // Create a texture.
  const texture = gl.createTexture()

  // make unit 0 the active texture uint
  // (ie, the unit all other texture commands will affect
  gl.activeTexture(gl.TEXTURE0 + 0)

  // Bind it to texture unit 0' 2D bind point
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // Set the parameters so we don't need mips and so we're not filtering
  // and we don't repeat at the edges
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  // Upload the image into the texture.
  const mipLevel = 0 // the largest mip
  const internalFormat = gl.RGBA // format we want in the texture
  const srcFormat = gl.RGBA // format of data we are supplying
  const srcType = gl.UNSIGNED_BYTE // type of data we are supplying
  gl.texImage2D(
    gl.TEXTURE_2D,
    mipLevel,
    internalFormat,
    srcFormat,
    srcType,
    image
  )

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program)

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vao)

  // Pass in the canvas resolution so we can convert from
  // pixels to clipspace in the shader
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)

  // Tell the shader to get the texture from texture unit 0
  gl.uniform1i(imageLocation, 0)

  // Bind the position buffer so gl.bufferData that will be called
  // in setRectangle puts data in the position buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // Set a rectangle the same size as the image.
  setRectangle(gl, 0, 0, gl.canvas.width, gl.canvas.height)

  // Draw the rectangle.
  const primitiveType = gl.TRIANGLES
  offset = 0
  const count = 6
  gl.drawArrays(primitiveType, offset, count)
}
