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
var map = new H.Map(document.getElementById('map'),
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
                strokeColor: 'rgba(55, 85, 170, 0.9)', // Color of the perimeter
                lineWidth: 2,
                fillColor: 'rgba(55, 85, 170, 0.7)'  // Color of the circle
            }
        }
    ));

    // Five Points
    map.addObject(new H.map.Circle(
        // The central point of the circle
        { lat: 36.177495, lng: -86.751502 },
        // The radius of the circle in meters
        300,
        {
            style: {
                strokeColor: 'rgba(0, 128, 0, 0.9)', // Color of the perimeter
                lineWidth: 2,
                fillColor: 'rgba(0, 128, 0, 0.7)'  // Color of the circle
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
                strokeColor: 'rgba(255, 0, 0, 0.9)', // Color of the perimeter
                lineWidth: 2,
                fillColor: 'rgba(255, 0, 0, 0.7)'  // Color of the circle
            }
        }
    ));
}
addCirclesToMap(map);

// ----- Script for placing marker on map -----
// Create a marker image
var icon = new H.map.Icon("assets/beer.png");

// Location for marker
var marker = new H.map.Marker({ lng: -86.74898, lat: 36.1778 }, { icon: icon });

// Add marker on map
map.addObject(marker);


// Obtain routing service and create routing request parameters
var router = platform.getRoutingService(),
    routeRequestParams = {
        mode: 'fastest;car',
        representation: 'display',
        legattributes: 'li',
        waypoint0: '36.177290,-86.750091',
        waypoint1: '36.177706,-86.751932',
    };

// calculate route
router.calculateRoute(
    routeRequestParams,
    function (response) {
        var lineString = new H.geo.LineString(),
            route = response.response.route[0],
            routeShape = route.shape,
            polyline,
            linkids = [];

        // collect link ids for the later matching with the PDE data
        route.leg.forEach(function (leg) {
            leg.link.forEach(function (link) {
                linkids.push(link.linkId.substring(1));
            });
        })

        // create route poly;line
        routeShape.forEach(function (point) {
            var parts = point.split(',');
            lineString.pushLatLngAlt(parts[0], parts[1]);
        });
        polyline = new H.map.Polyline(lineString, {
            style: {
                lineWidth: 8,
                strokeColor: 'rgba(0, 128, 255, 0.7)'
            },
            arrows: new mapsjs.map.ArrowStyle()
        });

        map.addObject(polyline);
        map.setViewBounds(polyline.getBounds(), true);

       // findStations(linkids, polyline)
    },
    function () {
        alert('Routing request error');
    }
);
