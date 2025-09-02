import { config as loadEnv } from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { resolve } from "path";

interface ServerConfig {
  accessToken: string;
  port: number;
  outputFormat: "yaml" | "json";
  skipImageDownloads?: boolean;
}

interface CliArgs {
  "access-token"?: string;
  env?: string;
  port?: number;
  json?: boolean;
  "skip-image-downloads"?: boolean;
}

export function getServerConfig(): ServerConfig {
  const argv = yargs(hideBin(process.argv))
    .options({
      "access-token": {
        type: "string",
        description: "Figma API key (Personal Access Token)",
      },
      env: {
        type: "string",
        description: "Path to custom .env file to load environment variables from",
      },
      port: {
        type: "number",
        description: "Port to run the server on",
      },
      json: {
        type: "boolean",
        description: "Output data from tools in JSON format instead of YAML",
        default: false,
      },
      "skip-image-downloads": {
        type: "boolean",
        description: "Do not register the download_figma_images tool (skip image downloads)",
        default: false,
      },
    })
    .help()
    .version(process.env['NPM_PACKAGE_VERSION'] ?? "unknown")
    .parseSync() as CliArgs;

  let envFilePath: string;

  if (argv["env"]) {
    envFilePath = resolve(argv["env"]);
  } else {
    envFilePath = resolve(process.cwd(), '.env');
  }

  loadEnv({ path: envFilePath, override: true });

  const config: ServerConfig = {
    accessToken: "",
    port: 3333,
    outputFormat: "yaml",
    skipImageDownloads: false,
  };

  if (argv["access-token"]) {
    config.accessToken = argv["access-token"];
  } else if (process.env['ACCESS_TOKEN']) {
    config.accessToken = process.env['ACCESS_TOKEN'];
  }

  if (argv.port) {
    config.port = argv.port;
  } else if (process.env['PORT']) {
    config.port = parseInt(process.env['PORT'], 10);
  }

  if (argv.json) {
    config.outputFormat = "json";
  } else if (process.env['OUTPUT_FORMAT']) {
    config.outputFormat = process.env['OUTPUT_FORMAT'] as "yaml" | "json";
  }

  if (argv["skip-image-downloads"]) {
    config.skipImageDownloads = true;
  } else if (process.env['SKIP_IMAGE_DOWNLOADS'] === "true") {
    config.skipImageDownloads = true;
  }

  if (!config.accessToken) {
    console.error(
      "Figma ACCESS_TOKEN is required (via CLI argument or .env file)",
    );
    process.exit(1);
  }
  return config;
}
