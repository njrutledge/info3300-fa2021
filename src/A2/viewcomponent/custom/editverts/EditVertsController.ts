import {A2AppSceneNodeController} from "../../../mvc";
import {
    A2DSceneController, A2DSceneModel,
    A2DSceneNodeModel,
    ADragInteraction,
    AHandleElement,
    AInteractionEvent,
    AInteractionMode, AniGraphEnums, GetAppState
} from "../../../../anigraph";
import {EditVertsModel} from "./EditVertsModel";
import {EditVertsView} from "./EditVertsView";
import {Base2DAppAppState, Base2DAppModel} from "../../../../anigraph/apps/Base2DApp";
import {A2AppGlobalState} from "../../../A2AppGlobalState";


const EditingInteractionModeName = 'editing';

export class EditVertsController extends A2AppSceneNodeController {
    public view!:EditVertsView;

    constructor() {
        super();

        // let's define an interaction mode called "editing"
        this.defineInteractionMode(EditingInteractionModeName);
    }

    initInteractions() {
        super.initInteractions();

        const self=this;
        const model = this.model as EditVertsModel;
        /***
         * Now every time the inEditMode attribute changes in our model, activate or deactivate edit mode and toggle the
         * visibility of the handles. We will put the handle interactions on this edit mode so that they are only active
         * when we are in edit mode...
         */
        this.subscribe(this.model.addStateKeyListener('inEditMode', ()=> {
                if (model.inEditMode) {
                    self.setCurrentInteractionMode(EditingInteractionModeName);
                    for (let h = 0; h < this.view.vertexHandles.length; h++) {
                            self.view.vertexHandles[h].visible = true;
                    }
                } else {
                    self.setCurrentInteractionMode();
                    for (let h = 0; h < this.view.vertexHandles.length; h++) {
                        self.view.vertexHandles[h].visible = false;
                    }
                }
            })
        );
    }

    initHandleInteractions(handleElement: AHandleElement) {
        const model = this.model;
        // Add the handle's interaction to the editing interaction mode
        this.getInteractionMode(EditingInteractionModeName).addInteraction(ADragInteraction.Create(handleElement.threejs,
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    //This is basically just casting the interaction's element attribute to an AHandleElement
                    interaction.setInteractionState('startValue', model.verts.position.getPoint2DAt(handleElement.index));
                    interaction.dragStartPosition = event.cursorPosition;
                },
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    model.verts.position.setAt(handleElement.index,
                        interaction.getInteractionState('startValue').plus(
                            event.cursorPosition.minus(interaction.dragStartPosition)
                        ));
                }
            )
        );
    }

    /**
     * This defines the interaction that will govern creating new shapes when you toggle "creatingNew" in the GUI while
     * the current model type is selected in the "NewModelType" dropdown
     * @param {A2DSceneController<NodeType, A2DSceneModel<NodeType>>} sceneController
     * @param {string} CreateShapeName
     * @returns {ADragInteraction}
     * @constructor
     */
    static CreateShapeInteraction<NodeType extends A2DSceneNodeModel>(sceneController:A2DSceneController<NodeType, A2DSceneModel<NodeType>>, CreateShapeName?:string){
        // We will use the name in AniGraphEnums.CreateShapeInteractionName as a handle/ID for our interaction
        CreateShapeName=CreateShapeName?CreateShapeName:AniGraphEnums.CreateShapeInteractionName;
        const appState = GetAppState() as unknown as A2AppGlobalState;

        // We will create and return a drag interaction that will be active while we are in `creatingNew` mode.
        // The drag action will create a new shape the first time we click, and then it will lay a new vertex for each
        // subsequent click.`
        return ADragInteraction.Create(sceneController.backgroundElement,
            (interaction:ADragInteraction, event: AInteractionEvent) => {
                if(interaction.getInteractionState("newShape")===undefined){
                    // deselect anything that might be selected and freeze selection while in creatingNew mode
                    sceneController.selectModel();
                    appState.freezeSelection();

                    // In this case, NewNode should create a new Model with whatever class is selected in the
                    // `NewModelType` dropdown menu
                    let newShape = sceneController.model.NewNode();

                    //let's add a vertex for the current cursor position
                    newShape.verts.position.push(event.cursorPosition);
                    //set the color according to whatever the current selected color is
                    newShape.color = appState.selectedColor;
                    //add the new shape to the scene model.
                    sceneController.model.addNode(newShape)

                    // we will keep track of our new shape in our interaction state
                    interaction.setInteractionState("newShape", newShape);
                }else{
                    // for each subsequent click we add a vertex
                    (interaction.getInteractionState("newShape") as EditVertsModel).verts.addVertex(event.cursorPosition);
                }
            }, (interaction, event)=>{
                // let's pull up the new shape that we are working on...
                let newshape:EditVertsModel = interaction.getInteractionState("newShape");
                if(newshape) {
                    //and change the position of the last vertex to be the current cursor location.
                    //this will let us move the cursor we are placing by dragging our mouse around
                    newshape.verts.position.setAt(newshape.verts.length - 1, event.cursorPosition);
                }
            }, (interaction, event)=>{
                // end callback doesn't need to do anything
            },
            CreateShapeName);
    }
}
