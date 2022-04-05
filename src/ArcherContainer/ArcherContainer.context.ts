import React from 'react';
import { SourceToTargetType } from '../types';

export type ArcherContainerContextType = {
  registerChild: (id: string, element: HTMLElement) => void;
  registerTransitions: (id: string, sourceToTarget: SourceToTargetType[]) => void;
  unregisterChild: (id: string) => void;
  unregisterTransitions: (id: string) => void;
} | null;

export const ArcherContainerContext = React.createContext<ArcherContainerContextType>(null);
export const ArcherContainerContextProvider = ArcherContainerContext.Provider;
