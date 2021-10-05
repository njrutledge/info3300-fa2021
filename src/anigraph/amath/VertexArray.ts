import {ASerializable} from "../aserial/ASerializable";
import {VertexAttributeArray} from "./VertexAttributeArray";
import {Vector} from "./Vector";


@ASerializable("VertexArray")
export abstract class VertexArray<VType extends Vector>{
    abstract position:VertexAttributeArray<VType>;
    abstract clone():this;
    toJSON(){
        var rval:{[name:string]:any} = {};
        for (let k in this){
            // @ts-ignore
            rval[k]=this[k];
        }
        return rval;
    }



}
