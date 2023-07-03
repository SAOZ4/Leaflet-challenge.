// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" ;




// Set up geoJSON request
d3.json(queryUrl).then(function (data) {
    console.log(data);
    
    createFeatures(data.features);
});

// Function to determine marker size
function markerSize(magnitude) {
    return magnitude * 25000;
};

// Function to determine marker color by depth
function chooseColor(depth) {
    if (depth < 10) return "#20f736";
    else if (depth < 30) return "#cbfa4b";
    else if (depth < 50) return "#f7f728";
    else if (depth < 70) return "#f7c920";
    else if (depth < 90) return "#FB8C00";
    else return "#E89527";
}



function createFeatures(earthquakeData) {

    // Give each feature a popup that describes the place and time of the earthquake.
      function onEachFeature(feature, layer) {
          layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}
          </p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
      }
      // Run the onEachFeature function once for each piece of data in the array.
      var earthquakes = L.geoJSON(earthquakeData, {
          onEachFeature: onEachFeature,
  
          // Point to layer used to alter markers
          pointToLayer: function (feature, latlng) {
  
              // Determine the style of markers based on properties
              var markers = {
                  radius: markerSize(feature.properties.mag),
                  fillColor: chooseColor(feature.geometry.coordinates[2]),
                  fillOpacity: 0.5,
                  color: "black",
                  stroke: true,
                  weight: 1
              }
              return L.circle(latlng, markers);
          }
      });
  
      // Send our earthquakes layer to the createMap function/
      createMap(earthquakes);
  }
  
  function createMap(earthquakes) {

    // Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
  
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

   // Create a baseMaps object.
    var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};

// Create an overlay object to hold our overlay.
    var overlayMaps = {
    Earthquakes: earthquakes
};


// Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 4,
  layers: [street, earthquakes]
});
 
// Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create legend 
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4 style='text-align: center'>Legend by Depth (km)</h4>";
        div.innerHTML += '<i style="background: #20f736"></i><span>10 km or less</span><br>';
        div.innerHTML += '<i style="background: #cbfa4b"></i><span>30 km or less</span><br>';
        div.innerHTML += '<i style="background: #f7f728"></i><span>50 km or less</span><br>';
        div.innerHTML += '<i style="background: #f7c920"></i><span>70 km or less</span><br>';
        div.innerHTML += '<i style="background: #FB8C00"></i><span>90 km or less</span><br>';
        div.innerHTML += '<i style="background: #E89527"></i><span>More than 90 km</span><br>';
            return div;
    };

    legend.addTo(myMap);
}
   