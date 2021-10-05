/**
 * Selection controllers are owned by the scene controller.
 * The selection model has a selection object, which holds a set of AModels.
 * The view is a view of this selection.
 * The controller specifies interaction with the view (i.e., interactions that modify the selected models).
 *
 * By default, node controllers have
 */

import {ASelectionController} from "../../base/selection/ASelectionController";
import {A2DSelectionView} from "./A2DSelectionView";
import {A2DSelectionModel} from "./A2DSelectionModel";
import {ASerializable} from "../../../aserial";
import {AModelInterface} from "../../base";
import {A2DSceneNodeModel} from "../scenenode";
import {ASceneNodeController, SceneNodeControllerInteractionModes} from "../../base/scenenode";
import {ADragInteraction, AInteractionEvent, AStaticClickInteraction} from "../../../ainteraction";
import {Mat3, NodeTransform2D} from "../../../amath";


@ASerializable("A2DSelectionController")
export class A2DSelectionController<NodeModelType extends A2DSceneNodeModel> extends ASelectionController<NodeModelType, A2DSelectionModel<NodeModelType>> {
    protected _model!: A2DSelectionModel<NodeModelType>;
    public view!:A2DSelectionView<NodeModelType>;
    get model() {
        return this._model;
    }

    constructor() {
        super();
    }

    init(model: A2DSelectionModel<NodeModelType>, view?:A2DSelectionView<NodeModelType>) {
        super.init(model, view);
    }

    initView() {
        if (!this.view) {
            this.view = new A2DSelectionView();
            this.view.controller = this;
        }
        this.view.init();
    }

    initNodeControllerInSelectionInteractions(controller: ASceneNodeController<NodeModelType>) {
        const inSelectionModeName = SceneNodeControllerInteractionModes.inSelection;
        const model = controller.model;
        const selectionModel = this.model;
        controller.defineInteractionMode(inSelectionModeName);
        controller.setCurrentInteractionMode(inSelectionModeName);
        controller.addInteraction(
            AStaticClickInteraction.Create(
                controller.view.threejs,
                function (event: AInteractionEvent) {
                    if (event.shiftKey) {
                        controller.sceneController.selectModel(model, event);
                    }
                },
                "SelectNode"
            )
        )
        const dragSelectionInteraction = ADragInteraction.Create(controller.view.threejs,
            function (interaction: ADragInteraction, event: AInteractionEvent) {
                interaction.setInteractionState(
                    'selectionStartStore',
                    selectionModel.getSelectionSnapshotStore({
                        'startTransform': (m: AModelInterface) => {
                            return (m as A2DSceneNodeModel).transform.clone();
                        }
                    })
                );
                interaction.dragStartPosition=event.cursorPosition;
            },
            function (interaction: ADragInteraction, event: AInteractionEvent) {
                let selected = selectionModel.list();
                let store = interaction.getInteractionState('selectionStartStore');
                if(event.altKey && selectionModel.singleSelectedModel){
                    let m = selectionModel.singleSelectedModel as A2DSceneNodeModel;
                    let stored = store(m)
                    let storedTransform = (stored.startTransform as NodeTransform2D);
                    let oldposition = stored.startTransform.position;
                    m.transform.setWithMatrix(
                        Mat3.Translation2D(
                            event.cursorPosition.minus(
                                interaction.dragStartPosition
                            )
                        ).times(
                            storedTransform.getMatrix()
                        ),
                        oldposition
                    );
                }else {
                    for (let m of selected) {
                        let stored = store(m);
                        (m as A2DSceneNodeModel).transform.position = stored.startTransform.position.plus(event.cursorPosition).minus(interaction.dragStartPosition);
                    }
                }

            },
            function (interaction, event) {
            },
            "DragWhenSelected"
        );
        controller.addInteraction(dragSelectionInteraction);
        controller.setCurrentInteractionMode();
    }


    addSingleSelectionInteraction(element:any,
                                  dragStartCallback:(interaction:ADragInteraction, model:NodeModelType, event?:any)=>any,
                                  dragMoveCallback:(interaction:ADragInteraction, model:NodeModelType, event?:any)=>any,
                                  dragEndCallback?:(interaction:ADragInteraction, model:NodeModelType, event?:any)=>any,
                                  handle?:string){
        const self=this;
        const selectionModel = this.model;
        return this.addInteraction(
            ADragInteraction.Create(
                element,
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    let model = (selectionModel.singleSelectedModel as NodeModelType);
                    if (!model) {
                        return;
                    }
                    dragStartCallback(interaction, model, event);
                },
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    let model = (selectionModel.singleSelectedModel as NodeModelType);
                    if (!model) {
                        return;
                    }
                    dragMoveCallback(interaction, model, event);
                },
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    if(dragEndCallback){
                        let model = (selectionModel.singleSelectedModel as NodeModelType);
                        if (!model) {
                            return;
                        }
                        dragEndCallback(interaction, model, event);
                    }
                },
                handle
            )
        )
    }

    addGroupSelectionInteraction(element:any,
                                  dragStartCallback:(interaction:ADragInteraction, model:NodeModelType, selectionTransform:NodeTransform2D, event?:any)=>any,
                                  dragMoveCallback:(interaction:ADragInteraction, model:NodeModelType, selectionTransform:NodeTransform2D, event?:any)=>any,
                                  dragEndCallback?:(interaction:ADragInteraction, model:NodeModelType, selectionTransform:NodeTransform2D, event?:any)=>any,
                                  handle?:string){
        const self=this;
        const selectionModel = this.model;
        return this.addInteraction(
            ADragInteraction.Create(
                element,
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    let selection = (selectionModel.list() as NodeModelType[]);
                    for(let m of selection){
                        dragStartCallback(interaction, m, selectionModel.bounds.transform, event);
                    }
                    dragStartCallback(interaction, (self.model as unknown as NodeModelType), self.model.transform, event);

                },
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    let selection = (selectionModel.list() as NodeModelType[]);
                    for(let m of selection){
                        dragMoveCallback(interaction, m, selectionModel.bounds.transform, event);
                    }
                    dragMoveCallback(interaction, (self.model as unknown as NodeModelType), this.model.transform, event);
                },
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    if(dragEndCallback){
                        let selection = (selectionModel.list() as NodeModelType[]);
                        for(let m of selection){
                            dragEndCallback(interaction, m, selectionModel.bounds.transform, event);
                        }
                        dragEndCallback(interaction, (self.model as unknown as NodeModelType), this.model.transform, event);
                    }
                },
                handle
            )
        )
    }

    initInteractions() {
        this.addSingleSelectionInteraction(
            this.view.anchorElement.threejs,
            (interaction: ADragInteraction, model:NodeModelType, event: AInteractionEvent) => {
                interaction.setInteractionState('singleSelectedModel', model);
                interaction.dragStartPosition = event.cursorPosition;
                let transform = model.transform.clone()
                interaction.setInteractionState('startTransform', transform);
            },
            (interaction: ADragInteraction, model:NodeModelType, event: AInteractionEvent) => {
                let cursorChange = event.cursorPosition.minus(interaction.dragStartPosition);
                let startTransform = interaction.getInteractionState('startTransform');
                model.transform = new NodeTransform2D(startTransform.getMatrix(), startTransform.position.plus(cursorChange));
            },
            (interaction: ADragInteraction, model:NodeModelType, event: AInteractionEvent) => {
            }
        )
    }

}
