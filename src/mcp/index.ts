import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FigmaService } from '~/figma'
import { getFigmaDataTool, getFigmaImagesTool } from './tools'
import type { GetFigmaImagesParams, GetFigmaDataParams } from './tools'
import { z } from 'zod'


type CreateServerOptions = {
  outputFormat: "yaml" | "json";
  skipImageDownloads?: boolean;
  accessToken: string;
}

export const createServer = (options: CreateServerOptions) => {
  const mcpServer = new McpServer({
    name: "Figma MCP Server",
    version: process.env["NPM_PACKAGE_VERSION"] ?? "unknown",
  });
  const figmaServer = new FigmaService(options.accessToken);
  registerTools(mcpServer, figmaServer, options);
  return mcpServer;
}

const registerTools = (mcpServer: McpServer, figmaService: FigmaService, options: Omit<CreateServerOptions, "accessToken">) => {
  const { outputFormat, skipImageDownloads } = options;
  mcpServer.tool(
    getFigmaDataTool.name,
    getFigmaDataTool.description,
    getFigmaDataTool.parameters,
    (args) => getFigmaDataTool.execute(args as GetFigmaDataParams, figmaService, outputFormat)
  );
  if (!skipImageDownloads) {
    mcpServer.tool(
      getFigmaImagesTool.name,
      getFigmaImagesTool.description,
      getFigmaImagesTool.parameters,
      (args) => getFigmaImagesTool.execute(args as GetFigmaImagesParams, figmaService)
    );
  }
}