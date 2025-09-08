# Figma-MCP 使用示例

## 🎯 快速开始

### 1. 一键转换 - 智能工作流（推荐）

只需要一个Figma URL，大模型会自动完成整个转换流程：

**用户输入：**
```
请帮我把这个Figma设计转换成React组件：
https://www.figma.com/file/abc123/LoginForm?node-id=1%3A2
```

**大模型自动执行：**
```typescript
// 自动调用 figma_workflow_orchestrator
{
  figmaUrl: "https://www.figma.com/file/abc123/LoginForm?node-id=1%3A2",
  componentName: "LoginForm",
  includeImages: true,
  outputPath: "./components",
  imageOutputPath: "./images"
}
```

**输出结果：**
```typescript
// LoginForm.tsx
import React, { useState } from 'react';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  loading = false 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to your account</p>
      </div>
      
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      
      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;
```

```css
/* LoginForm.module.css */
.loginForm {
  max-width: 400px;
  padding: 32px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #666666;
  margin: 0;
}

.inputGroup {
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
}

.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.submitButton {
  width: 100%;
  padding: 12px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submitButton:hover:not(:disabled) {
  background: #0056b3;
}

.submitButton:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
```

## 🔧 高级用法示例

### 2. 分步骤调用（适用于复杂场景）

如果需要更精细的控制，可以分步骤调用各个工具：

```typescript
// 步骤1：获取Figma设计数据
const figmaData = await get_figma_data({
  fileKey: "abc123",
  nodeId: "1:2",
  depth: 5
});

// 步骤2：下载图片资源
const imageData = await get_figma_images({
  fileKey: "abc123",
  nodes: [
    {
      nodeId: "1:10",
      fileName: "logo.svg",
      imageRef: "ref123"
    }
  ],
  localPath: "/path/to/images",
  pngScale: 2
});

// 步骤3：生成React组件
const componentCode = await react_component_generator({
  figma_data: figmaData,
  figma_images: imageData
});
```

## 📱 不同设计类型示例

### 移动端卡片组件
```
URL: https://www.figma.com/file/xyz789/MobileCard
```

生成的组件特点：
- 响应式布局
- 触摸友好的交互
- 移动端优化的样式

### 复杂表单组件
```
URL: https://www.figma.com/file/def456/ContactForm?node-id=5:20
```

生成的组件特点：
- 表单验证逻辑
- 错误状态处理
- 无障碍访问支持

### 数据展示组件
```
URL: https://www.figma.com/file/ghi101/Dashboard?node-id=10:50
```

生成的组件特点：
- 图表集成准备
- 数据绑定接口
- 加载状态处理

## 🎨 样式定制示例

### 主题支持
生成的组件支持主题定制：

```typescript
// 使用CSS变量支持主题
.button {
  background: var(--primary-color, #007bff);
  color: var(--button-text-color, white);
}
```

### 响应式设计
```css
.container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .container {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .container {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 🚀 集成到项目中

### 1. 安装依赖
```bash
npm install react react-dom
npm install -D @types/react @types/react-dom
```

### 2. 使用组件
```typescript
import LoginForm from './components/LoginForm';

function App() {
  const handleLogin = (data: { email: string; password: string }) => {
    console.log('Login data:', data);
    // 处理登录逻辑
  };

  return (
    <div className="App">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
```

### 3. 自定义样式
```css
/* 覆盖默认样式 */
.custom-login-form {
  --primary-color: #ff6b6b;
  --border-radius: 4px;
}
```

## 💡 最佳实践

### 1. Figma设计准备
- 使用有意义的图层名称
- 合理的组件层级结构
- 一致的颜色和字体规范

### 2. 生成后优化
- 检查生成的TypeScript类型
- 添加必要的业务逻辑
- 优化性能和可访问性

### 3. 团队协作
- 建立设计到代码的规范
- 定期同步Figma设计更新
- 维护组件库的一致性

---

通过这些示例，你可以看到figma-mcp如何将复杂的设计转换流程简化为一个简单的URL输入，大大提升开发效率和代码质量。
