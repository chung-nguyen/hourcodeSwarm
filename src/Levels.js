import scene;

var screenWidth = scene.screen.width;
var screenHeight = scene.screen.height;

exports = [
    function () {
        var x = randomX(100);
        var y = -100;
        addEnemy('drone', x, y, 'moveDown');
		addEnemy('drone', x - 90, y - 90, 'moveDown');
		addEnemy('drone', x + 90, y - 90, 'moveDown');
		
		addEnemy('mine', x + 160, y, 'moveDown');
		addEnemy('mine', x - 160, y, 'moveDown');
        
        wait(6000);
    },
    
    function () {
        var x = -100;
        var y = randomY(300, 100);
        addEnemy('drone', x, y, 'curveRight');
		addEnemy('drone', x - 90, y - 90, 'curveRight');
		addEnemy('drone', x - 90, y + 90, 'curveRight');
        
        wait(3000);
    },
	
    function () {
        var x = screenWidth + 100;
        var y = randomY(300, 100);
        addEnemy('drone', x, y, 'curveLeft');
		addEnemy('drone', x - 90, y - 90, 'curveLeft');
		addEnemy('drone', x - 90, y + 90, 'curveLeft');
        
        wait(3000);
    },
	
    function () {
        var x = randomX(100);
        var y = -100;
        addEnemy('drone', x, y, 'zizagDown1');
		addEnemy('drone', x - 90, y - 90, 'zizagDown1');
		addEnemy('drone', x + 90, y - 90, 'zizagDown1');
		
		addEnemy('mine', x + 160, y, 'moveDown');
		addEnemy('mine', x - 160, y, 'moveDown');
        
        wait(2000);
    },
	
    function () {
        var x = randomX(100);
        var y = -100;
        addEnemy('drone', x, y, 'zizagDown2');
		addEnemy('drone', x - 90, y - 90, 'zizagDown2');
		addEnemy('drone', x + 90, y - 90, 'zizagDown2');
		
		addEnemy('mine', x + 160, y, 'moveDown');
		addEnemy('mine', x - 160, y, 'moveDown');
        
        wait(2000);
    },
	
    function () {
        var x = -100;
        var y = randomY(300, 100);
        addEnemy('drone', x, y, 'curveRight');
		addEnemy('drone', x - 90, y - 90, 'curveRight');
		addEnemy('drone', x - 90, y + 90, 'curveRight');
        
        wait(2000);
    },
	
	// Level 7
    function () {
        var x = screenWidth + 100;
        var y = randomY(300, 100);
        addEnemy('drone', x, y, 'curveLeft');
		addEnemy('drone', x - 90, y - 90, 'curveLeft');
		addEnemy('drone', x - 90, y + 90, 'curveLeft');
        
        wait(2000);
    },
	
    function () {
        var x = randomX(100);
        var y = -100;
        addEnemy('drone', x, y, 'zizagDown1');
		addEnemy('drone', x - 90, y - 90, 'zizagDown1');
		addEnemy('drone', x + 90, y - 90, 'zizagDown1');
		
		addEnemy('mine', x + 160, y, 'moveDown');
		addEnemy('mine', x - 160, y, 'moveDown');
        
        wait(2000);
    },
	
    function () {
        var x = randomX(100);
        var y = -100;
        addEnemy('drone', x, y, 'zizagDown2');
		addEnemy('drone', x - 90, y - 90, 'zizagDown2');
		addEnemy('drone', x + 90, y - 90, 'zizagDown2');
		
		addEnemy('mine', x + 160, y, 'moveDown');
		addEnemy('mine', x - 160, y, 'moveDown');
        
        wait(2000);
    },
	
	function () {
        var x = -100;
        var y = randomY(300, 100);
        addEnemy('drone', x, y, 'curveRight');
		addEnemy('drone', x - 90, y - 90, 'curveRight');
		addEnemy('drone', x - 90, y + 90, 'curveRight');
        
        wait(2000);
    },
	
	// Level 7
    function () {
        var x = screenWidth + 100;
        var y = randomY(300, 100);
        addEnemy('drone', x, y, 'curveLeft');
		addEnemy('drone', x - 90, y - 90, 'curveLeft');
		addEnemy('drone', x - 90, y + 90, 'curveLeft');
        
        wait(2000);
    },
	
    function () {
        var x = randomX(100);
        var y = -100;
        addEnemy('drone', x, y, 'zizagDown1');
		addEnemy('drone', x - 90, y - 90, 'zizagDown1');
		addEnemy('drone', x + 90, y - 90, 'zizagDown1');
		
		addEnemy('mine', x + 160, y, 'moveDown');
		addEnemy('mine', x - 160, y, 'moveDown');
        
        wait(2000);
    },
	
    function () {
        var x = randomX(100);
        var y = -100;
        addEnemy('drone', x, y, 'zizagDown2');
		addEnemy('drone', x - 90, y - 90, 'zizagDown2');
		addEnemy('drone', x + 90, y - 90, 'zizagDown2');
		
		addEnemy('mine', x + 160, y, 'moveDown');
		addEnemy('mine', x - 160, y, 'moveDown');
        
        wait(2000);
    },
	
	function () {
        var x = -100;
        var y = randomY(300, 100);
        addEnemy('drone', x, y, 'curveRight');
		addEnemy('drone', x - 90, y - 90, 'curveRight');
		addEnemy('drone', x - 90, y + 90, 'curveRight');
        
        wait(2000);
    },
	
    function () {
        var x = screenWidth + 100;
        var y = randomY(300, 100);
        addEnemy('drone', x, y, 'curveLeft');
		addEnemy('drone', x - 90, y - 90, 'curveLeft');
		addEnemy('drone', x - 90, y + 90, 'curveLeft');
        
        wait(2000);
    },
	
    function () {
        var x = randomX(100);
        var y = -100;
        addEnemy('drone', x, y, 'zizagDown1');
		addEnemy('drone', x - 90, y - 90, 'zizagDown1');
		addEnemy('drone', x + 90, y - 90, 'zizagDown1');
		
		addEnemy('mine', x + 160, y, 'moveDown');
		addEnemy('mine', x - 160, y, 'moveDown');
        
        wait(2000);
    },
	
    function () {
        var x = randomX(100);
        var y = -100;
        addEnemy('drone', x, y, 'zizagDown2');
		addEnemy('drone', x - 90, y - 90, 'zizagDown2');
		addEnemy('drone', x + 90, y - 90, 'zizagDown2');
		
		addEnemy('mine', x + 160, y, 'moveDown');
		addEnemy('mine', x - 160, y, 'moveDown');
        
        wait(4000);
    },
	
    function () {
        var x = screenWidth / 2;
        var y = -100;
        addEnemy('boss1', x, y, 'bossMove1');
        		
        wait(1000);
		runBossLevel(bossLevel1);
    },
	
    function () {
        var x = randomX(100);
        var y = -100;
        addEnemy('drone', x, y, 'moveDown');
		addEnemy('drone', x - 90, y - 90, 'moveDown');
		addEnemy('drone', x + 90, y - 90, 'moveDown');
		
		addEnemy('mine', x + 160, y, 'moveDown');
		addEnemy('mine', x - 160, y, 'moveDown');
        
        wait(6000);
    },
];

var bossLevel1 = [
	// Wave 1
    function () {
		
		console.log('wave');
        var x = randomX(40);
        var y = -100;
        addEnemy('drone', x, y, 'zigzagDown1');
		addEnemy('drone', x - 90, y - 90, 'moveDown');
		addEnemy('drone', x - 90, y + 90, 'zigzagDown2');
        
        wait(6000);
    },
];
