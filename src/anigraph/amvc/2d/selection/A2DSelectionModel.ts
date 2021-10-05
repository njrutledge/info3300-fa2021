import {ASelectionModel, SelectionEvents} from "../../base/selection";
import {AObjectState} from "../../../aobject";
import {BoundingBox2D} from "../../../amath/BoundingBox2D";
import {A2DSceneNodeModel} from "../scenenode";
import {AModel} from "../../base";
import {ASelection} from "../../../aobject/ASelection";
import {ASerializable} from "../../../aserial";
import {NodeTransform2D} from "../../../../A2/math/NodeTransform2D";

export enum SelectionListeners{
    VertsUpdate='Verts Updated',
    TransformUpdate='Transform Updated'
}

function SelectionListenerSubscriptionName(listenerType:SelectionListeners, model:AModel){
    return listenerType+model.uid;
}

@ASerializable("A2DSelectionModel")
export class A2DSelectionModel<NodeModelType extends A2DSceneNodeModel> extends ASelectionModel<NodeModelType>{
    @AObjectState public bounds!:BoundingBox2D;
    @AObjectState public handleSize!:number;
    @AObjectState public lineWidth!:number;


    /**
     * TODO Does this need to be conditional for when single model is selected?
     * @returns {NodeTransform2D}
     */
    get transform(){
        return this.bounds.transform;
    }
    set transform(value:NodeTransform2D){
        this.bounds.transform=value;
    }

    get singleSelectedModel():NodeModelType|undefined{
        let selected = this.list();
        if(selected.length===1){
            return selected[0] as NodeModelType;
        }
    }

    constructor(name?:string) {
        super(name);
        this.handleSize=5;
        this.lineWidth=0.01;
    }

    get selectedModels():A2DSceneNodeModel[]{
        return this.list() as A2DSceneNodeModel[];
    }

    /**
     * If a single object is selected then we will use its bounds as bounds. If multiple objects are selected then we
     * will calculate bounds
     */
    calculateBounds(){
        let singleSelectedModel = this.singleSelectedModel;
        if(singleSelectedModel){
            let bounds = singleSelectedModel.getBounds();
            if(bounds) {
                this.bounds = bounds;
                return;
            }
        }
        let newBounds = new BoundingBox2D();
        let selectedModels = this.selectedModels;
        for(let m of selectedModels){
            newBounds.boundBounds(m.getBounds())
        }
        this.bounds = newBounds; // triggers update on anything that might have been listening to bounds.
    }


    initSelection(){
        const self = this;
        // @ts-ignore
        this._selection = new ASelection<A2DSceneNodeModel>(
            [],
            (enteringSelection)=>{

                self.subscribe(enteringSelection.addStateKeyListener('verts',
                        ()=>{
                            self.calculateBounds();
                        }, false,
                        SelectionListenerSubscriptionName(SelectionListeners.VertsUpdate,enteringSelection)),
                    SelectionListenerSubscriptionName(SelectionListeners.VertsUpdate,enteringSelection)
                );
                self.subscribe(enteringSelection.addStateKeyListener('transform',
                        ()=>{
                            self.calculateBounds();
                        }, false,
                        SelectionListenerSubscriptionName(SelectionListeners.TransformUpdate,enteringSelection)),
                    SelectionListenerSubscriptionName(SelectionListeners.TransformUpdate,enteringSelection)
                );

                enteringSelection.signalEvent(SelectionEvents.SelectionItemEnter);
            },
            (remainingInSelection)=>{
                // self.signalEvent(SelectionEvents.SelectionItemUpdate, remainingInSelection, self);
                remainingInSelection.signalEvent(SelectionEvents.SelectionItemUpdate);
            },
            (leavingSelection:A2DSceneNodeModel)=>{
                self.unsubscribe(SelectionListenerSubscriptionName(SelectionListeners.VertsUpdate,leavingSelection));
                self.unsubscribe(SelectionListenerSubscriptionName(SelectionListeners.TransformUpdate,leavingSelection));
                leavingSelection.signalEvent(SelectionEvents.SelectionItemExit);
            }
        );
        this.bounds = new BoundingBox2D();
        this.subscribe(this.addSelectionStateListener(()=>{
            self.calculateBounds();
        }))
    }

}
