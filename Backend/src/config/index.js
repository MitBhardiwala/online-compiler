const CONFIG = {
  PORT: 5000,
  TIMEOUT_MS: 10000, // 10 seconds per execution

  DOCKER: {
    MEMORY: "128m",
    CPUS: "0.5",
    ULIMIT_NPROC: "1024:1024",
    ULIMIT_FSIZE: "1048576:1048576", // 1MB
    USER: "1000:1000",               // non-root user
  },
};

export default CONFIG;