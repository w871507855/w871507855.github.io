---
date: 2025-09-24
category: Linux
tag:
  - MySQL
  - 数据库
---

# MySQL 学习目录（标题 + 练习题）

## 第一部分：基础入门

### 1. MySQL 概述与核心概念
- 1.1 什么是 MySQL，关系型数据库与 NoSQL 的差异
- 1.2 MySQL 的版本与发行版（社区版 / 企业版，5.7 / 8.0）
- 1.3 MySQL 的典型应用场景与生态（Percona、MariaDB）
- 1.4 客户端/服务器架构与 SQL 语言分类（DDL/DML/DQL/DCL/TCL）
- **练习**：用自己的话说明 MySQL 中“数据库、表、行、列”的关系，并列出一条 SQL 中 DDL、DML、DQL 各一个例子

### 2. 安装与连接
- 2.1 在 Linux 上安装 MySQL（包管理器 / 官方仓库）
- 2.2 初始化、启动与停止服务（systemd）
- 2.3 首次登录与修改 root 密码
- 2.4 使用命令行客户端连接（`mysql -u -p -h -P`）
- 2.5 配置文件 `my.cnf` 结构简介
- **练习**：安装 MySQL，用 root 登录后执行 `SHOW DATABASES;` 查看默认库，再创建一个新用户并尝试用它登录

### 3. 数据库与表的基本操作
- 3.1 数据库操作（CREATE / DROP / USE / SHOW）
- 3.2 常用数据类型（INT、VARCHAR、CHAR、TEXT、DATETIME、DECIMAL）
- 3.3 创建表与查看表结构（CREATE TABLE / DESC / SHOW CREATE TABLE）
- 3.4 修改表结构（ALTER TABLE：加列、改列、删列、改名）
- 3.5 删除表与清空表（DROP / TRUNCATE）
- **练习**：创建一个 `students` 表（id、姓名、年龄、班级、创建时间），用 `DESC` 查看结构，再用 `ALTER` 增加一个“邮箱”列

### 4. 数据的增删改查（CRUD）
- 4.1 插入数据（INSERT 单行 / 多行）
- 4.2 查询数据（SELECT 基本语法、字段别名）
- 4.3 更新数据（UPDATE 与 WHERE 条件）
- 4.4 删除数据（DELETE 与 WHERE 条件）
- **练习**：向 `students` 表插入 5 条数据，把某个学生的年龄改为 20，再删除年龄小于 18 的记录，并用 SELECT 验证


## 第二部分：查询进阶

### 5. 条件过滤与排序
- 5.1 WHERE 条件（比较、逻辑运算 AND/OR/NOT）
- 5.2 范围与集合（BETWEEN、IN、NOT IN）
- 5.3 模糊匹配（LIKE、通配符 % 和 _）
- 5.4 空值处理（IS NULL / IS NOT NULL）
- 5.5 排序（ORDER BY、ASC/DESC、多字段排序）
- 5.6 去重（DISTINCT）
- **练习**：查询年龄在 18–22 岁之间、姓名以“张”开头的学生，按年龄降序排列并去重班级

### 6. 聚合函数与分组
- 6.1 常用聚合函数（COUNT、SUM、AVG、MAX、MIN）
- 6.2 GROUP BY 分组统计
- 6.3 HAVING 对分组结果过滤
- 6.4 WHERE 与 HAVING 的区别
- **练习**：按班级分组统计每个班级的学生人数、平均年龄，并只显示人数大于 3 的班级

### 7. 多表查询
- 7.1 表关系（一对一、一对多、多对多）
- 7.2 内连接（INNER JOIN）
- 7.3 左连接与右连接（LEFT/RIGHT JOIN）
- 7.4 自连接
- 7.5 子查询（WHERE 子句、FROM 子句、标量子查询）
- 7.6 UNION 与 UNION ALL
- **练习**：建立 `classes` 表和 `students` 表，用 LEFT JOIN 查询每个班级及其学生数，并找出没有学生的班级

### 8. 常用函数
- 8.1 字符串函数（CONCAT、SUBSTRING、REPLACE、LENGTH、TRIM）
- 8.2 数值函数（ROUND、CEIL、FLOOR、ABS）
- 8.3 日期时间函数（NOW、CURDATE、DATE_FORMAT、DATEDIFF）
- 8.4 条件函数（IF、IFNULL、CASE WHEN）
- **练习**：查询学生信息，把姓名和班级拼接输出，显示“入学天数”，并用 CASE WHEN 按年龄划分“少年/青年/成年”


