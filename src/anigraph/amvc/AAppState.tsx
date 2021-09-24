import {AObject, AObjectState} from "../aobject";
import {ASceneNodeModel} from "./base";
import {AMVCNodeClassSpec, ASceneController, ASceneModel} from "./base/scene";
import {ASerializable} from "../aserial";
import {ASelection} from "../aobject/ASelection";
import {ASelectionModel, SelectionEvents} from "./base/selection";
// import {GetGlobalAppState} from "../AppGlobalState";
import React, {useEffect, useRef} from "react";
import {v4 as uuidv4} from 'uuid';
import {ClassInterface} from "../basictypes";
import {CallbackType} from "../aevents";

export const SceneControllerIDs = {
    default:"default",
    ModelScene:"ModelScene",
    ViewScene:"ViewScene"
}as const;
export type SceneControllerID = typeof SceneControllerIDs[keyof typeof SceneControllerIDs];


var _appState:AAppState<ASceneNodeModel, ASceneModel<ASceneNodeModel>>;

export function SetAppState(appState:AAppState<any, any>):AAppState<any, any>{
    if(_appState !== undefined){
        throw new Error(`Already set the app state to ${_appState}`);
    }
    _appState = appState;
    _appState.init();
    return _appState;
}


@ASerializable("AAppState")
export abstract class AAppState<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends AObject{
    // @AObjectState modelControlSpecs:{}
    @AObjectState _guiKey!:string;
    @AObjectState sceneModel!:SceneModelType;
    @AObjectState selectionModel!: ASelectionModel<NodeModelType>;
    @AObjectState time:number;
    protected _clockID!:number;
    protected _paused!:boolean;

    onAnimationFrameCallback(){
        // let ah = setInterval()
    }


    protected _getSpecSceneController(){
        for(let k in this.sceneControllers){
            return this.sceneControllers[k];
        }
    }

    abstract NewSceneModel(...args:[]):SceneModelType;

    abstract initSelection():void;

    getControlPanelStandardSpec(){return {};};

    // @AObjectState selectedModel!: AModel | undefined;
    private _initCalled:boolean=false;

    freezeSelection(){
        this.selectionModel.isFrozen=true;
    }
    unfreezeSelection(){
        this.selectionModel.isFrozen=false;
    }

    // static SetAppState(...args:[]){
    //     // SetAppState(new this(...args));
    //     _appState = new this(...args);
    //     _appState.init();
    //     return _appState;
    // }

    static GetAppState(){
        return GetAppState();
        // if(_appState===undefined){
        //     throw new Error("Must set app state!");
        // }
        // return _appState;
    }

    //##################//--Selection--\\##################
    //<editor-fold desc="Selection">

    handleSceneGraphSelection(m:any){
        this.selectionModel.selectModel(m);
        console.log(`Model: ${m.uid}`)
        console.log(m);
        console.log(`Transform with matrix:\n${m.transform.getMatrix().asPrettyString()}`)
        console.log(m.transform.getMatrix());
        console.log(m.transform);
    }

    get modelSelection(){
        return this.selectionModel.selectedModels;
    }


    /**
     * Will activate or deactivate the SelectionChanged subscription
     * @param value
     */
    set selectionSubscriptionIsActive(value){
        if(value!=this.selectionSubscriptionIsActive){
            if(value){
                this.deactivateSubscription(SelectionEvents.SelectionChanged);
            }else{
                this.activateSubscription(SelectionEvents.SelectionChanged);
            }
        }
    }

    get selectionSubscriptionIsActive(){
        return this._subscriptions[SelectionEvents.SelectionChanged].active;
    }

    onSelectionChanged(selection:ASelection<NodeModelType>){
        this.triggerGUIUpdate()
        return;
    }

    // selectModel(model?:NodeModelType, event?:AInteractionEvent){
    //     this.selectionModel.selectModel(model);
    // }

    //</editor-fold>
    //##################\\--Selection--//##################


    init(){
        if(this._initCalled){
            throw new Error("AAppState already initialized!");
        }
        this.initSelection();
        this._initCalled=true;
    }

    pauseClock(){
        if(!this._paused){
            this._paused=true;
            clearInterval(this._clockID);
        }
    }
    unpauseClock(){
        if(this._paused){
            const self = this;
            this._paused=false;
            this._clockID = setInterval(()=>{
                if(!self._paused) {
                    self.time = Date.now();
                }
            });
        }
    }
    toggleClockPause(){
        if(this._paused){
            this.unpauseClock();
        }else{
            this.pauseClock();
        }
    }

    /** Get set selectedModel */
    // set selectedModel(value:NodeModelType|undefined){this._selectedModel = value;}
    // get selectedModel(){return this._selectedModel;}

