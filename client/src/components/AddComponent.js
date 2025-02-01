import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Check, Delete } from 'lucide-react';
import axios from 'axios';

const NumberPad = ({ value, onChange }) => {
    const handleClick = (num) => {
        let newValue = value.toString() + num.toString();
        onChange(newValue);
    };

    const handleDelete = () => {
        let newValue = value.toString().slice(0, -1);
        onChange(newValue || '');
    };

    const handleClear = () => {
        onChange('');
    };

    return (
        <div className="grid grid-cols-3 gap-2 mt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                    key={num}
                    type="button"
                    onClick={() => handleClick(num)}
                    className="p-4 text-xl font-semibold bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    {num}
                </button>
            ))}
            <button
                type="button"
                onClick={handleClear}
                className="p-4 text-xl font-semibold bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
                C
            </button>
            <button
                type="button"
                onClick={() => handleClick(0)}
                className="p-4 text-xl font-semibold bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
                0
            </button>
            <button
                type="button"
                onClick={handleDelete}
                className="p-4 text-xl font-semibold bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
                <Delete className="w-6 h-6 mx-auto" />
            </button>
        </div>
    );
};

const MealTypeButton = ({ type, selected, onClick }) => (
    <button
        type="button"
        onClick={() => onClick(type)}
        className={`w-full p-4 text-sm lg:text-lg font-medium rounded-lg transition-colors ${selected
            ? 'bg-button text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
    >
        {type}
    </button>
);

export default function AddComponent() {
    const today = new Date().toISOString().split('T')[0];
    const [discardRecords, setDiscardRecords] = useState([]);
    const [newRecord, setNewRecord] = useState({
        date: today,
        mealType: '',
        quantity: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [viewType, setViewType] = useState('Add');
    const [categories, setCategories] = useState(['Breakfast', 'Lunch', 'Dinner']);

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecord(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuantityChange = (value) => {
        setNewRecord(prev => ({
            ...prev,
            quantity: value
        }));
    };

    const handleMealTypeChange = (mealType) => {
        setNewRecord(prev => ({
            ...prev,
            mealType
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newRecord.date || !newRecord.quantity) return;

        const record = {
            ...newRecord,
            id: Date.now(),
            quantity: parseInt(newRecord.quantity)
        };

        setIsLoading(true);

        // Simulate network delay
        const response = await axios.post(`https://wastetrackerapi.vercel.app/api/submit-order`, {
            data: record
        }).then((res) => {
            console.log('Order submitted -> ', res)
            setNewRecord({
                date: today,
                mealType: '',
                quantity: ''
            });
            setIsLoading(false);
        }).catch((err) => {
            console.log('Error Submitting order -> ', err)
        })

    };

    return (
        <Card className="w-full shadow-lg">
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={newRecord.date}
                            onChange={handleInputChange}
                            max={new Date().toISOString().split("T")[0]}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">Meal Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Breakfast', 'Lunch', 'Dinner'].map((mealType) => (
                                <MealTypeButton
                                    key={mealType}
                                    type={mealType}
                                    selected={newRecord.mealType === mealType}
                                    onClick={handleMealTypeChange}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">Quantity</label>
                        <input
                            type="text"
                            name="quantity"
                            value={newRecord.quantity}
                            readOnly
                            className="w-full p-3 text-xl font-semibold text-center border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        <NumberPad value={newRecord.quantity} onChange={handleQuantityChange} />
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex items-center gap-2 px-6 py-3 bg-button text-white rounded-lg shadow-md transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-button'
                                }`}
                        >
                            <Check size={20} />
                            {isLoading ? 'Saving...' : 'Submit'}
                        </button>
                    </div>
                </form>

                {/* <div className="mt-8 overflow-x-auto">
      				<table className="w-full">
      					<tbody className="divide-y divide-gray-200">
      						{discardRecords.map(record => (
      							<tr key={record.id} className="hover:bg-gray-50">
      								<td className="px-4 py-3 text-sm text-gray-900">{record.date}</td>
      								<td className="px-4 py-3 text-sm text-gray-900">{record.mealType}</td>
      								<td className="px-4 py-3 text-sm text-gray-900">{record.quantity}</td>
      							</tr>
      						))}
      					</tbody>
      				</table>
      			</div> */}
            </CardContent>
        </Card>
    )
}
