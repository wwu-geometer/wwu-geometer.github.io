var map = L.map('map', {
    zoom: 10,
    center: L.latLng([48.0122, 9.2894]),
    attributionControl: false,
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft',
    },
    // contextmenu: true,
    // contextmenuWidth: 140,
    // contextmenuItems: [{
    //     text: 'Show coordinates',
    //     callback: showCoordinates
    // }, {
    //     text: 'Center map here',
    //     callback: centerMap
    // }, '-', {
    //     text: 'Zoom in',
    //     icon: 'images/zoom-in.png',
    //     callback: zoomIn
    // }, {
    //     text: 'Zoom out',
    //     icon: 'images/zoom-out.png',
    //     callback: zoomOut
    // }]
});

var hash = new L.Hash(map);

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
    fileSizeLimit: 10240, // File size limit in kb (10 MB))
}).addTo(map);


// function showCoordinates(e) {
//     var popup = L.popup()
//         .setLatLng(latlng)
//         .setContent('<p>Hello world!<br />This is a nice popup.</p>')
//         .openOn(map);
//     // alert(e.latlng);
// }

// function centerMap(e) {
//     map.panTo(e.latlng);
// }

// function zoomIn(e) {
//     map.zoomIn();
// }

// function zoomOut(e) {
//     map.zoomOut();
// }

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
map.on("bfl:filesizelimit", function () { notification.alert('Error', 'Maximun file size allowed is 10 MB'); })




osmLayer = new L.TileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
    maxZoom: 18,
});

OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',);

Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',);


googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// var layerControl = L.control.layers({ "osmLayer": osmLayer }, []).addTo(map);
// layerControl.addBaseLayer(osmLayer, "osmLayer");

var baseLayers = [
    {
        group: "Base Layers",
        collapsed: true,
        icon: '<span class="fa fa-solid fa-bars"></span>',
        layers: [
            {
                name: "Open Street Map",
                layer: osmLayer,
                active: true,
            },
            {
                name: "Open Topo Map",
                layer: OpenTopoMap
            },
            {
                name: "Esri World Imagery",
                layer: Esri_WorldImagery
            },
            {
                name: "Google Hybrid",
                layer: googleHybrid
            },
        ],
    },
]

