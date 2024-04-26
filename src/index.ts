import {BoardDimensions, Coordinate, Direction} from "./types"
import winston, {Logger, transports} from "winston"

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
    (boardDimensions: BoardDimensions) => (position: Coordinate): boolean =>
        position.x >= 0 && position.y >= 0 && position.x < boardDimensions.width && position.y < boardDimensions.height

export const parseDirections = (input: string): Direction[] => {
    const directions: Direction[] =
        input.split(" ")
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
                logger.warn(`Unable to move ${direction} from x=${position.x}, y=${position.y}. Ignoring direction`)

                return position
            }
        },
        startingPosition
    )

    return position
}

const start = (startingPosition: Coordinate, boardDimensions: BoardDimensions, inputDirections: string): Coordinate | undefined => {
    try {
        const directions: Direction[] = parseDirections(inputDirections)

        logger.debug(`Input directions: ${directions.join(", ")}`)

        const positionValidator: (position: Coordinate) => boolean = isValidPosition(boardDimensions)
        const finalPosition: Coordinate = move(startingPosition, positionValidator, directions)
        return finalPosition
    } catch (error) {
        logger.error(error)
        return undefined
    }
}