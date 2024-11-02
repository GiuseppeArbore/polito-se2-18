class CutBar {
    draw: any;
    buttons: any;
    onAddOrig: any;
    onRemoveOrig: any;
    map: any;
    elContainer: any;
    
    constructor(opt: { draw: any; buttons: any; }) {
      let ctrl = this;
      ctrl.draw = opt.draw;
      ctrl.buttons = opt.buttons || [];
      ctrl.onAddOrig = opt.draw.onAdd;
      ctrl.onRemoveOrig = opt.draw.onRemove;
    }
    onAdd(map: any) {
      let ctrl = this;
      ctrl.map = map;
      ctrl.elContainer = ctrl.onAddOrig(map);
      ctrl.buttons.forEach((b: any) => {
        ctrl.addButton(b);
      });
      return ctrl.elContainer;
    }
    onRemove(map: any) {
      let ctrl = this;
      ctrl.buttons.forEach((b: any) => {
        ctrl.removeButton(b);
      });
      ctrl.onRemoveOrig(map);
    }
    addButton(opt: { classes: any[]; on: any; action: (this: HTMLButtonElement, ev: any) => any; elButton: HTMLButtonElement; }) {
      let ctrl = this;
      var elButton = document.createElement("button");
      elButton.className = "mapbox-gl-draw_ctrl-draw-btn";
      if (opt.classes instanceof Array) {
        opt.classes.forEach((c: string) => {
          elButton.classList.add(c);
        });
      }
      elButton.addEventListener(opt.on, opt.action);
      ctrl.elContainer.appendChild(elButton);
      opt.elButton = elButton;
    }
    removeButton(opt: { elButton: { removeEventListener: (arg0: any, arg1: any) => void; remove: () => void; }; on: any; action: any; }) {
      opt.elButton.removeEventListener(opt.on, opt.action);
      opt.elButton.remove();
    }
  }
export default CutBar;