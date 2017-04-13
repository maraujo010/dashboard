import React, { Component } from 'react';
import ol from 'openlayers';
import 'openlayers/css/ol.css';
import icon from './icon.png'

class Map extends Component {

  componentDidMount() {

    this.iconFeatures = [];

    this.iconStyle = new ol.style.Style({
      image: new ol.style.Icon(({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.75,
        src: icon
      }))
    });

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
   this.AddAllMarkers();

   this.tooltip = document.getElementById('tooltip');
   this.overlay = new ol.Overlay({
     element: this.tooltip,
     offset: [10, 0],
     positioning: 'bottom-left'
   });

   this.map.addOverlay(this.overlay);
   this.map.on('pointermove', this.displayTooltip);

  }

  displayTooltip(evt) {

    var pixel   = evt.pixel;

    try {
      
      var feature = this.map.forEachFeatureAtPixel(pixel, function(feature) {
        return feature;
      });

      this.tooltip.style.display = feature ? '' : 'none';
  console.log(feature);
      if (feature) {

        this.overlay.setPosition(evt.coordinate);
        this.tooltip.innerHTML = feature.get('name');
      }
    }
    catch(err) {
    console.log("a");
    }
  }

  //Draw a Marker
  AddMarker(dataset) {

    let iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform([dataset.longitude, dataset.latitude], 'EPSG:4326',
      'EPSG:3857')),
    });

    this.iconFeatures.push(iconFeature);

    var vectorSource = new ol.source.Vector({
      features: this.iconFeatures
    });

    this.vectorLayer.setSource(vectorSource);
  }

  // Add markers
  AddAllMarkers() {

    var datasets = this.props.dataManager.GetLastActiveDrivers();

    for (let i=0; i<datasets.length; i++) {

      let iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([datasets[i].longitude, datasets[i].latitude], 'EPSG:4326',
        'EPSG:3857')),
      });

      this.iconFeatures.push(iconFeature);
    }

    var vectorSource = new ol.source.Vector({
      features: this.iconFeatures
    });

    this.vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: this.iconStyle
    });

    this.map.addLayer(this.vectorLayer);
  }

  render() {

    return (
      <div className="App-map-area">
        <div className='title'>Active drivers in the last 24 hours</div>
        <div id="map" className="map"></div>
        <div id="tooltip"></div>
      </div>
    );
  }
}

export default Map;
