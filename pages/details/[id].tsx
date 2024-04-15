"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Details = () => {
  const router = useRouter();
  const { id } = router.query; // Get the id from query parameters

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   // Fetch data based on the id from query parameters
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     setError(null);

  //     try {
  //       const response = await fetch(`/api/data/${id}`);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch data");
  //       }
  //       const jsonData = await response.json();
  //       setData(jsonData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setError("Failed to fetch data. Please try again later.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (geoname_id) {
  //     fetchData();
  //   }
  // }, [geoname_id]);

  if (!id) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>{id}</h1>
      <p>
        The api you have provided isnt free so,i am just displaying the city
        name.
      </p>
    </div>
  );
};

export default Details;
