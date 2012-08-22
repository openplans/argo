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

      it('should have 2 LayerViews', function(){
        expect(_.size(mapView.layers)).toBe(2);
      });
    });

    describe('Layer Collection', function() {
      it('should have 2 layer models', function() {
        expect(mapView.collection.length).toBe(2);
      });
    });

    describe('LayerView', function() {
      describe('transit layer', function(){
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

        it('should have popup content', function() {
          var content = mapView.layers.transit.getPopupContent({name: 'Q29' });
          expect(content).toBe('This is the Q29 bus.');

        });

      });

      describe('studayarea layer', function(){
        it('should be visible by default', function(){
          expect(mapView.layers.studyarea.model.get('visible')).toBe(true);
        });

        it('should not be in the legend', function(){
          expect(mapView.layers.studyarea.model.get('legend')).toBe(false);
        });

      });

      describe('geoserver', function(){
        it('should make a unique, safe jsonp callback name', function(){
          // Could be any layer, just need the function
          var callbackName = mapView.layers.transit.getGeoServerCallbackName('this-is not*okay!');
          expect(callbackName.indexOf('ArgoJsonpCallback_thisisnotokay_')).toBe(0);
        });
      });

    });
  });

  describe('LegendView', function() {
    it('should only have the transit layer', function() {
      expect(legendView.$('li').length).toBe(1);
      expect(legendView.$('li:first .argo-legend-desc-title').text()).toBe('Local bus routes');
    });
  });

});