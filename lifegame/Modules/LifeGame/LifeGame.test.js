SHAPES = {
    HORIZONTAL_LINE : {3:{5:1},4:{5:1},5:{5:1}},
    VERTICAL_LINE : {4:{4:1,5:1,6:1}},
    BLOCK : {5:{5:1,6:1},6:{5:1,6:1}},
    BEEHIVE : {2:{3:1},3:{2:1,4:1},4:{2:1,4:1},5:{3:1}}
};


test( "infinite regeneration 1 - Horizontal ***", function() {
    var game = new LifeGameController();
    game.init({
        size : 25,
        civilization: SHAPES.HORIZONTAL_LINE
    });
    deepEqual( game.getNext(), SHAPES.VERTICAL_LINE);
});

test( "infinite regeneration 2 - Horizontal different size", function() {
    var game = new LifeGameController();
    game.init({
        size : 1000,
        civilization: SHAPES.HORIZONTAL_LINE
    });
    deepEqual( game.getNext(), SHAPES.VERTICAL_LINE);
});

test( "infinite regeneration 3 - (Block)", function() {
    var game = new LifeGameController();
    game.init({
        size : 25,
        civilization: SHAPES.BLOCK
    });
    deepEqual( game.getNext(), SHAPES.BLOCK);
});

test( "infinite regeneration 4 - (Beehive)", function() {
    var game = new LifeGameController();
    game.init({
        size : 30,
        civilization: SHAPES.BEEHIVE
    });
    deepEqual( game.getNext(), SHAPES.BEEHIVE);
});