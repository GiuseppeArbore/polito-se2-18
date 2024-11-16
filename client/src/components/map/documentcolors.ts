import { ExpressionSpecification } from 'mapbox-gl';
const documentColorMapping : ExpressionSpecification = [
    'case',
    ['==', ['get', 'type'], 'Informative Document'], '#abc4ab',
    ['==', ['get', 'type'], 'Prescriptive Document'], '#a39171',
    ['==', ['get', 'type'], 'Design Document'], '#dcc9b6',
    ['==', ['get', 'type'], 'Technical Document'], '#727d71',
    ['==', ['get', 'type'], 'Strategy'], '#6d4c3d',
    ['==', ['get', 'type'], 'Agreement'], '#4fb477',
    ['==', ['get', 'type'], 'Conflict Resolution'], '#474973',
    ['==', ['get', 'type'], 'Consultation'], '#ef8354',
    '#ffcc00' // Default highlight color
  ];


  export {documentColorMapping};