import { Env } from "../enums";
import { ClientConfig } from "hazelcast-client";
import { PORTABLE_FACTORIES } from "./types/portableFactory";

export const getClientConfig = (env: Env): ClientConfig => {
    const cfg: ClientConfig = {
      network: {
        connectionTimeout: 5000 
      },
      serialization: {
        portableFactories: PORTABLE_FACTORIES
      }
    };
    switch (env) {
      case Env.Prod:
      case Env.QA:
        {
          cfg.network.clusterMembers = ['localhost:5701'];
          cfg.clusterName = 'jet';
        }
        break;
      case Env.Dev:
        {
          cfg.network.smartRouting = false;
          cfg.network.clusterMembers = ['localhost:5701'];
          cfg.clusterName = 'jet';
        }
        break;
    }
    return cfg;
  };
  