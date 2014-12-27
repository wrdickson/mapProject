//app.js
"use strict";
define([
    'backbone',
    'marionette',
    'apps/mapData/mapData',
    'apps/control/controlApp',
    'apps/gMap/g_map_app',
    'apps/user/userApp',
    'common/dispatcher',
    'jquery'
    
], function(
    Backbone,
    Marionette,
    MapData,
    ControlApp,    
    GMapApp,
    UserApp,
    dispatcher
){
	
    //this is where we get the evil global variables from php
    //kneel down and vow that globals will never be accessed or created again
    var baseUrl = mtoBaseUrl;
    //and we do it again for mtoUser
    var user = new UserApp.User( mtoUser );
    var router;
    var mapData;
        
    
    var MapApp = new Marionette.Application
    

    //testing dispatcher . . . 
            var TModel = Backbone.Model.extend();
            
            var tModel = new TModel({
                prop1: 234,
                prop2: "something"
            });
            
            dispatcher.setHandler("tModel:get", function(){
                return tModel.toJSON();
            });
            
            dispatcher.setHandler("testParams:1", function(x){
                return tModel.get(x);
            });

            tModel.set("prop3", "somethingElse");
            
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
    
        //start by defining the router and controller
        var RouteController = Marionette.Controller.extend({
            loadDefaultMap: function(){
                console.log("loading default map");
            },  
            loadMap: function(id){
                console.log("loadMap",id);
                mapData = new MapData();
                mapData.set("id",id);
                mapData.fetch({
                    success: function(model, response, options){
                        dispatcher.trigger("mapData:loaded", model);
                        dispatcher.trigger("mapData:xLoaded",{
                            f: function(){
                                alert("hello");
                            }
                        });
                    },
                    error: function(model, response, options){
                    }
                });
            }
        });
        var routeController = new RouteController();
        
        MapApp.router = new Marionette.AppRouter({
            controller: routeController,
            appRoutes: {
                "": "loadDefaultMap",
                "maps/:id": "loadMap"
            }
        });
        
        //ONLY after the routers are instantiated to we start Backbone.history
        if (Backbone.history) { 
            Backbone.history.start({
                pushState: true,
                root: "mapProject"
            });
        }
        
        //MapApp.router.navigate("something/else"); //works
        
        
        UserApp.initialize(user);        
           
        ControlApp.initialize(user);
        
        GMapApp.initialize(user);
        
	});

	return MapApp;
});
