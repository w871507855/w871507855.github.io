## linux

### 系统版本

```Shell
cat /etc/os-release | grep PRETTY_NAME= | awk -F '\"' '{print $2}'
```

### cpu相关

#### 获取cpu使用率

```Shell
top -bn1 | grep Cpu | awk '{print 100 - $8}'
```

#### 获取cpu核数

```Shell
nproc
```

#### 获取cpu型号

```Shell
cat /proc/cpuinfo | grep 'model 
name' | uniq | awk -F ':' '{print $2}'
```

### 内存相关

#### 总内存

```Shell
free | grep Mem | awk '{print $2}'
```

#### 当前使用内存

```Shell
free | grep Mem | awk '{print $3}'
```

#### 空闲内存

```Shell
free | grep Mem | awk '{print $4}'
```

#### 虚拟内存

```Shell
free | grep Swap| awk '{print $4}'
```

#### 当前使用虚拟内存

```Shell
free | grep Swap| awk '{print $4}'
```

#### 空闲虚拟内存

```Shell
free | grep Swap| awk '{print $4}'
```

### 硬盘相关

```Shell
df -h -x tmpfs -x squashfs
```
