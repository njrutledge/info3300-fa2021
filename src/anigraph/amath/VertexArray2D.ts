import {VertexArray} from "./VertexArray";
import {Color, Mat3, V2, V3, Vec2, Vec3, VertexAttributeArray3D} from "./index";
import {VertexPositionArray2DH} from "./VertexAttributeArray";


export class VertexArray2D extends VertexArray<Vec2>{
    public position:VertexPositionArray2DH;
    public color?:VertexAttributeArray3D;

    get length(){
        return this.position.elements.length/3;
    }

    getPoint2DAt(i:number){
        return this.position.getPoint2DAt(i);
    }

    static BoxLinesVArray(sideLength:number=0){
        let va = new VertexArray2D();
        let sh = sideLength*0.5;
        va.addVertex(V2(-sh,-sh));
        va.addVertex(V2(sh,-sh));
        va.addVertex(V2(sh,-sh));
        va.addVertex(V2(sh,sh));
        va.addVertex(V2(sh,sh));
        va.addVertex(V2(-sh,sh));
        va.addVertex(V2(-sh,sh));
        va.addVertex(V2(-sh,-sh));
        return va;
    }

    static CircleVArray(size:number, nverts:number=16){
        let verts=new VertexArray2D();
        for(let v=0;v<nverts;v++){
            let phase = v*(2*Math.PI)/nverts;
            verts.addVertex(V2(Math.cos(phase)*size, Math.sin(phase)*size));
        }
        return verts;
    }

    static BoundingBoxVerts(minxy:Vec2, maxxy:Vec2){
        let va = new VertexArray2D();
        va.addVertex(minxy);
        va.addVertex(V2(maxxy.x, minxy.y));
        va.addVertex(maxxy);
        va.addVertex(V2(minxy.x, maxxy.y));
        return va;
    }

    static Anchor(outerRadius:number=25, innerRadius:number=10, location?:Vec2){
        let verts = [
            new Vec2(innerRadius,innerRadius),
            new Vec2(0,outerRadius),
            new Vec2(-innerRadius,innerRadius),
            new Vec2(-outerRadius,0),
            new Vec2(-innerRadius,-innerRadius),
            new Vec2(0,-outerRadius),
            new Vec2(innerRadius,-innerRadius),
            new Vec2(outerRadius,0)
        ];
        if(location) {
            verts = verts.map(v => {
                return v.plus(location);
            });
        }
        return VertexArray2D.FromVec2List(verts);
    }

    static FromVec2List(verts:Vec2[]){
        let va = new VertexArray2D();
        for(let v of verts){
            va.addVertex(v);
        }
        return va;
    }

    /**
     * Positions have to be given with homogeneous coordinates!
     * @param positions
     * @param colors
     */
    constructor(homogeneous_positions?:number[], colors?:number) {
        super();
        if(homogeneous_positions!==undefined) {
            this.position = new VertexPositionArray2DH(homogeneous_positions);
        }else{
            this.position = new VertexPositionArray2DH();
        }
    }

    addVertex(v:Vec2|Vec3, color?:Color|Vec3){
        this.position.push(v);
        if(color){
            this.color?.push(V3(...color.elements));
        }
    }

    get _averagePosition(){
        let average = new Vec3(0,0,0);
        for(let v=0;v<this.length;v++){
            average.addVector(this.position.getAt(v));
        }
        return average.Point2D();
    }


    clone():this{
        // var cfunc:any =this.constructor;
        let cfunc:any=(this.constructor as any);
        var copy:this = new cfunc();
        copy.position = this.position.clone();
        if(this.color){
            copy.color = this.color.clone();
        }
        return copy;
    }

    GetLeftMultipliedBy(m:Mat3):this{
        let cfunc:any=(this.constructor as any);
        var copy:this = new cfunc();
        copy.position = this.position.GetLeftMultipliedBy(m);
        if(this.color){
            copy.color = this.color.clone();
        }
        return copy;
    }

    toString(){
        let rstring = `new VertexArray2D([\n`;
        for(let e=0;e<this.position.elements.length-1;e++){
            rstring = rstring+`${this.position.elements[e]},`;
        }
        rstring = rstring+`${this.position.elements[this.position.elements.length-1]}])`;
        return rstring;
    }
}



