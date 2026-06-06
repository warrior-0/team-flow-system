import type { Edge, Task } from '../types';

export function getConnectedTaskIds(tasks: Task[], edges: Edge[], selectedTaskId: string): Set<string> {
  if (!selectedTaskId) return new Set();
  const taskIds = new Set(tasks.map((task) => task.id));
  if (!taskIds.has(selectedTaskId)) return new Set();

  const adjacency = new Map(tasks.map((task) => [task.id, new Set<string>()]));
  edges.forEach((edge) => {
    if (adjacency.has(edge.from) && adjacency.has(edge.to)) {
      adjacency.get(edge.from)?.add(edge.to);
      adjacency.get(edge.to)?.add(edge.from);
    }
  });

  const visited = new Set([selectedTaskId]);
  const queue = [selectedTaskId];
  while (queue.length) {
    const current = queue.shift();
    if (!current) continue;
    adjacency.get(current)?.forEach((next) => {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    });
  }
  return visited;
}

export function getTaskSubgraph(tasks: Task[], edges: Edge[], selectedTaskId: string): { nodes: Task[]; edges: Edge[] } {
  const connectedIds = getConnectedTaskIds(tasks, edges, selectedTaskId);
  const nodes = tasks.filter((task) => connectedIds.has(task.id));
  const visibleIds = new Set(nodes.map((task) => task.id));
  return { nodes, edges: edges.filter((edge) => visibleIds.has(edge.from) && visibleIds.has(edge.to)) };
}
