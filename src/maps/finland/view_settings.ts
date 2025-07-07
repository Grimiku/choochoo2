import { MapViewSettings } from "../view_settings";
import { FinlandRules } from "./rules";
import { FinlandMapSettings } from "./settings";
import { FinlandTextures } from "./map_flavor";

export class FinlandViewSettings
  extends FinlandMapSettings
  implements MapViewSettings
{
  getMapRules = FinlandRules;
  getTexturesLayer = FinlandTextures;
}
