import { KanpoSize } from '../enums/kanpo-size.enum';



/**
 * @description
 * Stadium definition
 */
export interface IKanpo {

  /**
   * @description
   * UUID of the playing field
   */
  id: string;

  /**
   * @description
   * The name of the kanpo
   */
  name: string;

  /**
   * @description
   * The total price needed to rent pet hour
   */
  price: number;

  /**
   * @description
   * The field size
   */
  size: KanpoSize;

  /**
   * @description
   * Picture URL showing what the kanpo looks like
   */
  picture: string;

  /**
   * @description
   * Google maps URL of the playing field
   */
  location: string;
}