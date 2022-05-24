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


const map = new Map({
  basemap: "streets-vector"
});

const view = new MapView({
  container: "viewDiv",
  map: map,
  zoom: 7,
  center: [-111.68, 39.33]
});