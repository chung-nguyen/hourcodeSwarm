exports = function () {
    
	addBackgroundLayer('bg', 'bg1a');
	addBackgroundLayer('bg', 'bg1b');
	addBackgroundLayer('bg', 'bg1c');
	addBackgroundLayer('bg', 'bg1d');
	setBackgroundLayerSpeed('bg', 125);
	
    addPlayer('player1');
	setPlayerLives(10);
    addPlayerGun('bullet-7');
    setPlayerGunRateOfFire(200);
    setPlayerGunDirection(0, 1500);
    addPlayerGun('bullet-2');
    setPlayerGunRateOfFire(50);
    setPlayerGunDirection(-20, 1500);
    addPlayerGun('bullet-2');
    setPlayerGunRateOfFire(50);
    setPlayerGunDirection(20, 1500);
	
    addEnemyTemplate('drone', 'drone');
    setEnemyTemplateSpeed('drone', 20);
    addEnemyTemplateGun('drone', 'bullet-4');
	setEnemyTemplateGunInitialDelay('drone', 1000, 3000);
	setEnemyTemplateGunRateOfFire(5);
	setEnemyTemplateGunDirectional('drone', 0, 400);
	
	addEnemyTemplate('mine', 'mine');
	setEnemyTemplateSpeed('mine', 15);
	
	addEnemyTemplate('boss1', 'boss1');
	setEnemyTemplateAutoRotate('boss1', false);
	setEnemyTemplateBoss('boss1');
	setEnemyTemplateLives('boss1', 30);
	setEnemyTemplateScore('boss1', 10);
	setEnemyTemplateSpeed('boss1', 15);
	addEnemyTemplateGun('boss1', 'bullet-5');
	setEnemyTemplateGunRateOfFire('boss1', 30);
	setEnemyTemplateGunSmart('boss1', 400);
    
    setItemTime(5000);
    addPowerUp('powerEnergy1', 10);
    addRecovery('powerClover', 10);
    addTreasure('powerCoin', 10, 10);
    
    showScore();
    showLives();
}