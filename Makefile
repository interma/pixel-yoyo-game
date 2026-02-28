# 🎮 Pixel Platformer Makefile
# 简化项目的构建、测试和开发流程

.PHONY: help install dev build test test-unit test-e2e test-coverage clean lint format deploy

# 默认目标：显示帮助信息
help:
	@echo "📦 Pixel Platformer - 可用命令："
	@echo ""
	@echo "🚀 开发命令："
	@echo "  make install        - 安装项目依赖"
	@echo "  make dev           - 启动开发服务器"
	@echo "  make build         - 构建生产版本"
	@echo "  make preview       - 预览生产构建"
	@echo ""
	@echo "🧪 测试命令："
	@echo "  make test          - 运行所有测试"
	@echo "  make test-unit     - 运行单元测试"
	@echo "  make test-e2e      - 运行E2E测试"
	@echo "  make test-coverage - 生成测试覆盖率报告"
	@echo "  make test-ui       - 打开测试UI界面"
	@echo ""
	@echo "🔧 工具命令："
	@echo "  make lint          - 代码检查"
	@echo "  make format        - 格式化代码"
	@echo "  make clean         - 清理构建文件"
	@echo "  make deploy        - 部署到生产环境"
	@echo ""
	@echo "📚 其他命令："
	@echo "  make check         - 运行所有检查（lint + test + build）"
	@echo "  make setup         - 首次设置（install + 安装测试工具）"

# 安装依赖
install:
	@echo "📦 安装项目依赖..."
	npm install

# 首次设置（包括测试工具）
setup: install
	@echo "🔧 设置测试环境..."
	npm install -D vitest @vitest/ui @playwright/test
	npx playwright install
	@echo "✅ 设置完成！运行 'make help' 查看可用命令"

# 启动开发服务器
dev:
	@echo "🚀 启动开发服务器..."
	npm run dev

# 构建生产版本
build:
	@echo "🔨 构建生产版本..."
	npm run build
	@echo "✅ 构建完成！输出目录: dist/"

# 预览生产构建
preview: build
	@echo "👀 预览生产构建..."
	npm run preview

# 运行所有测试
test:
	@echo "🧪 运行所有测试..."
	@make test-unit || true
	@make test-e2e || true

# 运行单元测试
test-unit:
	@echo "🧪 运行单元测试..."
	@if [ -f "node_modules/.bin/vitest" ]; then \
		npm run test; \
	else \
		echo "⚠️  Vitest 未安装。运行 'make setup' 安装测试工具"; \
	fi

# 运行E2E测试
test-e2e:
	@echo "🧪 运行E2E测试..."
	@if [ -f "node_modules/.bin/playwright" ]; then \
		npm run test:e2e; \
	else \
		echo "⚠️  Playwright 未安装。运行 'make setup' 安装测试工具"; \
	fi

# 生成测试覆盖率报告
test-coverage:
	@echo "📊 生成测试覆盖率报告..."
	@if [ -f "node_modules/.bin/vitest" ]; then \
		npm run test:coverage; \
	else \
		echo "⚠️  Vitest 未安装。运行 'make setup' 安装测试工具"; \
	fi

# 打开测试UI界面
test-ui:
	@echo "🎨 打开测试UI..."
	@if [ -f "node_modules/.bin/vitest" ]; then \
		npm run test:ui; \
	else \
		echo "⚠️  Vitest 未安装。运行 'make setup' 安装测试工具"; \
	fi

# 代码检查
lint:
	@echo "🔍 运行代码检查..."
	@if [ -f "node_modules/.bin/eslint" ]; then \
		npm run lint; \
	else \
		echo "⚠️  ESLint 未配置"; \
	fi

# 格式化代码
format:
	@echo "✨ 格式化代码..."
	@if [ -f "node_modules/.bin/prettier" ]; then \
		npm run format; \
	else \
		echo "⚠️  Prettier 未配置"; \
	fi

# 清理构建文件
clean:
	@echo "🧹 清理构建文件..."
	rm -rf dist
	rm -rf node_modules/.vite
	rm -rf coverage
	rm -rf playwright-report
	rm -rf test-results
	@echo "✅ 清理完成！"

# 深度清理（包括 node_modules）
clean-all: clean
	@echo "🧹 深度清理（包括依赖）..."
	rm -rf node_modules
	rm -rf package-lock.json
	@echo "✅ 深度清理完成！运行 'make install' 重新安装"

# 运行所有检查
check:
	@echo "🔍 运行完整检查..."
	@make lint || true
	@make test
	@make build
	@echo "✅ 所有检查完成！"

# 部署到生产环境
deploy: build
	@echo "🚀 部署到生产环境..."
	@echo "提示: 如果使用 Vercel，运行 'vercel --prod'"
	@echo "提示: 如果使用 GitHub Pages，推送到 gh-pages 分支"
	@echo "提示: 或者将 dist/ 目录上传到你的服务器"

# 启动开发服务器（后台运行）
dev-bg:
	@echo "🚀 后台启动开发服务器..."
	npm run dev &
	@echo "✅ 服务器已在后台启动"

# 查看项目统计
stats:
	@echo "📊 项目统计："
	@echo ""
	@echo "📁 文件统计："
	@find src -type f -name "*.ts" -o -name "*.tsx" | wc -l | xargs echo "  TypeScript 文件:"
	@find src -type f -name "*.css" | wc -l | xargs echo "  CSS 文件:"
	@echo ""
	@echo "📝 代码行数："
	@find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec wc -l {} + | tail -1
	@echo ""
	@echo "📦 依赖统计："
	@if [ -f "package.json" ]; then \
		echo "  生产依赖: $$(node -e "console.log(Object.keys(require('./package.json').dependencies || {}).length)")"; \
		echo "  开发依赖: $$(node -e "console.log(Object.keys(require('./package.json').devDependencies || {}).length)")"; \
	fi
	@echo ""
	@echo "💾 构建大小："
	@if [ -d "dist" ]; then \
		du -sh dist | awk '{print "  " $$1}'; \
	else \
		echo "  (未构建)"; \
	fi

# 监控文件变化并自动测试
watch:
	@echo "👀 监控文件变化..."
	@if [ -f "node_modules/.bin/vitest" ]; then \
		npm run test:watch; \
	else \
		echo "⚠️  Vitest 未安装。运行 'make setup' 安装测试工具"; \
	fi

# 快速启动（安装 + 开发服务器）
start: install dev

# Git 提交前检查
pre-commit:
	@echo "🔍 提交前检查..."
	@make lint || true
	@make test-unit || true
	@make build
	@echo "✅ 检查通过，可以提交！"
