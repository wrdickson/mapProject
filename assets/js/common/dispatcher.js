//dispatcher.js
define([
    'backbone'
], function(
    Backbone
){
    //clone Backbone.Events to handle "on" and "trigger"
    var dispatcher = _.clone(Backbone.Events);
    //dispatcher.handlers is an object, keys are the handler names, value is the function
    dispatcher.handlers = {};
    //i couldn't find a way to work out the arguments array  . . fuck it . . 10 params are plenty
    dispatcher.request = function(event, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10){
        if(dispatcher.handlers[event]){
            try{
                var response = dispatcher.handlers[event](p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);
            } catch(err){
                var response = err;
            }
            return response;
        }else{
            return undefined;
        }
    };
    dispatcher.setHandler = function(event, ftn){
        if(typeof ftn == 'function'){
            dispatcher.handlers[event] = ftn;
        }else{
            throw "error: function 'setHandler()' expects a function as the second parameter";
        }
    };
    return dispatcher;

});