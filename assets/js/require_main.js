requirejs.config({
  baseUrl: "http://localhost/mapProject/assets/js",
  waitSeconds: 60,
  paths: {
    backbone: "vendor/backbone",
    "backbone.picky": "vendor/backbone.picky",
    "backbone.syphon": "vendor/backbone.syphon",
    jquery: "vendor/jquery",
    "jquery-ui": "vendor/jquery-ui",
    json2: "vendor/json2",
    localstorage: "vendor/backbone.localstorage",
    marionette: "vendor/backbone.marionette",
    spin: "vendor/spin",
    "spin.jquery": "vendor/spin.jquery",
    text: "vendor/text",
    tpl: "vendor/underscore-tpl",
    underscore: "vendor/underscore",
    q: "vendor/q",
    "dhtmlxcommon": "vendor/dhtmlxcommon",
    "dhtmlxmenu": "vendor/dhtmlxmenu",
    "jquery.cookie": "vendor/jquery.cookie",
    "jqueryui-editable": "vendor/jqueryui-editable"
    
  },

  shim: {
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ["jquery", "underscore", "json2"],
      exports: "Backbone"
    },
    "backbone.picky": ["backbone"],
    "backbone.syphon": ["backbone"],
    marionette: {
      deps: ["backbone"],
      exports: "Marionette"
    },
    "jquery-ui": ["jquery"],
    localstorage: ["backbone"],
    "spin.jquery": ["spin", "jquery"],
    tpl: ["text"],
    "jquery.cookie":{
        deps: ["jquery"]
    },
    "jqueryui-editable":{
        deps:["jquery-ui","jquery"]
    }
    
  }
});

require(["app"], function(MapApp){



  MapApp.start();


  
  
  
  
});
