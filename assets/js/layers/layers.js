//layers.js

define([
    'backbone',
    'marionette',
    'jquery-ui'

], function(
    Backbone,
    Marionette

){


    /*
    Layers is an array of map objects
    
    */

    var Layers = {};
    
    //the original map object, on which 'layers' is a property and should be an array of integers, pointing to mapIds in the db
    Layers.MapModel = Backbone.Model.extend({
    
    });
    
    //prototype for a map model, actually
    //since the uber map model only stores integer ids, we need to fetch the data with each iteration
    Layers.LayerModel = Backbone.Model.extend({
        urlRoot: "./api/maps/"    
    });
    
    //prototype for the collection of Layer Models

    Layers.LayerCollection = Backbone.Collection.extend({
        model: Layers.LayerModel
    });
    
    Layers.LayerView = Marionette.ItemView.extend({
    
    });
    
    Layers.LayersView = Marionette.CompositeView.extend({
    
    });
    /*
        this is all for ControlApp . . . the map will work on the data separately
    
        @param data: the original map object, on which 'layers' is a property 
        and should be an array of integers, pointing to mapIds in the db  
    */
    Layers.initialize = function(data){
        //load the maps . . . loop through the layers . . . 
        
        
        //make the presentation . . . 
    
    }
    
    require([ 'app' ], function( MapApp ){
        MapApp.vent.on("mapModel:sync", function(data){
            Layers.initialize(data);
        });
    });
    
    
    

    return Layers;
});