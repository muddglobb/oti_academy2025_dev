export const fadeIn = {
  hidden: { 
    opacity: 0, 
    y: 90 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      delay: 0.2, 
      type: "tween" 
    }
  }
};

export const fadeInComp = {
  hidden: { 
    opacity: 0, 
    y: 90 
  },
  visible: (index: number) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 1, 
      delay: 0.2 * index, 
      type: "spring" 
    }
  })
};

export const slideInComp = {
  hidden: { 
    opacity: 0, 
    x: 90 
  },
  visible: (index: number) => ({ 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 1, 
      delay: 0.05 * index, 
      type: "spring" 
    }
  })
};