import {A2DSceneNodeModel, ASceneNodeController} from "src/anigraph";

export class Base2DAppNodeController<NodeModelType extends A2DSceneNodeModel> extends ASceneNodeController<NodeModelType> {
    enableSelectionMode(){
        super.enableSelectionMode();
        // (this.sceneController as Base2DAppSceneController<NodeModelType>).getSelectionController().initNodeControllerInSelectionInteractions(this);
    }

    initInteractions() {
        super.initInteractions();
    }
}
