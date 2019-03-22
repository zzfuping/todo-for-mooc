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
