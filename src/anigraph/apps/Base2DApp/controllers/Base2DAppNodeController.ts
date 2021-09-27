import {
    A2DSceneController,
    A2DSceneModel,
    A2DSceneNodeModel, ADragInteraction, AInteractionEvent,
    AniGraphEnums,
    ASceneNodeController,
    GetAppState
} from "src/anigraph";
import {Base2DAppModel} from "../models";
import {Base2DAppAppState} from "../Base2DAppAppState";

export class Base2DAppNodeController<NodeModelType extends A2DSceneNodeModel> extends ASceneNodeController<NodeModelType> {
    enableSelectionMode(){
        super.enableSelectionMode();
        // (this.sceneController as Base2DAppSceneController<NodeModelType>).getSelectionController().initNodeControllerInSelectionInteractions(this);
    }


    static CreateShapeInteraction<NodeType extends A2DSceneNodeModel>(sceneController:A2DSceneController<NodeType, A2DSceneModel<NodeType>>, CreateShapeName?:string){
        CreateShapeName=CreateShapeName?CreateShapeName:AniGraphEnums.CreateShapeInteractionName;
        const appState = GetAppState() as unknown as Base2DAppAppState;
        return ADragInteraction.Create(sceneController.backgroundElement,
            (interaction:ADragInteraction, event: AInteractionEvent) => {
                if(interaction.getInteractionState("newShape")===undefined){
                    let newShape = sceneController.model.NewNode();
                    newShape.verts.position.push(event.cursorPosition);
                    newShape.verts.position.push(event.cursorPosition);
                    newShape.color = appState.selectedColor;
                    sceneController.model.addNode(newShape);
                    sceneController.selectModel(newShape);
                    appState.freezeSelection();
                    interaction.setInteractionState("newShape", newShape);
                    // sceneController.disableDraggingOnSelected();
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

            },
            CreateShapeName);
    }

    initInteractions() {
        super.initInteractions();
    }
}
