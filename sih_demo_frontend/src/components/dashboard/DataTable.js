'use client';
import { useState, useEffect } from 'react';

export default function DataTable({ queryData }) {
  const [tableData, setTableData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterText, setFilterText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (queryData) {
      // Mock table data
      const mockData = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        floatId: `290123${i + 4}`,
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        latitude: 19.076 + (Math.random() - 0.5) * 2,
        longitude: 72.8777 + (Math.random() - 0.5) * 2,
        temperature: 28 + (Math.random() - 0.5) * 4,
        salinity: 35 + (Math.random() - 0.5) * 0.5,
        pressure: 10 + Math.random() * 100,
        oxygen: 200 + Math.random() * 50,
        status: Math.random() > 0.1 ? 'active' : 'inactive',
      }));
      setTableData(mockData);
    }
  }, [queryData]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((row) => row.id));
    }
  };

  const filteredData = tableData.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleExport = (format) => {
    const dataToExport =
      selectedRows.length > 0
        ? tableData.filter((row) => selectedRows.includes(row.id))
        : filteredData;

    if (format === 'csv') {
      const csvContent = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map((row) => Object.values(row).join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'argo_data.csv';
      a.click();
    } else if (format === 'netcdf') {
      // Mock NetCDF export
      alert('NetCDF export would be implemented here');
    }
  };

  const columns = [
    { key: 'floatId', label: 'Float ID' },
    { key: 'date', label: 'Date' },
    { key: 'latitude', label: 'Latitude' },
    { key: 'longitude', label: 'Longitude' },
    { key: 'temperature', label: 'Temperature (°C)' },
    { key: 'salinity', label: 'Salinity (PSU)' },
    { key: 'pressure', label: 'Pressure (dbar)' },
    { key: 'oxygen', label: 'Oxygen (μmol/kg)' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="p-4 border-b border-[--color-border] bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Data Table</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Export CSV
            </button>
            <button
              onClick={() => handleExport('netcdf')}
              className="px-3 py-1 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600">
              Export NetCDF
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search data..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
            <span className="text-sm text-gray-600">
              {filteredData.length} of {tableData.length} records
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedRows.length} selected
            </span>
            {selectedRows.length > 0 && (
              <button
                onClick={() => setSelectedRows([])}
                className="text-sm text-orange-600 hover:text-orange-700">
                Clear Selection
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === filteredData.length &&
                      filteredData.length > 0
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort(column.key)}>
                    <div className="flex items-center gap-1">
                      {column.label}
                      {sortConfig.key === column.key && (
                        <span className="text-orange-500">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedRows.includes(row.id) ? 'bg-orange-50' : ''
                  }`}
                  onClick={() => handleSelectRow(row.id)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.key === 'status' ? (
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            row[column.key] === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                          {row[column.key]}
                        </span>
                      ) : column.key === 'latitude' ||
                        column.key === 'longitude' ? (
                        row[column.key].toFixed(4)
                      ) : column.key === 'temperature' ||
                        column.key === 'salinity' ? (
                        row[column.key].toFixed(2)
                      ) : column.key === 'pressure' ||
                        column.key === 'oxygen' ? (
                        row[column.key].toFixed(1)
                      ) : (
                        row[column.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-[--color-border] bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
            {filteredData.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