    public sceneControllers:{[name:string]:ASceneController<NodeModelType, SceneModelType>}={};
    static SceneControllerIDs=SceneControllerIDs;

    constructor(sceneModel?:SceneModelType){
        super();
        this._paused=true;
        this.time = Date.now();
        this.unpauseClock();

        if(sceneModel){
            this.sceneModel=sceneModel;
        }else{
            this.sceneModel = this.NewSceneModel();
        }
        if(this.sceneModel.appState){
            console.log(this);
            throw new Error(`Scene model ${sceneModel} already has appState: ${this.sceneModel.appState}`)
        }
        this.sceneModel.appState = this;
    }

    addClockListener(callback:(t:number)=>any){
        const self = this;
        return this.addStateKeyListener('time', ()=>{
            callback(self.time);
        });
    }

    triggerGUIUpdate(){
        this._guiKey = uuidv4();
    }




    // selectModel(model?: NodeModelType) {
    //     this.selectedModel = model;
    // }


    addSceneControllerClass(container:HTMLDivElement, sceneControllerClass:ClassInterface<ASceneController<NodeModelType,SceneModelType>>, name?:string){
        const newController = new sceneControllerClass(container, this.sceneModel);
        let newname = name?name:sceneControllerClass.name;
        this.addSceneController(newController, newname);
    }

    addSceneController(sceneController:ASceneController<NodeModelType, SceneModelType>, name:string){
        let newname = name?name:(sceneController.constructor).name;
        let counter = 2;
        while(newname in this.sceneControllers){
            newname = newname+String(counter);
        }
        this.sceneControllers[newname]= sceneController;
        this.sceneControllers[newname].init(this.sceneModel);
        this.sceneControllers[newname].render();
    }


    AppComponent(sceneControllerClass:ClassInterface<ASceneController<NodeModelType,SceneModelType>>, name?:string, classSpec?:AMVCNodeClassSpec<NodeModelType>|AMVCNodeClassSpec<NodeModelType>[]){
        const self = this;
        async function initThreeJSContext(container: HTMLDivElement) {
            let sceneController = new sceneControllerClass(container);
            if(classSpec !== undefined && classSpec.length>0){
                if(Array.isArray(classSpec[0])){
                    for(let spec of classSpec){
                        if(Array.isArray(spec)) {
                            sceneController.addClassSpec(...spec);
                        }else{throw new Error("This shouldn't happen. Some kinda weird input error... check here.");}
                    }
                }else{
                    if(Array.isArray(classSpec) && classSpec.length===3) {
                        // @ts-ignore
                        sceneController.addClassSpec(...classSpec);
                    }else{throw new Error("This shouldn't happen. Some kinda weird input error... check here.");}
                }
            }
            // @ts-ignore
            let controllerName =sceneControllerClass._serializationLabel?sceneControllerClass._serializationLabel:sceneControllerClass.name;
            if(name!==undefined){
                controllerName = name;
            }
            self.addSceneController(sceneController, controllerName);
            self.triggerGUIUpdate();
        }

        return function ReturnAppComponent(props:any) {
            const container = useRef(null as unknown as HTMLDivElement);
            useEffect(() => {
                (async () => {
                    await initThreeJSContext(container.current);
                })();
            }, []);
            return (
                <div className="canvas">
                <div className="anigraphcontainer" ref={container}>
                    {props.children}
                </div>
            </div>
        );
        }
    }

    //##################//--React.CreateClass approach--\\##################
    //<editor-fold desc="React.CreateClass approach">
    // function createclass(){
    //     return React.CreateClass({
    //         render: function () {
    //             const container = useRef(null as unknown as HTMLDivElement);
    //             useEffect(() => {
    //                 (async () => {
    //                     await initThreeJSContext(container.current);
    //                 })();
    //             }, []);
    //             return (
    //                 <div className="canvas">
    //                     <div id={'anigraphcontainer'} ref={container}/>
    //                 </div>
    //             );
    //         }
    //     });
    // }
    //</editor-fold>
    //##################\\--React.CreateClass approach--//##################




    // initSceneController(container:HTMLDivElement){
    //     this.sceneController = new Base2DApp1SceneController(container, this.sceneModel);
    //     this.sceneController.init();
    //     this.sceneController.render();
    // }
}


export function GetAppState():AAppState<ASceneNodeModel,ASceneModel<ASceneNodeModel>>{
    // if(_appState === undefined){
    //     _appState = new AAppState();
    // }
    if(_appState===undefined){
        throw new Error("Must set app state!");
    }
    return _appState;
}
