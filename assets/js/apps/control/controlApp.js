//controlapp.js
define([
    'jquery-ui'

], function(


){

var ControlApp = {};

//  PRIVATE FUNCTIONS
function sayHello(){
    console.log("Hellooooooo . . ", this);
    
}

function fireJqueryUi(){
    $("#mtoControl").draggable({
        handle: "#mtoControlUpper"	
    });
    
    $("#controlTabs").tabs();
    //initailly disable detail tab
    $("#controlTabs").tabs("option", "disabled", [2]);
    
    $("#controlTabs").on("tabsactivate", function(event,ui){
        activeTab = $("#controlTabs").tabs("option","active");
        //reset selected if user clicks map or features tab 
        if(activeTab < 2){
            selectedFeatureIndex = -1;
            //tell map to unselect all
                reqres.trigger("control:unselectFeature");
            //disable tab2 (detail)
            $("#controlTabs").tabs("option", "disabled", [2]);
        }
        
    });
    
    $( "#mtoControl" ).resizable({
        handles: "e"
    });
    
    //debug . . .
    $("#btnDemo").button({
        icons: {
            primary: "ui-icon-minusthick"
        },
        text: false,
        label: 'Minimize'
    });
}

ControlApp.initialize = function(){
    //console.log("controlApp inits . . ");
    sayHello();
    //burn the jquery ui onto the control
    fireJqueryUi();
 
}

ControlApp.loadMap = function($id){

}


return ControlApp;
});