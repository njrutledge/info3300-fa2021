import {Mat3, NodeTransform, Vec2} from 'src/anigraph/amath'
import {ASerializable} from "src/anigraph/aserial";

@ASerializable("NodeTransform2D")
export class NodeTransform2D implements NodeTransform<Vec2, Mat3>{
    public position!: Vec2;
    public anchor!: Vec2;
    public _scale!: Vec2;
    public rotation!: number;

    get scale(): Vec2 {
        return this._scale;
    }
    set scale(value: Vec2 | number) {
        if (value instanceof Vec2) {
            this._scale = value;
        } else {
            this._scale = new Vec2(value, value);
        }
    }

    constructor(position?: Vec2, anchor?: Vec2, scale?: Vec2, rotation?: number);
    constructor(matrix: Mat3, position?: Vec2);
    constructor(...args: any[]) {
        if (args[0] instanceof Mat3) {
            let pos = args.length > 1 ? args[1] : undefined;
            this.setWithMatrix(args[0], pos);
            if (!this.position) {
                this.position = new Vec2(0, 0);
            }
        } else {
            this.position = (args.length > 0) ? args[0] : new Vec2(0, 0);
            this.anchor = (args.length > 1) ? args[1] : new Vec2(0, 0);
            this.scale = (args.length > 2) ? args[2] : new Vec2(1, 1);
            this.rotation = (args.length > 3) ? args[3] : 0;
        }
    }

    clone() {
        return new NodeTransform2D(this.position, this.anchor, this.scale, this.rotation);
    }

    /**
     * Returns the transformation matrix for this set of transform properties.
     *
     * @returns the transformation matrix
     */
    getMatrix() {
        const position = Mat3.Translation2D(this.position);
        const rotation = Mat3.Rotation(this.rotation);
        const scale = Mat3.Scale2D(this.scale);
        const anchor = Mat3.Translation2D(this.anchor.times(-1));
        return position.times(rotation).times(scale).times(anchor);
    }


    /**
     * Sets the transform properties based on the given affine transformation
     * matrix and optional position.
     *
     * This function should set the transform based on an input matrix and
     * (optionally) a starting position. Calling T.getMatrix() on the resulting
     * transform should produce the input matrix `m`. Position should
     * be the point where changes to rotation or scale will rotate and scale around.
     * Meanings of position, rotation, scale, and anchor match those used in Adobe
     * standards (e.g., After Effects). The corresponding matrix is calculated
     * as shown in getMatrix() above: (P)*(R)*(S)*(-A). Position is specified as
     * a constraint because the two translations in the above equation create a
     * redundancy.
     *
     * We recommend familiarizing yourself with the available methods in
     * `src/anigraph/amath/Mat3.ts`.
     *
     * Also familiarize yourself with the available functions in
     * `src/anigraph/amath/Precision.ts`. These are useful when dealing with
     * floating point inaccuracies and other small numbers.
     *
     * Note: We will always provide an input position in the tests we use for grading,
     * but the recommended behavior when no position is provided is to keep whatever
     * the previous position value was unchanged.
     *
     * @param m the affine transformation matrix
     * @param position the starting positon
     */
    setWithMatrix(m: Mat3, position?: Vec2) {
        // TODO: Replace the following lines with your code
        if(position){
            this.position=position;
        }
        this.anchor = new Vec2(0, 0);
        this.scale = new Vec2(1, 1);
        this.rotation = 0;


    }
}
