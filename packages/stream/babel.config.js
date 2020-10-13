module.exports = (api) => {
  console.log('babel config loaded');
  api.cache(true);
  return {
    presets: [
      ['@babel/preset-typescript', { allowNamespaces: true }],
      [
        '@babel/preset-env',
        {
          targets: {
            node: true
          }
        }
      ]
    ],
    plugins: [
      ['@babel/plugin-proposal-class-properties', { loose: true }]
      // , 'babel-plugin-import-graphql'
    ]
  };
};
