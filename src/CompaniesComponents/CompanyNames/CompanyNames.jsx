import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "../Debounce/Debounce";
import "./CompanyName.css";

const CompanyNames = ({ CompaniesData }) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectInput, setSelectInput] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchInput);
  const itemsPerPage = 5;

  // Safe data fallback
  const safeData = CompaniesData || [];

  // Unique countries
  const countries = useMemo(() => {
    return [...new Set(safeData.map(c => c.country))];
  }, [safeData]);

  // Reset page when filters change
  useEffect(() => {
    if (page !== 1) setPage(1);
  }, [searchInput, selectInput, sortOrder]);

  //  FILTER
  const filteredCompanies = useMemo(() => {
    return safeData.filter(company => {
      const matchesSearch = company.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

      const matchesLocation = selectInput
        ? company.country === selectInput
        : true;

      return matchesSearch && matchesLocation;
    });
  }, [safeData, debouncedSearch, selectInput]);

  // SORT 
  const sortedCompanies = useMemo(() => {
    return [...filteredCompanies].sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }, [filteredCompanies, sortOrder]);

  //  PAGINATION 
  const paginatedCompanies = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedCompanies.slice(start, start + itemsPerPage);
  }, [sortedCompanies, page]);

  //  totalPages 
  const totalPages = Math.max(
    1,
    Math.ceil(sortedCompanies.length / itemsPerPage)
  );

  return (
    <div className="CardContainer">

      {/* Filters */}
      <div className="filterContainer">
        <input
          type="text"
          placeholder="Search company..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <select
          value={selectInput}
          onChange={(e) => setSelectInput(e.target.value)}
        >
          <option value="">All Locations</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Sort A-Z</option>
          <option value="desc">Sort Z-A</option>
        </select>
      </div>

      {/* Empty State */}
      {sortedCompanies.length === 0 ? (
        <p className="empty">No results found</p>
      ) : (
        <>
          {/* Table */}
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Location</th>
                <th>Email</th>
              </tr>
            </thead>

            <tbody>
              {paginatedCompanies.map((company) => (
                <tr key={company.id}>
                  <td data-label="Company Name">{company.name}</td>
                  <td data-label="Location">{company.country}</td>
                  <td data-label="Email">{company.email}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(prev => prev - 1)}
            >
              Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyNames;