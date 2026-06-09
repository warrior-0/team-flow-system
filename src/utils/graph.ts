import type { Edge, Task } from '../types';

export function getConnectedTaskIds(
  tasks: Task[],
  edges: Edge[],
  selectedTaskId: string,
): Set<string> {
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

export function getTaskSubgraph(
  tasks: Task[],
  edges: Edge[],
  selectedTaskId: string,
): { nodes: Task[]; edges: Edge[] } {
  const connectedIds = getConnectedTaskIds(tasks, edges, selectedTaskId);
  const nodes = tasks.filter((task) => connectedIds.has(task.id));
  const visibleIds = new Set(nodes.map((task) => task.id));
  return {
    nodes,
    edges: edges.filter(
      (edge) => visibleIds.has(edge.from) && visibleIds.has(edge.to),
    ),
  };
}

type EdgePathOptions = {
  nodeWidth: number;
  nodeHeight: number;
};

type Point = {
  x: number;
  y: number;
};

type Port = Point & {
  directionX: number;
  directionY: number;
};

const MIN_CONTROL_DISTANCE = 96;
const REVERSE_EDGE_OFFSET = 72;

function getCenter(task: Task, nodeWidth: number, nodeHeight: number): Point {
  return { x: task.x + nodeWidth / 2, y: task.y + nodeHeight / 2 };
}

function getPorts(
  from: Task,
  to: Task,
  { nodeWidth, nodeHeight }: EdgePathOptions,
): { start: Port; end: Port } {
  const fromCenter = getCenter(from, nodeWidth, nodeHeight);
  const toCenter = getCenter(to, nodeWidth, nodeHeight);
  const deltaX = toCenter.x - fromCenter.x;
  const deltaY = toCenter.y - fromCenter.y;

  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    const direction = deltaX >= 0 ? 1 : -1;
    return {
      start: {
        x: fromCenter.x + (direction * nodeWidth) / 2,
        y: fromCenter.y,
        directionX: direction,
        directionY: 0,
      },
      end: {
        x: toCenter.x - (direction * nodeWidth) / 2,
        y: toCenter.y,
        directionX: -direction,
        directionY: 0,
      },
    };
  }

  const direction = deltaY >= 0 ? 1 : -1;
  return {
    start: {
      x: fromCenter.x,
      y: fromCenter.y + (direction * nodeHeight) / 2,
      directionX: 0,
      directionY: direction,
    },
    end: {
      x: toCenter.x,
      y: toCenter.y - (direction * nodeHeight) / 2,
      directionX: 0,
      directionY: -direction,
    },
  };
}

function getBendOffset(edge: Edge, edges: Edge[]): number {
  const hasReverseEdge = edges.some(
    (item) => item.from === edge.to && item.to === edge.from,
  );

  // 양방향 엣지가 있는 경우에만 오프셋을 적용하여 서로 겹치지 않게 함
  if (hasReverseEdge) return REVERSE_EDGE_OFFSET;

  return 0;
}

export function createEdgeBezierPath(
  from: Task,
  to: Task,
  edge: Edge,
  edges: Edge[],
  options: EdgePathOptions,
): string {
  const { start, end } = getPorts(from, to, options);
  const distance = Math.max(
    Math.hypot(end.x - start.x, end.y - start.y) * 0.38,
    MIN_CONTROL_DISTANCE,
  );

  // 수정된 getBendOffset 호출 (불필요한 인자 from, to 제거)
  const bendOffset = getBendOffset(edge, edges);

  const normalX =
    -(end.y - start.y) /
    Math.max(Math.hypot(end.x - start.x, end.y - start.y), 1);
  const normalY =
    (end.x - start.x) /
    Math.max(Math.hypot(end.x - start.x, end.y - start.y), 1);

  const controlStartX =
    start.x + start.directionX * distance + normalX * bendOffset;
  const controlStartY =
    start.y + start.directionY * distance + normalY * bendOffset;
  const controlEndX = end.x + end.directionX * distance + normalX * bendOffset;
  const controlEndY = end.y + end.directionY * distance + normalY * bendOffset;

  return `M ${start.x} ${start.y} C ${controlStartX} ${controlStartY}, ${controlEndX} ${controlEndY}, ${end.x} ${end.y}`;
}
