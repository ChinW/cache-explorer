import pino from 'pino';

export const log = pino({
  name: 'App',
  prettyPrint: {
    levelFirst: true,
      messageFormat: `{msg}`,
    translateTime: `yymmmdd HH:MM:ss Z`,
    ignore: "hostname",
  }
})

export const childLog = (componentName: string) => {
  return log.child({
    name: componentName,
  })
};
