import { useEffect } from 'react';

const SITE_NAME = 'ShegerHealth';

const usePageTitle = (title?: string): void => {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  }, [title]);
};

export default usePageTitle;
