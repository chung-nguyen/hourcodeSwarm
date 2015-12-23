import src.GameTemplate as GameTemplate;

var makeenemybullet = function(x, y, index) {

    var enemybullet = enemybullets.addActor(GameTemplate.lazyGetImage('laser'), {
        x: x,
        y: y,
        vy: 1250
    });        
    enemybullet.view.style.offsetX = -enemybullet.viewWidth / 2;
    enemybullet.view.style.offsetY = -enemybullet.viewHeight / 2;

    enemybullet.onEntered(scene.camera.bottomWall, function() {
        enemybullet.destroy();
    });
};


GLOBAL.makeplane = function(x, y, index) {

    var cnplane = enemies.addActor(GameTemplate.lazyGetImage('enemyDrone'), {
        x: x,
        y: y,
        vy: 200
    });

    cnplane.view.style.offsetX = -cnplane.viewWidth / 2;
    cnplane.view.style.offsetY = -cnplane.viewHeight / 2;

    var enemygun = new scene.spawner.Timed(cnplane, makeenemybullet, 800, true);

    scene.addSpawner(enemygun);

    cnplane.onDestroy(function() {
        enemygun.destroy();
    });

    cnplane.onEntered(scene.camera.bottomWall, function() {
        cnplane.destroy();
    });

};