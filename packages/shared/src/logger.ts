import * as bunyan from "bunyan";

export const log = bunyan.createLogger({ name: "next-app" });

export const childLog = (componentName: string) => {
  return log.child({
    componentName,
  });
};
