import { useAction } from "../../client/services/action";
import { GenericMessage } from "../../client/game/action_summary";
import { Username } from "../../client/components/username";
import { FinlandRemoveCube } from "./remove_cube";

export function FinlandCube() {
  const { canEmit, canEmitUserId } = useAction(FinlandRemoveCube);

  if (canEmitUserId == null) {
    return <></>;
  }

  if (!canEmit) {
    return (
      <GenericMessage>
        <Username userId={canEmitUserId} /> must select a cube to remove from previous destination.
      </GenericMessage>
    );
  }

  return <div> You must select a cube to remove from previous destination.</div>;
}