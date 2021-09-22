import {Base2DAppNodeView} from 'src/anigraph/apps/Base2DApp'
import {A2AppSceneNodeModel} from "./A2AppSceneNodeModel";
import {ABasic2DElement} from "../../../anigraph";
import {A2AppSceneNodeController} from "./A2AppSceneNodeController";

export class A2AppSceneNodeView extends Base2DAppNodeView<A2AppSceneNodeModel>{
    public element!:ABasic2DElement;
    public controller!:A2AppSceneNodeController;

    //We will use this getter to automatically cast the model to an A2AppSceneNodeModel
    get model(){return (this.controller.model as A2AppSceneNodeModel);}
}



