// use ES module loadings

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";

import ImageryLayer from "@arcgis/core/layers/ImageryLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import LayerList from "@arcgis/core/widgets/LayerList";
import Legend from "@arcgis/core/widgets/Legend";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { setAssetPath } from "@esri/calcite-components/dist/components";

setAssetPath(location.href);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBXnmJ6J_sKbsJ096DB9LvQYJOyX9O1WQ",
  authDomain: "ut-dnr-geogravity-dev.firebaseapp.com",
  projectId: "ut-dnr-geogravity-dev",
  storageBucket: "ut-dnr-geogravity-dev.appspot.com",
  messagingSenderId: "269521480910",
  appId: "1:269521480910:web:164ffb77231073e5ea349f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const map = new Map({
  basemap: "streets-vector"
});

const view = new MapView({
  container: "viewDiv",
  map: map,
  zoom: 7,
  center: [-111.68, 39.33]
});

view.when(() => {
    let actionBarExpanded = false;
    document.addEventListener("calciteActionBarToggle", (event) => {
      actionBarExpanded = !actionBarExpanded;
      view.padding = {
        left: actionBarExpanded ? 135 : 45
      };
    });
  });
  
  
  document.querySelector("#header-title").textContent = "Gravity App";
  
  
  let activeWidget;
  
  const handleActionBarClick = ({ target }) => {
    console.log(target)
    if (target.tagName !== "CALCITE-ACTION") {
      return;
    }
  
    if (activeWidget) {
      document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
      document.querySelector(`[data-panel-id=${activeWidget}]`).hidden = true;
    }
  
    const nextWidget = target.dataset.actionId;
    if (nextWidget !== activeWidget) {
      document.querySelector(`[data-action-id=${nextWidget}]`).active = true;
      document.querySelector(`[data-panel-id=${nextWidget}]`).hidden = false;
      activeWidget = nextWidget;
    } else {
      activeWidget = null;
    }
  };
  
  document.querySelector("calcite-action-bar").addEventListener("click", handleActionBarClick);
  
  document.querySelector("calcite-shell").hidden = false;
  document.querySelector("calcite-loader").active = false;
  
  view.ui.move("zoom", "top-right");
  
        const basemaps = new BasemapGallery({
          view,
          container: "basemaps-container"
        });

        const layerList = new LayerList({
            view: view,
            container: "layers-container",
            listItemCreatedFunction: (event) => {
              const item = event.item;
              if (item.layer.type != "group") {
                // don't show legend twice
                item.panel = {
                  content: "legend",
                  open: true
                };
              }
            }
          });
  
        // const legend = new Legend({
        //   view,
        //   container: "legend-container"
        // });

    //forge gravity data
    var forgeGravity = new FeatureLayer({
        url: "https://webmaps.geology.utah.gov/arcgis/rest/services/Energy_Mineral/gravityapp_gravitypoints/MapServer/0",
        visible: true,
        title: "FORGE UGS CBGA",
        popupTemplate: {

            title: "<b>UGS Station {station} of Project {project}</b>",
            content: "<b>Station: </b>{station}<br><b>Location: </b>{longitude}, {latitude}, {elevation}</b><br><b>Vertical accuracy: </b>{z_rms}<br><b>Observed gravity: </b>{observation}<br><b>Date measured: </b>{date}<br><b>IZTC: </b>{iztc}<br><b>OZTC: </b>{oztc}<br><b>CBGA: </b>{cbga}"

        }
    });
    
        //legacy paces gravity data
        var pacesGravity = new FeatureLayer({
            url: "https://webmaps.geology.utah.gov/arcgis/rest/services/Energy_Mineral/gravityapp_gravitypoints/MapServer/1",
            visible: true,
            title: "PACES CBGA",
            popupTemplate: {

                title: "<b>Legacy Station {station}</b>",
                content: "<b>Station: </b>{station}<br><b>Location: </b>{longitude}, {latitude}, {elevation}<br><b>Observed gravity: </b>{observation}<br><b>IZTC: </b>{iztc}<br><b>OZTC: </b>{oztc}<br><b>CBGA: </b>{cbga}"
    
            }
        });

      //gravity imagery layer
      var gravityRaster = new ImageryLayer({
        url: "https://webmaps.geology.utah.gov/arcgis/rest/services/Energy_Mineral/gravityapp_CompleteBougerGravityAnomaly/ImageServer",
        visible: true,
        //legendEnabled: false,
        //listMode: "hide",
        title: "Gravity Raster",
        //pixelFilter: colorize,
        opacity: 0.7,
        popupTemplate: {

            title: "<b>Complete Bouger Gravity Anomaly</b>",
            content: "{Raster.ServicePixelValue.Raw}  mGal's"

        }
    });

        //symbolize gravityRaster
        function colorize(pixelData) {
            console.log("coloring");
            var pixelBlock, factor, minValue, maxValue;
    
            if (
                pixelData === null ||
                pixelData.pixelBlock === null ||
                pixelData.pixelBlock.pixels === null
            ) {
                return;
            }
    
            // The pixelBlock stores the values of all pixels visible in the view
            pixelBlock = pixelData.pixelBlock;
            console.log(pixelBlock);
    
            // Get the min and max values of the data in the current view
            minValue = pixelBlock.statistics[0].minValue;
            maxValue = pixelBlock.statistics[0].maxValue;
    
            // The pixels visible in the view
            var pixels = pixelBlock.pixels;
    
            // The number of pixels in the pixelBlock
            var numPixels = pixelBlock.width * pixelBlock.height;
    
            // Calculate the factor by which to determine the red and blue
            // values in the colorized version of the layer
            factor = 255.0 / (maxValue - minValue);
    
            // Get the pixels containing temperature values in the only band of the data
            var tempBand = pixels[0];
    
            // Create empty arrays for each of the RGB bands to set on the pixelBlock
            var rBand = [];
            var gBand = [];
            var bBand = [];
    
            // Loop through all the pixels in the view
            for (i = 0; i < numPixels; i++) {
                // Get the pixel value (the temperature) recorded at the pixel location
                var tempValue = tempBand[i];
                // Calculate the red value based on the factor
                var red = (tempValue - minValue) * factor;
    
                // Sets a color between blue (coldest) and red (warmest) in each band
                rBand[i] = red;
                gBand[i] = 0;
                bBand[i] = 255 - red;
            }
    
            // Set the new pixel values on the pixelBlock
            pixelData.pixelBlock.pixels = [rBand, gBand, bBand];
            pixelData.pixelBlock.pixelType = "U8"; // U8 is used for color
        }
  
  
  map.add(gravityRaster);
  map.add(forgeGravity);
  map.add(pacesGravity);
