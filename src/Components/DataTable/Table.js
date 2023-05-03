import React, { useRef, useState } from "react";
import "./Table.css";
import { FiFilter } from "react-icons/fi";

const Table = ({ data, appData, visibleColumns }) => {
  console.log(data);
  const [filterValues, setFilterValues] = useState({});
  const [filterVisibility, setFilterVisibility] = useState(false);
  const filterInputRefs = useRef({});

  const handleChange = (e, columnName) => {
    const value = e.target.value;
    setFilterValues((prev) => ({ ...prev, [columnName]: value }));
  };

  const toggleFilterVisibility = (columnName) => {
    setFilterVisibility((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };
  console.log(filterValues);

  const filterData = (data, columnName, filterValue) => {
    try {
      if (!filterValue) {
        return data.data;
      } else {
        return data.data.filter((item) =>
          String(item[columnName])
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        );
      }
    } catch (error) {
      return null;
    }
  };

  const showColumn = (columnName, item) => {
    switch (columnName) {
      case "Requests":
        return item.requests;
      case "Responses":
        return item.responses;
      case "Impressions":
        return item.impressions;
      case "Clicks":
        return item.clicks;
      case "Revenue":
        return `$${item.revenue.toFixed(2)}`;
      case "Fill Rate":
        return `${((item.requests / item.responses) * 1).toFixed(2)}%`;
      case "CTR":
        return `${((item.clicks / item.impressions) * 1).toFixed(2)}% `;
      default:
        return null;
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>
              <div className="filter-icon">
                <FiFilter color="#000" fill="#000" />
              </div>
              Date
            </th>
            <th>
              <div className="filter-icon">
                <FiFilter color="#000" fill="#000" />
              </div>
              App
            </th>
            {visibleColumns.map((columnName, columnIndex) => (
              <th key={columnName} style={{ position: "relative" }}>
                <div
                  className="filter-icon"
                  onClick={() => toggleFilterVisibility(columnName)}
                >
                  <FiFilter color="#000" fill="#000" />
                </div>
                {columnName}
                {filterVisibility[columnName] && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: "100%",
                      backgroundColor: "#fff",
                      height: "150px",
                      border: "solid",
                      borderWidth: 0.1,
                      borderColor: "rgba(0,0,0,0.1)",
                    }}
                  >
                    <div style={{ margin: "5px", textAlign: "left" }}>
                      Select App
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <input
                        type="text"
                        value={filterValues[columnName]}
                        onChange={(e) => handleChange(e, columnName)}
                        ref={(ref) =>
                          (filterInputRefs.current[columnName] = ref)
                        }
                        onClick={(e) => e.stopPropagation()}
                        style={{ margin: "5px", outline: "none" }}
                        className="filterInput"
                      />
                    </div>
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        {visibleColumns && (
          <tbody>
            {filterData(data, "app_id", filterValues["App"]).map((item) => (
              <tr key={item.requests}>
                <td>
                  {new Date(item.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td>
                  {appData.data.map(
                    (appItem) =>
                      appItem.app_id === item.app_id && appItem.app_name
                  )}
                </td>
                {visibleColumns.map((columnName, columnIndex) => (
                  <td key={columnName}>{showColumn(columnName, item)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default Table;
