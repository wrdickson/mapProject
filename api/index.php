<?php
session_start();
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
	//this has to come across as json so it will map to the Backbone model
	$iMap = new Map($id);    
    print json_encode($iMap->dumpArray());
    
    //print json_encode($response);	
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
    /*
    $mtoUserId = $pArr['mtoUser']['id'];
    $user = new Person($mtoUserId);
    */
    $response = array();
    
    $response['pArr'] = $pArr;
    $response['session'] = $_SESSION;
    //key match!
    /*
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
    
    //switch based on the value of "pk":
    switch ($pArr['pk']){
    
        case "mapJson":
            //TODO validate . . . 
            //still not right . . . need to just call ->setMapJson()
            $response['success'] = $iMap->updateMapJson(stripslashes(trim(json_encode($pArr['value'])))); 
            
        default:
            $response['success'] = false;
    
    }
    
    
    
    $error= "there was an error";
    if ($response['success'] == 1){
        $app->response->setStatus(200);
    }else{
        $app->response->setStatus(300);
    }
    */
    
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