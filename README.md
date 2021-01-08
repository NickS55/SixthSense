# SixthSense

## the purpose of this project

1) to create a tool for pitchers who want to advance their craft 

## Features
Completed :bowtie:

    - create a baseball simulator using three js and Trakman/rapsodo/flightscope

In-Progress:

    -using a k-means algorithm to categorize pitches
    -study pitch sequences and use gametheory and psychology to create specific sequences
    -a pitch grader that estimates the effectiveness of pitches based on mlb pitcher data


## How to Run Locally
1) install yarn 
    - made on Mac OS
    - installed using homebrew ($ brew install yarn)

2) install Golang
    - $ brew install golang

2) add depencies to the project 
    - $ yarn install

3) run 
    - $ yarn run build

4) local host
    - http://localhost:3000/
    - http://localhost:3000/application
    - to change port from 3000 change the number in main.go 

References:
    - [Determining the 3D Spin Axis from Statcast Data - Alan M. Nathan Ph.D.](http://baseball.physics.illinois.edu/trackman/spinaxis.pdf)
