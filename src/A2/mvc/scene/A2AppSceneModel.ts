import {A2DSceneModel, ASerializable, GetAppState} from "src/anigraph";
import {A2AppSceneNodeModel} from "../scenenode";
import {A2AppGlobalState} from "../../A2AppGlobalState";

@ASerializable("A2AppSceneModel")
export abstract class A2AppSceneModel<NodeModelType extends A2AppSceneNodeModel> extends A2DSceneModel<NodeModelType>{

    /**
     * This code will get called when you press the 'addDefaultScene' button in the GUI.
     * It may be useful for debugging.
     */
    addDefaultScene(){
        let m1 = this.CreateTestSquare();
        m1.name = "TestSquare";
        this.addNode(m1);

        // let m1 = this.CreateTestModel(V2(-10,-10));
        // let m2 = this.CreateTestModel(V2(1,1), Color.FromString('#bbaa55'));
        // m1.name = 'Green Shape 1';
        // m1.uid = 'Green Shape 1';
        // m2.name = 'Yellow Shape 2';
        // m2.uid = 'Yellow Shape 2';
        // this.addNode(m1);
        // this.addNode(m2);
    }

}

@ASerializable("A2AppSceneModelBasic")
export class A2AppSceneModelBasic extends A2AppSceneModel<A2AppSceneNodeModel>{
    NewNode(){
        // return new A2AppSceneNodeModel();
        return new ((GetAppState() as unknown as A2AppGlobalState).currentNewModelType)();
    }
}
