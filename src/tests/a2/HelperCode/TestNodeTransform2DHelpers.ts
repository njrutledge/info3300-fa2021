import {NodeTransform2D} from "../../../anigraph";
import {Mat3, Vec2} from "../../../anigraph";

/***
 * This function converts the input angle to the angle in the range in [0,2pi].
 * This may be needed as tests for rotation have the expected angle always be
 * in the range [-pi, pi] to be consistent with the solutions but students may
 * potentially store angles in any range.
 * @param: angle in radians
 * @return: angle in radians in the range [0, 2pi]
 */
 function normalizeAngle (angle: number): number {
  return ((angle % (2*Math.PI))+2*Math.PI) % (2*Math.PI);
}

// TODO: replace with NodeTransform2D
export function testNodeTransform2D(
  node: NodeTransform2D,
  origin: Vec2,
  rotation: number,
  scale: Vec2,
  anchor: Vec2,
  expectedRotation?: number
  ) {
  let M = Mat3.Translation2D(origin).times(
    Mat3.Rotation(rotation).times(
      Mat3.Scale2D(scale).times(Mat3.Translation2D(anchor.times(-1)))
    )
  );

  node.setWithMatrix(M, origin);

  //toBeCloseTo is used to check for -0, +0, 0 equality
  expect(node.position.x).toBeCloseTo(origin.x);
  expect(node.position.y).toBeCloseTo(origin.y);
  expect(normalizeAngle(node.rotation)).toBeCloseTo(
    expectedRotation ? expectedRotation : rotation
  );
  expect(node._scale.x).toBeCloseTo(scale.x);
  expect(node._scale.y).toBeCloseTo(scale.y);
  expect(node.anchor.x).toBeCloseTo(anchor.x);
  expect(node.anchor.y).toBeCloseTo(anchor.y);
}


