import {assert, expect, test} from "vitest"
import {parseCubeLut} from "./lut"

test("parseCubeLut", () => {
  expect(parseCubeLut("")).toBe("")
})
