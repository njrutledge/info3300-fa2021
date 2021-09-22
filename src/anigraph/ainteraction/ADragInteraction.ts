import {AInteraction, AInteractionEvent, AInteractionEventListener,} from "./AInteraction";
import {CallbackType} from "../aevents";
import {Vec2} from "../amath";


export type ADragInteractionCallback = (interaction:ADragInteraction, event?:any)=>any;
// export type ADragSelectionCallback = (interaction:ADragInteraction, currentModelData:GenericDict, event?:any)=>any;

export class ADragInteractionBase extends AInteraction{
    public _dragCallbacks:{[name:string]:CallbackType}={};
    public _dragSetCallback!:CallbackType|null;
    public _mouseDownEventListener!:AInteractionEventListener;
    public _mouseMoveEventListener!:AInteractionEventListener;
    public _mouseUpEventListener!:AInteractionEventListener;
    public dragState:{[name:string]:any}={};

    public dragStartPosition!:Vec2;

    setInteractionState(name:string, value:any){
        this.dragState[name]=value;
    }
    getInteractionState(name:string){
        return this.dragState[name];
    }
    clearInteractionState(){
        this.dragState={};
    }



    // static CreateForSelection(element:any,
    //               selectionModel:ASelectionModel,
    //               dragStartCallback:ADragSelectionCallback,
    //               dragMoveCallback:ADragSelectionCallback,
    //               dragEndCallback?:ADragSelectionCallback,
    //               handle?:string){
    //
    //
    //     const startCallback:ADragInteractionCallback=(interaction:ADragInteraction, event?:any){
    //
    //     }
    //     const interaction = new this(element, undefined, handle);
    //     interaction.setDragStartCallback(dragStartCallback);
    //     interaction.setDragMoveCallback(dragMoveCallback);
    //     if(dragEndCallback) {
    //         interaction.setDragEndCallback(dragEndCallback);
    //     }else{
    //         interaction.setDragEndCallback(dragEndCallback);
    //     }
    //     interaction.bindMethods();
    //     //Finally, return the interaction
    //     return interaction;
    // }


    release(){
        this._removeDragListeners();
        this.clearInteractionState();
        super.release();
    }

    activate(){
        this._removeDragListeners();
        this._addDragListeners();
        this._mouseDownEventListener.addListener();
        this.active = true;
    }

    deactivate(){
        this.clearInteractionState();
        super.deactivate();
    }

    setDragStartCallback(dragStartCallback:CallbackType){
        if(this._dragCallbacks===undefined){
            this._dragCallbacks = {};
        }
        this._dragCallbacks['start'] = dragStartCallback;
        if(this.active){this._updateDragListeners();}
    }

    getDragStartCallback(){return this._dragCallbacks['start'];}
    callDragStartCallback(event:any){
        return this._dragCallbacks['start'](this, event)
    }

    setDragMoveCallback(dragMoveCallback:CallbackType){
        if(this._dragCallbacks===undefined){
            this._dragCallbacks = {};
        }
        this._dragCallbacks['move'] = dragMoveCallback;
        if(this.active){this._updateDragListeners();}
    }
    getDragMoveCallback(){return this._dragCallbacks['move'];}
    callDragMoveCallback(event:any){
        return this._dragCallbacks['move'](this, event)
    }

    setDragEndCallback(dragEndCallback?:CallbackType){
        if(this._dragCallbacks===undefined){
            this._dragCallbacks = {};
        }
        if(dragEndCallback) {
            this._dragCallbacks['end'] = dragEndCallback;
        }else{
            this._dragCallbacks['end'] = (event:Event)=>{};
        }
        if(this.active){this._updateDragListeners();}
    }
    getDragEndCallback(){return this._dragCallbacks['end'];}
    callDragEndCallback(event:any){
        return this._dragCallbacks['end'](this, event)
    }

    _updateDragListeners(){
        this._removeDragListeners();
        this._addDragListeners();
    }
    _removeDragListeners(){
        this.clearEventListeners();
    }
    _addDragListeners(){
        if(this._dragSetCallback===undefined){
            this._dragSetCallback=null;
        }
        if(this._dragSetCallback!==null){
            this._removeDragListeners();
        }
        const interaction = this;
        const self = this;

        function dragmovingcallback(event:AInteractionEvent) {
            event.preventDefault();
            interaction.callDragMoveCallback(event);
        }
        self._mouseMoveEventListener = self.addWindowEventListener('mousemove', dragmovingcallback);



        function dragendcallback(event:AInteractionEvent) {
            event.preventDefault();
            interaction.callDragEndCallback(event);
            self._mouseMoveEventListener.removeListener();
            // startCallback();
        }
        self._mouseUpEventListener = self.addWindowEventListener('mouseup', dragendcallback, {once: true});
        // self._mouseUpEventListener = self.addWindowEventListener('mouseup', dragendcallback);


        this._dragSetCallback = function(event:AInteractionEvent){
            event.preventDefault();
            if(!self._shouldIgnoreEvent(event._event)){
                interaction.callDragStartCallback(event);
                self._mouseMoveEventListener.addListener();
                self._mouseUpEventListener.addListener();
            }

        }

        // startCallback();
        if(interaction._dragSetCallback) {
            self._mouseDownEventListener = self.addEventListener('mousedown', interaction._dragSetCallback);
        }
    }
}

export class ADragInteraction extends ADragInteractionBase{
    static Create(element:any,
                  dragStartCallback:ADragInteractionCallback,
                  dragMoveCallback:ADragInteractionCallback,
                  dragEndCallback?:ADragInteractionCallback,
                  handle?:string){
        const interaction = new this(element, undefined, handle);
        interaction.setDragStartCallback(dragStartCallback);
        interaction.setDragMoveCallback(dragMoveCallback);
        interaction.setDragEndCallback(dragEndCallback);
        interaction.bindMethods();
        //Finally, return the interaction
        return interaction;
    }
}
