import {A2AppSceneNodeModel, A2AppSelectionController} from "../../../A2/mvc";
import {
    A2DSelectionModel,
    ADragInteraction,
    AInteractionEvent,
    AMockInteractionEvent,
    AMockInteractiveElement,
    Color,
    NodeTransform2D,
    V2,
    Vec2,
    VertexArray2D
} from "../../../anigraph";

export class A2SelectionController extends A2AppSelectionController<A2AppSceneNodeModel> {

}

export class A2SelectionModel extends A2DSelectionModel<A2AppSceneNodeModel> {

}

export function CreateTestModel(transform?: NodeTransform2D, color?: Color) {
    color = color ? color : Color.FromString('#55aa55');
    let newShape = new A2AppSceneNodeModel();
    let sz = 25;
    let sq = 0.5;
    let tform = transform as NodeTransform2D;
    if (!tform) {
        tform = new NodeTransform2D();
        //        Mat3.Translation2D(position).times(Mat3.Rotation(Math.PI / 3)).times(Mat3.Translation2D(sz * 3, sz * 2));
    }
    let verts = new VertexArray2D();
    verts.position.push(V2(-sz, -sz));
    verts.position.push(V2(0, -sz * sq));
    verts.position.push(V2(sz, -sz));
    verts.position.push(V2(sz * sq, 0));
    verts.position.push(V2(sz, sz));
    verts.position.push(V2(-sz, sz));
    newShape.color = color;
    newShape.verts = verts.GetLeftMultipliedBy(tform.getMatrix());
    newShape.recenterAnchor();
    // newShape.verts = verts;
    // this.sceneController.model.addNode(newShape);
    return newShape;
}

function GetMockSingleSelectionDragInteraction(element: any,
                                               model: A2AppSceneNodeModel,
                                               dragStartCallback: (interaction: ADragInteraction, model: A2AppSceneNodeModel, event?: any) => any,
                                               dragMoveCallback: (interaction: ADragInteraction, model: A2AppSceneNodeModel, event?: any) => any,
                                               dragEndCallback?: (interaction: ADragInteraction, model: A2AppSceneNodeModel, event?: any) => any,
                                               handle?: string) {
    return ADragInteraction.Create(
        element,
        (interaction: ADragInteraction, event: AInteractionEvent) => {
            dragStartCallback(interaction, model, event);
        },
        (interaction: ADragInteraction, event: AInteractionEvent) => {
            dragMoveCallback(interaction, model, event);
        },
        (interaction: ADragInteraction, event: AInteractionEvent) => {
            if (dragEndCallback) {
                dragEndCallback(interaction, model, event);
            }
        },
        handle
    );
}

//##################//--Group Selection--\\##################
//<editor-fold desc="Group Selection">
export class MockGroupSelectionDragInteraction {
    model: A2AppSceneNodeModel;
    element: AMockInteractiveElement;
    interaction: ADragInteraction;
    selectionTransform: NodeTransform2D;
    _startCallback: (interaction: ADragInteraction, model: A2AppSceneNodeModel, selectionTransform: NodeTransform2D, event?: any) => any;
    _moveCallback: (interaction: ADragInteraction, model: A2AppSceneNodeModel, selectionTransform: NodeTransform2D, event?: any) => any;
    _endCallback?: (interaction: ADragInteraction, model: A2AppSceneNodeModel, selectionTransform?: NodeTransform2D, event?: any) => any | undefined;

    get transform() {
        return this.model.transform.clone();
    }

    constructor(dragStartCallback: (interaction: ADragInteraction, model: A2AppSceneNodeModel, selectionTransform: NodeTransform2D, event?: any) => any,
                dragMoveCallback: (interaction: ADragInteraction, model: A2AppSceneNodeModel, selectionTransform: NodeTransform2D, event?: any) => any,
                dragEndCallback?: (interaction: ADragInteraction, model: A2AppSceneNodeModel, selectionTransform?: NodeTransform2D, event?: any) => any,
                model?: A2AppSceneNodeModel, selectionTransform?: NodeTransform2D, element?: AMockInteractiveElement) {
        this.model = model ? model : CreateTestModel();
        this.selectionTransform = selectionTransform ? selectionTransform : new NodeTransform2D();
        this.element = element ? element : new AMockInteractiveElement();
        this._startCallback = dragStartCallback;
        this._moveCallback = dragMoveCallback;
        this._endCallback = dragEndCallback;


        //##################//----\\##################
        //<editor-fold desc="">
        this.interaction = ADragInteraction.Create(
            element,
            (interaction: ADragInteraction, event: AInteractionEvent) => {
                dragStartCallback(interaction, this.model, this.selectionTransform, event);
            },
            (interaction: ADragInteraction, event: AInteractionEvent) => {
                dragMoveCallback(interaction, this.model, this.selectionTransform, event);
            },
            (interaction: ADragInteraction, event: AInteractionEvent) => {
                if (dragEndCallback) {
                    dragEndCallback(interaction, this.model, this.selectionTransform, event);
                }
            }
        );
    }

