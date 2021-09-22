import {A2DSelectionController, ADragInteraction, AInteractionEvent} from "src/anigraph";
import {A2AppSceneNodeModel} from "../scenenode";
import {A2AppSelectionView} from "./A2AppSelectionView";
import {
    exampleDragBBoxCornerMoveCallback,
    exampleDragBBoxCornerStartCallback,
    exampleDragBBoxCornerEndCallback
} from "./ExampleHandleCallbacks";

export class A2AppSelectionController<NodeModelType extends A2AppSceneNodeModel> extends A2DSelectionController<NodeModelType>{
    public view!: A2AppSelectionView<NodeModelType>;


    initView() {
        if (!this.view) {
            this.view = new A2AppSelectionView();
            this.view.controller = this;
        }
        this.view.init();
    }

    initInteractions() {
        super.initInteractions();
        this.addHandleControls();
    }

    //##################//--Your Callbacks--\\##################
    //<editor-fold desc="Your Callbacks">
    /***
     * This is the drag start callback function. This function will be called
     * when the mouse is pressed down, so we'll want to store the interaction's
     * initial state.
     *
     * @param interaction: the drag interaction
     * @param model: the A2AppSceneNodeModel of the shape whose bounding box is dragged
     * @param event: the AInteractionEvent of this interaction
     */
    dragBBoxCornerStartCallback(interaction: ADragInteraction, model: A2AppSceneNodeModel, event: AInteractionEvent) {
        // TODO: Replace the following line with your code
        exampleDragBBoxCornerStartCallback(interaction, model, event);
    }

    /***
     * This is the drag move callback function. This function will be called
     * when the mouse is being dragged, so we want to determine which
     * transformations to use and then apply them to the shape.
     *
     * @param interaction: the drag interaction
     * @param model: the A2AppSceneNodeModel of the shape whose bounding box is dragged
     * @param event: the AInteractionEvent of this interaction
     */
    dragBBoxCornerMoveCallback(interaction: ADragInteraction, model: A2AppSceneNodeModel, event: AInteractionEvent) {
        // TODO: Replace the following line with your code
        exampleDragBBoxCornerMoveCallback(interaction, model, event);
    }

    /***
     * This is the drag end callback function. This function will be called when
     * the mouse is let go after dragging.
     *
     * @param interaction: the drag interaction
     * @param model: the A2AppSceneNodeModel of the shape whose bounding box is dragged
     * @param event: the AInteractionEvent of this interaction
     */
    dragBBoxCornerEndCallback(interaction: ADragInteraction, model: A2AppSceneNodeModel, event: AInteractionEvent) {
        // TODO: Replace the following line with your code
        exampleDragBBoxCornerEndCallback(interaction, model, event);
    }
    //</editor-fold>
    //##################\\--Your Callbacks--//##################


    /**
     * This function controls the interactions with the model's bounding box.
     * Here you will be writing callback functions to modify the corners of the
     * bound box based on mouse movement.
     *
     * We recommend familiarizing yourself with the available methods in `Mat3`.
     *
     * Also familiarize yourself with the available functions in `Precision`.
     * These are useful when dealing with floating point inaccuracies and other
     * small numbers.
     *
     * Note: do not let the scale factor be less than epsilon.
     *
     */
    addHandleControls() {
        for (let h = 0; h < 4; h++) {
            this.addSingleSelectionInteraction(
                this.view.handles[h].threejs,
                this.dragBBoxCornerStartCallback,
                this.dragBBoxCornerMoveCallback,
                this.dragBBoxCornerEndCallback,
                'HandleResize'
            )
        }

    }
}
