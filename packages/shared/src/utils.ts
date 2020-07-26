import _ from "lodash";

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
