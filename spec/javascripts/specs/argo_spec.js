describe('Argo', function() {
  beforeEach(function() {
    Argo.LayerView = Argo.LayerView.extend({
      // Hijack function to fetch GeoJson
      getGeoJson: function(url, callback) {
        // Return the test response defined in specs/helpers/test_geojson.js
        callback(Argo.geoJson[url]);
      }
    });

    var options = jQuery.extend(true, {}, Argo.config),
        collection = new Backbone.Collection(options.layers);

    mapView = new Argo.MapView({
      map: options.map,
      collection: collection
    });
    legendView = new Argo.LegendView({
      collection: collection
    });
  });


  describe('MapView', function() {
    describe('Leaflet Map', function() {
      it('should exist', function() {
        expect(mapView.map).toBeDefined();
      });

      it('should be centered at 40.74857, -73.88802', function() {
        var center = mapView.map.getCenter();
        expect(center.lat.toPrecision(6)).toBe('40.7486');
        expect(center.lng.toPrecision(6)).toBe('-73.8880');
      });

      it('should be at zoom level 15', function() {
        expect(mapView.map.getZoom()).toBe(15);
      });

      it('should have a base layer by default', function(){
        expect(_.size(mapView.map._layers)).toBe(1);
      });

      it('should have 1 LayerView', function(){
        expect(_.size(mapView.layers)).toBe(1);
      });
    });

    describe('Layer Collection', function() {
      it('should have 1 layer model', function() {
        expect(mapView.collection.length).toBe(1);
      });
    });

    describe('LayerView', function() {
      var colors = {
        'Q29': '#3293fe',
        'Q32': '#ac5a32',
        'Q33': '#ff84ff',
        'Q45': '#d53395',
        'Q47': '#580faa',
        'Q49': '#335bff',
        'Q53': '#8332ac'
      };

      it('should exist', function(){
        expect(mapView.layers.transit).toBeDefined();
      });

      it('should have a style definition', function(){
        var style = mapView.layers.transit.getStyleRule({name: 'Q29' });
        expect(style.color).toBe(colors.Q29);
      });
    });
  });

  describe('LegendView', function() {
    var html = '<ul class="argo-legend-list"><li class="argo-legend-item"><div class="argo-legend-desc"><div class="argo-legend-desc-title">Local bus routes</div><div class="argo-legend-desc-content"><p>Local bus routes considered in this project: Q29, Q32, Q33, Q45, Q47, Q49, Q53.</p></div></div><div class="argo-legend-title"><input id="argo-transit" data-layerid="transit" class="argo-legend-checkbox" type="checkbox"><label for="argo-transit">Local bus routes</label></div></li></ul>';

    it('should generate the right html', function() {
      expect(legendView.$el.html()).toBe(html);
    });
  });

});