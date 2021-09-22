import {Matrix} from "./Matrix";
import {Vector} from "./Vector";
import {Vec3} from "./Vec3";
import {Vec2} from "./Vec2";
import {Vec4} from "./Vec4";
import assert from "assert";
import {Random} from "./Random";
import {ASerializable} from "../aserial/ASerializable";
import {Mat3} from "./Mat3";

import * as THREE from "three";

@ASerializable("Mat4")
export class Mat4 extends Matrix{

    public constructor();
    public constructor(m00:number, m01:number, m02:number, m03:number, m10:number, m11:number, m12:number, m13:number, m20:number, m21:number, m22:number, m23:number, m30:number, m31:number, m32:number, m33:number);
    public constructor(elements?: Array<number>);
    public constructor(...args: Array<any>) { // common logic constructor
        super(...args);
    }

    getElement(row:number,col:number):number{
        return this.elements[4*row+col];
    }
    setToIdentity(){
        this.elements = [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ];
    }

    set m00(value){this.elements[0]=value;}
    get m00(){return this.elements[0];}
    set m01(value){this.elements[1]=value;}
    get m01(){return this.elements[1];}
    set m02(value){this.elements[2]=value;}
    get m02(){return this.elements[2];}
    set m03(value){this.elements[3]=value;}
    get m03(){return this.elements[3];}


    set m10(value){this.elements[4]=value;}
    get m10(){return this.elements[4];}
    set m11(value){this.elements[5]=value;}
    get m11(){return this.elements[5];}
    set m12(value){this.elements[6]=value;}
    get m12(){return this.elements[6];}
    set m13(value){this.elements[7]=value;}
    get m13(){return this.elements[7];}

    set m20(value){this.elements[8]=value;}
    get m20(){return this.elements[8];}
    set m21(value){this.elements[9]=value;}
    get m21(){return this.elements[9];}
    set m22(value){this.elements[10]=value;}
    get m22(){return this.elements[10];}
    set m23(value){this.elements[11]=value;}
    get m23(){return this.elements[11];}

    set m30(value){this.elements[12]=value;}
    get m30(){return this.elements[12];}
    set m31(value){this.elements[13]=value;}
    get m31(){return this.elements[13];}
    set m32(value){this.elements[14]=value;}
    get m32(){return this.elements[14];}
    set m33(value){this.elements[15]=value;}
    get m33(){return this.elements[15];}




    set c0(value:Vec4) {
        this.m00 = value.x;
        this.m10 = value.y;
        this.m20 = value.z;
        this.m30 = value.h;
    }
    get c0(){return new Vec4(this.m00,this.m10,this.m20, this.m30);}

    set c1(value:Vec4) {
        this.m01 = value.x;
        this.m11 = value.y;
        this.m21 = value.z;
        this.m31 = value.h;
    }
    get c1(){return new Vec4(this.m01,this.m11,this.m21, this.m31);}

    set c2(value:Vec4) {
        this.m02 = value.x;
        this.m12 = value.y;
        this.m22 = value.z;
        this.m32 = value.h;
    }
    get c2(){return new Vec4(this.m02,this.m12,this.m22, this.m32);}

    set c3(value:Vec4) {
        this.m03 = value.x;
        this.m13 = value.y;
        this.m23 = value.z;
        this.m33 = value.h;
    }
    get c3(){return new Vec4(this.m03,this.m13,this.m23, this.m33);}


    /** Get set r0 */
    set r0(value:Vec4){
        this.m00 = value.x;
        this.m01 = value.y;
        this.m02 = value.z;
        this.m03 = value.h;
    }
    get r0(){return new Vec4(this.m00, this.m01, this.m02, this.m03);}

    set r1(value:Vec4){
        this.m10 = value.x;
        this.m11 = value.y;
        this.m12 = value.z;
        this.m13 = value.h;
    }
    get r1(){return new Vec4(this.m10, this.m11, this.m12, this.m13);}

