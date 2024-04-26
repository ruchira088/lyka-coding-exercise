import winston, {Logger, transports} from "winston"
import fs from "fs"
import {Coordinate, Direction, WarehouseDimensions} from "./types"
import path from "path"
import {promisify} from "util"

const logger: Logger = winston.createLogger({
    level: "info",
    transports: new transports.Console()
})

export const nextPosition =
    (position: Coordinate, direction: Direction): Coordinate => {
        const {x, y} = position

        switch (direction) {
            case Direction.NORTH:
                return {x, y: y + 1}
            case Direction.EAST:
                return {x: x + 1, y}
            case Direction.SOUTH:
                return {x, y: y - 1}
            case Direction.WEST:
                return {x: x - 1, y}
        }
    }

export const isValidPosition =
    (warehouseDimensions: WarehouseDimensions) => (position: Coordinate): boolean =>
        position.x >= 0 && position.y >= 0 && position.x < warehouseDimensions.width && position.y < warehouseDimensions.height

const prettyPrint = (coordination: Coordinate): string => `(x=${coordination.x}, y=${coordination.y})`

export const parseDirections = (input: string): Direction[] => {
    const directions: Direction[] =
        input.split(/\s+/)
            .map(string => string.trim())
            .filter(string => string.length > 0)
            .map(string => {
                const direction = parseDirection(string)

                if (direction != undefined) {
                    return direction
                } else {
                    throw new Error(`Invalid direction: ${string}`)
                }
            })

    return directions
}

export const parseDirection = (input: string): Direction | undefined =>
    Object.values(Direction).find(value => value === input)

const move = (startingPosition: Coordinate, positionValidator: (position: Coordinate) => boolean, directions: Direction[]): Coordinate => {
    const position: Coordinate = directions.reduce(
        (position, direction) => {
            const next: Coordinate = nextPosition(position, direction)

            if (positionValidator(next)) {
                return next
            } else {
                logger.warn(`Unable to move ${direction} from ${prettyPrint(position)}. Ignoring direction`)

                return position
            }
        },
        startingPosition
    )

    return position
}

export const start = (startingPosition: Coordinate, warehouseDimensions: WarehouseDimensions, inputDirections: string): Coordinate | undefined => {
    try {
        const directions: Direction[] = parseDirections(inputDirections)

        logger.debug(`Input directions: ${directions.join(", ")}`)

        const positionValidator: (position: Coordinate) => boolean = isValidPosition(warehouseDimensions)
        const finalPosition: Coordinate = move(startingPosition, positionValidator, directions)
        return finalPosition
    } catch (error) {
        logger.error(error)
        return undefined
    }
}

const run = async (inputFilePath?: string) => {
    const startingPosition: Coordinate = {x: 0, y: 0}
    const warehouseDimensions: WarehouseDimensions = {height: 10, width: 10}

    logger.info(`Starting position: ${prettyPrint(startingPosition)}, Warehouse dimensions: (height=${warehouseDimensions.height}, width=${warehouseDimensions.width})`)

    const inputFile =
        (inputFilePath == undefined || inputFilePath.trim().length === 0) ?
            path.resolve(__dirname, "../input-directions.txt") : inputFilePath

    logger.info(`Fetching input directions from ${inputFile}`)

    const content: string = await promisify(fs.readFile)(inputFile, "utf8")

    const position = start(startingPosition, warehouseDimensions, content)

    if (position != undefined) {
        logger.info(`The robot's final position is ${prettyPrint(position)}`)
    }
}



console.log(process.argv[2])

run()