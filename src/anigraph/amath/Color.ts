import * as THREE from "three";
import tinycolor from "tinycolor2";
import {Vector} from "./Vector";
import {ASerializable} from "../aserial";
import {Random} from "./Random";

interface TinyColor{
    toRgb():tinycolor.ColorFormats.RGBA;
}

@ASerializable("Color")
export class Color extends Vector{
    static N_DIMENSIONS:number=4;
    public constructor(r: number, g: number, b: number, a?:number);
    public constructor(rgb: Array<number>);
    public constructor(...args: Array<any>) { // common logic constructor
        super(...args);
    }

    toString(){
        return `Color(${this.r},${this.g},${this.b},${this.a})`;
    }

    get nDimensions(){
        return 4;
    };

    public asThreeJS(){
        return new THREE.Color(this.r, this.g, this.b);
    }


    /** Get set r */
    set r(value){this.elements[0] = value;}
    get r(){return this.elements[0];}

    /** Get set g */
    set g(value){this.elements[1] = value;}
    get g(){return this.elements[1];}

    /** Get set b */
    set b(value){this.elements[2] = value;}
    get b(){return this.elements[2];}

    /** Get set a */
    set a(value){
        this.elements[3] = value;
    }
    get a(){
        if(this.elements.length>3) {
            return this.elements[3];
        }else{
            return 1.0;
        }
    }

    _setToDefault(){
        this.elements = [0.5,0.5,0.5];
    }

    static RandomRGBA(){
        return new Color(Math.random(), Math.random(), Math.random(), Math.random());
    }

    static Random(){
        var r = new this(Random.floatArray(3));
        return r;
    }

    static FromTHREEJSColor(threecolor:THREE.Color){
        return new this(threecolor.r, threecolor.g, threecolor.b);
    }

    static FromTinyColor(tc:TinyColor){
        let rgba = tc.toRgb();
        if(rgba.a === 1){
            return new Color(rgba.r/255, rgba.g/255, rgba.b/255)
        }else{
            return new Color(rgba.r/255, rgba.g/255, rgba.b/255, rgba.a);
        }
    }

    sstring(){
        return `[${this.r},${this.g},${this.b}]`;
    }

    toHexString(){
        return this._tinycolor().toHexString();
    }
    toHex(){
        return this._tinycolor().toHex();
    }

    /**
     * Get new color with spun hue
     * @param degrees
     * @returns {Color}
     * @constructor
     */
    Spun(angle:number):Color{
        let spuntc = this._tinycolor().spin(angle*180/Math.PI);
        let rval = Color.FromTinyColor(spuntc);
        return rval;
    }

    static FromHSVA(h:number,s:number,v:number,a?:number){
        var rgbob = tinycolor(`hsv(${parseInt(String(h * 100))}%, ${parseInt(String(s * 100))}%, ${parseInt(String(v * 100))}%)`).toRgb();
        if(a!==undefined) {
            return new Color(rgbob.r, rgbob.g, rgbob.b, a);
        }else{
            return new Color(rgbob.r, rgbob.g, rgbob.b);
        }
    }

    static FromString(colorString:string){
        var tcolor = tinycolor(colorString).toRgb();
        return new Color(tcolor.r/256, tcolor.g/256, tcolor.b/256, tcolor.a);
    }

    static ThreeJS(hexstring:string):THREE.Color;
    static ThreeJS(hex:number):THREE.Color;
    static ThreeJS(r: number|string, g?: number, b?: number):THREE.Color{
        if(typeof r === 'string'){
            let c = Color.FromString(r);
            return new THREE.Color(c.r,c.b,c.g);
        }
        if(g===undefined || b===undefined){
            return new THREE.Color(r);
        }else{
            return new THREE.Color(r, g, b);
        }
    }

    _tinycolor(){
        return tinycolor({
            r:parseInt(String(this.r * 255)),
            g:parseInt(String(this.g * 255)),
            b:parseInt(String(this.b * 255)),
            a:this.a
        });
    }

    toRGBAString(){
        return this._tinycolor().toRgbString();
    }

}
