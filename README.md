# Figma MCP

通过mcp服务访问figma地址，根据figma设计coding

## 使用
添加figma mcp到客户端，如Cursor：

### MacOS / Linux

```json
{
  "mcpServers": {
    "figma-mcp": {
      "command": "npx",
       "args": [
          "-y",
          "figma-mcp",
          "--access-token=You figma access token"
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
      "args": ["/c", "npx", "-y", "figma-mcp", "--access-token=You figma access token"]
    }
  }
}
```

   可选参数：
   - `--json` 输出 JSON 格式（默认 YAML）
   - `--skip-image-downloads` 禁用图片下载工具

## Tools

1. **get_figma_data**
   - 用途：获取指定 Figma 文件的结构化数据（如页面、节点、属性等）。
   - 输出格式：支持 YAML 或 JSON（可通过命令行参数选择）。
   - 典型应用场景：自动化 UI 分析、设计稿结构提取、上下文建模等。

2. **get_figma_images**
   - 用途：批量下载 Figma 文件中的图片资源（如节点截图、切片等）。
   - 可选项：可通过 `--skip-image-downloads` 参数禁用该工具。
   - 典型应用场景：设计资源落地、自动化素材同步、AI 视觉上下文增强等。