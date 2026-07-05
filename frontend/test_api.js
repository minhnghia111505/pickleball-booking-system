const fetch = require('node-fetch'); // Next.js includes fetch natively in Node 18+

async function testApi() {
  try {
    const res = await fetch("https://user-global.alobo.vn/v2/user/branch/branch_info/sport_pickleball_quinn_sport");
    const text = await res.text();
    console.log(text.substring(0, 1000));
  } catch(e) {
    console.error(e);
  }
}
testApi();
