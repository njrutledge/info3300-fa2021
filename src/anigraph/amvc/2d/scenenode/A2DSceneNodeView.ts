/**
 * A2DSceneNodeView has 2D content. It initalizes a subscription to the model's transform.
 * @module
 */
import {ASceneNodeView} from "../../base/scenenode/ASceneNodeView";
import {A2DSceneNodeModel} from "./A2DSceneNodeModel";
import {ADragInteraction} from "../../../ainteraction/ADragInteraction";
import {AInteractionEvent} from "../../../ainteraction";
import {Mat4} from "../../../amath";
import {NewObject3D} from "../../../arender/ThreeJSWrappers";
import {ASceneNodeController} from "../../base/scenenode";
import {ASerializable} from "../../../aserial";

@ASerializable("A2DSceneNodeView")
export abstract class A2DSceneNodeView<NodeModelType extends A2DSceneNodeModel> extends ASceneNodeView<NodeModelType>{
    abstract controller:ASceneNodeController<NodeModelType>;
    get model(){
        return this.controller.model;
    }

    constructor() {
        super();
        this.threejs = NewObject3D();
        this.threejs.name = this.serializationLabel;
    }

    init(){
        super.init();
    }

    addDragPositionInteraction(){
        const model = this.model;
        this.controller.addInteraction(ADragInteraction.Create(this.threejs,
            function(interaction:ADragInteraction, event:AInteractionEvent){
                interaction.setInteractionState('startValue', model.transform.position);
                interaction.setInteractionState('startCursor', event.cursorPosition);
            },
            function(interaction:ADragInteraction, event:AInteractionEvent){
                model.transform.position = interaction.getInteractionState('startValue').plus(event.cursorPosition).minus(interaction.getInteractionState('startCursor'));
            }
        ))
    }

    initGraphics() {
        super.initGraphics();
        const model = this.model;
        this.controller.subscribe(
            this.model.addStateKeyListener('transform', ()=>{
                // this.threejs.position.set(model.transform.position.x, model.transform.position.y, 0);
                Mat4.FromMat3(model.transform.getMatrix()).assignTo(this.threejs.matrix);
            }),
            'model.transform'
        );
    }

}


