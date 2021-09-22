import * as THREE from "three";
import {Mat3, Mat4, TransformationInterface} from "../amath";


export abstract class ARenderElement{
    protected abstract _geometry:THREE.BufferGeometry;
    protected abstract _material:THREE.Material;
    /**
     * This should be what is added to the threejs scene
     */
    abstract get threejs():THREE.Object3D;

    /**
     * This should be whatever receives events
     */
    abstract get eventHandler():THREE.Object3D;


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
        if(this._geometry){
            this._geometry.dispose();
        }
        if(this._material){
            this._material.dispose();
        }
        if(this.threejs){
            // this._mesh.dispose();
            this.threejs.parent?.remove(this.threejs);
        }

    }

    get geometery(){return this._geometry;}
    // setGeometry(value:THREE.BufferGeometry){
    //     this._geometry=value;
    // }
    // get mesh(){return this._mesh;}
    // setMesh(value:THREE.Mesh){
    //     this._mesh=value;
    // }
    get material(){return this._material;}
    // setMaterial(value){
    //     this._material = value;
    // }
}
