# 金川服务器控制中心软件

## 简介

金川服务器控制中心是一个桌面图形化应用，用于管理游戏账号权限申请系统。支持数据库连接、申请审核、权限管理、SQL指令执行等功能。

## 技术栈

- **Electron**: 跨平台桌面应用框架
- **Node.js**: 后端运行时
- **MySQL2**: MySQL数据库驱动
- **RCON**: Minecraft服务器RCON协议客户端

## 功能特性

### 1. 连接配置
- 数据库连接配置（MySQL）
- Minecraft服务器RCON连接配置
- 连接状态实时显示

### 2. 权限申请管理
- 申请列表显示
- 按状态筛选（待审核、已通过、已拒绝）
- 按账号名称搜索
- 审核申请（通过/拒绝）
- 自动同步到Minecraft服务器

### 3. 权限账号管理
- 账号列表显示
- 按权限等级筛选
- 添加权限账号
- 删除权限账号
- 自动同步到Minecraft服务器

### 4. SQL指令执行
- 直接执行SQL查询
- 显示执行结果
- 危险指令保护

### 5. 操作日志
- 查看所有操作记录
- 按操作类型筛选
- 按账号名称搜索

## 安装和运行

### 1. 安装依赖

```bash
cd control-center
npm install
```

### 2. 开发模式运行

```bash
npm run dev
```

### 3. 生产模式运行

```bash
npm start
```

### 4. 打包应用

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

## 使用说明

### 1. 连接数据库

1. 打开"连接配置"标签页
2. 填写数据库连接信息：
   - 数据库地址（如：localhost）
   - 端口（默认：3306）
   - 用户名
   - 密码
   - 数据库名（默认：permission_center）
3. 点击"连接数据库"按钮
4. 连接成功后，状态栏会显示"已连接"

### 2. 连接RCON（可选）

1. 在"连接配置"标签页填写RCON信息：
   - 服务器地址（如：localhost）
   - RCON端口（默认：25575）
   - RCON密码
2. 点击"连接RCON"按钮
3. 连接成功后，可以在审核申请和添加账号时自动同步到Minecraft服务器

### 3. 审核申请

1. 打开"权限申请"标签页
2. 使用筛选器筛选待审核申请
3. 点击"通过"或"拒绝"按钮
4. 如果选择拒绝，需要输入拒绝原因
5. 确认后，申请状态会更新，并自动同步到Minecraft服务器（如果已连接RCON）

### 4. 管理权限账号

1. 打开"权限账号"标签页
2. 点击"添加账号"按钮
3. 填写账号信息：
   - 游戏账号名称
   - 权限等级（player/vip/admin）
   - 过期时间（可选）
   - 备注（可选）
4. 点击"保存"按钮
5. 账号会自动添加到数据库并同步到Minecraft服务器

### 5. 执行SQL指令

1. 打开"SQL指令"标签页
2. 在输入框中输入SQL语句
3. 点击"执行"按钮
4. 执行结果会显示在下方

**注意**：系统会自动阻止危险SQL指令（如DROP、TRUNCATE等）

### 6. 查看操作日志

1. 打开"操作日志"标签页
2. 使用筛选器筛选日志
3. 查看所有操作记录

## 配置文件

配置文件存储在用户数据目录：
- Windows: `%APPDATA%/jinchuan-control-center/config.json`
- macOS: `~/Library/Application Support/jinchuan-control-center/config.json`
- Linux: `~/.config/jinchuan-control-center/config.json`

配置文件格式：
```json
{
  "database": {
    "host": "localhost",
    "port": 3306,
    "user": "admin_user",
    "password": "password",
    "database": "permission_center"
  },
  "rcon": {
    "host": "localhost",
    "port": 25575,
    "password": "rcon_password"
  }
}
```

## 权限插件兼容性

本软件支持以下权限插件：
- **LuckPerms**（推荐）
- **PermissionsEx**
- **GroupManager**

Minecraft命令示例（LuckPerms）：
- 添加权限：`/lp user <username> parent set <group>`
- 删除权限：`/lp user <username> parent clear`

## 注意事项

1. **数据库安全**：确保数据库用户权限配置正确，不要使用root用户
2. **RCON安全**：RCON密码应该足够复杂，不要泄露
3. **备份数据**：定期备份数据库，避免数据丢失
4. **网络连接**：确保能够访问数据库服务器和Minecraft服务器

## 故障排除

### 数据库连接失败
- 检查数据库服务是否运行
- 检查防火墙设置
- 检查用户名和密码是否正确
- 检查数据库是否存在

### RCON连接失败
- 检查Minecraft服务器是否启用RCON
- 检查RCON端口是否正确
- 检查RCON密码是否正确
- 检查防火墙设置

### 权限同步失败
- 检查RCON连接是否正常
- 检查权限插件是否正确安装
- 检查命令格式是否正确

## 开发说明

### 项目结构

```
control-center/
├── main.js          # Electron主进程
├── preload.js       # 预加载脚本
├── renderer.js      # 渲染进程脚本
├── index.html       # 主窗口HTML
├── styles/
│   └── main.css    # 样式文件
├── package.json     # 项目配置
└── README.md        # 说明文档
```

### IPC通信

主进程和渲染进程通过IPC通信：
- `get-config`: 获取配置
- `save-config`: 保存配置
- `connect-database`: 连接数据库
- `execute-sql`: 执行SQL
- `connect-rcon`: 连接RCON
- `execute-minecraft-command`: 执行Minecraft命令
- `get-requests`: 获取申请列表
- `update-request-status`: 更新申请状态
- `get-accounts`: 获取账号列表
- `add-account`: 添加账号
- `delete-account`: 删除账号
- `get-logs`: 获取日志列表

## 许可证

MIT License

## 作者

JKMA都市圈|金川市

