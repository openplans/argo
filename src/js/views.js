var Argo = Argo || {};

(function(A, $) {
  // A Legend for all of the layers
  A.LegendView = Backbone.View.extend({
    initialize: function(){
      this.render();
    },
    render: function(){
      console.log('render LegendView with: ', this.collection.toJSON());
    }
  });

  // A view for stylable GeoJson layers
  A.LayerView = Backbone.View.extend({
    initialize: function(){
      var self = this;

      // Init the layer for this view
      self.layer = new L.GeoJSON(null, {
        pointToLayer: function (latlng){
          return new L.CircleMarker(latlng);
        }
      });

      // Set style and popup content based on the feature properties
      self.layer.on("featureparse", function (evt) {
        var style = self.getStyleRule(evt.properties),
            popupContent = self.getPopupContent(evt.properties);

        // Only clickable if there is popup content
        style.clickable = !!popupContent;

        // Set the style
        evt.layer.setStyle(style);
        // Init the popup
        if (popupContent) {
          evt.layer.bindPopup(popupContent);
        }

        self.render();
      });

      // Fetch the GeoJson from GeoServer
      // TODO: make this not dependent on GeoServer
      $.ajax({
        url: self.model.get('url') + '&format_options=callback:ArgoJsonpCallback',
        dataType: 'jsonp',
        jsonpCallback: 'ArgoJsonpCallback',
        success: function(geoJson) {
          self.layer.addGeoJSON(geoJson);
        }
      });

      // Rerender on model change
      self.model.bind('change', self.render, self);
    },
    // Get the style rule for this feature by evaluating the condition option
    getStyleRule: function(properties) {
      var self = this, 
          rules = self.model.get('rules'),
          i, condition;

      for (i=0; i<rules.length; i++) {
        // Replace the template with the property variable, not the value.
        // this is so we don't have to worry about strings vs nums.
        condition = rules[i].condition.replace('{{property}}', 'properties[self.model.get("property")]');

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
          baseTile = new L.TileLayer(baseTileUrl, {maxZoom: 18, attribution: baseTileAttribution});

      // Generic collection for layers
      self.collection = new Backbone.Collection();

      // Init the map
      self.map = new L.Map(self.el);
      self.map.addLayer(baseTile);
      self.map.setView(new L.LatLng(self.options.lat, self.options.lng), self.options.zoom);

      for (i = 0; i < self.options.layers.length; i++) {
        layerModel = new Backbone.Model(self.options.layers[i]);
        
        new A.LayerView({
          map: self.map,
          model: layerModel
        });

        self.collection.add(layerModel);
      }

      window.legendView = new A.LegendView({
        collection: self.collection
      });
    }
  });
})(Argo, jQuery);