## 第三部分：设计与约束

### 9. 约束与索引基础
- 9.1 主键（PRIMARY KEY）与自增（AUTO_INCREMENT）
- 9.2 唯一约束（UNIQUE）
- 9.3 非空（NOT NULL）与默认值（DEFAULT）
- 9.4 外键（FOREIGN KEY）与级联操作（ON DELETE/UPDATE）
- 9.5 索引概念与普通索引、唯一索引的创建
- 9.6 索引的代价与使用原则
- **练习**：为 `students` 表添加唯一约束（邮箱）、外键（班级 id 关联 classes），并在姓名列建普通索引，用 EXPLAIN 查看查询是否走索引

### 10. 数据库设计基础
- 10.1 三大范式（1NF / 2NF / 3NF）简介
- 10.2 表结构设计原则（字段类型选择、避免冗余）
- 10.3 ER 图与实体关系建模
- 10.4 反范式化与性能权衡
- **练习**：为一个“图书借阅系统”设计表结构（读者、图书、借阅记录），画出 ER 图并写出建表语句


## 第四部分：运维、安全与性能

### 11. 用户与权限管理
- 11.1 用户创建与删除（CREATE USER / DROP USER）
- 11.2 授权与回收（GRANT / REVOKE）
- 11.3 权限级别（全局、库级、表级、列级）
- 11.4 查看权限与刷新权限（SHOW GRANTS / FLUSH PRIVILEGES）
- 11.5 最小权限原则
- **练习**：创建一个只能对某数据库只读的用户，验证其无法执行 INSERT，再回收权限并测试

### 12. 事务与锁
- 12.1 事务的概念与 ACID 特性
- 12.2 事务控制语句（START TRANSACTION / COMMIT / ROLLBACK / SAVEPOINT）
- 12.3 隔离级别（读未提交 / 读已提交 / 可重复读 / 串行化）
- 12.4 常见并发问题（脏读、不可重复读、幻读）
- 12.5 锁的类型（行锁、表锁、共享锁、排他锁）简介
- **练习**：开启两个会话模拟并发，验证“可重复读”隔离级别下不可重复读是否被避免

### 13. 备份与恢复
- 13.1 备份类型（逻辑备份 vs 物理备份，全量 vs 增量）
- 13.2 使用 `mysqldump` 做逻辑备份与恢复
- 13.3 使用 `mysqlbinlog` 做二进制日志恢复
- 13.4 备份策略与定时备份（结合 cron）
- **练习**：用 `mysqldump` 备份一个数据库，删除一张表后从备份文件恢复，并验证数据完整性

### 14. 性能优化基础
- 14.1 慢查询日志的开启与分析
- 14.2 EXPLAIN 执行计划解读（type、key、rows、Extra）
- 14.3 索引优化（联合索引、最左前缀原则、覆盖索引）
- 14.4 常见 SQL 优化技巧（避免 SELECT *、分页优化、少用函数在索引列上）
- 14.5 服务器参数调优简介（缓冲池、连接数）
- **练习**：构造一条慢查询，开启慢查询日志定位它，加索引后用 EXPLAIN 对比优化前后的执行计划


## 第五部分：实战项目（自拟题目练习）

### 15. 综合实战题目
- 15.1 设计并实现一个“博客系统”数据库（用户、文章、评论、标签）
- 15.2 设计并实现一个“电商订单”数据库（商品、订单、订单明细、库存）
- 15.3 编写统计报表查询（按日/按月销售额、Top N 商品）
- 15.4 搭建主从复制环境（一主一从）并验证数据同步
- 15.5 编写自动化备份与恢复脚本
- 15.6 对一个慢查询系统做索引优化并出具优化报告
- 15.7 用事务实现转账场景并验证一致性
- 15.8 结合应用（如 Python/Java）完成一次完整的 CRUD 应用开发


## 附录：速查与资源

- A.1 常用 SQL 语句速查（DDL/DML/DQL/DCL）
- A.2 常用函数速查（字符串、数值、日期、条件）
- A.3 数据类型选择速查表
- A.4 权限与关键字速查
- A.5 推荐资源：MySQL 官方文档、MySQL 8.0 参考手册、Percona 博客、`EXPLAIN` 官方说明
- A.6 MySQL 认证路径简介（Oracle MySQL 认证，如 8.0 Database Administrator）

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

#### **查看主库状态**，记录 `File`和 `Position`：

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
