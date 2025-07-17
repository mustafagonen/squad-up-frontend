module.exports = {
  '/200/*': {
    target: 'https://httpstat.us',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
  },
  '/entries/*': {
    target: 'https://api.publicapis.org',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
  },
  '/entries/abcd/*': {
    target: 'https://api.publicapis.org',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    pathRewrite: { '/entries/abcd/': '/entries/' },
  },
};
