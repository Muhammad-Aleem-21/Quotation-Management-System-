
import React, { useState } from "react";

// Cable data and constants defined outside component
const categories = [
  "General cables",
  "Flexible Cables BS 6500 IEC 60228",
  "Imperial Sizes BS-2004",
  "Co-axial Cables(RG-Type)",
  "Telephone & Intercom Cables",
  "DC Solar Flexible Photovoltic UV-Resistant Cable",
  "POWER CABLES",
  "ALUMINIUM CABLES",
];

const colors = ["Red", "Blue", "Yellow", "Green", "Black", "White", "Brown"];

const cableData = {
  "Imperial Sizes BS-2004": [
    { name: '1/.044" Solid', price: 6577 },
    { name: '3/.029" Stranded', price: 8490 },
    { name: '7/.029" Stranded', price: 18591 },
    { name: '7/.036" Stranded', price: 28760 },
    { name: '7/.044" Stranded', price: 42420 },
    { name: '7/.052" Stranded', price: 58717 },
    { name: '7/.064" Stranded', price: 89952 },
  ],
  "Co-axial Cables(RG-Type)": [
    { name: "RG-6U", price: 20681 },
    { name: "RG-7U", price: 23291 },
    { name: "RG-11U", price: 30610 },
    { name: "CAT-6", price: 22205 },
    { name: "CCTV", price: 15920 },
    { name: "Fire Alarm (1.5mm²)", price: 50149 },
    { name: "Fire Alarm (2.5mm²)", price: 78067 },
    { name: "Speaker Wire (1.5mm²)", price: 29324 },
    { name: "Speaker Wire (2.5mm²)", price: 50007 },
  ],
  "Telephone & Intercom Cables": [
    { name: "Single Pair", price: 7346 },
    { name: "Two Pairs", price: 11167 },
    { name: "Three Pairs", price: 15720 },
    { name: "Four Pairs", price: 22102 },
    { name: "Five Pairs", price: 24506 },
    { name: "Six Pairs", price: 32498 },
    { name: "Seven Pairs", price: 35893 },
    { name: "Eight Pairs", price: 43735 },
    { name: "Nine Pairs", price: 48578 },
    { name: "Ten Pairs", price: 52859 },
  ],
  "DC Solar Flexible Photovoltic UV-Resistant Cable": {
    types: ["PVC/PVC", "XLPE/PVC", "XLPO/XLPO"],
    copperTypes: ["Plain Copper", "TINNED Copper"],
    cables: [
      { name: "1.5 mm²", plainPrice: 12185, tinnedPrice: 13745 },
      { name: "2.5 mm²", plainPrice: 19685, tinnedPrice: 22281 },
      { name: "4.0 mm²", plainPrice: 30217, tinnedPrice: 34397 },
      { name: "6.0 mm²", plainPrice: 44424, tinnedPrice: 50699 },
      { name: "10 mm²", plainPrice: 74922, tinnedPrice: 85541 },
    ],
  },
  "General cables": [
    {
      description: "1.0mm² Solid",
      formation: "1/1.13 mm",
      prices: {
        singleCore: 6590,
        twoCoreFlat: 16575,
        threeCoreRound: 23083,
        fourCoreRound: 30399,
      },
    },
    {
      description: "1.5mm² Solid",
      formation: "1/1.38 mm",
      prices: {
        singleCore: 8892,
        twoCoreFlat: 22190,
        threeCoreRound: 31336,
        fourCoreRound: 41290,
      },
    },
    {
      description: "1.5 mm² Stranded",
      formation: "7/0.53 mm",
      prices: {
        singleCore: 9870,
        twoCoreFlat: 24187,
        threeCoreRound: 34157,
        fourCoreRound: 45006,
      },
    },
    {
      description: "2.5 mm² Solid",
      formation: "1/1.78 mm",
      prices: {
        singleCore: 14891,
        twoCoreFlat: 35291,
        threeCoreRound: 50521,
        fourCoreRound: 67282,
      },
    },
    {
      description: "2.5 mm² Stranded",
      formation: "7/0.67 mm",
      prices: {
        singleCore: 16270,
        twoCoreFlat: 38467,
        threeCoreRound: 55068,
        fourCoreRound: 73337,
      },
    },
    {
      description: "4.0 mm² Stranded",
      formation: "7/0.85 mm",
      prices: {
        singleCore: 24082,
        twoCoreFlat: 55837,
        threeCoreRound: 80343,
        fourCoreRound: 106465,
      },
    },
    {
      description: "6.0 mm² Stranded",
      formation: "7/1.04 mm",
      prices: {
        singleCore: 35742,
        twoCoreFlat: 79919,
        threeCoreRound: 116170,
        fourCoreRound: 154674,
      },
    },
    {
      description: "10 mm² Stranded",
      formation: "7/1.35 mm",
      prices: {
        singleCore: 60124,
        twoCoreFlat: 131779,
        threeCoreRound: 192580,
        fourCoreRound: 257082,
      },
    },
    {
      description: "16 mm² Stranded",
      formation: "7/1.70 mm",
      prices: {
        singleCore: 95020,
        twoCoreFlat: 203732,
        threeCoreRound: 0,
        fourCoreRound: 0,
      },
    },
  ],
  "Flexible Cables BS 6500 IEC 60228": [
    {
      description: '0.5 mm² (14/.0076")',
      prices: {
        singleCore: 3906,
        twoCoreRound: 11512,
        threeCoreRound: 15495,
        fourCoreRound: 19994,
      },
    },
    {
      description: '0.75 mm² (23/.0076")',
      prices: {
        singleCore: 5563,
        twoCoreRound: 15734,
        threeCoreRound: 21556,
        fourCoreRound: 28013,
      },
    },
    {
      description: '1.0 mm² (40/.0076")',
      prices: {
        singleCore: 7289,
        twoCoreRound: 19804,
        threeCoreRound: 27460,
        fourCoreRound: 35795,
      },
    },
    {
      description: '1.5 mm² (70/.0076")',
      prices: {
        singleCore: 10678,
        twoCoreRound: 27687,
        threeCoreRound: 38607,
        fourCoreRound: 50365,
      },
    },
    {
      description: '2.5 mm² (110/.0076")',
      prices: {
        singleCore: 17533,
        twoCoreRound: 43801,
        threeCoreRound: 62204,
        fourCoreRound: 81170,
      },
    },
    {
      description: '4.0 mm² (162/.0076")',
      prices: {
        singleCore: 27637,
        twoCoreRound: 67189,
        threeCoreRound: 95715,
        fourCoreRound: 125597,
      },
    },
  ],
  "ALUMINIUM CABLES": {
    unarmoured: [
      {
        size: '10 mm² (7/0.052")',
        prices: {
          single: 165,
          two: 353,
          three: 541,
          threeHalf: 612,
          four: 682,
        },
      },
      {
        size: '16 mm² (7/0.064")',
        prices: {
          single: 227,
          two: 486,
          three: 721,
          threeHalf: 738,
          four: 832,
        },
      },
      {
        size: '25 mm² (19/0.052")',
        prices: {
          single: 311,
          two: 682,
          three: 1020,
          threeHalf: 1082,
          four: 1161,
        },
      },
      {
        size: '35 mm² (19/0.064")',
        prices: {
          single: 385,
          two: 832,
          three: 1271,
          threeHalf: 1321,
          four: 1482,
        },
      },
      {
        size: '50 mm² (19/0.072")',
        prices: {
          single: 541,
          two: 1091,
          three: 1679,
          threeHalf: 1809,
          four: 1992,
        },
      },
      {
        size: '70 mm² (19/0.083")',
        prices: {
          single: 698,
          two: 1404,
          three: 2008,
          threeHalf: 2392,
          four: 2644,
        },
      },
      {
        size: '95 mm² (37/0.072")',
        prices: {
          single: 965,
          two: 1942,
          three: 2729,
          threeHalf: 3215,
          four: 3600,
        },
      },
      {
        size: '120 mm² (37/0.083")',
        prices: {
          single: 1138,
          two: 2298,
          three: 3326,
          threeHalf: 4015,
          four: 4387,
        },
      },
      {
        size: '150 mm² (37/0.093")',
        prices: {
          single: 1388,
          two: 2808,
          three: 4062,
          threeHalf: 4753,
          four: 5365,
        },
      },
      {
        size: '185 mm² (37/0.103")',
        prices: {
          single: 1718,
          two: 3449,
          three: 5051,
          threeHalf: 5959,
          four: 6667,
        },
      },
      {
        size: '240 mm² (61/0.093")',
        prices: {
          single: 2212,
          two: 4462,
          three: 6424,
          threeHalf: 7915,
          four: 8596,
        },
      },
      {
        size: '300 mm² (61/0.103")',
        prices: {
          single: 2738,
          two: 5506,
          three: 7985,
          threeHalf: 9253,
          four: 10659,
        },
      },
      {
        size: '400 mm² (91/0.093")',
        prices: {
          single: 3420,
          two: 6879,
          three: 10188,
          threeHalf: 11844,
          four: 13482,
        },
      },
      {
        size: '500 mm² (91/0.103")',
        prices: { single: 4227, two: 0, three: 0, threeHalf: 0, four: 0 },
      },
      {
        size: '630 mm² (127/0.103")',
        prices: { single: 5309, two: 0, three: 0, threeHalf: 0, four: 0 },
      },
    ],
    armoured: [
      {
        size: '10 mm² (7/0.052")',
        prices: {
          single: 0,
          two: 776,
          three: 1059,
          threeHalf: 1227,
          four: 1365,
        },
      },
      {
        size: '16 mm² (7/0.064")',
        prices: {
          single: 0,
          two: 1091,
          three: 1294,
          threeHalf: 1553,
          four: 1765,
        },
      },
      {
        size: '25 mm² (19/0.052")',
        prices: {
          single: 0,
          two: 1411,
          three: 1773,
          threeHalf: 2086,
          four: 2173,
        },
      },
      {
        size: '35 mm² (19/0.064")',
        prices: {
          single: 0,
          two: 1686,
          three: 2118,
          threeHalf: 2408,
          four: 2573,
        },
      },
      {
        size: '50 mm² (19/0.072")',
        prices: {
          single: 824,
          two: 2094,
          three: 2654,
          threeHalf: 3044,
          four: 3600,
        },
      },
      {
        size: '70 mm² (19/0.083")',
        prices: {
          single: 1007,
          two: 2533,
          three: 3624,
          threeHalf: 4145,
          four: 4479,
        },
      },
      {
        size: '95 mm² (37/0.072")',
        prices: {
          single: 1302,
          two: 3538,
          three: 4573,
          threeHalf: 5639,
          four: 6024,
        },
      },
      {
        size: '120 mm² (37/0.083")',
        prices: {
          single: 1704,
          two: 4076,
          three: 5309,
          threeHalf: 6862,
          four: 7286,
        },
      },
      {
        size: '150 mm² (37/0.093")',
        prices: {
          single: 2149,
          two: 4786,
          three: 6847,
          threeHalf: 7796,
          four: 8549,
        },
      },
      {
        size: '185 mm² (37/0.103")',
        prices: {
          single: 2526,
          two: 6165,
          three: 8118,
          threeHalf: 9356,
          four: 10274,
        },
      },
      {
        size: '240 mm² (61/0.093")',
        prices: {
          single: 2979,
          two: 7459,
          three: 10032,
          threeHalf: 11545,
          four: 12541,
        },
      },
      {
        size: '300 mm² (61/0.103")',
        prices: {
          single: 3600,
          two: 8973,
          three: 11968,
          threeHalf: 13780,
          four: 15027,
        },
      },
      {
        size: '400 mm² (91/0.093")',
        prices: {
          single: 4424,
          two: 10789,
          three: 14479,
          threeHalf: 17851,
          four: 19444,
        },
      },
      {
        size: '500 mm² (91/0.103")',
        prices: { single: 5622, two: 0, three: 0, threeHalf: 0, four: 0 },
      },
      {
        size: '630 mm² (127/0.103")',
        prices: { single: 7369, two: 0, three: 0, threeHalf: 0, four: 0 },
      },
    ],
  },
  "POWER CABLES": {
    unarmoured: [
      {
        size: '16 mm² (7/0.064")',
        prices: {
          single: 1056,
          sc: 1082,
          three: 3178,
          threeHalf: 3729,
          four: 4262,
        },
      },
      {
        size: '25 mm² (19/0.052")',
        prices: {
          single: 1589,
          sc: 1628,
          three: 4965,
          threeHalf: 6057,
          four: 6660,
        },
      },
      {
        size: '35 mm² (19/0.064")',
        prices: {
          single: 2191,
          sc: 2236,
          three: 6797,
          threeHalf: 7923,
          four: 9137,
        },
      },
      {
        size: '50 mm² (19/0.072")',
        prices: {
          single: 2966,
          sc: 3027,
          three: 9170,
          threeHalf: 10914,
          four: 12417,
        },
      },
      {
        size: '70 mm² (19/0.083")',
        prices: {
          single: 4270,
          sc: 4341,
          three: 13147,
          threeHalf: 15563,
          four: 17792,
        },
      },
      {
        size: '95 mm² (37/0.072")',
        prices: {
          single: 5919,
          sc: 6015,
          three: 18185,
          threeHalf: 18698,
          four: 24491,
        },
      },
      {
        size: '120 mm² (37/0.083")',
        prices: {
          single: 7460,
          sc: 7567,
          three: 22889,
          threeHalf: 27542,
          four: 30829,
        },
      },
      {
        size: '150 mm² (37/0.093")',
        prices: {
          single: 9166,
          sc: 9300,
          three: 28099,
          threeHalf: 32834,
          four: 37854,
        },
      },
      {
        size: '185 mm² (37/0.103")',
        prices: {
          single: 11493,
          sc: 11659,
          three: 35213,
          threeHalf: 41732,
          four: 47449,
        },
      },
      {
        size: '240 mm² (61/0.093")',
        prices: {
          single: 15098,
          sc: 15307,
          three: 46194,
          threeHalf: 54429,
          four: 62254,
        },
      },
      {
        size: '300 mm² (61/0.103")',
        prices: {
          single: 18935,
          sc: 19190,
          three: 57901,
          threeHalf: 68039,
          four: 78043,
        },
      },
      {
        size: '400 mm² (91/0.093")',
        prices: {
          single: 24197,
          sc: 24508,
          three: 73943,
          threeHalf: 86668,
          four: 99668,
        },
      },
      {
        size: '500 mm² (91/0.103")',
        prices: { single: 30490, sc: 30864, three: 0, threeHalf: 0, four: 0 },
      },
      {
        size: '630 mm² (127/0.103")',
        prices: { single: 39296, sc: 39781, three: 0, threeHalf: 0, four: 0 },
      },
    ],
    armoured: [
      {
        size: '10 mm² (7/0.052")',
        prices: { single: 0, sc: 0, three: 2395, threeHalf: 2815, four: 3218 },
      },
      {
        size: '16 mm² (7/0.064")',
        prices: { single: 0, sc: 0, three: 3595, threeHalf: 4289, four: 4903 },
      },
      {
        size: '25 mm² (19/0.052")',
        prices: { single: 0, sc: 0, three: 5616, threeHalf: 6762, four: 7469 },
      },
      {
        size: '35 mm² (19/0.064")',
        prices: { single: 0, sc: 0, three: 7547, threeHalf: 8722, four: 10047 },
      },
      {
        size: '50 mm² (19/0.072")',
        prices: {
          single: 0,
          sc: 3321,
          three: 10062,
          threeHalf: 11856,
          four: 13755,
        },
      },
      {
        size: '70 mm² (19/0.083")',
        prices: {
          single: 0,
          sc: 4739,
          three: 14350,
          threeHalf: 16840,
          four: 19216,
        },
      },
      {
        size: '95 mm² (37/0.072")',
        prices: {
          single: 0,
          sc: 6498,
          three: 19644,
          threeHalf: 20252,
          four: 26263,
        },
      },
      {
        size: '120 mm² (37/0.083")',
        prices: {
          single: 0,
          sc: 8098,
          three: 24497,
          threeHalf: 29581,
          four: 33256,
        },
      },
      {
        size: '150 mm² (37/0.093")',
        prices: {
          single: 0,
          sc: 10013,
          three: 30254,
          threeHalf: 35107,
          four: 40540,
        },
      },
      {
        size: '185 mm² (37/0.103")',
        prices: {
          single: 0,
          sc: 12459,
          three: 37627,
          threeHalf: 44300,
          four: 50456,
        },
      },
      {
        size: '240 mm² (61/0.093")',
        prices: {
          single: 0,
          sc: 16211,
          three: 48923,
          threeHalf: 57349,
          four: 65646,
        },
      },
      {
        size: '300 mm² (61/0.103")',
        prices: {
          single: 0,
          sc: 20218,
          three: 61003,
          threeHalf: 71338,
          four: 81796,
        },
      },
      {
        size: '400 mm² (91/0.093")',
        prices: {
          single: 0,
          sc: 25820,
          three: 77901,
          threeHalf: 90869,
          four: 104463,
        },
      },
      {
        size: '500 mm² (91/0.103")',
        prices: { single: 0, sc: 32408, three: 0, threeHalf: 0, four: 0 },
      },
      {
        size: '630 mm² (127/0.103")',
        prices: { single: 0, sc: 41770, three: 0, threeHalf: 0, four: 0 },
      },
    ],
  },
};

