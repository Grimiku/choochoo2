import { Set as ImmutableSet } from "immutable";
import { AllowedActions } from "../../../engine/select_action/allowed_actions";
import { Action } from "../../../engine/state/action";

export class MontrealAllowedActions extends AllowedActions {
  getActions(): ImmutableSet<Action> {
    return super.getActions().withMutations((set) => {
      set.delete(Action.PRODUCTION).add(Action.REPOPULATION);
    });
  }
}
