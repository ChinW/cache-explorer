// const path = require("path");

// module.exports = {
//   webpack: (config, { isServer }) => {
//     // if (!isServer) {
//     //   config.node = {
//     //     fs: "empty",
//     //     net: "empty",
//     //     tls: "empty",
//     //   };
//     // } else {
      
//     //   config.module.rules[0].include.push(
//     //     path.resolve(__dirname, "../shared/")
//     //   );
//     //   config.module.rules[0].include.push(
//     //     path.resolve(__dirname, "./node_modules/shared/")
//     //   );
//     //   console.log(config.module.rules);
//     // }

//     config.resolve.alias = {
//       ...config.resolve.alias,
//       'shared': path.resolve(__dirname, '../shared/'),
//       // ...
//     };
//     return config;
//   },
// };

const withTM = require('next-transpile-modules')(['shared']); 

module.exports = withTM();