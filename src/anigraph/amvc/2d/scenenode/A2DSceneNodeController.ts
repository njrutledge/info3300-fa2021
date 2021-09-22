import {ASceneNodeController} from "../../base/scenenode/ASceneNodeController";
import {A2DSceneNodeModel} from "./A2DSceneNodeModel";
import {ADragInteraction} from "../../../ainteraction/ADragInteraction";
import {AInteractionEvent} from "../../../ainteraction";

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


    initInteractions() {
        super.initInteractions();
        // this.addDragPositionInteraction();
    }

}
