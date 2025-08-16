import { GameKey } from "../../api/game_key";
import {
  KAOSKODY,
  MapSettings,
  ReleaseStage,
  Rotation,
} from "../../engine/game/map_settings";
import { IrelandActionNamingProvider } from "./actions";
import { IrelandBuildPhase, IrelandClaimAction } from "./claim_once";
import { IrelandPhaseDelegator, IrelandPhaseEngine } from "./deurbanization";
import { map } from "./grid";
import { IrelandLocoAction, IrelandMoveHelper } from "./locomotive_action";
import { IrelandAllowedActions, IrelandSelectAction } from "./select_action";
import { IrelandRoundEngine } from "./shortened_round";
import { IrelandStarter } from "./starter";

export class IrelandMapSettings implements MapSettings {
  static readonly key = GameKey.IRELAND;
  readonly key = IrelandMapSettings.key;
  readonly name = "Ireland";
  readonly designer = "Martin Wallace";
  readonly implementerId = KAOSKODY;
  readonly minPlayers = 3;
  readonly maxPlayers = 4;
  readonly startingGrid = map;
  readonly stage = ReleaseStage.BETA;
  readonly rotation = Rotation.CLOCKWISE;

  getOverrides() {
    return [
      IrelandRoundEngine,
      IrelandSelectAction,
      IrelandAllowedActions,
      IrelandAllowedActions,
      IrelandClaimAction,
      IrelandBuildPhase,
      IrelandMoveHelper,
      IrelandPhaseDelegator,
      IrelandPhaseEngine,
      IrelandStarter,
      IrelandLocoAction,
      IrelandActionNamingProvider,
    ];
  }
}
