/**
 * 部署配置
 *
 * - 复制.env.temp文件重命名为.env, 更改其配置
 * - 复制此文件重命名为deploy.config.js
 * - 开发测试使用`npm run deploy:preview`打包
 * - 生产环境使用`npm run deploy:upload`打包
 */
module.exports = {
  // 私钥文件路径
  privateKeyPath: '/Users/3lang/Desktop/private.key',
  // 预览二维码输出路径
  qrcodeOutputDest: '/Users/3lang/Desktop/preview.jpg',
};