var overLayers = [
    {
        group: "Road Layers",
        collapsed: true,
        layers: [
            {
                name: "Open Cycle Map",
                short_name: "Open Cycle Map",
                layer: L.tileLayer('https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png')
            },
            {
                name: "Transports",
                layer: L.tileLayer('https://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png'),
                short_name: "Transports",
            },
        ]

    },
    {
        group: 'Geology',
        collapsed: false,
        layers: [{
            name: '<details><summary><div id="Geology"></div>Geology</summary>   <img src="legend/Noisetestlocationscopy_11.png" /img> <button class="Zoombtn", type="button" ,  onclick=ZoomToLayer("Geology")> <img src="./src/assets/magnifying-glass-location-solid.svg", title ="zoom to layer" /img></button> </details>  ',
            short_name: "Geology",
            active: true,
            layer: {
                type: "tileLayer.wms",
                args: ["https://services.bgr.de/wms/geologie/guek200/?", {
                    layers: 1,
                    format: 'image/png',
                    transparent: true,
                    // srs: 3857
                }],
            }
            // layer: L.tileLayer.wms("https://services.lgrb-bw.de/index.phtml?format=image/png&layers=lgrb_gu500_ov")
        },
        ]
    },
    {
        group: 'Protected areas',
        collapsed: true,
        layers: [{
            active: false,
            name: '  <details><summary><div id="Naturschutzgebiete"></div>Naturschutzgebiete</summary>   <img src="legend/Noisetestlocationscopy_11.png" /img> <button class="Zoombtn", type="button",title ="zoom to layer", onclick=ZoomToLayer("Naturschutzgebiete")> <img src="./src/assets/magnifying-glass-location-solid.svg" , title ="zoom to layer"  /img></button> </details>  ',
            short_name: "Naturschutzgebiete",
            layer: L.geoJSON(Naturschutzgebiete, {
                onEachFeature: function (f, l) {
                    l.bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
                }, color: 'red', weight: 1, fillOpacity: 0.4, weight: 0.7
            },),
        },
        {
            active: false,
            name: '  <details><summary><div id="Landschaftsschutzgebiet"></div>Landschaftsschutzgebiet</summary>   <img src="legend/Noisetestlocationscopy_11.png" /img> <button class="Zoombtn", type="button" ,  onclick=ZoomToLayer("Landschaftsschutzgebiet")> <img src="./src/assets/magnifying-glass-location-solid.svg", title ="zoom to layer" /img></button> </details>  ',
            short_name: "Landschaftsschutzgebiet",
            layer: L.geoJSON(Landschaftsschutzgebiet, {
                onEachFeature: function (f, l) {
                    l.bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
                }, weight: 0.7, color: '#408080', opacity: 1, fillOpacity: 0.4,
            },),
        },
        {
            active: false,
            name: '  <details><summary><div id="Biosphaerengebiet"></div>Biosphaerengebiet</summary>   <img src="legend/Noisetestlocationscopy_11.png" /img> <button class="Zoombtn", type="button" ,  onclick=ZoomToLayer("Biosphaerengebiet")> <img src="./src/assets/magnifying-glass-location-solid.svg", title ="zoom to layer" /img></button> </details>  ',
            short_name: "Biosphaerengebiet",
            layer: L.geoJSON(Biosphaerengebiet, {
                onEachFeature: function (f, l) {
                    l.bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
                }, weight: .4, color: 'blue', opacity: 1, fillOpacity: 0.4,
            },),
        },
        {
            active: false,
            name: '  <details><summary><div id="FFH_Gebiet"></div>FFH-Gebiet</summary>   <img src="legend/Noisetestlocationscopy_11.png" /img> <button class="Zoombtn", type="button" ,  onclick=ZoomToLayer("FFH-Gebiet")> <img src="./src/assets/magnifying-glass-location-solid.svg", title ="zoom to layer" /img></button> </details>  ',
            short_name: "FFH-Gebiet",
            layer: L.geoJSON(FFH_Gebiet, {
                onEachFeature: function (f, l) {
                    l.bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
                }, weight: .7, color: '#ff8040', opacity: 1, fillOpacity: 0.4,
            },),
        },
        {
            active: false,
            name: '  <details><summary><div id="Vogelschutzgebiet"></div>Vogelschutzgebiet</summary>   <img src="legend/Noisetestlocationscopy_11.png" /img> <button class="Zoombtn", type="button" ,  onclick=ZoomToLayer("Vogelschutzgebiet")> <img src="./src/assets/magnifying-glass-location-solid.svg", title ="zoom to layer" /img></button> </details>  ',
            short_name: "Vogelschutzgebiet",
            layer: L.geoJSON(Vogelschutzgebiet, {
                onEachFeature: function (f, l) {
                    l.bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
                }, weight: .7, color: '#8000ff', opacity: 1,
            },),
        },
        {
            active: true,
            name: '  <details><summary><div id="Naturepark"></div>Naturepark</summary>   <img src="legend/Noisetestlocationscopy_11.png" /img> <button class="Zoombtn", type="button" ,  onclick=ZoomToLayer("Naturepark")> <img src="./src/assets/magnifying-glass-location-solid.svg", title ="zoom to layer" /img></button> </details>  ',
            short_name: "Naturepark",
            layer: L.geoJSON(Naturepark, {
                onEachFeature: function (f, l) {
                    l.bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
                }, weight: .7, color: '#808000', opacity: 1, fillOpacity: 0.4,
            },),
        },

        {
            active: false,
            name: '  <details><summary><div id="Wasserschutzgebiete"></div>Wasserschutzgebiete</summary>   <img src="legend/Noisetestlocationscopy_11.png" /img> <button class="Zoombtn", type="button" ,  onclick=ZoomToLayer("Wasserschutzgebiete")> <img src="./src/assets/magnifying-glass-location-solid.svg", title ="zoom to layer" /img></button> </details>  ',
            short_name: "Wasserschutzgebiete",
            layer: L.geoJSON(Wasserschutzgebiete, {
                onEachFeature: function (f, l) {
                    l.bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
                }, weight: .7, color: '#ed29a4', opacity: 1, fillOpacity: 0.4,
            },),
        },
        ]
    }
];


