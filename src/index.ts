import winston, {Logger, transports} from "winston"
import fs from "node:fs/promises"
import path from "node:path"
import {Coordinate, Direction, WarehouseDimensions} from "./types"

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

export const prettyDirection = (direction: Direction): string => {
    const [word] =
        Object.entries(Direction).find(([key, value]) => value === direction) as [string, Direction]

    return word
}

const move = (startingPosition: Coordinate, positionValidator: (position: Coordinate) => boolean, directions: Direction[]): Coordinate => {
    const position: Coordinate = directions.reduce(
        (position, direction) => {
            const next: Coordinate = nextPosition(position, direction)

            if (positionValidator(next)) {
                return next
            } else {
                logger.warn(`Unable to move ${prettyDirection(direction)} from ${prettyPrint(position)}. Ignoring direction`)

                return position
            }
        },
        startingPosition
    )

    return position
}

export const start = (startingPosition: Coordinate, warehouseDimensions: WarehouseDimensions, inputDirections: string): Coordinate => {
    const directions: Direction[] = parseDirections(inputDirections)

    logger.debug(`Input directions: ${directions.join(", ")}`)

    const positionValidator: (position: Coordinate) => boolean = isValidPosition(warehouseDimensions)
    const finalPosition: Coordinate = move(startingPosition, positionValidator, directions)

    return finalPosition
}

export const readDirectionsFile = async (inputFilePath?: string): Promise<string> => {
    const inputFile =
        (inputFilePath == undefined || inputFilePath.trim().length === 0) ?
            path.resolve(__dirname, "../input-directions.txt") : inputFilePath

    logger.info(`Fetching input directions from ${inputFile}`)

    try {
        const content = await fs.readFile(inputFile, "utf8")
        return content
    } catch (error) {
        throw new Error(`Unable to read file located at ${inputFile}`)
    }
}

const run = async (inputFilePath?: string): Promise<Coordinate | undefined> => {
    const startingPosition: Coordinate = {x: 0, y: 0}
    const warehouseDimensions: WarehouseDimensions = {height: 10, width: 10}

    logger.info(`Starting position: ${prettyPrint(startingPosition)}, Warehouse dimensions: (height=${warehouseDimensions.height}, width=${warehouseDimensions.width})`)

    try {
        const inputDirections: string = await readDirectionsFile(inputFilePath)
        const position = start(startingPosition, warehouseDimensions, inputDirections)
        logger.info(`The robot's final position is ${prettyPrint(position)}`)
        return position
    } catch (error) {
        logger.error((error as Error).message || error)
        return undefined
    }
}

const inputFile: string | undefined = process.argv[2]
run(inputFile)