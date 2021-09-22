import {AAppState} from "./AAppState";
import {ASerializable} from "../aserial";
import {A2DSceneModel, A2DSceneNodeModel, A2DSelectionModel} from "./2d";
import {SelectionEvents} from "./base/selection/ASelectionModel";
import {ASelection} from "../aobject/ASelection";

@ASerializable("A2DAppState")
export abstract class A2DAppState<NodeModelType extends A2DSceneNodeModel, SceneModelType extends A2DSceneModel<NodeModelType>> extends AAppState<NodeModelType, SceneModelType> {
    initSelection(){
        this.selectionModel = new A2DSelectionModel<NodeModelType>();
        this.selectionModel.initSelection();
        let selectionEvents = SelectionEvents;

        //##################//--For testing...--\\##################
        //<editor-fold desc="For testing...">
        if(!selectionEvents){
            // @ts-ignore
            selectionEvents = (this.selectionModel.constructor).SelectionEvents;
        }
        //</editor-fold>
        //##################\\--For testing...--//##################

        this.subscribe(
            this.selectionModel.addEventListener(selectionEvents.SelectionChanged, (selection: ASelection<NodeModelType>) => {
                this.onSelectionChanged(selection);
            }),
            SelectionEvents.SelectionChanged
        );
        this.selectionSubscriptionIsActive=false;
    }

}
