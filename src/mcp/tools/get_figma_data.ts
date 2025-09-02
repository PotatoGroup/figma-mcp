import { z } from 'zod'
import type { FigmaService } from '../../figma'
import type { GetFileResponse, GetFileNodesResponse } from '@figma/rest-api-spec';
import { simplifyRawFigmaObject, allExtractors } from "../../extractors";
import yaml from "js-yaml";

const parameters = {
  fileKey: z
    .string()
    .describe(
      "The key of the Figma file to fetch, often found in a provided URL like figma.com/(file|design)/<fileKey>/...",
    ),
  nodeId: z
    .string()
    .optional()
    .describe(
      "The ID of the node to fetch, often found as URL parameter node-id=<nodeId>, always use if provided",
    ),
  depth: z
    .number()
    .optional()
    .describe(
      "OPTIONAL. Do NOT use unless explicitly requested by the user. Controls how many levels deep to traverse the node tree.",
    ),
};

const parametersSchema = z.object(parameters);
export type GetFigmaDataParams = z.infer<typeof parametersSchema>;

const getFigmaData = async (params: GetFigmaDataParams, figmaService: FigmaService, outputFormat: "yaml" | "json") => {
  try {
    const { fileKey, nodeId, depth } = params;
    let rawFigmaResponse: GetFileResponse | GetFileNodesResponse;
    if (nodeId) {
      rawFigmaResponse = await figmaService.getRawNodes(fileKey, nodeId, depth);
    } else {
      rawFigmaResponse = await figmaService.getRawFile(fileKey, depth);
    }
    const simplifiedDesign = simplifyRawFigmaObject(rawFigmaResponse, allExtractors, {
      maxDepth: depth ?? 10,
    });
    const { nodes, globalVars, ...metadata } = simplifiedDesign;
    const result = {
      metadata,
      nodes,
      globalVars,
    };
    const formattedResult =
      outputFormat === "json" ? JSON.stringify(result, null, 2) : yaml.dump(result);
    return {
      content: [{ type: "text" as const, text: formattedResult }],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    return {
      isError: true,
      content: [{ type: "text" as const, text: `Error fetching file: ${message}` }],
    };
  }
};

export const getFigmaDataTool = {
  name: "get_figma_data",
  description: "Get comprehensive Figma file data including layout, content, visuals, and component information",
  parameters,
  execute: getFigmaData,
};