import { useCallback } from "react";
import { Good, goodToString } from "../../../engine/state/good";
import {
  InProgressProduction,
  PRODUCTION_STATE,
  SelectCityAction,
  SelectGoodAction,
} from "../../../maps/india-steam-brothers/production";
import { DropdownMenu, DropdownMenuItem } from "../../components/dropdown_menu";
import { Username } from "../../components/username";
import { useAction } from "../../services/action";
import { useInjectedState } from "../../utils/injection_context";
import { GenericMessage } from "../action_summary";

export function ManualGoodsGrowth() {
  const state = useInjectedState(PRODUCTION_STATE);

  return state.production != null ? (
    <SelectGoodForGoodsGrowth production={state.production} />
  ) : (
    <SelectCity />
  );
}

function SelectCity() {
  const { canEmit, canEmitUserId } = useAction(SelectCityAction);

  if (canEmitUserId == null) {
    return <></>;
  }

  if (!canEmit) {
    return (
      <GenericMessage>
        <Username userId={canEmitUserId} /> must select a city to perform the
        production action.
      </GenericMessage>
    );
  }

  return (
    <GenericMessage>
      You must select a city to perform the production action.
    </GenericMessage>
  );
}

function SelectGoodForGoodsGrowth({
  production,
}: {
  production: InProgressProduction;
}) {
  const { emit, canEmit, isPending, canEmitUserId } =
    useAction(SelectGoodAction);

  const select = useCallback((good: Good) => emit({ good }), [emit]);

  if (canEmitUserId == null) {
    return <></>;
  }

  if (!canEmit) {
    return (
      <GenericMessage>
        <Username userId={canEmitUserId} /> must select a good:{" "}
        {production.goods.map(goodToString).join(", ")}.
      </GenericMessage>
    );
  }

  return (
    <div>
      <GenericMessage>You must select a good.</GenericMessage>
      <GoodSelector
        goods={production.goods}
        disabled={isPending}
        onSelect={select}
      />
    </div>
  );
}

interface GoodSelectorProps {
  goods: Good[];
  disabled?: boolean;
  selected?: Good;
  onSelect(good: Good): void;
}

export function GoodSelector({
  goods,
  disabled,
  selected,
  onSelect,
}: GoodSelectorProps) {
  return (
    <DropdownMenu
      id="select-good"
      title={selected == null ? "Select good" : goodToString(selected)}
      disabled={disabled}
    >
      {goods.map((good) => (
        <GoodDropdownMenuItem
          key={good}
          good={good}
          disabled={disabled}
          onSelect={onSelect}
        />
      ))}
    </DropdownMenu>
  );
}

interface GoodDropdownMenuItemProps {
  good: Good;
  selected?: boolean;
  disabled?: boolean;
  onSelect(good: Good): void;
}

function GoodDropdownMenuItem({
  good,
  disabled,
  onSelect,
}: GoodDropdownMenuItemProps) {
  const onClick = useCallback(() => {
    onSelect(good);
  }, [onSelect, good]);

  return (
    <DropdownMenuItem onClick={onClick} disabled={disabled}>
      {goodToString(good)}
    </DropdownMenuItem>
  );
}
