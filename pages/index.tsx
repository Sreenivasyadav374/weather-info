"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useDebounce } from "@/components/useDebounce";
import styles from "./index.module.css";
import "../styles/globals.css";

interface LocationData {
  admin1_code: string;
  admin2_code: string;
  admin3_code: string | null;
  admin4_code: string | null;
  alternate_names: string[];
  ascii_name: string;
  coordinates: { lon: number; lat: number };
  cou_name_en: string;
  country_code: string;
  country_code_2: string | null;
  dem: number;
  elevation: number | null;
  feature_class: string;
  feature_code: string;
  geoname_id: string;
  label_en: string;
  modification_date: string;
  name: string;
  population: number;
  timezone: string;
}

const Home = () => {
  const [data, setData] = useState<LocationData[]>([]);
  const [countryData, setCountryData] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState<any[]>([]);
  const [countryNames, setCountryNames] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const performSearch = async (query: string) => {
    setIsLoading(true);
    if (selectedCountry.length == 0) {
      try {
        const response = await fetch(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?order_by=cou_name_en&limit=100&page=0`
        );
        const data = await parseStreamToJson(response.body!);
        const matchingCities = data.results?.filter((city: LocationData) =>
          city.name.toLowerCase().includes(query.toLowerCase())
        );
        console.log(matchingCities);
        setCities(matchingCities);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      const matchingCities = countryData?.filter((city: LocationData) =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );
      setCities(matchingCities);
    }
  };
  const debouncedSearch = useDebounce(performSearch, 500);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const { value } = event.target;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    const fetchThreshold = 80; // Fetch data when user scrolls to 80% of the page
    if (scrollPercentage >= fetchThreshold && !isLoading) {
      fetchData(page); // Fetch next page
    }
  };

  const parseStreamToJson = async (
    stream: ReadableStream<Uint8Array>
  ): Promise<any> => {
    try {
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let data = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        data += decoder.decode(value, { stream: true });
      }

      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw error;
    }
  };
  const fetchData = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?order_by=cou_name_en&limit=20&page=${page}`
      );

      const jsonData = await parseStreamToJson(response.body!);
      setData([...data, ...jsonData.results]);
      setPage(page + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const searchedResults = () => {
    return cities.length === 0 && isLoading == false ? (
      <h4>No matching cities</h4>
    ) : (
      <>
        {cities?.map((item, index) => (
          <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "8px" }}>
              <Link
                href="/details/[id]"
                as={`/details/${item.name + "," + item.country_code}`}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "8px",
                    borderRadius: "4px",
                    backgroundColor: "#f2f2f2",
                    marginBottom: "8px",
                    textDecoration: "underline",
                  }}
                >
                  {item.name}
                </div>
              </Link>
            </td>
            <td style={{ padding: "8px" }}>{item.cou_name_en}</td>
            <td style={{ padding: "8px" }}>{item.timezone}</td>
          </tr>
        ))}
      </>
    );
  };
  const defaultResults = () => {
    if (selectedCountry.length == 0) {
      return data?.map((item, index) => (
        <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
          <td style={{ padding: "8px" }}>
            <Link
              href="/details/[id]"
              as={`/details/${item.name + "," + item.country_code}`}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "8px",
                  borderRadius: "4px",
                  backgroundColor: "#f2f2f2",
                  marginBottom: "8px",
                  textDecoration: "underline",
                }}
              >
                {item.name}
              </div>
            </Link>
          </td>
          <td style={{ padding: "8px" }}>{item.cou_name_en}</td>
          <td style={{ padding: "8px" }}>{item.timezone}</td>
        </tr>
      ));
    }
    return countryData?.map((item, index) => (
      <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
        <td style={{ padding: "8px" }}>
          <Link
            href="/details/[id]"
            as={`/details/${item.name + "," + item.country_code}`}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px",
                borderRadius: "4px",
                backgroundColor: "#f2f2f2",
                marginBottom: "8px",
                textDecoration: "underline",
              }}
            >
              {item.name}
            </div>
          </Link>
        </td>
        <td style={{ padding: "8px" }}>{item.cou_name_en}</td>
        <td style={{ padding: "8px" }}>{item.timezone}</td>
      </tr>
    ));
  };
  const loader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        {isLoading ? <h3>Loading...</h3> : null}
      </div>
    );
  };
  const fetchCountryData = async (country: string) => {
    setSelectedCountry((prev) => country);

    const response = await fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?where=cou_name_en%3D%22${country}%22&order_by=cou_name_en&limit=100&page=${page}`
    );
    const jsonData = await response.json();
    setCountryData(jsonData.results);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?group_by=cou_name_en&order_by=cou_name_en&limit=100"
      );
      const jsonData = await response.json();
      const countryNames: string[] = Array.from(
        new Set(jsonData.results.map((item: LocationData) => item.cou_name_en))
      );
      setCountryNames(countryNames);
      // setSelectedCountry(countryNames[0]);
    };
    fetchData();
  }, []);
  useEffect(() => {
    fetchData(page);
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, page]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Location Data</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search for a city"
        className={styles.searchInput}
      />
      <select
        value={selectedCountry}
        onChange={(e) => {
          fetchCountryData(e.target.value);
        }}
        className={styles.selectCountry}
      >
        <option value="" disabled hidden>
          Select a country
        </option>
        {countryNames.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      {isLoading && <div className={styles.loader}>Loading...</div>}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.thead}>
              <th className={styles.tableHeader}>Name</th>
              <th className={styles.tableHeader}>Country Name</th>
              <th className={styles.tableHeader}>Timezone</th>
            </tr>
          </thead>
          <tbody>
            {searchTerm === "" ? defaultResults() : searchedResults()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
