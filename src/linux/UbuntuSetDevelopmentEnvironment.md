## python

### 使用conda搭建python开发环境

参考：[anaconda | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)

#### 1. 下载miniconda
[Index of /anaconda/miniconda/ | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/)

#### 2. 安装miniconda
下载得到Miniconda-latest-Linux-x86_64.sh
```shell
sudo chmod +x Miniconda-latest-Linux-x86_64.sh
./Miniconda-latest-Linux-x86_64.sh
# 回车再q可以直接到最下面的安装界面

```

#### 3. 修改conda源
conda配置目录 ${HOME}/.condarc

```
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
```

#### 4. 清除缓存，创建虚拟环境
```
conda clean -i
# 创建一个名字叫learning的python3.11的虚拟环境
conda create -n learning python=3.11
```

#### 5. 使用虚拟环境
```
conda activate learning
```

#### 6. 配置pip源
参考 [pypi | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/help/pypi/)

```
# 临时使用
pip install -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple some-package
# 默认使用
python -m pip install --upgrade pip
pip config set global.index-url https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple
```

## web开发环境
### 使用nvm搭建web开发环境

#### 1. 下载nvm
[https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)

#### 2. 使用脚本安装
v0.39.4可以替换成其他版本
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
```
#### 3. 使用nvm
```
# 默认在线最新的latest版本
nvm install node
nvm use node
```

### 使用conda搭建web开发环境


```
conda create -n env_node20 nodejs=20
```

