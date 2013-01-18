function AnotherModel(){

    var helpers = {



    };

    return {
        data : {},

        init : function() {


        },

        start : function() {
            console.log('another module started');
            this.init();
        },

        stop : function() {
            console.log('another module ended');
        },

        doThis : function() {
            console.log('doThis()');

        },

        doThat : function() {
            console.log('doThat()');

        }
    }
}