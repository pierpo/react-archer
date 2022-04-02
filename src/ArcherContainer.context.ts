import React from 'react';
import { SourceToTargetType } from './types';

export type ArcherContainerContextType = {
  registerChild: (arg0: string, arg1: HTMLElement) => void;
  registerTransitions: (arg0: string, arg1: SourceToTargetType[]) => void;
  unregisterChild: (arg0: string) => void;
  unregisterTransitions: (arg0: string) => void;
} | null;

export const ArcherContainerContext = React.createContext<ArcherContainerContextType>(null);
export const ArcherContainerContextProvider = ArcherContainerContext.Provider;
export const ArcherContainerContextConsumer = ArcherContainerContext.Consumer;
