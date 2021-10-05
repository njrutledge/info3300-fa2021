import {ASelectionController} from "./ASelectionController";
import {ASupplementalView} from "../supplementals";
import {ASceneNodeModel, ASelectionModel} from "../index";


export class ASelectionView<NodeModelType extends ASceneNodeModel, SelectionModelType extends ASelectionModel<NodeModelType>> extends ASupplementalView<SelectionModelType, NodeModelType>{
    public controller!:ASelectionController<NodeModelType, SelectionModelType>;
    /**
     * initGraphics() is called AFTER the constructor and used to initialize any three.js objects for rendering
     */
    initGraphics():void{};
    init(){
        super.init();
        this.sceneView.addChildView(this);
    }



    /**
     * The contructor should always work without arguments
     */
    constructor(){
        super();
    }
}
