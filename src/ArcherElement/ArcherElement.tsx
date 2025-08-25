import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../utils/useIsomorphicLayoutEffect';
import { ArcherContainerContext } from '../ArcherContainer/ArcherContainer.context';
import { RelationType } from '../types';
import { encodeId } from '../utils/encodeId';
import { useDeepCompareEffect } from '../utils/useDeepCompareEffect';
import { generateSourceToTarget, assertContextExists } from './ArcherElement.helpers';

type ArcherElementProps = {
  /**
   * The id that will identify the Archer Element.
   */
  id: string;
  relations?: Array<RelationType>;
  children: React.ReactElement<React.ComponentProps<any>, any>;
};

const ArcherElement = ({ id, relations = [], children }: ArcherElementProps) => {
  const encodedId = useMemo(() => encodeId(id), [id]);
  const context = useContext(ArcherContainerContext);
  const ref = useRef<HTMLElement | undefined>(undefined);

  const registerTransitions = useCallback(
    (newRelations: Array<RelationType>) => {
      const newSourceToTarget = generateSourceToTarget(encodedId, newRelations);

      assertContextExists(context);

      context.registerTransitions(encodedId, newSourceToTarget);
    },
    [context, encodedId],
  );

  const unregisterTransitions = useCallback(() => {
    assertContextExists(context);

    context.unregisterTransitions(encodedId);
  }, [context, encodedId]);

  const registerChild = useCallback(
    (newRef: HTMLElement | undefined) => {
      if (!newRef) return;

      assertContextExists(context);

      context.registerChild(encodedId, newRef);
    },
    [encodedId, context],
  );

  const unregisterChild = useCallback(() => {
    assertContextExists(context);

    context.unregisterChild(encodedId);
  }, [context, encodedId]);

  useIsomorphicLayoutEffect(() => {
    registerChild(ref.current);

    return () => unregisterChild();
  }, [registerChild, unregisterChild]);

  useDeepCompareEffect(() => {
    registerTransitions(relations);

    return () => unregisterTransitions();
  }, [registerTransitions, relations, unregisterTransitions]);

  // Check that we only have one child to ArcherElement
  React.Children.only(children);
  // Now, we'll render this child by getting its ref. The ref will be used to compute the element's position.
  // I'm pretty sure there's a cleaner way to get the ref of the child... feel free to suggest it!
  const child = children;
  return React.cloneElement(child, { ...child.props, ref });
};

export default ArcherElement;
