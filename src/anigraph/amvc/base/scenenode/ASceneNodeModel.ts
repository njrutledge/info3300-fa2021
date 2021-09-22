import {AModel} from "../AModel";
import {ASceneModel} from "../scene/ASceneModel";
import {ASerializable} from "src/anigraph/aserial";


@ASerializable("ASceneNodeModel")
export abstract class ASceneNodeModel extends AModel{
    getSceneModel(){
        let scenemodel = this;
        while(!(scenemodel instanceof ASceneModel) && scenemodel.parent){
            // @ts-ignore
            scenemodel = scenemodel.parent;
        }
        return scenemodel;
    }
}

