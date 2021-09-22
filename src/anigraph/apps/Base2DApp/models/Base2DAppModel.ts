import {A2DPolygonModel, AObjectState, ASerializable} from "src/anigraph";
import {BoundingBox2D} from "../../../amath/BoundingBox2D";


@ASerializable("Base2DAppModel")
export class Base2DAppModel extends A2DPolygonModel {
    // @AObjectState scaleFactor:number;
    @AObjectState bounds:BoundingBox2D;

    constructor(){
        super();
        // this.scaleFactor=1.0;
        this.bounds = new BoundingBox2D();
    }



    getModelGUIControlSpec(){
        let self = this;
        return {
            ModelName: {
                value:self.name,
                onChange:(v:string)=>{
                    self.name = v;
                }
            }
            // scaleFactor: {
            //     value: self.scaleFactor,
            //     min: 0.0,
            //     max: 2.0,
            //     onChange: (v: number) => {
            //         self.scaleFactor = v;
            //     }
            // }
        }
        // return {};
    }
}

export interface Base2DAppModelInterface extends Base2DAppModel{

}
