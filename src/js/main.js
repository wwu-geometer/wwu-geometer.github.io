
var map = L.map('map', {
    zoom: 13,
    center: L.latLng([53.4521, 9.4807]),
    attributionControl: true,
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft',
    },

    contextmenu: true,
    contextmenuWidth: 140,
    contextmenuItems: [{
        text: 'Show coordinates',
        callback: showCoordinates
    }, {
        text: 'Center map here',
        callback: centerMap
    }, '-', {
        text: 'Zoom in',
        icon: './src/assets/zoom-in.png',
        callback: zoomIn
    }, {
        text: 'Zoom out',
        icon: './src/assets/zoom-out.png',
        callback: zoomOut
    }]
});


map.addControl(new L.Control.LinearMeasurement({
    unitSystem: 'metric',
    color: '#FF0080',
    type: 'line'
}));

var hash = new L.Hash(map);
L.control.locate().addTo(map);
var notification = L.control
    .notifications({
        className: 'pastel',
        timeout: 5000,
        position: 'topleft',
        closable: true,
        dismissable: true,
    })
    .addTo(map);

L.Control.geocoder({ position: "topleft", showResultIcons: true }).addTo(map);

// notification.success('Success', 'Data loaded');

L.Control.betterFileLayer({
    fileSizeLimit: 60240, // File size limit in kb (10 MB))
}).addTo(map);


function showCoordinates(e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);

    const popup = L.popup()
        .setLatLng(e.latlng)
        .setContent(
            `<b>Coordinates</b><br>
             Latitude: ${lat}°<br>
             Longitude: ${lng}°`
        )
        .openOn(map);
}


function centerMap(e) {
    map.panTo(e.latlng);
}

function zoomIn(e) {
    map.zoomIn();
}

function zoomOut(e) {
    map.zoomOut();
}

L.control.scale(
    {
        imperial: false,
    }).addTo(map);


L.geoJson(germanBoundary, {
    // Add invert: true to invert the geometries in the GeoJSON file
    invert: true,
    renderer: L.svg({ padding: 1 }),
    color: 'gray', fillOpacity: 0.7, weight: 0
}).addTo(map);


map.on("bfl:layerloaded", function () { notification.success('Success', 'Data loaded successfully'); })
map.on("bfl:layerloaderror", function () { notification.alert('Error', 'Unable to load file'); })
map.on("bfl:filenotsupported", function () { notification.alert('Error', 'File type not supported'); })
map.on("bfl:layerisempty", function () { notification.warning('Error', 'No features in file'); })
map.on("bfl:filesizelimit", function () { notification.alert('Error', 'Maximun file size allowed is 50 MB'); })




osmLayer = new L.TileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',

});


googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', { //lyrs: Hybrid: s,h;Satellite: s;Streets: m;Terrain: p;
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '',
});
var layers = [];
for (var providerId in providers) {
    layers.push(providers[providerId]);
}
var ctrl = L.control.iconLayers(layers).addTo(map);

// var layerControl = L.control.layers({ "osmLayer": osmLayer }, []).addTo(map);
// layerControl.addBaseLayer(osmLayer, "osmLayer");

var baseLayers = [
    //     {
    //         group: "Base Layers",
    //         collapsed: true,
    //         icon: '<span class="fa fa-solid fa-bars"></span>',
    //         layers: [
    //             {
    //                 name: getfullName("Open Street Map", "", osmLayer.getAttribution()),
    //                 layer: osmLayer,
    //                 active: true,
    //                 zIndex: 0,
    //             },
    //             {
    //                 name: getfullName("Open Topo Map", " ", OpenTopoMap.getAttribution()),
    //                 layer: OpenTopoMap,
    //                 zIndex: 0,

    //             },
    //             {
    //                 name: getfullName("Google Hybrid", " ", googleHybrid.getAttribution()),
    //                 layer: googleHybrid,
    //                 zIndex: 0,
    //             },
    //             {
    //                 name: getfullName("Esri World Imagery", " ", Esri_WorldImagery.getAttribution()),
    //                 layer: Esri_WorldImagery,
    //                 zIndex: 0,
    //             },

    //         ],
    //     },
]


