import type { Dispatch, SetStateAction } from 'react';
import { createId } from '../utils/id';
import type { MemberChanges, NewMember, Project, ProjectActions, Task, TaskChanges } from '../types';

const TASK_START_X = 48;
const TASK_START_Y = 48;
const TASK_COLUMN_GAP = 260;
const TASK_ROW_GAP = 190;
const TASK_COLUMNS = 3;

function getInitialTaskPosition(taskCount: number): Pick<Task, 'x' | 'y'> {
  return {
    x: TASK_START_X + (taskCount % TASK_COLUMNS) * TASK_COLUMN_GAP,
    y: TASK_START_Y + Math.floor(taskCount / TASK_COLUMNS) * TASK_ROW_GAP,
  };
}

export function createEmptyProject(name: string): Project {
  return { id: createId('project'), name: name.trim(), members: [], tasks: [], edges: [] };
}

export function createProjectActions(setProjects: Dispatch<SetStateAction<Project[]>>): ProjectActions {
  const updateProject = (projectId: string, updater: (project: Project) => Project) => {
    setProjects((projects) => projects.map((project) => (project.id === projectId ? updater(project) : project)));
  };

  return {
    addProject(name: string) {
      const project = createEmptyProject(name);
      setProjects((projects) => [project, ...projects]);
      return project.id;
    },
    deleteProject(projectId: string) {
      setProjects((projects) => projects.filter((project) => project.id !== projectId));
    },
    addMember(projectId: string, member: NewMember) {
      updateProject(projectId, (project) => ({ ...project, members: [...project.members, { id: createId('member'), ...member }] }));
    },
    updateMember(projectId: string, memberId: string, changes: MemberChanges) {
      updateProject(projectId, (project) => ({ ...project, members: project.members.map((member) => (member.id === memberId ? { ...member, ...changes } : member)) }));
    },
    deleteMember(projectId: string, memberId: string) {
      updateProject(projectId, (project) => ({
        ...project,
        members: project.members.filter((member) => member.id !== memberId),
        tasks: project.tasks.map((task) => (task.assigneeId === memberId ? { ...task, assigneeId: '' } : task)),
      }));
    },
    addTask(projectId: string, title: string) {
      const taskId = createId('task');
      updateProject(projectId, (project) => {
        const task: Task = { id: taskId, title: title.trim(), details: '', assigneeId: '', status: 'todo', checklist: [], ...getInitialTaskPosition(project.tasks.length) };
        return { ...project, tasks: [...project.tasks, task] };
      });
      return taskId;
    },
    updateTask(projectId: string, taskId: string, changes: TaskChanges) {
      updateProject(projectId, (project) => ({ ...project, tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, ...changes } : task)) }));
    },
    deleteTask(projectId: string, taskId: string) {
      updateProject(projectId, (project) => ({
        ...project,
        tasks: project.tasks.filter((task) => task.id !== taskId),
        edges: project.edges.filter((edge) => edge.from !== taskId && edge.to !== taskId),
      }));
    },
    addEdge(projectId: string, from: string, to: string) {
      if (!from || !to || from === to) return;
      updateProject(projectId, (project) => {
        const exists = project.edges.some((edge) => edge.from === from && edge.to === to);
        return exists ? project : { ...project, edges: [...project.edges, { id: createId('edge'), from, to }] };
      });
    },
    deleteEdge(projectId: string, edgeId: string) {
      updateProject(projectId, (project) => ({ ...project, edges: project.edges.filter((edge) => edge.id !== edgeId) }));
    },
    addChecklistItem(projectId: string, taskId: string, content: string) {
      const trimmedContent = content.trim();
      if (!trimmedContent) return;

      updateProject(projectId, (project) => ({
        ...project,
        tasks: project.tasks.map((task) => (
          task.id === taskId
            ? { ...task, checklist: [...task.checklist, { id: createId('checklist'), content: trimmedContent, done: false }] }
            : task
        )),
      }));
    },
    toggleChecklistItem(projectId: string, taskId: string, itemId: string) {
      updateProject(projectId, (project) => ({
        ...project,
        tasks: project.tasks.map((task) => (
          task.id === taskId
            ? { ...task, checklist: task.checklist.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item)) }
            : task
        )),
      }));
    },
    deleteChecklistItem(projectId: string, taskId: string, itemId: string) {
      updateProject(projectId, (project) => ({
        ...project,
        tasks: project.tasks.map((task) => (
          task.id === taskId
            ? { ...task, checklist: task.checklist.filter((item) => item.id !== itemId) }
            : task
        )),
      }));
    },
  };
}
