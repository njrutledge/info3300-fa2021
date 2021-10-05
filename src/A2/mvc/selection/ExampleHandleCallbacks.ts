//##################//--Example callbacks--\\##################
//<editor-fold desc="Example callbacks">
import {ADragInteraction, AInteractionEvent} from "../../../anigraph";
import {A2AppSceneNodeModel} from "../scenenode";

export function exampleDragBBoxCornerStartCallback(interaction: ADragInteraction, model:A2AppSceneNodeModel, event: AInteractionEvent){
    /***
     * This is the drag start callback function. This function will be called when the mouse is pressed down.
     *
     * Here we can store the transform at the start of the drag interaction
     * by saving it to the interaction state. We will then be able to access it in the other callbacks
     * later. You can use setInteractionState/getInteractionState to store state in one callback that
     * you will be able to access in the others.
     */
    interaction.setInteractionState('startTransform', model.transform.clone());

    /***
     * Let's also store the start position of the drag. The interaction has a special attribute for this.
     */
    interaction.dragStartPosition = event.cursorPosition;
}

export function exampleDragBBoxCornerMoveCallback(interaction: ADragInteraction, model: A2AppSceneNodeModel, event: AInteractionEvent) {
    /***
     * This is the drag move callback function. This function will be called when the mouse is being dragged.
     *
     * Now that the cursor has moved, we will translate the object by the same amount.
     *
     * Note that it may be safest to use clone() when getting vectors, matrices and other objects that are set in the
     * drag start callback to make sure you don't accidentally change them in the move callback.
     */
    let startTransform = interaction.getInteractionState('startTransform').clone();


    /***
     * If the alt key or shift key is down we will move in the wrong direction. Not super exciting, but
     * shows we can change behavior based on key modifiers...
     */
    if (event.altKey || event.shiftKey) {
        model.transform.position =
            startTransform.position
                .minus(event.cursorPosition)
                .minus(interaction.dragStartPosition);
    }else{
        model.transform.position =
            startTransform.position
                .plus(event.cursorPosition)
                .minus(interaction.dragStartPosition);
    }
}

export function exampleDragBBoxCornerEndCallback(interaction: ADragInteraction, model: A2AppSceneNodeModel, event: AInteractionEvent){
    /***
     * This is the drag end callback function. This function
     * will be called when the mouse is let go after dragging.
     *
     * We don't need to do anything on drag end.
     */
}
//</editor-fold>
//##################\\--Example callbacks--//##################
