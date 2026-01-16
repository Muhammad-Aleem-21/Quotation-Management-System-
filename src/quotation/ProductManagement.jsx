import React from 'react'

import { useState } from 'react';

// Cable data (same as before)
const categories = [
  'General cables',
  'Flexible Cables BS 6500 IEC 60228',
  'Imperial Sizes BS-2004',
  'Co-axial Cables(RG-Type)',
  'Telephone & Intercom Cables',
  'DC Solar Flexible Photovoltic UV-Resistant Cable',
  'POWER CABLES',
  'ALUMINIUM CABLES'
];

const cableData = {
  'Imperial Sizes BS-2004': [
    { name: '1/.044" Solid', price: 6577 },
    { name: '3/.029" Stranded', price: 8490 },
    { name: '7/.029" Stranded', price: 18591 },
    { name: '7/.036" Stranded', price: 28760 },
    { name: '7/.044" Stranded', price: 42420 },
    { name: '7/.052" Stranded', price: 58717 },
    { name: '7/.064" Stranded', price: 89952 }
  ],
  'Co-axial Cables(RG-Type)': [
    { name: 'RG-6U', price: 20681 },
    { name: 'RG-7U', price: 23291 },
    { name: 'RG-11U', price: 30610 },
    { name: 'CAT-6', price: 22205 },
    { name: 'CCTV', price: 15920 },
    { name: 'Fire Alarm (1.5mm²)', price: 50149 },
    { name: 'Fire Alarm (2.5mm²)', price: 78067 },
    { name: 'Speaker Wire (1.5mm²)', price: 29324 },
    { name: 'Speaker Wire (2.5mm²)', price: 50007 }
  ],
  'Telephone & Intercom Cables': [
    { name: 'Single Pair', price: 7346 },
    { name: 'Two Pairs', price: 11167 },
    { name: 'Three Pairs', price: 15720 },
    { name: 'Four Pairs', price: 22102 },
    { name: 'Five Pairs', price: 24506 },
    { name: 'Six Pairs', price: 32498 },
    { name: 'Seven Pairs', price: 35893 },
    { name: 'Eight Pairs', price: 43735 },
    { name: 'Nine Pairs', price: 48578 },
    { name: 'Ten Pairs', price: 52859 }
  ],
  'DC Solar Flexible Photovoltic UV-Resistant Cable': {
    types: ['PVC/PVC', 'XLPE/PVC', 'XLPO/XLPO'],
    copperTypes: ['Plain Copper', 'TINNED Copper'],
    cables: [
      { name: '1.5 mm²', plainPrice: 12185, tinnedPrice: 13745 },
      { name: '2.5 mm²', plainPrice: 19685, tinnedPrice: 22281 },
      { name: '4.0 mm²', plainPrice: 30217, tinnedPrice: 34397 },
      { name: '6.0 mm²', plainPrice: 44424, tinnedPrice: 50699 },
      { name: '10 mm²', plainPrice: 74922, tinnedPrice: 85541 }
    ]
  },
  'General cables': [
    {
      description: '1.0mm² Solid',
      formation: '1/1.13 mm',
      prices: { singleCore: 6590, twoCoreFlat: 16575, threeCoreRound: 23083, fourCoreRound: 30399 }
    },
    {
      description: '1.5mm² Solid',
      formation: '1/1.38 mm',
      prices: { singleCore: 8892, twoCoreFlat: 22190, threeCoreRound: 31336, fourCoreRound: 41290 }
    },
    {
      description: '1.5 mm² Stranded',
      formation: '7/0.53 mm',
      prices: { singleCore: 9870, twoCoreFlat: 24187, threeCoreRound: 34157, fourCoreRound: 45006 }
    },
    {
      description: '2.5 mm² Solid',
      formation: '1/1.78 mm',
      prices: { singleCore: 14891, twoCoreFlat: 35291, threeCoreRound: 50521, fourCoreRound: 67282 }
    },
    {
      description: '2.5 mm² Stranded',
      formation: '7/0.67 mm',
      prices: { singleCore: 16270, twoCoreFlat: 38467, threeCoreRound: 55068, fourCoreRound: 73337 }
    },
    {
      description: '4.0 mm² Stranded',
      formation: '7/0.85 mm',
      prices: { singleCore: 24082, twoCoreFlat: 55837, threeCoreRound: 80343, fourCoreRound: 106465 }
    },
    {
      description: '6.0 mm² Stranded',
      formation: '7/1.04 mm',
      prices: { singleCore: 35742, twoCoreFlat: 79919, threeCoreRound: 116170, fourCoreRound: 154674 }
    },
    {
      description: '10 mm² Stranded',
      formation: '7/1.35 mm',
      prices: { singleCore: 60124, twoCoreFlat: 131779, threeCoreRound: 192580, fourCoreRound: 257082 }
    },
    {
      description: '16 mm² Stranded',
      formation: '7/1.70 mm',
      prices: { singleCore: 95020, twoCoreFlat: 203732, threeCoreRound: 0, fourCoreRound: 0 }
    }
  ],
  'Flexible Cables BS 6500 IEC 60228': [
    {
      description: '0.5 mm² (14/.0076")',
      prices: { singleCore: 3906, twoCoreRound: 11512, threeCoreRound: 15495, fourCoreRound: 19994 }
    },
    {
      description: '0.75 mm² (23/.0076")',
      prices: { singleCore: 5563, twoCoreRound: 15734, threeCoreRound: 21556, fourCoreRound: 28013 }
    },
    {
      description: '1.0 mm² (40/.0076")',
      prices: { singleCore: 7289, twoCoreRound: 19804, threeCoreRound: 27460, fourCoreRound: 35795 }
    },
    {
      description: '1.5 mm² (70/.0076")',
      prices: { singleCore: 10678, twoCoreRound: 27687, threeCoreRound: 38607, fourCoreRound: 50365 }
    },
    {
      description: '2.5 mm² (110/.0076")',
      prices: { singleCore: 17533, twoCoreRound: 43801, threeCoreRound: 62204, fourCoreRound: 81170 }
    },
    {
      description: '4.0 mm² (162/.0076")',
      prices: { singleCore: 27637, twoCoreRound: 67189, threeCoreRound: 95715, fourCoreRound: 125597 }
    }
  ],
  'ALUMINIUM CABLES': {
    unarmoured: [
      { size: '10 mm² (7/0.052")', prices: { single: 165, two: 353, three: 541, threeHalf: 612, four: 682 } },
      { size: '16 mm² (7/0.064")', prices: { single: 227, two: 486, three: 721, threeHalf: 738, four: 832 } },
      { size: '25 mm² (19/0.052")', prices: { single: 311, two: 682, three: 1020, threeHalf: 1082, four: 1161 } },
      { size: '35 mm² (19/0.064")', prices: { single: 385, two: 832, three: 1271, threeHalf: 1321, four: 1482 } },
      { size: '50 mm² (19/0.072")', prices: { single: 541, two: 1091, three: 1679, threeHalf: 1809, four: 1992 } },
      { size: '70 mm² (19/0.083")', prices: { single: 698, two: 1404, three: 2008, threeHalf: 2392, four: 2644 } },
      { size: '95 mm² (37/0.072")', prices: { single: 965, two: 1942, three: 2729, threeHalf: 3215, four: 3600 } },
      { size: '120 mm² (37/0.083")', prices: { single: 1138, two: 2298, three: 3326, threeHalf: 4015, four: 4387 } },
      { size: '150 mm² (37/0.093")', prices: { single: 1388, two: 2808, three: 4062, threeHalf: 4753, four: 5365 } },
      { size: '185 mm² (37/0.103")', prices: { single: 1718, two: 3449, three: 5051, threeHalf: 5959, four: 6667 } },
      { size: '240 mm² (61/0.093")', prices: { single: 2212, two: 4462, three: 6424, threeHalf: 7915, four: 8596 } },
      { size: '300 mm² (61/0.103")', prices: { single: 2738, two: 5506, three: 7985, threeHalf: 9253, four: 10659 } },
      { size: '400 mm² (91/0.093")', prices: { single: 3420, two: 6879, three: 10188, threeHalf: 11844, four: 13482 } },
      { size: '500 mm² (91/0.103")', prices: { single: 4227, two: 0, three: 0, threeHalf: 0, four: 0 } },
      { size: '630 mm² (127/0.103")', prices: { single: 5309, two: 0, three: 0, threeHalf: 0, four: 0 } }
    ],
    armoured: [
      { size: '10 mm² (7/0.052")', prices: { single: 0, two: 776, three: 1059, threeHalf: 1227, four: 1365 } },
      { size: '16 mm² (7/0.064")', prices: { single: 0, two: 1091, three: 1294, threeHalf: 1553, four: 1765 } },
      { size: '25 mm² (19/0.052")', prices: { single: 0, two: 1411, three: 1773, threeHalf: 2086, four: 2173 } },
      { size: '35 mm² (19/0.064")', prices: { single: 0, two: 1686, three: 2118, threeHalf: 2408, four: 2573 } },
      { size: '50 mm² (19/0.072")', prices: { single: 824, two: 2094, three: 2654, threeHalf: 3044, four: 3600 } },
      { size: '70 mm² (19/0.083")', prices: { single: 1007, two: 2533, three: 3624, threeHalf: 4145, four: 4479 } },
      { size: '95 mm² (37/0.072")', prices: { single: 1302, two: 3538, three: 4573, threeHalf: 5639, four: 6024 } },
      { size: '120 mm² (37/0.083")', prices: { single: 1704, two: 4076, three: 5309, threeHalf: 6862, four: 7286 } },
      { size: '150 mm² (37/0.093")', prices: { single: 2149, two: 4786, three: 6847, threeHalf: 7796, four: 8549 } },
      { size: '185 mm² (37/0.103")', prices: { single: 2526, two: 6165, three: 8118, threeHalf: 9356, four: 10274 } },
      { size: '240 mm² (61/0.093")', prices: { single: 2979, two: 7459, three: 10032, threeHalf: 11545, four: 12541 } },
      { size: '300 mm² (61/0.103")', prices: { single: 3600, two: 8973, three: 11968, threeHalf: 13780, four: 15027 } },
      { size: '400 mm² (91/0.093")', prices: { single: 4424, two: 10789, three: 14479, threeHalf: 17851, four: 19444 } },
      { size: '500 mm² (91/0.103")', prices: { single: 5622, two: 0, three: 0, threeHalf: 0, four: 0 } },
      { size: '630 mm² (127/0.103")', prices: { single: 7369, two: 0, three: 0, threeHalf: 0, four: 0 } }
    ]
  },
  'POWER CABLES': {
    unarmoured: [
      { size: '16 mm² (7/0.064")', prices: { single: 1056, sc: 1082, three: 3178, threeHalf: 3729, four: 4262 } },
      { size: '25 mm² (19/0.052")', prices: { single: 1589, sc: 1628, three: 4965, threeHalf: 6057, four: 6660 } },
      { size: '35 mm² (19/0.064")', prices: { single: 2191, sc: 2236, three: 6797, threeHalf: 7923, four: 9137 } },
      { size: '50 mm² (19/0.072")', prices: { single: 2966, sc: 3027, three: 9170, threeHalf: 10914, four: 12417 } },
      { size: '70 mm² (19/0.083")', prices: { single: 4270, sc: 4341, three: 13147, threeHalf: 15563, four: 17792 } },
      { size: '95 mm² (37/0.072")', prices: { single: 5919, sc: 6015, three: 18185, threeHalf: 18698, four: 24491 } },
      { size: '120 mm² (37/0.083")', prices: { single: 7460, sc: 7567, three: 22889, threeHalf: 27542, four: 30829 } },
      { size: '150 mm² (37/0.093")', prices: { single: 9166, sc: 9300, three: 28099, threeHalf: 32834, four: 37854 } },
      { size: '185 mm² (37/0.103")', prices: { single: 11493, sc: 11659, three: 35213, threeHalf: 41732, four: 47449 } },
      { size: '240 mm² (61/0.093")', prices: { single: 15098, sc: 15307, three: 46194, threeHalf: 54429, four: 62254 } },
      { size: '300 mm² (61/0.103")', prices: { single: 18935, sc: 19190, three: 57901, threeHalf: 68039, four: 78043 } },
      { size: '400 mm² (91/0.093")', prices: { single: 24197, sc: 24508, three: 73943, threeHalf: 86668, four: 99668 } },
      { size: '500 mm² (91/0.103")', prices: { single: 30490, sc: 30864, three: 0, threeHalf: 0, four: 0 } },
      { size: '630 mm² (127/0.103")', prices: { single: 39296, sc: 39781, three: 0, threeHalf: 0, four: 0 } }
    ],
    armoured: [
      { size: '10 mm² (7/0.052")', prices: { single: 0, sc: 0, three: 2395, threeHalf: 2815, four: 3218 } },
      { size: '16 mm² (7/0.064")', prices: { single: 0, sc: 0, three: 3595, threeHalf: 4289, four: 4903 } },
      { size: '25 mm² (19/0.052")', prices: { single: 0, sc: 0, three: 5616, threeHalf: 6762, four: 7469 } },
      { size: '35 mm² (19/0.064")', prices: { single: 0, sc: 0, three: 7547, threeHalf: 8722, four: 10047 } },
      { size: '50 mm² (19/0.072")', prices: { single: 0, sc: 3321, three: 10062, threeHalf: 11856, four: 13755 } },
      { size: '70 mm² (19/0.083")', prices: { single: 0, sc: 4739, three: 14350, threeHalf: 16840, four: 19216 } },
      { size: '95 mm² (37/0.072")', prices: { single: 0, sc: 6498, three: 19644, threeHalf: 20252, four: 26263 } },
      { size: '120 mm² (37/0.083")', prices: { single: 0, sc: 8098, three: 24497, threeHalf: 29581, four: 33256 } },
      { size: '150 mm² (37/0.093")', prices: { single: 0, sc: 10013, three: 30254, threeHalf: 35107, four: 40540 } },
      { size: '185 mm² (37/0.103")', prices: { single: 0, sc: 12459, three: 37627, threeHalf: 44300, four: 50456 } },
      { size: '240 mm² (61/0.093")', prices: { single: 0, sc: 16211, three: 48923, threeHalf: 57349, four: 65646 } },
      { size: '300 mm² (61/0.103")', prices: { single: 0, sc: 20218, three: 61003, threeHalf: 71338, four: 81796 } },
      { size: '400 mm² (91/0.093")', prices: { single: 0, sc: 25820, three: 77901, threeHalf: 90869, four: 104463 } },
      { size: '500 mm² (91/0.103")', prices: { single: 0, sc: 32408, three: 0, threeHalf: 0, four: 0 } },
      { size: '630 mm² (127/0.103")', prices: { single: 0, sc: 41770, three: 0, threeHalf: 0, four: 0 } }
    ]
  }
};

