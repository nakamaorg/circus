import { ITeam } from './team.type';



/**
 * @description
 * Playing formation
 */
export interface IFormation {
  
  /**
   * @default
   * The first team
   */
  teamA: ITeam;

  /**
   * @description
   * THe second team
   */
  teamB: ITeam;
}