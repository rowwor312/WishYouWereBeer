// Adding click event listen listener to all buttons
$("button").on("click", function () {
    // Grabbing and storing the data-location property value from the button
    var mapLocation = $(this).attr("data-location");

    var queryURL = "https://data.nashville.gov/resource/3wb6-xy3j.json?$where=within_circle(mapped_location," + mapLocation + ")&permit_subtype=ONSALES&$limit=10";

    // Perfoming an AJAX GET request to queryURL
    $.ajax({
        url: queryURL,
        method: "GET"
    })

        // After the data from the AJAX request comes back
        .then(function (response) {
            console.log(queryURL);

            // Storing the data from the AJAX request in the results variable
            var coordList = [];


            // Looping through each result item
            for (let i = 0; i < response.length; i++) {

                // Creating and storing a div tag
                var nameDiv = $("<div>");

                //         // Creating a paragraph tag with the result item"s business name
                var businessName = $("<p>").text("Business Name: " + response[i].business_name);
                var humanAddress = $("<p>").text(response[i].mapped_location.human_address);
                var plat = $("<p>").text("Latitude: " + response[i].mapped_location.latitude);
                var plong = $("<p>").text("Longitude: " + response[i].mapped_location.longitude);

                coordList.push([response[i].mapped_location.latitude, response[i].mapped_location.longitude]);


                // debugger;

                // Appending the paragraph and image tag to the nameDiv
                nameDiv.append(businessName);
                nameDiv.append(humanAddress);
                nameDiv.append(plat);
                nameDiv.append(plong);

                // nameDiv.append(pAddress);

                // Prependng the nameDiv to the HTML page in the "#names-appear-here" div
                // $("#names-appear-here").append(nameDiv);
                $("#table-data").append(nameDiv)


            }

            console.log(coordList);

            //     // Obtain routing service and create routing request parameters
            //     var router = platform.getRoutingService(),
            //         routeRequestParams = {
            //             mode: "fastest;pedestrian",
            //             representation: "display",
            //             legattributes: "li",
            //             waypoint0: coordList[0],
            //             waypoint1: "",
            //             waypoint2: "",
            //             waypoint3: "",
            //             waypoint4: "",
            //             waypoint5: "",
            //             waypoint6: "",
            //             waypoint7: "",
            //             waypoint8: "",
            //             waypoint9: "",
            //         };

            //     console.log(routeRequestParams.waypoint0);

            //     // calculate route
            //     router.calculateRoute(
            //         routeRequestParams,
            //         function (response) {
            //             var lineString = new H.geo.LineString(),
            //                 route = response.response.route[0],
            //                 routeShape = route.shape,
            //                 polyline,
            //                 linkids = [];

            //             // collect link ids for the later matching with the PDE data
            //             route.leg.forEach(function (leg) {
            //                 leg.link.forEach(function (link) {
            //                     linkids.push(link.linkId.substring(1));
            //                 });
            //             })

            //             // create route poly;line
            //             routeShape.forEach(function (point) {
            //                 var parts = point.split(",");
            //                 lineString.pushLatLngAlt(parts[0], parts[1]);
            //             });
            //             polyline = new H.map.Polyline(lineString, {
            //                 style: {
            //                     lineWidth: 8,
            //                     strokeColor: "rgba(0, 128, 255, 0.7)"
            //                 },
            //                 arrows: new mapsjs.map.ArrowStyle()
            //             });

            //             map.addObject(polyline);
            //             map.setViewBounds(polyline.getBounds(), true);

            //             // findStations(linkids, polyline)
            //         },
            //         function () {
            //             alert("Routing request error");
            //         }
            //     );

        });

});

// ----- INITIALIZE MAP -----

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
    "app_id": "k3EFdG3OsNPMzswnSPnJ",
    "app_code": "649NiziJD5JZ3hGvJqbQMg",
    useHTTPS: true
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
    tileSize: pixelRatio === 1 ? 256 : 512,
    ppi: pixelRatio === 1 ? undefined : 320
});

//Step 2: initialize a map
var map = new H.Map(document.getElementById("map"),
    defaultLayers.normal.map, { pixelRatio: pixelRatio });

// Moves the map to display over Nashville
function moveMapToNashville(map) {
    map.setCenter({ lng: -86.7876, lat: 36.1565 });
    map.setZoom(13.5);
}

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Now use the map as required...
moveMapToNashville(map);

// ----- Adds circles based on neightborhood locations to the map -----
function addCirclesToMap(map) {

    // Downtown
    map.addObject(new H.map.Circle(
        // The central point of the circle
        { lat: 36.161570, lng: -86.775980 },
        // The radius of the circle in meters
        300,
        {
            style: {
                strokeColor: "rgba(55, 85, 170, 0.9)", // Color of the perimeter
                lineWidth: 2,
                fillColor: "rgba(55, 85, 170, 0.7)"  // Color of the circle
            }
        }
    ));

    // East
    map.addObject(new H.map.Circle(
        // The central point of the circle
        { lat: 36.177495, lng: -86.751502 },
        // The radius of the circle in meters
        300,
        {
            style: {
                strokeColor: "rgba(0, 128, 0, 0.9)", // Color of the perimeter
                lineWidth: 2,
                fillColor: "rgba(0, 128, 0, 0.7)"  // Color of the circle
            }
        }
    ));

    // Midtown
    map.addObject(new H.map.Circle(
        // The central point of the circle
        { lat: 36.150333, lng: -86.795989 },
        // The radius of the circle in meters
        300,
        {
            style: {
                strokeColor: "rgba(255, 0, 0, 0.9)", // Color of the perimeter
                lineWidth: 2,
                fillColor: "rgba(255, 0, 0, 0.7)"  // Color of the circle
            }
        }
    ));
}
addCirclesToMap(map);

// ----- Script for placing marker on map -----
// Create a marker image
var icon = new H.map.Icon("assets/images/beer.png");

// Location for marker
var marker = new H.map.Marker({ lng: -86.74898, lat: 36.1778 }, { icon: icon });

// Add marker on map
map.addObject(marker);

