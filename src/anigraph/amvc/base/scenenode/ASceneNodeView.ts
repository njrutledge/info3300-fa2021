import {AView} from "../AView";
import {ASceneController, ASceneModel, ASceneView} from "../scene";
import {ASceneNodeController} from "./ASceneNodeController";
import {ASceneNodeModel} from "./ASceneNodeModel";
import * as THREE from "three";


export abstract class ASceneNodeView<NodeModelType extends ASceneNodeModel> extends AView<NodeModelType>{
    public threejs!: THREE.Object3D;
    abstract controller:ASceneNodeController<NodeModelType>;
    get sceneController(){
        if(this.controller instanceof ASceneController){
            return this.controller;
        }else{
            return this.controller.sceneController;
        }
    }

    getSceneView():ASceneView<NodeModelType, ASceneModel<NodeModelType>>{
        return this.controller.sceneController.view;
    }

    get camera(){
        return this.controller.sceneController.camera;
    }

    /**
     * Adds the threejs object to its parent in the scenegraph
     * This function should also initialize threejs graphics in subclasses:
     * initGraphics(){
     *     super.initGraphics();
     *     // initialize other threejs objects and add them to this.threejs
     * }
     */
    initGraphics() {
        // this.threejs.userData['modelID']=this.model.uid;
        const parentView = this.getParentView();
        let targetView = parentView?parentView:this.getSceneView();
        targetView.addChildView(this);
    }


    // initInteractions(){
    //
    // }


    getParentView(){
        let parentcontroller = this.controller.getParent();
        return parentcontroller?.view;
    }

}


