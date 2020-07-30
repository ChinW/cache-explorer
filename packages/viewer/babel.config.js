module.exports = (api) => {
  console.log('\nbabel config loaded');
  api.cache(true);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['last 2 Chrome versions']
          }
        }
      ]
    ],
    plugins: ['react-hot-loader/babel']
  };
};
