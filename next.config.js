/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Allows WASM modules to be imported
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    }

    config.output.webassemblyModuleFilename = isServer
      ? `${isServer ? '../' : ''}static/wasm/[modulehash].wasm`
      : 'static/wasm/[modulehash].wasm'
      
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    })

    return config
  },
}

module.exports = nextConfig