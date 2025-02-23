import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useDeviceDetect(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const checkDevice = () => {
      // Check if window is defined (client-side)
      if (typeof window === 'undefined') {
        return deviceInfo;
      }

      const width = window.innerWidth;
      
      // Get user agent
      const userAgent = window.navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));

      // Determine device type based on screen width and user agent
      const newDeviceInfo = {
        isMobile: width < 768 || (isMobileAgent && width < 1024),
        isTablet: (width >= 768 && width < 1024) || (isMobileAgent && width >= 1024),
        isDesktop: width >= 1024 && !isMobileAgent,
      };

      // Only update state if values have changed
      if (JSON.stringify(newDeviceInfo) !== JSON.stringify(deviceInfo)) {
        setDeviceInfo(newDeviceInfo);
      }
    };

    // Initial check
    checkDevice();

    // Add resize listener
    window.addEventListener('resize', checkDevice);

    // Cleanup
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return deviceInfo;
}
