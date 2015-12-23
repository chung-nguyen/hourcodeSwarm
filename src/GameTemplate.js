import src.myEffects as effects;
import scene, communityart, AudioManager;
import ui.ParticleEngine as ParticleEngine;
import src.Levels as Levels;
import src.Enemies as Enemies;

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
    
    GLOBAL.particles = new ParticleEngine({
        parent: scene.stage,
        zIndex: 15
    });
    particles.tick = particles.runTick;
    
    
    this.levelUpdateTimeOut = 1000;
    this.currentLevel = 0;
}

exports.run = function () {
    if (playerConfig) {
        buildPlayer();       
    }
    
    var self = this;
    scene.onTick(function (dt) {
        scoreText.setText(scene.getScore());
        
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
            
            Levels[lv]();            
        }
    });
    
    scene.screen.onDown(function (point) {
        player.tx = point.x;
        player.ty = point.y;
    });
    
    scene.screen.onMove(function (point) {
        player.tx = point.x;
        player.ty = point.y;
    });

    
    scene.onCollision(bulletsGroup, enemies, function(bullet, enemy) {
        effects.emitExplosion(particles, enemy);
        enemy.destroy();
        bullet.destroy();
        audio.play('sfx_crash_c');
        scene.addScore(1);
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

exports.lazyGetImage = function(filename) {
    filename = fixImageUrl(filename);
    var artName = filename.replace(/\//g, '_');
    
    var loadedArt = communityart(artName);
    if (loadedArt == null || loadedArt.type == null) {
        communityart.registerConfig(artName, {
            type: 'ImageView',
            opts: {
                viewOpts: {
                    url: filename
                }
            }
        });

        loadedArt = communityart(artName);
    }
    return loadedArt;
}

var killPlayer = function () {
    player.lives--;
    if (livesText) {
        livesText.setText(player.lives); 
    }
    effects.emitExplosion(particles, player);

    if (player.lives > 0) {
        player.x = scene.screen.width / 2;
        player.y = scene.screen.height + playerConfig.offsetY;
    } else {
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

GLOBAL.setLevel = function (x) {
    exports.currentLevel = x;
}

GLOBAL.wait = function (x) {
    exports.levelUpdateTimeOut = x;
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
    playerConfig.lives = 3;
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

var buildPlayer = function () {
    var size = playerConfig.size;
    communityart.registerConfig('player', {
        type: 'default',
        opts: {
            hitOpts: {
                radius: size / 3
            },
            viewOpts: {
                url: playerConfig.url,
                defaultAnimation: 'fly',
                offsetX: -size / 2,
                offsetY: -size / 2,
                width: size,
                height: size,
            }
        }
    });

    communityart.registerConfig('Playerbullet', {
        type: 'default',
        opts: {
            hitOpts: {
                radius: 28 / 2
            },
            viewOpts: {
                url: 'resources/images/laser.png',
                offsetX: -28 / 2,
                offsetY: -28 * 2.5 / 2,
                width: 28,
                height: 28 * 2.5,
            }
        }
    });

    GLOBAL.player = scene.addPlayer(communityart('player'), {
        zIndex: 5
    });
    
    
    player.x = scene.screen.width / 2;
    player.y = scene.screen.maxY - playerConfig.offsetY;
    player.tx = player.x;
    player.ty = player.y;
    player.speed = playerConfig.speed * 100;
    player.lives = playerConfig.lives;
    
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
    });
    
    var fireBullet = function(x, y, index) {
        var bullet1 = bulletsGroup.addActor(communityart('Playerbullet'), {
            x: x - 20,
            y: y,
            vy: -2500,
            zIndex: 50
        });

        bullet1.onEntered(scene.camera.topWall, function() {
            bullet1.destroy();
        });        
    };

    var barrel = new scene.spawner.Timed(player, fireBullet, 200, true);

    scene.addSpawner(barrel);
    
    player.onDestroy(function () {
        barrel.destroy();
    });
}