    set r2(value:Vec4){
        this.m20 = value.x;
        this.m21 = value.y;
        this.m22 = value.z;
        this.m23 = value.h;
    }
    get r2(){return new Vec4(this.m20, this.m21, this.m22, this.m23);}
    set r3(value:Vec4){
        this.m30 = value.x;
        this.m31 = value.y;
        this.m32 = value.z;
        this.m33 = value.h;
    }
    get r3(){return new Vec4(this.m30, this.m31, this.m32, this.m33);}


    static FromColumns(c0:Vec4, c1:Vec4, c2:Vec4, c3:Vec4){
        var r = new this();
        r.c0=c0;
        r.c1=c1;
        r.c2=c2;
        r.c3=c3;
        return r;
    }

    static FromRows(r0:Vec4, r1:Vec4, r2:Vec4, r3:Vec4){
        var r = new this();
        r.r0=r0;
        r.r1=r1;
        r.r2=r2;
        r.r3=r3;
        return r;
    }

    //##################//--TransformationMatrices--\\##################
    //<editor-fold desc="TransformationMatrices">

    static Identity(){
        return new Mat4(
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1);
    }


    static FromMat3(m:Mat3) :Mat4{
        return new Mat4(
            m.m00, m.m01, 0, m.m02,
            m.m10, m.m11, 0, m.m12,
            0, 0, 1, 0,
            m.m20, m.m21, 0, m.m22
        );
    }



    public static Scale(factor:number):Mat4;
    public static Scale(factors:Array<number>):Mat4;
    public static Scale(factors:Vec4):Mat4;
    public static Scale(...args:any[]):Mat4 {
        function scalematfromarray(a:Array<number>) {
            let rmat = new Mat4();
            if (a.length > 0) {
                rmat.m00 = a[0];
                if (a.length > 1) {
                    rmat.m11 = a[1];
                    if (a.length > 2) {
                        rmat.m22=a[2];
                        if(a.length>3) {
                            console.warn("Don't specify scale matrices with 4 arguments. Scaling the homogeneous coordinate is bad form...");
                            assert(a.length === 4, "Scale arguments too long");
                            rmat.m33 = a[3];
                        }
                    }
                }
            }
            return rmat;
        }

        assert(args.length>0, "Cannot call Mat4.Scale() with no arguments");
        if(typeof args[0] === "number") {
            let rmat = new Mat4();
            rmat.m00=args[0];
            rmat.m11=args[0];
            rmat.m22=args[0];
            return rmat;
        } else if(Array.isArray(args[0])) {
            return scalematfromarray(args[0]);
        }else if(args[0] instanceof Vec3){
            return scalematfromarray(args[0].elements);
        }else {
            return scalematfromarray(args);
        }
    }

    public static Scale2D(factors:Array<number>):Mat4;
    public static Scale2D(factor:number|Vector):Mat4;
    public static Scale2D(factors:Vec2):Mat4;
    public static Scale2D(...args:Array<any>):Mat4 {
        function scalematfromarray(a:Array<number>) {
            let rmat = new Mat4();
            if (a.length > 0) {
                rmat.m00 = a[0];
                if (a.length > 1) {
                    assert(a.length === 2, "Scale2D arguments too long");
                    rmat.m11 = a[1];
                }
            }
            return rmat;
        }
        assert(args.length>0, "Cannot call Mat4.Scale2D() with no arguments");
        if(typeof args[0] === "number") {
            let rmat = new Mat4();
            rmat.m00=args[0];
            rmat.m11=args[0];
            return rmat;
        } else if(Array.isArray(args[0])) {
            return scalematfromarray(args[0]);
        }else if(args[0] instanceof Vector){
            return scalematfromarray(args[0].elements);
        }else {
            return scalematfromarray(args);
        }
    }


    public static Translation3D(t:Array<number>):Mat4;
    public static Translation3D(t:Vector):Mat4;
    public static Translation3D(x:number,y:number, z:number):Mat4
    public static Translation3D(...args:Array<any>):Mat4{
        function tmatfromarray(a:Array<number>) {
            let rmat = new Mat4();
            rmat.m03=a[0];
            rmat.m13=a[1];
            rmat.m23=a[2];
            return rmat;
        }
        assert(args.length>0, "Cannot call Mat4.Translation3D() with no arguments");
        if(Array.isArray(args[0])) {
            return tmatfromarray(args[0]);
        }else if(args[0] instanceof Vector){
            return tmatfromarray(args[0].elements);
        }else {
            assert(args.length===3, `wrong number of args for Mat4.Translation3D: ${args}`);
            return tmatfromarray(args);
        }
    }

