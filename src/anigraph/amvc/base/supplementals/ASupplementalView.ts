import {AModel, ASceneNodeModel, AView} from "../index";
import * as THREE from "three";
import {ASceneController} from "../scene";
import {ASupplementalController} from "./ASupplementalController";


export abstract class ASupplementalView<ModelType extends AModel, NodeModelType extends ASceneNodeModel> extends AView<ModelType>{
    public threejs!: THREE.Object3D;
    abstract controller:ASupplementalController<ModelType,NodeModelType>;

    get sceneController(){
        if(this.controller instanceof ASceneController){
            return this.controller;
        }else{
            return this.controller.sceneController;
        }
    }

    get sceneView(){
        return this.controller.sceneController.view;
    }

    abstract initGraphics():void;

}


