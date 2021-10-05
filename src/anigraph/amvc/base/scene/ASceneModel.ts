import {AModel} from "../AModel";
import {ASceneNodeModel} from "../scenenode/ASceneNodeModel";
import {AAppState} from "../../AAppState";
import {ASerializable} from "src/anigraph/aserial";

export enum SceneEvents{
    NodeAdded="NodeAdded",
    NodeRemoved="NodeRemoved",
    NodeMoved="NodeMoved",
}

@ASerializable("ASceneModel")
export abstract class ASceneModel<NodeModelType extends ASceneNodeModel> extends AModel{
    // protected abstract _DefaultNodeClass:AModelClassInterface<NodeModelType>;
    public appState!:AAppState<NodeModelType, ASceneModel<NodeModelType>>;
    addNode(newNode:ASceneNodeModel, parent?:ASceneNodeModel, position?:number){
        let newparent = parent?parent:this;
        newparent.addChild(newNode, position);
        this.signalNodeAdded(newNode);
    }


    // _setDefaultNodeClass(nodeClass:AModelClassInterface<NodeModelType>){
    //     this._DefaultNodeClass = nodeClass;
    // }
    // get DefaultNodeClass(){
    //     return this._DefaultNodeClass;
    // }
    // NewNode(...args:any[]){
    //     return new this.DefaultNodeClass(...args);
    // }


    signalNodeAdded(model:ASceneNodeModel){
        this.signalEvent(SceneEvents.NodeAdded, model);
    };

    signalNodeRemoved(model:ASceneNodeModel){
        this.signalEvent(SceneEvents.NodeRemoved, model);
    };

    signalNodeMoved(model:ASceneNodeModel){
        this.signalEvent(SceneEvents.NodeMoved, model);
    }
}