const coreTypes = {
  "General cables": [
    "Single/Core",
    "2/Core Flat",
    "3/Core Round",
    "4/Core Round",
  ],
  "Flexible Cables BS 6500 IEC 60228": [
    "Single/Core",
    "2/Core Round",
    "3/Core Round",
    "4/Core Round",
  ],
  "ALUMINIUM CABLES": ["Single/Core", "2/C", "3/C", "3.5/C", "4/C"],
  "POWER CABLES": [
    "Single/Core PVC",
    "S/C PVC/PVC",
    "3/C PVC/PVC",
    "3.5/C PVC/PVC",
    "4/C PVC/PVC",
  ],
  "ALUMINIUM CABLES Armoured": [
    "Single/Core AL/PVC/AWA",
    "2/C PVC/SWA/PVC",
    "3/C PVC/SWA/PVC",
    "3.5/C PVC/SWA/PVC",
    "4/C PVC/SWA/PVC",
  ],
  "POWER CABLES Armoured": [
    "Single/Core PVC",
    "S/C PVC/AWA/PVC",
    "3/C PVC/SWA/PVC",
    "3.5/C PVC/SWA/PVC",
    "4/C PVC/SWA/PVC",
  ],
};
const discountLimits = {
  "super-admin": 38,
  admin: 38,
  manager: 35,
  salesperson: 30,
};

