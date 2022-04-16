import React, { useContext, useEffect } from 'react';
import { ArcherContainerContext } from '../ArcherContainer/ArcherContainer.context';
import { RelationType } from '../types';
import { useDeepCompareEffect } from '../utils/useDeepCompareEffect';
import { generateSourceToTarget, assertContextExists } from './ArcherElement.helpers';

type ArcherElementProps = {
  /**
   * The id that will identify the Archer Element. Should only contain alphanumeric characters and standard characters that you can find in HTML ids.
   */
  id: string;
  relations?: Array<RelationType>;
  children: React.ReactElement<React.ComponentProps<any>, any>;
};

const ArcherElement = ({ id, relations = [], children }: ArcherElementProps) => {
  const context = useContext(ArcherContainerContext);

  const registerTransitions = (newRelations: Array<RelationType>) => {
    const newSourceToTarget = generateSourceToTarget(id, newRelations);

    assertContextExists(context);

    context.registerTransitions(id, newSourceToTarget);
  };

  const unregisterTransitions = () => {
    assertContextExists(context);

    context.unregisterTransitions(id);
  };

  const onRefUpdate = (ref: HTMLElement | null | undefined) => {
    if (!ref) return;

    assertContextExists(context);

    context.registerChild(id, ref);
  };

  const unregisterChild = () => {
    assertContextExists(context);

    context.unregisterChild(id);
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
