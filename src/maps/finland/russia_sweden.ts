import { GameStarter } from "../../engine/game/starter";
import { GoodsGrowthPhase } from "../../engine/goods_growth/phase";
import { allGoods, Good } from "../../engine/state/good";
import { CityData } from "../../engine/state/space";

export class FinlandStarter extends GameStarter {
  protected getPlacedGoodsFor(
    bag: Good[],
    playerCount: number,
    location: CityData,
  ): Good[] {
    if (location.name === "Russia" || location.name === "Sweden") {
      return super.getPlacedGoodsFor(bag, playerCount, location);
    }

    return [...allGoods];
  }
}
