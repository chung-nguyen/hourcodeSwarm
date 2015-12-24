import animate;
import parallax.Parallax as Parallax;
import src.myEffects as effects;
import scene, communityart, AudioManager;
import ui.ParticleEngine as ParticleEngine;
import src.Levels as Levels;
import ui.resource.Image as Image;
import src.Paths as Paths;

var GunType = {
	Fixed: 0,
	Smart: 1,
	Directional: 2
};

exports.init = function () {
    
    /** <<< fix for scene-weeby touch events **/
    scene.screen.touchManager.touchInstances.forEach(function(i) {
        i._isDown = false;
    });
    /** end fix >>> **/

    GLOBAL.audio = new AudioManager({
        path: 'resources/audio/',
        files: {
            sfx_crash_c: {
                volume: 1.0
            },
            sfx_crash_b: {
                volume: 1.0
            },
        }
    });
    
    GLOBAL.bulletsGroup = scene.addGroup();
    GLOBAL.enemybullets = scene.addGroup();    
    GLOBAL.enemies = scene.addGroup();    
    GLOBAL.powerUps = scene.addGroup();
    GLOBAL.recoveries = scene.addGroup();
    GLOBAL.coins = scene.addGroup();
    
	GLOBAL.parallaxConfig = [];
	GLOBAL.parallaxScrollSpeed = 1;
	
    GLOBAL.powerUpConfig = null;
    GLOBAL.recoveryConfig = null;
    GLOBAL.coinConfig = null;
    GLOBAL.playerConfig = null;
	GLOBAL.playerBarrels = [];
    GLOBAL.scoreText = null;
    GLOBAL.livesText = null;
    GLOBAL.itemTime = 10000;
    GLOBAL.enemyTemplates = {};
	
	GLOBAL.player = null;
	GLOBAL.techLevel = 0;
	
	// game background parallax
	this.parallax = new Parallax({ parent: scene.background, zIndex: 0 });
    
    GLOBAL.particles = new ParticleEngine({
        parent: scene.stage,
        zIndex: 15
    });
    particles.tick = particles.runTick;
    
	this.levelsStack = [{
		levelUpdateTimeOut: 1000,
		currentLevel: 0,
		waitForBoss: false,
		data: Levels
	}];
	
    this.itemTimeOut = itemTime;
    
    addEnemyTemplate('drone', 'enemyDrone');
    setEnemyTemplateSpeed('drone', 20);
    addEnemyTemplateGun('drone', 'bullet-4');
	setEnemyTemplateGunInitialDelay('drone', 1000, 3000);
	setEnemyTemplateGunRateOfFire(5);
	setEnemyTemplateGunDirectional('drone', 0, 40);
	
	addEnemyTemplate('mine', 'enemyMine');
	setEnemyTemplateSpeed('mine', 15);
	
	addEnemyTemplate('boss1', 'enemyBoss');
	setEnemyTemplateAutoRotate('boss1', false);
	setEnemyTemplateBoss('boss1');
	setEnemyTemplateLives('boss1', 30);
	setEnemyTemplateScore('boss1', 10);
	setEnemyTemplateSpeed('boss1', 15);
	addEnemyTemplateGun('boss1', 'bullet-5');
	setEnemyTemplateGunRateOfFire('boss1', 20);
	setEnemyTemplateGunSmart('boss1', 40);
}

