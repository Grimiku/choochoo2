import { SimpleConstructor } from "../engine/framework/dependency_stack";
import { RoundEngine } from "../engine/game/round";
import { Module } from "../engine/module/module";

interface AddTurnLength {
  add: number;
}
interface SetTurnLength {
  turnLength: number;
}

interface FunctionTurnLength {
  function(playerCount: number): number;
}

type ModifyTurnLength = AddTurnLength | SetTurnLength | FunctionTurnLength;

export class TurnLengthModule extends Module {
  constructor(private readonly modify: ModifyTurnLength) {
    super();
  }

  installMixins(): void {
    this.installMixin(RoundEngine, turnLengthMixin(this.modify));
  }
}

function turnLengthMixin(modify: ModifyTurnLength) {
  return function (
    Ctor: SimpleConstructor<RoundEngine>,
  ): SimpleConstructor<RoundEngine> {
    return class extends Ctor {
      maxRounds() {
        if ("turnLength" in modify) {
          return modify.turnLength;
        }
        if ("add" in modify) {
          return super.maxRounds() + modify.add;
        }
        return modify.function(this.playerCount());
      }
    };
  };
}
