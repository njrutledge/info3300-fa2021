import * as THREE from "three";
import {Color, VertexArray2D} from "../../amath";
import {ABasic2DElement} from "./ABasic2DElement";


export class APolygonElement extends ABasic2DElement{
    public _geometry!:THREE.ShapeGeometry;
    public _mesh!:THREE.Mesh;
    public _material!:THREE.MeshBasicMaterial;

    get material(){
        return this._material;
    }

    get eventHandler(){return this._mesh;}
    get threejs(){return this._mesh;}

    constructor(verts?:VertexArray2D|number[], color?:Color|THREE.Color){
        super();
        if(verts){
            this.init(verts, color?color:Color.RandomRGBA());
        }
    }

    init(verts:VertexArray2D|number[], color:Color|THREE.Color){
        if(verts){
            this.setVerts(verts);
        }
        this.setMaterial(
            // new THREE.MeshBasicMaterial({
            //     color: Color.RandomRGBA().asThreeJS(),
            //     side: THREE.DoubleSide,
            //     depthWrite: false
            // })
            new THREE.MeshBasicMaterial({
                color: Color.RandomRGBA().asThreeJS(),
                side: THREE.DoubleSide,
                depthWrite: true
            })
        );
        if(color){
            this.setColor(color);
        };
        if(this._geometry && this._material){
            this._mesh = new THREE.Mesh(this._geometry, this._material);
            this.threejs.matrixAutoUpdate=false;
        }
    }


    setMaterial(material:THREE.MeshBasicMaterial){
        if(this._material !== undefined){
            this._material.dispose();
        }
        this._material = material;
    }

    setColor(color:Color|THREE.Color){
        if(color instanceof Color){
            this._material.color.set(color.asThreeJS());
        }else if(color instanceof THREE.Color){
            this._material.color.set(color);
        }else{
            throw new Error(`invalid color ${color}`);
        }
    }

    getColor(){
        return Color.FromTHREEJSColor(this.material.color);
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
        let shape = new THREE.Shape();
        if(geometry.length){
            shape.moveTo(geometry.position.elements[0], geometry.position.elements[1]);
            for (let v=1;v<geometry.length;v++){
                let vert =geometry.position.getAt(v);
                shape.lineTo(vert.x, vert.y);
            }
        }
        this._geometry = new THREE.ShapeGeometry(shape);
        if(this._mesh){
            this._mesh.geometry = this._geometry;
        }
    }
}
