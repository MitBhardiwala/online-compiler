import {  execFile } from "child_process";
import CONFIG from "../config/index.js";
import type { LanguageEntry } from "../config/languages.js";

const { DOCKER, TIMEOUT_MS } = CONFIG;

interface DockerResult {
  success?: boolean;
  output?: string;
  error?: string;
  stdout?: string;
  stderr?: string;
  executionTime: string;
}

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
 * @param codeFilePath  absolute path to temp code file on host
 * @param langConfig    entry from LANGUAGE_CONFIG
 * @returns {string}
 */
function buildDockerArgs(codeFilePath: string, langConfig: LanguageEntry): string[] {
  const { image, filename, runCmd } = langConfig;

  return [
    "run",
    "--rm",
    "--network", "none",
    "--memory", DOCKER.MEMORY,
    "--cpus", DOCKER.CPUS,
    "--read-only",
    "--tmpfs", "/tmp:rw,exec,nosuid,size=64m,uid=1000,gid=1000",
    "--ulimit", `nproc=${DOCKER.ULIMIT_NPROC}`,
    "--ulimit", `fsize=${DOCKER.ULIMIT_FSIZE}`,
    "-u", DOCKER.USER,
    "-v", `${codeFilePath}:/code/${filename}:ro`,
    "-i",
    image,
    "sh", "-c", runCmd,
  ];
}

/**
 * Runs user code inside a Docker container.
 *
 * @param codeFilePath  path to the temp code file
 * @param langConfig    entry from LANGUAGE_CONFIG
 * @param input         stdin to pipe into the program
 * @returns {Promise<DockerResult>}
 */
export function runInDocker(codeFilePath: string, langConfig: LanguageEntry, input: string = ""): Promise<DockerResult> {
  return new Promise((resolve) => {
    const args = buildDockerArgs(codeFilePath, langConfig);

    console.log("[docker] cmd: docker", args.join(" "));

    const startTime = Date.now();

    const child = execFile(
      "docker",
      args,
      { timeout: TIMEOUT_MS },
      (err, stdout, stderr) => {
        const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);

        if (err && err.killed) {
          return resolve({
            stdout: "",
            stderr: `Time Limit Exceeded (${TIMEOUT_MS / 1000}s)`,
            executionTime,
          });
        }

        resolve({
          success: !err,
          output: stdout || stderr || "",
          error: stderr || "",
          executionTime,
        });
      }
    );

    if (input) child.stdin?.write(input);
    child.stdin?.end();
  });
}
