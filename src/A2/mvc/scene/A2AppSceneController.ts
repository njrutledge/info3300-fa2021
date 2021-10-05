import {Base2DAppSceneController} from "src/anigraph/apps/Base2DApp";
import {A2DSelectionModel, ASerializable} from "../../../anigraph";
import {A2AppSelectionController} from "../selection";
import {A2AppSceneNodeModel} from "../scenenode";
import {A2AppSceneView} from "./A2AppSceneView";
import {A2AppSceneModel} from "./A2AppSceneModel";

@ASerializable("A2AppSceneController")
export class A2AppSceneController<NodeModelType extends A2AppSceneNodeModel, SceneModelType extends A2AppSceneModel<NodeModelType>> extends Base2DAppSceneController<NodeModelType,SceneModelType>{
    protected selectionController!:A2AppSelectionController<NodeModelType>;
    public view!: A2AppSceneView<NodeModelType, SceneModelType>;

    constructor(container: HTMLElement) {
        super(container);
    }

    initClassSpec() {
    }

    initDefaultScene(){
    }

    initView() {
        if(!this.view) {
            this.view = new A2AppSceneView<NodeModelType, SceneModelType>();
            this.view.controller = this;
            this.view.init();
        }
        this.container.appendChild(this.view.getDOMElement());
    }

    initInteractions() {
        super.initInteractions();
        this.initSelectionController();
    }

    initSelectionController(){
        this.selectionController = new A2AppSelectionController();
        this.selectionController.sceneController = this;
        this.selectionController.init((this.appState.selectionModel as A2DSelectionModel<NodeModelType>));
        this.registerSupController(this.selectionController)
    }
}
