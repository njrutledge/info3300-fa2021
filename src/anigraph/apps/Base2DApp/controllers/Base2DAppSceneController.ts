import {
    A2DSceneController,
    A2DSceneModel,
    A2DSceneNodeModel,
    A2DSceneView,
    ADragInteraction, AInteraction,
    AInteractionEvent, AniGraphEnums,
    ASceneView,
    AStaticClickInteraction
} from "src/anigraph";
import {Base2DAppNodeView} from "../views";
import {Base2DAppModel} from "../models/Base2DAppModel";
import {Base2DAppNodeController} from "./Base2DAppNodeController";
import {Base2DAppAppState} from "../Base2DAppAppState";

class Base2DAppSceneControllerBase<NodeModelType extends A2DSceneNodeModel, SceneModelType extends A2DSceneModel<NodeModelType>> extends A2DSceneController<NodeModelType, SceneModelType> {
    public view!: A2DSceneView<NodeModelType, SceneModelType>;

    initView() {
        this.view = new A2DSceneView<NodeModelType, SceneModelType>();
        this.view.controller = this;
        this.view.init();
        this.container.appendChild(this.view.getDOMElement());
    }

    onNodeAdded(newModel:NodeModelType){
        super.onNodeAdded(newModel);
        // GetAppState().selectedModel = newModel;
    }
}


export class Base2DAppSceneController<NodeModelType extends Base2DAppModel, SceneModelType extends A2DSceneModel<NodeModelType>> extends Base2DAppSceneControllerBase<NodeModelType, SceneModelType> {
    init(sceneModel:SceneModelType, sceneView?:A2DSceneView<NodeModelType, SceneModelType>) {
        super.init(sceneModel,sceneView);
        // let m1 = this.model.CreateTestModel(V2(-10,-10));
        // let m2 = this.model.CreateTestModel(V2(1,1), Color.FromString('#bbaa55'));
        // m1.name = 'Green Shape 1';
        // m1.uid = 'Green Shape 1';
        // m2.name = 'Yellow Shape 2';
        // m2.uid = 'Yellow Shape 2';
        // this.sceneController.model.addNode(m1);
        // this.sceneController.model.addNode(m2);

    }

    initClassSpec() {
        super.initClassSpec();
        this.addClassSpec(Base2DAppModel, Base2DAppNodeView, Base2DAppNodeController);
    }


    updateCreateShapeInteraction(){
        const self = this;
        const appState = (Base2DAppAppState.GetAppState() as unknown as Base2DAppAppState);
        const CreateShapeName = AniGraphEnums.CreateShapeInteractionName;
        if(this.isInteractionModeDefined(CreateShapeName)){
            this.clearInteractionMode(CreateShapeName);
        }
        this.defineInteractionMode(CreateShapeName);
        this.setCurrentInteractionMode(CreateShapeName);

        let CurrentNodeControllerClass = self.ModelClassMap[appState.currentNewModelTypeName].controllerClass;
        let createShapeInteraction:AInteraction;
        if(CurrentNodeControllerClass && 'CreateShapeInteraction' in CurrentNodeControllerClass){
            // @ts-ignore
            createShapeInteraction = CurrentNodeControllerClass.CreateShapeInteraction(this, CreateShapeName);
        }else{
            createShapeInteraction = ADragInteraction.Create(this.backgroundElement,
                (interaction:ADragInteraction, event: AInteractionEvent) => {
                    if(interaction.getInteractionState("newShape")===undefined){
                        let newShape = this.model.NewNode();
                        newShape.verts.position.push(event.cursorPosition);
                        newShape.verts.position.push(event.cursorPosition);
                        newShape.color = appState.selectedColor;
                        self.sceneController.model.addNode(newShape);
                        self.selectModel(newShape);
                        Base2DAppAppState.GetAppState().freezeSelection();
                        interaction.setInteractionState("newShape", newShape);
                        // this.disableDraggingOnSelected();
                    }else{
                        (interaction.getInteractionState("newShape") as Base2DAppModel).verts.addVertex(event.cursorPosition);
                    }
                }, (interaction, event)=>{
                    let newshape:Base2DAppModel = interaction.getInteractionState("newShape");
                    if(newshape) {
                        newshape.verts.position.setAt(newshape.verts.length - 1, event.cursorPosition);
                    }else{
                        throw new Error("Should not be dragging on create shape without a selected model...");
                    }
                }, (interaction, event)=>{
                    // interaction.setInteractionState("newShape", undefined);
                },
                CreateShapeName);
        }

        this.getInteractionMode(CreateShapeName).setBeforeActivateCallback(()=>{
            self.view.setBackgroundOrder(ASceneView.BackgroundOrder.Front);
        });
        this.getInteractionMode(CreateShapeName).setAfterDeactivateCallback(()=>{
            self.view.setBackgroundOrder(ASceneView.BackgroundOrder.Back);
        });
        this.addInteraction(createShapeInteraction);
        this.setCurrentInteractionMode();
    }

    /**
     * Gets called in init() function
     */
    initInteractions() {
        // initialize scene-level interactions here
        // example interaction below
        const self = this;
        this.updateCreateShapeInteraction();
        /**
         * Deselection controller:
         * controller placed on the background element that deselects on click
         */
        this.addInteraction(AStaticClickInteraction.Create(this.backgroundElement, (event: AInteractionEvent) => {
            self.selectModel(undefined, event);
        }))

    }
}

// console.log("Loaded Base2DAppSceneController");
