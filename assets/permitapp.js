
$(document).ready(function () {

    // Adding click event listen listener to all buttons
    $("button").on("click", function () {

        // Clear Table 
        $("#table-body").empty();

        // Grabbing and storing the data-location property value from the button
        var mapLocation = $(this).attr("data-location");
        var mapRange = $(this).attr("data-range");
        var mapLat = $(this).attr("data-lat");
        var mapLon = $(this).attr("data-lon");

        // Moves the map to display over selected neighborhood
        function moveMapToNeighborhood(map) {
            map.setCenter({ lat: mapLat, lng: mapLon });
            map.setZoom(15.75);
        };
        moveMapToNeighborhood(map);


        var queryURL = "https://data.nashville.gov/resource/3wb6-xy3j.json?$where=within_circle(mapped_location," + mapLocation + mapRange + ")&permit_subtype=ONSALES&$limit=10";

        // Perfoming an AJAX GET request to queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        })

            // After the data from the AJAX request comes back
            .then(function (response) {
                console.log(queryURL);

                // Storing the data from the AJAX request in the results variable
                var results = response;
                console.log(results);

                // Create arrays for Latitudes and Longitutes and empties them if they are populated
                var latList = [];
                var longList = [];

                // Removes all previously placed markers (and circles) from map
                map.removeObjects(map.getObjects());

                // Adds neighborhood circles back to the map
                addCirclesToMap(map);

                // Looping through each result item
                for (let i = 0; i < response.length; i++) {

                    var responseAddress = JSON.parse(response[i].mapped_location.human_address); var humanAddress = $("<p>").text(responseAddress.address);

                    // Creating a paragraph tag with the result item's business name
                    var businessName = response[i].business_name;
                    var humanAddress = responseAddress.address;

                    latList.push(response[i].mapped_location.latitude);
                    longList.push(response[i].mapped_location.longitude);

                    // ----- Script for placing marker on map -----
                    // Create a marker image
                    var icon = new H.map.Icon("assets/images/beer.png");

                    // Location for marker
                    var marker = new H.map.Marker({ lat: latList[i], lng: longList[i] }, { icon: icon });

                    // Add marker on map
                    map.addObject(marker);

                    // Prependng the nameDiv to the HTML page in the "#names-appear-here" div
                    // $("#names-appear-here").append(nameDiv);
                    $("#table-data").append("<tr><td>" + businessName + "</td><td>" + humanAddress);
                };

                console.log(latList);
                console.log(longList);
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
        map.setCenter({ lat: 36.168312, lng: -86.768592 });
        map.setZoom(13);
    }

    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    // Now use the map as required...
    moveMapToNashville(map);

    function addCirclesToMap(map) {

        // Downtown
        map.addObject(new H.map.Circle(
            // The central point of the circle
            { lat: 36.161570, lng: -86.775980 },
            // The radius of the circle in meters
            500,
            {
                style: {
                    strokeColor: "rgba(55, 85, 170, 0.9)", // Color of the perimeter
                    lineWidth: 2,
                    fillColor: "rgba(55, 85, 170, 0.7)"  // Color of the circle
                }
            }
        ));

        // Five Points
        map.addObject(new H.map.Circle(
            // The central point of the circle
            { lat: 36.177495, lng: -86.751502 },
            // The radius of the circle in meters
            500,
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
            { lat: 36.151935, lng: -86.791285 },
            // The radius of the circle in meters
            500,
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

});
