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
    addPowerUp('powerPinkBerry', 10);
    addRecovery('powerBlueBerry', 10);
    addTreasure('powerCoin', 10, 10);
    
    showScore();
    showLives();
}