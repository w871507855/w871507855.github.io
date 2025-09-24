## mysql8.0设置主从复制
### 主机配置
#### 配置mysqld
/etc/mysql/mysql.conf.d/mysqld.cnf
```conf
server-id=1
log-bin=mysql-bin
binlog-format=ROW
expire-logs-days=10
gtid_mode=ON
enforce_gtid_consistency=ON

binlog-do-db=xxx1
```
#### 重启mysql
`systemctl restart mysql`
#### 创建复制用户并授权
```sql
CREATE USER 'test'@'%' IDENTIFIED WITH mysql_native_password BY 'Test123456';
GRANT REPLICATION SLAVE ON *.* TO 'test'@'%';
FLUSH PRIVILEGES;
```
#### **查看主库状态**，记录`File`和`Position`：
```sql
SHOW MASTER STATUS;
```
#### 导出表结构并复制到从机上
```sql
mysqldump -u root -p --all-databases --set-gtid-purged=OFF > all_data.sql
```

### 从机配置
#### 配置mysqld
/etc/mysql/mysql.conf.d/mysqld.cnf
```conf
server-id=2
relay-log=mysql-relay-bin
log-bin=mysql-bin  # 从库也可以记录binlog
read-only=1
gtid_mode=ON
enforce_gtid_consistency=ON

replicate-do-db=xxx1
```
#### 重启mysql
`systemctl restart mysql`

#### 导入表结构
```sql
mysql -uroot -p < all_data.sql
```
#### **连接主库**：

```sql
CHANGE MASTER TO
MASTER_HOST='主库IP',
MASTER_USER='test',
MASTER_PASSWORD='Test123456',
MASTER_LOG_FILE='主库File值',
MASTER_LOG_POS=主库Position值;
MASTER_AUTO_POSITION=1;
```
#### 查看从机状态
```sql
SHOW SLAVE STATUS\G
```
查看以下参数值：
```text
Slave_IO_Running: Yes
Slave_SQL_Running: Yes
Seconds_Behind_Master: 0
Last_SQL_Error: (空)
```