    public static Translation2D(t:Array<number>):Mat4;
    public static Translation2D(t:Vec2):Mat4;
    public static Translation2D(x:number,y:number):Mat4
    public static Translation2D(...args:Array<any>):Mat4{
        function tmatfromarray(a:Array<number>) {
            let rmat = new Mat4();
            rmat.m03=a[0];
            rmat.m13=a[1];
            return rmat;
        }
        assert(args.length>0, "Cannot call Mat4.Translation2D() with no arguments");
        if(Array.isArray(args[0])) {
            return tmatfromarray(args[0]);
        }else if(args[0] instanceof Vector){
            return tmatfromarray(args[0].elements);
        }else {
            assert(args.length===2, "wrong number of args for Mat4.Translation2D")
            return tmatfromarray(args);
        }
    }

    public static Rotation2D(radians:number):Mat4{
        return Mat4.FromMat3(Mat3.Rotation(radians));
    }
    //</editor-fold>
    //##################\\--TransformationMatrices--//##################

    //##################//--fill matrices--\\##################
    //<editor-fold desc="fill matrices">
    static Random(){
        var r = new this(Random.floatArray(16));
        return r;
    }

    static Zeros(){
        let z = new Array(16); for (let i=0; i<16; ++i) z[i] = 0;
        var r = new this(z);
        return r;
    }

    static Ones(){
        let z = new Array(16); for (let i=0; i<16; ++i) z[i] = 1;
        var r = new this(z);
        return r;
    }
    //</editor-fold>
    //##################\\--fill matrices--//##################


    //##################//--Determinant and Inverse--\\##################
    //<editor-fold desc="Determinant and Inverse">


    getInverse(){
        let m = this.clone();
        return m.invert();
    }