const windTurbineIcon = L.icon({
    iconUrl: './src/assets/wind-turbine.svg',
    iconSize: [30, 30],           // adjust size as needed
    iconAnchor: [15, 30],         // point of the icon which will correspond to marker's location
    popupAnchor: [0, -30]         // where the popup opens relative to the iconAnchor
});
map.createPane('topLayerPane');
map.getPane('topLayerPane').style.zIndex = 999;

var overLayers = [
    {
        name: getfullName("Target area", ''),
        active: true,
        layer: L.geoJSON(target_area, {
            style: {
                color: 'black',
                weight: 2,
                opacity: 1,
                fill: false,
                fillOpacity: 0
            },
            onEachFeature: bindFilteredPopup
        }),
    },

    {
        group: "SAEM Heli_Tx",
        collapsed: false,
        layers: [
            // -- Existing Heli_Flight_1 to Heli_Flight_4 here --

            {
                active: true,
                short_name: "Heli_Transmitter_1",
                legend: "",
                name: getfullName("Transmitter 1", ''),
                layer: L.geoJSON(Heli_transmitters, {
                    pane: 'topLayerPane',

                    filter: f => f.properties.id === 1,
                    style: {
                        className: 'heli-shadow',
                        color: '#ff0000',
                        weight: 5,
                        opacity: 1,

                    },
                    onEachFeature: bindFilteredPopup
                })
            },
            {
                active: true,
                short_name: "Heli_Transmitter_2",
                legend: "",
                name: getfullName("Transmitter 2", ''),
                layer: L.geoJSON(Heli_transmitters, {
                    pane: 'topLayerPane',
                    filter: f => f.properties.id === 2,
                    style: {
                        className: 'heli-shadow',
                        color: '#00cc00',
                        weight: 4,
                        opacity: 1
                    },
                    onEachFeature: bindFilteredPopup
                })
            },
            {
                active: true,
                short_name: "Heli_Transmitter_3",
                legend: "",
                name: getfullName("Transmitter 3", ''),
                layer: L.geoJSON(Heli_transmitters, {
                    pane: 'topLayerPane',

                    filter: f => f.properties.id === 3,
                    style: {
                        className: 'heli-shadow',
                        color: '#0066ff',
                        weight: 4,
                        opacity: 1
                    },
                    onEachFeature: bindFilteredPopup
                })
            },
            {
                active: true,
                short_name: "Heli_Transmitter_4",
                legend: "",
                name: getfullName("Transmitter 4", ''),
                layer: L.geoJSON(Heli_transmitters, {
                    pane: 'topLayerPane',

                    filter: f => f.properties.id === 4,
                    style: {
                        className: 'heli-shadow',
                        color: '#ff9900',
                        weight: 4,
                        opacity: 1
                    },
                    onEachFeature: bindFilteredPopup
                })
            }
        ]
    }
    ,
    {
        group: "SAEM Heli_flights",
        collapsed: false,
        layers: [
            {
                active: true,
                short_name: "Flight 1",
                legend: "",
                name: getfullName("Flight_1", ''),
                layer: L.geoJSON(Heli_Flights, {
                    filter: f => f.properties.id === 1,
                    style: {
                        color: 'black',
                        weight: 1.5,
                        fillColor: '#ff0000',
                        fillOpacity: 0.2
                    },
                    onEachFeature: bindFilteredPopup
                })
            },
            {
                active: true,
                short_name: "Flight_2",
                legend: "",
                name: getfullName("Flight_2", ''),
                layer: L.geoJSON(Heli_Flights, {
                    filter: f => f.properties.id === 2,
                    style: {
                        color: 'black',
                        weight: 1.5,
                        fillColor: '#00cc00',
                        fillOpacity: 0.2
                    },
                    onEachFeature: bindFilteredPopup
                })
            },
            {
                active: true,
                short_name: "Flight_3",
                legend: "",
                name: getfullName("Flight_3", ''),
                layer: L.geoJSON(Heli_Flights, {
                    filter: f => f.properties.id === 3,
                    style: {
                        color: 'black',
                        weight: 1.5,
                        fillColor: '#0066ff',
                        fillOpacity: 0.2
                    },
                    onEachFeature: bindFilteredPopup
                })
            },

        ]
    }
    ,

    // {
    //     group: "SAEM Drone_flights",
    //     collapsed: true,
    //     layers: [
    //         {
    //             active: false,
    //             short_name: "Flight 1",
    //             legend: "",
    //             name: getfullName("Flight_1", ''),
    //             layer: L.geoJSON(Drone_Flights, {
    //                 filter: f => f.properties.id === 1,
    //                 style: {
    //                     color: 'black',
    //                     weight: 1.5,
    //                     fillColor: '#ff0000',
    //                     fillOpacity: 0.4
    //                 },
    //                 onEachFeature: bindFilteredPopup
    //             })
    //         },
    //         {
    //             active: false,
    //             short_name: "Flight_2",
    //             legend: "",
    //             name: getfullName("Flight_2", ''),
    //             layer: L.geoJSON(Drone_Flights, {
    //                 filter: f => f.properties.id === 2,
    //                 style: {
    //                     color: 'black',
    //                     weight: 1.5,
    //                     fillColor: '#00cc00',
    //                     fillOpacity: 0.4
    //                 },
    //                 onEachFeature: bindFilteredPopup
    //             })
    //         },
    //         {
    //             active: false,
    //             short_name: "Flight_3",
    //             legend: "",
    //             name: getfullName("Flight_3", ''),
    //             layer: L.geoJSON(Drone_Flights, {
    //                 filter: f => f.properties.id === 3,
    //                 style: {
    //                     color: 'black',
    //                     weight: 1.5,
    //                     fillColor: '#0066ff',
    //                     fillOpacity: 0.4
    //                 },
    //                 onEachFeature: bindFilteredPopup
    //             })
    //         },
    //         {
    //             active: false,
    //             short_name: "Flight_4",
    //             legend: "",
    //             name: getfullName("Flight_4", ''),
    //             layer: L.geoJSON(Drone_Flights, {
    //                 filter: f => f.properties.id === 4,
    //                 style: {
    //                     color: 'black',
    //                     weight: 1.5,
    //                     fillColor: '#ff9900',
    //                     fillOpacity: 0.4
    //                 },
    //                 onEachFeature: bindFilteredPopup
    //             })
    //         },
    //         {
    //             active: false,
    //             short_name: "Flight_5",
    //             legend: "",
    //             name: getfullName("Flight_5", ''),
    //             layer: L.geoJSON(Drone_Flights, {
    //                 filter: f => f.properties.id === 5,
    //                 style: {
    //                     color: 'black',
    //                     weight: 1.5,
    //                     fillColor: '#4ED1A3',
    //                     fillOpacity: 0.4
    //                 },
    //                 onEachFeature: bindFilteredPopup
    //             })
    //         }
    //     ]
    // }

    ,

    {
        group: 'Seismic',
        collapsed: true,
        layers: [
            {
                active: false,
                short_name: "DOW_Seismic",
                legend: "",
                name: getfullName("DOW_Seismic", ''),
                layer: L.geoJSON(Dow_Seismic, {
                    style: {
                        color: '#000000',  // stroke color (black or any)
                        weight: 2,
                        opacity: 1,
                        fill: false,        // disable fill
                        fillOpacity: 0      // just in case
                    }
                    // onEachFeature: bindFilteredPopup, // optional
                }),

            }, {
                active: false,
                short_name: "LIAG_Seismic_2D",
                legend: "",
                name: getfullName("LIAG_Seismic_2D", ''),
                layer: L.geoJSON(LIAG_Seismic_2D, {
                    style: {
                        color: 'black',
                        weight: 2,
                        opacity: 1,
                        fill: false,
                        fillOpacity: 0
                    },
                    onEachFeature: bindFilteredPopup
                }),
            },
            {
                active: false,
                short_name: "LIAG_Seismic_3D",
                legend: "",
                name: getfullName("LIAG_Seismic_3D", ''),
                layer: L.geoJSON(LIAG_Seismic_3D, {
                    style: {
                        color: 'black',
                        weight: 2,
                        opacity: 1,
                        fill: false,
                        fillOpacity: 0
                    },
                    onEachFeature: bindFilteredPopup
                }),
            },

        ]
    },
    {
        group: "Infrastructure",
        collapsed: true,
        layers: [
            {
                active: false,
                short_name: "Powerline_380kV",
                legend: "",
                name: getfullName("Powerline_380kv", ''),
                layer: L.geoJSON(Powerline_380kv, {
                    onEachFeature: bindFilteredPopup,
                    color: 'red',
                    weight: 2,
                }),
            },
            {
                active: false,
                short_name: "Powerline_110kV",
                legend: "",
                name: getfullName("Powerline_110kv", ''),
                layer: L.geoJSON(Powerline_110kv, {
                    onEachFeature: bindFilteredPopup,
                    color: 'blue',
                    weight: 1,
                }),
            },
            {
                active: false,
                short_name: "RailwayLines",
                legend: "",
                name: getfullName("RailwayLines", ''),
                layer: L.geoJSON(RailwayLines, {
                    onEachFeature: bindFilteredPopup,
                    color: '#408080',
                    weight: 4,                  // slightly thicker for visibility

                }),
            },
            {
                active: false,
                short_name: "pipeline_gas",
                legend: "",
                name: getfullName("pipeline_gas", ''),
                layer: L.geoJSON(pipeline_gas, {
                    onEachFeature: bindFilteredPopup,
                    style: {
                        color: '#ff8040',
                        weight: 3,
                        dashArray: '6,4',
                        opacity: 0.9
                    }
                }),
            },
            {
                active: false,
                short_name: "pipeline_chemicals",
                legend: "",
                name: getfullName("pipeline_chemicals", ''),
                layer: L.geoJSON(pipeline_chemicals, {
                    onEachFeature: bindFilteredPopup,
                    style: {
                        color: '#9900cc', // purple-ish
                        weight: 3,
                        dashArray: '6,4',
                        opacity: 0.9
                    }
                }),
            },
            {
                active: false,
                short_name: "pipeline_oil",
                legend: "",
                name: getfullName("pipeline_oil", ''),
                layer: L.geoJSON(pipeline_oil, {
                    onEachFeature: bindFilteredPopup,
                    style: {
                        color: '#cc0000', // red-ish
                        weight: 3,
                        dashArray: '6,4',
                        opacity: 0.9
                    }
                }),
            }
            ,
            {
                active: true,
                short_name: "wind_turbines",
                legend: "",
                name: getfullName("wind_turbines", ''),
                layer: L.geoJSON(wind_turbines, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { icon: windTurbineIcon });
                    },
                    onEachFeature: bindFilteredPopup
                }),
            }

        ]
    },
    {
        group: 'Geology',
        collapsed: true,
        layers: [{
            short_name: "Geology",
            legend: '',
            active: false,
            name: getfullName("Geology", ''),
            layer: {
                type: "tileLayer.wms",
                args: ["https://nibis.lbeg.de/cardomap3/public/ogc.ashx?NodeId=64&Service=WFS&Request=GetCapabilities&", {
                    layers: 'L23',
                    format: 'image/png',
                    transparent: true,
                    zIndex: 1,
                }],
            }
        }]
    },
    {
        group: 'Boreholes',
        collapsed: true,
        layers: [{
            short_name: "Boreholes",
            legend: '',
            active: false,
            name: getfullName("Boreholes", 'https://nibis.lbeg.de/cardomap3/public/ogc.ashx?NODEID=145&Service=WMS&cardo3SessionGuid=C3_4e8c5ccb-8b48-4ed5-9466-791472ac7a8f&Request=GetLegendGraphic&Version=1.3.0&Layer=L104:1&'),
            layer: {
                type: "tileLayer.wms",
                args: ["https://nibis.lbeg.de/cardomap3/public/ogc.ashx?NodeId=145&Service=WMS&Request=GetCapabilities&", {
                    layers: 'L104:1',
                    format: 'image/png',
                    transparent: true,
                    attribution: "© LBEG",
                    zIndex: 1,
                }],
            }
        }]
    },
    {
        group: 'Protected areas',
        collapsed: true,
        layers: [
            {
                active: false,
                short_name: "Naturschutzgebiete",
                legend: "",
                name: getfullName("Naturschutzgebiete", ''),
                layer: L.geoJSON(Naturschutzgebiete, {
                    onEachFeature: bindFilteredPopup,
                    color: 'red',
                    weight: 0.7,
                    fillOpacity: 0.4
                }),
            },
            {
                active: false,
                short_name: "Landschaftsschutzgebiete",
                legend: "",
                name: getfullName("Landschaftsschutzgebiete", ''),
                layer: L.geoJSON(Landschaftsschutzgebiete, {
                    onEachFeature: bindFilteredPopup,
                    color: '#408080',
                    weight: 0.7,
                    opacity: 1,
                    fillOpacity: 0.4
                }),
            },
            {
                active: false,
                short_name: "Naturdenkmale",
                legend: "",
                name: getfullName("Naturdenkmale", '', 'Source:OSM'),
                layer: L.geoJSON(Naturdenkmale, {
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, {
                            radius: 6,
                            color: "#000",
                            fillColor: "#00cc00",
                            fillOpacity: 0.7,
                            weight: 1
                        });
                    },
                    onEachFeature: bindFilteredPopup
                }),
            }
        ]
    }
];


