import {A2AppSceneNodeView} from "../../../mvc/scenenode/A2AppSceneNodeView";
import {A2AppExampleCustomNodeView} from "../../A2AppExampleCustomNodeView";
import {A2AppExampleCustomNodeController} from "../../A2AppExampleCustomNodeController";
import {
    A2DLinesElement,
    ABasic2DElement,
    APolygonElement, ASerializable, Color, Mat4,
    NodeTransform2D,
    V2,
    VertexArray2D
} from "../../../../anigraph";
import {EyeController} from "./EyeController";
import {A2AppSceneNodeModel} from "../../../mvc";
import {EyeModel} from "./EyeModel";
import {NewObject3D} from "../../../../anigraph/arender/ThreeJSWrappers";

function CircleVArray(size:number, nverts:number=25){
    let verts=new VertexArray2D();
    for(let v=0;v<nverts;v++){
        let phase = v*(2*Math.PI)/nverts;
        verts.addVertex(V2(Math.cos(phase)*size, Math.sin(phase)*size));
    }
    return verts;
}


@ASerializable("EyeView")
export class EyeView extends A2AppExampleCustomNodeView{
    public controller!:EyeController;
    public outline!:A2DLinesElement;
    public iris!:APolygonElement;
    public pupil!:APolygonElement;
    public height=70;
    public width = 100
    public whitespace = 0.2;
    public eyeObject!:THREE.Object3D;

    get model(){
        return this.controller.model as EyeModel;
    }

    initGraphics() {
        super.initGraphics();

        // make default geometry invisible
        this.fillElement.visible=false;
        this.strokeElement.visible=false;

        this.outline = new A2DLinesElement();
        this.iris = new APolygonElement();
        this.pupil = new APolygonElement();

        this.outline.setVerts(CircleVArray(this.width, 100));
        this.outline.setColor(Color.FromString("#000"))
        this.outline.setLineWidth(0.01);
        this.iris.init(CircleVArray(this.height*(1-this.whitespace), 100), this.model.color)
        this.pupil.init(CircleVArray(this.height*(1-this.whitespace)), Color.FromString("#000"))

        Mat4.Scale2D([1,this.height/this.width]).assignTo(this.outline.threejs.matrix);
        Mat4.Scale2D([this.model.dilation,this.model.dilation]).assignTo(this.pupil.threejs.matrix);

        this.eyeObject = NewObject3D();
        this.eyeObject.add(this.iris.threejs);
        this.iris.threejs.add(this.pupil.threejs);
        this.eyeObject.add(this.outline.threejs);
        this.threejs.add(this.eyeObject);

        const self=this;

        // let's make our eye stay still by transforming by the inverse of the node's transform
        this.subscribe(this.model.addStateKeyListener('transform', ()=>{
            let minv = self.model.transform.getMatrix().getInverse();
            if(minv){
                Mat4.FromMat3(minv).assignTo(self.eyeObject.matrix);
            }
        }));

        this.subscribe(this.model.addStateKeyListener('targetPoint', ()=>{
            self.targetResponse();
        }));
        this.subscribe(this.model.addStateKeyListener('dilation', ()=>{
            Mat4.Scale2D([self.model.dilation,self.model.dilation]).assignTo(self.pupil.threejs.matrix);
        }));
        this.subscribe(this.model.addStateKeyListener('color',()=>{
            self.iris.setColor(self.model.color);
        }));
    }
    targetResponse() {
        Mat4.Translation2D(this.model.targetPoint.times(1/this.model.targetRange)).assignTo(this.iris.threejs.matrix);
    }
}


