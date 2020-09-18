import { Environment } from "../enums";
import { ClientConfig } from "hazelcast-client";
import { PORTABLE_FACTORIES } from "./portableFactory";

export const getClientConfig = (env: Environment): ClientConfig => {
    const cfg: ClientConfig = {
      network: {
        connectionTimeout: 5000 
      },
      serialization: {
        portableFactories: PORTABLE_FACTORIES
      }
    };
    switch (env) {
      case Environment.PROD:
      case Environment.QA:
        {
          cfg.network.clusterMembers = ['localhost:5701'];
          cfg.clusterName = 'jet';
        }
        break;
      case Environment.DEV:
        {
          cfg.network.smartRouting = false;
          cfg.network.clusterMembers = ['localhost:5701'];
          cfg.clusterName = 'jet';
        }
        break;
    }
    return cfg;
  };
  