var panelLayersBase = new L.Control.PanelLayers(baseLayers, null, {
    // selectorGroup: true,
    collapsibleGroups: true,
    compact: true,
    position: 'bottomright',
    compact: true,
    autoZIndex: false,

}).addTo(map);

var panelLayers = new L.Control.PanelLayers(null, overLayers, {
    selectorGroup: true,
    collapsibleGroups: true,
    compact: true,
    // title: 'All layers',
    //collapsed: true,
    // title: "Layers",
    position: 'topright',
}).addTo(map);


// map.addControl(panelLayers);



function bindFilteredPopup(feature, layer) {
    if (feature.properties) {
        let filteredProps = Object.entries(feature.properties)
            .filter(([_, value]) => value !== null && value !== undefined && value !== '')
            .map(([key, value]) => `<strong>${key}</strong>: ${value}`)
            .join("<br>");

        if (filteredProps) {
            layer.bindPopup(filteredProps);
        }
    }
}

document.querySelectorAll('.leaflet-panel-layers-item label').forEach(label => {
    label.addEventListener('click', function (e) {
        const checkbox = this.querySelector('input[type="checkbox"]');

        // Prevent double toggle if clicking the checkbox directly
        if (checkbox && e.target !== checkbox) {
            checkbox.click(); // use .click() instead of changing checked state
        }
    });
});

