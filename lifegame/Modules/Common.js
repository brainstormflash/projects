var common = {

    utils : {

        isElementExist : function(elem) {
            if ($(elem).is('*')) {
                return true;
            } else {
                return false;
            }
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
        }
    }
}