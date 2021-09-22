import {Vector} from "./Vector";
import {Random} from "./Random";
import {ASerializable} from "../aserial/ASerializable";

@ASerializable("Vec4")
export class Vec4 extends Vector{
    static N_DIMENSIONS:number=4;
    public constructor(x: number, y: number, z: number, h:number);
    public constructor(elements: Array<number>);
    public constructor(...args: Array<any>) { // common logic constructor
        super(...args);
    }

    toString(){
        return `Vec4(${this.x},${this.y},${this.z},${this.h})`;
    }

    get nDimensions(){
        return 4;
    };


    get z(){return this.elements[2];}
    set z(val:number){this.elements[2]=val;}
    get h(){return this.elements[3];}
    set h(val:number){this.elements[3]=val;}

    homogenize(){
        if(this.h===1 || this.h===0){
            return;
        }
        let ooh:number =1.0/this.h;
        this.elements[0]=this.elements[0]*ooh;
        this.elements[1]=this.elements[1]*ooh;
        this.elements[2]=this.elements[1]*ooh;
        this.h = 1;
    }

    _setToDefault(){
        this.elements = [0,0,0,0];
    }

    getHomogenized(){
        const h = this.clone();
        h.homogenize();
        return h;
    }

    static Random(){
        var r = new this(Random.floatArray(4));
        return r;
    }

    sstring(){
        return `[${this.x},${this.y},${this.z}]`;
    }
}

