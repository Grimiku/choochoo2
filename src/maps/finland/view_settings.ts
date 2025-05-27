import { MapViewSettings } from "../view_settings";
import { FinlandRules } from "./rules";
import { FinlandMapSettings } from "./settings";

export class FinlandViewSettings
  extends FinlandMapSettings
  implements MapViewSettings
{
  getMapRules = FinlandRules;
}
