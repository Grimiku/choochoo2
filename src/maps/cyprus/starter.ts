import { GameStarter } from "../../engine/game/starter";
import { PlayerColor } from "../../engine/state/player";
import { GREECE, TURKEY, UN } from "./roles";

export class CyprusStarter extends GameStarter {
  allPlayerColors(): PlayerColor[] {
    return [UN, GREECE, TURKEY];
  }
}