import { exec } from "child_process";
import CONFIG from "../config/index.js";

const { DOCKER, TIMEOUT_MS } = CONFIG;

/**
 * Builds the docker run command string.
 *
 * Flags explained:
 *  --rm                  auto-remove container after it exits
 *  --network none        no internet access inside the container
 *  --memory              hard RAM cap
 *  --cpus                CPU limit
 *  --read-only           container filesystem is read-only
 *  -v                    mount the code file (read-only) at /code/<filename>
 *  -u                    run as non-root user (uid:gid 1000:1000)
 *  -i                    keep stdin open so we can pipe input
 *  --ulimit nproc        max processes — prevents fork bombs
 *  --ulimit fsize        max file write size — prevents huge file creation
 *
 * @param {string} codeFilePath  absolute path to temp code file on host
 * @param {object} langConfig    entry from LANGUAGE_CONFIG
 * @returns {string}
 */
function buildDockerCommand(codeFilePath, langConfig) {
  const { image, filename, runCmd } = langConfig;

  const isCompiler = ["gcc:latest", "golang:alpine"].includes(image);

  return [
    "docker run",
    "--rm",
    "--network none",
    `--memory ${DOCKER.MEMORY}`,
    `--cpus ${DOCKER.CPUS}`,
    isCompiler ? "" : "--read-only",        // compilers need writable fs
    isCompiler ? "" : "--tmpfs /tmp:rw,nosuid,size=64m",  // not needed without read-only
    `--ulimit nproc=${DOCKER.ULIMIT_NPROC}`,
    `--ulimit fsize=${DOCKER.ULIMIT_FSIZE}`,
    isCompiler ? "" : `-u ${DOCKER.USER}`,  // compiler runs as root, that's fine
    `-v "${codeFilePath}:/code/${filename}:ro"`,
    "-i",
    image,
    `sh -c "${runCmd}"`,
  ].filter(Boolean).join(" ");
}

/**
 * Runs user code inside a Docker container.
 *
 * @param {string} codeFilePath  path to the temp code file
 * @param {object} langConfig    entry from LANGUAGE_CONFIG
 * @param {string} input         stdin to pipe into the program
 * @returns {Promise<{ stdout: string, stderr: string, executionTime: string }>}
 */
export function runInDocker(codeFilePath, langConfig, input = "") {
  return new Promise((resolve) => {
    const dockerCmd = buildDockerCommand(codeFilePath, langConfig);

    console.log("[docker] cmd:", dockerCmd);

    const startTime = Date.now();

    const child = exec(
      dockerCmd,
      { timeout: TIMEOUT_MS },
      (err, stdout, stderr) => {
        const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);

        // err.killed = true means exec() hit the timeout
        if (err && err.killed) {
          return resolve({
            stdout: "",
            stderr: `Time Limit Exceeded (${TIMEOUT_MS / 1000}s)`,
            executionTime,
          });
        }

        resolve({
          success: !err,
          output: stdout || stderr || "",  // old code combined them like this
          error: stderr || "",
          executionTime,  // bonus, keep it
        });
      }
    );

    // Pipe user-provided stdin into the running container
    if (input) child.stdin.write(input);
    child.stdin.end();
  });
}