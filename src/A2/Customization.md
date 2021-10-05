# How to create custom Models, Views, and Controllers

AniGraph is designed to make it easy for you to create and combine different custom models, views, and controllers in the same app. This document will walk you through how to do this.


The simplest way to customize your app is to make a copy of one the example MVC's ([fancy](./viewcomponent/custom/fancy/),[eyes](./viewcomponent/custom/eyes/), or [editverts](./viewcomponent/custom/editverts/)), find and replace the name with your own custom name, and build from there. Then you can add new model view and controller specs to the app by adjusting the following lines in [A2AppComponent.tsx](./A2AppComponent.tsx):
```typescript
const A2AppModelSceneComponent = appState.AppComponent(
    A2AppSceneController,
    A2AppSubComponents.ModelScene,
    [
        NewAMVCNodeClassSpec(A2AppSceneNodeModel, A2AppSceneNodeView, A2AppSceneNodeController),
        NewAMVCNodeClassSpec(FancyModel, A2AppSceneNodeView, A2AppSceneNodeController),
        //...
        // Spec with your Model, View, and Controller classes goes here. When a model of the specified model class is
        // added to the left scene, the specified view and controller will be created and added to the left component of
        // the app 
    ]
);

const A2AppViewSceneComponent = appState.AppComponent(
    A2AppSceneController,
    A2AppSubComponents.ViewScene,
    [NewAMVCNodeClassSpec(A2AppSceneNodeModel, A2AppExampleCustomNodeView, A2AppSceneNodeController),
        NewAMVCNodeClassSpec(FancyModel, FancyView, FancyController),
        //...
        // Spec with your Model, View, and Controller classes goes here. When a model of the specified model class is
        // added to the left scene, the specified view and controller will be created and added to the right component of
        // the app 
    ]
);
```

Once you add a new spec as shown with `NewAMVCNodeClassSpec(FancyModel, FancyView, FancyController)` above, then the corresponding model will show up as an option in the GUI dropdown menu, as shown below:

![](../../images/customModelSelection.jpg)

When a new object is created (either with the `addDefaultScene` button or by clicking to lay new vertices with the `creatingNew` check box checked) its model will be created with whatever class is currently specified in the `NewModelType` dropdown. Each SceneView will then use the view and controller classes designated in its corresponding spec to represent that model.

## Customizing Models, Views, and Controllers
The easiest way to get a sense for how to customize different aspects of a scene node is probably to look at the examples provided in [viewcomponent/custom](./viewcomponent/custom).

### Custom Model Classes
A few things to remember when creating your custom model class
- Always remember to decorate new model classes with the `@ASerializable("...")` decorator. The argument to this decorator should be the name of the model class you are creating. This may seem tedious, but it saves you having to write *a lot* of boiler code... 
- You may want to subclass off of [A2AppSceneNodeModel](./mvc/scenenode/A2AppSceneNodeModel.ts) to make working with typescript easier. If you simply follow the pattern you see in the provided examples then things should work.

