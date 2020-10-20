import { FACTORY_ID, CACHE_TYPE_CLASS_ID } from "../cache/cacheConstants";
import { PortableBase } from "./portableBase";
import { Client } from "./client";

export class Order extends PortableBase {
  id: string = "";
  quantity: number = 0.0;
  price: number = 0.0;
  country: string = "";
  client: Client = new Client();
  createdAt: string = "";

  constructor() {
    super(CACHE_TYPE_CLASS_ID.ORDER);
  }

  getIdentity = (): string => {
    return this.id;
  }
}
