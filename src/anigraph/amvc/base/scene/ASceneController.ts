import {ASceneModel, SceneEvents} from "./ASceneModel";
import {ASceneView} from "./ASceneView";
import {
    AController,
    AControllerClassInterface,
    AControllerInterface,
    AModel,
    AModelClassInterface,
    AModelInterface,
    ASceneNodeController,
    ASceneNodeModel,
    ASceneNodeView,
    ASelectionController,
    ASelectionModel,
    AViewClassInterface
} from "../index";
import {AAppState} from "../../AAppState";
import {ASupplementalController} from "../supplementals";
import {v4 as uuidv4} from 'uuid';
import {Vec2} from "../../../amath";
import * as THREE from "three";
import {ClassInterface} from "../../../basictypes";

// export interface ASceneControllerClassInterface<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends Function {new (...args:any[]): ASceneController<NodeModelType, SceneModelType>}
// export interface ASceneControllerClassInterface<SceneControllerClass> extends ClassInterface<SceneControllerClass>;

export interface ASceneControllerInterface<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends AControllerInterface<SceneModelType>{
    model:SceneModelType;
    getDOMElement():HTMLCanvasElement;
    getNodeControllerForModel(model:AModel):AControllerInterface<NodeModelType>;
    view:ASceneView<NodeModelType, SceneModelType>;
    appState:AAppState<NodeModelType, SceneModelType>;
    camera:THREE.Camera;
    nodeControllers:{[modelID:string]:AControllerInterface<NodeModelType>};
    selectModel(model:AModel, ...args:any[]):void;
}

interface ASceneNodeControllerInterface<NodeModelType extends ASceneNodeModel> extends ASceneNodeController<NodeModelType>{
}
export interface AMVCMapEntry<NodeModelType extends ASceneNodeModel>{
    modelClass:AModelClassInterface<AModelInterface>;
    viewClass:AViewClassInterface;
    controllerClass:ClassInterface<AControllerInterface<NodeModelType>>
}

export type AMVCNodeClassSpec<NodeModelType extends ASceneNodeModel> = [AModelClassInterface<AModelInterface>, AViewClassInterface, AControllerClassInterface<ASceneNodeController<NodeModelType>>];
export function NewAMVCNodeClassSpec<NodeModelType extends ASceneNodeModel>(modelClass:AModelClassInterface<NodeModelType>, viewClass:AViewClassInterface, controllerClass:AControllerClassInterface<ASceneNodeController<NodeModelType>>):AMVCNodeClassSpec<NodeModelType>{
    return [modelClass, viewClass, controllerClass];
}

export type AMVCMap<NodeModelType extends ASceneNodeModel> = {[modelClassName:string]:AMVCMapEntry<NodeModelType>};

// implements ASceneControllerInterface<ModelType>



export abstract class ASceneController<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends AController<SceneModelType>{
    public nodeControllers:{[modelID:string]:AControllerInterface<NodeModelType>}={};
    public supControllers:{[name:string]:ASupplementalController<AModel,NodeModelType>}={};
    public container: HTMLElement;
    protected _model!:SceneModelType;
    abstract view:ASceneView<NodeModelType, SceneModelType>;
    public ModelClassMap:AMVCMap<NodeModelType>={};
    abstract selectModel(model?:AModel, ...args:any[]):void;
    abstract getSelectionController():ASelectionController<NodeModelType, ASelectionModel<NodeModelType>>;


    initDefaultScene(){

    }

    get model():SceneModelType{
        return this._model;
    };

    get appState(){
        return this.model.appState;
    }

    setModel(sceneModel:SceneModelType){
        super.setModel(sceneModel);
    }

    //##################//--Initializations--\\##################
    //<editor-fold desc="Initializations">
    /**
     * # Initializations:
     * init() should always be called AFTER the constructor...
     * this is because of typescripts weird property overwriting, where values initialized by a parent are overwritten
     * when the child constructor executes.
     *
     * - All of the basic controller initializations
     * - initClassSpec(): class specs define what views and controllers to use for each model type
     */

    /**
     *
     * @param container
     * @param sceneModel
     */
    constructor(container: HTMLElement) {
        super();
        // this.setModel(sceneModel?sceneModel:new ASceneModel());
        // this.setModel(sceneModel);
        this.container = container;
    }

    abstract initClassSpec():void;

