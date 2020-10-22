import { FACTORY_ID, CACHE_TYPE_CLASS_ID } from "../cache/cacheConstants";
import { PortableBase } from "./portableBase";
import { Client } from "./client";

export class Order extends PortableBase {
  groupId: number = 0.0;
  id: string = "";
  quantity: number = 0.0;
  price: number = 0.0;
  country: string = "";
  clients: Array<Client> = [];
  createdAt: string = "";

  constructor() {
    super(CACHE_TYPE_CLASS_ID.ORDER);
  }

  getIdentity = (): string => {
    return this.id;
  }
}