exports.run = function () {
	
	var screenOffsetY = 0;
	//if (parallaxConfig) {
		this.parallax.reset(parallaxConfig);
	//}

    if (playerConfig) {
        buildPlayer();       
    }
    
    this.itemTimeOut = itemTime;
    
    var self = this;
    scene.onTick(function (dt) {
        scoreText && scoreText.setText(scene.getScore());        
		
		screenOffsetY += dt * parallaxScrollSpeed * 0.1;
		self.parallax.update(0, screenOffsetY);
        
		if (player && player.lives > 0) {
			var lvStack = self.levelsStack[self.levelsStack.length - 1];
			lvStack.levelUpdateTimeOut -= dt;
			if (lvStack.levelUpdateTimeOut <= 0) {
				var lv = lvStack.currentLevel;
				if (lv >= lvStack.data.length) {
					lv = 0;
				}
				
				var willAddTechLevel = false;

				++lvStack.currentLevel;
				if (lvStack.currentLevel >= lvStack.data.length) {
					lvStack.currentLevel = 0;
					
					if (self.levelsStack.length == 1) {
						willAddTechLevel = true;						
					}
				}

				lvStack.levelUpdateTimeOut = 5000;

				lvStack.data[lv]();             
				
				if (willAddTechLevel) {
					techLevel++;	
				}
			}

			if (lvStack.waitForBoss) {
				var bossCount = 0;
				enemies.forEachActiveEntity(function (enemy, i) {
					if (enemy.template.isBoss) {
						bossCount++;
					}
				});

				if (bossCount <= 0) {	
					lvStack.waitForBoss = false;
					if (self.levelsStack.length > 1) {
						self.levelsStack.length--;
					}
				}
			} 

			self.itemTimeOut -= dt;
			if (self.itemTimeOut <= 0) {
				self.itemTimeOut = itemTime;

				spawnPowerUp(randomX(40), -100);
			}     	
		}		
    });
    
    if (player) {
        scene.screen.onDown(function (point) {
            player.tx = point.x;
            player.ty = point.y;
        });

        scene.screen.onMove(function (point) {
            player.tx = point.x;
            player.ty = point.y;
        });

        scene.onCollision(player, coins, function (player, coin) {
            if (coin.isEffective) {
                animate(coin).now({
                    scale: 0,
                    dx: randRangeI(-100, 100),
                    dy: randRangeI(-100, 100),
                }, 200).then(function () {coin.destroy()});

                scene.addScore(coinConfig.points);
                coin.isEffective = false;
            }        
        });

        scene.onCollision(player, powerUps, function (player, powerUp) {
            if (powerUp.isEffective) {
                animate(powerUp).now({
                    scale: 0,
                    dx: randRangeI(-100, 100),
                    dy: randRangeI(-100, 100),
                }, 200).then(function () {powerUp.destroy()});

                player.gunPower++;
				
				for (var i = 0, len = playerBarrels.length; i < len; ++i) {
					playerBarrels[i].cooldown = playerBarrels[i].initialDelay;
				}
				
                powerUp.isEffective = false;
            }        
        });

        scene.onCollision(player, recoveries, function (player, recovery) {
            if (recovery.isEffective) {
                animate(recovery).now({
                    scale: 0,
                    dx: randRangeI(-100, 100),
                    dy: randRangeI(-100, 100),
                }, 200).then(function () {recovery.destroy()});

                if (player.lives < playerConfig.lives) {
                    player.lives++;
                    livesText && livesText.setText(player.lives);
                }            
                recovery.isEffective = false;
            }        
        });

        scene.onCollision(bulletsGroup, enemies, function(bullet, enemy) {
            bullet.destroy();
            killEnenemy(enemy);
        });

        scene.onCollision(player, enemies, function(player, enemy) {
            killEnenemy(enemy);
            killPlayer();
        });

        scene.onCollision(player, enemybullets, function(player, enemybullet) {
            enemybullet.destroy();
            audio.play('sfx_crash_b');
            killPlayer();
        });
    }
}

var killEnenemy = function (enemy) {
	enemy.lives--;
	if (enemy.lives > 0) {
		effects.emitSmallHit(particles, enemy);
	} else {
		effects.emitExplosion(particles, enemy);
		enemy.destroy();

		audio.play('sfx_crash_c');
		scene.addScore(enemy.template.points);
	}
}

