import { z } from 'zod'
import { parseFigmaUrl, smartParseFigmaInput } from '../../utils/figma-url-parser'
import type { FigmaService } from '../../figma'
import { getFigmaDataTool, getFigmaImagesTool, reactComponentGeneratorTool } from './index'
import type { GetFigmaDataParams, GetFigmaImagesParams, ReactComponentGeneratorParams } from './index'
import path from 'path'
import { smartExtractImageNodes } from '../../utils/image-extractor'

const parameters = {
  figmaUrl: z
    .string()
    .describe("Figma设计文件的URL地址，支持file和design链接格式"),
  componentName: z
    .string()
    .optional()
    .describe("生成的React组件名称，如果不提供将从Figma文件名自动生成"),
  outputPath: z
    .string()
    .optional()
    .describe("组件代码输出路径，默认为./components/[componentName]"),
  imageOutputPath: z
    .string()
    .optional()
    .describe("图片资源输出路径，默认为./assets"),
  includeImages: z
    .boolean()
    .optional()
    .default(true)
    .describe("是否下载和处理图片资源"),
  depth: z
    .number()
    .optional()
    .describe("Figma节点遍历深度，默认为10"),
  json: z
    .boolean()
    .optional()
    .default(false)
    .describe("是否输出JSON格式，默认为YAML格式"),
};

const parametersSchema = z.object(parameters);
export type FigmaWorkflowOrchestratorParams = z.infer<typeof parametersSchema>;

/**
 * Figma工作流编排器
 * 自动化执行：解析URL -> 获取数据 -> 下载图片 -> 生成React组件
 */
const figmaWorkflowOrchestrator = async (
  params: FigmaWorkflowOrchestratorParams,
  figmaService: FigmaService,
  outputFormat: "yaml" | "json" = "yaml"
) => {
  try {
    const {
      figmaUrl,
      componentName,
      outputPath = path.join(process.cwd(), 'components', componentName || ''),
      imageOutputPath = path.join(process.cwd(), 'assets'),
      includeImages = true,
      depth = 10
    } = params;

    // 步骤1: 解析Figma URL
    const urlInfo = parseFigmaUrl(figmaUrl);
    if (!urlInfo.isValid) {
      return {
        isError: true,
        content: [{
          type: "text" as const,
          text: `无效的Figma URL: ${figmaUrl}\n请提供有效的Figma文件或设计链接`
        }]
      };
    }

    let workflowSteps: string[] = [];
    let figmaData: any;
    let imageData: any;
    let componentCode: any;

    // 步骤2: 获取Figma数据
    workflowSteps.push("🔍 正在获取Figma设计数据...");
    const figmaDataParams: GetFigmaDataParams = {
      fileKey: urlInfo.fileKey,
      nodeId: urlInfo.nodeId,
      depth
    };

    figmaData = await getFigmaDataTool.execute(figmaDataParams, figmaService, outputFormat);

    if (figmaData.isError) {
      return {
        isError: true,
        content: [{
          type: "text" as const,
          text: `获取Figma数据失败: ${figmaData.content[0]?.text || '未知错误'}`
        }]
      };
    }
    workflowSteps.push("✅ Figma设计数据获取成功");

    // 步骤3: 处理图片资源（如果需要）
    if (includeImages) {
      workflowSteps.push("🖼️ 正在分析和下载图片资源...");

      try {
        // 从Figma数据中提取图片节点
        const imageNodes = smartExtractImageNodes(figmaData.content[0]?.text || '');

        if (imageNodes.length > 0) {
          const figmaImagesParams: GetFigmaImagesParams = {
            fileKey: urlInfo.fileKey,
            nodes: imageNodes,
            localPath: path.resolve(imageOutputPath),
            pngScale: 2
          };

          imageData = await getFigmaImagesTool.execute(figmaImagesParams, figmaService);

          if (imageData.isError) {
            workflowSteps.push("⚠️ 图片下载失败，将继续生成组件代码");
            imageData = { content: [{ type: "text", text: "图片下载失败" }] };
          } else {
            workflowSteps.push("✅ 图片资源下载成功");
          }
        } else {
          workflowSteps.push("ℹ️ 未发现需要下载的图片资源");
          imageData = { content: [{ type: "text", text: "无图片资源" }] };
        }
      } catch (error) {
        workflowSteps.push("⚠️ 图片处理出现问题，将继续生成组件代码");
        imageData = { content: [{ type: "text", text: `图片处理错误: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    } else {
      imageData = { content: [{ type: "text", text: "已跳过图片下载" }] };
      workflowSteps.push("⏭️ 已跳过图片下载步骤");
    }

    // 步骤4: 生成React组件代码
    workflowSteps.push("⚛️ 正在生成React组件代码...");

    const reactComponentParams: ReactComponentGeneratorParams = {
      figma_data: figmaData.content[0]?.text || '',
      figma_images: imageData.content[0]?.text || ''
    };

    componentCode = await reactComponentGeneratorTool.execute(reactComponentParams);
    workflowSteps.push("✅ React组件代码生成完成");

    const finalComponentName = componentName || urlInfo.fileName?.replace(/[^a-zA-Z0-9]/g, '') || 'FigmaComponent';

    return {
      content: [{
        type: "text" as const,
        text: `# Figma到React组件转换 🌟

## 工作流执行步骤
${workflowSteps.map(step => `- ${step}`).join('\n')}

## 组件信息
- **组件名称**: ${finalComponentName}
- **Figma文件**: ${urlInfo.fileName || 'Unknown'}
- **文件Key**: ${urlInfo.fileKey}
${urlInfo.nodeId ? `- **节点ID**: ${urlInfo.nodeId}` : ''}
- **输出路径**: ${outputPath}
${includeImages ? `- **图片路径**: ${imageOutputPath}` : ''}

## 生成的React组件代码

${componentCode.content[0]?.text || ''}

## 使用说明
1. 将上述代码保存为 \`${finalComponentName}.tsx\` 文件
2. 确保项目中已安装相关依赖 (React, TypeScript等)
${includeImages ? '3. 图片资源已保存到指定目录，请确保在组件中正确引用' : ''}
3. 根据需要调整样式和交互逻辑

---
*由 figma-mcp 自动生成 | ${new Date().toLocaleString()}*`
      }]
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      isError: true,
      content: [{
        type: "text" as const,
        text: `工作流执行失败: ${errorMessage}\n\n请检查：\n1. Figma URL是否正确\n2. Figma API Token是否有效\n3. 网络连接是否正常\n4. 输出路径是否有写入权限`
      }]
    };
  }
};

export const figmaWorkflowOrchestratorTool = {
  name: "figma_workflow_orchestrator",
  description: "智能Figma工作流编排器：输入Figma URL，自动获取设计数据、下载图片资源、生成React组件代码的完整流程（首选）",
  parameters,
  execute: figmaWorkflowOrchestrator,
};
