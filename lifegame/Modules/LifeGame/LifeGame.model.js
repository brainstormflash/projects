function LifeGameModel() {

    // private members
    var _thisGeneration = {},
        _nextGeneration = {};


    /*
    * private
    * checks if a cell is within range.
    * also returns false if the cell has already been registered previously
    * @param cell object cell.x,cell.y
    * @return bool
    * */
    function isInRange(cell)
    {
        // check if the cell is within boundaries
        if (cell.x && cell.y) {

            // already parsed this cell
            if (isAlive(cell.x, cell.y)) {
                return false;
            } else {
                // in range
                return true;
            }
        }
        return false;
    }

    /**
     * Private determines whether a cell NEIGHBOUR should be alive
     * by inspecting its siblings
     *
     * @param x cell x position
     * @param y cell y position
     */
    function shouldBeResurrected (x,y)
    {
        var nextX,
            prevX,
            nextY,
            prevY,
            n = 0; // number of live neighbors

        if (!isInRange({x:x, y:y})) {
            return false;
        }

        // set aliases
        nextX = parseInt(x)+1;
        prevX = parseInt(x)-1;
        nextY = parseInt(y)+1;
        prevY = parseInt(y)-1;

        // left top
        if (isAlive(prevX, prevY)) { n++; }
        // center top
        if (isAlive(x, prevY)) { n++; }
        // right top
        if (isAlive(nextX, prevY)) { n++; }
        // left center
        if (isAlive(prevX, y)) { n++; }
        // right center
        if (isAlive(nextX, y)) { n++; }
        // bottom left
        if (isAlive(prevX, nextY)) { n++; }
        // bottom center
        if (isAlive(x, nextY)) { n++; }
        // bottom right
        if (isAlive(nextX, nextY)) { n++; }

        // Spec requirement for a living cell:
        // has exactly 3 live neighbors
        if (n == 3) {
            return 1;
        }
        return false;
    }

    /**
     * private
     * checks if the cell exists in our hash == cell is alive
     * @param x
     * @param y
     * @return {Boolean}
     */
    function isAlive(x,y)
    {
        return (typeof _thisGeneration[x] != 'undefined' && typeof _thisGeneration[x][y] != 'undefined');
    }

    /**
     * inserts the cell to the next generation
     * @param x
     * @param y
     */
    function setInNextGeneration(x,y)
    {
        if (!_nextGeneration[x]) {
            _nextGeneration[x] = {};
        }
        _nextGeneration[x][y] = 1;
    }

    /**
     * sets the complete logic for a cell dead or alive.
     * living cells will return a counter increment
     * dead cells will be inserted to the next generation object
     * @param x
     * @param y
     * @param sum
     * @return {*}
     */
    function setCell(x, y, sum)
    {
        isAlive(x, y) ? sum++ : (function(){
            if (shouldBeResurrected(x, y)){
                setInNextGeneration(x, y);
            }
        })();
        return sum;
    }


    /**
     * Public
     */
    return {

        size : null,

        /**
         * Initialize the model with data
         * @param initData object {civilization:json,size:int}
         */
        init : function(initData)
        {
            _thisGeneration = initData.civilization;
            this.size = initData.size;
        },

        /**
         * Sets only the data after initialization
         * @param data json
         */
        set : function(data)
        {
            _thisGeneration = data;
        },

        /**
         * @param civilization json - coordinates for living cells
         * @return json civilization - next generation
         */
        getNextGeneration : function(civilization)
        {
            var cell, // placeholder
                nextI, // x + 1
                prevI, // x - 1
                nextJ, // y + 1
                prevJ, // y - 1
                n; // total number of neighbors

            _thisGeneration = civilization || _thisGeneration;

            for (var x in _thisGeneration) {
                
                if (_thisGeneration.hasOwnProperty(x)) {
                    
                    cell = _thisGeneration[x];
                    
                    // for each cell in line
                    for (var y in cell) {
                        
                        if (cell.hasOwnProperty(y)) {
                            
                            n = 0;

                            nextI = parseInt(x)+1;
                            nextJ = parseInt(y)+1;
                            prevI = parseInt(x)-1;
                            prevJ = parseInt(y)-1;

                            // left top
                            n = setCell(prevI, prevJ, n);
                            // center top
                            n = setCell(x, prevJ, n);
                            // right top
                            n = setCell(nextI, prevJ, n);
                            // left center
                            n = setCell(prevI, y, n);
                            // right center
                            n = setCell(nextI, y, n);
                            // left bottom
                            n = setCell(prevI, nextJ, n);
                            // center bottom
                            n = setCell(x, nextJ, n);
                            // right bottom
                            n = setCell(nextI, nextJ, n);

                            // Spec requirement
                            if (n ==2 || n ==3) {
                                if (!_nextGeneration[x]){
                                    _nextGeneration[x] = {};
                                }
                                // insert the cell to the next generation
                                _nextGeneration[x][y] = 1;
                            }
                        }
                    }
                }
            }

            _thisGeneration = _nextGeneration;
            _nextGeneration = {};
            return _thisGeneration;
        }
    }

}