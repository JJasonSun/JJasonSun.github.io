> ### <font style="color:rgb(0, 0, 0);">核心逻辑</font>
> <font style="color:rgb(0, 0, 0);">uv 分为两种使用模式：</font>
>
> + <font style="color:rgb(0, 0, 0);">「项目模式」：默认用</font><font style="color:rgb(0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);">pyproject.toml</font>`<font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">管理依赖（适合需要打包、共享的项目）；</font>
> + <font style="color:rgb(0, 0, 0);">「无配置模式」：用 </font>`<font style="color:rgb(0, 0, 0);">uv pip</font>`<font style="color:rgb(0, 0, 0);"> 命令，完全兼容 pip 语法，不用任何配置文件（适合机器学习、快速实验类项目）。</font>
>
> `.venv + requirements.txt + uv pip install`
>

## 无 Python 安装 UV
### 在线一键脚本（最省事）
```powershell
# 1. 设置环境变量（注意末尾的斜杠不能少）
# export GITHUB_MIRROR=https://mirror.ghproxy.com/

# 2. 验证变量是否生效
# echo $GITHUB_MIRROR  # 应输出 https://mirror.ghproxy.com/

# 官方安装脚本会自动把可执行文件放到 ~/.cargo/bin 并写 PATH
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.cargo/env      # 让当前终端立即生效
uv --version             # 验证
```

```powershell
# 以管理员权限打开 PowerShell，执行
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
# 安装程序会把 uv.exe 放到 C:\Users\<你>\.local\bin
# 按提示把该目录加进 PATH 后，重新打开终端
uv --version
```

全程不需要 Python，脚本里已经附带对应平台的二进制包 。

### 离线手动下载（内网 / 机器没 curl）
1. 在能上网的电脑打开  
[https://github.com/astral-sh/uv/releases/latest](https://github.com/astral-sh/uv/releases/latest)  
根据系统下载对应压缩包，例如  
    - Windows 10+ 64bit  →  `uv-x86_64-pc-windows-msvc.zip`  
    - Linux x86_64       →  `uv-x86_64-unknown-linux-gnu.tar.gz`  
    - macOS Apple Silicon→  `uv-aarch64-apple-darwin.tar.gz`
2. 解压后得到单文件 `uv`（或 `uv.exe`），把它放到  
    - Windows：`C:\Users\<你>\.local\bin\`  
    - Linux/macOS：`~/.local/bin/`  或  `/usr/local/bin/`  
并确保该目录已在系统 PATH。
3. 终端执行  

```powershell
uv --version
```

装完就能直接管理 Python 版本与虚拟环境

```powershell
# 让 uv 自己下载一个 Python 解释器
uv python install 3.12

# 建虚拟环境
uv venv --python 3.12

# 装包
uv pip install requests

