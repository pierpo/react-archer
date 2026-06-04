import React, { useCallback, useRef, useState } from 'react';
import ArcherContainer from '../src/ArcherContainer/ArcherContainer';
import ArcherElement from '../src/ArcherElement/ArcherElement';
import Box from './components/Box';
import type { ArcherContainerHandle } from '../src/ArcherContainer/ArcherContainer.types';

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
};

const INITIAL_NODES: Node[] = [
  { id: 'a', label: 'Drag me', x: 60, y: 40 },
  { id: 'b', label: 'And me', x: 320, y: 220 },
  { id: 'c', label: 'Me too', x: 90, y: 360 },
];

const RELATIONS = [
  { source: 'a', target: 'b' },
  { source: 'a', target: 'c' },
];

const useNodeDragAndDrop = ({
  initialNodes,
  onNodeMove,
}: {
  initialNodes: Node[];
  onNodeMove?: () => void;
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Offset between the pointer and the top-left corner of the node being dragged.
  const dragOffset = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>, node: Node) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    dragOffset.current = {
      x: event.clientX - canvasRect.left - node.x,
      y: event.clientY - canvasRect.top - node.y,
    };
    // Pointer capture keeps move/up events flowing to this element even if the
    // pointer leaves it during a fast drag.
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingId(node.id);
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingId) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      const x = event.clientX - canvasRect.left - dragOffset.current.x;
      const y = event.clientY - canvasRect.top - dragOffset.current.y;

      setNodes((previous) =>
        previous.map((node) => (node.id === draggingId ? { ...node, x, y } : node)),
      );

      // Let the consumer react to the move (e.g. re-measure arrows). The hook
      // stays unaware of what it's driving.
      onNodeMove?.();
    },
    [draggingId, onNodeMove],
  );

  const handlePointerUp = useCallback(() => {
    setDraggingId(null);
  }, []);

  return {
    canvasRef,
    nodes,
    draggingId,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
};

const EleventhExample = () => {
  const archerRef = useRef<ArcherContainerHandle>(null);

  // Moving a node only changes its position, not its size, so the
  // ArcherContainer's ResizeObserver doesn't fire — re-measure manually so the
  // arrows stay glued to the nodes as they move.
  const { canvasRef, nodes, draggingId, handlePointerDown, handlePointerMove, handlePointerUp } =
    useNodeDragAndDrop({
      initialNodes: INITIAL_NODES,
      onNodeMove: () => archerRef.current?.refreshScreen(),
    });

  return (
    <div
      style={{
        height: '500px',
        margin: '50px',
      }}
    >
      <ArcherContainer ref={archerRef} strokeColor="#6366f1">
        <div
          ref={canvasRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '460px',
          }}
        >
          {nodes.map((node) => {
            const relations = RELATIONS.filter((relation) => relation.source === node.id).map(
              (relation) => ({
                targetId: relation.target,
              }),
            );

            return (
              <ArcherElement key={node.id} id={node.id} relations={relations}>
                <Box
                  onPointerDown={(event) => handlePointerDown(event, node)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  style={{
                    position: 'absolute',
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    cursor: draggingId === node.id ? 'grabbing' : 'grab',
                    touchAction: 'none',
                    userSelect: 'none',
                  }}
                >
                  {node.label}
                </Box>
              </ArcherElement>
            );
          })}
        </div>
      </ArcherContainer>
    </div>
  );
};

export default EleventhExample;
