import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const RecordTable = ({ records, mealtype }) => {
    const [filters, setFilters] = useState({
        mealType: '',
        startDate: '',
        endDate: '',
    });
    const [categories, setCategories] = useState(mealtype);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const handleDownloadCSV = () => {
        if (!records || records.length === 0) {
            alert('No data available to download.');
            return;
        }

        // Convert JSON to CSV format manually
        const headers = Object.keys(records[0]).join(',') + '\n'; // CSV Headers
        const rows = records.map(row => Object.values(row).join(',')).join('\n'); // CSV Rows
        const csvContent = headers + rows;

        // Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'table-data.csv'); // File name
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    // Handling filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Resetting the filters
    const handleResetFilters = () => {
        setFilters((prev) => ({ ...prev, mealType: '', startDate: '', endDate: '' }));
    };

    // Filtering data here
    const filteredData = records.filter((item) => {
        console.log("filter 1 -", filters)
        const ismealTypeMatch = filters.mealType
            ? item.mealType.toLowerCase().includes(filters.mealType.toLowerCase())
            : true;
        const isDateMatch =
            (!filters.startDate || new Date(item.date) >= new Date(filters.startDate)) &&
            (!filters.endDate || new Date(item.date) <= new Date(filters.endDate));

        return ismealTypeMatch && isDateMatch;
    });

    // Logic for pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handling page changes here
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const maxButtons = 4; // Max no of buttons to display
    const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    return (
        <div className="p-4 space-y-6">
            {/* filter div */}
            <div className="flex flex-wrap gap-4">
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Meal Type</label>
                    <select
                        name="mealType"
                        value={filters.mealType}
                        onChange={handleFilterChange}
                        className="border p-2 rounded-lg w-full sm:w-48"
                    >
                        <option value="">All Meals</option>
                        {categories && categories.map((mealType, index) => (
                            <option key={index} value={mealType}>
                                {mealType}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">From</label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="border p-2 rounded-lg w-full sm:w-auto"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">To</label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="border p-2 rounded-lg w-full sm:w-auto"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">&nbsp;</label>
                    <button
                        onClick={handleResetFilters}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        Reset
                    </button>
                </div>
                <button
                    onClick={handleDownloadCSV}
                    className={`w-40 lg:w-40 p-2 text-sm lg:text-md font-small rounded-lg transition-colors bg-gray-200 hover:bg-button hover:text-white text-black  shadow-md`}
                >
                    Download CSV
                </button>
            </div>

            {/* table div */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">Meal Type</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>

                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">{item.mealType}</td>
                                    <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                                    <td className="border border-gray-300 px-4 py-2">{item.date}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                                >
                                    No records to show
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4">
                {/* Records Per Page selector div */}
                <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="border p-2 rounded-lg"
                >
                    <option value="5">5 records per page</option>
                    <option value="10">10 records per page</option>
                    <option value="20">20 records per page</option>
                    <option value="50">50 records per page</option>
                </select>

                {/* Pagination div */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* First page button */}
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className={`px-2 sm:px-3 py-1 rounded-lg flex items-center justify-center text-sm sm:text-md ${currentPage === 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <ChevronsLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Prev button */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-2 sm:px-3 py-1 rounded-lg flex items-center justify-center text-sm sm:text-md ${currentPage === 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Pages */}
                    {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
                        const page = startPage + index;
                        return (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-md ${currentPage === page
                                    ? 'bg-button text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    {/* Next button */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-2 sm:px-3 py-1 rounded-lg flex items-center justify-center text-sm sm:text-md ${currentPage === totalPages
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Last button */}
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`px-2 sm:px-3 py-1 rounded-lg flex items-center justify-center text-sm sm:text-md ${currentPage === totalPages
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecordTable;
