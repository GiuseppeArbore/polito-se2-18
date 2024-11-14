import MapboxDraw from "@mapbox/mapbox-gl-draw";
import FreehandMode from 'mapbox-gl-draw-freehand-mode'
import CutPolygonMode, { drawStyles as cutPolygonDrawStyles } from "mapbox-gl-draw-cut-polygon-mode";
import { passing_draw_polygon } from "mapbox-gl-draw-passing-mode";
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode';
import customDrawStyles from '../../utils/drawStyles';
import SelectFeatureMode, {
  drawStyles as selectFeatureDrawStyles,
} from "mapbox-gl-draw-select-mode";



var PreviewMapDraw = new MapboxDraw({
  modes: {
    ...CutPolygonMode(MapboxDraw.modes, passing_draw_polygon),
    draw_polygon: FreehandMode,
  },
  displayControlsDefault: false,
  controls: {
    polygon: false,
    trash: false,
    line_string: false,
    point: false,
    combine_features: false,
    uncombine_features: false,
},
});

var DashboardMapDraw = new MapboxDraw({
  modes: {
    ...SelectFeatureMode(MapboxDraw.modes),
  },
  displayControlsDefault: false,
  controls: {
    polygon: false,
    trash: false,
    line_string: false,
    point: false,
    combine_features: false,
    uncombine_features: false,
},
styles: [...selectFeatureDrawStyles(customDrawStyles)],
userProperties: true,
selectHighlightColor: "red",
selectionRadius: 15,
});


var DocumentMapDraw = new MapboxDraw({
  modes: {
    ...CutPolygonMode(MapboxDraw.modes, passing_draw_polygon),
    draw_polygon: FreehandMode,
    static: StaticMode
  },
  displayControlsDefault: false,
  controls: {
    polygon: false,
    trash: false,
    line_string: false,
    point: false,
    combine_features: false,
    uncombine_features: false,
},
  userProperties: true,
  styles: customDrawStyles
});

export { PreviewMapDraw,DashboardMapDraw,DocumentMapDraw }; 