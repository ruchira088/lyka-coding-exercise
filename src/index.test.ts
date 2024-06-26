import {isValidPosition, nextPosition, parseDirection, parseDirections, readDirectionsFile} from "./index"
import {WarehouseDimensions, Coordinate, Direction} from "./types"
import path from "path"

test("Should go to the expected next position", () => {
    const position: Coordinate = {x: 0, y: 0}

    expect(nextPosition(position, Direction.NORTH)).toStrictEqual({x: 0, y: 1})
    expect(nextPosition(position, Direction.SOUTH)).toStrictEqual({x: 0, y: -1})
    expect(nextPosition(position, Direction.WEST)).toStrictEqual({x: -1, y: 0})
    expect(nextPosition(position, Direction.EAST)).toStrictEqual({x: 1, y: 0})
})

describe("Parsing direction", () => {
    test("Should parse input string as Direction", () => {
        expect(parseDirection("N")).toStrictEqual(Direction.NORTH)
        expect(parseDirection("S")).toStrictEqual(Direction.SOUTH)
        expect(parseDirection("W")).toStrictEqual(Direction.WEST)
        expect(parseDirection("E")).toStrictEqual(Direction.EAST)
    })

    test("Should return undefined for invalid direction string", () => {
        expect(parseDirection("A")).not.toBeDefined()
    })
})

describe("Parsing string of directions", () => {
    test("Should parse string as an array of directions", () => {
        expect(parseDirections("N E W S")).toStrictEqual([Direction.NORTH, Direction.EAST, Direction.WEST, Direction.SOUTH])
    })

    test("Should throw exception for an invalid directions", () => {
        expect(() => parseDirections("N E W S B")).toThrow(new Error("Invalid direction: B"))
    })
})

test("Should read input directions file", async () => {
    const content = await readDirectionsFile(path.resolve(__dirname, "../test-data/directions.txt"))
    expect(content).toStrictEqual("N E N E N E N E")
})

test("Should throw error for non-existing directions file", async () => {
    await expect(async () => await readDirectionsFile("../test-data/non-existing-file.txt"))
        .rejects.toThrow("Unable to read file located at ../test-data/non-existing-file.txt")
})

test("Should return whether the position is valid on the board", () => {
    const boardDimensions: WarehouseDimensions = {height: 10, width: 10}
    const isValid = isValidPosition(boardDimensions)

    expect(isValid({x: 1, y: 0})).toBeTruthy()
    expect(isValid({x: 0, y: 1})).toBeTruthy()
    expect(isValid({x: 9, y: 0})).toBeTruthy()
    expect(isValid({x: 0, y: 9})).toBeTruthy()

    expect(isValid({x: 0, y: 10})).toBeFalsy()
    expect(isValid({x: 10, y: 0})).toBeFalsy()
    expect(isValid({x: 0, y: -1})).toBeFalsy()
    expect(isValid({x: -1, y: 0})).toBeFalsy()
})