import {A2DSceneNodeView} from "../A2DSceneNodeView";
import {A2DSceneNodeController} from "../A2DSceneNodeController";
import {A2DPolygonModel} from "../models";
import {APolygonElement} from "../../../../arender/2d/APolygonElement";
import {NewObject3D} from "../../../../arender/ThreeJSWrappers";

export class A2DPolygonView extends A2DSceneNodeView<A2DPolygonModel>{
    // protected _shape!:THREE.Shape;
    // protected _geometry!:THREE.ShapeGeometry;
    // protected _mesh!:THREE.Mesh;
    // protected _material!:THREE.MeshBasicMaterial;
    public element!:APolygonElement;

    public controller!:A2DSceneNodeController<A2DPolygonModel>;

    get model():A2DPolygonModel{
        return (this.controller.model as A2DPolygonModel);
    }

    constructor() {
        super();
        this.threejs = NewObject3D();
    }

    init(){
        super.init();
    }

    _updateGeometry(){
        this.element.setVerts(this.model.verts);
        // if(this._geometry){
        //     this._geometry.dispose();
        // }
        // const model = this.model;
        // let shape = new THREE.Shape();
        // if(model?.verts.length){
        //     shape.moveTo(model.verts.position.elements[0], model.verts.position.elements[1]);
        //     for (let v=1;v<model.verts.length;v++){
        //         let vert =model.verts.position.getAt(v);
        //         shape.lineTo(vert.x, vert.y);
        //     }
        // }
        // this._geometry = new THREE.ShapeGeometry(shape);
    }

    initGraphics() {
        super.initGraphics();
        const self = this;
        const model = self.model;
        // this._material = new THREE.MeshBasicMaterial({
        //     color: model.color.asThreeJS(),
        //     side: THREE.DoubleSide,
        //     depthWrite: false
        // });

        this.element = new APolygonElement(this.model.verts, this.model.color);
        this.addElement(this.element);

        // this._mesh.position.set(model.transform.position.x, model.transform.position.y, 0);
        // this.threejs.add(this._mesh);
        this.threejs.position.set(model.transform.position.x, model.transform.position.y, 0);

        // this._mesh.cursor = 'pointer';

        this.controller.subscribe(
            this.model.addStateKeyListener('color', ()=>{
                this.element.setColor(model.color);
            }),
            'model.color'
        );
        this.controller.subscribe(
            this.model.addStateKeyListener('verts', ()=>{
                this._updateGeometry();
            }),
            'model.verts'
        );
    }
}
