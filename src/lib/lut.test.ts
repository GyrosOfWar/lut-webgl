import {assert, expect, test} from "vitest"
import {parseCubeLut} from "./lut"
import {readFileSync} from "fs"

const lut = readFileSync("./luts/Faded 47.CUBE", {encoding: "utf-8"})

test("parseCubeLut", () => {
  expect(parseCubeLut(lut)).toBe({data: []})
})
