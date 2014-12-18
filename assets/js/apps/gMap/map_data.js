//map_data.js

define(['backbone','reqres'],function(Backbone, reqres){

    var Map = Backbone.Model.extend({
        urlRoot: "./api/maps",
        initialize: function(){
            this.on("change", function(){
                reqres.trigger("mapModel:change",this);
                console.log("mapModel registers change");                
            });
        }
    });
    
    var mapFeature = Backbone.Model.extend({
    	
    });
    
    var mapFeatures = Backbone.Collection.extend({
    	model: mapFeature,
    	comparator: "type"
    });
    
    var API = {
    
    	getMapJson: function(mapId){
    		map = new Map({id: mapId});
    		var defer = $.Deferred();	
    		map.fetch({
    			success: function(data){
    				defer.resolve(data);	
    			},
    			error: function(data){
    				defer.resolve(undefined);	
    			}
    		});
    		return defer.promise();
    	},
    	
    	getFeatures: function(map){
    		var features = new mapFeatures();
    		var featuresJson = map.get("mapJson");
    		var index = 0;
    		$.each(featuresJson.features, function(i,v){
    			var iFeature = new mapFeature();
    			//set an index property on the model
    			iFeature.set("index",index);
    			iFeature.set("geometry",v.geometry);
    			iFeature.set("properties",v.properties);
    			index++;
    			features.add(iFeature);	
    		});
    		//console.log(features);
    		return features;
    	}
    		
    }
    
    reqres.setHandler("map:getMapJson", function(id){
    	map = API.getMapJson(id);    	
    	return map;
   	});
   	
   	//@param map - a loaded Entities.map model as above
   	reqres.setHandler("map:getFeatures", function(map){
   		return API.getFeatures(map);
   	});

});