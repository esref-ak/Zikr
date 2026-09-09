module.exports = ({ config }) => process.env.ZIKR_SITE_BUILD === '1' ? { ...config, experiments: { ...config.experiments, baseUrl: '/uygulama' } } : config;
