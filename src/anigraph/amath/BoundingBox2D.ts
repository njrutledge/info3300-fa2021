import {BoundingBox} from "./BoundingBox";
import {NodeTransform2D} from "./NodeTransform2D";
import {V2, Vec2} from "./Vec2";
import {VertexArray2D} from "./VertexArray2D";
import {VertexPositionArray2DH} from "./VertexAttributeArray";
import {Vec3} from "./Vec3";


export class BoundingBox2D extends BoundingBox<Vec2, NodeTransform2D>{


    clone(){
        let clone = new BoundingBox2D();
        clone.minPoint=this.minPoint?.clone();
        clone.maxPoint=this.maxPoint?.clone();
        clone.transform=this.transform.clone();
        return clone;
    }


    static FromVec2s(verts:Vec2[]){
        let va = VertexArray2D.FromVec2List(verts);
        return BoundingBox2D.FromVertexArray2D(va);
    }

    static FromVertexArray2D(verts:VertexArray2D){
        let rval = new BoundingBox2D();
        rval.boundVertexPositionArrray(verts.position);
        return rval;
    }

    boundVertexPositionArrray(va:VertexPositionArray2DH){
        let nverts = va.nVerts;
        for(let vi=0;vi<nverts;vi++){
            this.boundPoint(va.getAt(vi));
        }
    }

    constructor() {
        super();
        this.transform = new NodeTransform2D();
    }

    get center(){
        if(!this.minPoint || !this.maxPoint){
            return;
        }
        return this.transform.getMatrix().times(this.minPoint.plus(this.maxPoint).times(0.5));
    }

    public boundPoint(p:Vec2|Vec3):void{
        let p2d = p;
        if(p instanceof Vec3){
            p2d = p.Point2D();
        }
        if(!this.minPoint || !this.maxPoint){
            this.minPoint = p2d.clone();
            this.maxPoint = p2d.clone();
            return;
        }
        let ndim:number= this.minPoint.nDimensions;
        for(let c=0;c<ndim;c++){
            if(p2d.elements[c]<this.minPoint.elements[c]){
                this.minPoint.elements[c] = p2d.elements[c];
            }
            if(p2d.elements[c]>this.maxPoint.elements[c]){
                this.maxPoint.elements[c] = p2d.elements[c];
            }
        }
    }


    get corners(){
        let tmat = this.transform.getMatrix();
        if(!this.minPoint || !this.maxPoint){
            return [];
        }
        return [
            tmat.times(this.minPoint),
            tmat.times(V2(this.maxPoint.x, this.minPoint.y)),
            tmat.times(this.maxPoint),
            tmat.times(V2(this.minPoint.x, this.maxPoint.y))
        ];
    }

    GetBoundaryLinesVertexArray(){
        let va = new VertexArray2D();
        let corners = this.corners;
        if(!corners.length){
            return va;
        }
        // va.addVertex(corners[0]);
        // va.addVertex(corners[1]);
        // va.addVertex(corners[1]);
        // va.addVertex(corners[2]);
        // va.addVertex(corners[2]);
        // va.addVertex(corners[3]);
        // va.addVertex(corners[3]);
        // va.addVertex(corners[0]);

        va.addVertex(corners[0]);
        va.addVertex(corners[1]);
        // va.addVertex(corners[1]);
        va.addVertex(corners[2]);
        // va.addVertex(corners[2]);
        va.addVertex(corners[3]);
        // va.addVertex(corners[3]);
        va.addVertex(corners[0]);
        return va;
    }

    boundBounds(b:BoundingBox2D){
        let corners = b.corners;
        for(let c of corners){
            this.boundPoint(c);
        }
    }

}
