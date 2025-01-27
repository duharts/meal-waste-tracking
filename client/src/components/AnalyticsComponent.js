import React, { useState } from 'react';
import { Card, CardContent } from './ui/card'
import Table from './RecordTable';
import Graphs from './Graphs';


export default function AnalyticsComponent({ records, categories }) {
    const [viewType, setViewType] = useState('Records');

    const handleViewTypeChange = (view) => {
        setViewType(view)
    };

    return (
        <Card className="w-full shadow-lg">
            <CardContent className="p-6">
                <div className="mb-5 flex justify-center">
                    <div className="text-center slex grid grid-cols-2 gap-x-6">
                        <button type="button"
                            onClick={(() => handleViewTypeChange('Records'))}
                            className={`w-20 lg:w-40 p-2 text-sm lg:text-lg font-small rounded-lg transition-colors ${viewType === 'Records'
                                ? 'bg-button text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}>Records</button>
                        <button type="button"
                            onClick={(() => handleViewTypeChange('Graphs'))}
                            className={`w-20 lg:w-40 p-2 text-sm lg:text-lg font-small rounded-lg transition-colors ${viewType === 'Graphs'
                                ? 'bg-button text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}>Graphs</button>
                    </div>
                </div>

                {viewType === 'Records' ? (
                    <Table records={records} category={categories} />
                ) : (
                    <Graphs records={records} category={categories} />
                )}




            </CardContent>
        </Card>

    )
}