    invert(){
        // based on the three.js implementation
        const te = this.elements,
            n11 = te[ 0 ], n21 = te[ 1 ], n31 = te[ 2 ], n41 = te[ 3 ],
            n12 = te[ 4 ], n22 = te[ 5 ], n32 = te[ 6 ], n42 = te[ 7 ],
            n13 = te[ 8 ], n23 = te[ 9 ], n33 = te[ 10 ], n43 = te[ 11 ],
            n14 = te[ 12 ], n24 = te[ 13 ], n34 = te[ 14 ], n44 = te[ 15 ],

            t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
            t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
            t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
            t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

        const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

        if ( det === 0 ){
            this.elements=[
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0 ];
            return this;
        }

        const detInv = 1 / det;

        te[ 0 ] = t11 * detInv;
        te[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
        te[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
        te[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;

        te[ 4 ] = t12 * detInv;
        te[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
        te[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
        te[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;

        te[ 8 ] = t13 * detInv;
        te[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
        te[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
        te[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;

        te[ 12 ] = t14 * detInv;
        te[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
        te[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
        te[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;
        return this;

    }

    /**
     * Returns the determinant of the matrix. Method based on gl-mat4's implementation.
     */
    determinant() {
            let b00 = this.m00 * this.m11 - this.m01 * this.m10;
            let b01 = this.m00 * this.m12 - this.m02 * this.m10;
            let b02 = this.m00 * this.m13 - this.m03 * this.m10;
            let b03 = this.m01 * this.m12 - this.m02 * this.m11;
            let b04 = this.m01 * this.m13 - this.m03 * this.m11;
            let b05 = this.m02 * this.m13 - this.m03 * this.m12;
            let b06 = this.m20 * this.m31 - this.m21 * this.m30;
            let b07 = this.m20 * this.m32 - this.m22 * this.m30;
            let b08 = this.m20 * this.m33 - this.m23 * this.m30;
            let b09 = this.m21 * this.m32 - this.m22 * this.m31;
            let b10 = this.m21 * this.m33 - this.m23 * this.m31;
            let b11 = this.m22 * this.m33 - this.m23 * this.m32;

        // Calculate the determinant
        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    }

    //</editor-fold>
    //##################\\--Determinant and Inverse--//##################



    protected _timesVector(v:Vec4):Vec4{
        return new Vec4(
            v.elements[0]*this.m00+v.elements[1]*this.m01+v.elements[2]*this.m02+v.elements[3]*this.m03,
            v.elements[0]*this.m10+v.elements[1]*this.m11+v.elements[2]*this.m12+v.elements[3]*this.m13,
            v.elements[0]*this.m20+v.elements[1]*this.m21+v.elements[2]*this.m22+v.elements[3]*this.m23,
            v.elements[0]*this.m30+v.elements[1]*this.m31+v.elements[2]*this.m32+v.elements[3]*this.m33
        );
    }
    protected _timesMatrix(m:Mat4):Mat4{
        let cfunc:any=(this.constructor as any);

        //##################//--Matrix Multiplication--\\##################
        //<editor-fold desc="Matrix Multiplication">
        //Optimise for matrices in which bottom row is (0, 0, 0, 1) in both matrices

        if(	this.elements[3]===0.0 && this.elements[7]==0.0 &&
            this.elements[11]==0.0 && this.elements[15]==1.0 &&
            m.elements[3]==0.0 && m.elements[7]==0.0 &&

        m.elements[11]==0.0 && m.elements[15]==1.0)

        {

            return new Mat4(	this.elements[0]*m.elements[0]+this.elements[4]*m.elements[1]+this.elements[8]*m.elements[2],

                this.elements[1]*m.elements[0]+this.elements[5]*m.elements[1]+this.elements[9]*m.elements[2],

                this.elements[2]*m.elements[0]+this.elements[6]*m.elements[1]+this.elements[10]*m.elements[2],

                0.0,

        this.elements[0]*m.elements[4]+this.elements[4]*m.elements[5]+this.elements[8]*m.elements[6],

        this.elements[1]*m.elements[4]+this.elements[5]*m.elements[5]+this.elements[9]*m.elements[6],

        this.elements[2]*m.elements[4]+this.elements[6]*m.elements[5]+this.elements[10]*m.elements[6],

            0.0,

        this.elements[0]*m.elements[8]+this.elements[4]*m.elements[9]+this.elements[8]*m.elements[10],

        this.elements[1]*m.elements[8]+this.elements[5]*m.elements[9]+this.elements[9]*m.elements[10],

        this.elements[2]*m.elements[8]+this.elements[6]*m.elements[9]+this.elements[10]*m.elements[10],

            0.0,

        this.elements[0]*m.elements[12]+this.elements[4]*m.elements[13]+this.elements[8]*m.elements[14]+this.elements[12],

        this.elements[1]*m.elements[12]+this.elements[5]*m.elements[13]+this.elements[9]*m.elements[14]+this.elements[13],

        this.elements[2]*m.elements[12]+this.elements[6]*m.elements[13]+this.elements[10]*m.elements[14]+this.elements[14],

            1.0);

        }



        //Optimise for when bottom row of 1st matrix is (0, 0, 0, 1)

        if(	this.elements[3]==0.0 && this.elements[7]==0.0 && this.elements[11]==0.0 && this.elements[15]==1.0)

        {

            return new Mat4(	this.elements[0]*m.elements[0]+this.elements[4]*m.elements[1]+this.elements[8]*m.elements[2]+this.elements[12]*m.elements[3],

                this.elements[1]*m.elements[0]+this.elements[5]*m.elements[1]+this.elements[9]*m.elements[2]+this.elements[13]*m.elements[3],

                this.elements[2]*m.elements[0]+this.elements[6]*m.elements[1]+this.elements[10]*m.elements[2]+this.elements[14]*m.elements[3],

                m.elements[3],

                this.elements[0]*m.elements[4]+this.elements[4]*m.elements[5]+this.elements[8]*m.elements[6]+this.elements[12]*m.elements[7],

                this.elements[1]*m.elements[4]+this.elements[5]*m.elements[5]+this.elements[9]*m.elements[6]+this.elements[13]*m.elements[7],

                this.elements[2]*m.elements[4]+this.elements[6]*m.elements[5]+this.elements[10]*m.elements[6]+this.elements[14]*m.elements[7],

                m.elements[7],

                this.elements[0]*m.elements[8]+this.elements[4]*m.elements[9]+this.elements[8]*m.elements[10]+this.elements[12]*m.elements[11],

                this.elements[1]*m.elements[8]+this.elements[5]*m.elements[9]+this.elements[9]*m.elements[10]+this.elements[13]*m.elements[11],

                this.elements[2]*m.elements[8]+this.elements[6]*m.elements[9]+this.elements[10]*m.elements[10]+this.elements[14]*m.elements[11],

                m.elements[11],

                this.elements[0]*m.elements[12]+this.elements[4]*m.elements[13]+this.elements[8]*m.elements[14]+this.elements[12]*m.elements[15],

                this.elements[1]*m.elements[12]+this.elements[5]*m.elements[13]+this.elements[9]*m.elements[14]+this.elements[13]*m.elements[15],

                this.elements[2]*m.elements[12]+this.elements[6]*m.elements[13]+this.elements[10]*m.elements[14]+this.elements[14]*m.elements[15],

                m.elements[15]);

        }



        //Optimise for when bottom row of 2nd matrix is (0, 0, 0, 1)

        if(	m.elements[3]==0.0 && m.elements[7]==0.0 &&

        m.elements[11]==0.0 && m.elements[15]==1.0)

        {

            return new Mat4(	this.elements[0]*m.elements[0]+this.elements[4]*m.elements[1]+this.elements[8]*m.elements[2],

                this.elements[1]*m.elements[0]+this.elements[5]*m.elements[1]+this.elements[9]*m.elements[2],

                this.elements[2]*m.elements[0]+this.elements[6]*m.elements[1]+this.elements[10]*m.elements[2],

                this.elements[3]*m.elements[0]+this.elements[7]*m.elements[1]+this.elements[11]*m.elements[2],

                this.elements[0]*m.elements[4]+this.elements[4]*m.elements[5]+this.elements[8]*m.elements[6],

                this.elements[1]*m.elements[4]+this.elements[5]*m.elements[5]+this.elements[9]*m.elements[6],

                this.elements[2]*m.elements[4]+this.elements[6]*m.elements[5]+this.elements[10]*m.elements[6],

                this.elements[3]*m.elements[4]+this.elements[7]*m.elements[5]+this.elements[11]*m.elements[6],

                this.elements[0]*m.elements[8]+this.elements[4]*m.elements[9]+this.elements[8]*m.elements[10],

                this.elements[1]*m.elements[8]+this.elements[5]*m.elements[9]+this.elements[9]*m.elements[10],

                this.elements[2]*m.elements[8]+this.elements[6]*m.elements[9]+this.elements[10]*m.elements[10],

                this.elements[3]*m.elements[8]+this.elements[7]*m.elements[9]+this.elements[11]*m.elements[10],

                this.elements[0]*m.elements[12]+this.elements[4]*m.elements[13]+this.elements[8]*m.elements[14]+this.elements[12],

                this.elements[1]*m.elements[12]+this.elements[5]*m.elements[13]+this.elements[9]*m.elements[14]+this.elements[13],

                this.elements[2]*m.elements[12]+this.elements[6]*m.elements[13]+this.elements[10]*m.elements[14]+this.elements[14],

                this.elements[3]*m.elements[12]+this.elements[7]*m.elements[13]+this.elements[11]*m.elements[14]+this.elements[15]);

        }



        return cfunc(	this.elements[0]*m.elements[0]+this.elements[4]*m.elements[1]+this.elements[8]*m.elements[2]+this.elements[12]*m.elements[3],

            this.elements[1]*m.elements[0]+this.elements[5]*m.elements[1]+this.elements[9]*m.elements[2]+this.elements[13]*m.elements[3],

            this.elements[2]*m.elements[0]+this.elements[6]*m.elements[1]+this.elements[10]*m.elements[2]+this.elements[14]*m.elements[3],

            this.elements[3]*m.elements[0]+this.elements[7]*m.elements[1]+this.elements[11]*m.elements[2]+this.elements[15]*m.elements[3],

            this.elements[0]*m.elements[4]+this.elements[4]*m.elements[5]+this.elements[8]*m.elements[6]+this.elements[12]*m.elements[7],

            this.elements[1]*m.elements[4]+this.elements[5]*m.elements[5]+this.elements[9]*m.elements[6]+this.elements[13]*m.elements[7],

            this.elements[2]*m.elements[4]+this.elements[6]*m.elements[5]+this.elements[10]*m.elements[6]+this.elements[14]*m.elements[7],

            this.elements[3]*m.elements[4]+this.elements[7]*m.elements[5]+this.elements[11]*m.elements[6]+this.elements[15]*m.elements[7],

            this.elements[0]*m.elements[8]+this.elements[4]*m.elements[9]+this.elements[8]*m.elements[10]+this.elements[12]*m.elements[11],

            this.elements[1]*m.elements[8]+this.elements[5]*m.elements[9]+this.elements[9]*m.elements[10]+this.elements[13]*m.elements[11],

            this.elements[2]*m.elements[8]+this.elements[6]*m.elements[9]+this.elements[10]*m.elements[10]+this.elements[14]*m.elements[11],

            this.elements[3]*m.elements[8]+this.elements[7]*m.elements[9]+this.elements[11]*m.elements[10]+this.elements[15]*m.elements[11],

            this.elements[0]*m.elements[12]+this.elements[4]*m.elements[13]+this.elements[8]*m.elements[14]+this.elements[12]*m.elements[15],

            this.elements[1]*m.elements[12]+this.elements[5]*m.elements[13]+this.elements[9]*m.elements[14]+this.elements[13]*m.elements[15],

            this.elements[2]*m.elements[12]+this.elements[6]*m.elements[13]+this.elements[10]*m.elements[14]+this.elements[14]*m.elements[15],

            this.elements[3]*m.elements[12]+this.elements[7]*m.elements[13]+this.elements[11]*m.elements[14]+this.elements[15]*m.elements[15]);

    }
        //</editor-fold>
        //##################\\--Matrix Multiplication--//##################

        // return new cfunc([
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        //     this.m00 * m.m00 + this.m01 * m.m10 + this.m02 * m.m20,+this.m03*m.m30,
        // ]);

    toJSON(){
        var rval:{[name:string]:any} = {};
        for (let k in this){
            // @ts-ignore
            rval[k]=this[k];
        }
        return rval;
    }


    static FromTHREE(m:THREE.Matrix4){
        return new Mat4(m.elements)
    }
    public toTHREE(){
        let m = new THREE.Matrix4();
        m.set(this.elements[0], this.elements[1], this.elements[2], this.elements[3],
            this.elements[4], this.elements[5], this.elements[6], this.elements[7],
            this.elements[8], this.elements[9], this.elements[10], this.elements[11],
            this.elements[12], this.elements[13], this.elements[14], this.elements[15]);
        return m;
    }

    assignTo(threejsMat:THREE.Matrix4){
        threejsMat.set(this.elements[0], this.elements[1], this.elements[2], this.elements[3],
            this.elements[4], this.elements[5], this.elements[6], this.elements[7],
            this.elements[8], this.elements[9], this.elements[10], this.elements[11],
            this.elements[12], this.elements[13], this.elements[14], this.elements[15]);
    }

    asPrettyString(){
        return `Mat4 in Row Major Form:\n
        ${this.elements[0]},  ${this.elements[1]},  ${this.elements[2]},  ${this.elements[3]}\n 
        ${this.elements[4]},  ${this.elements[5]},  ${this.elements[6]},  ${this.elements[7]}\n 
        ${this.elements[8]},  ${this.elements[9]},  ${this.elements[10]},  ${this.elements[11]}\n 
        ${this.elements[12]},  ${this.elements[13]},  ${this.elements[14]},  ${this.elements[15]}`
    }

}