const CreateQuotation = ({ userRole = "salesperson" }) => {
  const [step, setStep] = useState(1);

  const [clientInfo, setClientInfo] = useState({
    Name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    deliveryAddress: "",
    city: "",
    state: "",
    zipCode: "",
    taxId: "",
    notes: "",
  });

  const [formData, setFormData] = useState({
    cableCategory: "",
    subCategory: "",
    cableType: "",
    cableDescription: "",
    cableSize: "",
    color: "",
    quantityType: "meters",
    quantity: 1,
    price: 0,
    discountType: "percentage",
    discountValue: 0,
    finalPrice: 0,
  });
  const getDiscountLimit = () => {
    return discountLimits[userRole] || 30; // Default to 30 if role not found
  };

  const handleClientInfoChange = (field, value) => {
    setClientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleCableChange = (field, value) => {
    const newData = { ...formData, [field]: value };

    if (field === "cableCategory") {
      newData.subCategory = "";
      newData.cableType = "";
      newData.cableDescription = "";
      newData.cableSize = "";
      newData.color = "";
      newData.quantity = 1;
      newData.price = 0;
      newData.discountValue = 0;
      newData.finalPrice = 0;
    } else if (
      field === "subCategory" ||
      field === "cableType" ||
      field === "cableDescription" ||
      field === "cableSize" ||
      field === "quantity"
    ) {
      newData.price = 0;
      newData.finalPrice = 0;
    }

    // Calculate price immediately
    const priceData = calculatePrice(newData);
    newData.price = priceData.totalBeforeDiscount;
    newData.finalPrice = priceData.finalPrice;

    setFormData(newData);
  };

  const handleDiscountChange = (field, value) => {
    const newData = { ...formData, [field]: value };

    // Calculate price immediately
    const priceData = calculatePrice(newData);
    newData.price = priceData.totalBeforeDiscount;
    newData.finalPrice = priceData.finalPrice;

    setFormData(newData);
  };

  const calculatePrice = (data = formData) => {
    let basePrice = 0;
    const {
      cableCategory,
      subCategory,
      cableType,
      cableDescription,
      cableSize,
      quantity,
    } = data; // Use 'data' parameter instead of 'formData'

    switch (cableCategory) {
      case "Imperial Sizes BS-2004":
      case "Co-axial Cables(RG-Type)":
      case "Telephone & Intercom Cables":
        {
          const cable = cableData[cableCategory].find(
            (item) => item.name === cableDescription,
          );
          basePrice = cable ? cable.price : 0;
        }
        break;

      case "DC Solar Flexible Photovoltic UV-Resistant Cable":
        {
          if (!cableDescription || !cableType)
            return { totalBeforeDiscount: 0, discountAmount: 0, finalPrice: 0 };
          const solarCable = cableData[cableCategory].cables.find(
            (item) => item.name === cableDescription,
          );
          if (solarCable) {
            if (cableType === "Plain Copper") {
              basePrice = solarCable.plainPrice;
            } else if (cableType === "TINNED Copper") {
              basePrice = solarCable.tinnedPrice;
            }
          }
        }
        break;

      case "General cables":
        {
          if (!cableDescription || !cableType)
            return { totalBeforeDiscount: 0, discountAmount: 0, finalPrice: 0 };
          const generalCable = cableData[cableCategory].find(
            (item) => item.description === cableDescription,
          );
          if (generalCable) {
            if (cableType === "Single/Core") {
              basePrice = generalCable.prices.singleCore;
            } else if (cableType === "2/Core Flat") {
              basePrice = generalCable.prices.twoCoreFlat;
            } else if (cableType === "3/Core Round") {
              basePrice = generalCable.prices.threeCoreRound;
            } else if (cableType === "4/Core Round") {
              basePrice = generalCable.prices.fourCoreRound;
            }
          }
        }
        break;

      case "Flexible Cables BS 6500 IEC 60228":
        {
          if (!cableDescription || !cableType)
            return { totalBeforeDiscount: 0, discountAmount: 0, finalPrice: 0 };
          const flexibleCable = cableData[cableCategory].find(
            (item) => item.description === cableDescription,
          );
          if (flexibleCable) {
            if (cableType === "Single/Core") {
              basePrice = flexibleCable.prices.singleCore;
            } else if (cableType === "2/Core Round") {
              basePrice = flexibleCable.prices.twoCoreRound;
            } else if (cableType === "3/Core Round") {
              basePrice = flexibleCable.prices.threeCoreRound;
            } else if (cableType === "4/Core Round") {
              basePrice = flexibleCable.prices.fourCoreRound;
            }
          }
        }
        break;

      case "ALUMINIUM CABLES":
        {
          if (!cableSize || !cableType || !subCategory)
            return { totalBeforeDiscount: 0, discountAmount: 0, finalPrice: 0 };
          const alumList =
            subCategory === "UN-ARMOURED CABLES"
              ? cableData[cableCategory].unarmoured
              : cableData[cableCategory].armoured;
          const alumCable = alumList.find((item) => item.size === cableSize);
          if (alumCable) {
            if (cableType === "Single/Core") {
              basePrice = alumCable.prices.single;
            } else if (cableType === "2/C") {
              basePrice = alumCable.prices.two;
            } else if (cableType === "3/C") {
              basePrice = alumCable.prices.three;
            } else if (cableType === "3.5/C") {
              basePrice = alumCable.prices.threeHalf;
            } else if (cableType === "4/C") {
              basePrice = alumCable.prices.four;
            } else {
              // ARMOURED CABLES
              if (cableType === "Single/Core AL/PVC/AWA") {
                basePrice = alumCable.prices.single;
              } else if (cableType === "2/C PVC/SWA/PVC") {
                basePrice = alumCable.prices.two;
              } else if (cableType === "3/C PVC/SWA/PVC") {
                basePrice = alumCable.prices.three;
              } else if (cableType === "3.5/C PVC/SWA/PVC") {
                basePrice = alumCable.prices.threeHalf;
              } else if (cableType === "4/C PVC/SWA/PVC") {
                basePrice = alumCable.prices.four;
              }
            }
          }
        }
        break;

      case "POWER CABLES":
        {
          if (!cableSize || !cableType || !subCategory)
            return { totalBeforeDiscount: 0, discountAmount: 0, finalPrice: 0 };
          const powerList =
            subCategory === "UN-ARMOURED CABLES"
              ? cableData[cableCategory].unarmoured
              : cableData[cableCategory].armoured;
          const powerCable = powerList.find((item) => item.size === cableSize);
          if (powerCable) {
            if (subCategory === "UN-ARMOURED CABLES") {
              if (cableType === "Single/Core PVC") {
                basePrice = powerCable.prices.single;
              } else if (cableType === "S/C PVC/PVC") {
                basePrice = powerCable.prices.sc;
              } else if (cableType === "3/C PVC/PVC") {
                basePrice = powerCable.prices.three;
              } else if (cableType === "3.5/C PVC/PVC") {
                basePrice = powerCable.prices.threeHalf;
              } else if (cableType === "4/C PVC/PVC") {
                basePrice = powerCable.prices.four;
              }
            } else {
              // ARMOURED CABLES
              if (cableType === "Single/Core PVC") {
                basePrice = powerCable.prices.single;
              } else if (cableType === "S/C PVC/AWA/PVC") {
                basePrice = powerCable.prices.sc;
              } else if (cableType === "3/C PVC/SWA/PVC") {
                basePrice = powerCable.prices.three;
              } else if (cableType === "3.5/C PVC/SWA/PVC") {
                basePrice = powerCable.prices.threeHalf;
              } else if (cableType === "4/C PVC/SWA/PVC") {
                basePrice = powerCable.prices.four;
              }
            }
          }
        }
        break;

      default:
        return { totalBeforeDiscount: 0, discountAmount: 0, finalPrice: 0 };
    }

    // Calculate total before discount
    const totalBeforeDiscount = basePrice * quantity;

    // Calculate discount with role-based limit
    const { discountType, discountValue } = data; // Use 'data' parameter
    let discountAmount = 0;

    if (discountValue > 0) {
      if (discountType === "percentage") {
        // Apply role-based discount limit
        const discountLimit = getDiscountLimit();
        const effectiveDiscount = Math.min(discountValue, discountLimit);
        discountAmount = (totalBeforeDiscount * effectiveDiscount) / 100;

        // If discount was capped, show warning
        if (discountValue > discountLimit) {
          // This warning will be handled in the input validation
        }
      } else if (discountType === "fixed") {
        discountAmount = discountValue;
      }
    }

    // Calculate final price after discount
    const finalPrice = totalBeforeDiscount - discountAmount;

    return {
      totalBeforeDiscount,
      discountAmount,
      finalPrice,
    };
  };

  

  const validateClientInfo = () => {
    const requiredFields = [
      "Name",
      "contactPerson",
      "email",
      "phone",
      "address",
      "deliveryAddress",
      "city",
      "state",
      "zipCode",
    ];

    for (const field of requiredFields) {
      if (!clientInfo[field] || clientInfo[field].trim() === "") {
        return false;
      }
    }
    return true;
  };

  // Render Step 1: Client Info Form
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Quotation</h1>
            <p className="text-gray-400">Step 1: Enter Client Information</p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                1
              </div>
              <span className="text-blue-400 font-medium">
                Client Information
              </span>
              <div className="h-px flex-1 bg-gray-700 mx-4"></div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                2
              </div>
              <span className="text-gray-500">Cable Selection</span>
            </div>
          </div>

          {/* Client Form */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6">Client Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div>
                <label
                  htmlFor="Name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Name *
                </label>
                <input
                  id="Name"
                  type="text"
                  value={clientInfo.Name}
                  onChange={(e) =>
                    handleClientInfoChange("Name", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter client name"
                />
              </div>

              {/* Contact Person */}
              <div>
                <label
                  htmlFor="contactPerson"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Contact Person *
                </label>
                <input
                  id="contactPerson"
                  type="text"
                  value={clientInfo.contactPerson}
                  onChange={(e) =>
                    handleClientInfoChange("contactPerson", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter contact person name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) =>
                    handleClientInfoChange("email", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@company.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={clientInfo.phone}
                  onChange={(e) =>
                    handleClientInfoChange("phone", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+92 300 1234567"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Business Address *
                </label>
                <input
                  id="address"
                  type="text"
                  value={clientInfo.address}
                  onChange={(e) =>
                    handleClientInfoChange("address", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Street address, Building, Area"
                />
              </div>

              {/* Delivery Address */}
              <div className="md:col-span-2 border border-blue-500/30 rounded-lg p-4 bg-blue-500/5">
                <label
                  htmlFor="deliveryAddress"
                  className="block text-sm font-medium text-blue-300 mb-2"
                >
                  Delivery Address *
                </label>
                <textarea
                  id="deliveryAddress"
                  value={clientInfo.deliveryAddress}
                  onChange={(e) =>
                    handleClientInfoChange("deliveryAddress", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-blue-500/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Complete delivery address with landmarks"
                  rows={3}
                />
                <p className="text-blue-400 text-sm mt-2">
                  ⓘ This address will be used for shipping and delivery
                </p>
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  value={clientInfo.city}
                  onChange={(e) =>
                    handleClientInfoChange("city", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City"
                />
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  State/Province *
                </label>
                <input
                  id="state"
                  type="text"
                  value={clientInfo.state}
                  onChange={(e) =>
                    handleClientInfoChange("state", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="State or Province"
                />
              </div>

              {/* ZIP Code */}
              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  ZIP/Postal Code *
                </label>
                <input
                  id="zipCode"
                  type="text"
                  value={clientInfo.zipCode}
                  onChange={(e) =>
                    handleClientInfoChange("zipCode", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Postal code"
                />
              </div>

              {/* Tax ID */}
              <div>
                <label
                  htmlFor="taxId"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Tax ID / NTN
                </label>
                <input
                  id="taxId"
                  type="text"
                  value={clientInfo.taxId}
                  onChange={(e) =>
                    handleClientInfoChange("taxId", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  value={clientInfo.notes}
                  onChange={(e) =>
                    handleClientInfoChange("notes", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special instructions or requirements"
                  rows={2}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!validateClientInfo()) {
                    alert("Please fill all required fields (marked with *)");
                    return;
                  }
                  setStep(2);
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                Next: Select Cables
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Client Info Summary */}
          {clientInfo.Name && (
            <div className="mt-6 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">
                Client Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Company</p>
                  <p className="text-white font-medium">{clientInfo.Name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Contact</p>
                  <p className="text-white font-medium">
                    {clientInfo.contactPerson}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white font-medium">{clientInfo.phone}</p>
                </div>
                <div className="md:col-span-3">
                  <p className="text-gray-400 text-sm">Delivery Address</p>
                  <p className="text-white font-medium">
                    {clientInfo.deliveryAddress}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* In the header section of step 2 */}
          <div className="text-sm text-gray-400 mb-2">
            Logged in as:{" "}
            <span className="text-blue-400 font-medium capitalize">
              {userRole}
            </span>
            <span className="mx-2">•</span>
            Discount limit:{" "}
            <span className="text-green-400 font-medium">
              {getDiscountLimit()}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Render Step 2: Cable Selection Form
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Create Quotation</h1>
              <p className="text-gray-400">
                Step 2: Select Cable Specifications
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-500 rounded-lg transition-colors"
            >
              ← Back to Client Info
            </button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              ✓
            </div>
            <span className="text-green-400 font-medium">
              Client Information
            </span>
            <div className="h-px flex-1 bg-gray-700 mx-4"></div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              2
            </div>
            <span className="text-blue-400 font-medium">Cable Selection</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cable Category */}
            <div>
              <label
                htmlFor="cableCategory"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Select Cable Category *
              </label>
              <select
                id="cableCategory"
                value={formData.cableCategory}
                onChange={(e) =>
                  handleCableChange("cableCategory", e.target.value)
                }
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Category for POWER and ALUMINIUM CABLES */}
            {(formData.cableCategory === "POWER CABLES" ||
              formData.cableCategory === "ALUMINIUM CABLES") && (
              <div>
                <label
                  htmlFor="subCategory"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Cable Type *
                </label>
                <select
                  id="subCategory"
                  value={formData.subCategory}
                  onChange={(e) =>
                    handleCableChange("subCategory", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="UN-ARMOURED CABLES">UN-ARMOURED CABLES</option>
                  <option value="ARMOURED CABLES">ARMOURED CABLES</option>
                </select>
              </div>
            )}

            {/* For DC Solar - Cable Type */}
            {formData.cableCategory ===
              "DC Solar Flexible Photovoltic UV-Resistant Cable" && (
              <div>
                <label
                  htmlFor="solarSubCategory"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Cable Type *
                </label>
                <select
                  id="solarSubCategory"
                  value={formData.subCategory}
                  onChange={(e) =>
                    handleCableChange("subCategory", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select type</option>
                  {cableData[
                    "DC Solar Flexible Photovoltic UV-Resistant Cable"
                  ].types.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* For DC Solar - Copper Type */}
            {formData.cableCategory ===
              "DC Solar Flexible Photovoltic UV-Resistant Cable" &&
              formData.subCategory && (
                <div>
                  <label
                    htmlFor="copperType"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Copper Type *
                  </label>
                  <select
                    id="copperType"
                    value={formData.cableType}
                    onChange={(e) =>
                      handleCableChange("cableType", e.target.value)
                    }
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select copper type</option>
                    {cableData[
                      "DC Solar Flexible Photovoltic UV-Resistant Cable"
                    ].copperTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            {/* Cable Description/Size Selection */}
            {formData.cableCategory &&
              formData.cableCategory !==
                "DC Solar Flexible Photovoltic UV-Resistant Cable" && (
                <div
                  className={
                    formData.cableCategory === "POWER CABLES" ||
                    formData.cableCategory === "ALUMINIUM CABLES"
                      ? "md:col-span-2"
                      : ""
                  }
                >
                  <label
                    htmlFor="cableDescriptionOrSize"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    {formData.cableCategory === "POWER CABLES" ||
                    formData.cableCategory === "ALUMINIUM CABLES"
                      ? "Select Cable Size *"
                      : "Select Cable *"}
                  </label>
                  <select
                    id="cableDescriptionOrSize"
                    value={
                      formData.cableCategory === "POWER CABLES" ||
                      formData.cableCategory === "ALUMINIUM CABLES"
                        ? formData.cableSize
                        : formData.cableDescription
                    }
                    onChange={(e) => {
                      if (
                        formData.cableCategory === "POWER CABLES" ||
                        formData.cableCategory === "ALUMINIUM CABLES"
                      ) {
                        handleCableChange("cableSize", e.target.value);
                      } else {
                        handleCableChange("cableDescription", e.target.value);
                      }
                    }}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select an option</option>
                    {(() => {
                      switch (formData.cableCategory) {
                        case "Imperial Sizes BS-2004":
                        case "Co-axial Cables(RG-Type)":
                        case "Telephone & Intercom Cables":
                          return cableData[formData.cableCategory].map(
                            (item, index) => (
                              <option key={index} value={item.name}>
                                {item.name}
                              </option>
                            ),
                          );
                        case "General cables":
                          return cableData[formData.cableCategory].map(
                            (item, index) => (
                              <option key={index} value={item.description}>
                                {item.description} - {item.formation}
                              </option>
                            ),
                          );
                        case "Flexible Cables BS 6500 IEC 60228":
                          return cableData[formData.cableCategory].map(
                            (item, index) => (
                              <option key={index} value={item.description}>
                                {item.description}
                              </option>
                            ),
                          );
                        case "ALUMINIUM CABLES": {
                          const alumData = cableData[formData.cableCategory];
                          const alumList =
                            formData.subCategory === "UN-ARMOURED CABLES"
                              ? alumData.unarmoured
                              : alumData.armoured;
                          return alumList.map((item, index) => (
                            <option key={index} value={item.size}>
                              {item.size}
                            </option>
                          ));
                        }
                        case "POWER CABLES": {
                          const powerData = cableData[formData.cableCategory];
                          const powerList =
                            formData.subCategory === "UN-ARMOURED CABLES"
                              ? powerData.unarmoured
                              : powerData.armoured;
                          return powerList.map((item, index) => (
                            <option key={index} value={item.size}>
                              {item.size}
                            </option>
                          ));
                        }
                        default:
                          return null;
                      }
                    })()}
                  </select>
                </div>
              )}

            {/* For DC Solar - Cable Description */}
            {formData.cableCategory ===
              "DC Solar Flexible Photovoltic UV-Resistant Cable" &&
              formData.subCategory &&
              formData.cableType && (
                <div>
                  <label
                    htmlFor="solarCableDescription"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Select Cable *
                  </label>
                  <select
                    id="solarCableDescription"
                    value={formData.cableDescription}
                    onChange={(e) =>
                      handleCableChange("cableDescription", e.target.value)
                    }
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select cable</option>
                    {cableData[
                      "DC Solar Flexible Photovoltic UV-Resistant Cable"
                    ].cables.map((cable, index) => (
                      <option key={index} value={cable.name}>
                        {cable.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            {/* Cable Type Selection */}
            {(formData.cableCategory === "General cables" ||
              formData.cableCategory === "Flexible Cables BS 6500 IEC 60228" ||
              (formData.cableCategory === "POWER CABLES" &&
                formData.cableSize) ||
              (formData.cableCategory === "ALUMINIUM CABLES" &&
                formData.cableSize)) && (
              <div>
                <label
                  htmlFor="coreType"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Select Core Type *
                </label>
                <select
                  id="coreType"
                  value={formData.cableType}
                  onChange={(e) =>
                    handleCableChange("cableType", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select core type</option>
                  {(() => {
                    let types = [];
                    if (formData.cableCategory === "General cables") {
                      types = coreTypes["General cables"];
                    } else if (
                      formData.cableCategory ===
                      "Flexible Cables BS 6500 IEC 60228"
                    ) {
                      types = coreTypes["Flexible Cables BS 6500 IEC 60228"];
                    } else if (formData.cableCategory === "POWER CABLES") {
                      types =
                        formData.subCategory === "ARMOURED CABLES"
                          ? coreTypes["POWER CABLES Armoured"]
                          : coreTypes["POWER CABLES"];
                    } else if (formData.cableCategory === "ALUMINIUM CABLES") {
                      types =
                        formData.subCategory === "ARMOURED CABLES"
                          ? coreTypes["ALUMINIUM CABLES Armoured"]
                          : coreTypes["ALUMINIUM CABLES"];
                    }
                    return types.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ));
                  })()}
                </select>
              </div>
            )}

            {/* Quantity Input */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                {formData.cableCategory === "POWER CABLES" ||
                formData.cableCategory === "ALUMINIUM CABLES"
                  ? "Number of Meters *"
                  : "Number of Coils *"}
              </label>
              <div className="flex items-center">
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleCableChange("quantity", parseInt(e.target.value) || 1)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="ml-3 text-gray-400">
                  {formData.cableCategory === "POWER CABLES" ||
                  formData.cableCategory === "ALUMINIUM CABLES"
                    ? "meters"
                    : "coils"}
                </span>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Select Color
              </label>
              <select
                id="color"
                value={formData.color}
                onChange={(e) => handleCableChange("color", e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select color (optional)</option>
                {colors.map((color, index) => (
                  <option key={index} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Discount Section */}
          <div className="mt-6 border border-gray-600 rounded-lg p-4 bg-gray-700/30">
            <h3 className="text-lg font-semibold text-white mb-4">
              Discount Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Discount Type */}
              <div>
                <label
                  htmlFor="discountType"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Discount Type
                </label>
                <select
                  id="discountType"
                  value={formData.discountType}
                  onChange={(e) =>
                    handleDiscountChange("discountType", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  {/* <option value="fixed">Fixed Amount</option> */}
                  <option value="none">No Discount</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label
                  htmlFor="discountValue"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Discount Value ({getDiscountLimit()}% max)
                </label>
                <div className="relative">
                  <input
                    id="discountValue"
                    type="number"
                    min="0"
                    max={
                      formData.discountType === "percentage"
                        ? getDiscountLimit()
                        : "999999"
                    }
                    value={
                      formData.discountValue === 0 ? "" : formData.discountValue
                    }
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : parseFloat(e.target.value);

                      // Validate discount limit for percentage
                      if (
                        formData.discountType === "percentage" &&
                        value > getDiscountLimit()
                      ) {
                        alert(
                          `Your role (${userRole}) can only apply up to ${getDiscountLimit()}% discount.`,
                        );
                        return;
                      }

                      handleDiscountChange("discountValue", value);
                    }}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white 
                              focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={
                      formData.discountType === "percentage"
                        ? `Enter % (Max: ${getDiscountLimit()}%)`
                        : "Enter amount"
                    }
                    disabled={formData.discountType === "none"}
                  />
                  <span className="absolute right-3 top-3 text-gray-400">
                    {formData.discountType === "percentage" ? "%" : "Rs."}
                  </span>
                </div>
              </div>

              {/* Discount Preview */}
              <div className="flex items-center">
                <div className="bg-gray-800 p-4 rounded-lg w-full">
                  <p className="text-gray-400 text-sm">Discount Applied</p>
                  <p className="text-xl font-bold text-red-400">
                    {formData.discountType === "percentage"
                      ? `${formData.discountValue}%`
                      : formData.discountType === "fixed"
                        ? `Rs. ${formData.discountValue.toLocaleString()}`
                        : "None"}
                  </p>
                </div>
              </div>
            </div>

            {/* Discount warning for percentage */}
            {/* Discount warning for percentage */}
            {formData.discountType === "percentage" &&
              formData.discountValue > getDiscountLimit() && (
                <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm flex items-center">
                    <span className="mr-2">⚠️</span>
                    Discount exceeds your limit! Maximum allowed:{" "}
                    {getDiscountLimit()}%
                  </p>
                </div>
              )}
            {formData.discountType === "percentage" &&
              formData.discountValue > 20 &&
              formData.discountValue <= getDiscountLimit() && (
                <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-sm flex items-center">
                    <span className="mr-2">⚠️</span>
                    High discount percentage ({formData.discountValue}%) applied
                  </p>
                </div>
              )}
          </div>

          {/* Enhanced Price Display with Discount */}
          {formData.price > 0 && (
            <div className="mt-8 p-6 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4">
                Price Calculation
              </h3>

              <div className="space-y-3 mb-4">
                {/* Base Price */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">
                    {formData.cableCategory === "POWER CABLES" ||
                    formData.cableCategory === "ALUMINIUM CABLES"
                      ? `Price per meter: Rs. ${(formData.price / formData.quantity).toFixed(2)}`
                      : `Price per coil: Rs. ${(formData.price / formData.quantity).toFixed(2)}`}
                  </span>
                  <span className="text-gray-300">
                    × {formData.quantity}{" "}
                    {formData.cableCategory === "POWER CABLES" ||
                    formData.cableCategory === "ALUMINIUM CABLES"
                      ? "meters"
                      : "coils"}
                  </span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-600">
                  <span className="text-gray-300 font-medium">Subtotal</span>
                  <span className="text-xl font-semibold text-gray-300">
                    Rs. {formData.price.toLocaleString()}
                  </span>
                </div>

                {/* Discount */}
                {formData.discountValue > 0 &&
                  formData.discountType !== "none" && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">
                          Discount (
                          {formData.discountType === "percentage"
                            ? `${formData.discountValue}%`
                            : `Rs. ${formData.discountValue}`}
                          )
                        </span>
                        <span className="text-red-400 font-medium">
                          - Rs.{" "}
                          {(
                            formData.price - formData.finalPrice
                          ).toLocaleString()}
                        </span>
                      </div>

                      {/* Final Price */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-600">
                        <span className="text-gray-300 font-medium text-lg">
                          Final Total
                        </span>
                        <span className="text-3xl font-bold text-green-400">
                          Rs. {formData.finalPrice.toLocaleString()}
                        </span>
                      </div>

                      {/* Savings */}
                      <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-green-400">You save</span>
                          <span className="text-green-400 font-bold">
                            Rs.{" "}
                            {(
                              formData.price - formData.finalPrice
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                {/* No discount applied */}
                {(formData.discountValue === 0 ||
                  formData.discountType === "none") && (
                  <div className="flex justify-between items-center pt-3 border-t border-gray-600">
                    <span className="text-gray-300 font-medium text-lg">
                      Total Amount
                    </span>
                    <span className="text-3xl font-bold text-green-400">
                      Rs. {formData.price.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  cableCategory: "",
                  subCategory: "",
                  cableType: "",
                  cableDescription: "",
                  cableSize: "",
                  color: "",
                  quantityType: "meters",
                  quantity: 1,
                  price: 0,
                  discountType: "percentage",
                  discountValue: 0,
                  finalPrice: 0,
                });
              }}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Add to Quotation
            </button>
          </div>
        </div>

        {/* Information Panel */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Quotation Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-400">Selected Category:</p>
              <p className="text-white font-medium">
                {formData.cableCategory || "Not selected"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Selected Cable:</p>
              <p className="text-white font-medium">
                {formData.cableDescription ||
                  formData.cableSize ||
                  "Not selected"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Core Type:</p>
              <p className="text-white font-medium">
                {formData.cableType || "Not selected"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Color:</p>
              <p className="text-white font-medium">
                {formData.color || "Not selected"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Discount:</p>
              <p className="text-white font-medium">
                {formData.discountType === "percentage"
                  ? `${formData.discountValue}%`
                  : formData.discountType === "fixed"
                    ? `Rs. ${formData.discountValue}`
                    : "No discount"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Final Price:</p>
              <p className="text-white font-medium">
                {formData.finalPrice > 0
                  ? `Rs. ${formData.finalPrice.toLocaleString()}`
                  : formData.price > 0
                    ? `Rs. ${formData.price.toLocaleString()}`
                    : "Not calculated"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuotation;
