import {ASceneController} from "../../base/scene";
import {A2DSceneNodeModel} from "../scenenode";
import {A2DSceneView} from "./A2DSceneView"
import {A2DSelectionController} from "../selection";
import {AInteractionEvent} from "../../../ainteraction";
import {A2DSceneModel} from "./A2DSceneModel";


export class A2DSceneController<NodeModelType extends A2DSceneNodeModel, SceneModelType extends A2DSceneModel<NodeModelType>> extends ASceneController<NodeModelType, SceneModelType>{
    public view!:A2DSceneView<NodeModelType, SceneModelType>;
    protected _model!:SceneModelType;
    protected selectionController!:A2DSelectionController<NodeModelType>;

    get model():SceneModelType{
        return this._model;
    };

    selectModel(model?:NodeModelType, event?:AInteractionEvent){
        this.selectionController.selectModel(model, event);
    }

    getSelectedModelController(){
        let selectedModel = this.selectionController.model.singleSelectedModel;
        if(selectedModel){
            return this.sceneController.getNodeControllerForModel(selectedModel);
        }
    }



    getSelectionController(){
        return this.selectionController;
    }

    init(sceneModel:SceneModelType, sceneView?:A2DSceneView<NodeModelType, SceneModelType>){
        super.init(sceneModel, sceneView);
        // this.initDefaultScene();
    }

    initSelectionController(){
        this.selectionController = new A2DSelectionController<NodeModelType>();
        this.registerSupController(this.selectionController)
    }

    initView(){
        this.view = new A2DSceneView();
        this.view.controller = this;
        this.view.init();
        this.container.appendChild(this.view.getDOMElement());
    }

    initClassSpec() {
    }

    initInteractions() {
        if(!this.selectionController){
            this.initSelectionController();
        }
    }
}
