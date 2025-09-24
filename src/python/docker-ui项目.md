## image
### 查询image

```python
class Docket_utils():
    def __init__(self) -> None:
        self.client = docker.from_env()

	def image_list(self, image_name: str):
        result = self.client.images.list(name=image_name)
        data = []
        for image in result:
            info={}
            info["image_name"] = image.attrs["RepoTags"]
            info["image_id"] = image.attrs["Id"]
            info["created"] = image.attrs["Created"]
            info["size"] = image.attrs["Size"]
            data.append(info)
        return data
```

### 下载image

```python
class Docket_utils():
    def __init__(self) -> None:
        self.client = docker.from_env()
    def image_pull(self, image_name: str):
        try:
            self.client.images.pull(image_name)
            return "ok"
        except docker.errors.APIError as e:
            return e
```