    callDragStart(cursorPosition: Vec2, shiftKey: boolean = false, altKey: boolean = false, ctrlKey:boolean=false, selectionTransform?:NodeTransform2D) {
        if(selectionTransform){
            this.selectionTransform = selectionTransform;
        }
        this.interaction.callDragStartCallback(new AMockInteractionEvent(this.interaction, cursorPosition, shiftKey, altKey, ctrlKey));
    }

    callDragMove(cursorPosition: Vec2, shiftKey: boolean = false, altKey: boolean = false, ctrlKey:boolean=false, selectionTransform?:NodeTransform2D) {
        if(selectionTransform){
            this.selectionTransform = selectionTransform;
        }
        this.interaction.callDragMoveCallback(new AMockInteractionEvent(this.interaction, cursorPosition, shiftKey, altKey, ctrlKey));
    }

    callDragEnd(cursorPosition: Vec2, shiftKey: boolean = false, altKey: boolean = false, ctrlKey:boolean=false, selectionTransform?:NodeTransform2D) {
        if(selectionTransform){
            this.selectionTransform = selectionTransform;
        }
        this.interaction.callDragEndCallback(new AMockInteractionEvent(this.interaction, cursorPosition, shiftKey, altKey, ctrlKey));
    }

    //</editor-fold>
    //##################\\----//##################
}

//</editor-fold>
//##################\\--Group Selection--//##################


export class MockSingleSelectionDragInteraction {
    model: A2AppSceneNodeModel;
    element: AMockInteractiveElement;
    interaction: ADragInteraction;
    _startCallback!: (interaction: ADragInteraction, model: A2AppSceneNodeModel, event?: any) => any;
    _moveCallback!: (interaction: ADragInteraction, model: A2AppSceneNodeModel, event?: any) => any;
    _endCallback!: ((interaction: ADragInteraction, model: A2AppSceneNodeModel, event?: any) => any) | undefined;

    get transform() {
        return this.model.transform.clone();
    }

    constructor(dragStartCallback: (interaction: ADragInteraction, model: A2AppSceneNodeModel, event?: any) => any,
                dragMoveCallback: (interaction: ADragInteraction, model: A2AppSceneNodeModel, event?: any) => any,
                dragEndCallback?: (interaction: ADragInteraction, model: A2AppSceneNodeModel, event?: any) => any,
                model?: A2AppSceneNodeModel, element?: AMockInteractiveElement) {
        this.model = model ? model : CreateTestModel();
        this.element = element ? element : new AMockInteractiveElement();
        this._startCallback = dragStartCallback;
        this._moveCallback = dragMoveCallback;
        this._endCallback = dragEndCallback;
        this.interaction = GetMockSingleSelectionDragInteraction(this.element, this.model,
            this._startCallback,
            this._moveCallback,
            this._endCallback,
        );
    }

    callDragStart(cursorPosition: Vec2, shiftKey: boolean = false, altKey: boolean = false, ctrlKey:boolean=false) {
        this.interaction.callDragStartCallback(new AMockInteractionEvent(this.interaction, cursorPosition, shiftKey, altKey, ctrlKey));
    }

    callDragMove(cursorPosition: Vec2, shiftKey: boolean = false, altKey: boolean = false, ctrlKey:boolean=false) {
        this.interaction.callDragMoveCallback(new AMockInteractionEvent(this.interaction, cursorPosition, shiftKey, altKey,ctrlKey));
    }

    callDragEnd(cursorPosition: Vec2, shiftKey: boolean = false, altKey: boolean = false, ctrlKey:boolean=false) {
        this.interaction.callDragEndCallback(new AMockInteractionEvent(this.interaction, cursorPosition, shiftKey, altKey, ctrlKey));
    }
}

export class MockHandleInteraction extends MockSingleSelectionDragInteraction {
    constructor(model?: A2AppSceneNodeModel, element?: AMockInteractiveElement) {
        super(A2SelectionController.prototype.dragBBoxCornerStartCallback,
            A2SelectionController.prototype.dragBBoxCornerMoveCallback,
            A2SelectionController.prototype.dragBBoxCornerEndCallback,
            model,
            element
        )
    }
}
