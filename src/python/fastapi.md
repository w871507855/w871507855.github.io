## 流式下载文件

python端
```python
import os
from fastapi.responses import FileResponse

@router.get("/file/download/)
async def file_download(filename: str):
	file_path = os.path.join(path, filename)
	return FileResponse(file_path, filename=filename, media_type="application/octet-stream")
```

react端
```js
handlerDownloadClick(text, record) {
        message.success("下载任务创建中...")
        const baseUrl = "/api/v1/file/download"
        const fullPath = `${baseUrl}/?filename=${text.name}`
        const token = getToken()
        const headers = {
            Authorization: `${token}`,
        };
        Axios.get(fullPath, {
            headers: headers,
            responseType: 'blob',
            onDownloadProgress: progressEvent => {
                let totalSize = progressEvent.total
                if (totalSize < 512 * 1024) {
                    return
                }
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                
                if (progressEvent.loaded === progressEvent.total) {
                    this.setState({
                        downloadDrawerVisble: false,
                        downloadName: "",
                        downloadPercent: 0
                    })
                    return
                }
                this.setState({
                    downloadDrawerVisble: true,
                    downloadName: text.name,
                    downloadPercent: percentCompleted
                })
            }
        }).then(response => {
            const blob = new Blob([response.data]);
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', text.name); // 设置下载的文件名
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        }).catch(error => console.error('Error:', error))
        
    }
```

## 上传文件

