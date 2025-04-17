module.exports = function override(config, env) {
  // Thêm fallback cho các module Node.js core
  config.resolve.fallback = {
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    util: require.resolve("util/"),
    zlib: require.resolve("browserify-zlib"),
    stream: require.resolve("stream-browserify"),
    url: require.resolve("url/"),
    crypto: require.resolve("crypto-browserify"),
    assert: require.resolve("assert/"),
  };
  return config;
};