#### Adding new attributes
If you want to add a new model attribute, you should declare it in your model subclass. Remember that decorating the attribute with `@AObjectState` you will make it available to state listeners. If you want to control attributes in the GUI, you should make them `@AObjectSatate` and add them to the `getModelGUIControlSpec` function, which uses [leva](https://github.com/pmndrs/leva) (you can learn more about GUI options in the [leva](https://github.com/pmndrs/leva) docs). Note that you cannot assign default values to `@AObjectState` in its declaration---you need to set any initialization you want done in the constructor. or use the `!:` syntax to leave an initial value undefined.

Below is the definition of the example [FancyModel](./viewcomponent/custom/fancy/FancyModel.ts) class:
```typescript
@ASerializable("FancyModel")
export class FancyModel extends A2AppSceneNodeModel{
    // we declare the colorSpeed attribute
    @AObjectState colorSpeed:number;
    
    // we initialize colorspeed in our constructor after calling super()
    constructor() {
        super();
        this.colorSpeed=1;
    }

    // We define the gui control specs to let us manipulate colorSpeed with a slider
    getModelGUIControlSpec(){
        const self = this;
        const customSpec = {
            colorSpeed: {
                value: self.colorSpeed,
                min: 0,
                max: 10,
                onChange: (v: number) => {
                    self.colorSpeed = v;
                }
            }
        }
        // return a combination of this control spec and the super class's control spec.
        return {...customSpec, ...super.getModelGUIControlSpec()}
    }

}

```

## Custom View Classes
Custom view classes have access to their corresponding model (via a controller) and are tasked with rendering said model in whatever scene they belong to. Each of the provided examples demonstrates different types of customization you can explore.
- [FancyView.ts](./viewcomponent/custom/fancy/FancyView.ts): shows how to subscribe to an application timer/clock, which lets you register a callback function that should be executed at frequent regular intervals (every time the clock updates). You can use such subscriptions to create procedural animations. Note that you could alternatively subscribe to the clock from a model, change some @AObjectState inside whatever callback you register with the clock, and then have the view subscribe to the model's state so that it will update when the model does. This may seem roundabout, but it allows for multiple different views to respond to the same changes in a model, which is sometimes very useful.
- [EyeView.ts)](./viewcomponent/custom/eyes/EyeView.ts): demonstrates how to add new polygons and lines to a view. The easiest way to do this is using AniGraph's [ARenderObject](../anigraph/arender/ARenderObject.ts)'s (e.g., [APolygonElement](../anigraph/arender/2d/APolygonElement.ts) and [A2DLinesElement](../anigraph/arender/2d/A2DLinesElement.ts)---you can find more in [anigraph/arender/](../anigraph/arender/)). Each of these subclasses wraps a handful of related [Three.js](https://threejs.org/) calls and objects. You are welcome to work with ThreeJS directly, but may find this more tedious, especially when working in 2D. Of particular note, [ARenderElement](../anigraph/arender/ARenderElement.ts) subclasses manage geometry and material parameters (e.g., color), which makes drawing stuff much simpler. The Eye view also shows how to trigger an animation that has a finite duration (the blink).
- [A2AppExampleCustomNodeView](./viewcomponent/A2AppExampleCustomNodeView.ts): shows how use procedural modifications of the geometry defined in `model.verts`. Specifically, it uses the subdividion code you wrote in the core part of the assignment to render a smoothed version of the model's original geometry.
- [EditVertsView](./viewcomponent/custom/editverts/EditVertsView.ts): Shows how to add handles to all of the verts for a model. The corresponding controller places interactions on these vertices that will let you edit the geometry of the model.

## Custom Controller Classes:
- [EyeController](./viewcomponent/custom/eyes/EyeController.ts): You will find two types of customization in the `EyeController` class. The first is a drag interaction that triggers when a user clicks and drags on the pupil. This changes the `targetPoint` AObjectState of the corresponding `EyeModel`, which will cause the `EyeView` to update its iris and pupil elements to point at the cursor. The second interaction is a click interaction placed on the iris. If you click the colored part of the iris then the eye will blink. The blink animation works by creating a clock subscription that unsubscribes itself after a fixed duration (once the blink is complete). The blink duration is an AObjectState attribute for the model, that is also added to the GUI so that it can be adjusted with a slider to create fast regular blinks or slow, meaningful blinks.
- [EditVertsController](./viewcomponent/custom/editverts/EditVertsController.ts): This controller has a few customizations. The static function `CreateShapeInteraction` defines the interaction used when you toggle `creatingNew` in the GUI. Adding this function to your custom controller will cause it to be used when you have the corresponding model selected in the `NewModelType` dropdown. The interaction defined in `EditVertsController` is the same as the default one, but provided for your reference in case you want to write your own custom variant. You will notice in the constructor for `EditVertsController` that a new interaction mode is defined. You can think of interaction modes as bundles of interactions that are activated or deactivated together under a common name. In this case, we are creating an interaction mode for editing vertices, which will be activated or deactivated with the `inEditMode` switch we added to our model. When the corresponding model is in edit mode you will see handles for each of the vertices, and can drag these handles to move their corresponding vertex positions. The function `initHandleInteractions` creates the interaction used to edit individual vertices.
- [FancyController](./viewcomponent/custom/fancy/FancyController.ts): The `FancyController` is not actually fancy at all. It behaves just as its parent. No innovation, no striving for greatness. That's ok, though. Not every controller needs to be fancy.

### SelectionControls and `freezeSelection`:
We've added `selectionControls` to the GUI. Right now, the only option in this section (collapsed by default) is `freezeSelection`:

![](../../images/newcustomcontrols.png)

If you check freezeSelection, then regular selection of objects will be frozen. This means that if no objects are selected, then clicking on them will not select them. It also means that if an object is selected, then clicking the background will not deselect it. You can use this option if you don't want default selection behavior to get in the way of whatever custom controls you have in mind. 



