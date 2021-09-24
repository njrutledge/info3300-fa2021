import {useSnapshot} from "valtio";
import ControlPanel from "../anigraph/apps/Base2DApp/ControlPanel";
import {A2AppSceneController, A2AppSceneNodeController, A2AppSceneNodeModel} from "./mvc";
import {A2AppGlobalState} from "./A2AppGlobalState";
import {NewAMVCNodeClassSpec} from "../anigraph";
import {A2AppSceneNodeView} from "./mvc/scenenode/A2AppSceneNodeView";
import {A2AppExampleCustomNodeView} from "./viewcomponent/A2AppExampleCustomNodeView";
import "./A2App.css"
import {FancyController, FancyModel, FancyView} from "./viewcomponent";
import {EyeController, EyeModel, EyeView} from "./viewcomponent/custom/eyes";

const appState = A2AppGlobalState.SetAppState();


    // A2AppGlobalState.SetAppState();

export enum A2AppSubComponents{
    ModelScene='ModelScene',
    ViewScene = 'ViewScene'
}


// let appState = AAppState.GetAppState();
// @ts-ignore
const A2AppModelSceneComponent = appState.AppComponent(
    A2AppSceneController,
    A2AppSubComponents.ModelScene,
    [
        NewAMVCNodeClassSpec(A2AppSceneNodeModel, A2AppSceneNodeView, A2AppSceneNodeController),
        NewAMVCNodeClassSpec(FancyModel, A2AppSceneNodeView, A2AppSceneNodeController),
        NewAMVCNodeClassSpec(EyeModel, EyeView, EyeController)
        // NewAMVCNodeClassSpec(EyeModel, A2AppSceneNodeView, A2AppSceneNodeController)
    ]
);

const A2AppViewSceneComponent = appState.AppComponent(
    A2AppSceneController,
    A2AppSubComponents.ViewScene,
    [NewAMVCNodeClassSpec(A2AppSceneNodeModel, A2AppExampleCustomNodeView, A2AppSceneNodeController),
        NewAMVCNodeClassSpec(FancyModel, FancyView, FancyController),
        NewAMVCNodeClassSpec(EyeModel, EyeView, EyeController)
    ]
);


export function A2AppComponent() {
    const state = useSnapshot(appState.state);
    const selectionModel = state.selectionModel;
    return (
        <div>
            <ControlPanel modelControlSpecs={selectionModel.getModelGUIControlSpecs()}/>
            <div className={"container-fluid"}>
                <div className={"row"}>
                    <div className={"Base2DApp-explanation"}>
                        <p>Cornell Intro to Graphics, Fall 2021 </p>
                        <h1 className={"Base2DApp-title"}>Assignment 2:</h1>
                        <br/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-5"}>
                        <div className={"row"}>
                            <h2 className={"Base2DApp-label"}>Basic View:</h2>
                        </div>
                        <div className={"row"}>
                            <A2AppModelSceneComponent/>
                        </div>
                    </div>
                    <div className={"col-5"}>
                        <div className={"row"}>
                            <h2 className={"Base2DApp-label"}>Custom/Creative View:</h2>
                        </div>
                        <div className={"row"}>
                            <A2AppViewSceneComponent/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
