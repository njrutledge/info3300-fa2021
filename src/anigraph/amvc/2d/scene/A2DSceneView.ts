import * as THREE from "three";
import {ASceneView} from "../../base/scene/ASceneView";
import {Mat4, V2} from "../../../amath";
import {A2DSceneNodeModel} from "../scenenode";
import {A2DSceneModel} from "./A2DSceneModel";
import {A2DSceneController} from "./A2DSceneController";
import {AniGraphEnums} from "../../../basictypes";


// const CONTEXT_ASPECT_HOW = 0.618;
// const CONTEXT_ASPECT_HOW = 0.75;
const CONTEXT_ASPECT_HOW = 1.2;

export class A2DSceneView<NodeModelType extends A2DSceneNodeModel, SceneModelType extends A2DSceneModel<NodeModelType>> extends ASceneView<NodeModelType, SceneModelType> {
    public renderer!: THREE.WebGLRenderer;
    public controller!: A2DSceneController<NodeModelType, SceneModelType>;

    constructor() {
        super()
    }

    get frustumWidth(){
        return this.camera.right - this.camera.left;
    }
    get frustumHeight(){
        return this.camera.top - this.camera.bottom;
    }
    get frustumAspect(){
        return this.frustumWidth/this.frustumHeight;
    }

    initGraphics() {
        super.initGraphics();
        this.threejs.add(new THREE.AmbientLight());
        const backgroundGeometry = new THREE.PlaneBufferGeometry(2, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.0,
            side: THREE.DoubleSide
        });
        // const material = new THREE.MeshBasicMaterial({
        //     color: 0x8888ff,
        //     transparent: false,
        //     side: THREE.DoubleSide
        // });
        // depthWrite: true
        this._backgroundElement = new THREE.Mesh(backgroundGeometry, material);
        this._backgroundElement.name = AniGraphEnums.BackgroundElementName;
        this._backgroundElement.userData[AniGraphEnums.OccludesInteractions]=true;

        this._backgroundElement.matrixAutoUpdate=false;// this._backgroundElement.position
        this.threejs.add(this._backgroundElement);
        this._updateBackgroundElement();
    }

    protected _updateBackgroundElement() {
        // let camMV = Mat4.FromTHREE(this.camera.modelViewMatrix);
        // // let camP = Mat4.FromTHREE(this.camera.projectionMatrix);
        // let camS = Mat4.Scale2D(V2(this.camera.right-this.camera.left, this.camera.top-this.camera.bottom));
        // let bgmat = camMV.getInverse().times(camS).times(Mat4.Translation3D(0,0,-5));
        // let bgmat = camMV.getInverse().times(camP.getInverse()).times(Mat4.Translation3D(0,0,0.99));


        // let bgmat = Mat4.Scale2D(200);
        // bgmat.assignTo(this._backgroundElement.matrix);

        // this._backgroundElement.scale.set(Math.abs(this.camera.right - this.camera.left), Math.abs(this.camera.top - this.camera.bottom), 1.0);
        // this._backgroundElement.position.set(0, 0, 0);


        // this._backgroundElement.position.set(0, 0, this.camera.far - 0.001 * (this.camera.far - this.camera.near));

        let camMV = Mat4.FromTHREE(this.camera.modelViewMatrix);
        let camS = Mat4.Scale2D(V2(this.camera.right-this.camera.left, this.camera.top-this.camera.bottom));
        let bgmat:Mat4;
        const bgrange = 11;
        switch(this.backgroundOrder){
            case ASceneView.BackgroundOrder.Back:
                // this._backgroundElement.position.set(0, 0, 0);
                bgmat = camMV.getInverse().times(camS).times(Mat4.Translation3D(0,0,-bgrange));
                break;
            case ASceneView.BackgroundOrder.Front:
                // let front = this.camera.near + 0.001 * (this.camera.far - this.camera.near);
                bgmat = camMV.getInverse().times(camS).times(Mat4.Translation3D(0,0,bgrange));
                break;
            default:
                throw new Error(`Unrecognized background order ${this.backgroundOrder}`);
                break;
        }
        bgmat.assignTo(this._backgroundElement.matrix);

    }

    get camera(): THREE.OrthographicCamera {
        return this._camera as THREE.OrthographicCamera;
    }

    initRenderer(parameters?: { [name: string]: string }) {
        let params = parameters ? parameters : {
            antialias: true,
            alpha: true
        }
        this.renderer = new THREE.WebGLRenderer(params);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.setSize(this.controller.container.clientWidth, this.controller.container.clientHeight);

        this.onWindowResize = this.onWindowResize.bind(this);
        // this.getDOMElement().addEventListener("resize", this.onWindowResize)
        window.addEventListener("resize", this.onWindowResize)
    }

    initCamera() {
        const cwidth = this.controller.container.clientWidth;
        const cheight = cwidth*CONTEXT_ASPECT_HOW;
        this._camera = new THREE.OrthographicCamera(cwidth / - 2, cwidth / 2, cheight / 2, cheight / - 2, 0.1, 500);
        this._camera.position.z = 100;
        this.renderer.setSize(cwidth, cheight);
        this.renderer.setSize(cwidth, cheight);
        // this.camera.matrixAutoUpdate=false;
        // this.camera.matrix.set()
    }

    onWindowResize() {
        const container = this.controller.container;
        // const width = window.innerWidth*0.5;
        // const height = window.innerHeight*0.5;
        const width = container.clientWidth;
        const height = width*CONTEXT_ASPECT_HOW;
        // const height = container.clientHeight;
        this.camera.left = - width / 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = - height / 2;
        this.camera.updateProjectionMatrix();
        this._updateBackgroundElement();
        this.renderer.setSize(width, height);
    }



}
