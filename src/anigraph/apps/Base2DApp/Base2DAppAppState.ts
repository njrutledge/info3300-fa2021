import {
    A2DSceneModel,
    A2DSceneNodeModel,
    AModel,
    ASceneController, ASerializable,
    ClassInterface, GetAppState, GetASerializableClassByName,
    SceneControllerID,
    SceneControllerIDs,
} from "src/anigraph";
import {AObjectState} from "../../aobject";
import {Base2DAppModel} from "./models";
import {Color} from "../../amath";
import {ASelection} from "../../aobject/ASelection";
import {A2DAppState} from "../../amvc/A2DAppState";
import {folder} from "leva";


interface BasicNodeModelType extends AModel{
    getModelGUIControlSpec():void;
}

enum CreateModes{
    Polygon='Polygon'
}

export abstract class Basic2DAppState<NodeModelType extends A2DSceneNodeModel, SceneModelType extends A2DSceneModel<NodeModelType>> extends A2DAppState<NodeModelType, SceneModelType> {
    @AObjectState creatingNew!: boolean;
    @AObjectState selectedColor!: Color;
    @AObjectState _isCreatingShape!:boolean;
    @AObjectState _currentNewModelTypeName!:string;
    static SceneControllerIDs = SceneControllerIDs;

    /** Get set currentNewModelTypeName */
    set currentNewModelTypeName(value:string){this._currentNewModelTypeName = value;}
    // @ts-ignore
    get currentNewModelTypeName():string{
        if (this._currentNewModelTypeName) {
            return this._currentNewModelTypeName;
        } else {
            for (let k in this.sceneControllers) {
                for (let m in this.sceneControllers[k].ModelClassMap) {
                    return this.sceneControllers[k].ModelClassMap[m].modelClass.SerializationLabel();
                    // return k.ModelClassMap
                }
            }
        }
    }

    get currentNewModelType(){
        // @ts-ignore
        return GetASerializableClassByName(this.currentNewModelTypeName);
    }

    get selectedModels(){
        return this.selectionModel.selectedModels as NodeModelType[];
    }

    constructor() {
        super();
        // this.selectedColor = new Color(0.5, 0.5, 0.5);
        this.selectedColor = Color.Random();
        this._isCreatingShape = false;

        const self = this;
        this.subscribe(this.addStateKeyListener('_currentNewModelTypeName',()=>{
            for(let c in this.sceneControllers){
                // @ts-ignore
                this.sceneControllers[c].updateCreateShapeInteraction()
            }
        }));

    }

    getControlPanelStandardSpec(): {} {
        const self = this;
        let spec_controller = self._getSpecSceneController();
        let modelTypeSelection = {};
        if(spec_controller){
            modelTypeSelection=spec_controller.getModelTypeChoiceControlSpec();
        }

        return {
            // color: {
            //     value: this.selectedColor.toHexString(),
            //     onChange: (v: string) => {
            //         let selectedColor = Color.FromString(v);
            //         if (self.selectionModel.nSelectedModels==1) {
            //             // appState.selectionModel.updateColor();
            //             for(let m of self.modelSelection){
            //                 // @ts-ignore
            //                 m.color = selectedColor;
            //             }
            //
            //         }
            //         // @ts-ignore
            //         self.selectedColor = selectedColor;
            //     },
            // },
            // createMode: {
            //     value: 0,
            //     options: {
            //         0:'Polygon',
            //         1:'Lines'
            //     },
            //     onChange: (v: boolean) => {
            //         console.log("create mode ")
            //     }
            // },
            // creatingNew: {
            //     value: self._isCreatingShape,
            //     onChange: (v: boolean) => {
            //         self.setIsCreatingShape(v);
            //     }
            // }

            selectionControls: folder(
                {
                    freezeSelection: {
                        value: !!(self.selectionModel.isFrozen),
                        onChange: (v: boolean) => {
                            if(v){
                                self.freezeSelection();
                            }else{
                                self.unfreezeSelection();
                            }
                        }
                    }
                },
                { collapsed: true }
            ),
            creatingNew: {
                value: self._isCreatingShape,
                onChange: (v: boolean) => {
                    self.setIsCreatingShape(v);
                }
            },
            NewModelType: {
                value: self.currentNewModelTypeName,
                options: modelTypeSelection,
                onChange:(v:string)=>{
                    self.currentNewModelTypeName=v;
                }
            }
        };
    }

    // CreateMode: {
    //     value:0,
    //     options:[
    //         0:"Polygon",
    //     1:"Lines"
    //     ]
    // }

    onSelectionChanged(selection:ASelection<NodeModelType>){
        if (this.selectionModel.nSelectedModels) {
            // @ts-ignore
            this.selectedColor = this.selectedModels[0].color;
        }
        this.triggerGUIUpdate();
    }

    initSelection(){
        super.initSelection();
        // this.selectionModel.initSelection();
        this.selectionSubscriptionIsActive=true;
    }

    getModelControlSpecs(){
        return (this.modelSelection.length>0)?this.selectedModels[0].getModelGUIControlSpec():{};
    }

    setIsCreatingShape(v:boolean){
        if(v && !this._isCreatingShape){
            this.selectionModel.selectModel();
            this.setInteractionMode("CreateShape");
            this._isCreatingShape=v;
        }else if(this._isCreatingShape && !v){
            this.setInteractionMode();
            this._isCreatingShape=v;
            this.unfreezeSelection();
        }
    }

    setInteractionMode(modeName?:string){
        for(let k in this.sceneControllers){
            if(modeName) {
                let imode = this.sceneControllers[k].getInteractionMode(modeName);
                if (imode) {
                    this.sceneControllers[k].setCurrentInteractionMode(modeName);
                }
            }else{
                this.sceneControllers[k].setCurrentInteractionMode();
            }
        }
    }

    // InitSceneController(controllerID?:SceneControllerID, sceneControllerClass?:ClassInterface<ASceneController<NodeModelType, SceneModelType>>){
    //     sceneControllerClass = sceneControllerClass?sceneControllerClass:Base2DAppSceneController;
    InitSceneController(controllerID:SceneControllerID, sceneControllerClass:ClassInterface<ASceneController<NodeModelType, SceneModelType>>){
        // sceneControllerClass = sceneControllerClass?sceneControllerClass:Base2DAppSceneController;
        controllerID=controllerID?controllerID:SceneControllerIDs.ModelScene;
        return this.AppComponent(
            sceneControllerClass,
            controllerID
        );
    }
}

class Base2DAppSceneModel extends A2DSceneModel<Base2DAppModel>{
    // protected _DefaultNodeClass = Base2DAppModel;
    NewNode(): Base2DAppModel {
        // return new Base2DAppModel();
        return new ((GetAppState() as unknown as Base2DAppAppState).currentNewModelType)();

    }
}

export class Base2DAppAppState extends Basic2DAppState<Base2DAppModel, Base2DAppSceneModel>{
    NewSceneModel(): Base2DAppSceneModel {
        return new Base2DAppSceneModel();
    }

    // static GetAppState(){
    //     return super.GetAppState() as unknown as Base2DAppAppState;
    // }
}



// export function GetAppState(): Base2DAppAppState {
//     try {
//         _getAppState()
//     } catch (e) {
//         // SetAppState(new Base2DAppAppState());
//         throw new Error("Need to set appstate first!");
//     }
//     return _getAppState() as Base2DAppAppState;
// };

