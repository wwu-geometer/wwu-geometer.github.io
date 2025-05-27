(function (factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('leaflet'));
    } else {
        window.providers = factory(window.L);
    }
})(function (L) {
    var providers = {};


    providers['OpenStreetMap_Mapnik'] = {
        title: 'osm',
        icon: './src/assets/icons/openstreetmap_mapnik.png',
        layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })
    };

    providers['OpenStreetMap_English'] = {
        title: 'osm EN',
        icon: './src/assets/icons/openstreetmap_mapnik.png',
        layer: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        })
    };

    providers['OpenTopoMap'] = {
        title: 'topo',
        icon: './src/assets/icons/opentopomap.png',
        layer: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        })
    };


    providers['HERE_normalDay'] = {
        title: 'admin',
        icon: './src/assets/icons/here_normalday.png',
        layer: L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/normal.day/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {
            attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
            subdomains: '1234',
            mapID: 'newest',
            app_id: 'Y8m9dK2brESDPGJPdrvs',
            app_code: 'dq2MYIvjAotR8tHvY8Q_Dg',
            base: 'base',
            maxZoom: 20
        })
    };

    providers['HERE_satelliteDay'] = {
        title: 'satellite',
        icon: './src/assets/icons/here_satelliteday.png',

        // layer: L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
        //     minZoom: 0,
        //     maxZoom: 20,
        //     attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        //     ext: 'jpg'
        // })
        layer: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        })
    };

    providers['Blank'] = {
        title: 'Blank (White)',
        // icon: './src/assets/icons/blank_white.png', // optional
        layer: L.gridLayer({
            tileSize: 256,
            createTile: function () {
                const tile = document.createElement('canvas');
                tile.width = 256;
                tile.height = 256;

                const ctx = tile.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, 256, 256);

                return tile;
            }
        })
    };


    return providers;
});