import { useEffect } from 'react';

const SITE_NAME = 'Sheger Health Connect';

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  }, [title]);
};

export default usePageTitle;
