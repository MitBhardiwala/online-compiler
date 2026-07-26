import dotenv from 'dotenv';
dotenv.config();

interface LanguageConfig {
    extension: string;
    command: string;
    compileCommand?: string;
    executeCommand?: string;
}

interface GeminiConfig {
    apiKey: string | undefined;
    model: string;
}

interface Config {
    port: string | number;
    nodeEnv: string;
    supportedLanguages: Record<string, LanguageConfig>;
    gemini: GeminiConfig;
}

const config: Config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    supportedLanguages: {
        python: {
            extension: 'py',
            command: 'python3'
        },
        cpp: {
            extension: 'cpp',
            command: 'g++',
            compileCommand: 'g++ -o {output} {input}',
            executeCommand: '{output}'
        },
        c: {
            extension: 'c',
            command: 'gcc',
            compileCommand: 'gcc -o {output} {input}',
            executeCommand: '{output}'
        },
        java: {
            extension: 'java',
            command: 'javac',
            compileCommand: 'javac {input}',
            executeCommand: 'java {className}'
        },
        csharp: {
            extension: 'cs',
            command: 'mcs',
            compileCommand: 'mcs {input}',
            executeCommand: 'mono {output}'
        },
        r: {
            extension: 'r',
            command: 'Rscript'
        },
        golang: {
            extension: 'go',
            command: 'go',
            compileCommand: 'go build -o {output} {input}',
            executeCommand: './{output}'
        },
        javascript: {
            extension: 'js',
            command: 'node'
        },
        php: {
            extension: 'php',
            command: 'php'
        },
        swift: {
            extension: 'swift',
            command: 'swift',
            compileCommand: 'swiftc -o {output} {input}',
            executeCommand: './{output}'
        },
        rust: {
            extension: 'rs',
            command: 'rustc',
            compileCommand: 'rustc -o {output} {input}',
            executeCommand: './{output}'
        }
    },
    gemini: {
        apiKey: process.env.GEMINI_API_KEY,
        model: 'gemini-3-flash-preview'
    }
};

export default config;
