import {A2AppExampleCustomNodeView} from "../../A2AppExampleCustomNodeView";
import {
    A2DLinesElement,
    APolygonElement, ARenderGroup, ASerializable, Color, GetAppState, Mat3, Mat4,
    V2,
    VertexArray2D
} from "../../../../anigraph";
import {EyeController} from "./EyeController";
import {EyeModel} from "./EyeModel";




@ASerializable("EyeView")
export class EyeView extends A2AppExampleCustomNodeView{
    public controller!:EyeController;

    // ---Elements---
    // a group for the eye pieces
    public eyeGroup!:ARenderGroup;

    // parts
    public outline!:A2DLinesElement;
    public iris!:APolygonElement;
    public pupil!:APolygonElement;
    // ------------


    public height=70;
    public width = 100
    public whitespace = 0.2;

    get model(){
        return this.controller.model as EyeModel;
    }

    initGraphics() {
        super.initGraphics();

        // make default geometry invisible
        // This geometry is created in src/A2/viewcomponentA2AppExampleCustomNodeView.ts
        // If you want a (mostly) blank canvas, you should use these two lines,
        // or, if you're feeling adventurous, subclass A2DSceneNodeView<A2AppSceneNodeModel> directly.
        this.fillElement.visible=false;
        this.strokeElement.visible=false;

        // this.outline will be the oval outline of the eye
        this.outline = new A2DLinesElement();
        // this.iris will be the colored circle
        this.iris = new APolygonElement();
        // this.pupil will be the dark pupil
        this.pupil = new APolygonElement();

        // let's define a subroutine that returns a vertex array with the vertices of a circle
        // we will feed the size of the circle and the number of vertices to sample as arguments
        function CircleVArray(size:number, nverts:number=25){
            let verts=new VertexArray2D();
            for(let v=0;v<nverts;v++){
                let phase = v*(2*Math.PI)/nverts;
                verts.addVertex(V2(Math.cos(phase)*size, Math.sin(phase)*size));
            }
            return verts;
        }



        // With CircleVArray in hand, let's initialize some geometry for our eye.
        // See the code in APolygonElement.ts and A2DLinesElement.ts in src/anigraph/arender/2d/ for details.

        // First, we will initialize the outline, which is an A2DLinesElement:
        this.outline.init(CircleVArray(this.width, 100), Color.FromString("#000"));
        this.outline.setLineWidth(0.01);

        // Now let's initialize our iris and pupil
        this.iris.init(CircleVArray(this.height*(1-this.whitespace), 100), this.model.color)
        this.pupil.init(CircleVArray(this.height*(1-this.whitespace)), Color.FromString("#000"))

        this.outline.setTransform(Mat3.Scale2D([1,this.height/this.width]));
        this.pupil.setTransform(Mat3.Scale2D([this.model.dilation,this.model.dilation]));

        // Now that we've created the objects, we need them all to be accessible from the root (this.threejs)
        // We add them heirarchically so the pupil can inherit the transform from the iris
        // Be mindful that this is using threejs directly, but there is also the addElement method.
        // See the calls to this.addElement in src/A2/viewcomponentA2AppExampleCustomNodeView.ts for an example.
        this.eyeGroup = new ARenderGroup
        this.eyeGroup.add(this.iris);
        this.iris.add(this.pupil);
        this.eyeGroup.add(this.outline);
        this.addElement(this.eyeGroup);

        const self=this;

        // let's make our eye stay still by transforming by the inverse of the node's transform
        this.subscribe(this.model.addStateKeyListener('transform', ()=>{
            let minv = self.model.transform.getMatrix().getInverse();
            if(minv){
                self.eyeGroup.setTransform(minv);
            }
        }));

        this.subscribe(this.model.addStateKeyListener('targetPoint', ()=>{
            self.targetResponse();
        }));
        this.subscribe(this.model.addStateKeyListener('dilation', ()=>{
            self.pupil.setTransform(Mat3.Scale2D([self.model.dilation,self.model.dilation]));
            // Mat4.Scale2D([self.model.dilation,self.model.dilation]).assignTo(self.pupil.threejs.matrix);
        }));
        this.subscribe(this.model.addStateKeyListener('color',()=>{
            self.iris.setColor(self.model.color);
        }));

        this.subscribe(this.model.addEventListener("triggerBlink", ()=>{
            self.blink();
        }))
    }

    /**
     * We're going to make the eye blink. To do this, we will create a time subscription that is programmed to remove
     * itself when the blink is finished.
     * @param {number} duration
     */
    blink(){
        const self = this;

        //first, let's get the time when the blink starts
        const startTime = GetAppState().time;
        self.subscribe(GetAppState().addClockListener((t:number)=>{
            //calculate how much time has passed since the start of the blink.
            let timePassed = (GetAppState().time-startTime)*0.001;

            // Get the inverse of the object matrix to keep the eye fixed.
            // I'm mostly doing this to avoid anything that depends on stuff you have to implement in the core portion
            // of the assignment. An eye that can move and look around would probably be cooler. *shrug*
            let minv = self.model.transform.getMatrix().getInverse();
            // return if the current transform isn't invertible. This shouldn't happen, but if we don't check then
            // Typescript will complain
            if(minv===null){return;}

            // Check to see if the duration of the blink has passed
            if(timePassed>self.model.blinkDuration){
                // blink is over, let's unsubscribe, reset the transform, and return.
                self.unsubscribe("blinking");
                self.eyeGroup.setTransform(minv);
                return;
            }
            // mid-blink... let's scale the eye down to 0 in the y dimension and then back again.
            let scaleY = Mat4.Scale2D([1.0, Math.abs(-0.5+(timePassed/self.model.blinkDuration))*2]);
            self.eyeGroup.setMatrix(scaleY);
        }), "blinking")
    }

    targetResponse() {
        Mat4.Translation2D(this.model.targetPoint.times(1/this.model.targetRange)).assignTo(this.iris.threejs.matrix);
    }
}


