import {A2DSceneView, ASerializable} from "src/anigraph";
import {A2AppSceneNodeModel} from "../scenenode";
import {A2AppSceneModel} from "./A2AppSceneModel";

@ASerializable("A2AppSceneView")
export class A2AppSceneView<NodeModelType extends A2AppSceneNodeModel, SceneModelType extends A2AppSceneModel<NodeModelType>> extends A2DSceneView<NodeModelType, SceneModelType>{
    constructor() {
        super();
    }
}
