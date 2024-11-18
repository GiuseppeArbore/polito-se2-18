const customDrawStyles = [
    {
      'id': 'gl-draw-polygon-fill',
      'type': 'fill',
      'filter': ['all', ['==', '$type', 'Polygon']],
      'paint': {
        'fill-color': '#00BFFF', // Light blue color
        'fill-opacity': 0.5
      }
    },
    {
      'id': 'gl-draw-polygon-stroke-active',
      'type': 'line',
      'filter': ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': '#00BFFF', // Light blue color
        'line-width': 2
      }
    },
    {
      'id': 'gl-draw-polygon-stroke-inactive',
      'type': 'line',
      'filter': ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'false']],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': '#00BFFF', // Light blue color
        'line-width': 2
      }
    }
  ];
  
  
  export default customDrawStyles;