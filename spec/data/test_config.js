var Argo = Argo || {};

Argo.config = {
  lat: 40.74857,
  lng: -73.88802,
  zoom: 15,
  layers: [
    {
      id: 'transit',
      url: 'transit',
      property: 'name',
      title: 'Local bus routes',
      description: '<p>Local bus routes considered in this project: Q29, Q32, Q33, Q45, Q47, Q49, Q53.</p>',
      popupContent: 'This is the {{value}} bus.',
      rules: [
        {
          condition: '{{property}} === "Q29"',
          style: {color: '#3293fe', weight: 2, opacity: 0.9}
        },
        {
          condition: '{{property}} === "Q32"',
          style: {color: '#ac5a32', weight: 2, opacity: 0.9}
        },
        {
          condition: '{{property}} === "Q33"',
          style: {color: '#ff84ff', weight: 2, opacity: 0.9}
        },
        {
          condition: '{{property}} === "Q45"',
          style: {color: '#d53395', weight: 2, opacity: 0.9}
        },
        {
          condition: '{{property}} === "Q47"',
          style: {color: '#580faa', weight: 2, opacity: 0.9}
        },
        {
          condition: '{{property}} === "Q49"',
          style: {color: '#335bff', weight: 2, opacity: 0.9}
        },
        {
          condition: '{{property}} === "Q53"',
          style: {color: '#8332ac', weight: 2, opacity: 0.9}
        }
      ]
    },
    {
      id: 'trafficspeeds',
      url: 'trafficspeeds',
      property: 'WDAV',
      title: 'Traffic speeds',
      description: '<p>Average weekday and weekend speeds. The colors indicate the fastest (green) to slowest (red) traffic speeds.</p><p>Average speed, miles per hour<br><img src="http://a841-tfpweb.nyc.gov/jackson-heights/wp-content/themes/tfp/img/speed-legend.png"></p>',
      popupContent: '{{value}} mph',
      rules: [
        {
          condition: '{{property}} <= 5',
          style: {color: '#fe6565', weight: 4, opacity: 0.9}
        },
        {
          condition: '{{property}} > 5 && {{property}} < 15',
          style: {color: '#fedf65', weight: 4, opacity: 0.9}
        },
        {
          condition: '{{property}} >= 15',
          style: {color: '#65c165', weight: 4, opacity: 0.9}
        }
      ]
    },
    {
      id: 'vendors',
      url: 'vendors',
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
      url: 'crashes',
      property: 'ICOUNT',
      title: 'Crashes',
      description: '<p>Reported pedestrian and bicycle crashes within the study area between January 2005 and December 2007. Zoom in to see the number of crashes at each location.</p>',
      popupContent: '{{value}} crashes',
      rules: [
        {
          condition: '{{property}} > 0 && {{property}} < 2',
          style: {color: '#973100', radius: 6, opacity: 0.9, fillOpacity: 0.2}
        },
        {
          condition: '{{property}} >= 2 && {{property}} < 4',
          style: {color: '#973100', radius: 12, opacity: 0.9, fillOpacity: 0.2}
        },
        {
          condition: '{{property}} >= 4 && {{property}} < 6',
          style: {color: '#973100', radius: 18, opacity: 0.9, fillOpacity: 0.2}
        },
        {
          condition: '{{property}} >= 6',
          style: {color: '#973100', radius: 24, opacity: 0.9, fillOpacity: 0.2}
        }
      ]
    }
  ]
};