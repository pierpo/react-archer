import React, { useCallback, useEffect, useRef, useState } from 'react';
import ArcherContainer from '../src/ArcherContainer/ArcherContainer';
import ArcherElement from '../src/ArcherElement/ArcherElement';
import Box from './components/Box';
import type { ArcherContainerHandle } from '../src/ArcherContainer/ArcherContainer.types';
import type { RelationType } from '../src/types';

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
};

const NODES: Node[] = [
  { id: 'a', label: 'Drag from my dot', x: 60, y: 40 },
  { id: 'b', label: 'Drop on me', x: 360, y: 70 },
  { id: 'c', label: 'Or me', x: 120, y: 280 },
  { id: 'd', label: 'Or me!', x: 420, y: 300 },
];

type Connection = { source: string; target: string };

// The id of the invisible 1×1 element that tracks the cursor while a connection
// is being drawn. The in-progress arrow points from the source node to it.
const CURSOR_ID = '__cursor';

const ConnectByDragging = () => {
  const archerRef = useRef<ArcherContainerHandle>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [connections, setConnections] = useState<Connection[]>([{ source: 'a', target: 'b' }]);

  // The connection currently being drawn (null when not dragging).
  const [sourceId, setSourceId] = useState<string | null>(null);
  // Cursor position in canvas coordinates — drives the temporary target element.
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  // The node the pointer is hovering over while dragging, used to highlight a
  // valid drop target. null when over empty canvas or the source itself.
  const [hoveredTargetId, setHoveredTargetId] = useState<string | null>(null);

  // Translate a screen point into coordinates relative to the canvas.
  const toCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  // Find the node under the given screen point, if any (used for drop targeting).
  // Pointer capture means events don't bubble through the boxes the pointer
  // passes over, so we hit-test the DOM directly instead.
  const nodeIdAtPoint = useCallback((clientX: number, clientY: number) => {
    const element = document.elementFromPoint(clientX, clientY);
    const nodeElement = element?.closest<HTMLElement>('[data-node-id]');
    return nodeElement?.dataset.nodeId ?? null;
  }, []);

  const handleHandlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>, node: Node) => {
      // Stop the box itself from doing anything and start drawing a connection.
      event.preventDefault();
      event.stopPropagation();
      // Pointer capture keeps move/up events flowing to the handle during a fast
      // drag. Guarded because it throws when there's no live pointer (e.g. when
      // events are dispatched synthetically in tests).
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // ignore — the drag still works without capture
      }
      setSourceId(node.id);
      setCursor(toCanvasCoords(event.clientX, event.clientY));
    },
    [toCanvasCoords],
  );

  // While a connection is being drawn, track the pointer on the window so the
  // drag still completes when the pointer leaves the canvas (or the window). A
  // release on empty space simply clears the in-progress arrow.
  useEffect(() => {
    if (!sourceId) return;

    const handleMove = (event: PointerEvent) => {
      setCursor(toCanvasCoords(event.clientX, event.clientY));

      const overId = nodeIdAtPoint(event.clientX, event.clientY);
      setHoveredTargetId(overId && overId !== sourceId ? overId : null);

      // Position only changed (not size), so the ResizeObserver won't fire —
      // re-measure manually so the in-progress arrow tracks the cursor.
      archerRef.current?.refreshScreen();
    };

    const handleUp = (event: PointerEvent) => {
      const targetId = nodeIdAtPoint(event.clientX, event.clientY);

      if (targetId && targetId !== sourceId) {
        // Each box has a single outgoing arrow: drawing a new one from this
        // source replaces whatever it pointed at before.
        setConnections((previous) => [
          ...previous.filter((connection) => connection.source !== sourceId),
          { source: sourceId, target: targetId },
        ]);
      }

      setSourceId(null);
      setHoveredTargetId(null);
    };

    const cancel = () => {
      setSourceId(null);
      setHoveredTargetId(null);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', cancel);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', cancel);
    };
  }, [sourceId, toCanvasCoords, nodeIdAtPoint]);

  const removeConnection = useCallback((connection: Connection) => {
    setConnections((previous) =>
      previous.filter(
        (existing) =>
          !(existing.source === connection.source && existing.target === connection.target),
      ),
    );
  }, []);

  return (
    <div style={{ height: '500px', margin: '50px' }}>
      <p style={{ marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>
        Drag from an output dot (right, blue) and drop onto another box to draw an arrow into its
        input dot (left). Redrawing from a box moves its arrow. Click an arrow to delete it.
      </p>

      <ArcherContainer ref={archerRef} strokeColor="#6366f1">
        <div
          ref={canvasRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '420px',
            touchAction: 'none',
          }}
        >
          {NODES.map((node) => {
            const relations: RelationType[] = connections
              .filter((connection) => connection.source === node.id)
              .map((connection) => ({
                targetId: connection.target,
                // Leave from the output dot (right edge) and land on the input
                // dot (left edge), so both ends attach to a visible connector.
                sourceAnchor: 'right',
                targetAnchor: 'left',
                domAttributes: {
                  onClick: () => removeConnection(connection),
                },
                cursor: 'pointer',
                hitSlop: 10,
              }));

            // While dragging from this node, also point a temporary arrow at the cursor.
            if (sourceId === node.id) {
              relations.push({
                targetId: CURSOR_ID,
                sourceAnchor: 'right',
                style: { strokeColor: '#ec4899', strokeDasharray: '5,5' },
              });
            }

            const isDropTarget = hoveredTargetId === node.id;

            return (
              <ArcherElement key={node.id} id={node.id} relations={relations}>
                <Box
                  data-node-id={node.id}
                  style={{
                    position: 'absolute',
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    userSelect: 'none',
                    borderColor: isDropTarget ? '#10b981' : undefined,
                    boxShadow: isDropTarget ? '0 0 0 2px #10b981' : undefined,
                  }}
                >
                  {node.label}

                  {/* Input dot (left edge) — where incoming arrows land. */}
                  <span
                    style={{
                      position: 'absolute',
                      left: '-6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: isDropTarget ? '#10b981' : '#cbd5e1',
                      border: '2px solid white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                  />

                  {/* Output dot (right edge) — drag from here to draw an arrow. */}
                  <span
                    onPointerDown={(event) => handleHandlePointerDown(event, node)}
                    title="Drag to connect"
                    style={{
                      position: 'absolute',
                      right: '-7px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: '#6366f1',
                      border: '2px solid white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      cursor: 'crosshair',
                      touchAction: 'none',
                    }}
                  />
                </Box>
              </ArcherElement>
            );
          })}

          {/* Invisible element that follows the cursor; the in-progress arrow targets it. */}
          {sourceId && (
            <ArcherElement id={CURSOR_ID}>
              <div
                style={{
                  position: 'absolute',
                  left: `${cursor.x}px`,
                  top: `${cursor.y}px`,
                  width: '1px',
                  height: '1px',
                  // Transparent to hit-testing: this element sits exactly under
                  // the pointer, so without this `elementFromPoint` would return
                  // it instead of the box being hovered/dropped onto.
                  pointerEvents: 'none',
                }}
              />
            </ArcherElement>
          )}
        </div>
      </ArcherContainer>
    </div>
  );
};

export default ConnectByDragging;
