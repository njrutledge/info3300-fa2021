import {A2AppSceneNodeModel} from "../../../mvc";
import {AObjectState, ASerializable, Color, GetAppState} from "../../../../anigraph";


@ASerializable("EditVertsModel")
export class EditVertsModel extends A2AppSceneNodeModel{
    @AObjectState inEditMode:boolean;
    constructor() {
        super();
        this.inEditMode=false;
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
            inEditMode: {
                value: self.inEditMode,
                onChange: (v: boolean) => {
                    self.inEditMode=v;
                }
            },
        }
        return {...customSpec, ...super.getModelGUIControlSpec()}
    }

}
