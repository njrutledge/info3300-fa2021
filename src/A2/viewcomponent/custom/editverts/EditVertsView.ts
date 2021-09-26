import {A2AppSceneNodeView} from "../../../mvc/scenenode/A2AppSceneNodeView";
import {AHandleElement, APolygonElement, ASerializable, Color, GetAppState, Mat4} from "../../../../anigraph";
import {EditVertsModel} from "./EditVertsModel";
import {EditVertsController} from "./EditVertsController";

@ASerializable("EditVertsView")
export class EditVertsView extends A2AppSceneNodeView {
    public controller!:EditVertsController
    // let's give the EditVertsView an array of handle elements...
    public vertexHandles: AHandleElement[];


    get model() {
        return this.controller.model as EditVertsModel;
    }


    constructor() {
        super();
        this.vertexHandles = [];
    }

    _updateGeometry() {
        super._updateGeometry();

        let handlesEnter = this.model.verts.length - this.vertexHandles.length;
        if (handlesEnter > 0) {
            for (let nh = 0; nh < handlesEnter; nh++) {
                let newHandle = new AHandleElement(5, Color.FromString("#888888"));
                newHandle.index = this.vertexHandles.length;
                this.controller.initHandleInteractions(newHandle);
                this.addElement(newHandle);
                this.vertexHandles.push(newHandle);
            }
        }
        for (let h = 0; h < this.vertexHandles.length; h++) {
            this.vertexHandles[h].threejs.matrix = Mat4.Translation2D(this.model.verts.getPoint2DAt(h)).toTHREE();
        }
    }

}
