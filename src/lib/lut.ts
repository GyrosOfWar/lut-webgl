import invariant from "tiny-invariant"

const RGB_REGEX = /\s*([.0-9]+)\s+([.0-9]+)\s+([.0-9]+)/
const TITLE_REGEX = /TITLE "(.*)"/
const DOMAIN_MIN_REGEX = /DOMAIN_MIN ([.0-9]+)\s+([.0-9]+)\s+([.0-9]+)/
const DOMAIN_MAX_REGEX = /DOMAIN_MAX ([.0-9]+)\s+([.0-9]+)\s+([.0-9]+)/
const SIZE_REGEX = /LUT_3D_SIZE ([0-9]+)/

type LineType = "color" | "domainMin" | "domainMax" | "size" | "title"

const REGEXES: {regex: RegExp; type: LineType}[] = [
  {regex: TITLE_REGEX, type: "title"},
  {regex: DOMAIN_MAX_REGEX, type: "domainMax"},
  {regex: DOMAIN_MIN_REGEX, type: "domainMin"},
  {regex: SIZE_REGEX, type: "size"},
  {regex: RGB_REGEX, type: "color"},
]

export type Rgb = [number, number, number]

type Line =
  | {
      type: "color"
      value: Rgb
    }
  | {
      type: "domainMin"
      value: Rgb
    }
  | {
      type: "domainMax"
      value: Rgb
    }
  | {
      type: "size"
      value: number
    }
  | {
      type: "title"
      value: string
    }

function matchRegexes(line: string): Line | undefined {
  for (const {regex, type} of REGEXES) {
    const match = regex.exec(line)
    if (match) {
      switch (type) {
        case "color":
        case "domainMin":
        case "domainMax": {
          const r = parseFloat(match[1])
          const g = parseFloat(match[2])
          const b = parseFloat(match[3])
          return {type, value: [r, g, b]}
        }

        case "size": {
          return {type, value: parseInt(match[1])}
        }

        case "title": {
          return {type, value: match[1].trim().replace(/"/g, "")}
        }
      }
    }
  }

  return undefined
}

export interface CubeLut {
  title?: string
  kind: "one" | "three"
  domainMin: Rgb
  domainMax: Rgb
  size: number
  data: Float64Array
}

interface CubeLutBuilder {
  title?: string
  kind: "one" | "three"
  domainMin?: Rgb
  domainMax?: Rgb
  size?: number
  data: Rgb[]
}

function fromBuilder(lut: CubeLutBuilder): CubeLut {
  invariant(lut.domainMin, "no domain minimum")
  invariant(lut.domainMax, "no domain maximum")
  invariant(lut.size, "no size")

  return {
    title: lut.title,
    kind: lut.kind,
    domainMin: lut.domainMin,
    domainMax: lut.domainMax,
    data: Float64Array.from(lut.data.flat()),
    size: lut.size,
  }
}

export function parseCubeLut(input: string): CubeLut {
  const lines = input.split("\n")
  const lut: CubeLutBuilder = {
    data: [],
    kind: "three",
  }

  lines.forEach((line) => {
    line = line.trim()
    if (line.startsWith("#")) {
      return
    }
    const parsedLine = matchRegexes(line)
    if (parsedLine) {
      switch (parsedLine.type) {
        case "color":
          lut.data.push(parsedLine.value)
          break
        case "title":
          lut.title = parsedLine.value
          break
        case "domainMax":
          lut.domainMax = parsedLine.value
          break
        case "domainMin":
          lut.domainMin = parsedLine.value
          break
        case "size":
          lut.size = parsedLine.value
          break
      }
    }
  })

  return fromBuilder(lut)
}
