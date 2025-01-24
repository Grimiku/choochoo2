import { infiniteLoopCheck } from "../../utils/functions";
import { assertNever } from "../../utils/validate";
import { Direction } from "../state/tile";

export function rotateDirectionClockwise(dir: Direction): Direction {
  switch (dir) {
    case Direction.BOTTOM_LEFT:
      return Direction.TOP_LEFT;
    case Direction.TOP_LEFT:
      return Direction.TOP;
    case Direction.TOP:
      return Direction.TOP_RIGHT;
    case Direction.TOP_RIGHT:
      return Direction.BOTTOM_RIGHT;
    case Direction.BOTTOM_RIGHT:
      return Direction.BOTTOM;
    case Direction.BOTTOM:
      return Direction.BOTTOM_LEFT;
    default:
      assertNever(dir);
  }
}

export function numRotationsClockwise(
  dir: Direction,
  lookingFor: Direction,
): number {
  let rotations = 0;
  const loopCheck = infiniteLoopCheck(10);
  for (
    let currDir = dir;
    dir !== lookingFor;
    currDir = rotateDirectionClockwise(currDir)
  ) {
    loopCheck();
    rotations++;
  }
  return rotations;
}

export function getOpposite(dir: Direction): Direction {
  switch (dir) {
    case Direction.BOTTOM_LEFT:
      return Direction.TOP_RIGHT;
    case Direction.TOP_LEFT:
      return Direction.BOTTOM_RIGHT;
    case Direction.TOP:
      return Direction.BOTTOM;
    case Direction.TOP_RIGHT:
      return Direction.BOTTOM_LEFT;
    case Direction.BOTTOM_RIGHT:
      return Direction.TOP_LEFT;
    case Direction.BOTTOM:
      return Direction.TOP;
    default:
      assertNever(dir);
  }
}
