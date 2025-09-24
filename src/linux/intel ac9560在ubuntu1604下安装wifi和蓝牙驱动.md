## 安装wifi驱动
下载backport-iwlwifi
```shell
sudo add-apt-repository ppa:canonical-hwe-team/backport-iwlwifi
sudo apt update
sudo apt install backport-iwlwifi-dkms
sudo reboot
```
重启后查询iwlwifi
```shell
dmesg | grep iwlwifi
```
提示缺少wifi固件
查询github，只有pop-os才有这个固件
```shell
wget https://github.com/pop-os/linux-firmware/blob/master/iwlwifi-QuZ-a0-jf-b0-50.ucode
sudo cp iwlwifi-QuZ-a0-jf-b0-50.ucode /lib/firmware/
sudo reboot
```
## 安装蓝牙驱动
安装wifi固件后，有可能会提示缺少蓝牙的固件
![image.png](https://img-1254407900.cos.ap-shanghai.myqcloud.com/20250724102606.png)
说明 **Intel 蓝牙固件缺失**，对应你这块 Intel 9560 蓝牙模块所需的文件是：

- `/lib/firmware/intel/ibt-19-0-1.sfi`
    
- `/lib/firmware/intel/ibt-19-0-1.ddc`
```shell
# 下载固件
cd /lib/firmware/intel
sudo wget https://git.kernel.org/pub/scm/linux/kernel/git/firmware/linux-firmware.git/plain/intel/ibt-19-0-1.sfi
sudo wget https://git.kernel.org/pub/scm/linux/kernel/git/firmware/linux-firmware.git/plain/intel/ibt-19-0-1.ddc
# 更新 initramfs 并重启
sudo update-initramfs -u -k all
sudo reboot
# 重启后验证
hciconfig -a
```
