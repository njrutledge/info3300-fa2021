import {Base2DAppNodeController} from "src/anigraph/apps/Base2DApp/controllers/Base2DAppNodeController";
import {A2AppSceneNodeModel} from "./A2AppSceneNodeModel";
import {ASerializable} from "../../../anigraph";

@ASerializable("A2AppSceneNodeController")
export class A2AppSceneNodeController extends Base2DAppNodeController<A2AppSceneNodeModel>{
    initInteractions() {
        super.initInteractions();
        this.enableSelectionMode();
    }

}
