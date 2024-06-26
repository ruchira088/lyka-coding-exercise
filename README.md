<img width="102" alt="lyka-logo" src="https://github.com/ruchira088/lyka-coding-exercise/assets/5546272/c025a767-3e8a-41d2-9edc-9915c71cf0d4">

## Lyka Coding Exercise 
[![build-pipeline](https://github.com/ruchira088/lyka-coding-exercise/actions/workflows/build-pipeline.yml/badge.svg)](https://github.com/ruchira088/lyka-coding-exercise/actions/workflows/build-pipeline.yml)

#### Requirements

* Create a way to send a series of commands to the robot
* Make sure the robot doesn't try to break free and move outside the boundary of the warehouse

The robot should accept the following commands:

* N move north
* W move west
* E move east
* S move south

#### Example command sequences

The command sequence: "N E S W" will move the robot in a full square, returning it to where it started.

If the robot starts in the south-west corner of the warehouse then the following commands will move it to the middle of the warehouse.

"N E N E N E N E"

### How to run the program

Ensure that you have **node.js** installed on your system.

```shell
npm i
npm start
```

The robot instructions file is named `input-directions.txt` which located at the project's root directory.

You can override the location of the robot instructions file by passing the path of the file,

```shell
npm start /Users/ruchira/Development/lyka-coding-exercise/test-data/directions.txt
```

