<?php
/*
class.map.php

dependencies: 
    -geoPHP object for static functions
    -DataConnecter object that will instantiate and return a new PDO (static function)


*/
class Map {
  private $id;
    private $owner;
    private $name;
    private $desc;
    //array of geoJson strings
    private $mapLayers;
    //centroid is a wkt text string
    private $centroid;
    //envelope is a wkt text string
    private $envelope;
    //type is a google.maps type
    private $type;
    private $area;
    private $zoom;
    //geoJson string 
    public $mapJson;
    //bool, tinyint
    private $mapHasLegend;
    //json string
    private $mapLegend;
    private $dateAdded;
    private $dateModified;
    
    
    
    public function __construct($id){
          $pdo = DataConnecter::getConnection();
            $stmt = $pdo->prepare("SELECT map_id , AsText( map_envelope ) AS map_envelope, AsText( map_centroid ) AS map_centroid, map_area, map_zoom, map_type, map_owner , map_json , map_name , map_desc , map_layers, map_has_legend , map_legend, date_added , date_modified FROM maps WHERE map_id = :id");
            $stmt->bindParam(":id",$id,PDO::PARAM_INT);
            $stmt->execute();
            while($obj = $stmt->fetch(PDO::FETCH_OBJ)){
                $this->id = $obj->map_id;
                $this->owner = $obj->map_owner;
                $this->name = $obj->map_name;    
                $this->desc = $obj->map_desc;
                $this->mapLayers = $obj->map_layers;
                // db stores centroid as wkt, we want it in geoJson
                $this->centroid = $this->wktToJson($obj->map_centroid);
                // db stores envelope as wkt, we want it in geoJson
                $this->envelope = $this->wktToJson($obj->map_envelope);
                $this->area = $obj->map_area;
                $this->zoom = $obj->map_zoom;
                $this->type = $obj->map_type;
                $this->mapJson= $obj->map_json;
                $this->mapHasLegend = $obj->map_has_legend;
                $this->mapLegend = $obj->map_legend;
                $this->dateAdded = $obj->date_added;
                $this->dateModified = $obj->date_modified;
            }
    }
    
    public function dumpArray(){
        $mapArr = array();
        $mapArr['id'] = $this->id;
        $mapArr['owner'] = $this->owner;
        $mapArr['name'] = $this->name;
        $mapArr['desc'] = $this->desc;
        $mapArr['mapLayers'] = json_decode($this->mapLayers, true);
        $mapArr['centroid'] = json_decode($this->centroid, true);
        $mapArr['area'] = $this->area;
        $mapArr['envelope'] = json_decode($this->envelope, true);
        $mapArr['zoom'] = $this->zoom;
        $mapArr['type'] = $this->type;
        $mapArr['mapJson'] = json_decode($this->mapJson, true);
        $mapArr['mapHasLegend'] = $this->mapHasLegend;
        $mapArr['mapLegend'] = json_decode($this->mapLegend, true);
        $mapArr['dateAdded'] = $this->dateAdded;
        $mapArr['dateModified'] = $this->dateModified;        
        return $mapArr;
    }
    
    public function dumpJson(){
        return stripslashes(json_encode($this->dumpArray()));    
    }
    
    private function wktToJson($wkt){
        $geom = geoPHP::load($wkt,'wkt');
      return $geom->out('json');
    }
    
    //get set . . . 
    public function getId(){
        return $this->id;
    }
    
    public function getOwner(){
        return $this->owner;
    }
    
    public function setMapJson($mapJson){
        $this->mapJson = $mapJson;    
    }
    
    public function setOwner($ownerId){
        $this->owner = $ownerId;
        //TODO db update    
    }
    
    public function getName(){
        return $this->name;
    }
    
    public function setName($name){
        $this->name = $name;
        //TODO db update
    }
    
    public function getDesc(){
        return $this->desc;
    }
    
    public function setDesc($desc){
        $this->desc = $desc;
        //TODO db update
    }

    public function getMapLayers(){
        return $this->mapLayers;
    }
    
    public function getCentroid(){
        return $this->centroid;
    }
    
    public function getEnvelope(){
        return $this->envelope;
    }
    
    public function getArea(){
        return $this->area;
    }
    
    public function getZoom(){
        return $this->zoom;    
    }
    
    public function getType(){
        return $this->type;    
    }
    
    public function getMapJson(){
        return $this->mapJson;
    }
    
    public function getHasLegend(){
        return $this->mapHasLegend;
    }
    
    public function getLegend(){
        return $this->mapLegend;   
    }
    
    public function getDateAdded(){
        return $this->dateAdded;
    }
    
    public function getDateModified(){
        return $this->dateModified;
    }
    
    public function removeFeatureAtIndex($index){
        $jsonArr = json_decode($this->mapJson, true);
        $featuresArr = $jsonArr['features'];
        //remove the feature
        unset($featuresArr[$index]);
        //reindex and reset features
        $jsonArr['features'] = array_values($featuresArr);
        $newMapJson = json_encode($jsonArr);
        
        //update to db and object
        $success = $this->updateMapJson($newMapJson);
        if($success == true){
            $this->mapJson = $newMapJson;
        }
        return $success;
        
        
    }
    
