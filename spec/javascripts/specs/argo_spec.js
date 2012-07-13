describe('Argo', function() {
  beforeEach(function() {
    Argo.LayerView = Argo.LayerView.extend({
      // Hijack function to fetch GeoJson
      getGeoJson: function(url, callback) {
        // Return the test response defined in specs/helpers/test_geojson.js
        callback(Argo.geoJson[url]);
      }
    });

    var options = jQuery.extend(true, {}, Argo.config);
    options.collection = new Backbone.Collection(options.layers);

    mapView = new Argo.MapView(options);
    legendView = new Argo.LegendView(options);
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

      it('should have four LayerViews', function(){
        expect(_.size(mapView.layers)).toBe(4);
      });
    });

    describe('Layer Collection', function() {
      it('should have four layer models', function() {
        expect(mapView.collection.length).toBe(4);
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

      it('should be styled based on its config', function(){
        // Two layers since it's a multiline
        _.each(mapView.layers['transit'].layer._layers, function(layer1) {
          _.each(layer1._layers, function(layer2) {
              expect(layer2.options.color).toBe(colors[layer2.options.properties.name]);
          });
        });
      });
    });
  });

  describe('LegendView', function() {
    var html = '<ul class="argo-legend-list"><li class="argo-legend-item"><div class="argo-legend-desc"><div class="argo-legend-desc-title">Local bus routes</div><div class="argo-legend-desc-content"><p>Local bus routes considered in this project: Q29, Q32, Q33, Q45, Q47, Q49, Q53.</p></div></div><div class="argo-legend-title"><input id="argo-transit" data-layerid="transit" class="argo-legend-checkbox" type="checkbox"><label for="argo-transit">Local bus routes</label></div></li><li class="argo-legend-item"><div class="argo-legend-desc"><div class="argo-legend-desc-title">Traffic speeds</div><div class="argo-legend-desc-content"><p>Average weekday and weekend speeds. The colors indicate the fastest (green) to slowest (red) traffic speeds.</p><p>Average speed, miles per hour<br><img src="http://a841-tfpweb.nyc.gov/jackson-heights/wp-content/themes/tfp/img/speed-legend.png"></p></div></div><div class="argo-legend-title"><input id="argo-trafficspeeds" data-layerid="trafficspeeds" class="argo-legend-checkbox" type="checkbox"><label for="argo-trafficspeeds">Traffic speeds</label></div></li><li class="argo-legend-item"><div class="argo-legend-desc"><div class="argo-legend-desc-title">Street vendors</div><div class="argo-legend-desc-content"><p>Locations of street vendors were surveyed on several weekdays and weekends in Fall 2009.</p></div></div><div class="argo-legend-title"><input id="argo-vendors" data-layerid="vendors" class="argo-legend-checkbox" type="checkbox"><label for="argo-vendors">Street vendors</label></div></li><li class="argo-legend-item"><div class="argo-legend-desc"><div class="argo-legend-desc-title">Crashes</div><div class="argo-legend-desc-content"><p>Reported pedestrian and bicycle crashes within the study area between January 2005 and December 2007. Zoom in to see the number of crashes at each location.</p></div></div><div class="argo-legend-title"><input id="argo-crashes" data-layerid="crashes" class="argo-legend-checkbox" type="checkbox"><label for="argo-crashes">Crashes</label></div></li></ul>';

    it('should generate the right html', function() {
      expect(legendView.$el.html()).toBe(html);
    });
  });

});