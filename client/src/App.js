import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Plus, Delete } from 'lucide-react';
import axios from 'axios';
import AnalyticsComponent from './components/AnalyticsComponent';
import AddComponent from './components/AddComponent';



const MealDiscardTracker = () => {
	const today = new Date().toISOString().split('T')[0];
	const [discardRecords, setDiscardRecords] = useState([]);
	const [newRecord, setNewRecord] = useState({
		date: today,
		mealType: 'Breakfast',
		quantity: ''
	});
	const [isLoading, setIsLoading] = useState(false);
	const [viewType, setViewType] = useState('Add');
	const [categories, setCategories] = useState(['Breakfast', 'Lunch', 'Dinner']);

	const [records, setRecords] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Replace with your API endpoint
				const response = await axios.get('http://localhost:5000/api/records');
				console.log(response.data)
				setRecords(response.data); // Assuming API returns an array of records
				setLoading(false);
			} catch (err) {
				console.error('Error fetching records:', err);
				setError('Failed to fetch records. Please try again later.');
				setLoading(false);
			}
		};

		fetchData();
	}, [])

	const handleViewTypeChange = (view) => {
		setViewType(view)
	};



	return (
		// <div className="max-w-3xl mx-auto p-4">
		// 	<div className="text-center mb-8">
		// 		<h1 className="text-2xl font-bold text-blue-600">Meal Discard Tracker</h1>
		// 		<h2 className="text-xl text-gray-600">Kenilworth</h2>
		// 	</div>

		// 	
		// </div>
		<div className="min-h-screen bg-background">
			<div className="max-w-3xl mx-auto p-4 bg-background">
				<div className="flex justify-between items-center m-5">
					{/* Left Section: Texts */}
					<div className="text-left">
						<h1 className="text-2xl sm:text-3xl font-bold text-button">Meal Discard Tracker</h1>
						<h2 className="text-xl text-gray-600">Kenilworth</h2>
					</div>

					{/* Right Section: Buttons */}

					<div className="flex space-x-2">
						<button
							type="button"
							onClick={() => handleViewTypeChange('Add')}
							className={`w-full p-2 text-sm sm:text-lg font-medium rounded-lg transition-colors ${viewType === 'Add'
								? 'bg-button text-white shadow-md'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
						>
							Add
						</button>
						<button
							type="button"
							onClick={() => handleViewTypeChange('Analytics')}
							className={`w-full p-2 text-sm sm:text-lg font-medium rounded-lg transition-colors ${viewType === 'Analytics'
								? 'bg-button text-white shadow-md'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
						>
							Analytics
						</button>
					</div>
				</div>

				{/* Conditional Rendering for Analytics */}
				{viewType === 'Add' ? (
					<AddComponent />
				) : (
					<AnalyticsComponent categories={categories} records={records} />
				)}
			</div>
		</div>
	);
};

export default MealDiscardTracker;
