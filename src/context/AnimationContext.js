import React, { createContext, useContext, useState } from 'react';

const AnimationContext = createContext();

export function AnimationProvider({ children }) {
  const [currentAnimation, setCurrentAnimation] = useState('sun');

  return (
    <AnimationContext.Provider value={{ currentAnimation, setCurrentAnimation }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  return useContext(AnimationContext);
}