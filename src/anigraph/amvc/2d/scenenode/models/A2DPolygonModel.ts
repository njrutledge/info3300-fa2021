import {A2DSceneNodeModel} from "../A2DSceneNodeModel";
import {Color, VertexArray2D} from "../../../../amath";
import {AObjectState} from "../../../../aobject";
import {ASerializable} from "../../../../aserial";
import {BoundingBox2D} from "../../../../amath/BoundingBox2D";


@ASerializable("A2DPolygonModel")
export class A2DPolygonModel extends A2DSceneNodeModel{
    @AObjectState verts:VertexArray2D;
    @AObjectState color:Color;

    getBounds(){
        let b = new BoundingBox2D();
        b.transform = this.transform;
        b.boundVertexPositionArrray(this.verts.position);
        return b;
    }

    constructor() {
        super();
        this.verts = new VertexArray2D();
        // this.color = new Color(0.5, 0.5, 0.5);
        this.color = Color.Random();
    }

    // recenter(){
    //     for(let ip=0;ip<this.verts.length;ip++){
    //         let p=this.verts.position.getAt(ip);
    //     }
    // }

}


