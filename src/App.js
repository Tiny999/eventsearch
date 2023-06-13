import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import countryList from "react-select-country-list";
import Select from "react-select";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import LoadingGif from "./loading.gif";

function App() {
  const apiKey = "fbxbqIRjgzVul625DEXvKZiM5P9WbGzV";
  const baseUrl = "https://app.ticketmaster.com/discovery/v2/";
  const options = useMemo(() => countryList().getData(), []);
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState({
    label: "United States of America",
    value: "US",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getEvents = async () => {
      setIsLoading(true);

      try {
        const res = await axios.get(
          `${baseUrl}/events.json?classificationName=music&countryCode=US&page=${currentPage}&apikey=${apiKey}`
        );
        const events = res?.data?._embedded?.events;;
        setEvents(events);
        setTotalData(res?.data?.page.totalElements);
      } catch (err) {
        console.log(err);
      }

      setIsLoading(false);
    };

    getEvents();
  }, [currentPage]);

  const simpleDateString = (date) => {
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const dayOfMonth = dateObj.getDate();

    const dateString = `${year}-${month}-${dayOfMonth}`;
    return dateString;
  };

  const onSearch = async () => {
    const countryCode = country.value;
    setIsLoading(true);

    setCurrentPage(0);

    try {
      const res = await axios.get(
        `${baseUrl}/events.json?classificationName=music&keyword=${keyword}&countryCode=${countryCode}&page=${currentPage}&city=${city}&startDate=${date}&apikey=${apiKey}`
      );
      const events = res?.data?._embedded?.events;
      setEvents(events);
      setTotalData(res?.data?.page.totalElements);
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  };

  const handleClick = (event) => {
    window.open(event.url, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="px-4 py-8 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Search Events</h1>
      </div>

      <div className="mt-6 flex items-center gap-x-4">
        <input
          className="min-w-0 flex-auto rounded-md border bg-white/5 px-3.5 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          placeholder="Search by Artist Name"
          value={keyword}
          onChange={({ target: { value } }) => setKeyword(value)}
        />

        <input
          className="min-w-0 flex-auto rounded-md border bg-white/5 px-3.5 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          placeholder="Search by city"
          value={city}
          onChange={({ target: { value } }) => setCity(value)}
        />

        <Flatpickr
          className="min-w-0 flex-auto rounded-md border bg-white/5 px-3.5 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          value={date}
          placeholder="Filter by Date"
          onChange={([date]) => {
            setDate(simpleDateString(date));
          }}
        />

        <Select
          value={country}
          onChange={(value) => setCountry(value)}
          options={options}
        />

        <button
          id="submit"
          type="submit"
          className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={onSearch}
        >
          Search
        </button>
      </div>

      <div className="flex flex-col mt-12">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-white border-b">
                  <tr>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Start Date
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Timezone
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4}>
                        <img
                          src={LoadingGif}
                          alt="loading..."
                          className="block w-full"
                        />
                      </td>
                    </tr>
                  ) : (
                    events.map((ev, idx) => (
                      <tr
                        className={`${
                          idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                        } border-b cursor-pointer hover:bg-blue-100`}
                        key={idx}
                        onClick={() => handleClick(ev)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {idx + 1}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {ev.name}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {ev.dates.start.localDate}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {ev.dates.timezone}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between mt-4">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{currentPage * 20 + 1} </span>
            to <span className="font-medium">{(currentPage + 1) * 20} </span>
            of <span className="font-medium">{totalData} </span>
            results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default App;
