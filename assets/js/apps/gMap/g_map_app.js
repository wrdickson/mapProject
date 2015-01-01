//g_map_app.js

define([
    "apps/gMap/map_defaults",
    'common/dispatch',   
    "backbone", 
    "jquery"
], function(
    mapDefaults,
    dispatch,
    Backbone
){

    var GMapApp = {};
    
    /*
    Private properties:
    */
    //user is a Backbone model
    var user;
    //gMap is the actual google.maps object
    var gMap;
    //drawing manager
    var drawingManager;
    //mapModel is a Backbone model, fetched from db
    var mapModel;
    //featuresArray is the google.maps generated array of features
    //index of selected feature (select OR edit)
    var featuresArray = [];
    //used to trick the hoverout event when user selects from control
    var hoverSelect;
    //the marker that shows coords from control
    var coordHoverMarker; 
    var selectedFeatureIndex = -1;
    
    /*
    Private functions:
    */

    var enableDrawing = function(){
        //add drawing manager
        drawingManager = new google.maps.drawing.DrawingManager({
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT,
                    drawingModes: [
                         google.maps.drawing.OverlayType.MARKER,
                         google.maps.drawing.OverlayType.POLYGON,
                         google.maps.drawing.OverlayType.POLYLINE
                    ]
            },
            markerOptions: {
                icon: mapDefaults.markerIcon
           }    
        });
        drawingManager.setMap(gMap);
    };
    
    var setSelectedFeatureToDefault = function(){
        if(selectedFeatureIndex > -1){
            switch (featuresArray[selectedFeatureIndex].type){
                case "Point":
                    featuresArray[selectedFeatureIndex].setDraggable(false);
                    featuresArray[selectedFeatureIndex].setIcon(mapDefaults.markerIcon);
                break;
                case "LineString":
                    featuresArray[selectedFeatureIndex].setEditable(false);
                    featuresArray[selectedFeatureIndex].setOptions({
                        strokeColor: mapDefaults.polylineStrokeColor,
                        strokeOpacity: mapDefaults.polylineStrokeOpacity,
                        strokeWeight: mapDefaults.polylineStrokeWeight
                    });
                break;
                case "Polygon":
                    featuresArray[selectedFeatureIndex].setEditable(false);
                    featuresArray[selectedFeatureIndex].setOptions({
                        strokeColor: mapDefaults.polygonStrokeColor,
                        strokeOpacity: mapDefaults.polygonStrokeOpacity,
                        strokeWeight: mapDefaults.polygonStrokeWeight,
                        fillColor: mapDefaults.polygonFillColor,
                        fillOpacity: mapDefaults.polygonFillOpacity
                    });                
                break;        
            };
        };
    };
    
    var handleCoordHover = function(obj){
        var hoverLatLng = new google.maps.LatLng(obj.lat, obj.lng);
        coordHoverMarker.setPosition(hoverLatLng);
        coordHoverMarker.setMap(gMap);
    };
    
    var handleCoordHoverOut = function(){
        coordHoverMarker.setMap(null);
    };
    
    //this method fires from a click on the map feature
    // OR from a click on the monitor
    var handleFeatureSelect = function(index){
    
 
    
        //set currently selected to default if selected
        if(selectedFeatureIndex != -1){
            setSelectedFeatureToDefault();
        }
        //now we can set local property        
        selectedFeatureIndex = index;
        switch (featuresArray[index].type){
            case "Point":
                featuresArray[index].setIcon(mapDefaults.markerSelectedIcon);
            break;
            case "LineString":
                featuresArray[selectedFeatureIndex].setOptions({
                    strokeColor: mapDefaults.selectedPolylineStrokeColor,
                    strokeOpacity: mapDefaults.selectedPolylineStrokeOpacity,
                    strokeWeight: mapDefaults.selectedPolylineStrokeWeight
                });                
            break;
            case "Polygon":
                featuresArray[selectedFeatureIndex].setOptions({
                    strokeColor: mapDefaults.selectedPolygonStrokeColor,
                    strokeOpacity: mapDefaults.selectedPolygonStrokeOpacity,
                    strokeWeight: mapDefaults.selectedPolygonStrokeWeight,
                    fillColor: mapDefaults.selectedPolygonFillColor,
                    fillOpacity: mapDefaults.selectedPolygonFillOpacity
                });            
            break;        
        };
    };


    var handleFeatureEdit = function(index){
    
 
    
        //set currently selected to default if selected
        if(selectedFeatureIndex != -1){
            setSelectedFeatureToDefault();        
        }
        //now we can set local property
        selectedFeatureIndex = index;
        switch (featuresArray[index].type){
            case "Point":
                featuresArray[index].setDraggable(true);
                featuresArray[selectedFeatureIndex].setIcon(mapDefaults.markerEditIcon);                
            break;
            case "LineString":
                featuresArray[index].setEditable(true);
                featuresArray[selectedFeatureIndex].setOptions({
                    strokeColor: mapDefaults.editPolylineStrokeColor,
                    strokeOpacity: mapDefaults.editPolylineStrokeOpacity,
                    strokeWeight: mapDefaults.editPolylineStrokeWeight
                });                 
                
            break;
            case "Polygon":
                featuresArray[index].setEditable(true);
                featuresArray[selectedFeatureIndex].setOptions({
                    strokeColor: mapDefaults.editPolygonStrokeColor,
                    strokeOpacity: mapDefaults.editPolygonStrokeOpacity,
                    strokeWeight: mapDefaults.editPolygonStrokeWeight,
                    fillColor: mapDefaults.editPolygonFillColor,
                    fillOpacity: mapDefaults.editPolygonFillOpacity
                });                
            break;        
        };
    };
    
    var handleFeatureHover = function(index){
        //reset selected
        if(selectedFeatureIndex != -1){
            setSelectedFeatureToDefault();        
        }
         selectedFeatureIndex = -1;
         
        switch (featuresArray[index].type){
            case "Point":
                featuresArray[index].setIcon(mapDefaults.markerHoverIcon);
            break;
            case "LineString":
                featuresArray[index].setOptions({
                    strokeColor: mapDefaults.hoverPolylineStrokeColor,
                    strokeOpacity: mapDefaults.hoverPolylineStrokeOpacity,
                    strokeWeight: mapDefaults.hoverPolylineStrokeWeight
                });                
            break;
            case "Polygon":
                featuresArray[index].setOptions({
                    strokeColor: mapDefaults.hoverPolygonStrokeColor,
                    strokeOpacity: mapDefaults.hoverPolygonStrokeOpacity,
                    strokeWeight: mapDefaults.hoverPolygonStrokeWeight,
                    fillColor: mapDefaults.hoverPolygonFillColor,
                    fillOpacity: mapDefaults.hoverPolygonFillOpacity
                });            
            break;        
        };    
    };
    
    var handleFeatureHoverout = function(index){
        //when a user selects from the Control, a hoverout fires when the tab changes to detail.
        //so . . . we trick it by setting hoverSelect to 1 when this type of selection occurs
        if(hoverSelect != 1){
            switch (featuresArray[index].type){
                case "Point":
                    featuresArray[index].setIcon(mapDefaults.markerIcon);
                break;
                case "LineString":
                    featuresArray[index].setOptions({
                        strokeColor: mapDefaults.polylineStrokeColor,
                        strokeOpacity: mapDefaults.polylineStrokeOpacity,
                        strokeWeight: mapDefaults.polylineStrokeWeight
                    });                
                break;
                case "Polygon":
                    featuresArray[index].setOptions({
                        strokeColor: mapDefaults.polygonStrokeColor,
                        strokeOpacity: mapDefaults.polygonStrokeOpacity,
                        strokeWeight: mapDefaults.polygonStrokeWeight,
                        fillColor: mapDefaults.polygonFillColor,
                        fillOpacity: mapDefaults.polygonFillOpacity
                    });            
                break;        
            };
        };
        hoverSelect = 0;
    };
    
    var paintOverlays = function(){
        $.each(mapModel.get("mapJson").features,function(index,v){
            
            switch (v.geometry.type)
            {
                case "Point":
                    var iLatLng = new google.maps.LatLng(v.geometry.coordinates[1], v.geometry.coordinates[0]);
                    //instantiate a google.maps.Marker and add it to this.featuresArray
                    
                    featuresArray[index] = new google.maps.Marker({
                        icon: mapDefaults.markerIcon,
                        position: iLatLng,
                        map: gMap,
                        title: v.properties.name,
                        description: v.properties.desc,
                        legend: v.properties.legend,
                        draggable: false
                    });
                    featuresArray[index].type = "Point";
                    
                    google.maps.event.addDomListener(featuresArray[index],'dragend', function(event){
                        syncMapJsonToFeaturesArr();
                    });                    
                break;
                
                case "LineString":
                    var pointsArray = [];
                    $.each(v.geometry.coordinates, function(index2,value2){
                        iLatLng = new google.maps.LatLng(value2[1],value2[0]);
                        pointsArray.push(iLatLng);
                    });
                    featuresArray[index] = {};
                    featuresArray[index] = new google.maps.Polyline({
                        path: pointsArray,
                        strokeColor: mapDefaults.polylineStrokeColor,
                        strokeOpacity: mapDefaults.polylineStrokeOpacity,
                        strokeWeight: mapDefaults.polylineStrokeWeight,
                        editable: false,
                        map: gMap,
                        title: v.properties.name,
                        description: v.properties.desc
                    });
                    featuresArray[index].type = "LineString";
                    featuresArray[index].properties = v.properties;
                
                    google.maps.event.addDomListener(featuresArray[index].getPath(),'set_at', function(event){
                        syncMapJsonToFeaturesArr();
                    }); 
                    
                    google.maps.event.addDomListener(featuresArray[index].getPath(),'insert_at', function(event){
                        syncMapJsonToFeaturesArr();
                    });                    
                break;
                
                case "Polygon":
                    var pointsArray = [];
                    $.each(v.geometry.coordinates[0], function(index2,value2){
                     iLatLng = new google.maps.LatLng(value2[1],value2[0]);
                     pointsArray.push(iLatLng);
                     //id = value.properties.id;     
                    });
                    featuresArray[index] = {};
                    featuresArray[index] = new google.maps.Polygon({
                        path: pointsArray,
                        strokeColor: mapDefaults.polygonStrokeColor,
                        strokeOpacity: mapDefaults.polygonStrokeOpacity,
                        strokeWeight: mapDefaults.polygonStrokeWeight,
                        fillColor: mapDefaults.polygonFillColor,
                        fillOpacity: mapDefaults.polygonFillOpacity,
                        editable: false,
                        map: gMap,
                        title: v.properties.name,
                        description: v.properties.desc
                    });
                    featuresArray[index].type = "Polygon";
                  
                    google.maps.event.addDomListener(featuresArray[index].getPath(),'set_at', function(event){
                        syncMapJsonToFeaturesArr();
                    });            
                    google.maps.event.addDomListener(featuresArray[index].getPath(),'insert_at', function(event){
                        syncMapJsonToFeaturesArr();
                    });                    
                break;
            };
            

            //add the properties to the features Array
            //   this will be useful when re-creating the json for the model
            //   after an edit or an add
            featuresArray[index].properties = v.properties;
            
            google.maps.event.addDomListener(featuresArray[index],'click', function(event){
                //reqres.trigger("map:featureSelected", index);
                handleFeatureSelect(index);                    
            });
            
            google.maps.event.addDomListener(featuresArray[index],'rightclick', function(event){
                console.log("right clicked map feature");
                //reqres.trigger("map:featureSelected", index);
                handleFeatureEdit(index);
            });
            
        });
    };
    
    var setCenter = function(){
        var cLng = mapModel.get("centroid").coordinates[0];
        var cLat = mapModel.get("centroid").coordinates[1];
        var mapCenter = new google.maps.LatLng(cLat,cLng);
        gMap.setCenter(mapCenter);
    };
    
    var setType = function(){
        var iType = mapModel.get("type");
        var mapTypeId;
        switch (iType){
            case "terrain":
                mapTypeId = google.maps.MapTypeId.TERRAIN;
            break;
            case "hybrid":
                mapTypeId = google.maps.MapTypeId.HYBRID;
            break;
            case "satellite":
                mapTypeId = google.maps.MapTypeId.SATELLITE;
            break;
            case "roadmap":
                mapTypeId = google.maps.MapTypeId.ROADMAP;
            break;
            default:
                mapTypeId = google.maps.MapTypeId.TERRAIN;
            break;
        }
        gMap.setMapTypeId(mapTypeId);        
    };
    
    var setZoom = function(){
        gMap.setZoom(parseInt(mapModel.get("zoom")));
    };
   
    var syncMapJsonToFeaturesArr = function(){
        newMapJson = {};
        newMapJson.type = "FeatureCollection";
        newMapJson.features = [];
        //iterate through featuresArr and create geoJson objects: point, linestring, polygon
        $.each(featuresArray, function(i,v){
            switch (v.type){
                case "Point":
                    var iLat = v.getPosition().lat();
                    var iLng = v.getPosition().lng();
                    var iPoint = [iLng, iLat];
                    var props = {"name": v.title, "desc": v.description, "legend": v.legend};
                    var iFeature = {};
                    iFeature.type = "Feature";
                    iFeature.geometry = {};
                    iFeature.properties = {};
                    iFeature.geometry.type = "Point";
                    iFeature.geometry.coordinates = iPoint;
                    iFeature.properties = props;
                    newMapJson.features.push(iFeature);
                break;
                
                case "LineString":
                    var pointsArray = Array();
                    var a = v.getPath().getArray();
                    $.each(a, function(index,value){
                         var iCoord = [value.lng(), value.lat()];
                         pointsArray.push(iCoord);
                    }); 
                    var props = {name: v.title, desc: v.description};
                    props.length = google.maps.geometry.spherical.computeLength(v.getPath());
                    var iFeature = {};
                    iFeature.type = "Feature";
                    iFeature.geometry = {};
                    iFeature.properties = {};
                    iFeature.geometry.type = "LineString";
                    iFeature.geometry.coordinates = pointsArray;
                    iFeature.properties = props;
                    newMapJson.features.push(iFeature);
                break;
                
                case "Polygon":
                    var b = v.getPath().getArray();
                    //get the points
                    var pointsArray = Array();
                    $.each(b, function(index,value){
                         var iCoord = [value.lng(), value.lat()];
                         pointsArray.push(iCoord);
                    });
                    var props = {name: v.title, desc: v.description};
                    props.area = google.maps.geometry.spherical.computeArea(v.getPath());
                    var iFeature = {};
                    iFeature.type = "Feature";
                    iFeature.geometry = {};
                    iFeature.properties = {};
                    iFeature.geometry.type = "Polygon";
                    iFeature.geometry.coordinates = []; 
                    iFeature.geometry.coordinates[0] = pointsArray;
                    iFeature.properties = props;
                    newMapJson.features.push(iFeature);
                break;
            }
        });
        
        //set the new mapJson to the model
        mapModel.set("mapJson", newMapJson);
        //save
        
        //set k to "mapJson"  this tells the RESTful put response which key we're changing
        mapModel.set("pk","mapJson");
        
        mapModel.set("mtoUser", user);
        console.log("mapModel@save:",mapModel);
        //save will fire the "change" event, of course
        mapModel.save({pk: "mapJson", id: mapModel.get("id"), user: user, value: mapModel.get("mapJson")},{
            
            success: function(model,response,options){
                console.log("model:", model);
                console.log("response: ", response);
                console.log("options: ", options);
            },
            error: function(model,response,options){
            
            }
        });
        
    }    
    
    var API = {
    
        //just burn a basic map on initialize.  use ftn loadMap() to instantiate
        // an actual map with id, overlays, etc
        initialize: function(){
            // current user
            //user = reqres.request("user:get");
            
            //burn the base map
            var mapOptions = {
                center: new google.maps.LatLng(0, -180),
                zoom: 3,
                scrollwheel: false,
                panControl: true,
                panControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                scaleControl: true,
                //scale control positon doesn't appear to do a fucking thing!!
                scaleControlOptions: {
                    style: google.maps.ScaleControlStyle.DEFAULT,
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },
                zoomControl: true,
                zoomControlOptions: {
                    style:google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.TOP_RIGHT
                }
            };
            
            gMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            
            coordHoverMarker = new google.maps.Marker({
                icon: mapDefaults.coordHoverIcon
            });
            
            enableDrawing();
            //assign event to overlay complete on drawing manager
            google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
                switch (event.type) {
                
                    case "marker":
                        event.overlay.type = "Point";
                        event.overlay.title = "newPoint";
                        event.overlay.description = "newPointDescription";
                        event.overlay.legend = "";
                        featuresArray.push(event.overlay);
                        syncMapJsonToFeaturesArr();
                    break;
                    
                    case "polyline":
                        event.overlay.type = "LineString";
                        event.overlay.title = "newLineString";
                        event.overlay.description = "newLineStringDescription";
                        event.overlay.legend = "";
                        featuresArray.push(event.overlay);
                        syncMapJsonToFeaturesArr();     
                    break;
                    
                    case "polygon":
                        event.overlay.type = "Polygon";
                        event.overlay.title = "newPolygon";
                        event.overlay.description = "newPolygonDescription";
                        event.overlay.legend = "";
                        featuresArray.push(event.overlay);
                        syncMapJsonToFeaturesArr();                  
                    break;
                    default:
                };                
                //clear all overlays . . .
                $.each(featuresArray, function(i,v){
                    v.setMap(null);
                });
                //repaint
                paintOverlays();
            });
        },
        
        loadMap: function(data, iUser){
                
                //set user
                user = iUser;
                console.log('user@mapload:',user);
            
                //set the property
                mapModel = data;
                                
                //set mapType
                setType();
                
                //set center
                setCenter();
                
                //set zoom
                setZoom();
                
                //paint overlays
                paintOverlays();
            
        }
    };
    
    //initialize merely loads a generic map
    GMapApp.initialize = function(){
        API.initialize();
    };
    
    //this should be the only fire mechanism for the map load
    dispatch.on("mapData:loaded", function(data, iUser){
        API.loadMap(data, iUser);
    });
    
/*    
    reqres.setHandler("g_map:getModel", function(){
        return mapModel;
    });
    
    reqres.on("control:selectFeature", function(index){
        hoverSelect = 1;
        handleFeatureSelect(index);
    });
    
    reqres.on("feature:coordHover", function(obj){
        handleCoordHover(obj);
    });
    
    reqres.on("feature:coordHoverOut", function(){
        handleCoordHoverOut();
    });
    
    reqres.on("feature:hover", function(index){
        handleFeatureHover(index);
    });
    
    reqres.on("feature:hoverout", function(index){
        handleFeatureHoverout(index);
    });
    
    reqres.on("control:unselectFeature", function(){
        setSelectedFeatureToDefault();
        selectedFeatureIndex = -1;
        
    });
*/


    return GMapApp;
});