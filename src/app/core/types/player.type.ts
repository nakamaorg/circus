import { PlayerGroup } from '../enums/player-group.enum';



/**
 * @description
 * Player type. Expansion may follow.
 */
export interface IPlayer {

  /**
   * @description
   * UUID of the player
   */
  id: string;

  /**
   * @description
   * Player name, or nickname
   */
  name: string;

  /**
   * @description
   * The group which the player belongs to
   */
  group: PlayerGroup;
}