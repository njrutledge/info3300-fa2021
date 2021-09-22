//##################//--node transform possible parent class--\\##################
// <editor-fold desc="node transform possibel parent class">
import {Matrix, TransformationInterface, Vector} from './index'


abstract class NodeTransform<VType extends Vector,MType extends Matrix> implements TransformationInterface{
    position!:VType;
    anchor!:VType;
    scale!:VType|number;
    rotation!:VType|number;

    abstract getMatrix():MType;
    abstract setWithMatrix(m:MType, position?:VType, useOldRotation?:boolean):void;


}
export {NodeTransform};

//</editor-fold>
//##################\\--node transform possible parent class--//##################
