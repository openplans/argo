var Argo = Argo || {};

(function(A, $) {
  // A Legend for all of the layers
  A.LegendView = function(o) {
    var self = {
      options: $.extend({}, o),

      initialize: function(){
        self.$el = $(self.options.el);
        self.bindEvents();
        self.render();
      },
      bindEvents: function() {
        self.$el.on('change', '.argo-legend-checkbox', self.toggleVisibility);
      },
      render: function(){
        var i, len = self.options.collection.length,
            $markup = $('<ul class="argo-legend-list"></ul>');

        for (i=0; i<len; i++) {
          model = self.options.collection[i];

          $markup.append('<li class="argo-legend-item">' +
            '<div class="argo-legend-desc">' +
              '<div class="argo-legend-desc-title">'+model.title+'</div>' +
              '<div class="argo-legend-desc-content">'+model.description+'</div>' +
            '</div>' +
            '<div class="argo-legend-title">' +
              '<input id="argo-'+model.id+'" data-layer-index="'+i+'" class="argo-legend-checkbox" type="checkbox"></input>' +
              '<label for="argo-'+model.id+'">'+model.title+'</label>' +
            '</div>' +
          '</li>');
        }

        self.$el.append($markup);
      },
      toggleVisibility: function(evt) {
        var $cbox = $(evt.target),
            i = $cbox.attr('data-layer-index');

        if ($cbox.is(':checked')) {
          $(self.options.collection[i]).trigger('show');
        } else {
          $(self.options.collection[i]).trigger('hide');
        }
      }
    };

    self.initialize();
    return self;
  };

  // A view for stylable GeoJson layers
  A.LayerView = function(o) {
    var self = {
      options: $.extend({}, o),

      initialize: function(){
        var url = self.options.model.url,
            type = self.options.model.type || 'jsonp',
            getGeoJsonFunction = type === 'geoserver' ?
              self.getGeoJsonFromGeoServer : self.getGeoJson;

        getGeoJsonFunction(url, type, function(geoJson) {
          if (geoJson) {
            self.layer = L.geoJson(geoJson, {
              pointToLayer: function (feature, latlng) {
                return new L.CircleMarker(latlng);
              },
              onEachFeature: function(feature, layer) {
                var style = self.getStyleRule(feature.properties),
                    popupContent = self.getPopupContent(feature.properties);

                // Only clickable if there is popup content; convert to bool
                style.clickable = !!popupContent;

                // Set the style manually since so I can use popupContent to set clickable
                layer.setStyle(style);

                // Handle radius for circle marker
                if (layer.setRadius && style.radius) {
                  layer.setRadius(style.radius);
                }

                // Init the popup
                if (popupContent) {
                  layer.bindPopup(popupContent);
                }
              }
            });
          } else {
            console.error('GeoJSON could not be retrieved from: ', url);
          }
        });

        // Bind show and hide events
        $(self.options.model).bind('show', self.show);
        $(self.options.model).bind('hide', self.hide);
      },
      getGeoJsonFromGeoServer: function(url, type, callback) {
        var callbackName = 'ArgoJsonpCallback_' + $.expando + '_' + $.now();
        // Fetch the GeoJson from GeoServer
        $.ajax({
          url: url + '&format_options=callback:' + callbackName,
          dataType: 'jsonp',
          jsonpCallback: callbackName,
          success: callback
        });
      },
      getGeoJson: function(url, type, callback) {
        // Fetch the GeoJson using the given type
        $.ajax({
          url: url,
          dataType: type,
          success: callback
        });
      },
      // Get the style rule for this feature by evaluating the condition option
      getStyleRule: function(properties) {
        var rules = self.options.model.rules,
            propertyRe = /\{\{property\}\}/g,
            i, condition;

        for (i=0; i<rules.length; i++) {
          // Replace the template with the property variable, not the value.
          // this is so we don't have to worry about strings vs nums.
          condition = rules[i].condition.replace(propertyRe, 'properties[self.options.model.property]');

          // Simpler code plus a trusted source; negligible performance hit
          if (eval(condition)) {
            return rules[i].style;
          }
        }
        return null;
      },
      // Get the popup content and replace the variable
      getPopupContent: function(properties) {
        return (self.options.model.popupContent || '').replace('{{value}}', properties[self.options.model.property]);
      },
      show: function(){
        self.options.map.closePopup();
        self.options.map.addLayer(self.layer);
      },
      hide: function() {
        self.options.map.closePopup();
        self.options.map.removeLayer(self.layer);
      }
    };

    self.initialize();
    return self;
  };

  // A view for maps with a legend and stylable GeoJson layers
  A.MapView = function(o) {
    var self = {
      options: $.extend({}, o),

      initialize: function() {
        var i, len = self.options.collection.length,
            layerModel,
            baseTileUrl = 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png',
            baseTileAttribution = 'Map data &copy; OpenStreetMap contributors, CC-BY-SA <a href="http://mapbox.com/about/maps" target="_blank">Mapbox Terms &amp; Feedback</a>',
            baseTile = new L.TileLayer(baseTileUrl, {attribution: baseTileAttribution});

        // Init the map
        self.map = new L.Map($(self.options.el)[0], self.options.map);
        self.map.addLayer(baseTile);

        // Cache the layers views
        self.layers = {};

        for (i=0; i<len; i++) {
          model = self.options.collection[i];
          self.layers[model.id] = new A.LayerView({
            map: self.map,
            model: model
          });
        }
      }
    };

    self.initialize();
    return self;
  };
})(Argo, jQuery);