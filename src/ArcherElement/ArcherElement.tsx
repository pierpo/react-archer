import React, { useContext, useEffect, useMemo } from 'react';
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

  const registerTransitions = (newRelations: Array<RelationType>) => {
    const newSourceToTarget = generateSourceToTarget(encodedId, newRelations);

    assertContextExists(context);

    context.registerTransitions(encodedId, newSourceToTarget);
  };

  const unregisterTransitions = () => {
    assertContextExists(context);

    context.unregisterTransitions(encodedId);
  };

  const onRefUpdate = (ref: HTMLElement | null | undefined) => {
    if (!ref) return;

    assertContextExists(context);

    context.registerChild(encodedId, ref);
  };

  const unregisterChild = () => {
    assertContextExists(context);

    context.unregisterChild(encodedId);
  };

  useEffect(() => {
    const unsubscribe = () => {
      unregisterChild();
      unregisterTransitions();
    };

    if (relations.length === 0) {
      return unsubscribe;
    }

    registerTransitions(relations);

    return unsubscribe;
  }, []);

  useDeepCompareEffect(() => {
    if (relations.length === 0) {
      // TODO is that correct? It feels like the useEffect should unsubscribe the changes... Might still work though
      return;
    }

    registerTransitions(relations);
  }, [relations]);

  // Check that we only have one child to ArcherElement
  React.Children.only(children);
  // Now, we'll render this child by getting its ref. The ref will be used to compute the element's position.
  // I'm pretty sure there's a cleaner way to get the ref of the child... feel free to suggest it!
  const child = children;
  return React.cloneElement(child, { ...child.props, ref: onRefUpdate });
};

export default ArcherElement;
