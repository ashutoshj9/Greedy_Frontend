import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Table from "../DataTable/Table";
import { ImEqualizer } from "react-icons/im";
import "./styles.css";

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState(new Date("2021-06-01"));
  const [endDate, setEndDate] = useState(new Date("2021-06-30"));
  const [showSetting, setShowSetting] = useState(false);
  const [data, setData] = useState(null);
  const [appData, setAppData] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState([
    "Requests",
    "Responses",
    "Impressions",
    "Clicks",
    "Revenue",
    "Fill Rate",
    "CTR",
  ]);
  const [selectedColumns, setSelectedColumns] = useState(visibleColumns);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      const dataUrl = `http://go-dev.greedygame.com/v3/dummy/report?startDate=${start
        .toISOString()
        .slice(0, 10)}&endDate=${end.toISOString().slice(0, 10)}`;
      fetch(dataUrl)
        .then((response) => response.json())
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          console.error(error);
        });
      const appDataUrl = "http://go-dev.greedygame.com/v3/dummy/apps";
      fetch(appDataUrl)
        .then((response) => response.json())
        .then((data) => {
          setAppData(data);
        })
        .catch((error) => console.log(error));
    }
  };

  const toggleColumnVisibility = (columnName) => {
    if (selectedColumns.includes(columnName)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== columnName));
    } else {
      setSelectedColumns([...selectedColumns, columnName]);
    }
  };
  const applyChanges = () => {
    setVisibleColumns(selectedColumns);
  };

  return (
    <div style={{ textAlign: "left", margin: "20px" }}>
      <div>
        <h2>Analytics</h2>
        <div className="date-range-picker-container">
          <DatePicker
            id="start-date"
            selected={startDate}
            onChange={handleDateChange}
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            dateFormat={`${"MMMM dd"}`}
            minDate={new Date("2021-06-01")}
            maxDate={new Date("2021-06-30")}
            className="date-range-picker-input"
          />
          <button
            style={{
              borderColor: "rgba(0,0,0,0.1)",
              borderWidth: 0.1,
              borderRadius: 2,
              fontSize: 12,
              fontWeight: 600,
              padding: "0 2%",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
            }}
            onClick={setShowSetting}
          >
            <ImEqualizer
              color="#1c6ee8"
              size={12}
              style={{ padding: "0 5px" }}
            />
            Settings
          </button>
        </div>
      </div>
      {showSetting && (
        <div className="second">
          <h5 style={{ margin: "5px" }}>Dimensions & Metrics</h5>
          <button
            className="buttons"
            style={{ fontWeight: "bold", borderLeft: "4px solid #1c6ee8" }}
          >
            Date
          </button>
          <button
            className="buttons"
            style={{ fontWeight: "bold", borderLeft: "4px solid #1c6ee8" }}
          >
            App
          </button>
          {[
            "Requests",
            "Responses",
            "Impressions",
            "Clicks",
            "Revenue",
            "Fill Rate",
            "CTR",
          ].map((columnName, columnIndex) => (
            <button
              key={columnName}
              onClick={() => toggleColumnVisibility(columnName)}
              style={{
                fontWeight: selectedColumns.includes(columnName)
                  ? "bold"
                  : "normal",
                borderLeft: selectedColumns.includes(columnName)
                  ? "4px solid #1c6ee8"
                  : "0",
              }}
              className="buttons"
            >
              {columnName}
            </button>
          ))}
          <div style={{ textAlign: "right", margin: 20 }}>
            <button
              style={{ backgroundColor: "#fff", color: "#1c6ee8" }}
              className="secondButton"
              onClick={() => setShowSetting(false)}
            >
              Close
            </button>
            <button
              style={{ backgroundColor: "#1c6ee8", color: "#fff" }}
              className="secondButton"
              onClick={applyChanges}
            >
              Apply Changes
            </button>
          </div>
        </div>
      )}
      {data && data != null && (
        <Table data={data} appData={appData} visibleColumns={visibleColumns} />
      )}
    </div>
  );
};

export default DateRangePicker;
