import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,b as e,o as i}from"./app-DTeat9vj.js";const l={};function p(c,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h2 id="基于mcp开发管理linux的mcp-server" tabindex="-1"><a class="header-anchor" href="#基于mcp开发管理linux的mcp-server"><span>基于mcp开发管理linux的mcp server</span></a></h2><p>需求文档</p><h2 id="基于mcp开发管理linux的mcp-server-1" tabindex="-1"><a class="header-anchor" href="#基于mcp开发管理linux的mcp-server-1"><span>基于mcp开发管理linux的mcp server</span></a></h2><h3 id="架构图" tabindex="-1"><a class="header-anchor" href="#架构图"><span>架构图</span></a></h3><p>![[Drawing 2025-08-27 10.06.30.excalidraw.png]]</p><h3 id="项目" tabindex="-1"><a class="header-anchor" href="#项目"><span>项目</span></a></h3><h4 id="安装环境和库" tabindex="-1"><a class="header-anchor" href="#安装环境和库"><span>安装环境和库</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>uv init -p 3.11</span></span>
<span class="line"><span>uv venv -p 3.11</span></span>
<span class="line"><span>uv add fastmcp paramiko httpx</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="项目结构" tabindex="-1"><a class="header-anchor" href="#项目结构"><span>项目结构</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>|-.venv # python虚拟环境</span></span>
<span class="line"><span>|- .python-version # python版本</span></span>
<span class="line"><span>|- main.py</span></span>
<span class="line"><span>|- server.py</span></span>
<span class="line"><span>|- client.py</span></span>
<span class="line"><span>|- pyprohect.toml # 第三方库依赖</span></span>
<span class="line"><span>|- README.md</span></span>
<span class="line"><span>|- uv.lock</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="utils-sshmanager-py" tabindex="-1"><a class="header-anchor" href="#utils-sshmanager-py"><span>utils/sshManager.py</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import paramiko</span></span>
<span class="line"><span>import os</span></span>
<span class="line"><span>import sys</span></span>
<span class="line"><span>from typing import Optional</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class SSHManager:</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    SSH服务器管理类，提供连接、文件操作、命令执行等功能</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    def __init__(self):</span></span>
<span class="line"><span>        &quot;&quot;&quot;初始化SSH客户端&quot;&quot;&quot;</span></span>
<span class="line"><span>        self.client = paramiko.SSHClient()</span></span>
<span class="line"><span>        self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())</span></span>
<span class="line"><span>        self.sftp: Optional[paramiko.SFTPClient] = None</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>    def connect(self, hostname: str, port: int, username: str, password: str) -&gt; bool:</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        连接到SSH服务器</span></span>
<span class="line"><span>        Args:</span></span>
<span class="line"><span>            hostname: 服务器地址</span></span>
<span class="line"><span>            port: 端口号</span></span>
<span class="line"><span>            username: 用户名</span></span>
<span class="line"><span>            password: 密码</span></span>
<span class="line"><span>        Returns:</span></span>
<span class="line"><span>            bool: 连接是否成功</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            self.client.connect(</span></span>
<span class="line"><span>                hostname=hostname,</span></span>
<span class="line"><span>                port=port,</span></span>
<span class="line"><span>                username=username,</span></span>
<span class="line"><span>                password=password,</span></span>
<span class="line"><span>                timeout=10</span></span>
<span class="line"><span>            )</span></span>
<span class="line"><span>            # 尝试建立SFTP连接</span></span>
<span class="line"><span>            try:</span></span>
<span class="line"><span>                self.sftp = self.client.open_sftp()</span></span>
<span class="line"><span>                print(f&quot;成功连接到服务器 {hostname}:{port}&quot;)</span></span>
<span class="line"><span>                print(&quot;SFTP连接已建立&quot;)</span></span>
<span class="line"><span>                return True</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            except Exception as sftp_error:</span></span>
<span class="line"><span>                print(f&quot;SSH连接成功，但SFTP连接失败: {sftp_error}&quot;)</span></span>
<span class="line"><span>                self.client.close()</span></span>
<span class="line"><span>                return False</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        except Exception as e:</span></span>
<span class="line"><span>            print(f&quot;连接失败: {type(e).__name__}: {e}&quot;)</span></span>
<span class="line"><span>            return False</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def execute_command(self, command: str) -&gt; tuple:</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        在远程服务器上执行命令</span></span>
<span class="line"><span>        Args:</span></span>
<span class="line"><span>            command: 要执行的命令</span></span>
<span class="line"><span>        Returns:</span></span>
<span class="line"><span>            tuple: (标准输出, 标准错误, 返回码)</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            stdin, stdout, stderr = self.client.exec_command(command)</span></span>
<span class="line"><span>            output = stdout.read().decode(&#39;utf-8&#39;)</span></span>
<span class="line"><span>            error = stderr.read().decode(&#39;utf-8&#39;)</span></span>
<span class="line"><span>            return_code = stdout.channel.recv_exit_status()</span></span>
<span class="line"><span>            return output, error, return_code</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        except Exception as e:</span></span>
<span class="line"><span>            return &quot;&quot;, f&quot;执行命令失败: {e}&quot;, -1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def upload_file(self, local_path: str, remote_path: str) -&gt; bool:</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        上传本地文件到远程服务器</span></span>
<span class="line"><span>        Args:</span></span>
<span class="line"><span>            local_path: 本地文件路径</span></span>
<span class="line"><span>            remote_path: 远程文件路径</span></span>
<span class="line"><span>        Returns:</span></span>
<span class="line"><span>            bool: 上传是否成功</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            if not os.path.exists(local_path):</span></span>
<span class="line"><span>                print(f&quot;本地文件不存在: {local_path}&quot;)</span></span>
<span class="line"><span>                return False</span></span>
<span class="line"><span>            # 检查SFTP连接是否建立</span></span>
<span class="line"><span>            if self.sftp is None:</span></span>
<span class="line"><span>                print(&quot;SFTP连接未建立，请先成功连接到服务器&quot;)</span></span>
<span class="line"><span>                return False</span></span>
<span class="line"><span>            self.sftp.put(local_path, remote_path)</span></span>
<span class="line"><span>            print(f&quot;文件上传成功: {local_path} -&gt; {remote_path}&quot;)</span></span>
<span class="line"><span>            return True</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        except Exception as e:</span></span>
<span class="line"><span>            print(f&quot;文件上传失败: {type(e).__name__}: {e}&quot;)</span></span>
<span class="line"><span>            return False</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def download_file(self, remote_path: str, local_path: str) -&gt; bool:</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        从远程服务器下载文件到本地</span></span>
<span class="line"><span>        Args:</span></span>
<span class="line"><span>            remote_path: 远程文件路径</span></span>
<span class="line"><span>            local_path: 本地文件路径</span></span>
<span class="line"><span>        Returns:</span></span>
<span class="line"><span>            bool: 下载是否成功</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            # 检查SFTP连接是否建立</span></span>
<span class="line"><span>            if self.sftp is None:</span></span>
<span class="line"><span>                print(&quot;SFTP连接未建立，请先成功连接到服务器&quot;)</span></span>
<span class="line"><span>                return False</span></span>
<span class="line"><span>            self.sftp.get(remote_path, local_path)</span></span>
<span class="line"><span>            print(f&quot;文件下载成功: {remote_path} -&gt; {local_path}&quot;)</span></span>
<span class="line"><span>            return True</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        except Exception as e:</span></span>
<span class="line"><span>            print(f&quot;文件下载失败: {type(e).__name__}: {e}&quot;)</span></span>
<span class="line"><span>            return False</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def close(self):</span></span>
<span class="line"><span>        &quot;&quot;&quot;关闭SSH连接&quot;&quot;&quot;</span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            if self.sftp:</span></span>
<span class="line"><span>                self.sftp.close()</span></span>
<span class="line"><span>            self.client.close()</span></span>
<span class="line"><span>            print(&quot;连接已关闭&quot;)</span></span>
<span class="line"><span>        except Exception:</span></span>
<span class="line"><span>            pass</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="" tabindex="-1"><a class="header-anchor" href="#"><span></span></a></h4>`,13)]))}const t=n(l,[["render",p],["__file","linux-mcp.html.vue"]]),v=JSON.parse('{"path":"/python/linux-mcp.html","title":"","lang":"zh-CN","frontmatter":{"description":"基于mcp开发管理linux的mcp server 需求文档 基于mcp开发管理linux的mcp server 架构图 ![[Drawing 2025-08-27 10.06.30.excalidraw.png]] 项目 安装环境和库 项目结构 utils/sshManager.py","gitInclude":[],"head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/python/linux-mcp.html"}],["meta",{"property":"og:site_name","content":"lcc博客"}],["meta",{"property":"og:description","content":"基于mcp开发管理linux的mcp server 需求文档 基于mcp开发管理linux的mcp server 架构图 ![[Drawing 2025-08-27 10.06.30.excalidraw.png]] 项目 安装环境和库 项目结构 utils/sshManager.py"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"lcc\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[{"level":2,"title":"基于mcp开发管理linux的mcp server","slug":"基于mcp开发管理linux的mcp-server","link":"#基于mcp开发管理linux的mcp-server","children":[]},{"level":2,"title":"基于mcp开发管理linux的mcp server","slug":"基于mcp开发管理linux的mcp-server-1","link":"#基于mcp开发管理linux的mcp-server-1","children":[{"level":3,"title":"架构图","slug":"架构图","link":"#架构图","children":[]},{"level":3,"title":"项目","slug":"项目","link":"#项目","children":[]}]}],"readingTime":{"minutes":1.97,"words":591},"filePathRelative":"python/linux-mcp.md","excerpt":"<h2>基于mcp开发管理linux的mcp server</h2>\\n<p>需求文档</p>\\n<h2>基于mcp开发管理linux的mcp server</h2>\\n<h3>架构图</h3>\\n<p>![[Drawing 2025-08-27 10.06.30.excalidraw.png]]</p>\\n<h3>项目</h3>\\n<h4>安装环境和库</h4>\\n<div class=\\"language- line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"\\" data-title=\\"\\" style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code><span class=\\"line\\"><span>uv init -p 3.11</span></span>\\n<span class=\\"line\\"><span>uv venv -p 3.11</span></span>\\n<span class=\\"line\\"><span>uv add fastmcp paramiko httpx</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{t as comp,v as data};
