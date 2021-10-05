import {ASceneModel} from "../../base";
import {A2DSceneNodeModel} from "../scenenode";
import {Color, Mat3, V2, Vec2, VertexArray2D} from "../../../amath";


export abstract class A2DSceneModel<NodeModelType extends A2DSceneNodeModel> extends ASceneModel<NodeModelType>{
    // protected _DefaultNodeClass: = NodeModelType;
    // protected abstract _DefaultNodeClass:AModelClassInterface<NodeModelType>;

    abstract NewNode():NodeModelType;

    CreateTestModel(position?:Vec2, color?:Color){
        position = position?position:V2();
        color = color?color:Color.FromString('#55aa55');
        let newShape = this.NewNode();
        let sz = 25;
        let sq=0.5;
        let tform = Mat3.Translation2D(position).times(Mat3.Rotation(Math.PI/3)).times(Mat3.Translation2D(sz*3, sz*2));
        let verts = new VertexArray2D();
        verts.position.push(V2(-sz, -sz));
        verts.position.push(V2(0,-sz*sq));
        verts.position.push(V2(sz, -sz));
        verts.position.push(V2(sz*sq, 0));
        verts.position.push(V2(sz, sz));
        verts.position.push(V2(-sz, sz));
        newShape.color = color;
        newShape.verts = verts.GetLeftMultipliedBy(tform);
        newShape.recenterAnchor();
        // newShape.verts = verts;
        // this.sceneController.model.addNode(newShape);
        return newShape;
    }

    CreateTestSquare(position?:Vec2, color?:Color){
        position = position?position:V2();
        color = color?color:Color.FromString('#55aa55');
        let newShape = this.NewNode();
        let sz = 25;
        let verts = new VertexArray2D();
        verts.position.push(V2(sz, -sz));
        verts.position.push(V2(-sz, -sz));
        verts.position.push(V2(-sz, sz));
        verts.position.push(V2(sz, sz));

        newShape.color = color;
        newShape.verts = verts;
        newShape.recenterAnchor();
        // newShape.verts = verts;
        // this.sceneController.model.addNode(newShape);
        return newShape;
    }

}


//
// export class A2DSceneModel<NodeModelType extends A2DSceneNodeModel> extends ABase2DSceneModel<NodeModelType>{
//     protected _DefaultNodeClass:AModelClassInterface<NodeModelType>=A2DSceneNodeModel;
// }
