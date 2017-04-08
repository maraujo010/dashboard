import React, { Component } from 'react';
import 'openlayers/css/ol.css';
var ol = require('openlayers');

class Map extends Component {

  componentDidMount() {

    var map = new ol.Map({
        target:'map',
        renderer:'canvas',
    	  view: new ol.View({
    		    center: ol.proj.transform([13.23324, 52.234234], 'EPSG:4326', 'EPSG:3857'),
            zoom:16
    	     })
    });

   var newLayer = new ol.layer.Tile({source: new ol.source.OSM()});
   map.addLayer(newLayer);

  }

  render() {
    return (
        <div id="map" className="map"></div>
    );
  }

}

export default Map;
