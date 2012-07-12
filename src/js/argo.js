var Argo = Argo || {};

(function(A, $) {
  A.Util = {
    getStyleRule: function(layerOptions, properties) {
      var i, condition;

      for (i=0; i<layerOptions.rules.length; i++) {
        rule = layerOptions.rules[i];
        // Replace the template with the property variable, not the value.
        // this is so we don't have to worry about strings vs nums.
        condition = rule.condition.replace('{{property}}', 'properties[layerOptions.property]');

        // Simpler code plus a trusted source; negligible performance hit
        if (eval(condition)) {
          return rule.style;
        }
      }
      return null;
    },
    getPopupContent: function(layerOptions, properties) {
      return (layerOptions.popupContent || '').replace('{{value}}', properties[layerOptions.property]);
    }
  };

  var initLayer = function(layerOptions, map) {
    var geojsonLayer = new L.GeoJSON(null, {
      pointToLayer: function (latlng){
        return new L.CircleMarker(latlng);
      }
    });

    var addGeoJSON = function(geoJson) {
      geojsonLayer.addGeoJSON(geoJson);
    };

    geojsonLayer.on("featureparse", function (evt) {
      var style = A.Util.getStyleRule(layerOptions, evt.properties),
          popupContent = A.Util.getPopupContent(layerOptions, evt.properties);

      // Only clickable if there is popup content
      style.clickable = !!popupContent;

      // Set the style
      evt.layer.setStyle(style);
      // Init the popup
      if (popupContent) {
        evt.layer.bindPopup(popupContent);
      }
    });

    map.addLayer(geojsonLayer);

    $.ajax({
      url: layerOptions.url + '&format_options=callback:ArgoJsonpCallback',
      dataType: 'jsonp',
      jsonpCallback: 'ArgoJsonpCallback',
      success: addGeoJSON
    });
  };

  var initMap = function(options) {
    var map = new L.Map(options.el),
        baseTileUrl = 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png',
        baseTileAttribution = 'Map data &copy; OpenStreetMap contributors, CC-BY-SA <a href="http://mapbox.com/about/maps" target="_blank">Mapbox Terms &amp; Feedback</a>',
        baseTile = new L.TileLayer(baseTileUrl, {maxZoom: 18, attribution: baseTileAttribution});

    map.addLayer(baseTile);

    return map;
  };

  // options = {
  //   el: 'map',
  //   layers: []
  // }
  A.Map = function(options) {
    var map = initMap(options), i;

    for (i = 0; i < options.layers.length; i++) {
      initLayer(options.layers[i], map);
    }

    map.setView(new L.LatLng(40.747, -73.986), 11);
  };

})(Argo, jQuery);