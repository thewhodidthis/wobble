import { assert, report } from "tapeless"
import createFilter from "./main.js"

const { equal } = assert
const filter = createFilter()
const { data } = filter()

equal
  .describe("returns lambda on init")
  .test(typeof filter, "function")
  .describe("no data", "will default")
  .test(data.length, 0)

const source = { data: [1, 2, 3, 4] }
const result = filter(source)

equal
  .describe("input/output size is a match", "will operate")
  .test(result.data.length, source.data.length)

report()
