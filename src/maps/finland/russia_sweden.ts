import z from "zod";
import { allGoods } from "../../engine/state/good";
import { CityData, LandData } from "../../engine/state/space";
import { SpaceType } from "../../engine/state/location_type";
import { MovePhase } from "../../engine/move/phase";
import { injectCurrentPlayer } from "../../engine/game/state";
import { GoodsHelper } from "../../engine/goods_growth/helper";
import { GridHelper } from "../../engine/map/grid_helper";
import { SelectAction } from "../../engine/select_action/select";
import { inject, injectState } from "../../engine/framework/execution_context";
import { Key } from "../../engine/framework/key";
import { GameStarter } from "../../engine/game/starter";
import { BuildAction, BuildData } from "../../engine/build/build";
import { assert } from "../../utils/validate";
import { Land } from "../../engine/map/location";
import { Direction, TOP_LEFT, TOP_RIGHT, BOTTOM } from "../../engine/state/tile";
import { Coordinates } from "../../utils/coordinates";
import { MoveAction, MoveData } from "../../engine/move/move";
import { City } from "../../engine/map/city";

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

export const SWEDEN_TEMP: LandData = {
  type: SpaceType.UNPASSABLE,
};

const FOUR_LOCO_FLAG = new Key("fourLocoFlag", { parse: z.boolean().parse });

export class FinlandStarter extends GameStarter {
  private readonly fourLoco = injectState(FOUR_LOCO_FLAG);
  protected readonly ghelper = inject(GoodsHelper);

  onStartGame() {
    super.onStartGame();
    this.fourLoco.initState(false);
    this.placeGoodsOnST();
  }

  placeGoodsOnST() {
    const startingSweden = this.ghelper.drawGoods(5);
    const swedenCoord = Coordinates.from({q: 6, r: 4});
    const swedenTemp = this.gridHelper.lookup(swedenCoord) as Land;
    this.gridHelper.update(swedenTemp.coordinates, (landData) => {
      landData.goods = startingSweden;
    });
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
    if (this.currentPlayer().locomotive === 2 && !this.fourLoco()){
      this.fourLoco.set(true);
      unlockSweden(this.grid);
    }
  }
}

function unlockSweden( grid: GridHelper ): void {
  const swedenCoord = Coordinates.from({q: 6, r: 4});
  const swedenTemp = grid.lookup(swedenCoord) as Land;
  const sweden = [...grid.findAllCities()].find(
      (city) => city.data.name === "Sweden",
    )!;
  const initialSwedenGoods = swedenTemp.getGoods();

  grid.update(sweden.coordinates, (cityData) => {
      cityData.goods = initialSwedenGoods;
    });
  grid.update(swedenTemp.coordinates, (landData) => {
    landData.goods = [];
  });
}

export class FinlandBuildAction extends BuildAction {
  validate(data: BuildData): void {
    super.validate(data);
    const toSweden = Coordinates.from({q: 5, r: 5});
    const toRussia = Coordinates.from({q: 11, r: 14});
    
    if (data.coordinates === toSweden) {
      const bottomRight = this.grid().get(data.coordinates.neighbor(Direction.BOTTOM_RIGHT)) as Land;
      const trackConnects = bottomRight.trackExiting(TOP_LEFT);
      assert(!(trackConnects === undefined), {
        invalidInput:
          "Can only build towards Sweden, not from Sweden.",
      })
    }

    if (data.coordinates === toRussia) {
      const bottomLeft = this.grid().get(data.coordinates.neighbor(Direction.BOTTOM_LEFT)) as Land;
      const trackConnectsBL = bottomLeft.trackExiting(TOP_RIGHT);
      const top = this.grid().get(data.coordinates.neighbor(Direction.TOP)) as Land;
      const trackConnectsTop = top.trackExiting(BOTTOM);

      if(trackConnectsBL === undefined && trackConnectsTop === undefined){
        assert(data.orientation === 1, {
          invalidInput: "Can only build towards Russia, not from Russia."
        })
      }

      if(trackConnectsBL && trackConnectsTop === undefined){
        assert(data.orientation === 1 || data.orientation === 6, {
          invalidInput: "Can only build towards Russia, not from Russia.",
        });
      }
    }
  }
}

export class FinlandMoveAction extends MoveAction {

  protected returnToBag(action: MoveData): void {
    const sweden = Coordinates.from({q: 4, r: 5});
    const russia = Coordinates.from({q: 12, r: 14});
    const endingStop = action.path[action.path.length - 1].endingStop;

    super.returnToBag(action);

    if (sweden === endingStop || russia === endingStop){
      this.removeCubeFromCity(endingStop);
    }

  }

  removeCubeFromCity(city: Coordinates): void {
    const finalDestination = this.gridHelper.lookup(city) as City;
    const currentGoods = finalDestination.getGoods();
    const goodToRemove = Math.floor(Math.random() * currentGoods.length);

    currentGoods.splice(goodToRemove, 1);

    this.gridHelper.update(finalDestination.coordinates, (cityData) => {
      cityData.goods = currentGoods;
    });

    if(finalDestination.getGoods().length === 0){
      this.disableCity(finalDestination);
    };
  }

  disableCity(cityToDisable: City): void {
    this.gridHelper.update(cityToDisable.coordinates, (cityData) => {
      if(cityData.type === SpaceType.CITY){
        cityData.color = [];
      }
    })
  }
}

