import * as THREE from "three";
import {Mat3, Mat4, TransformationInterface} from "../amath";
import {NewObject3D} from "./ThreeJSWrappers";


export abstract class ARenderObject{
    /**
     * This should be what is added to the threejs scene
     */
    abstract get threejs():THREE.Object3D;

    /**
     * This should be whatever receives events
     */
    get eventHandler(){return this.threejs;}

    setMatrix(mat:Mat3|Mat4){
        if(mat instanceof Mat3){
            Mat4.FromMat3(mat).assignTo(this.threejs.matrix);;
        }else{
            mat.assignTo(this.threejs.matrix);
        }

    }

    get matrix(){return
        Mat4.FromTHREE(this.threejs.matrix);
    }

    get uid(){
        return this.threejs.uuid;
    }

    add(toAdd:ARenderObject){
        this.threejs.add(toAdd.threejs);
    }
    remove(toRemove:ARenderObject){
        this.threejs.remove(toRemove.threejs);
    }


    /** Get set visible */
    set visible(value){this.threejs.visible = value;}
    get visible(){return this.threejs.visible;}

    public setTransform(T:TransformationInterface){
        let mat = T.getMatrix();
        if(mat instanceof Mat3){
            mat = Mat4.FromMat3(mat);
        }
        (mat as Mat4).assignTo(this.threejs.matrix);
    };

    dispose(){
        if(this.threejs){
            // this._mesh.dispose();
            this.threejs.parent?.remove(this.threejs);
        }
    }
}
