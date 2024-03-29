import _ from "lodash";
 // @ts-ignore
import commandLineArgs from 'command-line-args';
import { Environment } from "./enums";
export const objectToQueryString = (obj: { [key: string]: any }) => {
  var qs = _.reduce(
    obj,
    function (result, value, key) {
      return !_.isNull(value) && !_.isUndefined(value) ? (result += key + "=" + value + "&") : result;
    },
    ""
  ).slice(0, -1);
  return qs;
};

export const getProccessArgs = (): {
  env: Environment
} => {
  return commandLineArgs([
    {name: 'env', type: String, defaultValue: Environment.DEV}
  ])
};