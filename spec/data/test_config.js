var Argo = Argo || {};

Argo.config = {
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
  layers: [
    {
      id: 'studyarea',
      url: 'studyarea',
      type: 'geoserver',
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
      url: 'transit',
      type: 'geoserver',
      property: 'name',
      title: 'Local bus routes',
      description: '<p>Local bus routes considered in this project: Q29, Q32, Q33, Q45, Q47, Q49, Q53.</p>',
      popupContent: 'This is the {{value}} bus.',
      visible: true,
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
    }
  ]
};