import {AModel, AModelInterface} from "../index";
import {AObject, AObjectNode, AObjectState} from "../../../aobject";
import {ASerializable} from "../../../aserial";
import {ASelection} from "../../../aobject/ASelection";
import {GenericDict} from "../../../basictypes";

export enum SelectionEvents{
    SelectionChanged='SelectionChanged',
    SelectionItemEnter='SelectionItemEnter',
    SelectionItemUpdate='SelectionItemUpdate',
    SelectionItemExit='SelectionItemExit',
}

@ASerializable("ASelectionModel")
export class ASelectionModel<SelectableModelType extends AModel> extends AModel{
    @AObjectState public name!:string;
    @AObjectState public _selection!:ASelection<SelectableModelType>;
    @AObjectState public isFrozen!:boolean;

    static SelectionEvents = SelectionEvents;

    get singleSelectedModel(){
        let selected = this.list();
        if(selected.length===1){
            return selected[0];
        }
    }

    constructor(name?:string) {
        super(name);
    }

    /**
     * initspecs should be a dictionary mapping snapshot keys to functions used to compute their initial values
     * returns a function that takes a model as input and returns its snapshot dict.
     * @param initSpecs
     * @returns {(m: AModelInterface) => any}
     */
    getSelectionSnapshotStore(initSpecs?:{[name:string]:(m:AModelInterface)=>any}){
        let snapshotStore:GenericDict={};
        let selected = this.list();
        for(let m of selected){
            snapshotStore[m.uid]={};
            if(initSpecs){
                for(let key in initSpecs){
                    snapshotStore[m.uid][key]=initSpecs[key](m);
                }
            }
        }
        return (m:AModelInterface)=>{return snapshotStore[m.uid];}
    }

    get selection(){
        return this._selection;
    }

    get selectedModels():AModel[]{
        return this.list();
    }


    getModelGUIControlSpecs(){
        if(!this.nSelectedModels){
            return {};
        }
        let model = this.selection.list()[0];
        // @ts-ignore
        if(typeof model.getModelGUIControlSpec == 'function'){
            // @ts-ignore
            return model.getModelGUIControlSpec();
        }else{
            return {};
        }

    }


    public parent!:AObjectNode | null;


    /**
     * Use the getter to add type constraints to selection in subclass. E.g.,
     * get selection():ASelection<A2DSceneNodeModel>{
     *     return this._selection as ASelection<A2DSceneNodeModel>;
     * }
     *
     */


    initSelection(){
        this._selection = new ASelection<SelectableModelType>();
    }

    /**
     *
     * @param model
     * @param updateExistingSelection - this is what you would think of as whether the shift key is down. If se to true,
     * It means that the provided model should be added or subtracted from the selection, rather than replacing the
     * selection
     */
    selectModel(model?:SelectableModelType, editExistingSelection=false){
        if(this.isFrozen){
            return;
        }
        if(model){
            if(!editExistingSelection) {
                this.selection.set([model]);
            }else{
                this.selection.toggleSelected(model);
            }
        }else{
            this.selection.set([]);
        }
        this.signalEvent(SelectionEvents.SelectionChanged, this.selection);
    }

    addSelectionStateListener(callback:(self:AObject)=>void, synchronous:boolean=true, handle?:string){
        return this.addStateKeyListener("_selection", callback, synchronous, handle);
        // return this.addStateListener(callback, synchronous, handle);
    }

    get nSelectedModels(){
        return this.list().length;
    }

    list(){
        return this.selection.list();
    }
}
