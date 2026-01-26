import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

// function used to use axios, which will query data from the backend
// pretty sure that doesnt go here yeah but all the routes need to be made in the first place. then the pages can auto-populate based upon the id prop.
export const useAxios = (url: string, method: string, payload: any) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const controllerRef = useRef(new AbortController());

  const cancel = () => {
    controllerRef.current.abort();
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.request({
          data: payload,
          signal: controllerRef.current.signal,
          method,
          url,
        });
        setData(response.data);
      } catch (error) {
        // setError(error.message);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);
  return { cancel, data, error, loaded };
};

export const getSeason = (month: number) => {
  if (2 <= month && month <= 5) {
    return 'Spring';
  }

  if (6 <= month && month <= 7) {
    return 'Summer';
  }

  if (8 <= month && month <= 11) {
    return 'Fall';
  }

  // Months 12, 01
  return 'Winter';
};
