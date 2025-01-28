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

const Graphs = ({ records, mealType }) => {
    const [graphType, setGraphType] = useState('Bar');

    // Getting all the categories and quantity data for graphs
    const mealTypeData = Object.values(
        records.reduce((acc, record) => {
            acc[record.mealType] = acc[record.mealType] || { mealType: record.mealType, total: 0 };
            acc[record.mealType].total += record.quantity;
            return acc;
        }, {})
    );

    const currentMonth = new Date().getMonth();
    const currentMonthData = records
        .filter((record) => new Date(record.date).getMonth() === currentMonth)
        .map((record) => ({
            date: record.date,
            quantity: record.quantity,
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
                        This chart shows the total quantity discarded for each meal type in a bar format.
                    </p>
                    <ResponsiveContainer
                        width={mealTypeData.length > 5 ? mealTypeData.length * 150 : '100%'}
                        height={400}
                    >
                        <BarChart data={mealTypeData}>
                            <XAxis dataKey="mealType" tick={{ fontSize: 12 }} />
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
                        This pie chart represents the discarded quantity for each mealType.
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={mealTypeData}
                                dataKey="total"
                                nameKey="mealType"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label={(entry) => entry.mealType}
                            >
                                {mealTypeData.map((entry, index) => (
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
                        This line chart shows the daily quantity discarded for the current month.
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={currentMonthData}>
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="quantity" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default Graphs;
