import React, { Component } from 'react';
import 'openlayers/css/ol.css';
import icon from './icon.png'

var ol = require('openlayers');

class Map extends Component {

  componentDidMount() {

    this.map = new ol.Map({
        target:'map',
        renderer:'canvas',
    	  view: new ol.View({
    		    center: ol.proj.transform([13.23324, 52.234234], 'EPSG:4326', 'EPSG:3857'),
            zoom:13
    	     })
    });

   var newLayer = new ol.layer.Tile({source: new ol.source.OSM()});

   this.map.addLayer(newLayer);

   this.AddMarkers();

  }

  // Add markers to the map. Each marker represents a drivers position
  AddMarkers() {

    for (var i=0; i<this.props.dataManagerHelper.datasets.length; i++) {

      var lat       = this.props.dataManagerHelper.datasets[i].latitude;
      var lon       = this.props.dataManagerHelper.datasets[i].longitude;
      var driverID  = this.props.dataManagerHelper.datasets[i].driver_id;

      var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326',
        'EPSG:3857'))
      });

      var vectorSource = new ol.source.Vector({
        features: [ iconFeature ]
      });

      var iconStyle = [
        new ol.style.Style({
          image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.95,
            src: icon
          }))
        }),
        new ol.style.Style({
          text: new ol.style.Text({
            text: "id:"+driverID,
            offsetY: -26,
            fill: new ol.style.Fill({
              color: '#000000'
            })
          })
        })
      ];

      var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: iconStyle
      });

      this.map.addLayer(vectorLayer);

    }

  }

  render() {

    return (
        <div id="map" className="map"></div>
    );
  }

}

export default Map;
