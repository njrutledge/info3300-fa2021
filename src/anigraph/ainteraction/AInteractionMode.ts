import {AInteraction} from "./AInteraction";
import {AControllerInterface} from "../amvc";

export interface AInteractionModeInterface{
    interactions:AInteraction;

}

export class AInteractionMode{
    public name:string;
    public owner!:AControllerInterface<any>;
    protected interactions:AInteraction[]=[];
    protected _afterActivate!:(...args:any[])=>any;
    protected _afterDeactivate!:(...args:any[])=>any
    protected _beforeActivate!:(...args:any[])=>any;
    protected _beforeDeactivate!:(...args:any[])=>any
    public active:boolean=false;

    constructor(name:string, owner:AControllerInterface<any>){
        this.name = name;
        this.owner = owner;
    }

    addInteraction(interaction:AInteraction){
        // if(this.active){
        //     throw new Error("Cannot add interactions to an active interaction mode!");
        // }
        this.interactions.push(interaction);
        if(this.active && !interaction.active){
            interaction.activate();
        }
        if(!this.active && interaction.active){
            interaction.deactivate();
        }
    }

    deactivate(){
        if(this._beforeDeactivate!==undefined){
            this._beforeDeactivate();
        }
        for (let interaction of this.interactions) {
            interaction.deactivate();
        }
        if(this._afterDeactivate!==undefined){
            this._afterDeactivate();
        }
        this.active=false;
    }

    activate(){
        if(this._beforeActivate!==undefined){
            this._beforeActivate();
        }
        for (let interaction of this.interactions) {
            interaction.activate();
        }
        if(this._afterActivate!==undefined){
            this._afterActivate();
        }
        this.active=true;
    }

    setAfterActivateCallback(callback:(...args:any[])=>any){
        this._afterActivate = callback;
    }
    setBeforeActivateCallback(callback:(...args:any[])=>any){
        this._beforeActivate = callback;
    }
    setAfterDeactivateCallback(callback:(...args:any[])=>any){
        this._afterDeactivate = callback;
    }
    setBeforeDeactivateCallback(callback:(...args:any[])=>any){
        this._beforeDeactivate = callback;
    }
}


