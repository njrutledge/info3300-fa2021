import {ABasic2DElement} from "./ABasic2DElement";
import {Color, VertexArray2D} from "src/anigraph";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {Line2} from "three/examples/jsm/lines/Line2";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import * as THREE from "three";


export class A2DLinesElement extends ABasic2DElement{
    protected _geometry!:LineGeometry;
    protected _lines!:Line2;
    protected _material!:LineMaterial;

    get material():LineMaterial{
        return this._material;
    }

    get eventHandler(){
        return this._lines;
    }
    get threejs(){
        return this._lines
    }

    constructor(verts?:VertexArray2D|number[], color?:Color, lineWidth:number=0.0075, dashed:boolean=false){
        super();
        this._geometry = new LineGeometry();
        this.setVerts(VertexArray2D.BoxLinesVArray(1));
        // this._material = new LineMaterial();
        this._material = new LineMaterial();
        this._material.linewidth = lineWidth;
        this._material.color = color?color.asThreeJS():Color.ThreeJS(0x00ff00);

        if(verts) {
            this.setVerts(verts)
        }
        this._lines = new Line2(this._geometry, this._material);
        this.threejs.matrixAutoUpdate=false;
    }

    init(verts:VertexArray2D|number[], color:Color|THREE.Color){
        this.setVerts(verts);
        if(color instanceof Color){
            this.setColor(color);
        }else{
            this.setColor(Color.FromTHREEJSColor(color));
        }
    }

    get color(){return this._material.color;}
    setColor(color:Color){
        this._material.color=color.asThreeJS();
    }

    getColor(){return Color.FromTHREEJSColor(this.color);}

    get lineWidth(){return this._material.linewidth;}
    setLineWidth(lineWidth:number){
        this._material.linewidth=lineWidth;
    }

    setVerts(verts:VertexArray2D|number[]){
        let geometry:VertexArray2D;
        if(Array.isArray(verts)){
            geometry = new VertexArray2D(verts);
        }else if (verts instanceof VertexArray2D){
            geometry = verts;
        }else{
            throw new Error(`cannot set verts to unsupported type: ${verts}`);
        }
        if(this._geometry){
            this._geometry.dispose();
        }

        this._geometry = new LineGeometry();
        // this._lines.geometry=this._geometry;
        this._geometry.setPositions(geometry.position.elements);

        if(this._lines){
            this._lines.geometry = this._geometry;
        }
        // if(Array.isArray(verts)){
        //     this._geometry.setPositions(verts);
        // }else{
        //     this._geometry.setPositions(verts.position.elements);
        // }
    }

}

