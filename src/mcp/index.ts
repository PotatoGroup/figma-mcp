import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FigmaService } from '../figma'
import { 
  getFigmaDataTool, 
  getFigmaImagesTool, 
  reactComponentGeneratorTool,
  figmaWorkflowOrchestratorTool 
} from './tools'
import type { 
  GetFigmaImagesParams, 
  GetFigmaDataParams, 
  ReactComponentGeneratorParams,
  FigmaWorkflowOrchestratorParams 
} from './tools'


type CreateServerOptions = {
  outputFormat: "yaml" | "json";
  skipImageDownloads?: boolean;
  figmaApiKey: string;
}

export const createServer = (options: CreateServerOptions) => {
  const mcpServer = new McpServer({
    name: "Figma MCP Server",
    version: process.env["NPM_PACKAGE_VERSION"] ?? "unknown",
  });
  const figmaServer = new FigmaService(options.figmaApiKey);
  registerTools(mcpServer, figmaServer, options);
  return mcpServer;
}

const registerTools = (mcpServer: McpServer, figmaService: FigmaService, options: Omit<CreateServerOptions, "figmaApiKey">) => {
  const { outputFormat, skipImageDownloads } = options;
  
  // 注册智能工作流编排器 - 主要工具
  mcpServer.tool(
    figmaWorkflowOrchestratorTool.name,
    figmaWorkflowOrchestratorTool.description,
    figmaWorkflowOrchestratorTool.parameters,
    (args) => figmaWorkflowOrchestratorTool.execute(args as FigmaWorkflowOrchestratorParams, figmaService, outputFormat) as any
  );
  
  // 注册基础工具 - 可单独使用
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
  
  mcpServer.tool(
    reactComponentGeneratorTool.name,
    reactComponentGeneratorTool.description,
    reactComponentGeneratorTool.parameters,
    (args) => reactComponentGeneratorTool.execute(args as ReactComponentGeneratorParams) as any
  );
}