exports.lazyGetImage = function(filename, collisionScale) {
    filename = fixImageUrl(filename);
    var artName = filename.replace(/\//g, '_');
    artName = artName.replace(/\./g, '_');
    
    var loadedArt = communityart(artName);
    if (loadedArt == null || loadedArt.viewOpts == null) {
        var img = new Image({
            url: filename
        });
        
        w = img.getWidth();
        h = img.getHeight();
        
        communityart.registerConfig(artName, {
            type: 'ImageView',
            opts: {
                hitOpts: {
                    radius: w / 2 * (collisionScale || 1)
                },
                viewOpts: {
                    url: filename,
                    offsetX: -w / 2,
                    offsetY: -h / 2,
                    width: w,
                    height: h
                }
            }
        });

        loadedArt = communityart(artName);
    }
    return loadedArt;
}

var killPlayer = function () {
    player.gunPower = 1;
    player.lives--;
    if (livesText) {
        livesText.setText(player.lives); 
    }
    
    if (player.lives > 0) {
        effects.emitSmallHit(particles, player);
    } else {
        effects.emitEpicExplosion(particles, player);
        effects.shakeScreen(scene.view);
        player.destroy();
    }
}

var fixImageUrl = function (url) {
    if (url.indexOf('.') < 0) {
        url = url + '.png';
    }
    
    if (url.indexOf('/') < 0) {
        url = 'resources/images/' + url;
    }
    
    return url;
}

var fixAnimUrl = function (url) {
    if (url.indexOf('/') < 0) {
        url = 'resources/images/' + url;
    }
    
    return url;
}

GLOBAL.randomX = function (padding) {
    padding = padding || 0;
    return Math.random() * (scene.screen.width - padding * 2) + padding;
};

GLOBAL.randomY = function (paddingTop, paddingBottom) {
    paddingTop = paddingTop || 0;
	paddingBottom = paddingBottom || 0;
    return Math.random() * (scene.screen.height - (paddingBottom + paddingTop)) + paddingTop;
};

GLOBAL.setLevel = function (x) {
	var lvStack = exports.levelsStack[exports.levelsStack.length - 1];
    lvStack.currentLevel = x;
}

GLOBAL.wait = function (x) {
	var lvStack = exports.levelsStack[exports.levelsStack.length - 1];
    lvStack.levelUpdateTimeOut = x;
}

GLOBAL.waitRandom = function (min, max) {
	var lvStack = exports.levelsStack[exports.levelsStack.length - 1];
    lvStack.levelUpdateTimeOut = Math.random() * (max - min) + min;
}

GLOBAL.runBossLevel = function (level) {
	exports.levelsStack.push({
		levelUpdateTimeOut: 1000,
		currentLevel: 0,
		waitForBoss: true,
		data: level
	});
	
	console.log(exports.levelsStack.length);
}

GLOBAL.setBackground = function (url) {
    communityart.registerConfig('background', {
        type: 'ImageView',
        opts: {
            url: fixImageUrl(url)
        }
    });

    scene.addBackground(communityart('background'));
};

GLOBAL.setBackgroundSpeed = function (speed) {
	parallaxScrollSpeed = speed;
};

var findParallaxLayer = function (name) {
	for (var i = 0, len = parallaxConfig.length; i < len; ++i) {
		var l = parallaxConfig[i];
		if (l.id == name) {
			return l;
		}
	}
	
	return null;
}

GLOBAL.addBackgroundLayer = function (name) {
	var layer = findParallaxLayer(name);
	
	if (layer == null) {
		layer = {
			id: name,
			zIndex: 1,
			xMultiplier: 0,
			xCanSpawn: false,
			xCanRelease: false,
			yMultiplier: 0.125,
			yCanSpawn: true,
			yCanRelease: true,
			yGapRange: [-1, -1],
			ordered: true,
			pieceOptions: []
		};
		
		parallaxConfig.push(layer);
	}
	
	for (var i = 1, len = arguments.length; i < len; ++i) {
		layer.pieceOptions.push({
			image: fixImageUrl(arguments[i])
		});
	}
};

GLOBAL.setBackgroundLayerRandom = function (name) {
	var layer = findParallaxLayer(name);
	if (layer) {
		layer.ordered = false;
	}
}

GLOBAL.setBackgroundLayerDistance = function (name, dist) {
	var layer = findParallaxLayer(name);
	if (layer) {
		layer.zIndex = dist;
	}
};

GLOBAL.setBackgroundLayerSpeed = function (name, speed) {
	var layer = findParallaxLayer(name);
	if (layer) {
		layer.yMultiplier = speed * 0.001;
	}
};

GLOBAL.setBackgroundLayerSpacing = function (name, min, max) {
	var layer = findParallaxLayer(name);
	if (layer) {
		min = min || 0;
		layer.yGapRange[0] = min;
		layer.yGapRange[1] = max || min;
	}
};

GLOBAL.addPlayer = function (url) {
    GLOBAL.playerConfig = {};
    playerConfig.art = exports.lazyGetImage(url)
    playerConfig.lives = 10;
    playerConfig.size = 96;
    playerConfig.speed = 100;
    playerConfig.offsetY = 100;
    playerConfig.limitY = 100;
}

GLOBAL.setPlayerSize = function (size) {
    playerConfig.size = size;
}

GLOBAL.setPlayerSpeed = function (speed) {
    playerConfig.speed = speed;
}

GLOBAL.setPlayerLives = function (lives) {
    playerConfig.lives = lives;
}

GLOBAL.showScore = function () {
    var scoreTextPath = "resources/images/numbers/";
    var scoreTextData = {};
    for (var i = 0; i < 10; i++) {
      scoreTextData[i] = { image: scoreTextPath + "blue_" + i + ".png" };
    }
    communityart.registerConfig('score', {
      type: 'ScoreView',
      opts: {
        x: 0,
        y: 0,
        zIndex: 100,
        width: 576,
        height: 100,
        characterData: scoreTextData,
        horizontalAlign: 'left'
      }
    });
    
    GLOBAL.scoreText = scene.ui.addScoreText(communityart('score'), 10, 10, 576, 100);  
    scoreText.setText('0');
}

GLOBAL.showLives = function () {
    var scoreTextPath = "resources/images/numbers/";
    var scoreTextData = {};
    for (var i = 0; i < 10; i++) {
      scoreTextData[i] = { image: scoreTextPath + "blue_" + i + ".png" };
    }
    communityart.registerConfig('lives', {
      type: 'ScoreView',
      opts: {
        x: 0,
        y: 0,
        zIndex: 100,
        width: 576,
        height: 100,
        characterData: scoreTextData,
        horizontalAlign: 'right'
      }
    });
    
    GLOBAL.livesText = scene.ui.addScoreText(communityart('lives'), 10, 10, 556, 100);  
    livesText.setText(playerConfig.lives);
}

GLOBAL.addPlayerGun = function (bulletImage) {
    var barrel = {
        art: exports.lazyGetImage(bulletImage),
        time: 60000 / 10,
		initialDelay: 0,
        x: 0,
        y: 0,
        vx: 0,
        vy: -1250,
        zIndex: 50,
        cooldown: 0
    };

    playerBarrels.push(barrel);   
};

GLOBAL.setPlayerGunInitialDelay = function (delay) {
    if (playerBarrels.length > 0) {
        var gun = playerBarrels[playerBarrels.length - 1];        
        gun.initialDelay = delay;
		gun.cooldown = delay;
    }
};

GLOBAL.setPlayerGunRateOfFire = function (rateOfFire) {
    if (playerBarrels.length > 0 && rateOfFire > 0) {
        var gun = playerBarrels[playerBarrels.length - 1];        
        gun.time = 60000 / rateOfFire;
    }
};

GLOBAL.setPlayerGunPosition = function (x, y) {
    if (playerBarrels.length > 0) {
        var gun = playerBarrels[playerBarrels.length - 1];        
        gun.x = x;
        gun.y = y;
    }
};

GLOBAL.setPlayerGunVelocity = function (vx, vy) {
    if (playerBarrels.length > 0) {
        var gun = playerBarrels[playerBarrels.length - 1];        
        gun.vx = vx;
        gun.vy = vy;
    }
};

GLOBAL.setItemTime = function (t) {
    GLOBAL.itemTime = t;
}

GLOBAL.addPowerUp = function (image, speed) {
    GLOBAL.powerUpConfig = {
        art: exports.lazyGetImage(image, 0.4),
        speed: speed
    };
};

GLOBAL.addRecovery = function (image, speed) {
    GLOBAL.recoveryConfig = {
        art: exports.lazyGetImage(image, 0.4),
        speed: speed
    };
}

GLOBAL.addTreasure = function (image, speed, points) {
    GLOBAL.coinConfig = {
        art: exports.lazyGetImage(image, 0.4),
        speed: speed,
        points: points || 10
    };
};

GLOBAL.addEnemyTemplate = function (name, image) {
    enemyTemplates[name] = {
        art: exports.lazyGetImage(image),
        lives: 1,
		points: 1,
        speed: 10,
		isBoss: false,
		isAutoRotate: true,
        guns: []
    };
};

GLOBAL.setEnemyTemplateAutoRotate = function (name, value) {
	var temp = enemyTemplates[name];
    if (temp) {
        temp.isAutoRotate = value;
    }
};

GLOBAL.setEnemyTemplateBoss = function (name) {
	var temp = enemyTemplates[name];
    if (temp) {
        temp.isBoss = true;
    }
};

GLOBAL.setEnemyTemplateSpeed = function (name, speed) {
    var temp = enemyTemplates[name];
    if (temp) {
        temp.speed = speed;
    }
}

GLOBAL.setEnemyTemplateLives = function (name, lives) {
    var temp = enemyTemplates[name];
    if (temp) {
        temp.lives = lives;
    }
}

GLOBAL.setEnemyTemplateScore = function (name, points) {
    var temp = enemyTemplates[name];
    if (temp) {
        temp.points = points;
    }
}

GLOBAL.addEnemyTemplateGun = function (name, bulletImage) {
    var temp = enemyTemplates[name];
    if (temp) {
        var gun =  {
            art: exports.lazyGetImage(bulletImage),
            time: 60000 / 10,
            initialDelayMin: 1000,
			initialDelayMax: 1000,
            x: 0,
            y: 0,
            vx: 0,
            vy: 1000,
            type: GunType.Fixed,
            speed: 0,
			angle: 0
        };
        
        temp.guns.push(gun);
    }
}

GLOBAL.setEnemyTemplateGunInitialDelay = function (name, delayMin, delayMax) {
    var temp = enemyTemplates[name];
    if (temp && temp.guns.length > 0) {
        var gun = temp.guns[temp.guns.length - 1];
        gun.initialDelayMin = delayMin || 1000;
		gun.initialDelayMax = delayMax || gun.initialDelayMin;
    }
}

GLOBAL.setEnemyTemplateGunRateOfFire = function (name, rateOfFire) {
    var temp = enemyTemplates[name];
    if (rateOfFire > 0 && temp && temp.guns.length > 0) {
        var gun = temp.guns[temp.guns.length - 1];
        gun.time = 60000 / rateOfFire;
    }
}

GLOBAL.setEnemyTemplateGunPosition = function (name, x, y) {
    var temp = enemyTemplates[name];
    if (temp && temp.guns.length > 0) {
        var gun = temp.guns[temp.guns.length - 1];
        gun.x = x;
        gun.y = y;
    }
}

GLOBAL.setEnemyTemplateGunVelocity = function (name, vx, vy) {
    var temp = enemyTemplates[name];
    if (temp && temp.guns.length > 0) {
        var gun = temp.guns[temp.guns.length - 1];
        gun.type = GunType.Fixed;
        gun.vx = vx;
        gun.vy = vy;
    }
}

GLOBAL.setEnemyTemplateGunSmart = function (name, speed) {
    var temp = enemyTemplates[name];
    if (temp && temp.guns.length > 0) {
        var gun = temp.guns[temp.guns.length - 1];
        gun.type = GunType.Smart;
        gun.speed = speed;
    }
}

GLOBAL.setEnemyTemplateGunDirectional = function (name, angle, speed) {
	var temp = enemyTemplates[name];
    if (temp && temp.guns.length > 0) {
        var gun = temp.guns[temp.guns.length - 1];
        gun.type = GunType.Directional;
		gun.angle = angle * Math.PI / 180;
        gun.speed = speed;
    }
}

GLOBAL.addEnemy = function (name, x, y, pathName) {
    var temp = enemyTemplates[name];
    if (temp) {
		var path = Paths[pathName] || Paths.moveDown;
		
        var enemy = enemies.addActor(temp.art, {
            x: x,
            y: y,
			vx: path[0].vx * temp.speed * 0.1,
            vy: path[0].vy * temp.speed * 0.1
        });
        		
		enemy.template = temp;
        enemy.lives = temp.lives + techLevel;
		enemy.pathIndex = 0;
		enemy.startX = x;
		enemy.startY = y;
		enemy.targetRotation = Math.atan2(-enemy.vx, enemy.vy);
		if (temp.isAutoRotate) {
			enemy.view.style.r = enemy.targetRotation;			
		}

        enemy.gunsCooldown = [];
        for (var i = 0, len = temp.guns.length; i < len; ++i) {
			var gun = temp.guns[i];
            enemy.gunsCooldown.push(Math.random() * (gun.initialDelayMax - gun.initialDelayMin) + gun.initialDelayMin);
        }

        enemy.onTick(function(dt) {
			var dx = enemy.x - enemy.startX;
			var dy = enemy.y - enemy.startY;
			var sqDist = dx * dx + dy * dy;
			var maxDist = path[enemy.pathIndex].distance;
			if (sqDist >= maxDist * maxDist) {
				++enemy.pathIndex;
				if (enemy.pathIndex >= path.length) {
					if (temp.isBoss) {
						enemy.pathIndex = 0;
					} else {
						enemy.destroy();						
						return;
					}
				}
				
				if (enemy.pathIndex < path.length) {
					enemy.startX = enemy.x;
					enemy.startY = enemy.y;
					enemy.vx = path[enemy.pathIndex].vx * temp.speed * 0.1;
					enemy.vy = path[enemy.pathIndex].vy * temp.speed * 0.1;
					enemy.targetRotation = Math.atan2(-enemy.vx, enemy.vy);
				}
			}
			
			if (temp.isAutoRotate) {
				enemy.view.style.r += shortestAngle(enemy.view.style.r, enemy.targetRotation) * dt * 4;
			}
			
            for (var i = 0, len = temp.guns.length; i < len; ++i) {
                enemy.gunsCooldown[i] -= dt * 1000;
                if (enemy.gunsCooldown[i] <= 0) {
                    var gunTemplate = temp.guns[i];
                    
                    enemy.gunsCooldown[i] = gunTemplate.time;
                                  
                    var vx, vy;
                    var x = enemy.x + gunTemplate.x;
                    var y = enemy.y + gunTemplate.y;
                    if (gunTemplate.type == GunType.Smart) {
                        vx = player.x - x;
                        vy = player.y - y;
                        
                        var len = vx * vx + vy * vy;
                        if (len > 0) {
                            len = Math.sqrt(len) / (gunTemplate.speed * 10);
                            
                            vx /= len;
                            vy /= len;
                        }
                    } else if (gunTemplate.type == GunType.Directional) {
						var a = gunTemplate.angle + enemy.view.style.r;
						var d = gunTemplate.speed * 10;
						vx = -Math.sin(a) * d;
                        vy = Math.cos(a) * d;
					} else {
                        vx = gunTemplate.vx;
                        vy = gunTemplate.vy;
                    }       
                    
                    var bullet = enemybullets.addActor(gunTemplate.art, {
                        x: x,
                        y: y,
                        vx: vx,
                        vy: vy
                    });    
                    
                    bullet.view.style.r = Math.atan2(-vx, vy);
					bullet.view.style.flipY = true;

                    (function(bullet) {
                        if (vy < 0) {
                            bullet.onEntered(scene.camera.topWall, function() {
                                bullet.destroy();
                            });
                        } else if (vy > 0) {
                            bullet.onEntered(scene.camera.bottomWall, function() {
                                bullet.destroy();
                            });
                        }
                        
                        if (vx < 0) {
                            bullet.onEntered(scene.camera.leftWall, function() {
                                bullet.destroy();
                            });
                        } else if (vx > 0) {
                            bullet.onEntered(scene.camera.rightWall, function() {
                                bullet.destroy();
                            });
                        }
                    })(bullet);                   
                }
            }
        });
		
		return enemy;
    }
	
	return null;
}

var buildPlayer = function () {
    var size = playerConfig.size;
    GLOBAL.player = scene.addPlayer(playerConfig.art, {
        zIndex: 51
    });
    
    player.x = scene.screen.width / 2;
    player.y = scene.screen.height - playerConfig.offsetY;
    player.tx = player.x;
    player.ty = player.y;
    player.speed = playerConfig.speed * 10;
    player.lives = playerConfig.lives;
    player.gunPower = 1;
    
    player.onTick(function (dt) {
        if (player.tx < 0) {
            player.tx = 0;
        } else if (player.tx > scene.screen.width) {
            player.tx = scene.screen.width;
        }
        
        if (player.ty + player.view.height / 2 > scene.screen.height - playerConfig.offsetY) {
            player.ty = scene.screen.height - playerConfig.offsetY - player.view.height / 2;
        } else if (player.ty - player.view.height / 2 < playerConfig.limitY) {
            player.ty = playerConfig.limitY + player.view.height / 2;
        }
        
        var dx = player.tx - player.x;
        var dy = player.ty - player.y;
        var len = dx * dx + dy * dy;
        var dist = dt * player.speed;
        if (len > dist * dist) {
            len = Math.sqrt(len);
            dx /= len;
            dy /= len;
            
            player.x += dx * dist;
            player.y += dy * dist;
        } else {
            player.x = player.tx;
            player.y = player.ty;
        }
        
        var len = playerBarrels.length;
        if (powerUpConfig) {
            len = Math.min(player.gunPower, playerBarrels.length);
        }
        
        for (var i = 0; i < len; ++i) {
            var barrel = playerBarrels[i];
            barrel.cooldown -= dt * 1000;
            if (barrel.cooldown <= 0) {
                barrel.cooldown = barrel.time;
                
                var bullet = bulletsGroup.addActor(barrel.art, {
                    x: player.x + barrel.x,
                    y: player.y + barrel.y,
                    vx: barrel.vx,
                    vy: barrel.vy,
                    zIndex: barrel.zIndex
                });

                (function (bullet) {
                    bullet.onEntered(scene.camera.topWall, function() {
                        bullet.destroy();
                    });   

                    bullet.onEntered(scene.camera.leftWall, function() {
                        bullet.destroy();
                    }); 

                    bullet.onEntered(scene.camera.rightWall, function() {
                        bullet.destroy();
                    }); 
                })(bullet);    
            }            
        }
    });
}

var spawnPowerUp = function(x, y) {
	var t = Math.random();
            
	if (t < 0.25) {
		if (powerUpConfig) {
			var item = powerUps.addActor(powerUpConfig.art, {
				x: x,
				y: y,
				vy: powerUpConfig.speed * 10,
				zIndex: 52
			});

			item.isEffective = true;
			item.onEntered(scene.camera.bottomWall, function() {
				item.destroy();
			});
		}
	} else if (t < 0.7) {
		if (coinConfig) {
			var item = coins.addActor(coinConfig.art, {
				x: x,
				y: y,
				vy: coinConfig.speed * 10,
				zIndex: 52
			});

			item.isEffective = true;
			item.onEntered(scene.camera.bottomWall, function() {
				item.destroy();
			});
		}   
	} else {
		 if (recoveryConfig) {
			var item = recoveries.addActor(recoveryConfig.art, {
				x: x,
				y: y,
				vy: recoveryConfig.speed * 10,
				zIndex: 52
			});

			item.isEffective = true;
			item.onEntered(scene.camera.bottomWall, function() {
				item.destroy();
			});
		}
	}
}

var shortestAngle = function(start, end) {
    return ((((end - start) % (Math.PI * 2)) + (Math.PI * 3)) % (Math.PI * 2)) - Math.PI;
}

