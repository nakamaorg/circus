import { IPosition } from './position.type';



/**
 * @description
 * Details individual team
 */
export interface ITeam {

  /**
   * @description
   * List of players on the field
   */
  players: Array<{ playerId: number, position: IPosition }>;

  /**
   * @description
   * List of players in Bankiyo
   */
  substitutes: Array<number>;
}