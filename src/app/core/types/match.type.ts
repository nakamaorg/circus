import { IGoal } from './goal.type';



/**
 * @description
 * Football match
 */
export interface IMatch {

  /**
   * @description
   * UUID associated with the match
   */
  id: string;

  /**
   * @description
   * The unix timestamp of the start of the match
   */
  date: number;

  /**
   * @description
   * The duration of the match in minutes
   */
  duration: number;

  /**
   * @description
   * The ID of the stadium in which the comedy will take place
   */
  kanpoId: string;

  /**
   * @description
   * Goals scored
   */
  goals: Array<IGoal>;
}