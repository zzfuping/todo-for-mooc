# Answer for the common questionnaire
 
## required

### 1. Devops culture

个人理解 Devops 文化讲求的是开发与运维的合作精神和团队意识。

我们做为开发人员，在开发时要考虑到运维方面问题，编码时考虑到可维护性，安全性，稳定性以及可扩展方面，
并且需要与运维人员做好沟通交流，合力更好地去完成项目的整体目标。

### 2. deadlock

死锁(deadlock）是在出现在多进程开发中，两个或多个进程出现相互等待资源而出现进程一直处于锁定状态的状况。

### 3. HTTP status

*注：以下将从 Django Restful api 的请求为例解释以下 HTTP 状态码。*

- 200 表示请求成功，例如在请求某个 Django api 获取数据列表时，正确返回了结果时便是 HTTP 200 OK 状态。
- 400 表示请求提交的内容服务器无法理解，例如提交 post 访问 api 新增一条信息，但某项不可为空的信息传递了一个空值时，服务器将会返回 HTTP 400 BAD REQUEST 状态。
- 401 表示未授权的访问，例如匿名访问用 django restframework 认证组件设置了身份认证的 api 时，服务器将返回 HTTP 401 UNAUTHRIZED 状态。
- 403 表示访问受限，例如请求一个设置了 permission_classes 的 api，而权限验证失败时服务器将返回一个 HTTP 403 FORBIDDEN 状态。
- 500 表示服务器内部出现了不可知的错误，例如某段程序抛出了未被处理异常时，服务器会直接返回 HTTP 500 INTERAL SERVER ERROR 状态。

### 4. complied and interpreted

解释型语言与编译型的最要大区别在于解释型语言不需编译过程而可直接执行，而编译型则必须编译后得到可执行文件才可执行。

编译型语言执行速度快，编译一次可永久执行，并且因为不用提供源码而更安全，
但因为编译生成的可执行文件都与平台相关的，所以跨平台、可移植性较差。

而解释型语言的缺点最明显的就是执行速度慢，
优点也比较明显就是跨平台，可移植性强，原因是因为不依赖于编译器。

### 5. SQL 

```sql

select task_id, task_name 
from tasks
inner from made_by on made_by.task_id = tasks.task_id 
where made_by.user_id = (
   select user_id from users 
   where user_name='Jane Doe' 
);

```

## optional

### 1 Docker Container and Virtual Machine

Docker 容器 和 虚拟机 的区别，前者是基于应用的隔离技术，而后者是基于操作系统（基础设施）的隔离技术。
 
 
## 写在最后

其他问题涉及的内容或技术目前还需要再努力学习一下。