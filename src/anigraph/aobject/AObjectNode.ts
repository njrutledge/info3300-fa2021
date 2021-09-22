import {AObject, AObjectState} from "./AObject";
import {ASerializable} from "../aserial/ASerializable";
import {ref} from "valtio";

@ASerializable("AObjectNode")
export class AObjectNode extends AObject{
    @AObjectState public children:AObjectNode[];
    public parent:AObjectNode|null;

    // constructor(stateObject:{[name:string]:any});
    // constructor();
    constructor(){
        super();
        // @ts-ignore
        this.children = (this.children===undefined)?[]:this.children;
        // @ts-ignore
        this.parent = (this.parent===undefined)?null:this.parent;
    }

    mapOverChildren(fn:(child:AObjectNode)=>any[]|void){
        var rvals = [];
        for(let child of this.children){
            rvals.push(fn(child));
        }
        return rvals;
    }

    release(...args:any[]){
        this.releaseChildren(...args)
        if(this.parent!==null){
            this.parent.removeChild(this);
        }
        //would do super.release(args) here...
    }

    removeChild(child:AObjectNode){
        for(let c=0;c<this.children.length;c++){
            if(this.children[c].uid===child.uid){
                this.children.splice(c,1);
                child.parent=null;
                return;
            }
        }
        throw new Error(`Tried to remove node ${child} that is not a child of ${this}`);
    }

    releaseChildren(...args:any[]){
        return this.mapOverChildren((child:AObjectNode)=>{return child.release(...args);});
    }

    removeChildren(){
        const self = this;
        return this.mapOverChildren((child:AObjectNode)=>{self.removeChild(child);});
    }

    addChild(child:AObjectNode, position?:number){
        if(this.children.includes(child)){
            throw new Error(`Tried to add existing child ${child} to node ${this}`);
        }
        child.parent=this;
        if(position!==undefined){
            this.children.splice(position, 0, ref(child));
        }else{
            this.children.push(ref(child));
        }
    }

    static fromJSON(state_dict:{[name:string]:any}){
        const rval = (this.CreateWithState(state_dict) as AObjectNode);
        rval.mapOverChildren((c:AObjectNode)=>{
                c.parent = rval;
            }
        );
        return rval;
    }
    toJSON(){
        return this.state;
    }


    //##################//--Reparenting--\\##################
    //<editor-fold desc="Reparenting">

    getChildWithID(uid:string){
        for(let c=0;c<this.children.length;c++){
            if(this.children[c].uid===uid){
                return this.children[c];
            }
        }
    }

    _removeFromParent(){
        if(this.parent){
            this.parent.removeChild(this);
        }
    }

    _attachToNewParent(newParent:AObjectNode){
        newParent.addChild(this);
    }

    _uidsToChildrenList(uidList:string[]){
        let aon_array:AObjectNode[] = [];
        for(let uid of uidList){
            let child = this.getChildWithID(uid);
            if(child) {
                aon_array.push(child);
            }else{
                throw new Error(`unrecognized child uid: ${uid}`);
            }
        }
        return aon_array;
    }

    _childrenListToUIDs(childrenList:AObjectNode[]){
        let rval:string[]= [];
        for(let c of childrenList){
            rval.push(c.uid);
        }
        return rval;
    }

    reorderChildren(uidList:string[]){
        for(let uid of uidList){
            let child = this.getChildWithID(uid);
            if(child){
                child.reparent(this);
            }else{
                throw new Error ("Tried to reorder children with uid that does not belong to parent.")
            }
        }
    }


    reparent(newParent:AObjectNode){
        this._removeFromParent();
        this._attachToNewParent(newParent);
    }
    //</editor-fold>
    //##################\\--Reparenting--//##################


}






