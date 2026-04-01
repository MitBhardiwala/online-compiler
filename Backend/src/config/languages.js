const LANGUAGE_CONFIG = {
  python: {
    image: "python:3.11-slim",
    filename: "solution.py",
    runCmd: "python3 /code/solution.py",
  },

  javascript: {
    image: "node:18-slim",
    filename: "solution.js",
    runCmd: "node /code/solution.js",
  },

  php: {
    image: "php:8-cli",
    filename: "solution.php",
    runCmd: "php /code/solution.php",
  },
  c: {
    image: "gcc:latest",
    filename: "solution.c",
    runCmd: "gcc /code/solution.c -o /tmp/solution && /tmp/solution",
  },

  cpp: {
    image: "gcc:latest",
    filename: "solution.cpp",
    runCmd: "g++ /code/solution.cpp -o /tmp/solution && /tmp/solution",
  },

  go: {
    image: "golang:alpine",
    filename: "solution.go",
    runCmd: "go build -o /tmp/solution /code/solution.go && /tmp/solution",
  },
};

export default LANGUAGE_CONFIG;