import React from 'react';
import {MockHandleInteraction} from './HelperCode/TestA2AppHelpers';
import {V2, VertexArray2D,} from "../../anigraph";
import {
    MatrixEqual,
    VecEqual,
    VertexArray2DCircToBeCloseTo,
    VertexArray2DToBeCloseTo
} from "../../anigraph/amath/test/AMathTestHelpers";
import {getSubdividedVerts} from "../../A2/viewcomponent/BasicSubdivision";


expect.extend(VertexArray2DToBeCloseTo);
expect.extend(MatrixEqual);
expect.extend(VecEqual);
expect.extend(VertexArray2DCircToBeCloseTo);

describe('App', ()=>{
    test('Triple Size with Corner Anchor:', () => {
        let m = new MockHandleInteraction();
        m.callDragStart(V2(1,1));
        m.callDragMove(V2(3,3));
        expect(m.transform.position).toEqual(V2(0,0));
        expect(m.transform.scale).toEqual(V2(3,3));
    });
    test('Nonuniform resizing with Corner Anchors:', () => {
        let m = new MockHandleInteraction();
        m.callDragStart(V2(1,1));
        m.callDragMove(V2(3,2));
        expect(m.transform.position).toEqual(V2(0,0));
        expect(m.transform.scale).toEqual(V2(3,2));
    });
    test('Holding shift to force uniform scaling with Corner Anchors:', () => {
        let m = new MockHandleInteraction();
        m.callDragStart(V2(1,1));
        m.callDragMove(V2(3,2), true);
        expect(m.transform.position).toEqual(V2(0,0));
        expect(m.transform.scale).toEqual(V2(3,3));
    });
    test('Holding alt to Rotate by -pi/2:', () => {
        let m = new MockHandleInteraction();
        m.callDragStart(V2(0,1));
        m.callDragMove(V2(1,0), false, true);
        expect(m.transform.position).toEqual(V2(0,0));
        expect(m.transform.scale).toEqual(V2(1,1));
        expect(m.transform.rotation).toBeCloseTo(-Math.PI/2);
    });
});


describe('Subdivision Tests', ()=>{
    test('Basic subdivision example:', () => {
        let before = new VertexArray2D([25,-25,0,-25,-25,0,-25,25,0,25,25,0]);
        let after = new VertexArray2D([12.5,-12.5,0,0,-25,0,-12.5,-12.5,0,-25,0,0,-12.5,12.5,0,0,25,0,12.5,12.5,0,25,0,0]);
        let after1 = new VertexArray2D([0,-25,0,-12.5,-12.5,0,-25,0,0,-12.5,12.5,0,0,25,0,12.5,12.5,0,25,0,0,12.5,-12.5,0]);
        let after2 = new VertexArray2D([25,0,0,12.5,-12.5,0,0,-25,0,-12.5,-12.5,0,-25,0,0,-12.5,12.5,0,0,25,0,12.5,12.5,0]);
        let afterwrong = new VertexArray2D([12.5,-12.5,0,0,-25,0,-12.5,-12.5,0,-25,0,0,-12.5,12.5,0,0,25,0,12.5,12.5,0,26,0,0]);
        expect(getSubdividedVerts(before)).VertexArray2DCircToBeCloseTo(after, "Reference");
        expect(getSubdividedVerts(before)).VertexArray2DCircToBeCloseTo(after1, "CircShiftA");
        expect(getSubdividedVerts(before)).VertexArray2DCircToBeCloseTo(after2, "CircShiftB");
        expect(getSubdividedVerts(before)).not.VertexArray2DCircToBeCloseTo(afterwrong, "Incorrect");
    });
});
