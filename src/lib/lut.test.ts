import {expect, test} from "vitest"
import {parseCubeLut} from "./lut"
import {readFileSync} from "fs"

const lut = readFileSync("./luts/Faded 47.CUBE", {encoding: "utf-8"})

test("parseCubeLut", () => {
  const result = parseCubeLut(lut)
  expect(result.title).toBe("Warm")
  expect(result.domainMin).toStrictEqual([0, 0, 0])
  expect(result.domainMax).toStrictEqual([1, 1, 1])
  expect(result.size).toBe(32)
  expect(result.data).toHaveLength(32768)
})
