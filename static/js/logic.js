function createMap(earthquakes) {

  //Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

// Create a baseMaps object to hold the lightmap layer
var baseMaps = {
  "Light Map": lightmap
};

// Create an overlayMaps object to hold the earthquake layer
var overlayMaps = {
  "Earthquakes": earthquakes
};

// Create the map object with options
var map = L.map("map", {
  center: [33, 0],
  zoom: 3,
  layers: [lightmap, earthquakes]
});

// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(map);

}
function createMarkers(response) {

// Pull the "features" property off of response.data
var features = response.features;
// Initialize an array to hold coordinates
var coordinates = []


//color function for circles
function getColor(magnitude) {
  switch (true) {
  case magnitude > 5:
    return "#ea2c2c";
  case magnitude > 4:
    return "#ea822c";
  case magnitude > 3:
    return "#ee9c00";
  case magnitude > 2:
    return "#eecc00";
  case magnitude > 1:
    return "#d4ee00";
  default:
    return "#98ee00";
  }
}
// set radius from magnitude
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 2.5;
  }
// Loop through the features array
for (var index = 0; index < features.length; index++) {
  var feature = features[index];
 
  var styleInfo = {

    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  
}
  // For each quake, create a circle marker
  var quakeMarker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0],feature.geometry.coordinates[2]],styleInfo)
  .bindPopup("<h3>" + "Magnitude:"  + feature.properties.mag + "<h3><h3>" + "Location: " + feature.properties.place + "</h3>");


console.log(quakeMarker)
// Add the marker to the coordinates array
coordinates.push(quakeMarker);
}

// //create legend
// var legend = L.control({
//   position: "bottomright"
// });

// legend.onAdd = function() {
//   var div = L.DomUtil.create("div", "info legend");

//   var grades = [0, 1, 2, 3, 4, 5];
//   var colors = ["#2c99ea", "#2ceabf", "#92ea2c", "#d5ea2c","#eaa92c", "#ea2c2c"];


// // loop through the intervals of colors to put it in the label
//   for (var i = 0; i<grades.length; i++) {
//     div.innerHTML +=
//     "<i style='background: " + colors[i] + "'></i> " +
//     grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
//   }
//   return div;

// };

// legend.addTo(map)



createMap(L.layerGroup(coordinates));
}





// Perform an API call to the API to get quake information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(createMarkers);