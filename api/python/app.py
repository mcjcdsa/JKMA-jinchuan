"""
权限中心API服务 - Python + Flask版本

部署说明：
1. 安装依赖：pip install flask flask-cors mysql-connector-python python-dotenv
2. 配置.env文件（参考.env.example）
3. 启动服务：python app.py
4. 使用gunicorn：gunicorn -w 4 -b 0.0.0.0:3000 app:app
"""

import os
import json
import re
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = Flask(__name__)

# CORS配置
CORS(app, origins=[os.getenv('CORS_ORIGIN', 'https://mcjcdsa.github.io')], 
     methods=['GET', 'POST'], supports_credentials=False)

# 数据库连接池配置
db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USER', 'api_user'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'permission_center'),
    'charset': 'utf8mb4',
    'autocommit': True
}

# 创建连接池
db_pool = pooling.MySQLConnectionPool(
    pool_name='permission_pool',
    pool_size=10,
    pool_reset_session=True,
    **db_config
)

# 验证Minecraft用户名格式
def validate_minecraft_username(username):
    if not username:
        return False
    pattern = r'^[a-zA-Z0-9_]{1,16}$'
    return bool(re.match(pattern, username))

# 验证QQ号格式（可选）
def validate_qq_number(qq):
    if not qq:
        return True  # QQ号为可选
    pattern = r'^\d{5,15}$'
    return bool(re.match(pattern, qq))

# 检查24小时内是否已提交申请
def check_recent_request(username):
    try:
        conn = db_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute(
            """SELECT COUNT(*) as count FROM permission_requests 
               WHERE minecraft_username = %s 
               AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)""",
            (username,)
        )
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        
        return result['count'] > 0
    except Exception as e:
        print(f'检查重复申请失败: {e}')
        raise

# 记录操作日志
def log_operation(operation_type, username, operator, details, ip_address, sql_command=None):
    try:
        conn = db_pool.get_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            """INSERT INTO operation_logs 
               (operation_type, minecraft_username, operator, details, ip_address, sql_command) 
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (operation_type, username, operator, json.dumps(details), ip_address, sql_command)
        )
        
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f'记录操作日志失败: {e}')
        # 日志记录失败不影响主流程

# 获取客户端IP地址
def get_client_ip():
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0]
    elif request.headers.get('X-Real-IP'):
        return request.headers.get('X-Real-IP')
    else:
        return request.remote_addr or 'unknown'

# 格式化日期时间
def format_datetime(dt):
    if not dt:
        return None
    if isinstance(dt, str):
        dt = datetime.fromisoformat(dt.replace(' ', 'T'))
    return dt.strftime('%Y-%m-%d %H:%M:%S')

@app.route('/api/permission/apply', methods=['POST'])
def apply_permission():
    """提交权限申请"""
    client_ip = get_client_ip()
    
    try:
        data = request.get_json()
        minecraft_username = data.get('minecraft_username', '').strip()
        qq_number = data.get('qq_number', '').strip() or None
        reason = data.get('reason', '').strip() or None
        captcha = data.get('captcha', '').strip()
        
        # 验证必填字段
        if not minecraft_username:
            return jsonify({
                'success': False,
                'message': '游戏账号名称不能为空',
                'error_code': 'INVALID_USERNAME'
            }), 400
        
        if not captcha:
            return jsonify({
                'success': False,
                'message': '验证码不能为空',
                'error_code': 'INVALID_CAPTCHA'
            }), 400
        
        # 验证用户名格式
        if not validate_minecraft_username(minecraft_username):
            return jsonify({
                'success': False,
                'message': '游戏账号名称格式不正确（1-16个字符，仅支持字母、数字、下划线）',
                'error_code': 'INVALID_USERNAME'
            }), 400
        
        # 验证QQ号格式（如果提供）
        if qq_number and not validate_qq_number(qq_number):
            return jsonify({
                'success': False,
                'message': 'QQ号格式不正确（5-15位数字）',
                'error_code': 'INVALID_QQ'
            }), 400
        
        # 检查24小时内是否已提交
        if check_recent_request(minecraft_username):
            return jsonify({
                'success': False,
                'message': '24小时内已提交过申请，请稍后再试',
                'error_code': 'DUPLICATE_REQUEST'
            }), 400
        
        # 插入申请记录
        conn = db_pool.get_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            """INSERT INTO permission_requests 
               (minecraft_username, qq_number, reason, status, ip_address) 
               VALUES (%s, %s, %s, 'pending', %s)""",
            (minecraft_username, qq_number, reason, client_ip)
        )
        
        request_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()
        
        request_id_str = f"REQ-{datetime.now().strftime('%Y%m%d')}-{str(request_id).zfill(3)}"
        
        # 记录操作日志
        log_operation('apply', minecraft_username, 'system', {
            'qq_number': qq_number,
            'reason': reason
        }, client_ip)
        
        return jsonify({
            'success': True,
            'message': '申请提交成功',
            'request_id': request_id_str,
            'data': {
                'id': request_id,
                'status': 'pending'
            }
        })
        
    except Exception as e:
        print(f'提交申请失败: {e}')
        
        # 记录错误日志
        log_operation('apply', data.get('minecraft_username', 'unknown'), 'system', {
            'error': str(e)
        }, client_ip)
        
        return jsonify({
            'success': False,
            'message': '服务器错误，请稍后重试',
            'error_code': 'SERVER_ERROR'
        }), 500

@app.route('/api/permission/status', methods=['GET'])
def get_status():
    """查询申请状态"""
    try:
        username = request.args.get('username', '').strip()
        
        if not username:
            return jsonify({
                'success': False,
                'message': '请提供游戏账号名称',
                'error_code': 'MISSING_USERNAME'
            }), 400
        
        # 验证用户名格式
        if not validate_minecraft_username(username):
            return jsonify({
                'success': False,
                'message': '游戏账号名称格式不正确',
                'error_code': 'INVALID_USERNAME'
            }), 400
        
        # 查询最新的申请记录
        conn = db_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute(
            """SELECT id, minecraft_username, qq_number, reason, status, 
                      created_at, processed_at, reject_reason 
               FROM permission_requests 
               WHERE minecraft_username = %s 
               ORDER BY created_at DESC 
               LIMIT 1""",
            (username,)
        )
        
        request_data = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not request_data:
            return jsonify({
                'success': False,
                'message': '未找到申请记录',
                'error_code': 'NOT_FOUND'
            }), 404
        
        return jsonify({
            'success': True,
            'data': {
                'id': request_data['id'],
                'minecraft_username': request_data['minecraft_username'],
                'status': request_data['status'],
                'created_at': format_datetime(request_data['created_at']),
                'processed_at': format_datetime(request_data['processed_at']),
                'reject_reason': request_data['reject_reason'],
                'qq_number': request_data['qq_number']
            }
        })
        
    except Exception as e:
        print(f'查询状态失败: {e}')
        return jsonify({
            'success': False,
            'message': '服务器错误，请稍后重试',
            'error_code': 'SERVER_ERROR'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.now().isoformat()
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': '接口不存在',
        'error_code': 'NOT_FOUND'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'message': '服务器内部错误',
        'error_code': 'INTERNAL_ERROR'
    }), 500

if __name__ == '__main__':
    port = int(os.getenv('API_PORT', 3000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f'权限中心API服务已启动')
    print(f'监听端口: {port}')
    print(f'环境: {os.getenv("FLASK_ENV", "production")}')
    
    app.run(host='0.0.0.0', port=port, debug=debug)

