//mapData.js
define([
    'backbone'


], function(
    Backbone



){

    var MapData = Backbone.Model.extend({
        urlRoot: "http://localhost/mapProject/api/maps",
        initialize: function(){
            var self = this;
            this.on("change", function(){
                require(['app'], function(MapApp){
                    MapApp.vent.trigger("mapModel:change", self);
                });        
            });
            this.on("sync", function(){
                require(['app'], function(MapApp){
                    MapApp.vent.trigger("mapModel:snyc", self);
                }); 
            });
            
        }   
    });


return MapData;
});