import {A2DLinesElement, A2DSceneNodeView, ABasic2DElement, APolygonElement} from "../../anigraph";
import {A2AppSceneNodeController, A2AppSceneNodeModel} from "../mvc";
import {getSubdividedVerts} from "./BasicSubdivision";


export class A2AppExampleCustomNodeView extends A2DSceneNodeView<A2AppSceneNodeModel>{
    controller!:A2AppSceneNodeController;
    public fillElement!:ABasic2DElement;
    public strokeElement!:A2DLinesElement;


    _updateGeometry(){
        let subdividedVerts = this.model.verts;
        if(subdividedVerts.length>2) {
            for (let s = 0; s < this.model.nSubdivisions; s++) {
                subdividedVerts = getSubdividedVerts(subdividedVerts);
            }
        }
        this.fillElement.setVerts(subdividedVerts);
        this.strokeElement.setVerts(subdividedVerts);
    }

    initGraphics() {
        super.initGraphics();
        const self = this;
        const model = self.model;

        this.fillElement = new APolygonElement(this.model.verts, this.model.color.Spun(this.model.fillColorPhaseShift));
        this.addElement(this.fillElement);

        this.strokeElement = new A2DLinesElement(this.model.verts, this.model.strokeColor, this.model.strokeWidth);
        this.addElement(this.strokeElement);

        this.controller.subscribe(
            this.model.addStateKeyListener('color', ()=>{
                self.fillElement.setColor(model.color.Spun(model.fillColorPhaseShift));
            }),
            'model.color'
        );
        this.controller.subscribe(
            this.model.addStateKeyListener('verts', ()=>{
                this._updateGeometry();
            }),
            'model.verts'
        );

        this.controller.subscribe(
            this.model.addStateKeyListener('fillColorPhaseShift', ()=>{
                this.fillElement.setColor(model.color.Spun(model.fillColorPhaseShift));
            }),
            'model.fillColorPhaseShift'
        );
        this.controller.subscribe(
            this.model.addStateKeyListener('strokeColor', ()=>{
                this.strokeElement.setColor(model.strokeColor);
            }),
            'model.strokeColor'
        );

        this.controller.subscribe(
            this.model.addStateKeyListener('strokeWidth', ()=>{
                this.strokeElement.material.linewidth=model.strokeWidth;
                this.strokeElement.setColor(model.strokeColor);
            }),
            'model.strokeWidth'
        );
        this.controller.subscribe(
            this.model.addStateKeyListener('nSubdivisions', ()=>{
                this._updateGeometry();
            }),
            'model.nSubdivisions'
        );
    }
}


