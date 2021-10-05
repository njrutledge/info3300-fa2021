import {AController} from "../AController";
import {ASceneNodeView} from "./ASceneNodeView";
import {ASceneNodeModel} from "./ASceneNodeModel";
import {AInteractionEvent, AStaticClickInteraction} from "../../../ainteraction";
import {SelectionEvents} from "../selection";
import {ASceneController, ASceneModel} from "../scene";

// export interface ASceneNodeControllerInterface extends AControllerInterface{
//     sceneController:ASceneController;
// }

export enum SceneNodeControllerInteractionModes{
    inSelection='InSelection',
    EditingNode='EditingNode',
}


export abstract class ASceneNodeController<NodeModelType extends ASceneNodeModel> extends AController<NodeModelType>{
    protected _model!:NodeModelType;
    public view!:ASceneNodeView<NodeModelType>;
    protected _sceneController!:ASceneController<NodeModelType, ASceneModel<NodeModelType>>;


    /**
     * only call if you want to enable selection
     */
    enableSelectionMode(){
        const self = this;
        const model = this.model;
        this.addInteraction(AStaticClickInteraction.Create(this.view.threejs,
            function(event:AInteractionEvent){
                self.sceneController.selectModel(model, event);
            }, "SelectNode"
        ))

        this.subscribe(this.model.addEventListener(SelectionEvents.SelectionItemEnter, ()=>{
            self.setCurrentInteractionMode(SceneNodeControllerInteractionModes.inSelection);
        }))
        this.subscribe(this.model.addEventListener(SelectionEvents.SelectionItemExit, ()=>{
            self.setCurrentInteractionMode();
        }))

        this.sceneController.getSelectionController().initNodeControllerInSelectionInteractions(this);
    }

    initInteractions() {
    }

    get model():NodeModelType{
        return this._model;
    };

    getParent(){
        if(this.model.parent) {
            return this.sceneController.getNodeControllerForModel(this.model.parent as NodeModelType);
        }else{
            return undefined;
        }
    }

    constructor() {
        super();
    }

    init(model:NodeModelType, view:ASceneNodeView<NodeModelType>){
        super.init(model, view);
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



    initView() {
        this.view.init();
    };
}

