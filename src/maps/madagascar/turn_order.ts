import { inject } from "../../engine/framework/execution_context";
import { Log } from "../../engine/game/log";
import { ActionBundle } from "../../engine/game/phase_module";
import { Action } from "../../engine/state/action";
import { PassAction } from "../../engine/turn_order/pass";
import { TurnOrderPhase } from "../../engine/turn_order/phase";

export class MadagascarTurnOrderPhase extends TurnOrderPhase {
  forcedAction(): ActionBundle<object> | undefined {
    if (this.currentPlayer().selectedAction === Action.LAST_PLAYER) {
      return { action: PassAction, data: {} };
    }
    return super.forcedAction();
  }
}

export class MadagascarTurnOrderPass extends PassAction {
  private readonly log = inject(Log);

  process(data: object): boolean {
    if (this.currentPlayer().selectedAction === Action.LAST_PLAYER) {
      this.log.currentPlayer("autopasses due to the last player action");
    }
    return super.process(data);
  }
}
