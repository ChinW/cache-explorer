module.exports = (api) => {
  console.log('\nbabel config loaded');
  api.cache(true);
  return {
    presets: [
      // [
      //   '@babel/preset-env',
      //   {
      //     targets: {
      //       browsers: ['last 2 Chrome versions']
      //     }
      //   }
      // ]
      // ['@babel/preset-typescript', { allowNamespaces: true }],
      // '@babel/preset-react'
    ],
    plugins: [
      // ['@babel/plugin-proposal-class-properties', { loose: true }],
      // '@babel/plugin-proposal-nullish-coalescing-operator',
      // '@babel/plugin-proposal-optional-chaining',
      'react-hot-loader/babel'
    ]
  };
};
