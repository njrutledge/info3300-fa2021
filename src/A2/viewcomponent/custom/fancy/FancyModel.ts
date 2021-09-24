import {A2AppSceneNodeModel} from "../../../mvc";
import {AObjectState, ASerializable, Color, GetAppState} from "../../../../anigraph";


@ASerializable("FancyModel")
export class FancyModel extends A2AppSceneNodeModel{
    @AObjectState colorSpeed:number;
    constructor() {
        super();
        this.colorSpeed=1;
    }

    getModelGUIControlSpec(){
        const self = this;
        const customSpec = {
            ModelName: {
                value:self.name,
                onChange:(v:string)=>{
                    self.name = v;
                }
            },
            colorSpeed: {
                value: self.colorSpeed,
                min: 0,
                max: 10,
                onChange: (v: number) => {
                    self.colorSpeed = v;
                }
            }
        }
        return {...customSpec, ...super.getModelGUIControlSpec()}
    }

}
