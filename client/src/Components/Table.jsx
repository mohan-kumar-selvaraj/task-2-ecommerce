import React from "react";
import { Link } from "react-router-dom";

const Table = (props) => {
  const { headData, bodyData, flag } = props;
  if (bodyData.length === 0)
    return (
      <div className="text-center m-5">
        <h4>No record found!!☹️</h4>
      </div>
    );
  return (
    <table className="table">
      <thead>
        <tr>
          {headData.map((data, i) => (
            <th key={i}>{data}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyData.map((data, i) => (
          <tr key={i}>
            {Object.keys(data).map(
              (key) =>
                key !== "id" &&
                key !== "createdDate" &&
                (key !== "DATE" || flag) &&
                key !== "_version_" && (
                  <td key={key}>
                    {flag && key === "CD" ? (
                      <Link to={`/product/${data[key]}/1`}>{data[key]}</Link>
                    ) : key === "DATE" ? (
                      new Date(data[key]).toLocaleDateString()
                    ) : (
                      data[key]
                    )}
                  </td>
                )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
