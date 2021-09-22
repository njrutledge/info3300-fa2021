import {AController, AModel, ASceneModel, ASceneNodeModel} from "../index"
import {ASerializable} from "../../../aserial";
import {ASceneController, ASceneControllerInterface} from "../scene";

@ASerializable("ASupplementalController")
export abstract class ASupplementalController<ModelType extends AModel, NodeModelType extends ASceneNodeModel> extends AController<ModelType>{
    protected _sceneController!:ASceneController<NodeModelType, ASceneModel<NodeModelType>>;
    /**
     * We treat the parent of supplemental controllers to be the scene controller.
     * This is to make supplemental controllers compatable with the scene node controller interface.
     * @returns {ASceneControllerInterface}
     */
    getParent(){
        return this.sceneController;
    }


    //##################//--Scene Controller Access--\\##################
    //<editor-fold desc="Scene Controller Access">

    /** Get set sceneController */
    set sceneController(value){this._sceneController = value;}
    get sceneController(){return this._sceneController;}

    /**
     * Go through the scene controller to access the application state.
     * @returns {AAppState}
     */
    get appState(){return this.sceneController.appState;}
    getContextDOMElement(){
        return this.sceneController.getDOMElement();
    }
    //</editor-fold>
    //##################\\--Scene Controller Access--//##################

    constructor(sceneController?:ASceneController<NodeModelType, ASceneModel<NodeModelType>>) {
        super();
        if(sceneController){
            this.sceneController=sceneController
        }
    }
}




