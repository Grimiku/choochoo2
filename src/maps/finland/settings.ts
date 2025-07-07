import { GameKey } from "../../api/game_key";
import { MapSettings, ReleaseStage, GRIMIKU } from "../../engine/game/map_settings";
import { map } from "./grid";
import { interCityConnections } from "../factory";
import { PlayerColor } from "../../engine/state/player";
import { 
  FinlandMovePhase, 
  FinlandSelectAction, 
  FinlandStarter,
  FinlandBuildAction
} from "./russia_sweden"
import { FinlandMoveAction } from "./remove_cube";

export class FinlandMapSettings implements MapSettings {
  readonly key = GameKey.FINLAND;
  readonly name = "Finland";
  readonly designer = "John Bohrer";
  readonly implementerId = GRIMIKU;
  readonly minPlayers = 3;
  readonly maxPlayers = 6;
  readonly startingGrid = map;
  readonly stage = ReleaseStage.DEVELOPMENT;
  readonly interCityConnections = interCityConnections(map, [
       {connects : ["Espoo", "Helsinki"] },
       {connects : ["Helsinki", "Vantaa"] },
      ]).map((connection) => ({ ...connection, owner: { color: PlayerColor.NEUTRAL }, }));

  getOverrides() {
    return [
      FinlandStarter,
      FinlandMovePhase,
      FinlandSelectAction,
      FinlandBuildAction,
      FinlandMoveAction,
    ];
  }
}
