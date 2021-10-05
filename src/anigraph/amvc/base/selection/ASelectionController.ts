import {ASerializable} from "../../../aserial";
import {ASelectionModel} from "./ASelectionModel";
import {ASelectionView} from "./ASelectionView";
import {AInteractionEvent} from "../../../ainteraction";
import {ASupplementalController} from "../supplementals/ASupplementalController";
import {ASceneNodeController, ASceneNodeModel} from "../scenenode";

// export interface ASceneNodeControllerInterface extends AControllerInterface{
//     sceneController:ASceneController;
// }



@ASerializable("ASelectionController")
export abstract class ASelectionController<NodeModelType extends ASceneNodeModel, SelectionModelType extends ASelectionModel<NodeModelType>> extends ASupplementalController<ASelectionModel<NodeModelType>,NodeModelType>{
    protected _model!:SelectionModelType;
    public view!:ASelectionView<NodeModelType, SelectionModelType>;
    get model(){return this._model;}

    // /**
    //  * You should never call init() inside of the constructor! This
    //  */
    constructor(){
        super();
        // if(model){
        //     this._model = model;
        // }else{
        //     this._model = (AAppState.GetAppState().selectionModel as unknown as ASelectionModel<NodeModelType>);
        // }
    }

    selectModel(model?:NodeModelType, event?:AInteractionEvent){
        let editExistingSelection = false;
        if(event){
            editExistingSelection = event.shiftKey;
        }
        this.model.selectModel(model, editExistingSelection);
    }

    /**
     * This is probably where you want to update the selection view
     */
    // onSelectionChanged(){
    //     console.log("onSelectionChanged in ASelectionController");
    // }

    abstract initNodeControllerInSelectionInteractions(controller:ASceneNodeController<NodeModelType>):void;


    init(selectionModel:SelectionModelType, selectionView?:ASelectionView<NodeModelType, SelectionModelType>){
        // this.initModel();
        super.init(selectionModel, selectionView);
    }
    // initModel(){
    //     if(!this.model){
    //         // throw new Error("No selection model provided");
    //         this._model = (AAppState.GetAppState().selectionModel as unknown as ASelectionModel<NodeModelType>);
    //     }
    //     // this._model = new ASelectionModel();
    // }


    release(){
        super.release();
    }
}

