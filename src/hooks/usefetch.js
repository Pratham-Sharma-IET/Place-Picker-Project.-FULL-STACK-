import { useState, useEffect, useMemo } from "react";

function useFetch(url, path, option) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const memoURL = useMemo(() => url, [url]);
  const memoPath = useMemo(() => path, [path]);
  const memoOption = useMemo(() => option, [option]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(`${memoURL}/${memoPath}`, memoOption);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const responseData = await response.json();
        setData(responseData.places);
        console.log(responseData); // Debugging line
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return { data, isLoading, setData, error };
}
export default useFetch;
