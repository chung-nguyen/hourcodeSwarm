import scene, communityart, AudioManager;
import src.GameTemplate as GameTemplate;
import src.Game as Game;

exports = scene(function() {

    GameTemplate.init();
    
    Game();
    
    GameTemplate.run();
    
    

    


    communityart.registerConfig('cnairplane', {
        type: 'ImageView',
        opts: {
            hitOpts: {
                radius: 96 / 3
            },
            viewOpts: {
                url: 'resources/images/enemyDrone.png',
                defaultAnimation: 'fly',
                offsetX: -96 / 2,
                offsetY: -96 / 2,
                width: 96,
                height: 96,
            }
        }

    });

    communityart.registerConfig('enemybullet', {
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

    var makeenemybullet = function(x, y, index) {
        var enemybullet = enemybullets.addActor(communityart('enemybullet'), {
            x: x,
            y: y,
            vy: 1250
        });

        enemybullet.onEntered(scene.camera.bottomWall, function() {
            enemybullet.destroy();
        });
    };


    var makeplane = function(x, y, index) {


        var cnplane = enemies.addActor(communityart('cnairplane'), {
            x: x,
            y: y,
            vy: 200
        });

        var enemygun = new scene.spawner.Timed(cnplane, makeenemybullet, 800, true);

        scene.addSpawner(enemygun);

        cnplane.onDestroy(function() {
            enemygun.destroy();
        });
        
        cnplane.onEntered(scene.camera.bottomWall, function() {
            cnplane.destroy();
        });

    };

    var cnBase = new scene.shape.Line({
        x: 30,
        y: -100,
        x2: scene.screen.width - 30
    });

    var cnBaseFactory = new scene.spawner.Timed(cnBase, makeplane, 1000);

    scene.addSpawner(cnBaseFactory);


});
