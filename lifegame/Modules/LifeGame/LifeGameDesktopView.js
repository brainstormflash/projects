function LifeGameDesktopView(model) {

    var data = {},
        containerId = 'main',
        containerSelector = '#' + containerId,
        userSelectedCells = {},
        eventsHandlers = {},
        timers = {};


    /**
     *
     * @param size
     */
    function registerMarkerEvents(size)
    {

        var board = containerSelector + '_board';
        var marker = containerSelector + '_marker';


        $(board).live('mousemove',function(e) {
            if (e.target != this) {
                return false;
            }
            // get the canvas size and the number of cells
            // calculate and rescale the cell width and height and position
            // This is the best approach I could think of - performance wise
            var scale = parseInt(gamesApp.getGlobal('lifeGame','CANVAS_SIZE')/ size);
            var x = parseInt((e.pageX - $(this).offset().left) / scale);
            var y = parseInt((e.pageY - $(this).offset().top) / scale);

            $('.marker_off').css({
                left : x * scale,
                top : y * scale,
                width: scale,
                height: scale
            });
        });

        $(board).live('mouseenter',function(e) {
            $(marker).show();
        });

        $(board).live('mouseleave',function(e) {
            $(marker).hide();
        });

        // I've planned to used a form to enable rescaling (canvas / number of cells)
        // but haven't had the time
        $('[name="lifeGameForm"]').live('submit',function(){
            var size = $('[name="size"]').val();
            gamesApp.notify({type:'lifeGame-form-submitted',data:{
                size : size
            }});
            return false;
        });
    }

    function registerMarkerEvent()
    {
        var coordinates = {},
            newMarker,
            thisMarker,
            scale,
            board = containerSelector + '_board',
            marker = containerSelector + '_marker';


        $(marker).live('click',function(){
            thisMarker = $(this);
            scale = thisMarker.width();
            coordinates.x = parseInt(thisMarker.css('left')) / scale + 1;
            coordinates.y = parseInt(thisMarker.css('top')) / scale + 1;

            if (!userSelectedCells[coordinates.y]) {
                userSelectedCells[coordinates.y] = {};
            }
            userSelectedCells[coordinates.y][coordinates.x] = 1;
            newMarker = thisMarker.clone().removeClass('marker_off').addClass('marker_on');
            $(board).append(newMarker);
        });
    }

    function registerPlayButtonEvent()
    {
        var speed = 1;
        $(containerSelector + '_play').live('click', function(){
            $(this).text('X' + (speed++));
            $(this).after('<a href="#"></a>');

            gamesApp.notify({
                type:'lifeGame-play',
                data : {
                    civilization: userSelectedCells
                }
            });

            return false;
        });

        $(containerSelector + '_clear').live('click', function(){
            gamesApp.notify({
                type:'lifeGame-clear',
                data : {
                    civilization: null
                }
            });
        });
    }

    function registerStopButtonEvent()
    {
        $(containerSelector + '_stop').live('click', function(){
            gamesApp.notify({type:'lifeGame-stop',data:null});
            return false;
        });
    }

    /*
    * self executing privatized function as
    * a constructor.
    * */
    var __constract = (function()
    {

        /*
        * Obviously there are much better ways to deal with
        * how the the JS view interacts with the HTML view
        * this is a less horrible way to deal with it.
        *
        * The Angular / knockout way is much better in my opinion
        * but I wouldn't start implementing a templating engine at the moment..
        *
        * */

        var lifeGameSizeInput = '#lifeGameSizeInput',
        lifeGameSubmitButton = '#lifeGameSubmitButton';

        /*
        * Experimental:
        * I'm experimenting a way to store globals in the APP level.
        * */

        gamesApp.setGlobal('CONTAINER', $(containerId)); // sets a global at the APP scope
        gamesApp.setGlobal('lifeGame', 'CANVAS_SIZE',500); // sets a global at the APP scope
        gamesApp.setGlobal('lifeGame','CSS_CLASS_ALIVE','alive'); // sets a global at the module scope
        gamesApp.setGlobal('lifeGame','STRING_START','start');
        gamesApp.setGlobal('lifeGame','STRING_PLACEHOLDER_SIZE','Board size e.g 50 (50X50)');

        $(document).ready(function(){

            if (!common.utils.isElementExist(containerSelector)) {
                // Should be in a template and use some king of a templating engine
                $('body').append('<div id="' + containerId + '" class="container"></div>');
                $(containerSelector).append('<a href="#" id="' + containerId + '_play" class="life_play_button util">Start</a>');
                $(containerSelector).append('<a href="#" id="' + containerId + '_stop" class="life_stop_button util">Pause</a>');
                $(containerSelector).append('<a href="#" id="' + containerId + '_clear" class="life_clear_button util hidden">Clear</a>');
                $(containerSelector).append('<div id="' + containerId + '_age" class="life_age util"></div>');
                $(containerSelector).append('<div id="' + containerId + '_board" class="life_board"></div>');
                $(containerSelector + '_board').append('<div id="' + containerId + '_marker" class="life_marker"></div>');
                $(containerSelector).append('<div id="' + containerId + '_options" class="life_options"></div>');
            }

            $(containerSelector + '_marker').addClass('marker_off');
            $(containerSelector + ' _options').load('Modules/LifeGame/Templates/lifeGame.html',function(){
                $(lifeGameSizeInput).attr('placeholder', gamesApp.getGlobal('lifeGame','STRING_PLACEHOLDER_SIZE'));
                $(lifeGameSubmitButton).val(gamesApp.getGlobal('lifeGame','STRING_START'));

            });
        });
    })();

    return {

        init : function(){
            data.size = model.size;
            data.canvasSize = gamesApp.getGlobal('lifeGame','CANVAS_SIZE');
            data.sizeInPercent = parseFloat(100 / data.size);
            data.scale = data.sizeInPercent * data.canvasSize / 100;
            registerMarkerEvents(data.size);
            registerMarkerEvent();
            registerPlayButtonEvent();
            registerStopButtonEvent();
        },

        drawBoard : function(size, civilization)
        {

            var cell = '';
            var className = '';
            var styles = {};
            for (var row = 1; row <= size; row++) {

                for (var col = 1; col <= size; col++) {

                    if(civilization[row] && civilization[row][col] == 1) {
                        className = gamesApp.getGlobal('lifeGame','CSS_CLASS_ALIVE');
                        styles.left = parseFloat((col-1) * data.scale);
                        styles.top = parseFloat((row-1) * data.scale);
                        cell += '<i class="' + className + '" style="width:'+ data.sizeInPercent +'%; height:'+ data.sizeInPercent +'%; top:'+styles.top+'px; left:'+styles.left+'px;"  data-coordinates="'+col+','+row+'"></i>';

                    }
                }
            }


            $(document).ready(function(){
                $(containerSelector + '_board').html(cell);
            });

        },

        startAnimation : function()
        {
            var self = this,
                age = 0,
                nextGeneration;

            timers.animationStarted = setInterval(function(){
                nextGeneration = model.getNextGeneration();
                if (common.utils.is_empty(nextGeneration)) {
                    clearInterval(timers.animationStarted);
                    self.showGameOver();
                } else {
                    self.drawBoard(model.size, nextGeneration);
                    self.setCounter(age++);
                }
            },1000);
        },

        stopAnimation : function() 
        {
            clearInterval(timers.animationStarted);
        },

        setCounter : function(age)
        {
            $(containerSelector + '_age').text(age);
        },

        showGameOver : function()
        {
            $(containerSelector + '_board').addClass('game_over');
        },

        /**
         * Obviously this is pretty * HORRIBLE * . In a real life project,
         * Events should be managed properly with register and unregister accessors
         */
        unbindEvents : function()
        {
            $(containerSelector + '_marker').die('click');
            $(containerSelector + '_board').die('mousemove');
            $(containerSelector + '_board').die('mouseenter');
            $(containerSelector + '_board').die('mouseleave');
        }


    }
}
