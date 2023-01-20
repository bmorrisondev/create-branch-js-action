const core = require('@actions/core');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
} catch (error) {
  core.setFailed(error.message);
}
