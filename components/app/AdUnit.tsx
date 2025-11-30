import React, { useEffect, useRef } from 'react';
import { AdBlock } from '../../types';

interface AdUnitProps {
  adBlock: AdBlock;
}

// Declare adsbygoogle on the Window object
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const AdUnit: React.FC<AdUnitProps> = ({ adBlock }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && adBlock.code) {
      // Clear any existing content
      adRef.current.innerHTML = '';
      
      // Inject the <ins> tag
      adRef.current.innerHTML = adBlock.code;

      // Push to adsbygoogle queue to load the ad
      try {
        if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } else {
          console.warn('AdSense script not loaded or adsbygoogle.push is not a function.');
        }
      } catch (e) {
        console.error('Error pushing AdSense ad:', e);
      }
    }
  }, [adBlock.code]); // Re-run if the ad block code changes

  return (
    <div className="adsense-ad-container" ref={adRef}>
      {/* AdSense <ins> tag will be injected here */}
    </div>
  );
};

export default AdUnit;