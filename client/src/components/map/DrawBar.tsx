import MapboxDraw from "@mapbox/mapbox-gl-draw";
import FreehandMode from 'mapbox-gl-draw-freehand-mode'
import CutPolygonMode, { drawStyles as cutPolygonDrawStyles } from "mapbox-gl-draw-cut-polygon-mode";
import { CutBar } from "mapbox-gl-draw-cut-polygon-mode";
import { KxTheme } from "mapbox-gl-draw-cut-polygon-mode";

var DrawPolygone = new MapboxDraw({
    displayControlsDefault: true,
    modes: {
        ...CutPolygonMode(MapboxDraw.modes),
        draw_polygon: FreehandMode
    },
    styles: [...cutPolygonDrawStyles(KxTheme)],
    userProperties: true,
    controls: {
        polygon: true,
        trash: true,
        line_string: false,
        point: true,
        combine_features: false,
        uncombine_features: false,
    }


});

var PreviewMapDraw = new MapboxDraw({
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

const splitPolygon = () => {
    try {
      DrawPolygone?.changeMode("cut_polygon");
    } catch (err) {
      console.error(err);
    }
};
var DrawBarPolygon = (saveAction: (path: any) => void, cancelAction: () => void)  => new CutBar({
    draw: DrawPolygone,
    buttons: [
      {
        on: "click",
        action: splitPolygon,
        classes: ["split-icon"],
      },
      {
        on: 'click',
        action: saveAction,
        classes: ['save-icon'],
      },
      {
        on: 'click',
        action: cancelAction,
        classes: ['cancel-icon'],
      }
    ],
  });

  

 export { DrawPolygone, DrawBarPolygon, PreviewMapDraw }; 