    init(sceneModel:SceneModelType, sceneView?:ASceneView<NodeModelType, SceneModelType>){
        // super calls:
        // this.initView();
        // this.initInteractions();
        super.init(sceneModel, sceneView);
        const appController = this;
        this.initClassSpec();


        this.subscribe(this.model.addEventListener(SceneEvents.NodeAdded, (newNodeModel:NodeModelType)=>{
            appController.onNodeAdded(newNodeModel);
        })

            ,
            SceneEvents.NodeAdded);
    }
    //</editor-fold>
    //##################\\--Initializations--//##################

    //##################//--SceneController Access--\\##################
    //<editor-fold desc="SceneController Access">
    /** Get set sceneController */
    get sceneController(){return this;}
    getContextDOMElement(){
        return this.getDOMElement();
    }
    normalizedToViewCoordinates(v:Vec2){
        const cam = this.view.camera;
        const tvec= new THREE.Vector4(v.x, v.y, 0.0,1.0).applyMatrix4(cam.projectionMatrixInverse);
        return new Vec2(tvec.x/tvec.w, tvec.y/tvec.w);
    }

    viewToNormalizedCoordinates(v:Vec2){
        const cam = this.view.camera;
        const tvec= new THREE.Vector4(v.x, v.y, 0.0,1.0).applyMatrix4(cam.projectionMatrix);
        return new Vec2(tvec.x/tvec.w, tvec.y/tvec.w);
    }

    //</editor-fold>
    //##################\\--SceneController Access--//##################




    addClassSpec(modelClass:AModelClassInterface<AModelInterface>, viewClass:AViewClassInterface, controllerClass:ClassInterface<AControllerInterface<NodeModelType>>) {
        // @ts-ignore
        this.ModelClassMap[modelClass.SerializationLabel()]={
            modelClass:modelClass,
            viewClass:viewClass,
            controllerClass:controllerClass
        }
    }

    addClassSpecs(...classSpecs:AMVCNodeClassSpec<NodeModelType>[]) {
        for (let spec of classSpecs){
            this.addClassSpec(...spec);
        }
    }



    get camera(){
        return this.view.camera;
    }

    get backgroundElement(){
        return this.view.backgroundElement;
    }







    // initClassSpec(){
    //     // this.addClassSpec(AModel, ASceneNodeView, ASceneNodeController);
    // }

    getModelClassSpec(className:string):AMVCMapEntry<NodeModelType>{
        // @ts-ignore
        // let mmap = (this.constructor as ASceneController).ModelClassMap;
        // console.log(className);
        // console.log(this.ModelClassMap);
        let mmap = this.ModelClassMap;
        if(className in mmap){
            return mmap[className];
        }else{
            return mmap['default'];
        }
    }


    /**
     * Should create the new controller and view in response to the new node.
     * It is important that the new controller be registered
     * @param newModel
     */
    onNodeAdded(newModel:NodeModelType){
        // const modelclassname = (newModel.serializationLabel in this.getModelClassMap())?newModel.constructor.name:'default';
        const classSpec = this.getModelClassSpec(newModel.serializationLabel);
        const newNodeView = new classSpec.viewClass();
        const newNodeController = new classSpec.controllerClass();
        // @ts-ignore
        newNodeController.sceneController = this.sceneController;
        newNodeController.init(newModel, newNodeView as unknown as ASceneNodeView<NodeModelType>);
        this.registerController(newNodeController);
    }


    getDOMElement(){
        return this.view.getDOMElement();
    }



    render(){
        if(!this.view){
            throw new Error(`Must call ${this.constructor.name}.initView() before rendering...`);
        }
        this.view.render();
    }

    registerController(controller:AControllerInterface<AModel>){
        if(controller.model.uid in this.nodeControllers){
            throw new Error(`Tried to re-register node controller for ${controller.model}.\nOld: ${this.nodeControllers[controller.model.uid]}\nNew:${controller}`);
        }
        this.nodeControllers[controller.model.uid]=controller;
        // @ts-ignore
        // controller.sceneController = this;
        // controller.init();
    }

    registerSupController(controller:ASupplementalController<AModel, NodeModelType>, name?: string){
        name = name?name:controller.serializationLabel;
        if(!name){
            name = uuidv4();
        }
        if(name in this.supControllers){
            throw new Error(`Tried to re-register side controller ${controller}.\nOld: ${this.supControllers[name]}\nNew:${controller}`);
        }
        this.supControllers[name]=controller;
        if(controller.sceneController!==this){
            throw new Error("Scene controller is wrong?");
        }
    }

    getNodeControllerForModel(model:AModel){
        if(model===this.model){
            return this;
        }
        return this.nodeControllers[model.uid];
    }

}
