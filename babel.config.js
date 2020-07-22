module.exports = (api) => {
  console.log("loaded");
  api.cache(true);
  return {
    presets: [["@babel/preset-env"], ["@babel/preset-typescript", { allowNamespaces: true }]],
    plugins: [],
  };
};