var panelLayers2 = new L.Control.PanelLayers(baseLayers, null, {
    // selectorGroup: true,
    collapsibleGroups: true,
    compact: true,
    position: 'bottomright',
    compact: true,
}).addTo(map);

var panelLayers = new L.Control.PanelLayers(null, overLayers, {
    selectorGroup: true,
    collapsibleGroups: true,
    compact: true,
    // title: 'All layers',
    // collapsed: true
    // title: "Layers",
    position: 'topright',
    compact: true

}).addTo(map);


// map.addControl(panelLayers);




swipeMenuInnerHTML = '<select class="form-select" multiple  size="5"  aria-label="form-select" id="LeftLayerSelector"></select><div><button type="button" class="btn btn-success" id="confirm">Add swipe</button>   <button type="button" class="btn btn-secondary" id="closeSide">Remove all</button></div>'


// L.control.slideMenu(swipeMenuInnerHTML, { position: bottomright, menuposition: bottomright }).addTo(map);

// L.control.slideMenu(swipeMenuInnerHTML, { position: bottomright }).addTo(map);

var slideMenu = L.control.slideMenu("", {

    width: "25%",
    height: "100%",
    delay: 10,
    icon: "fa fa-solid fa-bars",
})
    .addTo(map);

slideMenu.setContents(swipeMenuInnerHTML);

document.getElementById("confirm").addEventListener("click", addSideBySide);
document.getElementById("closeSide").addEventListener("click", removeSideBySide);
// document.getElementById("ZoomTo").addEventListener("click", ZoomToLayer);

var isSideBySideOn = null

function addSideBySide() {
    if (isSideBySideOn == null) {
        isSideBySideOn = L.control.sideBySide([], [], { thumbSize: 25, padding: 70 }).addTo(map);
        isSideBySideOn.setLeftLayers(overLayers[2].layers[0].layer)
        // isSideBySideOn.setLeftLayers(overLayers[2].layers[0].layer)
        // isSideBySideOn.setRightLayers(osmLayer)

    }
}

function removeSideBySide() {
    if (isSideBySideOn) {
        isSideBySideOn.remove()
        isSideBySideOn = null
    }
}


function ZoomToLayer(name) {

    // console.log(name)
    for (let i = 0; i < overLayers.length; i++) {
        for (let L = 0; L < overLayers[i].layers.length; L++) {
            if (overLayers[i].layers[L].short_name == name) {
                overLayers[i].layers[L].layer.addTo(map);                   // make sure layer is active
                map.fitBounds(overLayers[i].layers[L].layer.getBounds()) // zoom to layer
                break
            }
        }
    }
}

var layersList = []
updateLayersList()

swipeButton = document.getElementById('swipeMenu');
swipeButton.onclick = updateLayersListInSwipePanel()


var browserControl = L.control.browserPrint({ position: 'topleft', title: 'Print Map' }).addTo(map);










function updateLayersList() {

    for (let i = 0; i < overLayers.length; i++) {
        for (let L = 0; L < overLayers[i].layers.length; L++) {
            layersList.push(overLayers[i].layers[L].short_name)
        }
    }
    console.log('Updated')
}

function updateLayersListInSwipePanel() {
    let leftPanel = document.getElementById("LeftLayerSelector");
    for (let i = 0; i < layersList.length; i++) {
        let option = document.createElement('option');
        option.text = layersList[i];
        leftPanel.appendChild(option)

    }

}