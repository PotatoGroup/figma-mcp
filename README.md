# Figma MCP

<div align="center">
  <h1>只需要一个figma地址，即可把设计转换成组件代码</h1>

[![NPM version](https://img.shields.io/npm/v/figma-ant-mcp.svg?style=flat)](https://npmjs.com/package/figma-ant-mcp)
[![NPM downloads](http://img.shields.io/npm/dm/figma-ant-mcp.svg?style=flat)](https://npmjs.com/package/figma-ant-mcp)

</div> 


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

   可选参数：
   - `--json` 输出 JSON 格式（默认 YAML）
   - `--skip-image-downloads` 禁用图片下载工具
