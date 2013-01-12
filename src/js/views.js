var Argo = Argo || {};

(function(A, $) {
  // A Legend for all of the layers
  A.LegendView = function(options) {
    var self = {};

    // Cache the root element
    self.$el = $(options.el);

    // Render the legend
    render();

    // Bind the checkbox change event
    self.$el.find('.argo-legend-checkbox').on('change', toggleVisibility);


    function render(){
      var $markup = $('<ul class="argo-legend-list"></ul>'),
          i, checked, layer;

      for(i=0; i<options.layers.length; i++) {
        layer = options.layers[i];
        checked = layer.visible ? 'checked="checked"' : '';

        if (layer.legend !== false) {
          $markup.append('<li class="argo-legend-item">' +
            '<div class="argo-legend-desc">' +
              '<div class="argo-legend-desc-title">'+layer.title+'</div>' +
              '<div class="argo-legend-desc-content">'+layer.description+'</div>' +
            '</div>' +
            '<div class="argo-legend-title">' +
              '<input id="argo-'+layer.id+'" data-layerid="'+layer.id+'" ' +
                checked+' class="argo-legend-checkbox" type="checkbox"></input>' +
              '<label for="argo-'+layer.id+'">'+layer.title+'</label>' +
            '</div>' +
          '</li>');
        }
      }

      self.$el.append($markup);
    }

    // Checkbox change handler, triggers event to the MapView
    function toggleVisibility(evt) {
      var $cbox = $(evt.target),
          id = $cbox.attr('data-layerid');

      if ($cbox.is(':checked')) {
        $(A).trigger('visibility', [id, true]);
      } else {
        $(A).trigger('visibility', [id, false]);
      }
    }

    return self;
  };

  // A view for maps with a legend and stylable GeoJson layers
  A.MapView = function(options) {
    var self = {},
        baseLayer = new L.TileLayer(options.baseLayer.url, options.baseLayer),
        i;

    // Cache the root element
    self.$el = $(options.el);

    // Init the map
    self.map = L.map(self.$el.get(0), options.map);
    self.map.addLayer(baseLayer);
    // Remove default prefix
    self.map.attributionControl.setPrefix('');

    // Cache the layers views
    self.layers = {};

    // Init all of the layers
    $.each(options.layers, function(i, options) {
      var layer = self.layers[options.id] = L.argo(options.url, options);
      layer.on('loaded', function() {
        setLayerVisibility(layer, options.visible);
      });
    });

    // Bind visiblity event
    $(A).on('visibility', function(evt, id, visible) {
      setLayerVisibility(self.layers[id], visible);
    });

    // Adds or removes the layer based on visibility
    function setLayerVisibility(layer, visible) {
      self.map.closePopup();
      if (visible && !self.map.hasLayer(layer)) {
        self.map.addLayer(layer);
      }
      if (!visible && self.map.hasLayer(layer)) {
        self.map.removeLayer(layer);
      }
    }

    return self;
  };
})(Argo, jQuery);