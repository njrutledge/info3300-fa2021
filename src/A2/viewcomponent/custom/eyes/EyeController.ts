import {A2AppSceneNodeController} from "../../../mvc";
import {EyeModel} from "./EyeModel";
import {ADragInteraction, AInteractionEvent, ASerializable, V2} from "../../../../anigraph";
import {EyeView} from "./EyeView";

@ASerializable("EyeController")
export class EyeController extends A2AppSceneNodeController{
    get model():EyeModel{
        return this._model as EyeModel;
    }


    initInteractions() {
        super.initInteractions();
        let view = this.view as EyeView;
        const self = this;


        // The arguments to interaction Create() functions are always first a threejs object and then the callbacks
        // associated with that interaction
        this.addInteraction(ADragInteraction.Create(view.pupil.threejs,
            (interaction:ADragInteraction, event:AInteractionEvent)=>{
                self.model.targetPoint = event.cursorPosition;
            },
            (interaction:ADragInteraction, event:AInteractionEvent)=>{
                self.model.targetPoint = event.cursorPosition;
            },
            (interaction:ADragInteraction, event?:AInteractionEvent)=>{
                self.model.targetPoint = V2(0,0);
            },
        ));
    }
}
