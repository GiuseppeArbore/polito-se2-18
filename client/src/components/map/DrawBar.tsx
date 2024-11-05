import MapboxDraw from "@mapbox/mapbox-gl-draw";
import FreehandMode from 'mapbox-gl-draw-freehand-mode'
import CutPolygonMode, { drawStyles as cutPolygonDrawStyles } from "mapbox-gl-draw-cut-polygon-mode";
import { CutBar } from "mapbox-gl-draw-cut-polygon-mode";

var PreviewMapDraw = new MapboxDraw({
  modes: {
    ...CutPolygonMode(MapboxDraw.modes),
    draw_polygon: FreehandMode
  },
  displayControlsDefault: false,
  controls: {
    polygon: false,
    trash: false,
    line_string: false,
    point: false,
    combine_features: false,
    uncombine_features: false,
}
});

export { PreviewMapDraw }; 