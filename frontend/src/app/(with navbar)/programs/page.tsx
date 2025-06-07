"use client"

import React, { useEffect } from "react";
import ProgramsPage from "@/components/programs/programs-page";

const Page = () => {
  useEffect(() => {
    // Handle hash navigation after page load
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        // Remove the '#' from hash
        const elementId = hash.substring(1);
        const element = document.getElementById(elementId);
        
        if (element) {
          // Add a small delay to ensure the page is fully rendered
          setTimeout(() => {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }, 100);
        }
      }
    };

    // Run on mount
    handleHashScroll();

    // Also listen for hash changes (if user manually changes the hash)
    window.addEventListener('hashchange', handleHashScroll);

    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, []);

  return (
    <div
      className="     
      relative 
      "
    >
      <ProgramsPage></ProgramsPage>
    </div>
  );
};

export default Page;
