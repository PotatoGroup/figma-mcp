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
      "args": ["/c", "npx", "-y", "figma-mcp", "--figma-api-key=You figma access token"]
    }
  }
}
```

   可选参数：
   - `--json` 输出 JSON 格式（默认 YAML）
   - `--skip-image-downloads` 禁用图片下载工具
