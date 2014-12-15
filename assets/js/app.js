//app.js

define([
    'backbone',
    'marionette',
    'apps/userApp/userApp',
    'jquery'
    
], function(
    Backbone,
    Marionette,
    UserApp
){
	
    
    var MapApp = new Marionette.Application();
	
	MapApp.addRegions({
		mainRegion: "#main-region",
        menuRegion: "#menu-region",
        dialogRegion: "#dialog-region",
        mapRegion: "#map-canvas",
        //see http://lostechies.com/derickbailey/2012/04/17/managing-a-modal-dialog-with-backbone-and-marionette/ 
        //for derick baily's discussion of wrapping the modal 
        modalRegion: "#modal-region",
        
        mapInfoRegion: "#mapInfo",
        mapFeaturesRegion: "#mapFeatures",
        
        featureDetailInfoRegion: "#featureDetailInfo",
        featureDetailCoordsRegion: "#featureDetailCoords"
	});
           
	
	MapApp.on("start", function(){
        
        console.log("MapApp starts . . . ");
        console.log(UserApp);
        UserApp.initialize();
        $("#mtoCom").html("whatever");
        $("#mtoCom").trigger("mapApp:start");
        $("#mtoCom").on("userApp:initialize", function(data){
            console.log("got it");
        });
        
	});
    
    MapApp.vent.on("some:event", function(){
        console.log("some event was fired!");
    });
     
    MapApp.vent.trigger("some:event"); 
        
    MapApp.vent.on("another:event", function(data){
        console.log("another:event was fired: ", data);
    });
	
    

	return MapApp;
});
