// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);
  createFeatures(data.features);
});

// Add legend information
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [1,2,3,4,5],
        labels = [];

    //Create a loop o go through the density intervals and generate labels
    for (var i = 0; i < grades.length; i++)
    {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    console.log('div' + div);
  return div;
};


// Create function to set color based on earthquake magnitudels

function getColor(c)
{
  x = Math.ceil(c);
  switch (Math.ceil(x)) {
    case 1:
      return "#ffffcc";
    case 2:
      return "#c7e9b4";
    case 3:
      return "#7fcdbb";
    case 4:
      return "#41b6c4";
    case 5:
      return "#2c7fb8";
    default:
      return "#253494";
  }
}

// Create function to create circular features
function createFeatures(earthquakeData) {
  var earthquakes = L.geoJson(earthquakeData,{
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag*5,
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9})
        .bindPopup("<h3>" + "Location: " + feature.properties.place +
          "</h3><hr><p>" + "Date/Time: " + new Date (feature.properties.time) + "<br>" + 
          "Magnitude: " + feature.properties.mag + "</p>");
  }
});

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define base layer
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/amgminas/cjfltjkuh08pw2rqtyuewgdo2/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW1nbWluYXMiLCJhIjoiY2pldm96cHl2MGxiODJ2cHNoZnd0bGVvNiJ9.s1aM57KFThBXYRheftXmeA");
//GET NEW DARKMAP LAYER FROM MAPBOX
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/amgminas/cjflt8mgc09ko2sps674q7pyp/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW1nbWluYXMiLCJhIjoiY2pldm96cHl2MGxiODJ2cHNoZnd0bGVvNiJ9.s1aM57KFThBXYRheftXmeA");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map
  var myMap = L.map("map", {
    center: [40.75, -111.87],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });
    console.log(myMap);

//   Create a layer control
//   Pass in our baseMaps and overlayMaps
//   Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
   }).addTo(myMap);
  
  //Add legend to myMap
  legend.addTo(myMap);
}