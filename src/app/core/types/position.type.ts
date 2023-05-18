import { PositionMode } from '../enums/position-model.enum';



/**
 * @description
 * Player position on the field
 */
export interface IPosition {

  /**
   * @description
   * X axis
   */
  x: number;

  /**
   * @description
   * Y axis
   */
  y: number;

  /**
   * @description
   * The playing mode of the player
   */
  mode: PositionMode;
}