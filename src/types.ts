export const PAGE_IDS = ['home', 'project', 'member', 'checklist'] as const;
export type PageId = (typeof PAGE_IDS)[number];

export const TASK_STATUSES = ['todo', 'doing', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type Member = {
  id: string;
  name: string;
  role: string;
};

export type ChecklistItem = {
  id: string;
  content: string;
  done: boolean;
};

export type Task = {
  id: string;
  title: string;
  details: string;
  assigneeId: string;
  status: TaskStatus;
  x: number;
  y: number;
  checklist: ChecklistItem[];
};

export type Edge = {
  id: string;
  from: string;
  to: string;
};

export type Project = {
  id: string;
  name: string;
  members: Member[];
  tasks: Task[];
  edges: Edge[];
};

export type NewMember = Omit<Member, 'id'>;
export type MemberChanges = Partial<NewMember>;
export type TaskChanges = Partial<Omit<Task, 'id'>>;

export type ProjectActions = {
  addProject(name: string): string;
  deleteProject(projectId: string): void;
  addMember(projectId: string, member: NewMember): void;
  updateMember(projectId: string, memberId: string, changes: MemberChanges): void;
  deleteMember(projectId: string, memberId: string): void;
  addTask(projectId: string, title: string): string;
  updateTask(projectId: string, taskId: string, changes: TaskChanges): void;
  deleteTask(projectId: string, taskId: string): void;
  addEdge(projectId: string, from: string, to: string): void;
  deleteEdge(projectId: string, edgeId: string): void;
  addChecklistItem(projectId: string, taskId: string, content: string): void;
  toggleChecklistItem(projectId: string, taskId: string, itemId: string): void;
  deleteChecklistItem(projectId: string, taskId: string, itemId: string): void;
};

export type ProjectData = { projects: Project[] } & ProjectActions;

export type MemberViewState = {
  projectId: string;
  memberId: string;
  taskId: string;
};
