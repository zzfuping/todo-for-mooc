# Answer for the common questionnaire
 
## required

### 1. Devops culture

个人理解 Devops 文化讲求的是开发与运维的合作精神和团队意识。

我们做为开发人员，在开发时要考虑到运维方面问题，编码时考虑到可维护性，安全性，稳定性以及可扩展方面，
并且需要与运维人员做好沟通交流，合力更好地去完成项目的整体目标。

### 2. deadlock

死锁(deadlock）是在出现在多进程开发中，两个或多个进程出现相互等待资源而出现进程一直处于锁定状态的状况。

### 3. HTTP status

- 200 
- 400
- 401
- 403
- 500

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
)
```


## optional

### 1 Docker Container and Virtual Machine

Docker 容器 和 虚拟机 的区别，前者是基于应用的隔离技术，而后者是基于操作系统（基础设施）的隔离技术。
 
 
## 写在最后

其他问题涉及的内容或技术目前还需要再努力学习一下。