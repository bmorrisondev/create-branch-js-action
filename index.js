const core = require('@actions/core');
const https = require('https');
const urlpkg = require('url')

async function post(requestUrl, bodyObj) {
  let url = urlpkg.parse(requestUrl)
  var postData = JSON.stringify(bodyObj);

  var options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  // var options = {
  //   hostname: 'posttestserver.com',
  //   port: 443,
  //   path: '/post.php',
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Content-Length': postData.length
  //   }
  // };

  return new Promise((resolve, reject) => {

    var req = https.request(options, (res) => {
      res.on('end', (d) => {
        resolve(d)
      })
    });

    req.on('error', (e) => {
      reject(e)
    });

    req.write(postData);
    req.end();
  })
}

async function createBranch(orgName, databaseName, parentBranchName, branchName) {
  let url = `https://api.planetscale.com/v1/organizations/${orgName}/databases/${databaseName}/branches`
  let body = {
    name: branchName,
    parent_branch: parentBranchName
  }
  let res = await post(url, body)
  let json = await res.json(res)
  console.log(json)
}

try {
  // `who-to-greet` input defined in action metadata file
  const orgName = core.getInput('org_name');
  const databaseName = core.getInput('database_name');
  const parentBranchName = core.getInput('parent_branch_name');
  const branchName = core.getInput('branch_name');
  let res = await createBranch(orgName, databaseName, parentBranchName, branchName)
  console.log(`Hello ${nameToGreet}!`);
} catch (error) {
  core.setFailed(error.message);
}