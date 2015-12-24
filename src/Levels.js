import scene;

var screenWidth = scene.screen.width;
var screenHeight = scene.screen.height;

exports = [
    // Level 1
    function () {
        var x = screenWidth / 2;
        var y = -100;
        var boss = addEnemy('boss1', x, y, 'bossMove');
        		
        wait(1000);
		runBossLevel(bossLevel1);
    },
    
    // Level 2
    function () {
        var x = -100;
        var y = randomY(300, 100);
        addEnemy('drone', x, y, 'curveRight');
		addEnemy('drone', x - 90, y - 90, 'curveRight');
		addEnemy('drone', x - 90, y + 90, 'curveRight');
        
        wait(1000);
    },
];

var bossLevel1 = [
	// Wave 1
    function () {
		
		console.log('wave');
        var x = randomX(40);
        var y = -100;
        addEnemy('drone', x, y, 'zigzagDown');
		addEnemy('drone', x - 90, y - 90, 'moveDown');
		addEnemy('drone', x - 90, y + 90, 'zigzagDown2');
        
        wait(5000);
    },
];
