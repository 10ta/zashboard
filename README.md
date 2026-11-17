# zashboard (fork)

本仓库是 [Zephyruso/zashboard](https://github.com/Zephyruso/zashboard) 的 fork，只做一件事：同步上游代码，打 tag，自动编译并发布 Release。

## 工作原理

发布流程由 `.github/workflows/release.yml` 驱动：

1. 向仓库推送形如 `v*` 的 tag（例如 `v3.30.0`），或在 Actions 页面手动触发 `workflow_dispatch`。
2. GitHub Actions 在 `ubuntu-latest` 上检出代码，启用 corepack 和 Node.js 22。
3. 执行 `pnpm install --frozen-lockfile` 安装依赖，再执行 `pnpm build`，产物在 `dist/`。
4. 将 `dist/` 打包为 `xd.zip`。
5. 用 `softprops/action-gh-release` 创建以该 tag 命名的 GitHub Release，附上 `xd.zip` 并自动生成发布说明。

也就是说，**只有打 tag 才会编译发布**，普通提交和合并上游不会触发构建。

## 每次更新流程

```bash
# 首次添加上游（只需一次）
git remote add upstream https://github.com/Zephyruso/zashboard.git

# 1. 拉取上游
git fetch upstream

# 2. 合并到本地 main
git checkout main
git merge upstream/main

# 3. 推送合并结果
git push origin main

# 4. 打 tag 并推送，触发 Actions 编译发布
git tag v3.30.0
git push origin v3.30.0
```

推送 tag 后，到仓库的 Actions 页面查看构建，完成后在 Releases 页面下载 `xd.zip`。

## 注意

- tag 必须以 `v` 开头，否则不会触发构建。
- 合并上游时若 README.md 冲突，保留本文件内容即可。
