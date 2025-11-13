const axios = require('axios');
const pkg = require('../package.json');
const { base_Url } = require('../src/config/Config');
const version = pkg.version;
const platform = process.argv[2] || 'android'
const { sponsor_Code } = require('../src/config/Config');

const updateVersion = async () => {
  try {
    const response = await axios.post(`${base_Url}/api/common/update-version`, {
      version,
      platform,
      sponsorCode: sponsor_Code
    },{'withCredentials': true});
    console.log(response.data);
  } catch (error) {
    console.error('❌ Failed to update version:', error.message);
    process.exit(1); // Fail the build if update fails
  }
};

updateVersion();
