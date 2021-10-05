import {A2DSceneNodeController} from "../A2DSceneNodeController";
import {A2DSceneNodeView} from "../A2DSceneNodeView";
import {A2DLinesModel} from "../models/A2DLinesModel";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {Line2} from "three/examples/jsm/lines/Line2";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {NewObject3D} from "../../../../arender/ThreeJSWrappers";
import {Color} from "../../../../amath";


export class A2DLinesView extends A2DSceneNodeView<A2DLinesModel>{
    // protected _shape!:THREE.Shape;
    protected _geometry!:LineGeometry;
    protected _lines!:Line2;
    protected _material!:LineMaterial;
    public controller!:A2DSceneNodeController<A2DLinesModel>;

    get model():A2DLinesModel{
        return (this.controller.model as A2DLinesModel);
    }

    constructor() {
        super();
        this.threejs = NewObject3D();
    }

    init(){
        super.init();
        // this.addDragPositionInteraction();
    }

    _initGeometry(){
        if(this._geometry){
            this._geometry.dispose();
        }
        const model = this.model;
        // this._geometry = new THREE.BufferGeometry();
        this._geometry = new LineGeometry();
        this._geometry.setPositions(model.verts.position.elements);
        // this._geometry.setAttribute(
        //     'position',
        //     model.verts.position.BufferAttribute()
        // );
    }

    _updateGeometry(){
        this._initGeometry();
    }

    initGraphics() {
        super.initGraphics();
        const self = this;
        const model = self.model;
        // this._material =new THREE.LineBasicMaterial( {
        //     color: new THREE.Color(model.color.x, model.color.y, model.color.z),
        //     linewidth: model.lineWidth,
        // });
        // this._material =new LineMaterial({
        //     color: new THREE.Color(model.color.x, model.color.y, model.color.z).getHex(),
        //     linewidth: model.lineWidth,
        //     dashed:model.dashed
        // })

        this._material =new LineMaterial({
            color: 0xaaa,
            linewidth: model.lineWidth,
            dashed:model.dashed
        })
        this._material.color = Color.ThreeJS('#555555')


        // THREE.LineBasicMaterial( {
        //     color: new THREE.Color(model.color.x, model.color.y, model.color.z),
        //     linewidth: model.lineWidth,
        // });

        this._updateGeometry();
        this._lines = new Line2(this._geometry, this._material);
            // new THREE.Line(this._geometry, this._material);

        // this._mesh.position.set(model.transform.position.x, model.transform.position.y, 0);
        this.threejs.add(this._lines);
        this.threejs.position.set(model.transform.position.x, model.transform.position.y, 0);

        // this._mesh.cursor = 'pointer';

        this.controller.subscribe(
            this.model.addStateKeyListener('color', ()=>{
                this._material.color.set(model.color.asThreeJS());
            }),
            'model.color'
        );

        this.controller.subscribe(this.model.addStateKeyListener('lineWidth', ()=>{
                this._material.linewidth = model.lineWidth;
            }),
            'model.lineWidth'
        );

        this.controller.subscribe(this.model.addStateKeyListener('verts', ()=>{
                // this._shape.dispose();
                this._updateGeometry();
                this._lines.geometry = this._geometry;
            }),
            'model.verts'
        );
    }
}




