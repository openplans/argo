var Argo = Argo || {};

Argo.demoOptions = {
  el: '#map',
  lat: 40.747, 
  lng: -73.986,
  zoom: 11,
  layers: [
    {
      id: 'transit',
      url: 'http://gsdemo.dev.openplans.org/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=jackson_heights:transit_linestrings&srsName=EPSG:4326&outputFormat=json',
      property: 'name',
      title: 'Local bus routes',
      description: 'Local bus routes considered in this project: Q29, Q32, Q33, Q45, Q47, Q49, Q53.',
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
      url: 'http://gsdemo.dev.openplans.org/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=jackson_heights:roads&srsName=EPSG:4326&outputFormat=json',
      property: 'WDAV',
      title: 'Traffic speeds',
      description: '<p>Average weekday and weekend speeds. The colors indicate the fastest (green) to slowest (red) traffic speeds.</p><p>Average speed, miles per hour<br><img src="http://a841-tfpweb.nyc.gov/jackson-heights/wp-content/themes/tfp/img/speed-legend.png"></p>',
      popupContent: '{{value}} mph',
      visible: true,
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
      url: 'http://gsdemo.dev.openplans.org/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=jackson_heights:vendors&srsName=EPSG:4326&outputFormat=json',
      title: 'Street vendors',
      description: 'Locations of street vendors were surveyed on several weekdays and weekends in Fall 2009.',
      visible: true,
      rules: [
        {
          condition: 'true',
          style: {color: '#444444', radius: 1, opacity: 0.9}
        }
      ]  
    },
    {
      id: 'crashes',
      url: 'http://gsdemo.dev.openplans.org/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=jackson_heights:Ped_Crashes&srsName=EPSG:4326&outputFormat=json',
      property: 'ICOUNT',
      title: 'Crashes',
      description: 'Reported pedestrian and bicycle crashes within the study area between January 2005 and December 2007. Zoom in to see the number of crashes at each location.',
      popupContent: '{{value}} crashes',
      visible: true,
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