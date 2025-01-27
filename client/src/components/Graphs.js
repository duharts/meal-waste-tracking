import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const Graphs = ({ records, category }) => {
    const [graphType, setGraphType] = useState('Bar');

    // Getting all the categories and amount data for graphs
    const categoryData = Object.values(
        records.reduce((acc, record) => {
            acc[record.category] = acc[record.category] || { category: record.category, total: 0 };
            acc[record.category].total += record.amount;
            return acc;
        }, {})
    );

    const currentMonth = new Date().getMonth();
    const currentMonthData = records
        .filter((record) => new Date(record.date).getMonth() === currentMonth)
        .map((record) => ({
            date: record.date,
            amount: record.amount,
        }));

    console.log(currentMonthData)

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    return (
        <div className="p-1 space-y-2">
            <div className="flex justify-center mb-4">
                <select
                    value={graphType}
                    onChange={(e) => setGraphType(e.target.value)}
                    className="border p-2 rounded-lg text-sm sm:text-md"
                >
                    <option value="Bar">Bar Chart</option>
                    <option value="Pie">Pie Chart</option>
                    <option value="Line">Line Chart</option>
                </select>
            </div>

            {graphType === 'Bar' && (
                <div className="overflow-x-auto">
                    <p className="text-sm text-center text-gray-500 mb-4">
                        This chart shows the total expenses for each category in a bar format.
                    </p>
                    <ResponsiveContainer
                        width={categoryData.length > 5 ? categoryData.length * 150 : '100%'}
                        height={400}
                    >
                        <BarChart data={categoryData}>
                            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {graphType === 'Pie' && (
                <div className="overflow-hidden">
                    <p className="text-sm text-center text-gray-500 mb-4">
                        This pie chart represents the proportion of expenses for each category.
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                dataKey="total"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label={(entry) => entry.category}
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {graphType === 'Line' && (
                <div className="overflow-hidden">
                    <p className="text-sm text-center text-gray-500 mb-4">
                        This line chart shows the daily expenses recorded for the current month.
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={currentMonthData}>
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default Graphs;
