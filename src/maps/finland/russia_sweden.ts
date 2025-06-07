import z from "zod";
import { allGoods  } from "../../engine/state/good";
import { CityData } from "../../engine/state/space";
import { SpaceType } from "../../engine/state/location_type";
import { MovePhase } from "../../engine/move/phase";
import { injectCurrentPlayer } from "../../engine/game/state";
import { GoodsHelper } from "../../engine/goods_growth/helper";
import { GridHelper } from "../../engine/map/grid_helper";
import { SelectAction } from "../../engine/select_action/select";
import { inject, injectState } from "../../engine/framework/execution_context";
import { Key } from "../../engine/framework/key";
import { GameStarter } from "../../engine/game/starter";

export const RUSSIA: CityData = {
  type: SpaceType.CITY,
  color: allGoods.toArray(),
  name: "Russia",
  goods: [],
  onRoll: [],
  startingNumCubes: 5,
};

export const SWEDEN: CityData = {
  type: SpaceType.CITY,
  color: allGoods.toArray(),
  name: "Sweden",
  goods: [],
  onRoll: [],
  startingNumCubes: 0,
};

export const SWEDEN_TEMP: CityData = {
  type: SpaceType.CITY,
  color: [],
  name: "Sweden_Temp",
  goods: [],
  onRoll: [],
  startingNumCubes: 5,
};

const FOUR_LOCO_FLAG = new Key("fourLocoFlag", { parse: z.boolean().parse });

export class FinlandStarter extends GameStarter {
  private readonly fourLoco = injectState(FOUR_LOCO_FLAG);

  onStartGame() {
    super.onStartGame();
    this.fourLoco.initState(false);
  }
}

export class FinlandMovePhase extends MovePhase {
  protected readonly currentPlayer = injectCurrentPlayer();
  protected readonly helper = inject(GoodsHelper);
  protected readonly grid = inject(GridHelper);
  private readonly fourLoco = injectState(FOUR_LOCO_FLAG);

  onEndTurn(): void {
    super.onEndTurn();
    if (this.currentPlayer().locomotive === 4 && !this.fourLoco()){
      this.fourLoco.set(true);
      unlockSweden(this.grid);
    }
  }
}

export class FinlandSelectAction extends SelectAction {
  protected readonly currentPlayer = injectCurrentPlayer();
  protected readonly grid = inject(GridHelper);
  private readonly fourLoco = injectState(FOUR_LOCO_FLAG);

  protected override applyLocomotive(): void {
    super.applyLocomotive();
    if (this.currentPlayer().locomotive === 4 && !this.fourLoco()){
      this.fourLoco.set(true);
      unlockSweden(this.grid);
    }
  }
}

function unlockSweden( grid: GridHelper ): void {
  const swedenTemp = [...grid.findAllCities()].find(
      (city) => city.data.name === "Sweden_Temp",
    )!;
  const sweden = [...grid.findAllCities()].find(
      (city) => city.data.name === "Sweden",
    )!;
  const initialSwedenGoods = swedenTemp.getGoods();

  grid.update(sweden.coordinates, (cityData) => {
      cityData.goods = initialSwedenGoods;
    });
  grid.update(swedenTemp.coordinates, (cityData) => {
    cityData.goods = [];
  });
}

