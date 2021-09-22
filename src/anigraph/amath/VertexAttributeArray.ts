import {Vector} from "./Vector";
import {Vec2} from "./Vec2";
import {Vec3} from "./Vec3";
import * as THREE from "three";
import {Mat3} from "./Mat3";
import {Vec4} from "./Vec4";


export abstract class VertexAttributeArray<V extends Vector> extends Vector{
    static ElementsPerVertex:number=-1;
    abstract getAt(i:number):V;
    abstract setAt(i:number, vertex:V):void;

    abstract get nVerts():number;

    push(vertex:V){
        for(let i=0;i<vertex.elements.length;i++){
            this.elements.push(vertex.elements[i]);
        }
    }

    Float32Array(){
        return new Float32Array(this.elements);
    }

    BufferAttribute(itemSize:number){
        return new THREE.BufferAttribute( new Float32Array(this.elements), itemSize);
    };
}


export class VertexAttributeArray2D extends VertexAttributeArray<Vec2>{
    static ElementsPerVertex:number=2;
    constructor(elements?:number[])
    constructor(...args:any[]) {
        super(...args);
    }

    push(vertex:Vec2){
        this.elements.push(vertex.elements[0]);
        this.elements.push(vertex.elements[1]);
    }

    getAt(i:number){
        return new Vec2(this.elements[i*2], this.elements[(i*2)+1]);
    }
    setAt(i:number, vertex:Vec2){
        this.elements[i*2]=vertex.elements[0];
        this.elements[(i*2)+1]=vertex.elements[1];
    }

    get nVerts(){
        return this.elements.length/2;
    }
}

export class VertexAttributeArray3D extends VertexAttributeArray<Vec3>{
    static ElementsPerVertex:number=3;
    getAt(i:number){
        return new Vec3(this.elements[i*3], this.elements[(i*3)+1], this.elements[(i*3)+2]);
    }
    setAt(i:number, vertex:Vec3){
        this.elements[i*3]=vertex.elements[0];
        this.elements[(i*3)+1]=vertex.elements[1];
        this.elements[(i*3)+2]=vertex.elements[2];
    }

    BufferAttribute(itemSize:number=3){
        return new THREE.BufferAttribute( new Float32Array(this.elements), itemSize);
    };

    get nVerts(){
        return this.elements.length/3;
    }

}

export class VertexAttributeArray4D extends VertexAttributeArray<Vec4>{
    static ElementsPerVertex:number=4;
    getAt(i:number){
        return new Vec4(this.elements[i*4], this.elements[(i*4)+1], this.elements[(i*4)+2], this.elements[(i*4)+3]);
    }
    setAt(i:number, vertex:Vec4){
        this.elements[i*4]=vertex.elements[0];
        this.elements[(i*4)+1]=vertex.elements[1];
        this.elements[(i*4)+2]=vertex.elements[2];
        this.elements[(i*4)+3]=vertex.elements[3];
    }

    BufferAttribute(itemSize:number=4){
        return new THREE.BufferAttribute( new Float32Array(this.elements), itemSize);
    };

    get nVerts(){
        return this.elements.length/4;
    }

}

export class VertexPositionArray2DH extends VertexAttributeArray3D{
    public _defaultZ:number=0;
    constructor(elements?:number[])
    constructor(...args:any[]) {
        super(...args);
    }

    push(vertex:Vec3|Vec2){
        let newcoords = vertex.elements.slice();
        // this.elements.push(vertex.elements[0]);
        // this.elements.push(vertex.elements[1]);
        if(vertex.elements.length===2){
            // this.elements.push(this._defaultZ);
            newcoords.push(this._defaultZ);
        }
        this.elements = this.elements.concat(newcoords);
        // else if(vertex.elements.length===3){
        //     this.elements.push(vertex.elements[2]);
        // }else{
        //     throw new Error(`Can't push ${vertex} onto ${this}`);
        // }
    }

    get nVerts(){
        return this.elements.length/3;
    }

    getAt(i:number){
        return new Vec3(this.elements[i*3], this.elements[(i*3)+1], this.elements[(i*3)+2]);
    }

    getPoint2DAt(i:number){
        return this.getAt(i).Point2D();
    }

    setAt(i:number, vertex:Vec2|Vec3){
        this.elements[i*3]=vertex.elements[0];
        this.elements[(i*3)+1]=vertex.elements[1];
        if(vertex.elements.length===2){
            this.elements[(i*3)+2]=this._defaultZ;
        }else{
            this.elements[(i*3)+2]=vertex.elements[2];
        }
    }

    GetLeftMultipliedBy(m:Mat3){
        let rval = this.clone();
        for(let v=0;v<this.nVerts;v++){
            rval.setAt(v, m.times(this.getAt(v).Point2D()));
        }
        return rval;
    }

}

export class VertexPositionArray3DH extends VertexAttributeArray4D{
    public _defaultH:number=1;
    constructor(elements?:number[])
    constructor(...args:any[]) {
        super(...args);
    }

    push(vertex:Vec4|Vec3){
        this.elements.push(vertex.elements[0]);
        this.elements.push(vertex.elements[1]);
        this.elements.push(vertex.elements[2]);
        if(vertex.elements.length===3){
            this.elements.push(this._defaultH);
        }else if(vertex.elements.length===4){
            this.elements.push(vertex.elements[3]);
        }else{
            throw new Error(`Can't push ${vertex} onto ${this}`);
        }
    }

    getAt(i:number){
        return new Vec4(this.elements[i*4], this.elements[(i*4)+1], this.elements[(i*4)+2], this.elements[(i*4)+3]);
    }
    setAt(i:number, vertex:Vec4|Vec3) {
        this.elements[i * 4] = vertex.elements[0];
        this.elements[(i * 4) + 1] = vertex.elements[1];
        this.elements[(i * 4) + 2] = vertex.elements[2];
        if (vertex.elements.length === 3) {
            this.elements[(i * 4) + 3] = this._defaultH;
        } else {
            this.elements[(i * 4) + 3] = vertex.elements[3];
        }
    }
}
