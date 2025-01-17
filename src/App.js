import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Plus, Delete } from 'lucide-react';
import AWS from 'aws-sdk';

// Initialize DynamoDB
AWS.config.update({
  region: "YOUR_AWS_REGION",
  accessKeyId: "YOUR_ACCESS_KEY_ID",
  secretAccessKey: "YOUR_SECRET_ACCESS_KEY"
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

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
    className={`w-full p-4 text-lg font-medium rounded-lg transition-colors ${
      selected 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {type}
  </button>
);

const MealDiscardTracker = () => {
  const today = new Date().toISOString().split('T')[0];
  const [discardRecords, setDiscardRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    date: today,
    mealType: 'Breakfast',
    quantity: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch records from DynamoDB
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setIsLoading(true);
        const params = {
          TableName: "meal-discards"
        };

        const result = await dynamodb.scan(params).promise();
        if (result.Items) {
          setDiscardRecords(result.Items);
        }
      } catch (err) {
        setError("Failed to fetch records");
        console.error("Error fetching records:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // Save record to DynamoDB
  const saveRecord = async (record) => {
    const params = {
      TableName: "meal-discards",
      Item: {
        id: record.id.toString(),
        date: record.date,
        mealType: record.mealType,
        quantity: record.quantity,
        timestamp: new Date().toISOString()
      }
    };

    try {
      await dynamodb.put(params).promise();
    } catch (err) {
      setError("Failed to save record");
      console.error("Error saving record:", err);
      throw err;
    }
  };

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

    try {
      setIsLoading(true);
      await saveRecord(record);
      setDiscardRecords(prev => [...prev, record]);
      
      setNewRecord({
        date: today,
        mealType: 'Breakfast',
        quantity: ''
      });
    } catch (err) {
      // Error already handled in saveRecord
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Logo and Title */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <img 
            src="/api/placeholder/200/100" 
            alt="Children's Rescue Fund Logo" 
            className="mx-auto h-24 object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold text-blue-600">Meal Discard Tracker</h1>
        <h2 className="text-xl text-gray-600">Kenilworth</h2>
      </div>

      <Card className="w-full shadow-lg">
        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={newRecord.date}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
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
            
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                <Plus size={20} />
                {isLoading ? 'Saving...' : 'Add Record'}
              </button>
            </div>
          </form>

          {/* Records Table */}
          <div className="mt-8 overflow-x-auto">
            {isLoading && !discardRecords.length ? (
              <div className="text-center py-4 text-gray-500">Loading records...</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Meal Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                  </tr>
                </thead>
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MealDiscardTracker;