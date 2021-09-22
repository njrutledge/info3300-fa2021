import {A2AppSceneModel, A2AppSceneModelBasic, A2AppSceneNodeModel} from "./mvc";
import {Basic2DAppState} from "../anigraph/apps/Base2DApp/Base2DAppAppState";
import {Color, SetAppState} from "../anigraph";
import {button} from "leva";

export abstract class A2AppGlobalStateBase<NodeModelType extends A2AppSceneNodeModel, SceneModelType extends A2AppSceneModel<NodeModelType>> extends Basic2DAppState<NodeModelType, SceneModelType> {
    getModelControlSpecs(){
        return (this.modelSelection.length>0)?this.selectedModels[0].getModelGUIControlSpec():{};
    }
}

export class A2AppGlobalState extends A2AppGlobalStateBase<A2AppSceneNodeModel, A2AppSceneModel<A2AppSceneNodeModel>>{
    NewSceneModel(): A2AppSceneModel<A2AppSceneNodeModel> {
        return new A2AppSceneModelBasic();
    }

    getControlPanelStandardSpec(): {} {
        const self = this;
        return {
            addDefaultScene: button(()=> {
                self.sceneModel.addDefaultScene();
            }),
            color: {
                value: this.selectedColor.toHexString(),
                onChange: (v: string) => {
                    let selectedColor = Color.FromString(v);
                    if (self.selectionModel.nSelectedModels==1) {
                        // appState.selectionModel.updateColor();
                        for(let m of self.modelSelection){
                            // @ts-ignore
                            m.color = selectedColor;
                        }

                    }
                    // @ts-ignore
                    self.selectedColor = selectedColor;
                },
            },
            creatingNew: {
                value: self._isCreatingShape,
                onChange: (v: boolean) => {
                    self.setIsCreatingShape(v);
                }
            }
        };
    }


    static SetAppState(){
        const newappState = new this();
        SetAppState(newappState);
        return newappState;
    }
}
