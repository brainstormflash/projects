function LifeGameController(){

    var model;
    var view;
    var DEFAULT_BOARD_SIZE = 99;

    return {

        //start module - done automatically by the APP
        start : function()
        {

            // listens to global events
            // within the Application (all modules) scope

            gamesApp.listen('lifeGame-form-submitted', this.handleFormData);
            gamesApp.listen('lifeGame-play', this.handlePlay);
            gamesApp.listen('lifeGame-stop', this.handleStop);
            gamesApp.listen('lifeGame-clear', this.handleClear);

            this.init();
        },

        /**
         * public method, can initialize the board with external data
         * @param initData object {size:int, data:json}
         */
        init : function(initData)
        {

            initData = initData || {};
            initData.size = initData.size || DEFAULT_BOARD_SIZE;
            initData.civilization = initData.civilization || null;


            console.dir(initData);
            // set model
            model = new LifeGameModel();
            model.init(initData);

            // set view
            view = new LifeGameDesktopView(model);
            view.init();
        },

        /**
         * stops the module - App level
         */
        stop : function()
        {
            model = null;
            view.unbindEvents();
            view = null;

        },

        /**
         * not in use
         * @param data
         */
        handleFormData : function(data)
        {
            var size = data.size;
            view.drawBoard(size);
        },

        /**
         * @param data
         */
        handlePlay : function(data)
        {
            //clearInterval(timer);
            model.set(data.civilization);
            view.startAnimation();
        },

        handleStop : function()
        {
            view.stopAnimation();
        },

        handleClear : function()
        {
            view.stopAnimation();
            model.set(null);
            view.init();

        },

        /**
         * Public function to get a next generation
         * @param civilization json coordinates of cells
         * @return json civilization next generation coordinates of cells
         */
        getNext: function(civilization)
        {
            civilization = civilization || null;
            return model.getNextGeneration(civilization);
        }

    }
}