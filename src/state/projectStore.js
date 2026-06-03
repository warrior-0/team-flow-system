import { createId } from '../utils/id';

export function createEmptyProject(name) {
  return { id: createId('project'), name: name.trim(), members: [], tasks: [], edges: [] };
}

export function createProjectActions(setProjects) {
  const updateProject = (projectId, updater) => {
    setProjects((projects) => projects.map((project) => (project.id === projectId ? updater(project) : project)));
  };

  return {
    addProject(name) {
      const project = createEmptyProject(name);
      setProjects((projects) => [project, ...projects]);
      return project.id;
    },
    deleteProject(projectId) {
      setProjects((projects) => projects.filter((project) => project.id !== projectId));
    },
    addMember(projectId, member) {
      updateProject(projectId, (project) => ({ ...project, members: [...project.members, { id: createId('member'), ...member }] }));
    },
    updateMember(projectId, memberId, changes) {
      updateProject(projectId, (project) => ({ ...project, members: project.members.map((member) => (member.id === memberId ? { ...member, ...changes } : member)) }));
    },
    deleteMember(projectId, memberId) {
      updateProject(projectId, (project) => ({
        ...project,
        members: project.members.filter((member) => member.id !== memberId),
        tasks: project.tasks.map((task) => (task.assigneeId === memberId ? { ...task, assigneeId: '' } : task)),
      }));
    },
    addTask(projectId, title) {
      const task = { id: createId('task'), title: title.trim(), details: '', assigneeId: '', status: 'todo' };
      updateProject(projectId, (project) => ({ ...project, tasks: [...project.tasks, task] }));
      return task.id;
    },
    updateTask(projectId, taskId, changes) {
      updateProject(projectId, (project) => ({ ...project, tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, ...changes } : task)) }));
    },
    deleteTask(projectId, taskId) {
      updateProject(projectId, (project) => ({
        ...project,
        tasks: project.tasks.filter((task) => task.id !== taskId),
        edges: project.edges.filter((edge) => edge.from !== taskId && edge.to !== taskId),
      }));
    },
    addEdge(projectId, from, to) {
      if (!from || !to || from === to) return;
      updateProject(projectId, (project) => {
        const exists = project.edges.some((edge) => edge.from === from && edge.to === to);
        return exists ? project : { ...project, edges: [...project.edges, { id: createId('edge'), from, to }] };
      });
    },
    deleteEdge(projectId, edgeId) {
      updateProject(projectId, (project) => ({ ...project, edges: project.edges.filter((edge) => edge.id !== edgeId) }));
    },
  };
}
