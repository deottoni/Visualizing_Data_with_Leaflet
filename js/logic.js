// Function to run once for each feature in the features array
function createFeatures(eqData) {

    // Give each feature a popup describing the place, time, and magnitude of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><h4>" + new Date(feature.properties.time) + 
        "</h4><hr><h4> Magnitude: " + feature.properties.mag + "</h4>");
    }
       
    // let mag;
    // function onEachFeature(feature, layer) {
    //     let mag = feature.properties.mag
    
    //     let markerCircle = {
    //         radius: feature.properties.mag,
    //         fillColor: "#ff7800",
    //         color: "#000",
    //         weight: 1,
    //         opacity: 1,
    //         fillOpacity: 0.8
    //     };
    // }
    

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    const earthquakes = L.geoJSON(eqData, {
        onEachFeature: onEachFeature
        // pointToLayer: function (feature, latlng) {
        //     return L.circleMarker(latlng, markerCircle);
        // }
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.streets",
            accessToken: API_KEY
    });

    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.dark",
            accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    const baseMaps = {
            "Street Map": streetmap,
            "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    const overlayMaps = {
            Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    const myMap = L.map("map-id", {
            center: [37.09, -95.71],
            zoom: 3,
            layers: [streetmap, earthquakes]
    });


    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
    }).addTo(myMap);
}




// Perform an API call to the earthquakes API to get information. Call createMarkers when complete

(async function(){
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
    const response = await d3.json(url)
    createFeatures(response.features)
})()
