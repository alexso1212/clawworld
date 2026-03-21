你好，我是 Clawworld 像素美术总监。

收到关于“任务世界（Task World）”的改版需求。我们不能把它做成一个枯燥的“任务列表”，它必须是主大厅“温馨办公室”风格的深度延伸——如果说大厅是“家”，任务世界就是“战情室”与“工坊”的结合体。

以下是针对工程师可执行的 **《Clawworld 任务世界：像素工坊美术方向文档》**。

---

### A. 总改造原则：从“面板”到“副本”

1.  **空间逻辑：项目即实体**
    任务世界不再是一个展示信息的页面，而是一个**“正在运转的重型项目加工厂”**。所有的任务数据必须通过“纸质文件”、“软盘”、“传输带”和“大型机柜”来表达。
2.  **材质统一：木材、橡胶与琥珀色光**
    延续主大厅的暖色调。地板应为深色木质或工业橡胶垫，家具以胡桃木和复古金属架为主。拒绝任何蓝光赛博感，所有的屏幕显示应为**琥珀色或翠绿色的单色 CRT 质感**。
3.  **动态叙事：有人正在处理**
    场景中必须有“项目正在进行”的痕迹：冒烟的咖啡杯、满地的电缆、正在自动打印的色带、甚至是可以踢开的废弃纸团。

---

### B. 概念图提示词 (Concept Art Prompts)

#### 1. 任务世界总视图：战略战情室
*   **用途：** 确定整体色调、空间纵深与光影基调。
*   **主提示词：** 2.5D isometric pixel art, top-down view of a cozy but busy project war room, warm amber lighting, large wooden tactical table in center, walls covered with corkboards and red strings, cluttered floor with heavy power cables, indoor plants in corners, soft sunlight hitting from high windows.
*   **负面提示词：** Sci-fi blue, holographic, clean laboratory, flowchart, white walls, minimalist, 3D render.
*   **构图重点：** 以“Reception”为入口，所有区域呈放射状或线性流水线排布，中央是巨大的项目沙盘。
*   **必须出现的物件：** 缠绕电缆的中心支柱、大型软木板、散落的草稿纸。

#### 2. 执行工坊/审查区近景：代码熔炉
*   **用途：** 定义核心交互区域的细节细节。
*   **主提示词：** Close-up pixel art, 2.5D, an intensive coding workshop, row of vintage CRT monitors showing amber code snippets, mechanical keyboards, messy desks with energy drink cans and soldering irons, a red "REVIEW" lighthouse lamp spinning on a metal cabinet.
*   **负面提示词：** Modern laptops, flat screens, empty desks, futuristic UI.
*   **构图重点：** 强调“工位”的拥挤感。Review 区域应有一个像老式照相机暗房一样的红色警戒灯。
*   **必须出现的物件：** 堆叠的机箱、跳动的示波器、散乱的软盘。

#### 3. 记忆档案/交付轨道近景：成果归宿
*   **用途：** 定义任务完成后的视觉反馈。
*   **主提示词：** Pixel art, 2.5D, a high-ceiling archive room, floor-to-ceiling wooden bookshelves filled with glowing golden folders, a pneumatic tube transport system delivering golden capsules, warm library atmosphere.
*   **负面提示词：** Cold metal lockers, digital cloud icon, empty shelves.
*   **构图重点：** 纵深感。输送管道（Pneumatic Tubes）从天花板延伸下来，象征任务被“发送”到云端。
*   **必须出现的物件：** 气压传输管道、金色的归档标签、梯子。

---

### C. 场景整改清单（工程师执行手册）

1.  **【地板替换】** 将当前的 `grid` 背景替换为带有纹理的“复古拼接木地板”或“带划痕的工业橡胶垫”。
2.  **【区域边界】** 禁止使用单纯的线条划分区域，改用“矮柜”、“盆栽”或“不同颜色的地毯”进行物理分割。
3.  **【路标系统】** 所有的区域名称（如 Requirements Room）必须写在**挂在天花板下的木质告示牌**上，或者立在地面上的**小黑板**上。
4.  **【交互物件化】** “领取任务”的行为，应设计为从“Reception”的**老式打字机**上撕下一张纸条。
5.  **【动态背景】** 在 Execution Workshop 增加常驻的“电火花”像素动画，或正在旋转的“排气扇”。
6.  **【路径引导】** 在地面上绘制“明线电缆”，电缆的流向即是项目从 Requirements 到 Review 的物理流向。
7.  **【环境遮挡】** 在屏幕最前方（Canvas 层级最高处）增加一层半透明的“暖色暗角”滤镜，模拟昏暗室内的氛围感。
8.  **【动态阴影】** 所有区域的物件必须拥有统一的 45 度投影，增强 2.5D 的厚度感。
9.  **【角色定位】** Amane 的工位（Amane Desk）必须是场景中最乱、咖啡杯最多的地方，且配有一台巨大的服务器。
10. **【交付动画】** 任务完成时，不要弹窗提示“Success”，而是展示一个**金色胶囊通过管道被吸走**的动画。

---

### D. 文字减量与符号表达规则

为了保持“游戏感”，必须大幅削减 UI 文字，将其转化为环境信息：

| 原始文字标签 | 视觉转化建议 | 状态表达方式 |
| :--- | :--- | :--- |
| **"In Progress"** | 消失。改为一个**正在冒烟/震动**的机器或工位。 | 烟雾频率越高，代表负载越高。 |
| **"Review Pending"** | 消失。改为工位上方闪烁的**红色工业警报灯**。 | 灯亮代表有待办，灯灭代表清空。 |
| **"Project ID: #123"** | 改为钉在墙上的**便签纸**或桌上的**文件夹**。 | 只在鼠标悬停（Hover）时显示完整数字。 |
| **"Completed"** | 改为柜子里的一张**金色奖章**或档案盒。 | 柜子里的档案越多，成就感越强。 |
| **"Requirements"** | 改为贴满**乱七八糟草图和照片的软木板**。 | 不需要文字，玩家一看就知道这里是策划区。 |
| **"Memory Archive"** | 改为**书架或旧磁带柜**。 | 磁带盒上的颜色代表项目类型。 |

---

**总监寄语：**
工程师们，请记住：**如果一个信息能用一个像素物件表达，就不要用一个 Label。** 我们要做的不是一个任务管理器，而是一个让开发者感到“我正在这个温馨的办公室里改变世界”的虚拟空间。

开始动工吧！
