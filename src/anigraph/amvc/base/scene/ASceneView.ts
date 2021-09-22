import {AView} from "../AView";
import * as THREE from "three";
import {Interaction} from "../../../thirdparty/threeinteraction";
import {Color} from "../../../amath";
import {saveAs} from "file-saver";
import {ASerializable} from "src/anigraph/aserial";
import {ASceneModel, ASceneNodeModel} from "../index";

enum BackgroundOrder{
    Back="Back",
    Front="Front",
}

@ASerializable("ASceneView")
export abstract class ASceneView<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends AView<SceneModelType>{
    public controls!:any[];
    public threejs!: THREE.Scene;
    public _backgroundElement!:THREE.Mesh;
    public _threeInteraction:any;
    static BackgroundOrder = BackgroundOrder;
    protected backgroundOrder:BackgroundOrder=BackgroundOrder.Back;

    protected abstract _updateBackgroundElement():void;

    get DOMLabel(){
        return this.serializationLabel;
    }

    protected _recordNextFrame:boolean=false;
    protected _recordNextFrameCallback!:(imageBlob:Blob|null)=>void;
    /** Get set backgroundElement */
    set backgroundElement(value){this._backgroundElement = value;}
    get backgroundElement(){return this._backgroundElement;}

    abstract initCamera():void;
    abstract onWindowResize():void;
    abstract renderer:THREE.Renderer;
    abstract initRenderer():void;
    abstract get frustumAspect():number;

    /**
     * The main scene camera. Stored in a private `._camera` property, accessed with a getter for `camera`, so trying to call view.camera=foo will fail.
     * @type {Camera}
     * @private
     */
    public _camera!:THREE.Camera;
    get camera(){
        return this._camera;
    }
    /**
     *
     * @param model
     */
    constructor(){
        super();
        this.render = this.render.bind(this);
        this._saveSingleFrameCallback = this._saveSingleFrameCallback.bind(this);
        // this.addAmbientLight();
        // this.addPointLight();
    }

    init(){
        super.init();
        this._backgroundElement.userData['modelID']=this.model.uid;
    }

    /**
     * Should be one of the BackgroundOrder enums ("Back" or "Front");
     * background order determines whether the background is in front or behind other scene content.
     * This is important for determining whether clicks that overlap scene objects should be directed at the scene
     * object as a target or the background.
     *
     * IMPORTANT! The convention is that background order should be "Back" by default. This means that
     * unless an interaction mode switches the background order to "Front", it should be "Back". This also means
     * that when an interaction mode that uses "Front" mode gets deactivated, it should switch things back to "Back".
     *
     * @param order
     */
    setBackgroundOrder(order:BackgroundOrder){
        this.backgroundOrder = order;
        this._updateBackgroundElement();
    }


    initGraphics(){
        if(!this.controller){
            throw new Error("must set controller before initializing graphics");
        }
        this.initRenderer();
        this.getDOMElement().classList.add(this.serializationLabel);
        this.threejs = new THREE.Scene();
        // this.setBackgroundColor(Color(0.9, 0.9, 0.9));
        this.initCamera();
        this._threeInteraction = new Interaction(this.renderer, this.threejs, this.camera, {
            autoPreventDefault:true
        });
        this.threejs.userData['modelID']=this.model.uid;
    }

    recordNextFrame(callback?:(imageBlob:Blob|null)=>void){
        if(callback===undefined){
            this._recordNextFrameCallback = this._saveSingleFrameCallback;
        }else{
            this._recordNextFrameCallback=callback;
        }
        this._recordNextFrame = true;
    }

    _saveSingleFrameCallback(imageBlob:Blob|null){
        // @ts-ignore
        saveAs(imageBlob, `${this.DOMLabel}.png`);
    }

    getDOMElement(){
        return this.renderer.domElement;
    }

    setBackgroundColor(color:Color){
        this.threejs.background = color.asThreeJS();
    }

    render(){
        // requestAnimationFrame(()=>this.render);
        requestAnimationFrame(()=>this.render());
        this.renderer.render(this.threejs, this.camera);
        if(this._recordNextFrame === true){
            this._recordNextFrame = false;
            let self = this;
            this.renderer.domElement.toBlob(function(blob:Blob|null){
                self._recordNextFrameCallback(blob);
            });
        }
    }


    // addAmbientLight(color?: ColorRepresentation, intensity?: number){
    //     this.threejs.add(new THREE.AmbientLight(color, intensity));
    // }

    // addPointLight(intensity:number, position:Vec3, color?:ColorRepresentation){
    //     const pointLight = new THREE.PointLight();
    //     if(color!==undefined) {
    //         pointLight.color.set(color);
    //     }
    //     pointLight.intensity = intensity;
    //     pointLight.position.set(position.x, position.y, position.z);
    //     this.threejs.add(pointLight);
    // }


}
