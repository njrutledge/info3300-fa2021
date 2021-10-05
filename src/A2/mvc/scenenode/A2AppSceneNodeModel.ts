import {Base2DAppModel} from "src/anigraph/apps/Base2DApp";
import {AObjectState, ASerializable, Color} from "../../../anigraph";

@ASerializable("A2AppSceneNodeModel")
export class A2AppSceneNodeModel extends Base2DAppModel{
    @AObjectState strokeWidth!:number;
    @AObjectState strokeColor!:Color;
    @AObjectState fillColorPhaseShift!:number;
    @AObjectState nSubdivisions!:number;

    constructor(){
        super();
        this.strokeWidth = 0.0;
        this.strokeColor = Color.FromString("#000");
        this.fillColorPhaseShift=Math.PI;
        this.nSubdivisions = 0;
    }

    /**
     * You can add/customize what appears in the GUI when you select a model here.
     * @returns {{strokeWidth: {min: number, onChange: (v: number) => void, max: number, step: number, value: number}, ModelName: {onChange: (v: string) => void, value: string}, nSubdivisions: {min: number, onChange: (v: number) => void, max: number, step: number, value: number}, strokeColor: {onChange: (v: string) => void, value: string}, fillPhase: {min: number, onChange: (v: number) => void, max: number, value: number}}}
     */
    getModelGUIControlSpec(){
        const self = this;
        const customSpec = {
            ModelName: {
                value:self.name,
                onChange:(v:string)=>{
                    self.name = v;
                }
            },
            strokeWidth: {
                value: self.strokeWidth,
                min: 0.0,
                max: 0.02,
                step: 0.001,
                onChange: (v: number) => {
                    self.strokeWidth = v;
                }
            },
            strokeColor: {
                value: self.strokeColor.toHexString(),
                onChange: (v: string) => {
                    self.strokeColor = Color.FromString(v);
                },
            },
            fillPhase: {
                value: self.fillColorPhaseShift,
                min: -Math.PI,
                max: Math.PI,
                onChange: (v: number) => {
                    self.fillColorPhaseShift = v;
                }
            },
            nSubdivisions:{
                value:self.nSubdivisions,
                min:0,
                max:10,
                step:1,
                onChange:(v:number)=>{
                    self.nSubdivisions = v;
                }
            }
        }
        return {...customSpec, ...super.getModelGUIControlSpec()}
    }

}
