import scene, communityart, AudioManager;
import src.GameTemplate as GameTemplate;
import src.Game as Game;

exports = scene(function() {

    GameTemplate.init();
    
    Game();
    
    GameTemplate.run();

});
