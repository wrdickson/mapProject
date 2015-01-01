//controlapp.js
define([
    'backbone',
    'apps/control/menu',
    'common/dispatch',
    'jquery-ui'

], function(
    Backbone,    
    Menu,
    dispatch

){


var user;

var ControlApp = {};

function fireJqueryUi(){
    $("#mtoControl").show("slow");

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
                //reqres.trigger("control:unselectFeature");
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

ControlApp.initialize = function(user){

    //set the private property
    user = user;
    console.log(user);
    
    //burn the jquery ui onto the control
    fireJqueryUi();    
    Menu.fireMenu(user);   
}

return ControlApp;
});