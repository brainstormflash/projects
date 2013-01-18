// create new app util
var gamesApp = CORE.APP.create();

// create the first module - lifeGame
gamesApp.createModule('lifeGame', new LifeGameController());
//gamesApp.createModule('anotherModel', new AnotherModel());
gamesApp.start();

