module.exports = (api) => {
  console.log("babel config loaded");
  api.cache(true);
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            browsers: ["last 2 Chrome versions"],
          },
        },
      ],
      ["@babel/preset-typescript", { allowNamespaces: true }],
    ],
    plugins: [["@babel/plugin-proposal-class-properties", { loose: true }]],
  };
};
