import * as THREE from "three";
import {Mat3, Mat4, TransformationInterface} from "../amath";
import {ARenderObject} from "./ARenderObject";


export abstract class ARenderElement extends ARenderObject{
    protected abstract _geometry:THREE.BufferGeometry;
    protected abstract _material:THREE.Material;
    dispose(){
        super.dispose();
        if(this._geometry){
            this._geometry.dispose();
        }
        if(this._material){
            this._material.dispose();
        }
    }

    get geometery(){return this._geometry;}
    get material(){return this._material;}
}
