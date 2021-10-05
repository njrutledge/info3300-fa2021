import {Vector} from "./Vector";
import {Random} from "./Random";
import {ASerializable} from "../aserial/ASerializable";
import {Vec2} from "./Vec2";

@ASerializable("Vec3")
export class Vec3 extends Vector{
    static N_DIMENSIONS:number=3;
    public constructor(x: number, y: number, z: number);
    public constructor(elements?: Array<number>);
    public constructor(...args: Array<any>) { // common logic constructor
        super(...args);
    }

    toString(){
        return `Vec3(${this.x},${this.y},${this.z})`;
    }

    get nDimensions(){
        return 3;
    };

    get xy(){return new Vec2(this.elements[0], this.elements[1]);}
    set xy(value:Vec2){
        this.elements[0]=value.x;
        this.elements[1]=value.y;
    }

    get z(){return this.elements[2];}
    set z(val:number){this.elements[2]=val;}
    get h(){return this.elements[2];}
    set h(val:number){this.elements[2]=val;}

    // get i(){
    //     return this.elements[0];
    // }
    // get j(){
    //     return this.elements[1];
    // }
    // get k(){
    //     return this.elements[2];
    // }

    _setToDefault(){
        this.elements = [0,0,0];
    }

    /**
     * Cross product of this with other
     * @param other
     * @returns {Vec3}
     */
    cross(other:Vec3):Vec3{
        return new Vec3(
            this.y*other.z-this.z*other.y,
            this.z*other.x-this.x*other.z,
            this.x*other.y-this.y*other.x
        );
    }

    homogenize(){
        if(this.h===1 || this.h===0){
            return;
        }
        let ooh:number =1.0/this.h;
        this.elements[0]=this.elements[0]*ooh;
        this.elements[1]=this.elements[1]*ooh;
        this.h = 1;
    }

    getHomogenized(){
        const h = this.clone();
        h.homogenize();
        return h;
    }

    Point2D(){
        let h = this.getHomogenized();
        return new Vec2(h.x, h.y);
    }

    static Random(){
        var r = new this(Random.floatArray(3));
        return r;
    }

    sstring(){
        return `[${this.x},${this.y},${this.z}]`;
    }
}

export function V3(...elements:any[]){
    return new Vec3(...elements);
}

