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
        zoom:15
    	})
    });

   var newLayer = new ol.layer.Tile({source: new ol.source.OSM()});
   this.map.addLayer(newLayer);

   var vectorSource = new ol.source.Vector({
     features: this.iconFeatures
   });

   this.vectorLayer = new ol.layer.Vector({
     source: vectorSource,
     style: this.iconStyle
   });

   this.map.addLayer(this.vectorLayer);
   this.update();

   // tooltips

   this.tooltip = document.getElementById('tooltip');
   this.overlay = new ol.Overlay({
     element: this.tooltip,
     offset: [-49, -15],
     positioning: 'bottom-left'
   });

   this.map.addOverlay(this.overlay);

   this.map.on('pointermove', (evt) => {

     var pixel   = evt.pixel;
     var feature = this.map.forEachFeatureAtPixel(pixel, (feature) => {
       return feature;
     });

     this.tooltip.style.display = feature ? '' : 'none';

     if (feature) {

       this.overlay.setPosition(evt.coordinate);

       var arrDate           = feature.get('timestamp').split(/[^0-9]/);
       var dateUnixTimestamp = Date.UTC(arrDate[0],arrDate[1]-1,arrDate[2],arrDate[3],arrDate[4],arrDate[5]);

       let dateObj = new Date(dateUnixTimestamp);
       let posDate = dateObj.toLocaleDateString('de-DE');
       let posTime = dateObj.getHours() + ":" + (dateObj.getMinutes() < 10 ? "0" + dateObj.getMinutes() : dateObj.getMinutes());

       this.tooltip.innerHTML = "<span> CompanyID: " + feature.get('companyID') + "</span>" +
                                 "<span> DriverID: " + feature.get('driverID') + "</span>" +
                                 "<span> Date: " + posDate + "</span>" +
                                 "<span> Time: " + posTime + "</span>";
     }
   });
  }

  //Draw a Marker
  addMarker(dataset) {

    let iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform([dataset.longitude, dataset.latitude],
                  'EPSG:4326',
                  'EPSG:3857')),
      companyID: dataset.company_id,
      driverID: dataset.driver_id,
      timestamp: dataset.timestamp
    });

    this.iconFeatures.push(iconFeature);

    var vectorSource = new ol.source.Vector({
      features: this.iconFeatures
    });

    this.vectorLayer.setSource(vectorSource);
  }

  // update map
  update() {

    var datasets = this.props.dataManager.GetLastActiveDrivers();

    for (let i=0; i<datasets.length; i++) {

      let iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([datasets[i].longitude, datasets[i].latitude],
                    'EPSG:4326',
                    'EPSG:3857')),
        companyID: datasets[i].company_id,
        driverID: datasets[i].driver_id,
        timestamp: datasets[i].timestamp
      });

      this.iconFeatures.push(iconFeature);
    }

    var vectorSource = new ol.source.Vector({
      features: this.iconFeatures
    });

    this.vectorLayer.setSource(vectorSource);
  }

  render() {

    return (
      <div>
        <div className='title'>Active drivers in the last 24 hours</div>
        <div id="map" className="map"></div>
        <div id="tooltip"></div>
      </div>
    );
  }
}

export default Map;