// swipeMenuInnerHTML = '<select class="form-select" multiple  size="5"  aria-label="form-select" id="LeftLayerSelector"></select><div><button type="button" class="btn btn-success" id="confirm">Add swipe</button>   <button type="button" class="btn btn-secondary" id="closeSide">Remove all</button></div>'


// L.control.slideMenu(swipeMenuInnerHTML, { position: bottomright, menuposition: bottomright }).addTo(map);

// L.control.slideMenu(swipeMenuInnerHTML, { position: bottomright }).addTo(map);

// // var slideMenu = L.control.slideMenu("", {

// //     width: "25%",
// //     height: "100%",
// //     delay: 10,
// //     icon: "fa fa-solid fa-bars",
// // })
// //     .addTo(map);

// // slideMenu.setContents(swipeMenuInnerHTML);

// // document.getElementById("confirm").addEventListener("click", addSideBySide);
// // document.getElementById("closeSide").addEventListener("click", removeSideBySide);
// // document.getElementById("ZoomTo").addEventListener("click", ZoomToLayer);

// var isSideBySideOn = null

// function addSideBySide() {
//     if (isSideBySideOn == null) {
//         isSideBySideOn = L.control.sideBySide([], [], { thumbSize: 25, padding: 70 }).addTo(map);
//         isSideBySideOn.setLeftLayers(overLayers[2].layers[0].layer)
//         // isSideBySideOn.setLeftLayers(overLayers[2].layers[0].layer)
//         // isSideBySideOn.setRightLayers(osmLayer)

