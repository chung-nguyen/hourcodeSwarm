import animate;
import src.myEffects as effects;
import scene, communityart, AudioManager;
import ui.ParticleEngine as ParticleEngine;
import src.Levels as Levels;
import ui.resource.Image as Image;

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
    
    GLOBAL.powerUpConfig = null;
    GLOBAL.recoveryConfig = null;
    GLOBAL.coinConfig = null;
    GLOBAL.playerConfig = null;
    GLOBAL.scoreText = null;
    GLOBAL.livesText = null;
    GLOBAL.itemTime = 10000;
    GLOBAL.enemyTemplates = {};
    
    GLOBAL.particles = new ParticleEngine({
        parent: scene.stage,
        zIndex: 15
    });
    particles.tick = particles.runTick;
    
    this.levelUpdateTimeOut = 1000;
    this.currentLevel = 0;
    this.waitForBoss = false;
    this.itemTimeOut = itemTime;
    
    GLOBAL.playerBarrels = [];
    
    addEnemyTemplate('drone', 'enemyDrone');
    setEnemyTemplateSpeed('drone', 2);
    addEnemyTemplateGun('drone', 'laser');
}

exports.run = function () {
    if (playerConfig) {
        buildPlayer();       
    }
    
    this.itemTimeOut = itemTime;
    
    var self = this;
    scene.onTick(function (dt) {
        scoreText && scoreText.setText(scene.getScore());        
        
        if (self.waitForBoss) {
            self.waitForBoss = enemies.getActiveCount() > 0;
        } else {
            self.levelUpdateTimeOut -= dt;
            if (self.levelUpdateTimeOut <= 0) {
                var lv = self.currentLevel;
                if (lv >= Levels.length) {
                    lv = 0;
                }

                ++self.currentLevel;
                if (self.currentLevel >= Levels.length) {
                    self.currentLevel = 0;
                }

                self.levelUpdateTimeOut = 5000;
                self.waitForBoss = false;

                Levels[lv]();             
            }
        }
        
        self.itemTimeOut -= dt;
        if (self.itemTimeOut <= 0) {
            self.itemTimeOut = itemTime;
            
            var x = Math.random();
            
            if (x < 0.25) {
                if (powerUpConfig) {
                    var item = powerUps.addActor(powerUpConfig.art, {
                        x: randomX(40),
                        y: -100,
                        vy: powerUpConfig.speed * 100,
                        zIndex: 49
                    });

                    item.isEffective = true;
                    item.onEntered(scene.camera.bottomWall, function() {
                        item.destroy();
                    });
                }
            } else if (x < 0.7) {
                if (coinConfig) {
                    var item = coins.addActor(coinConfig.art, {
                        x: randomX(40),
                        y: -100,
                        vy: coinConfig.speed * 100,
                        zIndex: 49
                    });

                    item.isEffective = true;
                    item.onEntered(scene.camera.bottomWall, function() {
                        item.destroy();
                    });
                }   
            } else {
                 if (recoveryConfig) {
                    var item = recoveries.addActor(recoveryConfig.art, {
                        x: randomX(40),
                        y: -100,
                        vy: recoveryConfig.speed * 100,
                        zIndex: 49
                    });

                    item.isEffective = true;
                    item.onEntered(scene.camera.bottomWall, function() {
                        item.destroy();
                    });
                }
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
            enemy.lives--;
            if (enemy.lives > 0) {
                effects.emitSmallHit(particles, enemy);
            } else {
                effects.emitExplosion(particles, enemy);
                enemy.destroy();

                audio.play('sfx_crash_c');
                scene.addScore(1);
            }
        });

        scene.onCollision(player, enemies, function(player, enemy) {
            effects.emitExplosion(particles, enemy);
            enemy.destroy();
            killPlayer();

        });

        scene.onCollision(player, enemybullets, function(player, enemybullet) {
            enemybullet.destroy();
            audio.play('sfx_crash_b');
            killPlayer();
        });
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
}

GLOBAL.setLevel = function (x) {
    exports.currentLevel = x;
}

GLOBAL.wait = function (x) {
    exports.levelUpdateTimeOut = x;
}

GLOBAL.waitRandom = function (min, max) {
    exporst.levelUpdateTimeOut = Math.random() * (max - min) + min;
}

GLOBAL.waitForBoss = function () {
    exports.waitForBoss = true;
}

GLOBAL.setBackground = function (url) {
    communityart.registerConfig('background', {
        type: 'ImageView',
        opts: {
            url: fixImageUrl(url)
        }
    });

    scene.addBackground(communityart('background'));
}

GLOBAL.addPlayer = function (url) {
    GLOBAL.playerConfig = {};
    playerConfig.url = fixAnimUrl(url);
    playerConfig.lives = 10;
    playerConfig.size = 96;
    playerConfig.speed = 10;
    playerConfig.offsetY = 100;
    playerConfig.limitY = 300;
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
        x: 0,
        y: 0,
        vx: 0,
        vy: -1250,
        zIndex: 50,
        cooldown: 0
    };

    playerBarrels.push(barrel);   
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
        speed: 1,
        guns: []
    };
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

GLOBAL.addEnemyTemplateGun = function (name, bulletImage) {
    var temp = enemyTemplates[name];
    if (temp) {
        var gun =  {
            art: exports.lazyGetImage(bulletImage),
            time: 60000 / 10,
            initialDelay: 1000,
            x: 0,
            y: 0,
            vx: 0,
            vy: 1000,
            smart: false,
            smartSpeed: 0
        };
        
        temp.guns.push(gun);
    }
}

GLOBAL.setEnemyTemplateGunInitialDelay = function (name, delay) {
    var temp = enemyTemplates[name];
    if (temp && temp.guns.length > 0) {
        var gun = temp.guns[temp.guns.length - 1];
        gun.initialDelay = delay;
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
        gun.smart = false;
        gun.vx = vx;
        gun.vy = vy;
    }
}

GLOBAL.setEnemyTemplateGunSmart = function (name, speed) {
    var temp = enemyTemplates[name];
    if (temp && temp.guns.length > 0) {
        var gun = temp.guns[temp.guns.length - 1];
        gun.smart = true;
        gun.smartSpeed = speed;
    }
}

GLOBAL.addEnemy = function (name, x, y) {
    var temp = enemyTemplates[name];
    if (temp) {
        var enemy = enemies.addActor(temp.art, {
            x: x,
            y: y,
            vy: temp.speed * 100
        });
        
        enemy.lives = temp.lives;
        
        enemy.gunsCooldown = [];
        for (var i = 0, len = temp.guns.length; i < len; ++i) {
            enemy.gunsCooldown.push(temp.guns[i].initialDelay);
        }

        enemy.onEntered(scene.camera.bottomWall, function() {
            enemy.destroy();
        });  
        
        enemy.onTick(function(dt) {
            for (var i = 0, len = temp.guns.length; i < len; ++i) {
                enemy.gunsCooldown[i] -= dt * 1000;
                if (enemy.gunsCooldown[i] <= 0) {
                    var gunTemplate = temp.guns[i];
                    
                    enemy.gunsCooldown[i] = gunTemplate.time;
                                  
                    var vx, vy;
                    var x = enemy.x + gunTemplate.x;
                    var y = enemy.y + gunTemplate.y;
                    if (gunTemplate.smart) {
                        vx = player.x - x;
                        vy = player.y - y;
                        
                        var len = vx * vx + vy * vy;
                        if (len > 0) {
                            len = Math.sqrt(len) / (gunTemplate.smartSpeed * 100);
                            
                            vx /= len;
                            vy /= len;
                        }
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
                    
                    bullet.view.style.r = Math.atan2(vx, -vy);

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
    }
}

var buildPlayer = function () {
    var size = playerConfig.size;
    GLOBAL.player = scene.addPlayer(exports.lazyGetImage('player'), {
        zIndex: 51
    });
    
    player.x = scene.screen.width / 2;
    player.y = scene.screen.maxY - playerConfig.offsetY;
    player.tx = player.x;
    player.ty = player.y;
    player.speed = playerConfig.speed * 100;
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