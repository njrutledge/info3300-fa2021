/**
 * ## Model for 2D lines
 * Note that lineWidth appears to be given in terms of normalized screen coordinates of some sort, so a typical line might be around 0.0075 thickness.
 */
import {ASerializable} from "../../../../aserial";
import {A2DSceneNodeModel} from "../A2DSceneNodeModel";
import {AObjectState} from "../../../../aobject";
import {Color, VertexArray2D} from "../../../../amath";
import {BoundingBox2D} from "../../../../amath/BoundingBox2D";

@ASerializable("A2DLinesModel")
export class A2DLinesModel extends A2DSceneNodeModel{
    // @AObjectState verts:VertexArray2D;
    // @AObjectState color:Vec3
    @AObjectState lineWidth:number;
    @AObjectState dashed:boolean;

    getBounds(){
        let b = new BoundingBox2D();
        b.transform = this.transform;
        b.boundVertexPositionArrray(this.verts.position);
        return b;
    }




    constructor() {
        super();
        this.lineWidth=0.0075;
        this.dashed = false;
        this.verts = new VertexArray2D();
        this.color = new Color(0.5, 0.5, 0.5);
        // this.color = new Vec3(0.5, 0.5, 0.5);
    }
}

