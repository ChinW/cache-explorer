import { Environment } from "../enums";
import { ClientConfig } from "hazelcast-client";
import { PORTABLE_FACTORIES } from "./portableFactory";
import { OrderBufSerializer } from './orderBufSerializer';

export const getClientConfig = (env: Environment): ClientConfig => {
    const cfg: ClientConfig = {
      network: {
        connectionTimeout: 5000 
      },
      serialization: {
        portableFactories: PORTABLE_FACTORIES,
        customSerializers: [
          new OrderBufSerializer()
        ]
      },
      connectionStrategy: {
        asyncStart: false
      },
    };
    switch (env) {
      case Environment.PROD:
      case Environment.QA:
        {
          cfg.network.clusterMembers = ['localhost:5501'];
          cfg.clusterName = 'cache';
        }
        break;
      case Environment.DEV:
        {
          cfg.network.smartRouting = false;
          cfg.network.clusterMembers = ['localhost:5501'];
          cfg.clusterName = 'cache';
        }
        break;
    }
    return cfg;
  };
  