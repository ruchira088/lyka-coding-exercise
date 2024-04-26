
export enum Direction {
    NORTH = "N",
    EAST = "E",
    WEST = "W",
    SOUTH = "S"
}

export interface Coordinate {
    readonly x: number
    readonly y: number
}

export interface WarehouseDimensions {
    readonly height: number
    readonly width: number
}