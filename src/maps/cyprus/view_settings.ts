import { GameKey } from "../../api/game_key";
import { CyprusVariantConfig, VariantConfig } from "../../api/variant_config";
import { MapViewSettings } from "../view_settings";
import { CyprusRules } from "./rules";
import { CyprusMapSettings } from "./settings";
import { CyprusVariantEditor } from "./variant_editor";

export class CyprusViewSettings
  extends CyprusMapSettings
  implements MapViewSettings
{
  getMapRules = CyprusRules;

  getInitialVariantConfig(): VariantConfig {
    return { gameKey: GameKey.CYPRUS, variant2020: true };
  }
  getVariantConfigEditor = CyprusVariantEditor;

  getVariantString(variant: VariantConfig): string[] | undefined {
    return [(variant as CyprusVariantConfig).variant2020 ? "2020" : "2012"];
  }
}
