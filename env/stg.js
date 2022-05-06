module.exports = {
  ENV_ID: 'stg',
  // Api data in staging is incomplete and will throw page breaking errors on our site
  API_BASE_URL: 'https://api.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://fiscaldata.treasury.gov',
  EXPERIMENTAL_WHITELIST: ['experimental-page'],
  WEB_SOCKET_BASE_URL: 'wss://downloads.fiscaldata.treasury.gov/main',
  USE_MOCK_RELEASE_CALENDAR_DATA_ON_API_FAIL: true,
  EXCLUDED_PAGE_PATHS: []
};
