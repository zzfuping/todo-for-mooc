# Answer for the python questionnaire

## Question One

### 1. functional

```python
add_func = lambda x, y: x + y

# test
print('1. functional')
print(f'1 + 2 = {add_func(1, 2)}')
```

### 2. object-oriented

```python
class MyInt(object):
    def __init__(self, val):
        self.val = val

    def __add__(self, num):
        if not isinstance(num, MyInt):
            raise TypeError('requires a \'MyInt\' object.')
        return self.val + num.val
        
# test
int_a = MyInt(1)
int_b = MyInt(2)

print(f'1 + 2 = {int_a + int_b}')
```

## Question Two

使用命令 `pip install pakage-name` 可直接安装指定依赖库的最新版。

另外也可以下载 whl 文件，再使用 `pip install /path/to/whl-file.whl` 来安装。

不使用 pip 则可以在 PyPi 或 Github 上下载依赖库的源码，然后用 python 执行 setup.py 相关命令来安装，命令示例如下：

```
python setup.py build
python setup.py install
```   

## Question Three

- 首先我会先导出整个数据库，做一个备份
- 然后再修改 Model，添加需要的新字段，添加时我将给字段设置一个默认值或设置 `null=True`
- 最后使用 manage.py 的相关命令对对应的模块做迁移处理，命令示例如下：

   ```
   manage.py makemigrations <model_name>
   manage.py migrate <model_name>
   ```

## Questions Four

在我的 python 开发经验中，主要是在上一家公司参加的 *虚拟桌面代理* 的项目（在简历中有该项目的简要描述），项目本身已成型，而我参与的后续的升级重构工作便是我最具挑战也是收获最多的经历。

该项目交付的第一个版本是相关库比较老旧，并且代码结构比较混乱的（说实在的，在接触该项目并做版本维护与迭代时实在够呛），而后 Leader 与我计划对该项目进行 升级（python 2.7 -> 3.6， Django 1.8.x -> 1.11.x）和重构，并探索了前后端开发分离的方案。

这次经历让我受益匪浅，在技术和能力得到相当的提高，解并熟悉了 python 3.6、 Django 1.11.x 的一些新变动和新特性。

在源码分析阅读能力、项目模块化结构概念上有一定的提高，也学习到了一些新的技术，如 python docstring 生成文档所使用到的 sphinx（尝试翻译出了一个版本的文档），学习到的前端框架 Vue.js 也我在前端方面省去了很多精力，另外还接触了新的比 VM 更好用的 Docker 技术，积累了一些环境搭建经验。 