import { Portable } from "hazelcast-client";
import { FACTORY_ID, CACHE_TYPE_CLASS_ID } from "../cacheConstants";
import { BaseType } from "./base";
import { Client } from "./client";

export class Order extends BaseType implements Portable {
  factoryId: number = FACTORY_ID;
  classId: number = CACHE_TYPE_CLASS_ID.ORDER;
  city: string = "";
  weather: string = "";
  country: string = "";
  client: Client = new Client();
}
