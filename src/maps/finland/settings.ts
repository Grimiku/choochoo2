import { GameKey } from "../../api/game_key";
import { MapSettings, ReleaseStage } from "../../engine/game/map_settings";
import { map } from "./grid";
import { interCityConnections } from "../factory";
import { PlayerColor } from "../../engine/state/player";

export class FinlandMapSettings implements MapSettings {
  readonly key = GameKey.FINLAND;
  readonly name = "Finland";
  readonly minPlayers = 3;
  readonly maxPlayers = 6;
  readonly startingGrid = map;
  readonly stage = ReleaseStage.DEVELOPMENT;
  readonly interCityConnections = interCityConnections(map, [
        ["Espoo", "Helsinki"],
        ["Helsinki", "Vantaa"],
      ]).map((connection) => ({ ...connection, owner: { color: PlayerColor.NEUTRAL }, }));

  getOverrides() {
    return [];
  }
}
