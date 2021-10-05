import {ASceneNodeModel} from "../../base/scenenode/ASceneNodeModel";
import {Color, NodeTransform2D, V2, VertexArray2D} from "../../../amath";
import {AObjectState} from "../../../aobject";
import {BoundingBox2D} from "../../../amath/BoundingBox2D";

export abstract class A2DSceneNodeModel extends ASceneNodeModel{
    @AObjectState transform:NodeTransform2D
    @AObjectState verts!:VertexArray2D;
    @AObjectState color!:Color;
    abstract getBounds():BoundingBox2D;
    constructor() {
        super();
        this.transform = new NodeTransform2D();
    }

    recenterAnchor(){
        //TODO: Have the students write this
        let centerPoint = this.getBounds().center??V2();
        this.transform = new NodeTransform2D(this.transform.getMatrix(), centerPoint);
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
        }
    }

}


