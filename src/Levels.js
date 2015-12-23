exports = [
    // Level 1
    function () {
        var x = randomX(140);
        var y = -100;
        addEnemy('drone', x, y);
        addEnemy('drone', x - 70, y - 70);
        addEnemy('drone', x + 70, y - 70);
        
        wait(1000);
    },
    
    // Level 2
    function () {
        var x = randomX(140);
        var y = -100;
        addEnemy('drone', x, y);
        addEnemy('drone', x - 100, y);
        addEnemy('drone', x + 100, y);
        
        wait(1000);
    },
];