//     }
// }

// function removeSideBySide() {
//     if (isSideBySideOn) {
//         isSideBySideOn.remove()
//         isSideBySideOn = null
//     }
// }


// function ZoomToLayer(name) {

//     console.log(name)
//     for (let i = 0; i < overLayers.length; i++) {
//         for (let L = 0; L < overLayers[i].layers.length; L++) {
//             if (overLayers[i].layers[L].short_name == name) {
//                 overLayers[i].layers[L].layer.addTo(map);                   // make sure layer is active
//                 map.fitBounds(overLayers[i].layers[L].layer.getBounds()) // zoom to layer
//                 break
//             }
//         }
//     }
// }

// var layersList = []
// updateLayersList()

// swipeButton = document.getElementById('swipeMenu');
// swipeButton.onclick = updateLayersListInSwipePanel()


var browserControl = L.control.browserPrint({ position: 'topleft', title: 'Print Map' }).addTo(map);




// function updateLayersList() {

//     for (let i = 0; i < overLayers.length; i++) {
//         for (let L = 0; L < overLayers[i].layers.length; L++) {
//             layersList.push(overLayers[i].layers[L].short_name)
//         }
//     }
//     console.log('Updated')
// }

// function updateLayersListInSwipePanel() {
//     let leftPanel = document.getElementById("LeftLayerSelector");
//     for (let i = 0; i < layersList.length; i++) {
//         let option = document.createElement('option');
//         option.text = layersList[i];
//         leftPanel.appendChild(option)

