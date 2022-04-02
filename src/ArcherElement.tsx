import React, { useContext, useEffect } from 'react';
import { ArcherContainerContext } from './ArcherContainer';
import { RelationType, SourceToTargetType } from './types';
import { useDeepCompareEffect } from './utils/useDeepCompareEffect';

type ArcherElementProps = {
  /**
   * The id that will identify the Archer Element. Should only contain alphanumeric characters and standard characters that you can find in HTML ids.
   */
  id: string;
  relations?: Array<RelationType>;
  children: React.ReactElement<React.ComponentProps<any>, any>;
};

export const ArcherElement = ({ id, relations = [], children }: ArcherElementProps) => {
  const context = useContext(ArcherContainerContext);

  const registerTransitions = (newRelations: Array<RelationType>) => {
    const newSourceToTarget = generateSourceToTarget(newRelations);

    if (!context || (context && !context.registerTransitions)) {
      throw new Error(
        `Could not find "registerTransition" in the context of ` +
          `<ArcherElement>. Wrap the component in a <ArcherContainer>.`,
      );
    }

    context.registerTransitions(id, newSourceToTarget);
  };

  const generateSourceToTarget = (relations: Array<RelationType>): Array<SourceToTargetType> => {
    return relations.map(
      ({ targetId, sourceAnchor, targetAnchor, label, style, order = 0 }: RelationType) => ({
        source: {
          id,
          anchor: sourceAnchor,
        },
        target: {
          id: targetId,
          anchor: targetAnchor,
        },
        label,
        style,
        order,
      }),
    );
  };

  const unregisterTransitions = () => {
    if (!context || (context && !context.unregisterTransitions)) {
      throw new Error(
        `Could not find "unregisterTransitions" in the context of ` +
          `<ArcherElement>. Wrap the component in a <ArcherContainer>.`,
      );
    }

    context.unregisterTransitions(id);
  };

  const onRefUpdate = (ref: HTMLElement | null | undefined) => {
    if (!ref) return;

    if (!context || (context && !context.registerChild)) {
      throw new Error(
        `Could not find "registerChild" in the context of ` +
          `<ArcherElement>. Wrap the component in a <ArcherContainer>.`,
      );
    }

    context.registerChild(id, ref);
  };

  const unregisterChild = () => {
    if (!context || (context && !context.unregisterChild)) {
      throw new Error(
        `Could not find "unregisterChild" in the context of ` +
          `<ArcherElement>. Wrap the component in a <ArcherContainer>.`,
      );
    }

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
