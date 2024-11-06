import config from 'src/config';
import * as os from 'os';
const runtime = () => {
  const port = process.env.APP_PORT;
  const interfaces = os.networkInterfaces();
  const address = [];

  Object.keys(interfaces).forEach((interfaceName) => {
    const interfaceInfo = interfaces[interfaceName];
    // 过滤以太网和 WLAN 适配器
    if (interfaceName == '以太网' || interfaceName.toLowerCase().includes('ethernet') || interfaceName.toLowerCase().includes('wlan')) {
      interfaceInfo.forEach((details) => {
        // 仅获取 IPv4 地址，并排除虚拟接口和不启用的接口
        if (details.family === 'IPv4' && !details.internal) {
          if (details.address.startsWith('172.') && parseInt(details.address.split('.')[1]) >= 16 && parseInt(details.address.split('.')[1]) <= 31) {
            address.push(details.address);
          }
        }
      });
    }
  });
  return { address, port };
};

const logger = (address, port) => {
  const { ClientSwaggerEntrance, AdminSwaggerEntrance } = config();
  const titleColor = '\x1B[34m%s\x1B[39m';
  const itemColor = '\x1B[36m%s\x1B[0m';
  console.log(titleColor, `App running at:`);
  console.log(itemColor, `- Local: http://localhost:${port}`);
  console.log(itemColor, `- Network http://${address[0]}:${port}`);
  console.log(titleColor, `Swagger docs running at:`);
  console.log(itemColor, `- Local  http://localhost:${port}/${AdminSwaggerEntrance}`);
  console.log(itemColor, `- Local  http://localhost:${port}/${ClientSwaggerEntrance}`);
  console.log(itemColor, `- Network http://${address[0]}:${port}/${AdminSwaggerEntrance}`);
  console.log(itemColor, `- Network http://${address[0]}:${port}/${ClientSwaggerEntrance}`);
};

export { logger, runtime };
