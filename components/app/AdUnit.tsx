import React, { useEffect, useRef } from 'react';
import { AdBlock } from '../../types';

interface AdUnitProps {
  adBlock: AdBlock;
}

// Declare adsbygoogle on the Window object, ensuring it's an array for push commands
declare global {
  interface Window {
    adsbygoogle: unknown[]; 
  }
}

const AdUnit: React.FC<AdUnitProps> = ({ adBlock }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && adBlock.code) {
      // Clear any existing content to prevent duplicate ad units if component re-renders
      adRef.current.innerHTML = '';
      
      // Inject the <ins> tag
      adRef.current.innerHTML = adBlock.code;

      try {
        // Ensure window.adsbygoogle is initialized as an array
        // The AdSense script will later redefine this array with its push method
        // or process commands already pushed to it.
        window.adsbygoogle = window.adsbygoogle || [];
        
        // Push an empty object to trigger ad loading for this specific slot.
        // This is the most common and robust way to handle dynamic AdSense units.
        (window.adsbygoogle as any[]).push({}); 

        console.log('AdSense: Ad unit pushed successfully.', adBlock.id);
      } catch (e) {
        console.error('AdSense: Error pushing ad unit command for', adBlock.id, e);
      }
    }
    
    // Cleanup function:
    return () => {
      // On unmount, clear innerHTML of the ad slot.
      // This prevents issues if the same ad unit is re-rendered elsewhere.
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [adBlock.code]); // Re-run if the ad block code changes

  return (
    <div className="adsense-ad-container" ref={adRef}>
      {/* AdSense <ins> tag will be injected here */}
    </div>
  );
};

export default AdUnit;