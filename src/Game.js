exports = function () {
    
    setBackground('bg1');
    
    addPlayer('player');
    addPlayerGun('laser');
    setPlayerGunRateOfFire(100);
    setPlayerGunVelocity(0, -1500);
    addPlayerGun('laser');
    setPlayerGunRateOfFire(50);
    setPlayerGunVelocity(-300, -1500);
    addPlayerGun('laser');
    setPlayerGunRateOfFire(50);
    setPlayerGunVelocity(300, -1500);
    
    setItemTime(5000);
    addPowerUp('powerPinkBerry', 1);
    addRecovery('powerBlueBerry', 1);
    addTreasure('powerCoin', 1, 10);
    
    showScore();
    showLives();
}