//     }

// }



function getfullName(short_name, legend, attribution) {

    let container = L.DomUtil.create('div');
    let details = L.DomUtil.create('details', '', container);
    let summary = L.DomUtil.create('summary', '', details);

    // Summary styling
    let div = L.DomUtil.create('div', '', summary);
    div.setAttribute('id', short_name);
    summary.innerHTML += short_name;

    // Legend Image (if available)
    if (legend) {
        summary.innerHTML += ` ${short_name} &#x25B6;`; // ▶ black right-pointing triangle

        let legendHolder = L.DomUtil.create("img", "", details);
        legendHolder.setAttribute('src', legend);
        legendHolder.setAttribute('alt', 'Legend');
        legendHolder.setAttribute('style', 'margin-top: 4px; max-height: 500px; display: block;');
    }



    // let infoIcon = L.DomUtil.create("img", "layer-info-img", details);
    // infoIcon.alt = "\u{1F6C8}";
    // infoIcon.title = "Attribution";
    // // infoIcon.setAttribute("data-target", "#exampleModalCenter")
    // // infoIcon.setAttribute('onclick', "alert('" + short_name + "')");
    // infoIcon.setAttribute('onclick', "ShowAttribution('" + short_name + "," + attribution + "')");


    // let legendHolder = L.DomUtil.create("img", "", details);
    // legendHolder.setAttribute('src', legend);

    // let ZoomToBtn = L.DomUtil.create("button", "Zoombtn", details);
    // ZoomToBtn.setAttribute('type', "button");
    // let ZoomToBtnIcon = L.DomUtil.create("img", "", ZoomToBtn);
    // ZoomToBtnIcon.setAttribute('src', "./src/assets/magnifying-glass-location-solid.svg");
    // ZoomToBtnIcon.setAttribute('title', "zoom to layer");
    // // ZoomToBtn.innerText += 'onclick=ZoomToLayer("Geology")'
    // ZoomToBtn.setAttribute('onclick', "ZoomToLayer('" + short_name + "')");

    return container.innerHTML
}


function ShowAttribution(short_name, attribution) {

    let modalTitle = document.getElementById("myModalTitle")
    modalTitle.innerHTML = short_name

    let modalBody = document.getElementById("myModalBody")
    modalBody.innerHTML = attribution

    // let modalContainer = document.getElementById(myModal)
    // modalBody.modal('toggle');

    $('#myModal').modal('show')


    console.log(short_name)
    console.log(attribution)
    // let modal = L.DomUtil.create("div")

    // modal.innerHTML =
    // '<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">  <div class="modal-dialog modal-dialog-centered" role="document">    <div class="modal-content">      <div class="modal-header">        <h5 class="modal-title" id="exampleModalLongTitle"></h5>        <button type="button" class="close" data-dismiss="modal" aria-label="Close">          <span aria-hidden="true">&times;</span>        </button>      </div>      <div class="modal-body"> </div>      <div class="modal-footer">        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>      </div>    </div>  </div></div>'

    // return modal
}