const ProductManagement = () => {
  const [mode, setMode] = useState('edit'); // 'edit' or 'add'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCable, setSelectedCable] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedCopperType, setSelectedCopperType] = useState('');
  const [priceFields, setPriceFields] = useState({});
  const [newCableName, setNewCableName] = useState('');
  const [newCableFormation, setNewCableFormation] = useState('');

  // Helper function to get cable list based on category
  const getCableList = () => {
    if (!selectedCategory) return [];

    switch(selectedCategory) {
      case 'Imperial Sizes BS-2004':
      case 'Co-axial Cables(RG-Type)':
      case 'Telephone & Intercom Cables':
        return cableData[selectedCategory] || [];
      
      case 'General cables':
      case 'Flexible Cables BS 6500 IEC 60228':
        return cableData[selectedCategory] || [];
      
      case 'DC Solar Flexible Photovoltic UV-Resistant Cable':
        return cableData[selectedCategory].cables || [];
      
      case 'POWER CABLES':
      case 'ALUMINIUM CABLES':
        if (!selectedSubCategory) return [];
        const data = cableData[selectedCategory];
        return selectedSubCategory === 'UN-ARMOURED CABLES' 
          ? data.unarmoured 
          : data.armoured;
      
      default:
        return [];
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedCable('');
    setSelectedSubCategory('');
    setSelectedCopperType('');
    setPriceFields({});
    
    // Set default subcategory for categories that need it
    if (category === 'POWER CABLES' || category === 'ALUMINIUM CABLES') {
      setSelectedSubCategory('UN-ARMOURED CABLES');
    }
  };

  // Handle cable selection for editing
  const handleCableSelect = (cable) => {
    setSelectedCable(cable);
    
    // Extract current prices based on category
    const cableList = getCableList();
    const selectedCableData = cableList.find(item => {
      if (selectedCategory === 'DC Solar Flexible Photovoltic UV-Resistant Cable') {
        return item.name === cable;
      } else if (selectedCategory === 'General cables' || selectedCategory === 'Flexible Cables BS 6500 IEC 60228') {
        return item.description === cable;
      } else if (selectedCategory === 'POWER CABLES' || selectedCategory === 'ALUMINIUM CABLES') {
        return item.size === cable;
      } else {
        return item.name === cable;
      }
    });

    if (selectedCableData) {
      if (selectedCategory === 'DC Solar Flexible Photovoltic UV-Resistant Cable') {
        setPriceFields({
          plainPrice: selectedCableData.plainPrice || 0,
          tinnedPrice: selectedCableData.tinnedPrice || 0
        });
      } else if (selectedCategory === 'General cables' || selectedCategory === 'Flexible Cables BS 6500 IEC 60228') {
        setPriceFields(selectedCableData.prices || {});
      } else if (selectedCategory === 'POWER CABLES' || selectedCategory === 'ALUMINIUM CABLES') {
        setPriceFields(selectedCableData.prices || {});
      } else {
        setPriceFields({ price: selectedCableData.price || 0 });
      }
    }
  };

  // Handle price field change
  const handlePriceChange = (field, value) => {
    setPriceFields(prev => ({
      ...prev,
      [field]: value ? parseFloat(value) : 0
    }));
  };

  // Handle save (both edit and add)
  const handleSave = () => {
    if (mode === 'edit' && !selectedCable) {
      alert('Please select a cable to edit');
      return;
    }

    if (mode === 'add' && !newCableName) {
      alert('Please enter a cable name');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Saving data:', {
      mode,
      category: selectedCategory,
      subCategory: selectedSubCategory,
      cable: mode === 'edit' ? selectedCable : newCableName,
      formation: newCableFormation,
      prices: priceFields
    });

    // Reset form after save
    setMode('edit');
    setSelectedCable('');
    setNewCableName('');
    setNewCableFormation('');
    setPriceFields({});
    
    alert(mode === 'edit' ? 'Price updated successfully!' : 'New cable added successfully!');
  };

  // Reset form
  const handleReset = () => {
    setMode('edit');
    setSelectedCategory('');
    setSelectedCable('');
    setSelectedSubCategory('');
    setSelectedCopperType('');
    setNewCableName('');
    setNewCableFormation('');
    setPriceFields({});
  };

  // Get price fields configuration based on category
  const getPriceFieldsConfig = () => {
    switch(selectedCategory) {
      case 'Imperial Sizes BS-2004':
      case 'Co-axial Cables(RG-Type)':
      case 'Telephone & Intercom Cables':
        return [
          { label: 'Price (Rs.)', field: 'price' }
        ];
      
      case 'DC Solar Flexible Photovoltic UV-Resistant Cable':
        return [
          { label: 'Plain Copper Price (Rs.)', field: 'plainPrice' },
          { label: 'Tinned Copper Price (Rs.)', field: 'tinnedPrice' }
        ];
      
      case 'General cables':
        return [
          { label: 'Single Core Price (Rs.)', field: 'singleCore' },
          { label: '2/Core Flat Price (Rs.)', field: 'twoCoreFlat' },
          { label: '3/Core Round Price (Rs.)', field: 'threeCoreRound' },
          { label: '4/Core Round Price (Rs.)', field: 'fourCoreRound' }
        ];
      
      case 'Flexible Cables BS 6500 IEC 60228':
        return [
          { label: 'Single Core Price (Rs.)', field: 'singleCore' },
          { label: '2/Core Round Price (Rs.)', field: 'twoCoreRound' },
          { label: '3/Core Round Price (Rs.)', field: 'threeCoreRound' },
          { label: '4/Core Round Price (Rs.)', field: 'fourCoreRound' }
        ];
      
      case 'POWER CABLES':
        return [
          { label: 'Single/Core PVC (Rs.)', field: 'single' },
          { label: 'S/C PVC/PVC (Rs.)', field: 'sc' },
          { label: '3/C PVC/PVC (Rs.)', field: 'three' },
          { label: '3.5/C PVC/PVC (Rs.)', field: 'threeHalf' },
          { label: '4/C PVC/PVC (Rs.)', field: 'four' }
        ];
      
      case 'ALUMINIUM CABLES':
        return [
          { label: 'Single (Rs.)', field: 'single' },
          { label: '2/C (Rs.)', field: 'two' },
          { label: '3/C (Rs.)', field: 'three' },
          { label: '3.5/C (Rs.)', field: 'threeHalf' },
          { label: '4/C (Rs.)', field: 'four' }
        ];
      
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Cable Prices</h1>
          <p className="text-gray-400">Edit existing cable prices or add new cables to the database</p>
          
          {/* Mode Toggle */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setMode('edit')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === 'edit'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Edit Existing Cable
            </button>
            <button
              onClick={() => setMode('add')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === 'add'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Add New Cable
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-6">
            {mode === 'edit' ? 'Edit Cable Price' : 'Add New Cable'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Cable Category *
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sub-category for specific categories */}
            {(selectedCategory === 'POWER CABLES' || selectedCategory === 'ALUMINIUM CABLES') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cable Type *
                </label>
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="UN-ARMOURED CABLES">UN-ARMOURED CABLES</option>
                  <option value="ARMOURED CABLES">ARMOURED CABLES</option>
                </select>
              </div>
            )}

            {/* Cable Selection (Edit Mode) */}
            {mode === 'edit' && selectedCategory && (
              <div className={selectedCategory === 'POWER CABLES' || selectedCategory === 'ALUMINIUM CABLES' 
                ? 'md:col-span-2' 
                : ''}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Cable to Edit *
                </label>
                <select
                  value={selectedCable}
                  onChange={(e) => handleCableSelect(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a cable</option>
                  {getCableList().map((cable, index) => (
                    <option key={index} value={
                      selectedCategory === 'DC Solar Flexible Photovoltic UV-Resistant Cable' ? cable.name :
                      selectedCategory === 'General cables' || selectedCategory === 'Flexible Cables BS 6500 IEC 60228' ? cable.description :
                      selectedCategory === 'POWER CABLES' || selectedCategory === 'ALUMINIUM CABLES' ? cable.size :
                      cable.name
                    }>
                      {selectedCategory === 'DC Solar Flexible Photovoltic UV-Resistant Cable' ? cable.name :
                       selectedCategory === 'General cables' ? `${cable.description} - ${cable.formation}` :
                       selectedCategory === 'Flexible Cables BS 6500 IEC 60228' ? cable.description :
                       selectedCategory === 'POWER CABLES' || selectedCategory === 'ALUMINIUM CABLES' ? cable.size :
                       cable.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* New Cable Name (Add Mode) */}
            {mode === 'add' && selectedCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cable Name *
                </label>
                <input
                  type="text"
                  value={newCableName}
                  onChange={(e) => setNewCableName(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter cable name/description"
                />
              </div>
            )}

            {/* Formation Field (Add Mode for General cables) */}
            {mode === 'add' && selectedCategory === 'General cables' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cable Formation
                </label>
                <input
                  type="text"
                  value={newCableFormation}
                  onChange={(e) => setNewCableFormation(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 1/1.13 mm"
                />
              </div>
            )}

            {/* Price Fields */}
            {((mode === 'edit' && selectedCable) || (mode === 'add' && newCableName)) && (
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {mode === 'edit' ? 'Edit Prices' : 'Set Prices'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getPriceFieldsConfig().map((fieldConfig, index) => (
                    <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {fieldConfig.label}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">Rs.</span>
                        <input
                          type="number"
                          min="0"
                          value={priceFields[fieldConfig.field] || ''}
                          onChange={(e) => handlePriceChange(fieldConfig.field, e.target.value)}
                          className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter price"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === 'edit'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {mode === 'edit' ? 'Update Prices' : 'Add New Cable'}
            </button>
          </div>
        </div>

        {/* Information Panel */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <p className="text-gray-300">
                <span className="font-medium">Edit Mode:</span> Select a cable category and then choose a specific cable to update its prices.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <p className="text-gray-300">
                <span className="font-medium">Add Mode:</span> Enter details for a new cable and set its prices across all available types.
              </p>
            </div>
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                ⚠️ Note: Price changes will affect all future quotations. Make sure to enter correct prices.
              </p>
            </div>
          </div>

          {/* Current Selection Summary */}
          {selectedCategory && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="text-md font-semibold text-white mb-3">Current Selection</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Mode</p>
                  <p className="text-white font-medium">
                    {mode === 'edit' ? 'Editing' : 'Adding New'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Category</p>
                  <p className="text-white font-medium">{selectedCategory}</p>
                </div>
                {selectedSubCategory && (
                  <div>
                    <p className="text-gray-400 text-sm">Type</p>
                    <p className="text-white font-medium">{selectedSubCategory}</p>
                  </div>
                )}
                {mode === 'edit' && selectedCable && (
                  <div className="md:col-span-3">
                    <p className="text-gray-400 text-sm">Selected Cable</p>
                    <p className="text-white font-medium">{selectedCable}</p>
                  </div>
                )}
                {mode === 'add' && newCableName && (
                  <div className="md:col-span-3">
                    <p className="text-gray-400 text-sm">New Cable Name</p>
                    <p className="text-white font-medium">{newCableName}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;



// import React from 'react'
// import { useState } from 'react';

// // Cable data (same as before)
// const categories = [
//   'General cables',
//   'Flexible Cables BS 6500 IEC 60228',
//   'Imperial Sizes BS-2004',
//   'Co-axial Cables(RG-Type)',
//   'Telephone & Intercom Cables',
//   'DC Solar Flexible Photovoltic UV-Resistant Cable',
//   'POWER CABLES',
//   'ALUMINIUM CABLES'
// ];

// const cableData = {
//   'Imperial Sizes BS-2004': [
//     { name: '1/.044" Solid', price: 6577 },
//     { name: '3/.029" Stranded', price: 8490 },
//     { name: '7/.029" Stranded', price: 18591 },
//     { name: '7/.036" Stranded', price: 28760 },
//     { name: '7/.044" Stranded', price: 42420 },
//     { name: '7/.052" Stranded', price: 58717 },
//     { name: '7/.064" Stranded', price: 89952 }
//   ],
//   'Co-axial Cables(RG-Type)': [
//     { name: 'RG-6U', price: 20681 },
//     { name: 'RG-7U', price: 23291 },
//     { name: 'RG-11U', price: 30610 },
//     { name: 'CAT-6', price: 22205 },
//     { name: 'CCTV', price: 15920 },
//     { name: 'Fire Alarm (1.5mm²)', price: 50149 },
//     { name: 'Fire Alarm (2.5mm²)', price: 78067 },
//     { name: 'Speaker Wire (1.5mm²)', price: 29324 },
//     { name: 'Speaker Wire (2.5mm²)', price: 50007 }
//   ],
//   'Telephone & Intercom Cables': [
//     { name: 'Single Pair', price: 7346 },
//     { name: 'Two Pairs', price: 11167 },
//     { name: 'Three Pairs', price: 15720 },
//     { name: 'Four Pairs', price: 22102 },
//     { name: 'Five Pairs', price: 24506 },
//     { name: 'Six Pairs', price: 32498 },
//     { name: 'Seven Pairs', price: 35893 },
//     { name: 'Eight Pairs', price: 43735 },
//     { name: 'Nine Pairs', price: 48578 },
//     { name: 'Ten Pairs', price: 52859 }
//   ],
//   'DC Solar Flexible Photovoltic UV-Resistant Cable': {
//     types: ['PVC/PVC', 'XLPE/PVC', 'XLPO/XLPO'],
//     copperTypes: ['Plain Copper', 'TINNED Copper'],
//     cables: [
//       { name: '1.5 mm²', plainPrice: 12185, tinnedPrice: 13745 },
//       { name: '2.5 mm²', plainPrice: 19685, tinnedPrice: 22281 },
//       { name: '4.0 mm²', plainPrice: 30217, tinnedPrice: 34397 },
//       { name: '6.0 mm²', plainPrice: 44424, tinnedPrice: 50699 },
//       { name: '10 mm²', plainPrice: 74922, tinnedPrice: 85541 }
//     ]
//   },
//   'General cables': [
//     {
//       description: '1.0mm² Solid',
//       formation: '1/1.13 mm',
//       prices: { singleCore: 6590, twoCoreFlat: 16575, threeCoreRound: 23083, fourCoreRound: 30399 }
//     },
//     {
//       description: '1.5mm² Solid',
//       formation: '1/1.38 mm',
//       prices: { singleCore: 8892, twoCoreFlat: 22190, threeCoreRound: 31336, fourCoreRound: 41290 }
//     },
//     {
//       description: '1.5 mm² Stranded',
//       formation: '7/0.53 mm',
//       prices: { singleCore: 9870, twoCoreFlat: 24187, threeCoreRound: 34157, fourCoreRound: 45006 }
//     },
//     {
//       description: '2.5 mm² Solid',
//       formation: '1/1.78 mm',
//       prices: { singleCore: 14891, twoCoreFlat: 35291, threeCoreRound: 50521, fourCoreRound: 67282 }
//     },
//     {
//       description: '2.5 mm² Stranded',
//       formation: '7/0.67 mm',
//       prices: { singleCore: 16270, twoCoreFlat: 38467, threeCoreRound: 55068, fourCoreRound: 73337 }
//     },
//     {
//       description: '4.0 mm² Stranded',
//       formation: '7/0.85 mm',
//       prices: { singleCore: 24082, twoCoreFlat: 55837, threeCoreRound: 80343, fourCoreRound: 106465 }
//     },
//     {
//       description: '6.0 mm² Stranded',
//       formation: '7/1.04 mm',
//       prices: { singleCore: 35742, twoCoreFlat: 79919, threeCoreRound: 116170, fourCoreRound: 154674 }
//     },
//     {
//       description: '10 mm² Stranded',
//       formation: '7/1.35 mm',
//       prices: { singleCore: 60124, twoCoreFlat: 131779, threeCoreRound: 192580, fourCoreRound: 257082 }
//     },
//     {
//       description: '16 mm² Stranded',
//       formation: '7/1.70 mm',
//       prices: { singleCore: 95020, twoCoreFlat: 203732, threeCoreRound: 0, fourCoreRound: 0 }
//     }
//   ],
//   'Flexible Cables BS 6500 IEC 60228': [
//     {
//       description: '0.5 mm² (14/.0076")',
//       prices: { singleCore: 3906, twoCoreRound: 11512, threeCoreRound: 15495, fourCoreRound: 19994 }
//     },
//     {
//       description: '0.75 mm² (23/.0076")',
//       prices: { singleCore: 5563, twoCoreRound: 15734, threeCoreRound: 21556, fourCoreRound: 28013 }
//     },
//     {
//       description: '1.0 mm² (40/.0076")',
//       prices: { singleCore: 7289, twoCoreRound: 19804, threeCoreRound: 27460, fourCoreRound: 35795 }
//     },
//     {
//       description: '1.5 mm² (70/.0076")',
//       prices: { singleCore: 10678, twoCoreRound: 27687, threeCoreRound: 38607, fourCoreRound: 50365 }
//     },
//     {
//       description: '2.5 mm² (110/.0076")',
//       prices: { singleCore: 17533, twoCoreRound: 43801, threeCoreRound: 62204, fourCoreRound: 81170 }
//     },
//     {
//       description: '4.0 mm² (162/.0076")',
//       prices: { singleCore: 27637, twoCoreRound: 67189, threeCoreRound: 95715, fourCoreRound: 125597 }
//     }
//   ],
//   'ALUMINIUM CABLES': {
//     unarmoured: [
//       { size: '10 mm² (7/0.052")', prices: { single: 165, two: 353, three: 541, threeHalf: 612, four: 682 } },
//       { size: '16 mm² (7/0.064")', prices: { single: 227, two: 486, three: 721, threeHalf: 738, four: 832 } },
//       { size: '25 mm² (19/0.052")', prices: { single: 311, two: 682, three: 1020, threeHalf: 1082, four: 1161 } },
//       { size: '35 mm² (19/0.064")', prices: { single: 385, two: 832, three: 1271, threeHalf: 1321, four: 1482 } },
//       { size: '50 mm² (19/0.072")', prices: { single: 541, two: 1091, three: 1679, threeHalf: 1809, four: 1992 } },
//       { size: '70 mm² (19/0.083")', prices: { single: 698, two: 1404, three: 2008, threeHalf: 2392, four: 2644 } },
//       { size: '95 mm² (37/0.072")', prices: { single: 965, two: 1942, three: 2729, threeHalf: 3215, four: 3600 } },
//       { size: '120 mm² (37/0.083")', prices: { single: 1138, two: 2298, three: 3326, threeHalf: 4015, four: 4387 } },
//       { size: '150 mm² (37/0.093")', prices: { single: 1388, two: 2808, three: 4062, threeHalf: 4753, four: 5365 } },
//       { size: '185 mm² (37/0.103")', prices: { single: 1718, two: 3449, three: 5051, threeHalf: 5959, four: 6667 } },
//       { size: '240 mm² (61/0.093")', prices: { single: 2212, two: 4462, three: 6424, threeHalf: 7915, four: 8596 } },
//       { size: '300 mm² (61/0.103")', prices: { single: 2738, two: 5506, three: 7985, threeHalf: 9253, four: 10659 } },
//       { size: '400 mm² (91/0.093")', prices: { single: 3420, two: 6879, three: 10188, threeHalf: 11844, four: 13482 } },
//       { size: '500 mm² (91/0.103")', prices: { single: 4227, two: 0, three: 0, threeHalf: 0, four: 0 } },
//       { size: '630 mm² (127/0.103")', prices: { single: 5309, two: 0, three: 0, threeHalf: 0, four: 0 } }
//     ],
//     armoured: [
//       { size: '10 mm² (7/0.052")', prices: { single: 0, two: 776, three: 1059, threeHalf: 1227, four: 1365 } },
//       { size: '16 mm² (7/0.064")', prices: { single: 0, two: 1091, three: 1294, threeHalf: 1553, four: 1765 } },
//       { size: '25 mm² (19/0.052")', prices: { single: 0, two: 1411, three: 1773, threeHalf: 2086, four: 2173 } },
//       { size: '35 mm² (19/0.064")', prices: { single: 0, two: 1686, three: 2118, threeHalf: 2408, four: 2573 } },
//       { size: '50 mm² (19/0.072")', prices: { single: 824, two: 2094, three: 2654, threeHalf: 3044, four: 3600 } },
//       { size: '70 mm² (19/0.083")', prices: { single: 1007, two: 2533, three: 3624, threeHalf: 4145, four: 4479 } },
//       { size: '95 mm² (37/0.072")', prices: { single: 1302, two: 3538, three: 4573, threeHalf: 5639, four: 6024 } },
//       { size: '120 mm² (37/0.083")', prices: { single: 1704, two: 4076, three: 5309, threeHalf: 6862, four: 7286 } },
//       { size: '150 mm² (37/0.093")', prices: { single: 2149, two: 4786, three: 6847, threeHalf: 7796, four: 8549 } },
//       { size: '185 mm² (37/0.103")', prices: { single: 2526, two: 6165, three: 8118, threeHalf: 9356, four: 10274 } },
//       { size: '240 mm² (61/0.093")', prices: { single: 2979, two: 7459, three: 10032, threeHalf: 11545, four: 12541 } },
//       { size: '300 mm² (61/0.103")', prices: { single: 3600, two: 8973, three: 11968, threeHalf: 13780, four: 15027 } },
//       { size: '400 mm² (91/0.093")', prices: { single: 4424, two: 10789, three: 14479, threeHalf: 17851, four: 19444 } },
//       { size: '500 mm² (91/0.103")', prices: { single: 5622, two: 0, three: 0, threeHalf: 0, four: 0 } },
//       { size: '630 mm² (127/0.103")', prices: { single: 7369, two: 0, three: 0, threeHalf: 0, four: 0 } }
//     ]
//   },
//   'POWER CABLES': {
//     unarmoured: [
//       { size: '16 mm² (7/0.064")', prices: { single: 1056, sc: 1082, three: 3178, threeHalf: 3729, four: 4262 } },
//       { size: '25 mm² (19/0.052")', prices: { single: 1589, sc: 1628, three: 4965, threeHalf: 6057, four: 6660 } },
//       { size: '35 mm² (19/0.064")', prices: { single: 2191, sc: 2236, three: 6797, threeHalf: 7923, four: 9137 } },
//       { size: '50 mm² (19/0.072")', prices: { single: 2966, sc: 3027, three: 9170, threeHalf: 10914, four: 12417 } },
//       { size: '70 mm² (19/0.083")', prices: { single: 4270, sc: 4341, three: 13147, threeHalf: 15563, four: 17792 } },
//       { size: '95 mm² (37/0.072")', prices: { single: 5919, sc: 6015, three: 18185, threeHalf: 18698, four: 24491 } },
//       { size: '120 mm² (37/0.083")', prices: { single: 7460, sc: 7567, three: 22889, threeHalf: 27542, four: 30829 } },
//       { size: '150 mm² (37/0.093")', prices: { single: 9166, sc: 9300, three: 28099, threeHalf: 32834, four: 37854 } },
//       { size: '185 mm² (37/0.103")', prices: { single: 11493, sc: 11659, three: 35213, threeHalf: 41732, four: 47449 } },
//       { size: '240 mm² (61/0.093")', prices: { single: 15098, sc: 15307, three: 46194, threeHalf: 54429, four: 62254 } },
//       { size: '300 mm² (61/0.103")', prices: { single: 18935, sc: 19190, three: 57901, threeHalf: 68039, four: 78043 } },
//       { size: '400 mm² (91/0.093")', prices: { single: 24197, sc: 24508, three: 73943, threeHalf: 86668, four: 99668 } },
//       { size: '500 mm² (91/0.103")', prices: { single: 30490, sc: 30864, three: 0, threeHalf: 0, four: 0 } },
//       { size: '630 mm² (127/0.103")', prices: { single: 39296, sc: 39781, three: 0, threeHalf: 0, four: 0 } }
//     ],
//     armoured: [
//       { size: '10 mm² (7/0.052")', prices: { single: 0, sc: 0, three: 2395, threeHalf: 2815, four: 3218 } },
//       { size: '16 mm² (7/0.064")', prices: { single: 0, sc: 0, three: 3595, threeHalf: 4289, four: 4903 } },
//       { size: '25 mm² (19/0.052")', prices: { single: 0, sc: 0, three: 5616, threeHalf: 6762, four: 7469 } },
//       { size: '35 mm² (19/0.064")', prices: { single: 0, sc: 0, three: 7547, threeHalf: 8722, four: 10047 } },
//       { size: '50 mm² (19/0.072")', prices: { single: 0, sc: 3321, three: 10062, threeHalf: 11856, four: 13755 } },
//       { size: '70 mm² (19/0.083")', prices: { single: 0, sc: 4739, three: 14350, threeHalf: 16840, four: 19216 } },
//       { size: '95 mm² (37/0.072")', prices: { single: 0, sc: 6498, three: 19644, threeHalf: 20252, four: 26263 } },
//       { size: '120 mm² (37/0.083")', prices: { single: 0, sc: 8098, three: 24497, threeHalf: 29581, four: 33256 } },
//       { size: '150 mm² (37/0.093")', prices: { single: 0, sc: 10013, three: 30254, threeHalf: 35107, four: 40540 } },
//       { size: '185 mm² (37/0.103")', prices: { single: 0, sc: 12459, three: 37627, threeHalf: 44300, four: 50456 } },
//       { size: '240 mm² (61/0.093")', prices: { single: 0, sc: 16211, three: 48923, threeHalf: 57349, four: 65646 } },
//       { size: '300 mm² (61/0.103")', prices: { single: 0, sc: 20218, three: 61003, threeHalf: 71338, four: 81796 } },
//       { size: '400 mm² (91/0.093")', prices: { single: 0, sc: 25820, three: 77901, threeHalf: 90869, four: 104463 } },
//       { size: '500 mm² (91/0.103")', prices: { single: 0, sc: 32408, three: 0, threeHalf: 0, four: 0 } },
//       { size: '630 mm² (127/0.103")', prices: { single: 0, sc: 41770, three: 0, threeHalf: 0, four: 0 } }
//     ]
//   }
// };

// const ProductManagement = () => {
//   const [mode, setMode] = useState('edit'); // 'edit' or 'add'
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedCable, setSelectedCable] = useState('');
//   const [selectedSubCategory, setSelectedSubCategory] = useState('');
//   const [priceFields, setPriceFields] = useState({});
//   const [newCableName, setNewCableName] = useState('');
//   const [newCableFormation, setNewCableFormation] = useState('');
  
//   // New state for adding new category
//   const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
//   const [newCategoryName, setNewCategoryName] = useState('');
//   const [newCategoryFields, setNewCategoryFields] = useState({
//     size: '',
//     type: '',
//     notes: ''
//   });

//   // Helper function to get cable list based on category
//   const getCableList = () => {
//     if (!selectedCategory) return [];

//     switch(selectedCategory) {
//       case 'Imperial Sizes BS-2004':
//       case 'Co-axial Cables(RG-Type)':
//       case 'Telephone & Intercom Cables':
//         return cableData[selectedCategory] || [];
      
//       case 'General cables':
//       case 'Flexible Cables BS 6500 IEC 60228':
//         return cableData[selectedCategory] || [];
      
//       case 'DC Solar Flexible Photovoltic UV-Resistant Cable':
//         return cableData[selectedCategory].cables || [];
      
//       case 'POWER CABLES':
//       case 'ALUMINIUM CABLES':
//         if (!selectedSubCategory) return [];
//         const data = cableData[selectedCategory];
//         return selectedSubCategory === 'UN-ARMOURED CABLES' 
//           ? data.unarmoured 
//           : data.armoured;
      
//       default:
//         return [];
//     }
//   };

//   // Handle category change
//   const handleCategoryChange = (category) => {
//     if (category === 'ADD_NEW_CATEGORY') {
//       setIsAddingNewCategory(true);
//       setSelectedCategory('');
//       setSelectedCable('');
//       setSelectedSubCategory('');
//       setPriceFields({});
//       setNewCableName('');
//       setNewCableFormation('');
//       setNewCategoryName('');
//       setNewCategoryFields({
//         size: '',
//         type: '',
//         notes: ''
//       });
//     } else {
//       setIsAddingNewCategory(false);
//       setSelectedCategory(category);
//       setSelectedCable('');
//       setSelectedSubCategory('');
//       setPriceFields({});
//       setNewCableName('');
//       setNewCableFormation('');
//       setNewCategoryName('');
//       setNewCategoryFields({
//         size: '',
//         type: '',
//         notes: ''
//       });
      
//       // Set default subcategory for categories that need it
//       if (category === 'POWER CABLES' || category === 'ALUMINIUM CABLES') {
//         setSelectedSubCategory('UN-ARMOURED CABLES');
//       }
//     }
//   };

//   // Handle cable selection for editing
//   const handleCableSelect = (cable) => {
//     setSelectedCable(cable);
    
//     // Extract current prices based on category
//     const cableList = getCableList();
//     const selectedCableData = cableList.find(item => {
//       if (selectedCategory === 'DC Solar Flexible Photovoltic UV-Resistant Cable') {
//         return item.name === cable;
//       } else if (selectedCategory === 'General cables' || selectedCategory === 'Flexible Cables BS 6500 IEC 60228') {
//         return item.description === cable;
//       } else if (selectedCategory === 'POWER CABLES' || selectedCategory === 'ALUMINIUM CABLES') {
//         return item.size === cable;
//       } else {
//         return item.name === cable;
//       }
//     });

//     if (selectedCableData) {
//       if (selectedCategory === 'DC Solar Flexible Photovoltic UV-Resistant Cable') {
//         setPriceFields({
//           plainPrice: selectedCableData.plainPrice || 0,
//           tinnedPrice: selectedCableData.tinnedPrice || 0
//         });
//       } else if (selectedCategory === 'General cables' || selectedCategory === 'Flexible Cables BS 6500 IEC 60228') {
//         setPriceFields(selectedCableData.prices || {});
//       } else if (selectedCategory === 'POWER CABLES' || selectedCategory === 'ALUMINIUM CABLES') {
//         setPriceFields(selectedCableData.prices || {});
//       } else {
//         setPriceFields({ price: selectedCableData.price || 0 });
//       }
//     }
//   };

//   // Handle price field change
//   const handlePriceChange = (field, value) => {
//     setPriceFields(prev => ({
//       ...prev,
//       [field]: value ? parseFloat(value) : 0
//     }));
//   };

//   // Handle new category field change
//   const handleNewCategoryFieldChange = (field, value) => {
//     setNewCategoryFields(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Handle save (both edit and add)
//   const handleSave = () => {
//     if (isAddingNewCategory) {
//       // Save new category
//       if (!newCategoryName) {
//         alert('Please enter a category name');
//         return;
//       }

//       console.log('Adding new category:', {
//         category: newCategoryName,
//         fields: newCategoryFields,
//         prices: priceFields
//       });

//       alert('New category added successfully!');
//       handleReset();
//       return;
//     }

//     // Original save logic
//     if (mode === 'edit' && !selectedCable) {
//       alert('Please select a cable to edit');
//       return;
//     }

//     if (mode === 'add' && !newCableName) {
//       alert('Please enter a cable name');
//       return;
//     }

//     console.log('Saving data:', {
//       mode,
//       category: selectedCategory,
//       subCategory: selectedSubCategory,
//       cable: mode === 'edit' ? selectedCable : newCableName,
//       formation: newCableFormation,
//       prices: priceFields
//     });

//     // Reset form after save
//     handleReset();
    
//     alert(mode === 'edit' ? 'Price updated successfully!' : 'New cable added successfully!');
//   };

//   // Reset form
//   const handleReset = () => {
//     setMode('edit');
//     setIsAddingNewCategory(false);
//     setSelectedCategory('');
//     setSelectedCable('');
//     setSelectedSubCategory('');
//     setNewCableName('');
//     setNewCableFormation('');
//     setPriceFields({});
//     setNewCategoryName('');
//     setNewCategoryFields({
//       size: '',
//       type: '',
//       notes: ''
//     });
//   };

//   // Get price fields configuration based on category
//   const getPriceFieldsConfig = () => {
//     if (isAddingNewCategory) {
//       return [
//         { label: 'Price (Rs.)', field: 'price' }
//       ];
//     }

//     switch(selectedCategory) {
//       case 'Imperial Sizes BS-2004':
//       case 'Co-axial Cables(RG-Type)':
//       case 'Telephone & Intercom Cables':
//         return [
//           { label: 'Price (Rs.)', field: 'price' }
//         ];
      
//       case 'DC Solar Flexible Photovoltic UV-Resistant Cable':
//         return [
//           { label: 'Plain Copper Price (Rs.)', field: 'plainPrice' },
//           { label: 'Tinned Copper Price (Rs.)', field: 'tinnedPrice' }
//         ];
      
//       case 'General cables':
//         return [
//           { label: 'Single Core Price (Rs.)', field: 'singleCore' },
//           { label: '2/Core Flat Price (Rs.)', field: 'twoCoreFlat' },
//           { label: '3/Core Round Price (Rs.)', field: 'threeCoreRound' },
//           { label: '4/Core Round Price (Rs.)', field: 'fourCoreRound' }
//         ];
      
//       case 'Flexible Cables BS 6500 IEC 60228':
//         return [
//           { label: 'Single Core Price (Rs.)', field: 'singleCore' },
//           { label: '2/Core Round Price (Rs.)', field: 'twoCoreRound' },
//           { label: '3/Core Round Price (Rs.)', field: 'threeCoreRound' },
//           { label: '4/Core Round Price (Rs.)', field: 'fourCoreRound' }
//         ];
      
//       case 'POWER CABLES':
//         return [
//           { label: 'Single/Core PVC (Rs.)', field: 'single' },
//           { label: 'S/C PVC/PVC (Rs.)', field: 'sc' },
//           { label: '3/C PVC/PVC (Rs.)', field: 'three' },
//           { label: '3.5/C PVC/PVC (Rs.)', field: 'threeHalf' },
//           { label: '4/C PVC/PVC (Rs.)', field: 'four' }
//         ];
      
//       case 'ALUMINIUM CABLES':
//         return [
//           { label: 'Single (Rs.)', field: 'single' },
//           { label: '2/C (Rs.)', field: 'two' },
//           { label: '3/C (Rs.)', field: 'three' },
//           { label: '3.5/C (Rs.)', field: 'threeHalf' },
//           { label: '4/C (Rs.)', field: 'four' }
//         ];
      
//       default:
//         return [];
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Manage Cable Prices</h1>
//           <p className="text-gray-400">Edit existing cable prices or add new cables to the database</p>
          
//           {/* Mode Toggle */}
//           <div className="flex gap-4 mt-6">
//             <button
//               onClick={() => {
//                 setMode('edit');
//                 setIsAddingNewCategory(false);
//                 setSelectedCategory('');
//                 setSelectedCable('');
//                 setNewCableName('');
//                 setNewCableFormation('');
//                 setPriceFields({});
//               }}
//               className={`px-6 py-3 rounded-lg font-medium transition-colors ${
//                 mode === 'edit' && !isAddingNewCategory
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//               }`}
//             >
//               Edit Existing Cable
//             </button>
//             <button
//               onClick={() => {
//                 setMode('add');
//                 setIsAddingNewCategory(false);
//                 setSelectedCategory('');
//                 setSelectedCable('');
//                 setNewCableName('');
//                 setNewCableFormation('');
//                 setPriceFields({});
//               }}
//               className={`px-6 py-3 rounded-lg font-medium transition-colors ${
//                 mode === 'add' && !isAddingNewCategory
//                   ? 'bg-green-600 text-white'
//                   : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//               }`}
//             >
//               Add New Cable
//             </button>
//           </div>
//         </div>

//         {/* Main Form */}
//         <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//           <h2 className="text-xl font-bold mb-6">
//             {isAddingNewCategory ? 'Add New Category' : mode === 'edit' ? 'Edit Cable Price' : 'Add New Cable'}
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Category Selection - Modified to include Add New Category option */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Select Cable Category *
//               </label>
//               <select
//                 value={isAddingNewCategory ? 'ADD_NEW_CATEGORY' : selectedCategory}
//                 onChange={(e) => handleCategoryChange(e.target.value)}
//                 className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="">Select a category</option>
//                 {categories.map((category, index) => (
//                   <option key={index} value={category}>{category}</option>
//                 ))}
//                 {/* Add New Category option in both Edit and Add modes */}
//                 <option value="ADD_NEW_CATEGORY" className="text-green-400 bg-gray-800">
//                   ＋ Add New Category
//                 </option>
//               </select>
//             </div>

//             {/* New Category Form Fields - Only show when "Add New Category" is selected */}
//             {isAddingNewCategory && (
//               <>
//                 <div>
//                   <label className="block text-sm font-medium text-green-300 mb-2">
//                     Category Name *
//                   </label>
//                   <input
//                     type="text"
//                     value={newCategoryName}
//                     onChange={(e) => setNewCategoryName(e.target.value)}
//                     className="w-full p-3 bg-gray-700 border border-green-500/50 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                     placeholder="Enter new category name"
//                   />
//                 </div>

//                 {/* Optional Fields for New Category */}
//                 <div className="md:col-span-2">
//                   <p className="text-gray-400 text-sm mb-3">Optional Fields</p>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Size
//                       </label>
//                       <input
//                         type="text"
//                         value={newCategoryFields.size}
//                         onChange={(e) => handleNewCategoryFieldChange('size', e.target.value)}
//                         className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="e.g., mm², AWG"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Type
//                       </label>
//                       <input
//                         type="text"
//                         value={newCategoryFields.type}
//                         onChange={(e) => handleNewCategoryFieldChange('type', e.target.value)}
//                         className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="e.g., Stranded, Solid"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Notes
//                       </label>
//                       <input
//                         type="text"
//                         value={newCategoryFields.notes}
//                         onChange={(e) => handleNewCategoryFieldChange('notes', e.target.value)}
//                         className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Additional notes"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Original Form Fields - Only show when NOT adding new category */}
//             {!isAddingNewCategory && selectedCategory && (
//               <>
//                 {/* Sub-category for specific categories */}
//                 {(selectedCategory === 'POWER CABLES' || selectedCategory === 'ALUMINIUM CABLES') && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Cable Type *
//                     </label>
//                     <select
//                       value={selectedSubCategory}
//                       onChange={(e) => setSelectedSubCategory(e.target.value)}
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="UN-ARMOURED CABLES">UN-ARMOURED CABLES</option>
//                       <option value="ARMOURED CABLES">ARMOURED CABLES</option>
//                     </select>
//                   </div>
//                 )}

//                 {/* Cable Selection (Edit Mode) */}
//                 {mode === 'edit' && selectedCategory && (
//                   <div className={selectedCategory === 'POWER CABLES' || selectedCategory === 'ALUMINIUM CABLES' 
//                     ? 'md:col-span-2' 
//                     : ''}>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Select Cable to Edit *
//                     </label>
//                     <select
//                       value={selectedCable}
//                       onChange={(e) => handleCableSelect(e.target.value)}
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">Select a cable</option>
//                       {getCableList().map((cable, index) => (
//                         <option key={index} value={
//                           selectedCategory === 'DC Solar Flexible Photovoltic UV-Resistant Cable' ? cable.name :
//                           selectedCategory === 'General cables' || selectedCategory === 'Flexible Cables BS 6500 IEC 60228' ? cable.description :
//                           selectedCategory === 'POWER CABLES' || selectedCategory === 'ALUMINIUM CABLES' ? cable.size :
//                           cable.name
//                         }>
//                           {selectedCategory === 'DC Solar Flexible Photovoltic UV-Resistant Cable' ? cable.name :
//                            selectedCategory === 'General cables' ? `${cable.description} - ${cable.formation}` :
//                            selectedCategory === 'Flexible Cables BS 6500 IEC 60228' ? cable.description :
//                            selectedCategory === 'POWER CABLES' || selectedCategory === 'ALUMINIUM CABLES' ? cable.size :
//                            cable.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 {/* New Cable Name (Add Mode) */}
//                 {mode === 'add' && selectedCategory && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Cable Name *
//                     </label>
//                     <input
//                       type="text"
//                       value={newCableName}
//                       onChange={(e) => setNewCableName(e.target.value)}
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Enter cable name/description"
//                     />
//                   </div>
//                 )}

//                 {/* Formation Field (Add Mode for General cables) */}
//                 {mode === 'add' && selectedCategory === 'General cables' && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Cable Formation
//                     </label>
//                     <input
//                       type="text"
//                       value={newCableFormation}
//                       onChange={(e) => setNewCableFormation(e.target.value)}
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="e.g., 1/1.13 mm"
//                     />
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Price Fields Section - Show for all modes */}
//           {(isAddingNewCategory || (mode === 'edit' && selectedCable) || (mode === 'add' && selectedCategory && newCableName)) && (
//             <div className="mt-6">
//               <h3 className="text-lg font-semibold text-white mb-4">
//                 {isAddingNewCategory ? 'Set Price for First Cable' : 'Price Configuration'}
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {getPriceFieldsConfig().map((fieldConfig, index) => (
//                   <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       {fieldConfig.label}
//                     </label>
//                     <div className="relative">
//                       <span className="absolute left-3 top-3 text-gray-400">Rs.</span>
//                       <input
//                         type="number"
//                         min="0"
//                         value={priceFields[fieldConfig.field] || ''}
//                         onChange={(e) => handlePriceChange(fieldConfig.field, e.target.value)}
//                         className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Enter price"
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="mt-8 flex justify-end gap-4">
//             <button
//               type="button"
//               onClick={handleReset}
//               className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
//             >
//               Reset
//             </button>
//             <button
//               type="button"
//               onClick={handleSave}
//               className={`px-6 py-3 rounded-lg font-medium transition-colors ${
//                 isAddingNewCategory
//                   ? 'bg-purple-600 hover:bg-purple-700 text-white'
//                   : mode === 'edit'
//                   ? 'bg-blue-600 hover:bg-blue-700 text-white'
//                   : 'bg-green-600 hover:bg-green-700 text-white'
//               }`}
//             >
//               {isAddingNewCategory
//                 ? 'Add New Category'
//                 : mode === 'edit'
//                 ? 'Update Prices'
//                 : 'Add New Cable'}
//             </button>
//           </div>
//         </div>

//         {/* Information Panel */}
//         <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
//           <h3 className="text-lg font-semibold text-white mb-4">Information</h3>
//           <div className="space-y-3">
//             <div className="flex items-center gap-3">
//               <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//               <p className="text-gray-300">
//                 <span className="font-medium">Edit Mode:</span> Select a cable category and then choose a specific cable to update its prices.
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//               <p className="text-gray-300">
//                 <span className="font-medium">Add Mode:</span> Add new cables to existing categories.
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
//               <p className="text-gray-300">
//                 <span className="font-medium">New Category:</span> Select "Add New Category" from dropdown to create entirely new cable categories.
//               </p>
//             </div>
//             <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
//               <p className="text-yellow-400 text-sm">
//                 ⚠️ Note: Price changes will affect all future quotations. Make sure to enter correct prices.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductManagement;