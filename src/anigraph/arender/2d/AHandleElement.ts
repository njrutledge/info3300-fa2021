import {APolygonElement} from "./APolygonElement";
import {Color, VertexArray2D} from "src/anigraph";

export class AHandleElement extends APolygonElement{
    constructor(size:number=10, color?:Color){
        super(VertexArray2D.CircleVArray(size), color?color:Color.RandomRGBA());
    }
}
