const { chdir } = require('process');
const { execSync } = require("child_process");
const { existsSync, writeFileSync } = require("fs");

const PACKAGE_JSON_PATH = "./package.json";

/**
 * Logs to the console
 */
const log = msg => console.log(`\n${msg}`); // eslint-disable-line no-console

/**
 * Exits the current process with an error code and message
 */
const exit = msg => {
  console.error(msg);
  process.exit(1);
};

/**
 * Executes the provided shell command and redirects stdout/stderr to the console
 */
const run = cmd => execSync(cmd, {
  encoding: "utf8",
  stdio: "inherit"
});

/**
 * Exits if the `package.json` file is missing
 */
const verifyPackageJson = () => {
  if (!existsSync(PACKAGE_JSON_PATH)) {
    exit("Missing `package.json` file");
  }
};

/**
 * Determines the current operating system (one of ["mac", "windows", "linux"])
 */
const getPlatform = () => {
  switch (process.platform) {
    case "darwin":
      return "mac";
    case "win32":
      return "windows";
    default:
      return "linux";
  }
};

/**
 * Parses the environment variable with the provided name. If `required` is set to `true`, the
 * program exits if the variable isn't defined
 */
const getEnvVariable = (name, required = false) => {
  const value = process.env[`INPUT_${name.toUpperCase()}`];
  if (required && (value === undefined || value === null || value === "")) {
    exit(`"${name}" input variable is not defined`);
  }
  return value;
};

/**
 * Sets the specified env variable if the value isn't empty
 */
const setEnvVariable = (name, value) => {
  if (value !== null && value !== undefined && value !== "") {
    process.env[name] = value.toString();
  }
};

/**
 * Installs NPM dependencies and builds/releases the Electron app
 */
const runAction = () => {
  const workingDirectory = getEnvVariable("working-directory")
  if (workingDirectory) {
    chdir(workingDirectory)
  }
  const platform = getPlatform();

  // Make sure `package.json` file exists
  verifyPackageJson();

  // Copy "github_token" input variable to "GH_TOKEN" env variable (required by `electron-builder`)
  setEnvVariable("GH_TOKEN", getEnvVariable("github_token", true));

  // Require code signing certificate and password if building for macOS. Export them to environment
  // variables (required by `electron-builder`)
  if (platform === "mac") {
    setEnvVariable("CSC_LINK", getEnvVariable("mac_certs"));
    setEnvVariable("CSC_KEY_PASSWORD", getEnvVariable("mac_certs_password"));
  } else if (platform === "windows") {
    setEnvVariable("CSC_LINK", getEnvVariable("windows_certs"));
    setEnvVariable("CSC_KEY_PASSWORD", getEnvVariable("windows_certs_password"));
  }

  setEnvVariable("BUILD", getEnvVariable("build"))
  setEnvVariable("PROJECT_NAME", getEnvVariable("project_name"))

  writeFileSync('.npmrc', `@fortawesome:registry=https://npm.fontawesome.com/\n//npm.fontawesome.com/:_authToken=${getEnvVariable("fontawesome_token")}`)

  // Disable console advertisements during install phase
  setEnvVariable("ADBLOCK", true);

  const buildScript = getEnvVariable("build_script");

  if (buildScript) {
    run(buildScript);
  }
};

runAction();