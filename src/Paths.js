import scene;

var screenWidth = scene.screen.width;
var screenHeight = scene.screen.height;

exports = {
	moveDown:
	[
		{ vx: 0, vy: 100, distance: screenHeight + 200 }
	],

	zigzagDown1:
	[
		{ vx: -50, vy: 100, distance: screenHeight / 3 },
		{ vx: 50, vy: 100, distance: screenHeight / 3 },
		{ vx: -50, vy: 100, distance: screenHeight / 3 },
		{ vx: 50, vy: 100, distance: screenHeight / 3 },
		{ vx: -50, vy: 100, distance: screenHeight / 3 },
	],

	zigzagDown2:
	[
		{ vx: 50, vy: 100, distance: screenHeight / 3 },
		{ vx: -50, vy: 100, distance: screenHeight / 3 },
		{ vx: 50, vy: 100, distance: screenHeight / 3 },
		{ vx: -50, vy: 100, distance: screenHeight / 3 },
		{ vx: 50, vy: 100, distance: screenHeight / 3 },
	],
	
	curveRight:
	[
		{ vx: 100, vy: -50, distance: screenWidth / 3 },
		{ vx: 100, vy: -25, distance: screenWidth / 4 },
		{ vx: 100, vy: 0, distance: screenWidth / 4 },
		{ vx: 100, vy: 25, distance: screenWidth / 4 },
		{ vx: 100, vy: 50, distance: screenWidth / 3 },
		{ vx: 100, vy: 75, distance: screenWidth / 4 },
	],
	
	curveLeft:
	[
		{ vx: -100, vy: -50, distance: screenWidth / 3 },
		{ vx: -100, vy: -25, distance: screenWidth / 4 },
		{ vx: -100, vy: 0, distance: screenWidth / 4 },
		{ vx: -100, vy: 25, distance: screenWidth / 4 },
		{ vx: -100, vy: 50, distance: screenWidth / 3 },
		{ vx: -100, vy: 75, distance: screenWidth / 4 },
	],
	
	bossMove1:
	[
		{ vx: -100, vy: 50, distance: 500},
		{ vx: 100, vy: 0, distance: 1000},
		{ vx: -100, vy: 0, distance: 1000},
		{ vx: 100, vy: 0, distance: 1000},
		{ vx: -100, vy: 0, distance: 1000},
		{ vx: 100, vy: 0, distance: 1000},
		{ vx: -100, vy: 0, distance: 1000},
		{ vx: 100, vy: 0, distance: 1000},
		{ vx: -100, vy: 0, distance: 1000},
		{ vx: 100, vy: 0, distance: 1000},
		{ vx: -100, vy: 0, distance: 1000},
		{ vx: 100, vy: 0, distance: 1000},
		{ vx: -100, vy: -50, distance: 500},
	],
	
	bossMove2:
	[
		{ vx: -100, vy: 100, distance: 300},
		{ vx: 100, vy: 100, distance: 600},
		{ vx: -100, vy: 100, distance: 300},
		{ vx: -100, vy: -100, distance: 300},
		{ vx: 100, vy: -100, distance: 600},
		{ vx: -100, vy: -100, distance: 300},
	],
};