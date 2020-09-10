import { FACTORY_ID, CACHE_TYPE_CLASS_ID } from "../cache/cacheConstants";
import { BaseType } from "./base";
import { Client } from "./client";

export class Order extends BaseType {
  id: string = "";
  quantity: number = 0.0;
  price: number = 0.0;
  country: string = "";
  client: Client = new Client();

  constructor() {
    super(CACHE_TYPE_CLASS_ID.ORDER);
  }
}
