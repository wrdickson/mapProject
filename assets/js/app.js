//app.js

define([
    'backbone',
    'marionette',
    'apps/userApp/userApp',
    'apps/mapData/mapData',
    'apps/control/controlApp',
    'jquery'
    
], function(
    Backbone,
    Marionette,
    UserApp,
    MapData,
    ControlApp
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
        UserApp.initialize();
        var d = $.Deferred();
        UserApp.User.set("id", 1);
        
        UserApp.User.fetch().done( function(){
        
            MapApp.mapData = new MapData({
                id: 70
            });
            
            MapApp.mapData.fetch().done( function(){
                MapApp.mapData.save({pk: "desc", value: "some new desc", mtoUser: UserApp.User},{wait: true});
            });        
        
        
        });
        
        console.log(ControlApp);
        ControlApp.initialize();
        
        
        

        
        
	});
    
    
    MapApp.vent.on("userModel:change", function(data){
        console.log("userModel:change ", data);
    });
    
    MapApp.vent.on("mapModel:change", function(data){
        console.log("mapModel:change", data);
    });
	
    

	return MapApp;
});
