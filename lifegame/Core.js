var CORE = {

    log : function(msg) {
        //if (console && this.isDebugMode()) {
            console.log(msg);
        //}
    },

    is_obj : function (obj) {
        return jQuery.isPlainObject(obj);
    },

    is_empty : function(obj) {
        if (obj.length && obj.length > 0)    return false;
        if (obj.length && obj.length === 0)  return true;

        for (var key in obj) {
            if (hasOwnProperty.call(obj, key))    return false;
        }

        return true;
    },

    isDebugMode : function() {
        if (console && document.location.hostname == "localhost") {
            return true;
        } else {
            return false;
        }

    },

    APP :  {

        create : function() {
            
            return {

                globals : {},

                modules : {},

                views : {},

                events : {},

                defines : {},

                cache : {},

                createModule : function(name, obj, options) {
                    if (!name || !obj.init || !obj.start) {
                        throw new Error('not valid module mandatory methods : init, start. Properties: name');
                    }

                    if (options) {
                        obj.options = options;
                    }

                    this.modules[name] = obj;
                },

                createView : function(name, obj) {

                    this.views[name] = obj;
                },

                start : function() {
                    for (var i in this.modules) {
                        this.modules[i].start();
                    }

                },

                addEvent : function(handler, type, fn){
                    CORE.dom.bind(element, type, fn);
                },

                notify : function(obj){
                    CORE.log('notify TRIGGERING: ' + obj.type);
                    if (this.events[obj.type]) {
                        var virtualEvent = this.events[obj.type];
                        for (var i in virtualEvent) {
                            if (virtualEvent.hasOwnProperty(i)) {
                                // ugly patch to context issues
                                virtualEvent[i].call(this.modules.lifeGame, obj.data);
                            }
                        }
                    }
                },

                listen : function(eventType, fn){

                    if (typeof fn != 'function') {
                        CORE.log('NOTICE: ' + fn + ' is not a function');
                    }
                    CORE.log('LISTENING: ' + eventType);

                    if (!this.events[eventType]) {
                        this.events[eventType] = [];
                    }

                    if (jQuery.inArray(fn,this.events[eventType]) == -1) {
                        this.events[eventType].push(fn);
                    }

                },

                setGlobal : function(scope, key, val){
                    if (arguments.length == 3 && this.modules[scope]) {
                        if (!this.defines[scope]) {
                            this.defines[scope] = {};
                        }
                        this.defines[scope][key] = val;
                    } else if (arguments.length == 2) {
                        if (!this.defines['APP']) {
                            this.defines['APP'] = {};
                        }
                        this.defines['APP'][arguments[0]] = arguments[1];
                    }

                },

                getGlobal : function(scope,key){
                    if (this.defines[scope] && this.defines[scope][key]) {
                        return this.defines[scope][key];
                    }
                    return false;
                }
            }
        }
    }
}



