# Figma MCP

<div align="center">
  <h1>🚀 只需要一个Figma地址，即可把设计转换成组件代码</h1>
  
  <p>智能化的Figma到React组件转换工具，支持一键生成高质量的TypeScript组件代码</p>

[![NPM version](https://img.shields.io/npm/v/figma-ant-mcp.svg?style=flat)](https://npmjs.com/package/figma-ant-mcp)
[![NPM downloads](http://img.shields.io/npm/dm/figma-ant-mcp.svg?style=flat)](https://npmjs.com/package/figma-ant-mcp)

</div>

## ✨ 核心特性

- 🎯 **一键转换**：只需提供Figma URL，自动完成设计到代码的全流程转换
- 🤖 **智能工作流**：大模型自动调用多个工具，无需手动操作
- 🎨 **精确还原**：高保真还原Figma设计，包括布局、样式、交互
- 📱 **响应式支持**：生成适配多端的响应式组件代码
- 🔧 **TypeScript优先**：生成类型安全的React组件代码
- 🖼️ **资源管理**：自动下载和优化图片资源
- 🎪 **组件化设计**：支持复杂组件的层级结构和状态管理 


## 🚀 快速开始

### 基本使用

只需要向大模型提供一个Figma URL，即可自动生成React组件代码：

```
https://www.figma.com/file/abc123/MyDesign?node-id=1:2
```

大模型会自动：
1. 解析Figma URL，提取设计数据
2. 下载相关的图片资源
3. 生成高质量的React组件代码
4. 提供完整的TypeScript类型定义和CSS样式

### 安装配置

添加figma-mcp到客户端，如Cursor：

### MacOS / Linux

```json
{
  "mcpServers": {
    "figma-mcp": {
      "command": "npx",
       "args": [
          "-y",
          "figma-ant-mcp",
          "--figma-api-key=You figma access token"
        ]
    }
  }
}
```

### Windows

```json
{
  "mcpServers": {
    "figma-mcp": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "figma-ant-mcp", "--figma-api-key=You figma access token"]
    }
  }
}
```

**可选参数：**
- `--json` 输出 JSON 格式（默认 YAML）
- `--skip-image-downloads` 禁用图片下载工具

## 🛠️ 工具说明

### 智能工作流编排器（推荐）
- **`figma_workflow_orchestrator`**：一站式解决方案，输入Figma URL自动完成全流程转换

### 基础工具（高级用法）
- **`get_figma_data`**：获取Figma设计文件数据
- **`get_figma_images`**：下载Figma中的图片资源  
- **`react_component_generator`**：基于设计数据生成React组件代码

## 📖 更多文档

- [工作流优化说明](./docs/WORKFLOW_OPTIMIZATION.md) - 详细的优化特性和技术架构
- [使用示例](./examples/usage-example.md) - 完整的使用示例和最佳实践

## 🤝 贡献

欢迎提交Issue和Pull Request来帮助改进这个项目！
