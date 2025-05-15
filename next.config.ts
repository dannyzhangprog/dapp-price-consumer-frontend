import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // ================== 安全配置 ==================
  headers: async () => {
    return [
      {
        source: "/:path*",  // 匹配所有路由
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"  // 防止点击劫持
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"  // 禁止 MIME 嗅探
          }
        ]
      }
    ]
  },

  // ================== 性能优化 ==================
  experimental: {
    optimizePackageImports: [
      "@rainbow-me/rainbowkit",  // 钱包连接库优化
      "viem",                    // 以太坊接口库优化
      "@tanstack/react-query"    // 数据缓存库优化
    ],
    // serverActions: true          // 启用服务器操作（Next.js 13+）
  },

  // ================== 编译优化 ==================
  // swcMinify: true,               // 使用 SWC 压缩器
  compress: true,                // 启用 Gzip 压缩
  
  // ================== 生产环境优化 ==================
  productionBrowserSourceMaps: true  // 生成浏览器源码映射
}

export default nextConfig