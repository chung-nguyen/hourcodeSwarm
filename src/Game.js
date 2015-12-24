exports = function () {
    
	addBackgroundLayer('bg', 'bg1');
	addBackgroundLayer('bg', 'bg2');
	addBackgroundLayer('bg', 'bg3');
	addBackgroundLayer('bg', 'bg4');
	
	addBackgroundLayer('far', 'bgFarDebris1');
	addBackgroundLayer('far', 'bgFarDebris2');
	addBackgroundLayer('far', 'bgFarDebris3');
	addBackgroundLayer('far', 'bgFarDebris4');
	addBackgroundLayer('far', 'bgFarDebris5');
	setBackgroundLayerRandom('far');
	setBackgroundLayerSpacing('far', 200, 500);
	setBackgroundLayerSpeed('far', 200);
	
	addBackgroundLayer('mid', 'bgDebris1');
	addBackgroundLayer('mid', 'bgDebris2');
	addBackgroundLayer('mid', 'bgDebris3');
	addBackgroundLayer('mid', 'bgDebris4');
	setBackgroundLayerRandom('mid');
	setBackgroundLayerSpacing('mid', 400, 1000);
	setBackgroundLayerSpeed('mid', 400);
    
    addPlayer('player1');
    addPlayerGun('bullet-7');
    setPlayerGunRateOfFire(200);
    setPlayerGunVelocity(0, -1500);
    addPlayerGun('bullet-2');
    setPlayerGunRateOfFire(50);
    setPlayerGunVelocity(-200, -1500);
    addPlayerGun('bullet-2');
    setPlayerGunRateOfFire(50);
    setPlayerGunVelocity(200, -1500);
	addPlayerGun('bullet-5');
	setPlayerGunInitialDelay(1000);
    setPlayerGunRateOfFire(50);
    setPlayerGunVelocity(-400, -1500);
	addPlayerGun('bullet-5');
	setPlayerGunInitialDelay(1000);
    setPlayerGunRateOfFire(50);
    setPlayerGunVelocity(400, -1500);
	addPlayerGun('bullet-6');
	setPlayerGunInitialDelay(500);
    setPlayerGunRateOfFire(50);
    setPlayerGunVelocity(-1500, 0);
	addPlayerGun('bullet-6');
	setPlayerGunInitialDelay(500);
    setPlayerGunRateOfFire(50);
    setPlayerGunVelocity(1500, 0);
	addPlayerGun('bullet-1');
	setPlayerGunInitialDelay(750);
    setPlayerGunRateOfFire(50);
    setPlayerGunVelocity(-500, -500);
	addPlayerGun('bullet-1');
	setPlayerGunInitialDelay(750);
    setPlayerGunRateOfFire(50);
    setPlayerGunVelocity(500, -500);
    
    setItemTime(5000);
    addPowerUp('powerPinkBerry', 10);
    addRecovery('powerBlueBerry', 10);
    addTreasure('powerCoin', 10, 10);
    
    showScore();
    showLives();
}