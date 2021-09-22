/**
 * AModel is the base class for models in the AniGraph MVC framework.
 *
 * ## Listening to Model State
 *
 * ## Selections ABENOTE TODOTHING remove this part of documentation if we aren't releasing selections:
 * You can use AModel.Selection(model1, model2, model3, ...), or AModel.Selection([model1, model2, ....]) to create a model selection.
 * This is a subclass of Array<AModel> that has some special convenience methods. You should probably not try to further subclass the returned class (_AModelArray), though,
 * which is why the class itself is not exported. Why? Because TypeScript somewhat intentionally complicates subclassing basic types.
 *
 * @module
 */
import {AObjectState} from "../../aobject/AObject";
import {ASerializable} from "../../aserial/ASerializable";
import {AObjectNode} from "../../aobject/AObjectNode";

// @ASubscribesToEvents
// @ASignalsAEvents



// class _AModelArray<ModelType> extends Array<ModelType>{
//     private constructor(models?:Array<ModelType>){
//         if(models === undefined){
//             super();
//         }else {
//             super(...models);
//         }
//     }
//
//     static Create<ModelType>(){
//         return Object.create(_AModelArray.prototype);
//     }
//
// }
//
// export interface AModelSelection<ModelType> extends _AModelArray<ModelType>{
// }

export interface AModelInterface{
    uid:string;
    name:string;
    parent:AObjectNode|null;
    serializationLabel:string;
}

export interface AModelClassInterface<T extends AModelInterface> extends Function {
    new (...args:any[]): T
    SerializationLabel():string;
}

export interface ANodeModelClassInterface<NodeModelType> extends Function {
    new (...args:any[]): NodeModelType
    SerializationLabel():string;
}

@ASerializable("AModel")
export abstract class AModel extends AObjectNode implements AModelInterface{
    @AObjectState public name!:string;
    constructor(name?:string){
        super();
        this.name = name?name:this.serializationLabel;
    }



    // static Selection<ModelType>():_AModelArray<ModelType>;
    // static Selection<ModelType>(...models:ModelType[]){
    //     const rval = _AModelArray.Create<ModelType>();
    //     if(models === undefined || models.length===0){return rval;}
    //     if(models.length===1 && Array.isArray(models[0])){
    //         for(let model of models[0]){
    //             rval.push(model);
    //         }
    //         return rval
    //     }else{
    //         for (let model of models){
    //             rval.push(model);
    //         }
    //         return rval;
    //     }
    // }

}
