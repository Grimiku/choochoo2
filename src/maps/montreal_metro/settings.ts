import { GameKey } from "../../api/game_key";
import { MapSettings, ReleaseStage } from "../../engine/game/map_settings";
import {
  MontrealBidAction,
  MontrealSelectActionPhase,
  MontrealTurnOrderPhase,
} from "./auction_tweak";
import {
  MontrealMetroBuilderHelper,
  MontrealMetroUrbanizeAction,
} from "./build";
import {
  MontrealMetroPhaseEngine,
  MontrealMetroStarter,
} from "./disable_goods_growth";
import { MontrealMetroProfitHelper } from "./expenses";
import {
  MontrealMetroLocoAction,
  MontrealMetroMoveHelper,
} from "./government_engine_level";
import {
  MontrealMetroBuildAction,
  MontrealMetroPhaseDelegator,
} from "./government_track";
import { map } from "./grid";
import { MontrealMetroTakeSharesAction } from "./max_shares";
import { MontrealMetroRoundEngine } from "./rounds";
import { MontrealAllowedActions } from "./select_action/allowed_actions";
import { MontrealSelectAction } from "./select_action/montreal_select_action";

export class MontrealMetroMapSettings implements MapSettings {
  readonly key = GameKey.MONTREAL_METRO;
  readonly name = "Montréal Métro";
  readonly minPlayers = 3;
  readonly maxPlayers = 3;
  readonly startingGrid = map;
  readonly stage = ReleaseStage.ALPHA;

  getOverrides() {
    return [
      MontrealSelectActionPhase,
      MontrealAllowedActions,
      MontrealMetroPhaseEngine,
      MontrealMetroProfitHelper,
      MontrealMetroStarter,
      MontrealBidAction,
      MontrealMetroPhaseDelegator,
      MontrealTurnOrderPhase,
      MontrealSelectAction,
      MontrealMetroTakeSharesAction,
      MontrealMetroBuildAction,
      MontrealMetroRoundEngine,
      MontrealMetroLocoAction,
      MontrealMetroMoveHelper,
      MontrealMetroBuilderHelper,
      MontrealMetroUrbanizeAction,
    ];
  }
}
