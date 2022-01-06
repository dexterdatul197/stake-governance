import { useEffect, useState } from 'react';
const MOBILE_DIMENSION = 768;

const getIsMobile = (size = MOBILE_DIMENSION): boolean =>
  window.innerWidth <= size;

const useIsMobile = (size: number): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(getIsMobile(size));

  useEffect(() => {
    const onResize = () => {
      setIsMobile(getIsMobile(size));
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [size]);

  return isMobile;
};

export default useIsMobile;
