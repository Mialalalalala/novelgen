# 解决依赖冲突问题

## 问题

你遇到了 React 版本冲突：
- 项目使用 React 19
- 某些依赖（如 @sanity/color-input）需要 React 18

## 解决方案

### 方法 1: 使用 --legacy-peer-deps（推荐）

我已经创建了 `.npmrc` 文件，它会自动使用 `--legacy-peer-deps`。

现在运行：

```bash
npm install
```

### 方法 2: 手动指定标志

如果方法 1 不行，使用：

```bash
npm install --legacy-peer-deps
```

### 方法 3: 使用 --force（不推荐）

```bash
npm install --force
```

## 验证安装

安装完成后，检查依赖：

```bash
npm list express cors dotenv
```

应该看到这些包已安装。

## 启动 API 服务器

安装完成后，启动 API 服务器：

```bash
npm run api
```

## 为什么需要 --legacy-peer-deps？

- React 19 是较新版本
- 某些 Sanity 插件还没有更新到支持 React 19
- `--legacy-peer-deps` 告诉 npm 忽略 peer dependency 冲突
- 在大多数情况下，这不会导致问题，因为 React 19 向后兼容

## 如果仍然有问题

1. 删除 `node_modules` 和 `package-lock.json`：
   ```bash
   rm -rf node_modules package-lock.json
   ```

2. 重新安装：
   ```bash
   npm install --legacy-peer-deps
   ```

3. 如果还是不行，检查 Node.js 版本：
   ```bash
   node --version
   ```
   建议使用 Node.js 18 或 20
