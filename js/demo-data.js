var Argo = Argo || {};

Argo.demoOptions = {
  map: {
    center: [40.74857, -73.88802],
    zoom: 15,
    minZoom: 13,
    maxZoom: 17,
    maxBounds: [
      [40.666, -74.040],
      [40.830, -73.740]
    ]
  },
  baseLayer: {
    url: 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors, CC-BY-SA. <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>'
  },
  layers: [
    {
      id: 'studyarea',
      url: 'data/studyarea.json',
      type: 'json',
      legend: false,
      visible: true,
      rules: [
        {
          condition: 'true',
          style: {color: '#444444', opacity: 0.9, fillOpacity:0.1, weight:1.5}
        }
      ]
    },
    {
      id: 'transit',
      url: 'data/transit.json',
      type: 'json',
      title: 'Local bus routes',
      description: '<p>Local bus routes considered in this project: Q29, Q32, Q33, Q45, Q47, Q49, Q53.</p>',
      popupContent: 'This is the {{name}} bus.',
      rules: [
        {
          condition: '"{{name}}" === "Q29"',
          style: {color: '#3293fe', weight: 2, opacity: 0.9}
        },
        {
          condition: '"{{name}}" === "Q32"',
          style: {color: '#ac5a32', weight: 2, opacity: 0.9}
        },
        {
          condition: '"{{name}}" === "Q33"',
          style: {color: '#ff84ff', weight: 2, opacity: 0.9}
        },
        {
          condition: '"{{name}}" === "Q45"',
          style: {color: '#d53395', weight: 2, opacity: 0.9}
        },
        {
          condition: '"{{name}}" === "Q47"',
          style: {color: '#580faa', weight: 2, opacity: 0.9}
        },
        {
          condition: '"{{name}}" === "Q49"',
          style: {color: '#335bff', weight: 2, opacity: 0.9}
        },
        {
          condition: '"{{name}}" === "Q53"',
          style: {color: '#8332ac', weight: 2, opacity: 0.9}
        }
      ]
    },
    {
      id: 'trafficspeeds',
      url: 'data/trafficspeeds.json',
      type: 'json',
      title: 'Traffic speeds',
      description: '<p>Average weekday and weekend speeds. The colors indicate the fastest (green) to slowest (red) traffic speeds.</p><p>Average speed, miles per hour<br><img src="http://a841-tfpweb.nyc.gov/jackson-heights/wp-content/themes/tfp/img/speed-legend.png"></p>',
      popupContent: '{{WDAV}} mph',
      rules: [
        {
          condition: '{{WDAV}} <= 5',
          style: {color: '#fe6565', weight: 4, opacity: 0.9}
        },
        {
          condition: '{{WDAV}} > 5 && {{WDAV}} < 15',
          style: {color: '#fedf65', weight: 4, opacity: 0.9}
        },
        {
          condition: '{{WDAV}} >= 15',
          style: {color: '#65c165', weight: 4, opacity: 0.9}
        }
      ]
    },
    {
      id: 'vendors',
      url: 'data/vendors.json',
      type: 'json',
      title: 'Street vendors',
      description: '<p>Locations of street vendors were surveyed on several weekdays and weekends in Fall 2009.</p>',
      rules: [
        {
          condition: 'true',
          style: {color: '#444444', radius: 1, opacity: 0.9}
        }
      ]
    },
    {
      id: 'crashes',
      url: 'data/crashes.json',
      type: 'json',
      title: 'Crashes',
      description: '<p>Reported pedestrian and bicycle crashes within the study area between January 2005 and December 2007. Zoom in to see the number of crashes at each location.</p>',
      popupContent: '{{ICOUNT}} crashes',
      rules: [
        {
          condition: '{{ICOUNT}} > 0 && {{ICOUNT}} < 2',
          style: {color: '#973100', radius: 6, opacity: 0.9, fillOpacity: 0.2}
        },
        {
          condition: '{{ICOUNT}} >= 2 && {{ICOUNT}} < 4',
          style: {color: '#973100', radius: 12, opacity: 0.9, fillOpacity: 0.2}
        },
        {
          condition: '{{ICOUNT}} >= 4 && {{ICOUNT}} < 6',
          style: {color: '#973100', radius: 18, opacity: 0.9, fillOpacity: 0.2}
        },
        {
          condition: '{{ICOUNT}} >= 6',
          style: {color: '#973100', radius: 24, opacity: 0.9, fillOpacity: 0.2}
        }
      ]
    }
  ]
};