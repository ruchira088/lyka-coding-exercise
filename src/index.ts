import {BoardDimensions, Coordinate, Direction} from "./types"

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
    (boardDimensions: BoardDimensions, position: Coordinate) =>
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

const move = (startingPosition: Coordinate, boardDimensions: BoardDimensions, directions: Direction[]): Coordinate =>
    directions.reduce(
        (position, direction) => {
            const next: Coordinate = nextPosition(position, direction)

            if (isValidPosition(boardDimensions, next)) {
                return next
            } else {
                return position
            }
        },
        startingPosition
    )

const start = (startingPosition: Coordinate, boardDimensions: BoardDimensions, inputDirections: string) => {
    const directions: Direction[] = parseDirections(inputDirections)

    const finalPosition = move(startingPosition, boardDimensions, directions)

}