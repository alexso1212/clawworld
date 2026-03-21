export type WorkerSpriteId = 'dispatcher' | 'executor' | 'auditor'

export type FurnitureSpriteId =
  | 'task-board'
  | 'meeting-whiteboard'
  | 'boss-whiteboard'
  | 'desk-cluster'
  | 'archive-cabinet'
  | 'tea-bar'
  | 'finance-safe'
  | 'tool-locker'
  | 'requirements-desk'
  | 'planning-table'
  | 'execution-workbench'
  | 'review-pedestal'
  | 'memory-archive'

export type PixelSpriteSpec = {
  key: string
  size: {
    width: number
    height: number
  }
  frames: string[]
  silhouette: string
  palette: string
  replacesLabel?: string
}

const WORKER_SPECS: Record<WorkerSpriteId, PixelSpriteSpec> = {
  dispatcher: {
    key: 'char-amane-dispatcher',
    size: { width: 24, height: 32 },
    frames: ['idle', 'moving', 'reporting'],
    silhouette: '高马尾、耳机和夹板构成偏直立的调度员轮廓。',
    palette: '暖白衬衫、海军蓝背心、深发色和米黄夹板。',
    replacesLabel: 'Amane / Dispatcher',
  },
  executor: {
    key: 'char-executor-worker',
    size: { width: 24, height: 32 },
    frames: ['idle', 'moving', 'reporting'],
    silhouette: '卷袖、前倾姿态和手持平板构成执行型职员轮廓。',
    palette: '灰白衬衫、柔和青绿色上衣、棕色裤装和橙色设备点缀。',
    replacesLabel: 'Executor',
  },
  auditor: {
    key: 'char-auditor-reviewer',
    size: { width: 24, height: 32 },
    frames: ['idle', 'moving', 'reporting'],
    silhouette: '矩形眼镜、硬挺外套和手中夹板/杯子构成审核员轮廓。',
    palette: '炭灰西装、浅灰头发、亮绿色领带和米白色杯具高光。',
    replacesLabel: 'Auditor / Reviewer',
  },
}

const FURNITURE_SPECS: Record<FurnitureSpriteId, PixelSpriteSpec> = {
  'task-board': {
    key: 'prop-task-board',
    size: { width: 64, height: 48 },
    frames: ['idle', 'busy'],
    silhouette: '带轮支架的宽软木任务板，面上贴满便签和纸条。',
    palette: '软木棕、亮黄色和珊瑚橙便签，少量青绿色工单。',
    replacesLabel: 'Task Board',
  },
  'meeting-whiteboard': {
    key: 'prop-meeting-whiteboard',
    size: { width: 48, height: 32 },
    frames: ['idle', 'active'],
    silhouette: '金属支架上的会议白板，带粗折线和马克笔槽。',
    palette: '奶白板面、冷灰支架、砖红与青绿流程线。',
    replacesLabel: 'Meeting Room Whiteboard',
  },
  'boss-whiteboard': {
    key: 'prop-boss-whiteboard',
    size: { width: 48, height: 32 },
    frames: ['idle', 'active'],
    silhouette: '木框落地白板，旁边挂着伞和总控便签。',
    palette: '深木框、乳白板面、金黄色重点标记。',
    replacesLabel: 'Boss Office Whiteboard',
  },
  'desk-cluster': {
    key: 'prop-desk-cluster',
    size: { width: 48, height: 32 },
    frames: ['idle', 'busy'],
    silhouette: 'L 型工位拼接，带亮屏显示器和咖啡杯。',
    palette: '浅木桌面、黑色显示器、柔蓝屏幕和暖橙椅子。',
  },
  'archive-cabinet': {
    key: 'prop-archive-cabinet',
    size: { width: 32, height: 48 },
    frames: ['closed', 'open'],
    silhouette: '四层抽屉式高档案柜，带标签槽和把手。',
    palette: '橄榄绿柜体、浅米色标签、黄铜把手。',
  },
  'tea-bar': {
    key: 'prop-tea-bar',
    size: { width: 48, height: 32 },
    frames: ['idle', 'steaming'],
    silhouette: '带热水壶、杯子和盆栽的小茶水台。',
    palette: '奶油台面、深色咖啡机、白色蒸汽和陶土花盆。',
  },
  'finance-safe': {
    key: 'prop-finance-safe',
    size: { width: 32, height: 32 },
    frames: ['healthy', 'warning'],
    silhouette: '小型保险柜/财务箱，顶部带状态灯。',
    palette: '深色金属、金黄色钱币堆、红色告警灯。',
    replacesLabel: 'Finance Warning',
  },
  'tool-locker': {
    key: 'prop-tool-locker',
    size: { width: 32, height: 48 },
    frames: ['closed', 'open'],
    silhouette: '多层工具柜，柜门上挂扳手，打开时能看到抽屉。',
    palette: '工业蓝柜体、灰色抽屉、米色工具标签。',
    replacesLabel: 'Tool Locker',
  },
  'requirements-desk': {
    key: 'node-requirements-desk',
    size: { width: 32, height: 32 },
    frames: ['idle', 'processing'],
    silhouette: '堆满草图纸和卷宗的低矮需求桌。',
    palette: '深木桌、奶白纸张、青绿色夹子。',
    replacesLabel: 'Requirements Room',
  },
  'planning-table': {
    key: 'node-planning-table',
    size: { width: 48, height: 32 },
    frames: ['idle', 'projecting'],
    silhouette: '圆形计划桌，中间有琥珀色投影镜头。',
    palette: '胡桃木桌面、琥珀色中心光、米白图纸。',
    replacesLabel: 'Planning Room',
  },
  'execution-workbench': {
    key: 'node-execution-workbench',
    size: { width: 48, height: 48 },
    frames: ['idle', 'active'],
    silhouette: '重型工作台，挂着工具，台面有显示器和零件。',
    palette: '铸铁灰、警示黄边、柔蓝屏幕光和橙色工具。',
    replacesLabel: 'Execution Workshop',
  },
  'review-pedestal': {
    key: 'node-review-pedestal',
    size: { width: 32, height: 32 },
    frames: ['neutral', 'pass', 'fail'],
    silhouette: '带大圆形扫描面板的审查底座。',
    palette: '金属灰底座、乳白扫描面、绿/红状态环。',
    replacesLabel: 'Review Checkpoint',
  },
  'memory-archive': {
    key: 'node-memory-archive',
    size: { width: 32, height: 32 },
    frames: ['empty', 'storing'],
    silhouette: '铜座玻璃记忆罐，内部发出柔和光。',
    palette: '铜色底座、靛蓝玻璃、淡紫色内芯。',
    replacesLabel: 'Memory Archive',
  },
}

export function getWorkerSpriteSpec(id: WorkerSpriteId) {
  return WORKER_SPECS[id]
}

export function getFurnitureSpriteSpec(id: FurnitureSpriteId) {
  return FURNITURE_SPECS[id]
}

export function getAllWorkerSpriteSpecs() {
  return WORKER_SPECS
}

export function getAllFurnitureSpriteSpecs() {
  return FURNITURE_SPECS
}
