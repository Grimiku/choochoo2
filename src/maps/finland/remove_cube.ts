import z from "zod";
import { Coordinates, CoordinatesZod } from "../../utils/coordinates";
import { MoveAction, MoveData } from "../../engine/move/move";
import { City } from "../../engine/map/city";
import { ActionProcessor } from "../../engine/game/action";
import { GoodZod, Good, goodToString } from "../../engine/state/good";
import { inject, injectState } from "../../engine/framework/execution_context";
import { RSDELIVERY, RSDELIVERY_LOCATION } from "./russia_sweden"
import { GridHelper } from "../../engine/map/grid_helper";
import { injectCurrentPlayer } from "../../engine/game/state";
import { assert } from "../../utils/validate";
import { SpaceType } from "../../engine/state/location_type";
import { Log } from "../../engine/game/log";

export class FinlandMoveAction extends MoveAction {
  private readonly rsDelivery = injectState(RSDELIVERY);
  private readonly lastDeliveryLocation = injectState(RSDELIVERY_LOCATION);

  protected returnToBag(action: MoveData): void {
    const sweden = Coordinates.from({q: 4, r: 5});
    const russia = Coordinates.from({q: 12, r: 14});
    const endingStop = action.path[action.path.length - 1].endingStop;

    super.returnToBag(action);

    if (this.lastDeliveryLocation.isInitialized()) {
      this.lastDeliveryLocation.set(endingStop);
    } else {this.lastDeliveryLocation.initState(endingStop)};

    if (sweden === endingStop || russia === endingStop){
      this.rsDelivery.set(true);
    }
  }
}

export const FinlandSelectGoodData = z.object({
  good: GoodZod,
  coordinates: CoordinatesZod,
});
export type FinlandSelectGoodData = z.infer<typeof FinlandSelectGoodData>;


export class FinlandRemoveCube implements ActionProcessor<FinlandSelectGoodData> {
  private readonly rsDelivery = injectState(RSDELIVERY);
  private readonly lastDeliveryLocation = injectState(RSDELIVERY_LOCATION);
  static readonly action = "remove-cube";
  protected readonly previousPlayer = injectCurrentPlayer();
  protected readonly gridHelper = inject(GridHelper);
  protected readonly log = inject(Log);

  assertInput = FinlandSelectGoodData.parse;

  canEmit(): boolean {
    return this.rsDelivery() === true;
  }

  validate(data: FinlandSelectGoodData): void {
    const sweden = Coordinates.from({q: 4, r: 5});
    const russia = Coordinates.from({q: 12, r: 14});
    const finalDestination = this.gridHelper.lookup(this.lastDeliveryLocation()) as City;
    const destinationName = finalDestination.name();

    assert(data.coordinates === this.lastDeliveryLocation(),
      { invalidInput: `Must remove a good from ${destinationName}` }
    );
  }

  process(data: FinlandSelectGoodData): boolean {
    this.removeCubeFromCity(data.good, data.coordinates);
    this.rsDelivery.set(false);
    return true;
  }

  removeCubeFromCity(good: Good, city: Coordinates): void {
    const finalDestination = this.gridHelper.lookup(city) as City;
    const currentGoods = finalDestination.getGoods();
    const goodToRemove = currentGoods.indexOf(good);

    currentGoods.splice(goodToRemove, 1);
    this.log.currentPlayer(
          `removes a ${goodToString(good)} good from ${this.gridHelper.displayName(city)}`,
        );

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