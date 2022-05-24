// use ES module loadings

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
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
          view,
          selectionEnabled: true,
          container: "layers-container"
        });
  
        const legend = new Legend({
          view,
          container: "legend-container"
        });

  
  
  
  //map.add(rockcore);
