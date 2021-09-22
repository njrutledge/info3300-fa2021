import {ARenderElement} from "../ARenderElement";
import * as THREE from "three";
import {Color, VertexArray2D} from "../../amath";

export abstract class ABasic2DElement extends ARenderElement {
    abstract getColor():Color;
    abstract setColor(color: Color | THREE.Color): void;
    abstract setVerts(verts:VertexArray2D|number[]):void;
}

