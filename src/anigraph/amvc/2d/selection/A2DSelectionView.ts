import {ASelectionView} from "../../base/selection";
import {A2DSelectionController} from "./A2DSelectionController";
import {AHandleElement} from "../../../arender/2d/AHandleElement";
import {A2DLinesElement} from "../../../arender/2d/A2DLinesElement";
import {A2DSelectionModel} from "./A2DSelectionModel";
import {Color, Mat4, V2} from "../../../amath";
import {AAnchorElement} from "../../../arender/2d";
import * as THREE from "three";
import {A2DSceneNodeModel} from "../scenenode";
import {BoundingBox2D} from "../../../amath/BoundingBox2D";
import {ASerializable} from "../../../aserial";
import {AniGraphEnums} from "../../../basictypes";

@ASerializable("A2DSelectionView")
export class A2DSelectionView<NodeModelType extends A2DSceneNodeModel> extends ASelectionView<NodeModelType, A2DSelectionModel<NodeModelType>>{
    public handles:AHandleElement[]=[];
    public anchorElement!:AAnchorElement;
    public boundary!:A2DLinesElement;
    public controller!:A2DSelectionController<NodeModelType>;
    static HandleColor = Color.FromString('#b7b7b7');
    static HandleSize = 5;
    static LineWidth = 0.0025;
    // static LineDash = true;

    get model():A2DSelectionModel<NodeModelType>{
        return this.controller.model;
    }

    constructor() {
        super();
        // fonna let this one slide cause we're just using it for offset in z
        this.threejs = new THREE.Object3D();
        this.threejs.name = this.serializationLabel;
        this.threejs.position.set(0,0,10);
    }

    init(){
        super.init();
    }

    _updateGeometry(){
        let selectedModels = this.model.selectedModels;
        if(!selectedModels.length){
            this.threejs.visible = false;
            return;
        }else{
            this.threejs.visible = true;
        }


        // this.anchorElement.setTransform(Mat4.Translation2D(this.model.transform.position));
        let singleSelectedModel = this.model.singleSelectedModel;
        if(!singleSelectedModel) {
            this.anchorElement.visible = false;
        }else{
            this.anchorElement.visible = true;
            this.anchorElement.setTransform(Mat4.Translation2D(singleSelectedModel.transform.position));
            // this.anchorElement.setTransform(Mat4.Translation3D(V3(singleSelectedModel.transform.position.x, singleSelectedModel.transform.position.y, singleSelectedModel.transform.position.y));
        }
        let corners = this.model.bounds.corners;
        this.boundary.setVerts(this.model.bounds.GetBoundaryLinesVertexArray());
        this.handles[0].setTransform(Mat4.Translation2D(corners[0]));
        this.handles[0].threejs.name="Handle0";
        this.handles[1].setTransform(Mat4.Translation2D(corners[1]))
        this.handles[1].threejs.name="Handle1";
        this.handles[2].setTransform(Mat4.Translation2D(corners[2]))
        this.handles[2].threejs.name="Handle2";
        this.handles[3].setTransform(Mat4.Translation2D(corners[3]))
        this.handles[3].threejs.name="Handle3";

        this.handles[0].threejs.userData[AniGraphEnums.OccludesInteractions]=true;
        this.handles[1].threejs.userData[AniGraphEnums.OccludesInteractions]=true;
        this.handles[2].threejs.userData[AniGraphEnums.OccludesInteractions]=true;
        this.handles[3].threejs.userData[AniGraphEnums.OccludesInteractions]=true;
    }

    initGraphics() {
        super.initGraphics();
        const self = this;
        const model = self.model;
        // this.boundary = new A2DLinesElement(VertexArray2D.BoxLinesVArray());
        this.boundary = new A2DLinesElement(BoundingBox2D.FromVec2s([V2(), V2(1,1)]).GetBoundaryLinesVertexArray());
        this.boundary.material.linewidth = A2DSelectionView.LineWidth;
        this.boundary.material.color = Color.ThreeJS('#777777');
        this.addElement(this.boundary);

        this.anchorElement = new AAnchorElement();
        this.anchorElement.threejs.userData['AniGraphType']='AAnchorElement';
        this.addElement(this.anchorElement);

        for(let h=0;h<4;h++){
            let handle = new AHandleElement(this.model.handleSize, A2DSelectionView.HandleColor);
            handle.threejs.userData['handleID'] = h;
            this.handles.push(handle);
            this.addElement(handle);
        }

        this.subscribe(this.model.addStateKeyListener('bounds', ()=>{
            this._updateGeometry();
        }));

        this.threejs.visible=false;
    }
}
