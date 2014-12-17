//mapData.js
define([
    'backbone'


], function(
    Backbone



){

MapData = Backbone.Model.extend({
    urlRoot: "./api/maps",
    initialize: function(){
        var self = this;
        this.on("change", function(){
            require(['app'], function(MapApp){
                MapApp.vent.trigger("mapModel:change", self);
            });        
        });
    }   
});


return MapData;
});