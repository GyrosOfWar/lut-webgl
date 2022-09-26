// basic cube LUT parser

const RGB_REGEX = /\s*([.0-9]+)\s+([.0-9]+)\s+([.0-9]+)/
const TITLE_REGEX = /TITLE "(.*)"/
const DOMAIN_MIN_REGEX = /DOMAIN_MIN ([.0-9]+)\s+([.0-9]+)/
const DOMAIN_MAX_REGEX = /DOMAIN_MAX ([.0-9]+)\s+([.0-9]+)/
const SIZE_REGEX = /LUT_3D_SIZE ([0-9]+)/

export interface Rgb {
  r: number
  g: number
  b: number
}

export class CubeLut {
  title?: string
  kind: "one" | "three"
  domainMin: Rgb
  domainMax: Rgb
  size: number
  data: Rgb[]
}

export function parseCubeLut(input: string) {
  const lines = input.split("\n")
  const data = []

  lines.forEach((line) => {
    line = line.trim()
    if (line.startsWith("#")) {
      return
    }

    const match = RGB_REGEX.exec(line)
    if (match?.length === 4) {
      const r = parseFloat(match[1])
      const g = parseFloat(match[2])
      const b = parseFloat(match[3])
      data.push({r, g, b})
    }
  })

  return {data}
}
