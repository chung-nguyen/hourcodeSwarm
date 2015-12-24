exports = function () {
    
	addBackgroundLayer('bg', 'bg1a');
	addBackgroundLayer('bg', 'bg1b');
	addBackgroundLayer('bg', 'bg1c');
	addBackgroundLayer('bg', 'bg1d');
	
	addBackgroundLayer('far', 'bg1FarDebris1');
	addBackgroundLayer('far', 'bg1FarDebris2');
	addBackgroundLayer('far', 'bg1FarDebris3');
	addBackgroundLayer('far', 'bg1FarDebris4');
	addBackgroundLayer('far', 'bg1FarDebris5');
	setBackgroundLayerRandom('far');
	setBackgroundLayerSpacing('far', 200, 500);
	setBackgroundLayerSpeed('far', 200);
	
	addBackgroundLayer('mid', 'bg1Debris1');
	addBackgroundLayer('mid', 'bg1Debris2');
	addBackgroundLayer('mid', 'bg1Debris3');
	addBackgroundLayer('mid', 'bg1Debris4');
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
	
    addEnemyTemplate('drone', 'crab');
    setEnemyTemplateSpeed('drone', 20);
    addEnemyTemplateGun('drone', 'bullet-4');
	setEnemyTemplateGunInitialDelay('drone', 1000, 3000);
	setEnemyTemplateGunRateOfFire(5);
	setEnemyTemplateGunDirectional('drone', 0, 40);
	
	addEnemyTemplate('mine', 'crabBaby');
	setEnemyTemplateSpeed('mine', 15);
	
	addEnemyTemplate('boss1', 'cyborg');
	setEnemyTemplateAutoRotate('boss1', false);
	setEnemyTemplateBoss('boss1');
	setEnemyTemplateLives('boss1', 30);
	setEnemyTemplateScore('boss1', 10);
	setEnemyTemplateSpeed('boss1', 15);
	addEnemyTemplateGun('boss1', 'bullet-5');
	setEnemyTemplateGunRateOfFire('boss1', 30);
	setEnemyTemplateGunSmart('boss1', 40);
    
    setItemTime(5000);
    addPowerUp('powerPinkBerry', 10);
    addRecovery('powerBlueBerry', 10);
    addTreasure('powerCoin', 10, 10);
    
    showScore();
    showLives();
}