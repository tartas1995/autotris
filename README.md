# autotris
One of the most important features of the famous block game, is the fact that it is an user controls the pieces. We don't do that here.

THIS IS CEF ONLY. Workers that support modules are "required". fork it if you want to change that.

# configuration

parameters|type|description
----------|----|-----------
game settings||
timeBetweenMoves|number|milliseconds between the game's actions
display settings||
fpsInterval|number|refresh rate of the display (time between frames)
displayScore|boolean|display a score
color|string|the color of the score
fontSize|string|the font size of the score
fontFamily|string|the font family of the score
pixelsPerBlock|number|size of a block
ai settings||
aiInterval|number|milliseconds between ai inputs
aggregateHeight|number|weight of aggregate Height
lines|number| weight of lines cleared
holes|number| weight of holes created
bumpiness|number| weight of bumpiness
shared settings||
numberOfRows|number|number of rows of the board
numberOfColumns|number| number of columns of the board
