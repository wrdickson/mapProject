<?php

require "lib/Slim/Slim.php";    
require "config/config.php";
require "phpClasses/class.dataconnecter.php";
require "phpClasses/class.person.php";
require "phpClasses/class.logger.php";
require "phpClasses/class.map.php";
require "phpClasses/class.mapUtil.php";
require "phpClasses/geoPHP-master/geoPHP.inc";


\Slim\Slim::registerAutoloader();

// create new Slim instance
$app = new \Slim\Slim();


//route the requests based on RESTful principles . . . 
$app->get('/users/:id', 'getUser');

$app->get('/login/','login');
$app->get("/logoff/", "logoff");

$app->get('/maps/:id', 'getMap');

$app->put('/maps/:id', 'updateMap');
$app->patch('/maps/:id', 'patchMap');
$app->post('/maps/', 'postUpdateMap');

$app->put('/maps/:id/features/:index', 'updateFeatureByIndex');

function updateFeatureByIndex($mapId, $featureIndex){

    $app = \Slim\Slim::getInstance();
    $response = array();
    
    $response['value'] = $app->request->params('value');
    $response['pk'] = $app->request->params('pk');
    $response['mtoUser'] = $app->request->params('mtoUser');
    $response['mapId'] = $mapId;
    $response['featureIndex'] = $featureIndex;
    
    //validate
    
    $iMap = new Map($mapId);
    $response['origMapJson'] = $iMap->getMapJson();
    $origFeaturesArr = json_decode($iMap->getMapJson(), true);
    
    
    $app->response->setStatus(200);
    
    print json_encode($response);
};


function getMap($id){
	//this has to come across as pure json so it will map to the Backbone model
	$iMap = new Map($id);
    $response['centroid'] = json_decode($iMap->getCentroid(),true);
    $response['mapJson'] = json_decode($iMap->getMapJson(),true);
    $response['owner'] = $iMap->getOwner();
    $response['envelope'] = json_decode($iMap->getEnvelope(),true);
    $response['area'] = $iMap->getArea();
    $response['zoom'] = $iMap->getZoom();
    $response['type'] = $iMap->getType();
    $response['map_name'] = $iMap->getName();
    $response['map_desc'] = $iMap->getDesc();
    $response['map_layers'] = $iMap->getMapLayers();
    $response['has_legend'] = $iMap->getHasLegend();
    $response['legend'] = $iMap->getLegend();
    $response['date_added'] = $iMap->getDateAdded();
    $response['date_modified'] = $iMap->getDateModified();
    $response['map_id'] = $iMap->getId();
    print json_encode($response);	
}

function patchMap($id){
    $app = \Slim\Slim::getInstance();
    $body = $app->request->getBody();
    $pArr = json_decode($body, true);
    
    
    $response = array();
    $response['pk'] = $pArr['pk'];
    $response['id'] = $pArr['id'];
    $response['user'] = $pArr['user'];
    $response['value'] = $pArr['value'];
    
    $app->response->setStatus(401);
    
    print json_encode($response);
}

function postUpdateMap(){
    $app = \Slim\Slim::getInstance();
    $response = array();
    $response['POST'] = $_POST;
    
    print json_encode($response);
}

function updateMap($id){
    //TODO validate user and data
	$app = \Slim\Slim::getInstance();
    $body = $app->request->getBody();
    $pArr = json_decode($body, true);
    
    //get the user
    $mtoUserId = $pArr['mtoUser']['id'];
    $user = new Person($mtoUserId);
    
    $response = array();
    
    $response['pArr'] = $pArr;
    //$response['value'] = $_POST['value'];
    
    //key match!
    try{
        $response['$keyPassed2'] = $user->verify_key($pArr['mtoUser']['key']);
    } catch (Exception $e){
        $response['error'] .= $e;
    }
    
    //validate user key
    if($user->get_key() === $pArr['mtoUser']['key']){
        $response['keyPassed'] = 1;
    }else{
        $response['keyPassed'] = 0;
    }
    
    
    
    
    
    $iMap = new Map($pArr['id']);
    $success = $iMap->updateMapJson(stripslashes(trim(json_encode($pArr['mapJson']))));
    
    $error= "there was an error";
    if ($success == 1){
        $app->response->setStatus(200);
    }else{
        $app->response->setStatus(300);
    }
    
    
    print(json_encode($response));
}

function getUser($id){
	$iPerson = new Person($id);
	print $iPerson->dumpJson();
}

function login(){ 
	$app = \Slim\Slim::getInstance();
    $username = $app->request->params('username');
    $pwd = $app->request->params('password');
    $result = Logger::check_login($username,$pwd);	
	print json_encode($result);
}

function logoff(){
	$app = \Slim\Slim::getInstance();
    $id = $app->request->params('id');
    $key = $app->request->params('key');
    $result = Logger::logoff($id, $key);
    print json_encode($result);
}

$app->run();