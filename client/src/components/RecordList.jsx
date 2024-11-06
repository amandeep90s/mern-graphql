import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SERVER_URL = "http://localhost:5050/record";

const Record = ({ deleteRecord, record }) => {
  return (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
        {record.name}
      </td>
      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
        {record.position}
      </td>
      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
        {record.level}
      </td>
      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
        <div className="flex gap-2">
          <Link
            to={`/edit/${record._id}`}
            className="inline-flex items-center justify-center px-3 text-sm font-medium transition-colors border rounded-md whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input bg-background hover:bg-slate-100 h-9"
          >
            Edit
          </Link>

          <button
            className="inline-flex items-center justify-center px-3 text-sm font-medium transition-colors border rounded-md whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9"
            color="red"
            type="button"
            onClick={() => {
              deleteRecord(record._id);
            }}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

Record.propTypes = {
  deleteRecord: PropTypes.func.isRequired,
  record: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    position: PropTypes.string,
    level: PropTypes.string,
  }).isRequired,
};

const RecordList = () => {
  const [records, setRecords] = useState([]);

  // This method fetches the records from the database.
  useEffect(() => {
    const getRecords = async () => {
      const response = await fetch(SERVER_URL);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
    };
    getRecords();
  }, [records.length]);

  // This method will delete a record
  const deleteRecord = async (id) => {
    await fetch(`${SERVER_URL}/${id}`, { method: "DELETE" });
    const newRecords = records.filter((record) => record._id !== id);
    setRecords(newRecords);
  };

  // This method will map out the records on the table
  const recordList = () => {
    return records.map((record) => (
      <Record
        record={record}
        key={record._id}
        deleteRecord={() => deleteRecord(record._id)}
      />
    ));
  };

  return (
    <>
      <h3 className="p-4 text-lg font-semibold">Employee Records</h3>
      <div className="overflow-hidden border rounded-lg">
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm caption-bottom">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checked])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checked])]:pr-0">
                  Position
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checked])]:pr-0">
                  Level
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checked])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">{recordList()}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RecordList;
