import {
    A2DSceneNodeModel,
    A2DSceneNodeView,
    ABasic2DElement,
    APolygonElement,
    ASceneNodeController
} from "src/anigraph";


export class Base2DAppNodeView<NodeModelType extends A2DSceneNodeModel> extends A2DSceneNodeView<NodeModelType>{
    public element!:ABasic2DElement;
    // @ts-ignore
    public controller!:ASceneNodeController<A2DSceneNodeModel,A2DSceneNodeView<NodeModelType>>;
    get model(){
        return (this.controller.model as NodeModelType);
    }

    constructor() {
        super();
    }

    init(){
        super.init();
    }

    _updateGeometry(){
        this.element.setVerts(this.model.verts);
    }

    initGraphics() {
        super.initGraphics();
        const self = this;
        const model = self.model;

        this.element = new APolygonElement(this.model.verts, this.model.color);
        this.addElement(this.element);

        this.controller.subscribe(
            this.model.addStateKeyListener('color', ()=>{
                self.element.setColor(model.color);
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