    public function updateDefaultType($newDefaultType){
        //TODO validate . . .
        $mapId = $this->id;
        $pdo = DataConnecter::getConnection();
        
        $stmt = $pdo->prepare("UPDATE maps SET map_type = :mapType, date_modified = NOW() WHERE map_id = :id");
        $stmt->bindParam(":mapType", $newDefaultType, PDO::PARAM_STR);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        $result = $stmt->execute();        
        //only update locally if the db update is successful
        if($result == true){
            $this->type = $newDefaultType;
            return true;
        }else{
            return false;
        }                
    }    
    
    public function updateDefaultZoom($newDefaultZoom){
        //TODO validate . . .
        $mapId = $this->id;
        $pdo = DataConnecter::getConnection();
        
        $stmt = $pdo->prepare("UPDATE maps SET map_zoom = :mapZoom, date_modified = NOW() WHERE map_id = :id");
        $stmt->bindParam(":mapZoom", $newDefaultZoom, PDO::PARAM_INT);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        $result = $stmt->execute();        
        //only update locally if the db update is successful
        if($result == true){
            $this->zoom = $newDefaultZoom;
            return true;
        }else{
            return false;
        }                
    }
    
    public function updateMapDesc($newMapDesc){
        //TODO validate . . .
        $newMapDesc = stripslashes($newMapDesc);
        $mapId = $this->id;
        $pdo = DataConnecter::getConnection();
        $stmt = $pdo->prepare("UPDATE maps SET map_desc = :mapDesc, date_modified = NOW() WHERE map_id = :id");
        $stmt->bindParam(":mapDesc", $newMapDesc, PDO::PARAM_STR);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        $result = $stmt->execute();        
        //only update locally if the db update is successful
        if($result == true){
            $this->desc = $newMapDesc;
            return true;
        }else{
            return false;
        }        
    }
    
    public function updateMap($mapData){
    
    }
    
    /*
    update the map with new Json    
    @param string mapJson - the new geoJson string
    @return boolean - success of update
    */
    public function updateMapJson($mapJson){
        //TODO validate . . .
        $mapJson = strip_tags(trim($mapJson));
        //we only one one slash
        //$mapJson = stripslashes($mapJson);
        //$mapJson = addslashes($mapJson);
        
        //recalculate centroid and envelope
        $envelope = MapUtil::calculateEnvelopeJson2Wkt($mapJson);
        $centroid = MapUtil::calculateCentroidJson2Wkt($mapJson);
        
        //calculate area
        $area = MapUtil::calculateAreaFromEnvelopeWkt($envelope);
        
        //update db
        $mapId = $this->id;
        $pdo = DataConnecter::getConnection();
        $stmt = $pdo->prepare("UPDATE maps SET map_json = :json, map_envelope = GeomFromText(:env), map_centroid = GeomFromText(:cent), map_area = :area, date_modified = NOW() WHERE map_id = :id");
        $stmt->bindParam(":json",$mapJson,PDO::PARAM_STR);
        $stmt->bindParam(":env",$envelope,PDO::PARAM_STR);
        $stmt->bindParam(":cent",$centroid,PDO::PARAM_STR);
        $stmt->bindParam(":area",$area,PDO::PARAM_STR);
        $stmt->bindParam(":id",$this->id,PDO::PARAM_INT);
        $result = $stmt->execute();        
        //only update locally if the db update is successful
        if($result == true){
            $this->mapJson = $mapJson;
            $this->centroid = $centroid;
            $this->envelope = $envelope;
            return true;
        }else{
            return false;
        }
    } 
    
    public function updateMapLegend($newMapLegend){
        //TODO validate . . .
        $newMapLegend = stripslashes($newMapLegend);
        $mapId = $this->id;
        $pdo = DataConnecter::getConnection();
        $stmt = $pdo->prepare("UPDATE maps SET map_legend = :mapLegend, date_modified = NOW() WHERE map_id = :id");
        $stmt->bindParam(":mapLegend", $newMapLegend, PDO::PARAM_STR);
        $stmt->bindParam(":id", $mapId, PDO::PARAM_INT);
        $result = $stmt->execute();        
        //only update locally if the db update is successful
        if($result == true){
            $this->mapLegend = $newMapLegend;
            return true;
        }else{
            return false;
        }
    }       
    
    public function updateMapName($newMapName){
        //TODO validate . . .
        $newMapName = stripslashes($newMapName);
        $mapId = $this->id;
        $pdo = DataConnecter::getConnection();
        $stmt = $pdo->prepare("UPDATE maps SET map_name = :mapName, date_modified = NOW() WHERE map_id = :id");
        $stmt->bindParam(":mapName", $newMapName, PDO::PARAM_STR);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        $result = $stmt->execute();        
        //only update locally if the db update is successful
        if($result == true){
            $this->name = $newMapName;
            return true;
        }else{
            return false;
        }
    }
}


?>