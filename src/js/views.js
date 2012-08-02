var Argo = Argo || {};

(function(A, $) {
  // A Legend for all of the layers
  A.LegendView = Backbone.View.extend({
    initialize: function(){
      this.render();
    },
    events: {
      'change .argo-legend-checkbox': 'toggleVisibility'
    },
    render: function(){
      var $markup = $('<ul class="argo-legend-list"></ul>');

      this.collection.each(function(model, i) {
        $markup.append('<li class="argo-legend-item">' +
          '<div class="argo-legend-desc">' +
            '<div class="argo-legend-desc-title">'+model.get('title')+'</div>' +
            '<div class="argo-legend-desc-content">'+model.get('description')+'</div>' +
          '</div>' +
          '<div class="argo-legend-title">' +
            '<input id="argo-'+model.get('id')+'" data-layerid="'+model.get('id')+'" class="argo-legend-checkbox" type="checkbox"></input>' +
            '<label for="argo-'+model.get('id')+'">'+model.get('title')+'</label>' +
          '</div>' +
        '</li>');
      });

      this.$el.append($markup);
    },
    toggleVisibility: function(evt) {
      var $cbox = $(evt.target),
          id = $cbox.attr('data-layerid');

      if ($cbox.is(':checked')) {
        this.collection.get(id).set('visible', true);
      } else {
        this.collection.get(id).set('visible', false);
      }
    }
  });

  // A view for stylable GeoJson layers
  A.LayerView = Backbone.View.extend({
    initialize: function(){
      var self = this,
          url = self.model.get('url');

      self.getGeoJson(url, function(geoJson) {
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

          self.render();
        } else {
          console.error('GeoJSON could not be retrieved from: ', url);
        }
      });

      // Rerender on model change
      self.model.bind('change', self.render, self);
    },
    getGeoJson: function(url, callback) {
      var callbackName = 'ArgoJsonpCallback_' + $.expando + '_' + $.now();
      // Fetch the GeoJson from GeoServer
      // TODO: make this not dependent on GeoServer
      $.ajax({
        url: url + '&format_options=callback:' + callbackName,
        dataType: 'jsonp',
        jsonpCallback: callbackName,
        success: callback
      });
    },
    // Get the style rule for this feature by evaluating the condition option
    getStyleRule: function(properties) {
      var self = this,
          rules = self.model.get('rules'),
          propertyRe = /\{\{property\}\}/g,
          i, condition;

      for (i=0; i<rules.length; i++) {
        // Replace the template with the property variable, not the value.
        // this is so we don't have to worry about strings vs nums.
        condition = rules[i].condition.replace(propertyRe, 'properties[self.model.get("property")]');

        // Simpler code plus a trusted source; negligible performance hit
        if (eval(condition)) {
          return rules[i].style;
        }
      }
      return null;
    },
    // Get the popup content and replace the variable
    getPopupContent: function(properties) {
      return (this.model.get('popupContent') || '').replace('{{value}}', properties[this.model.get('property')]);
    },
    render: function(){
      // Adds or removes the layer based on visibility
      this.options.map.closePopup();
      if (this.model.get('visible') && !this.options.map.hasLayer(this.layer)) {
        this.options.map.addLayer(this.layer);
      }
      if (!this.model.get('visible') && this.options.map.hasLayer(this.layer)) {
        this.options.map.removeLayer(this.layer);
      }
    }
  });

  // A view for maps with a legend and stylable GeoJson layers
  A.MapView = Backbone.View.extend({
    initialize: function() {
      var self = this,
          i, layerModel,
          baseTileUrl = 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png',
          baseTileAttribution = 'Map data &copy; OpenStreetMap contributors, CC-BY-SA <a href="http://mapbox.com/about/maps" target="_blank">Mapbox Terms &amp; Feedback</a>',
          baseTile = new L.TileLayer(baseTileUrl, {attribution: baseTileAttribution});

      // Init the map
      self.map = new L.Map(self.el, self.options.map);
      self.map.addLayer(baseTile);

      // Cache the layers views
      self.layers = {};

      this.collection.each(function(model, i) {
        self.layers[model.get('id')] = new A.LayerView({
          map: self.map,
          model: model
        });
      });
    }
  });
})(Argo, jQuery);