import {ASceneNodeController} from "../../base/scenenode/ASceneNodeController";
import {A2DSceneNodeModel} from "./A2DSceneNodeModel";
import {ADragInteraction} from "../../../ainteraction/ADragInteraction";
import {AInteractionEvent} from "../../../ainteraction";
import {A2DSceneController, A2DSceneModel} from "../scene";
import {GetAppState} from "../../AAppState";
import {AniGraphEnums} from "../../../basictypes";
import {A2DAppState} from "../../A2DAppState";
import {Base2DAppModel} from "../../../apps/Base2DApp";

export class A2DSceneNodeController<NodeModelType extends A2DSceneNodeModel> extends ASceneNodeController<NodeModelType>{
    addDragPositionInteraction(){
        const model = this.model;
        this.addInteraction(ADragInteraction.Create(this.view.threejs,
            function(interaction:ADragInteraction, event:AInteractionEvent){
                interaction.setInteractionState('startValue', model.transform.position);
                interaction.setInteractionState('startCursor', event.cursorPosition);
            },
            function(interaction:ADragInteraction, event:AInteractionEvent){
                model.transform.position = interaction.getInteractionState('startValue').plus(event.cursorPosition).minus(interaction.getInteractionState('startCursor'));
            }
        ))
    }

    static CreateShapeInteraction<NodeType extends A2DSceneNodeModel>(sceneController:A2DSceneController<NodeType, A2DSceneModel<NodeType>>, CreateShapeName?:string){
        CreateShapeName=CreateShapeName?CreateShapeName:AniGraphEnums.CreateShapeInteractionName;
        const appState = GetAppState();
        const createShapeInteraction = ADragInteraction.Create(sceneController.backgroundElement,
            (interaction:ADragInteraction, event: AInteractionEvent) => {
                if(interaction.getInteractionState("newShape")===undefined){
                    let newShape = sceneController.model.NewNode();
                    newShape.verts.position.push(event.cursorPosition);
                    newShape.verts.position.push(event.cursorPosition);
                    // newShape.color = appState.selectedColor;
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
        // this.addDragPositionInteraction();
    }

}
