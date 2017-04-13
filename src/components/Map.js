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
            zoom:14
    	     })
    });

   var newLayer = new ol.layer.Tile({source: new ol.source.OSM()});

   this.map.addLayer(newLayer);
   this.AddMarkers();
  }

  //Draw a Marker
  DrawMarker(lon, lat, driverID) {

    let iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326',
      'EPSG:3857'))
    });

    let vectorSource = new ol.source.Vector({
      features: [ iconFeature ]
    });

    let iconStyle = [
      new ol.style.Style({
        image: new ol.style.Icon(({
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
          offsetY: -20,
          fill: new ol.style.Fill({
            color: '#000000'
          })
        })
      })
    ];

    let vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: iconStyle
    });

    this.map.addLayer(vectorLayer);
  }

  // Add stored markers to the map. Each marker represents a drivers position
  AddMarkers() {

    let datasets = this.props.dataManager.GetLastActiveDrivers();

    for (var i=0; i<datasets.length; i++) {

      let lon       = datasets[i].longitude;
      let lat       = datasets[i].latitude;
      let driverID  = datasets[i].driver_id;

      this.DrawMarker(lon, lat, driverID);
    }
  }

  render() {

    return (
      <div className="App-map-area">
              <div className='title'>Active drivers in the last 24 hours</div>
        <div id="map" className="map"></div>
      </div>
    );
  }
}

export default Map;
