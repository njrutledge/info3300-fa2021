import {Vec2} from "../../anigraph";
import {NodeTransform2D} from "../../A2/math/NodeTransform2D";
import {testNodeTransform2D} from "./HelperCode/TestNodeTransform2DHelpers";

describe("NodeTransform2D Tests", () => {
  const nodeTransform = new NodeTransform2D();

  test("Test positive translation", () => {
    let origin = new Vec2(0, 0);
    let rotation = 0;
    let scale = new Vec2(1, 1);
    let anchor = new Vec2(42, 8.12);

    testNodeTransform2D(nodeTransform, origin, rotation, scale, anchor);
  });

  test("Test negative translation", () => {
    let origin = new Vec2(0, 0);
    let rotation = 0;
    let scale = new Vec2(1, 1);
    let anchor = new Vec2(-14, -6);

    testNodeTransform2D(nodeTransform, origin, rotation, scale, anchor);
  });

  test("Test scale down", () => {
    let origin = new Vec2(0, 0);
    let rotation = 0;
    let scale = new Vec2(0.8, 0.2);
    let anchor = new Vec2(0, 0);

    testNodeTransform2D(nodeTransform, origin, rotation, scale, anchor);
  });

  test("Test scale up", () => {
    let origin = new Vec2(0, 0);
    let rotation = 0;
    let scale = new Vec2(2.4, 3.14);
    let anchor = new Vec2(0, 0);

    testNodeTransform2D(nodeTransform, origin, rotation, scale, anchor);
  });

  test("Test positive angle", () => {
    let origin = new Vec2(0, 0);
    let rotation = (3 * Math.PI) / 4;
    let scale = new Vec2(1, 1);
    let anchor = new Vec2(0, 0);

    testNodeTransform2D(nodeTransform, origin, rotation, scale, anchor);
  });

  test("Test negative angle", () => {
    let origin = new Vec2(0, 0);
    let rotation = (-7 * Math.PI) / 4;
    let scale = new Vec2(1, 1);
    let anchor = new Vec2(0, 0);
    let expectedAngle = Math.PI / 4;

    testNodeTransform2D(
      nodeTransform,
      origin,
      rotation,
      scale,
      anchor,
      expectedAngle
    );
  });

  test("Test non-zero origin", () => {
    let origin = new Vec2(1, -1);
    let rotation = 0;
    let scale = new Vec2(1, 1);
    let anchor = new Vec2(0, 0);

    testNodeTransform2D(nodeTransform, origin, rotation, scale, anchor);
  });

  test("Test non-zero origin with rotation", () => {
    let origin = new Vec2(1, -1);
    let rotation = (3 * Math.PI) / 4;
    let scale = new Vec2(1, 1);
    let anchor = new Vec2(0, 0);

    testNodeTransform2D(nodeTransform, origin, rotation, scale, anchor);
  });

  test("Test non-zero origin with rotation and scale", () => {
    let origin = new Vec2(1, -1);
    let rotation = Math.PI / 4;
    let scale = new Vec2(0.5, 2);
    let anchor = new Vec2(0, 0);

    testNodeTransform2D(nodeTransform, origin, rotation, scale, anchor);
  });

  test("Test non-zero origin with rotation, scale, and translation", () => {
    let origin = new Vec2(1, -1);
    let rotation = Math.PI / 4;
    let scale = new Vec2(0.5, 2);
    let anchor = new Vec2(-5, 2.5);

    testNodeTransform2D(nodeTransform, origin, rotation, scale, anchor);
  });
});
