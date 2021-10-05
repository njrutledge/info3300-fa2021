import {A2AppSceneNodeView} from "../../../mvc/scenenode/A2AppSceneNodeView";
import {APolygonElement, ASerializable, Color, GetAppState} from "../../../../anigraph";
import {FancyModel} from "./FancyModel";

@ASerializable("FancyView")
export class FancyView extends A2AppSceneNodeView{
    get model(){
        return this.controller.model as FancyModel;
    }
    constructor() {
        super();
        const self = this;
        this.subscribe(GetAppState().addClockListener((t:number)=>{
            self.element.setColor(this.model.color.Spun(this.model.colorSpeed*t/(2*Math.PI*100)));
        }),
            "colorshift");

        // You could use unsubscribe() like below to remove the subscription
        // this.unsubscribe("colorshift")
    }

}