# 运行脚本
uv run python your_script.py
```

全程无需系统里先装 Python，uv 会自动下载所需解释器 。

---

## 初始化：为项目创建 .venv 虚拟环境
### 在项目根目录
```powershell
uv venv 
# 或者
uv venv --python 3.12 # 省略路径时，uv 默认使用 .venv 这个名字，即建在当前目录下的 .venv/ 里
# 或者 
uv venv --python 3.12 new_env # 把环境建在当前目录下的 new_env/ 文件夹里（名字任你取）
```

**说明：**

+ 这会在当前目录下新建一个 .venv（只对这个项目生效）。
+ 以后所有 Python 相关操作，都通过 `uv` 调用 .venv，不需要自己 `activate`。

### UV 虚拟环境的本质
:::color2
`<font style="background-color:rgba(255, 255, 255, 0);">uv</font>`<font style="background-color:rgba(255, 255, 255, 0);"> 创建的虚拟环境 </font>**<font style="background-color:rgba(255, 255, 255, 0);">不包含 Python 解释器本身</font>**<font style="background-color:rgba(255, 255, 255, 0);">，只记录了 </font>**<font style="background-color:rgba(255, 255, 255, 0);">绝对路径</font>**<font style="background-color:rgba(255, 255, 255, 0);"> 指向原来的解释器</font>

+ 如果使用`uv venv`，只要不带 --python <版本>，uv 就会按 `PATH` 顺序找系统里已安装的任何 Python（官方安装包、Miniconda、MS Store…都可），找到第一个就拿来用，在 `pyvenv.cf<font style="background-color:rgba(255, 255, 255, 0);">g</font>`<font style="background-color:rgba(255, 255, 255, 0);"> 里写下它的路径。这里不会触发下载，也不会去 uv 自己的“工具箱”里翻。</font>
+ <font style="background-color:rgba(255, 255, 255, 0);">如果使用</font>`<font style="background-color:rgba(255, 255, 255, 0);">uv venv --python 3.12</font>`<font style="background-color:rgba(255, 255, 255, 0);">，uv 会先看自己“工具箱”里有没有 </font>**<font style="background-color:rgba(255, 255, 255, 0);">通过 </font>**`**<font style="background-color:rgba(255, 255, 255, 0);">uv python install</font>**`**<font style="background-color:rgba(255, 255, 255, 0);"> 下载的 3.12</font>**<font style="background-color:rgba(255, 255, 255, 0);">（</font>`<font style="background-color:rgba(255, 255, 255, 0);">~/.local/share/uv/python/python-3.12.*</font>`<font style="background-color:rgba(255, 255, 255, 0);"> 或 Windows 的 </font>`<font style="background-color:rgba(255, 255, 255, 0);">%LOCALAPPDATA%\uv\data\python\...</font>`<font style="background-color:rgba(255, 255, 255, 0);">），如果找到了，就直接把虚拟环境指向这一份 </font>**<font style="background-color:rgba(255, 255, 255, 0);">便携版 3.12</font>**<font style="background-color:rgba(255, 255, 255, 0);">；找不到就自动去下载，再指向它。</font>
+ <font style="background-color:rgba(255, 255, 255, 0);">所以本质上</font>`<font style="background-color:rgba(255, 255, 255, 0);">uv</font>`<font style="background-color:rgba(255, 255, 255, 0);">在</font>`<font style="background-color:rgba(255, 255, 255, 0);">.venv</font>`<font style="background-color:rgba(255, 255, 255, 0);">里管理的只有当前项目的依赖包，而</font>`<font style="background-color:rgba(255, 255, 255, 0);">Python</font>`<font style="background-color:rgba(255, 255, 255, 0);">全部安装在</font>`<font style="background-color:rgba(255, 255, 255, 0);">UV</font>`<font style="background-color:rgba(255, 255, 255, 0);">统一管理的 Python 路径（</font>`<font style="background-color:rgba(255, 255, 255, 0);">%LOCALAPPDATA%\uv\data\python</font>`<font style="background-color:rgba(255, 255, 255, 0);">）中，</font>`<font style="background-color:rgba(255, 255, 255, 0);">uv</font>`<font style="background-color:rgba(255, 255, 255, 0);">会自动生成快捷方式来指向你想要的版本的</font>`<font style="background-color:rgba(255, 255, 255, 0);">Python</font>`

:::

---

## 安装和维护依赖（核心三件事）
### 首次安装依赖
直接用 `uv pip install` 往 .venv 里装包：

```powershell
uv pip install pymysql requests beautifulsoup4 neo4j
uv pip install -r requirements.txt
```

+ `uv` 会自动使用你刚才创建的 .venv，无需手动激活。

:::danger
`uv pip install` 只把包装进 **当前虚拟环境** 的 `site-packages` 目录，**不会** 动到那个“真正的”Python 解释器所在目录（比如 `C:\Python312\Lib\site-packages` 或 `/usr/local/lib/python3.12`）。  
换句话说：

+ 虚拟环境 → 独立仓库  
+ 系统 Python → 独立仓库

两边互不干扰；删掉虚拟环境，系统 Python 依旧干净（即使这个Python不是`uv`安装的）。

`<font style="background-color:rgba(255, 255, 255, 0);">.venv</font>`<font style="background-color:rgba(255, 255, 255, 0);"> 只保存</font>

+ <font style="background-color:rgba(255, 255, 255, 0);">一堆第三方包</font>
+ <font style="background-color:rgba(255, 255, 255, 0);">启动脚本（python → 指向某绝对路径）</font>
+ <font style="background-color:rgba(255, 255, 255, 0);">配置（pyvenv.cfg 里写明了“home = 原解释器路径”）</font>

:::

+ 安装完成后可以测试一下：

```powershell
uv run python -c "import pymysql, requests, bs4, neo4j; print('imports ok')"
```

**这也是使用 UV 跑一小段代码的方式**

### 导出或更新 requirements.txt
当你对依赖比较满意时，把当前环境“冻结”下来：

```powershell
uv pip freeze > requirements.txt
```

---

## 其他
### 要查看可用和已安装的 Python 版本
```powershell
uv python list
```

### 关于`uv python install`
`uv python install 3.12` 会到官方 CDN 把 **便携式（portable）CPython 3.12 可执行文件** 下载到：

+ Linux/macOS  
`~/.local/share/uv/python/python-3.12.*-<platform>/bin/python3.12`
+ Windows  
`%LOCALAPPDATA%\uv\data\python\python-3.12.*-<platform>\python.exe`

这个解释器 **只属于 uv 管理**，跟系统里已有的 Miniconda、Microsoft Store、官方安装包等完全隔离；  
以后用 `uv venv --python 3.12` 建虚拟环境时，uv 会让虚拟环境 **直接指向这份新下载的可执行文件**，而不再去系统里找。

:::danger
**<font style="background-color:rgba(255, 255, 255, 0);">所以说，即使使用</font>**`**<font style="background-color:rgba(255, 255, 255, 0);">uv venv --python 3.12</font>**`**<font style="background-color:rgba(255, 255, 255, 0);">和</font>**`**<font style="background-color:rgba(255, 255, 255, 0);">uv python install 3.12</font>**`**<font style="background-color:rgba(255, 255, 255, 0);">，</font>**`**<font style="background-color:rgba(255, 255, 255, 0);">uv</font>**`**<font style="background-color:rgba(255, 255, 255, 0);">实际上也是先把</font>**`**<font style="background-color:rgba(255, 255, 255, 0);">Python</font>**`**<font style="background-color:rgba(255, 255, 255, 0);">下到自己的目录，然后再在</font>**`**<font style="background-color:rgba(255, 255, 255, 0);">.venv</font>**`**<font style="background-color:rgba(255, 255, 255, 0);">里写一个指向这个</font>**`**<font style="background-color:rgba(255, 255, 255, 0);">Python</font>**`**<font style="background-color:rgba(255, 255, 255, 0);">的快捷方式。</font>**

1. `uv python install 3.12`  
→ 把**真正的 Python 可执行文件**解压到  
`%LOCALAPPDATA%\uv\data\python\cpython-3.12.x-...`（或 Linux/macOS 下的 `~/.local/share/uv/python/...`）。  
这一步与虚拟环境无关，只是往 uv 的“工具箱”里添一把螺丝刀。
2. `uv venv --python 3.12`  
→ 在 `.venv/` 里生成**启动脚本**和 `pyvenv.cfg`，内容大致  

`home = <上面那个目录>/bin`

随后 `python.exe`（或 `bin/python`）就是一条**相对/绝对路径的快捷方式**，运行时会去调用 1 中的真身。  
`.venv` 本身**不复制**任何 python.exe 或标准库文件，只装第三方包。

因此：  

+ 删 `.venv` 只是扔掉第三方包和那张“地图”，**真身还在工具箱**。  
+ 删 `uv python uninstall 3.12` 才会把工具箱里的真身卸掉；已建虚拟环境下次启动会提示找不到解释器，需重新安装或换版本。

:::

### 卸载 uv 中旧的 Python
1. `uv python list`
2. `uv python uninstall 3.12`

### 移动`.venv`
:::color2
可以放心把整个项目（含 `.venv`）剪切或复制到别处、另一台机器都行。  
原因：

1. `.venv` 里装的是 **完整的第三方包** 和 **启动脚本**，不再依赖“绝对路径纸条”。  
从 0.5.0 起，`uv` 默认生成 **“可重定位”** 虚拟环境，启动脚本会用相对路径找解释器。  
只要 `.venv` 旁边的 `pyvenv.cfg` 还在，它就能自己定位解释器。
2. 即使你把项目拷到 **没有 Python 的新电脑**，只要在那台机器上再执行一次 。**但是请注意，新机器不一定有对应路径的 Python 解释器**

uv python install <版本>   # 或让 uv 自动去下  
uv sync                    # 或 uv venv --python <版本>

就能重新链接到新的解释器，**原来装好的包依旧有效**，无需重新下载。

3. 删除也简单 —— 直接 `rm -rf .venv` / `rmdir /s /q .venv` 即可，无残留。

一句话：  
**项目连同 **`.venv`** 想搬就搬，uv 不会掉链子；只有解释器本身不在时，再让 uv 重新“指一下路”即可。**

:::



