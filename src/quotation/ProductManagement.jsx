import React, { useState, useEffect, useMemo } from "react";
import {
  getCategories,
  createCategory,
  getCoreTypes,
  createCoreType,
  createProduct,
  getVariantTypes,
  getVariantOptions,
  setProductPriceMatrix,
  getProducts,
  bulkUpdateProductPrices,
  deleteProduct,
  updateProduct,
} from "../api/api";

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
  // additional category appended at request
  "Project Management Cable": [{ name: "New Cable", price: 0 }],
};

const ProductManagement = () => {
  const [mode, setMode] = useState("edit"); // 'edit' or 'add'
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCable, setSelectedCable] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [priceFields, setPriceFields] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // variant-related states
  const [variantTypes, setVariantTypes] = useState([]);
  const [variantOptions, setVariantOptions] = useState([]);
  const [selectedVariantType, setSelectedVariantType] = useState("");
  const [selectedVariantOption, setSelectedVariantOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Price matrix: { [core_type_id]: { price: number, coil_length: number } }
  const [corePrices, setCorePrices] = useState({});

  // Multi-select core types (array of selected core type IDs)
  const [selectedCoreTypeIds, setSelectedCoreTypeIds] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    size: "",
    construction: "",
    core_type: "",
    material: "",
    gauge: "",
    voltage_rating: "",
    uom: "MTR",
    base_price: "",
    coil_length: "",
    category_name: "",
    category_code: "",
  });

  const generateCode = (str) => {
    if (!str) return "";
    let s = str.toString().toLowerCase().trim();

    if (s.includes("single")) return "single_core";

    const match = s.match(/(\d+)/);
    if (match) {
      return `${match[1]}_core`;
    }

    return s
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  };

  // Handle new product field changes
  const handleProductFieldChange = (field, value) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  const [dbCategories, setDbCategories] = useState([]);
  const [dbCoreTypes, setDbCoreTypes] = useState([]);
  const [isManualCore, setIsManualCore] = useState(false);
  const [isManualCategory, setIsManualCategory] = useState(false);

  // Fetch data from DB
  const fetchData = async () => {
    try {
      const [catRes, coreRes, varTypeRes, prodRes] = await Promise.all([
        getCategories(),
        getCoreTypes(),
        getVariantTypes(),
        getProducts(),
      ]);

      console.log("Fetched Categories:", catRes.data);
      console.log("Fetched Core Types:", coreRes.data);
      console.log("Fetched Variant Types:", varTypeRes.data);
      console.log("Fetched Products:", prodRes.data);

      // Handle common response patterns for categories
      const categoriesData =
        catRes.data?.data ||
        catRes.data?.categories ||
        (Array.isArray(catRes.data) ? catRes.data : []);
      setDbCategories(categoriesData);

      // Handle common response patterns for core types
      const coreTypesData =
        coreRes.data?.data ||
        coreRes.data?.core_types ||
        (Array.isArray(coreRes.data) ? coreRes.data : []);
      setDbCoreTypes(coreTypesData);

      // record variant types
      const variantTypesData =
        varTypeRes.data?.data ||
        varTypeRes.data?.variant_types ||
        (Array.isArray(varTypeRes.data) ? varTypeRes.data : []);
      setVariantTypes(variantTypesData);

      // record products
      const productsData =
        prodRes.data?.data ||
        prodRes.data?.products ||
        (Array.isArray(prodRes.data) ? prodRes.data : []);
      setAllProducts(productsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setSubmitting(true);
      await deleteProduct(id);
      alert("Product deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete product: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Combine DB categories with static categories
  const categories = useMemo(() => {
    return [
      ...new Set([...Object.keys(cableData), ...dbCategories.map((c) => c.name)]),
    ];
  }, [dbCategories]);

  // Helper function to get cable list based on category
  const getCableList = () => {
    if (!selectedCategory) return [];

    const list = [];
    
    // 1. Add static products if they exist for this category
    if (cableData[selectedCategory]) {
      switch (selectedCategory) {
        case "Imperial Sizes BS-2004":
        case "Co-axial Cables(RG-Type)":
        case "Telephone & Intercom Cables":
          list.push(...(cableData[selectedCategory] || []));
          break;

        case "General cables":
        case "Flexible Cables BS 6500 IEC 60228":
          list.push(...(cableData[selectedCategory] || []));
          break;

        case "DC Solar Flexible Photovoltic UV-Resistant Cable":
          list.push(...(cableData[selectedCategory].cables || []));
          break;

        case "POWER CABLES":
        case "ALUMINIUM CABLES": {
          if (selectedSubCategory) {
            const data = cableData[selectedCategory];
            list.push(...(selectedSubCategory === "UN-ARMOURED CABLES"
              ? data.unarmoured
              : data.armoured));
          }
          break;
        }
      }
    }

    // 2. Add database products
    const dbFiltered = allProducts.filter(p => {
      const cat = dbCategories.find(c => String(c.id) === String(p.category_id));
      return cat && cat.name === selectedCategory;
    });
    list.push(...dbFiltered);

    return list;
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedCable("");
    setSelectedSubCategory("");
    setPriceFields({});

    // Set default subcategory for categories that need it
    if (
      category.includes("POWER CABLES") ||
      category.includes("ALUMINIUM CABLES") ||
      category.includes("Power Cables") ||
      category.includes("Aluminium Cables")
    ) {
      setSelectedSubCategory("UN-ARMOURED CABLES");
    }
  };

  // Handle cable selection for editing
  const handleCableSelect = (cable) => {
    setSelectedCable(cable);

    // Extract current prices based on category
    let selectedCableData = allProducts.find(p => String(p.id) === String(cable));
    
    // If not found in DB products, check static products
    if (!selectedCableData) {
      const cableList = getCableList();
      selectedCableData = cableList.find((item) => {
        const name = item.name || item.description || item.size;
        
        if (cableData[selectedCategory]) {
          if (selectedCategory === "DC Solar Flexible Photovoltic UV-Resistant Cable") {
            return item.name === cable;
          } else if (selectedCategory === "General cables" || selectedCategory === "Flexible Cables BS 6500 IEC 60228") {
            return item.description === cable;
          } else if (selectedCategory === "POWER CABLES" || selectedCategory === "ALUMINIUM CABLES") {
            return item.size === cable;
          }
        }
        
        return name === cable;
      });
    }

    if (selectedCableData) {
      if (selectedCableData.id) {
        // Handle database products
        // Populate newProduct state for editing
        setNewProduct({
          name: selectedCableData.name || "",
          description: selectedCableData.description || "",
          size: selectedCableData.size || "",
          construction: selectedCableData.construction || "",
          core_type: selectedCableData.core_type || "",
          material: selectedCableData.material || "",
          gauge: selectedCableData.gauge || "",
          voltage_rating: selectedCableData.voltage_rating || "",
          uom: selectedCableData.uom || "MTR",
          base_price: selectedCableData.base_price || "",
          coil_length: selectedCableData.coil_length || "",
          category_name: selectedCableData.category?.name || "",
          category_code: selectedCableData.category?.code || "",
        });

        // Set category to match
        const catObj = selectedCableData.category || dbCategories.find(c => String(c.id) === String(selectedCableData.category_id));
        if (catObj) {
          setSelectedCategory(catObj.name);
          setIsManualCategory(false);
          setNewProduct(prev => ({
            ...prev,
            category_name: catObj.name,
            category_code: catObj.code || ""
          }));
        }

        // Populate priceFields using core_type_id as keys
        const matrixFields = {};
        const matrixPrices = {};
        const coreTypeIds = [];
        
        if (Array.isArray(selectedCableData.price_matrix)) {
          selectedCableData.price_matrix.forEach(item => {
            const ctId = String(item.core_type_id);
            matrixFields[ctId] = {
              price: item.price,
              coil_length: item.coil_length
            };
            matrixPrices[ctId] = {
              price: item.price,
              coil_length: item.coil_length || selectedCableData.coil_length || ""
            };
            coreTypeIds.push(ctId);
          });
        }
        setPriceFields(matrixFields);
        setCorePrices(matrixPrices);
        setSelectedCoreTypeIds(coreTypeIds);
      } else if (cableData[selectedCategory]) {
        // Handle static categories
        if (
          selectedCategory === "DC Solar Flexible Photovoltic UV-Resistant Cable"
        ) {
          setPriceFields({
            plainPrice: selectedCableData.plainPrice || 0,
            tinnedPrice: selectedCableData.tinnedPrice || 0,
          });
        } else if (
          selectedCategory === "General cables" ||
          selectedCategory === "Flexible Cables BS 6500 IEC 60228"
        ) {
          setPriceFields(selectedCableData.prices || {});
        } else if (
          selectedCategory === "POWER CABLES" ||
          selectedCategory === "ALUMINIUM CABLES"
        ) {
          setPriceFields(selectedCableData.prices || {});
        } else {
          setPriceFields({ price: selectedCableData.price || 0 });
        }
      }
    }
  };

  // Handle price field change
  const handlePriceChange = (field, value) => {
    const val = value ? parseFloat(value) : 0;
    
    // Check if we are editing a database product or a static one
    const cableList = getCableList();
    const currentCable = cableList.find(c => String(c.id) === String(selectedCable));
    
    if (currentCable && currentCable.id) {
      setPriceFields((prev) => ({
        ...prev,
        [field]: {
          ...(prev[field] || {}),
          price: val,
          coil_length: prev[field]?.coil_length || 0,
        },
      }));
    } else {
      setPriceFields((prev) => ({
        ...prev,
        [field]: val,
      }));
    }
  };

  // variant type change handler
  const handleVariantTypeChange = async (value) => {
    setSelectedVariantType(value);
    setSelectedVariantOption("");
    setVariantOptions([]);

    if (!value) return;

    try {
      const res = await getVariantOptions();
      const opts =
        res.data?.data ||
        res.data?.variant_options ||
        (Array.isArray(res.data) ? res.data : []);
      // filter by matching type id
      let filtered = opts.filter((opt) => {
        if (opt.variant_type) {
          return String(opt.variant_type.id) === String(value);
        }
        if (opt.variant_type_id) {
          return String(opt.variant_type_id) === String(value);
        }
        return false;
      });

      // Static list of standard colors for wires
      const standardColors = [
        { id: "black", name: "Black" },
        { id: "red", name: "Red" },
        { id: "blue", name: "Blue" },
        { id: "yellow", name: "Yellow" },
        { id: "green", name: "Green" },
        { id: "white", name: "White" },
        { id: "grey", name: "Grey" },
        { id: "yellow_green", name: "Yellow/Green" },
        { id: "brown", name: "Brown" },
      ];

      // Use standard colors if the selected type is color-related
      const selectedTypeObj = variantTypes.find(
        (vt) => String(vt.id) === String(value) || vt.name === value,
      );
      if (selectedTypeObj?.name?.toLowerCase().includes("color")) {
        filtered = standardColors;
      }
      setVariantOptions(filtered);
    } catch (err) {
      console.error("Error fetching variant options:", err);
    }
  };

  const handleVariantOptionChange = (value) => {
    setSelectedVariantOption(value);
  };

  // Handle save (both edit and add)
  // Handle save
  const handleSave = async () => {
    if (mode === "add") {
      if (!newProduct.name || !newProduct.category_name) {
        alert("Product Name and Category Name are required");
        return;
      }
      setSubmitting(true);
      try {
        let categoryId;
        const manualCode = newProduct.category_code
          ? newProduct.category_code.trim().replace(/\s+/g, "_")
          : "";
        const inputCode = manualCode || generateCode(newProduct.category_name);

        const existingCat = dbCategories.find(
          (c) =>
            generateCode(c.name) === generateCode(newProduct.category_name) ||
            (c.code && c.code === inputCode),
        );

        if (existingCat) {
          console.log("Found existing category:", existingCat);
          categoryId = existingCat.id;
        } else {
          console.log(
            "Creating new category:",
            newProduct.category_name,
            "with code:",
            inputCode,
          );
          try {
            const categoryRes = await createCategory({
              name: newProduct.category_name,
              display_name: newProduct.category_name,
              code: inputCode,
            });
            console.log("Category creation response:", categoryRes.data);
            categoryId =
              categoryRes.data?.data?.id ||
              categoryRes.data?.id ||
              categoryRes.data?.category?.id ||
              (typeof categoryRes.data === "number" ? categoryRes.data : null);
          } catch (catErr) {
            // If code is taken, it means it was created by someone else or name is slightly different
            if (
              catErr.response?.status === 422 &&
              (JSON.stringify(catErr.response.data).includes("taken") ||
                JSON.stringify(catErr.response.data).includes("exists"))
            ) {
              console.log("Category code taken, fetching updated list...");
              // Refresh categories and try to find it
              const freshCatRes = await getCategories();
              if (freshCatRes.data && freshCatRes.data.success) {
                const updatedCats = freshCatRes.data.data || [];
                setDbCategories(updatedCats);
                const foundAgain = updatedCats.find(
                  (c) =>
                    generateCode(c.name) === inputCode ||
                    (c.code && c.code === inputCode),
                );
                if (foundAgain) {
                  categoryId = foundAgain.id;
                  console.log("Found category after refresh:", foundAgain);
                }
              }
            }
            if (!categoryId) throw catErr; // Re-throw if still not found
          }
        }

        console.log("Resulting Category ID:", categoryId);
        if (!categoryId) {
          console.error("Failed to determine Category ID. Data available:", {
            existingCat,
            newProduct_category_name: newProduct.category_name,
            dbCategories_sample: dbCategories.slice(0, 2),
          });
          throw new Error("Could not determine Category ID");
        }

        // 2. Create/Check Core Type if manual
        if (isManualCore && newProduct.core_type) {
          const coreCode = generateCode(newProduct.core_type);
          const existingCore = dbCoreTypes.find(
            (ct) =>
              generateCode(ct.name) === coreCode ||
              (ct.code && ct.code === coreCode),
          );

          if (!existingCore) {
            try {
              await createCoreType({
                name: newProduct.core_type,
                display_name: newProduct.core_type,
                code: coreCode + "_" + Math.floor(Math.random() * 10000),
              });
            } catch (coreErr) {
              console.warn(
                "Core type creation failed (possibly code taken), skipping...",
                coreErr,
              );
            }
          }
        }

        // 3. Build price matrix from selected core prices
        const priceMatrixEntries = Object.entries(corePrices)
          .filter(([, val]) => val.price > 0)
          .map(([coreId, val]) => ({
            core_type_id: parseInt(coreId),
            price: parseFloat(val.price) || 0,
            coil_length: parseFloat(val.coil_length) || parseFloat(newProduct.coil_length) || 0,
          }));

        // Use the first selected core's price as base_price fallback
        const fallbackBasePrice = priceMatrixEntries.length > 0
          ? priceMatrixEntries[0].price
          : (parseFloat(newProduct.base_price) || 0);

        // 4. Create Product with price_matrix included
        const productData = {
          name: newProduct.name,
          display_name: newProduct.name,
          description: newProduct.description,
          category_id: categoryId,
          sub_category: selectedSubCategory,
          core_type: selectedCoreTypeIds.length > 0
            ? generateCode(dbCoreTypes.find(c => String(c.id) === String(selectedCoreTypeIds[0]))?.name || newProduct.core_type)
            : generateCode(newProduct.core_type),
          size: newProduct.size,
          construction: newProduct.construction,
          material: newProduct.material,
          gauge: newProduct.gauge,
          formation: newProduct.gauge,
          voltage_rating: newProduct.voltage_rating,
          uom: newProduct.uom,
          base_price: fallbackBasePrice,
          coil_length: parseFloat(newProduct.coil_length) || 0,
          // Price matrix — per-core-type pricing
          price_matrix: priceMatrixEntries.length > 0 ? priceMatrixEntries : null,
          // include variant info if selected
          variant_type_id: selectedVariantType || undefined,
          variant_option_id: selectedVariantOption || undefined,
          color:
            variantTypes
              .find(
                (vt) =>
                  String(vt.id) === String(selectedVariantType) ||
                  vt.name === selectedVariantType,
              )
              ?.name?.toLowerCase()
              .includes("color")
              ? selectedVariantOption || undefined
              : undefined,
          is_active: true,
        };

        console.log("Creating product with data:", productData);
        const productRes = await createProduct(productData);

        const resData = productRes.data;
        if (resData.success || resData.data?.success) {
          alert("Product added successfully!");
          handleReset();
          fetchData();
          setIsManualCore(false);
        } else {
          alert(
            "Failed to add product: " +
              (resData.message || resData.data?.message || "Unknown error"),
          );
        }
      } catch (error) {
        console.error("Error in add flow:", error);
        console.error("Full error response:", error.response?.data);

        let errorMsg = error.message;
        if (error.response?.data) {
          const data = error.response.data;
          if (data.message) {
            errorMsg = data.message;
          } else if (data.errors) {
            // Flatten Laravel-style validation errors
            errorMsg = Object.values(data.errors).flat().join(" ");
          } else if (typeof data === "string") {
            errorMsg = data;
          }
        }

        alert("Failed to process request: " + errorMsg);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!selectedCable && mode === "edit") {
      alert("Please select a cable to edit");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit") {
        // Find the matching product to get its real ID
        const selectedCableData = allProducts.find(p => String(p.id) === String(selectedCable));

        if (!selectedCableData || !selectedCableData.id) {
          alert("Could not identify the database product to update.");
          setSubmitting(false);
          return;
        }

        // 1. Determine Category ID
        let categoryId = selectedCableData.category_id;
        
        // Only try to find/create a category if the name was changed manually
        if (newProduct.category_name && newProduct.category_name !== (selectedCableData.category?.name || dbCategories.find(c => String(c.id) === String(selectedCableData.category_id))?.name)) {
          const manualCode = newProduct.category_code ? newProduct.category_code.trim().replace(/\s+/g, "_") : "";
          const inputCode = manualCode || generateCode(newProduct.category_name);

          const existingCat = dbCategories.find(c => 
            generateCode(c.name) === generateCode(newProduct.category_name) || (c.code && c.code === inputCode)
          );

          if (existingCat) {
            categoryId = existingCat.id;
          } else if (newProduct.category_name) {
            try {
              const categoryRes = await createCategory({
                name: newProduct.category_name,
                display_name: newProduct.category_name,
                code: inputCode || generateCode(newProduct.category_name) || `cat_${Date.now()}`,
              });
              categoryId = categoryRes.data?.data?.id || categoryRes.data?.id || categoryRes.data?.category?.id;
            } catch (catErr) {
              console.warn("Could not create/select category, using existing:", categoryId);
            }
          }
        }

        // 2. Build price matrix
        const priceMatrixEntries = Object.entries(corePrices)
          .filter(([, val]) => (parseFloat(val.price) || 0) > 0)
          .map(([coreId, val]) => ({
            core_type_id: parseInt(coreId),
            price: parseFloat(val.price) || 0,
            coil_length: parseFloat(val.coil_length) || parseFloat(newProduct.coil_length) || 0,
          }));

        // 3. Update Product with full metadata
        const productData = {
          name: newProduct.name,
          display_name: newProduct.name,
          description: newProduct.description,
          category_id: categoryId,
          sub_category: selectedSubCategory,
          size: newProduct.size,
          construction: newProduct.construction,
          material: newProduct.material,
          gauge: newProduct.gauge,
          voltage_rating: newProduct.voltage_rating,
          uom: newProduct.uom,
          base_price: priceMatrixEntries.length > 0 ? priceMatrixEntries[0].price : (parseFloat(newProduct.base_price) || 0),
          coil_length: parseFloat(newProduct.coil_length) || 0,
          price_matrix: priceMatrixEntries
        };

        console.log("Updating product:", selectedCableData.id, productData);

        const res = await updateProduct(selectedCableData.id, productData);
        if (res.data.success) {
          alert("Product updated successfully in database!");
          fetchData(); // Refresh list
          handleReset(); // Clear selection and form
        } else {
          alert("Failed to update product: " + (res.data.message || "Unknown error"));
        }
      }
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCoreType = async () => {
    if (!newProduct.core_type || !newProduct.core_type.trim()) {
      alert("Please enter a core type name");
      return;
    }

    try {
      setSubmitting(true);
      const res = await createCoreType({
        name: newProduct.core_type.trim(),
        display_name: newProduct.core_type.trim(),
        code: generateCode(newProduct.core_type.trim())
      });

      if (res.data.success || res.data.data?.success) {
        const newCore = res.data.data || res.data.core_type;
        // Refresh the list of core types
        await fetchData(); 
        // Automatically select the new core type
        setSelectedCoreTypeIds(prev => [...prev, String(newCore.id)]);
        // Clear the input
        handleProductFieldChange("core_type", "");
      } else {
        alert("Failed to create core type: " + (res.data.message || res.data.data?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error creating core type:", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    // Keep current mode but reset selection and form
    setSelectedCategory("");
    setSelectedCable("");
    setSelectedSubCategory("");
    setPriceFields({});
    setNewProduct({
      name: "",
      description: "",
      size: "",
      construction: "",
      core_type: "",
      material: "",
      gauge: "",
      voltage_rating: "",
      uom: "MTR",
      base_price: "",
      coil_length: "",
      category_name: "",
      category_code: "",
    });
    setIsManualCore(false);
    setIsManualCategory(false);
    setSelectedVariantType("");
    setSelectedVariantOption("");
    setVariantOptions([]);
    setCorePrices({});
    setSelectedCoreTypeIds([]);
  };

  // Get price fields configuration based on category
  const getPriceFieldsConfig = () => {
    switch (selectedCategory) {
      case "Imperial Sizes BS-2004":
      case "Co-axial Cables(RG-Type)":
      case "Telephone & Intercom Cables":
        return [{ label: "Price (Rs.)", field: "price" }];

      case "DC Solar Flexible Photovoltic UV-Resistant Cable":
        return [
          { label: "Plain Copper Price (Rs.)", field: "plainPrice" },
          { label: "Tinned Copper Price (Rs.)", field: "tinnedPrice" },
        ];

      case "General cables":
        return [
          { label: "Single Core Price (Rs.)", field: "singleCore" },
          { label: "2/Core Flat Price (Rs.)", field: "twoCoreFlat" },
          { label: "3/Core Round Price (Rs.)", field: "threeCoreRound" },
          { label: "4/Core Round Price (Rs.)", field: "fourCoreRound" },
        ];

      case "Flexible Cables BS 6500 IEC 60228":
        return [
          { label: "Single Core Price (Rs.)", field: "singleCore" },
          { label: "2/Core Round Price (Rs.)", field: "twoCoreRound" },
          { label: "3/Core Round Price (Rs.)", field: "threeCoreRound" },
          { label: "4/Core Round Price (Rs.)", field: "fourCoreRound" },
        ];

      case "POWER CABLES":
        return [
          { label: "Single/Core PVC (Rs.)", field: "single" },
          { label: "S/C PVC/PVC (Rs.)", field: "sc" },
          { label: "3/C PVC/PVC (Rs.)", field: "three" },
          { label: "3.5/C PVC/PVC (Rs.)", field: "threeHalf" },
          { label: "4/C PVC/PVC (Rs.)", field: "four" },
        ];

      case "ALUMINIUM CABLES":
        return [
          { label: "Single (Rs.)", field: "single" },
          { label: "2/C (Rs.)", field: "two" },
          { label: "3/C (Rs.)", field: "three" },
          { label: "3.5/C (Rs.)", field: "threeHalf" },
          { label: "4/C (Rs.)", field: "four" },
        ];

      default:
        // For database products, we generate fields based on the price matrix contents
        if (selectedCable) {
          const cableList = getCableList();
          const p = cableList.find(c => String(c.id) === String(selectedCable) || (c.name || c.description || c.size) === selectedCable);
          if (p && Array.isArray(p.price_matrix)) {
            return p.price_matrix.map(pm => {
              const ct = dbCoreTypes.find(ct => String(ct.id) === String(pm.core_type_id));
              return {
                label: (ct?.display_name || ct?.name || `Core #${pm.core_type_id}`) + " Price (Rs.)",
                field: String(pm.core_type_id),
                isMatrix: true
              };
            });
          }
        }
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Cable Prices</h1>
          <p className="text-gray-400">
            Edit existing cable prices or add new cables to the database
          </p>

          {/* Mode Toggle */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setMode("edit")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === "edit"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Edit Existing Cable
            </button>
            <button
              onClick={() => setMode("add")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === "add"
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Add New Cable
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-6">
            {mode === "edit" ? "Edit Cable Price" : "Add New Cable"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Input/Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {mode === "add" ? "Category Name *" : "Select Cable Category *"}
              </label>
              {mode === "add" ? (
                !isManualCategory ? (
                  <select
                    value={newProduct.category_name}
                    onChange={(e) => {
                      if (e.target.value === "MANUAL") {
                        setIsManualCategory(true);
                        handleProductFieldChange("category_name", "");
                        handleProductFieldChange("category_code", "");
                      } else {
                        handleProductFieldChange(
                          "category_name",
                          e.target.value,
                        );
                      }
                    }}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {dbCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    <option value="MANUAL">+ Add New Category</option>
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={newProduct.category_name}
                      onChange={(e) =>
                        handleProductFieldChange(
                          "category_name",
                          e.target.value,
                        )
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Building Wires"
                    />
                    <button
                      type="button"
                      onClick={() => setIsManualCategory(false)}
                      className="absolute right-2 top-2 text-xs text-blue-400 hover:text-blue-300 p-1"
                    >
                      Back to List
                    </button>
                  </div>
                )
              ) : (
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Category Code (Add Mode) - Only show if manual */}
            {mode === "add" && isManualCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category Code *
                </label>
                <input
                  type="text"
                  value={newProduct.category_code}
                  onChange={(e) =>
                    handleProductFieldChange("category_code", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., BW_001"
                />
              </div>
            )}



            {/* Sub-category for specific categories */}
            {(selectedCategory.includes("POWER CABLES") ||
              selectedCategory.includes("ALUMINIUM CABLES") ||
              selectedCategory.includes("Power Cables") ||
              selectedCategory.includes("Aluminium Cables")) && (
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

            {/* Product Table (Edit Mode) */}
            {mode === "edit" && (
              <div className="md:col-span-2 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 className="text-lg font-semibold text-white">Select Product to Edit</h3>
                  <div className="relative w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-2 pl-8 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <svg className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div className="overflow-x-auto border border-gray-700 rounded-xl bg-gray-800/50">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-700/50 border-b border-gray-700 text-gray-400 uppercase tracking-wider">
                        <th className="px-3 py-3 font-semibold">Category</th>
                        <th className="px-3 py-3 font-semibold">Product Name</th>
                        <th className="px-3 py-3 font-semibold">Core Types / Detail</th>
                        <th className="px-3 py-3 font-semibold">Material</th>
                        <th className="px-3 py-3 font-semibold">Construction</th>
                        <th className="px-3 py-3 font-semibold">Voltage</th>
                        <th className="px-3 py-3 font-semibold text-right">Prices (Rs.)</th>
                        <th className="px-3 py-3 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {allProducts
                        .filter(p => {
                          const catName = p.category?.name || dbCategories.find(c => String(c.id) === String(p.category_id))?.name || "";
                          const search = searchQuery.toLowerCase();
                          return p.name?.toLowerCase().includes(search) || 
                                 catName.toLowerCase().includes(search);
                        })
                        .map((p) => {
                          const hasMatrix = p.price_matrix && Array.isArray(p.price_matrix) && p.price_matrix.length > 0;
                          const catName = p.category?.name || dbCategories.find(c => String(c.id) === String(p.category_id))?.name || "N/A";
                          return (
                            <tr key={p.id} className={`hover:bg-gray-700/30 transition-colors ${String(selectedCable) === String(p.id) ? 'bg-blue-500/10' : ''}`}>
                              <td className="px-3 py-3 text-gray-400">{catName}</td>
                              <td className="px-3 py-3 font-medium text-gray-200">{p.name}</td>
                              <td className="px-3 py-3 text-gray-400">
                                {hasMatrix ? (
                                  <div className="flex flex-wrap gap-1">
                                    {p.price_matrix.map((pm, idx) => {
                                      const coreType = dbCoreTypes.find(ct => String(ct.id) === String(pm.core_type_id));
                                      return (
                                        <span key={idx} className="bg-gray-700 px-1.5 py-0.5 rounded text-[10px]">
                                          {coreType?.name || coreType?.display_name || pm.core_type_id}
                                        </span>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  p.core_type || "N/A"
                                )}
                              </td>
                              <td className="px-3 py-3 text-gray-400">{p.material || "N/A"}</td>
                              <td className="px-3 py-3 text-gray-400">{p.construction || "N/A"}</td>
                              <td className="px-3 py-3 text-gray-400">{p.voltage_rating || "N/A"}</td>
                              <td className="px-3 py-3 text-right">
                                {hasMatrix ? (
                                  <div className="space-y-1">
                                    {p.price_matrix.map((pm, idx) => {
                                       const coreType = dbCoreTypes.find(ct => String(ct.id) === String(pm.core_type_id));
                                       return (
                                         <div key={idx} className="whitespace-nowrap">
                                           <span className="text-[10px] text-gray-500 mr-1">{coreType?.name || pm.core_type_id}:</span>
                                           <span className="text-gray-200">{(parseFloat(pm.price) || 0).toLocaleString()}</span>
                                         </div>
                                       );
                                    })}
                                  </div>
                                ) : (
                                  <span className="text-gray-200 font-semibold">{(parseFloat(p.base_price) || 0).toLocaleString()}</span>
                                )}
                              </td>
                              <td className="px-3 py-3 text-center">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => handleCableSelect(String(p.id))}
                                    className={`p-1.5 rounded-lg transition-colors ${String(selectedCable) === String(p.id) ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-400 hover:bg-gray-600'}`}
                                    title="Edit Product"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1.5 bg-gray-700 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete Product"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {allProducts.length === 0 && (
                        <tr>
                          <td colSpan="8" className="px-4 py-8 text-center text-gray-500 italic">No products found in database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Add Mode or Edit Mode with Selection - Full Product Form */}
            {(mode === "add" || (mode === "edit" && selectedCable)) && (
              <>
                <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6">
                    {mode === "edit" ? "Edit Product Details" : "New Product Details"}
                  </h3>
                </div>
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      handleProductFieldChange("name", e.target.value)
                    }
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1.0mm² Solid Building Wire"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newProduct.description}
                    onChange={(e) =>
                      handleProductFieldChange("description", e.target.value)
                    }
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1.0mm² Solid Copper Building Wire 450/750V"
                  />
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Size
                  </label>
                  <input
                    type="text"
                    value={newProduct.size}
                    onChange={(e) =>
                      handleProductFieldChange("size", e.target.value)
                    }
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1.0mm²"
                  />
                </div>

                {/* Construction */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Construction
                  </label>
                  <input
                    type="text"
                    value={newProduct.construction}
                    onChange={(e) =>
                      handleProductFieldChange("construction", e.target.value)
                    }
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Solid or Stranded"
                  />
                </div>

                {/* Material */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Material
                  </label>
                  <input
                    type="text"
                    value={newProduct.material}
                    onChange={(e) =>
                      handleProductFieldChange("material", e.target.value)
                    }
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Copper/PVC"
                  />
                </div>

                {/* Gauge */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gauge
                  </label>
                  <input
                    type="text"
                    value={newProduct.gauge}
                    onChange={(e) =>
                      handleProductFieldChange("gauge", e.target.value)
                    }
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1/1.13 mm"
                  />
                </div>

                {/* Voltage Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Voltage Rating
                  </label>
                  <input
                    type="text"
                    value={newProduct.voltage_rating}
                    onChange={(e) =>
                      handleProductFieldChange("voltage_rating", e.target.value)
                    }
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 450/750V"
                  />
                </div>

                {/* UOM (Unit of Measure) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Unit of Measure *
                  </label>
                  <select
                    value={newProduct.uom}
                    onChange={(e) =>
                      handleProductFieldChange("uom", e.target.value)
                    }
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="MTR">MTR (Meter)</option>
                    <option value="RFT">RFT (Running Foot)</option>
                    <option value="UNIT">UNIT</option>
                  </select>
                </div>

                {/* Variant type dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Variant Type
                  </label>
                  <select
                    value={selectedVariantType}
                    onChange={(e) => handleVariantTypeChange(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">None</option>
                    {Array.isArray(variantTypes) &&
                      variantTypes.map((vt) => (
                        <option key={vt.id || vt.name} value={vt.id || vt.name}>
                          {vt.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Variant option (color) - only show if color type selected */}
                {selectedVariantType &&
                  variantTypes
                    .find(
                      (vt) =>
                        String(vt.id) === String(selectedVariantType) ||
                        vt.name === selectedVariantType,
                    )
                    ?.name?.toLowerCase()
                    .includes("color") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Color
                      </label>
                      <select
                        value={selectedVariantOption}
                        onChange={(e) =>
                          handleVariantOptionChange(e.target.value)
                        }
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select color</option>
                        {Array.isArray(variantOptions) &&
                          variantOptions.map((opt) => (
                            <option
                              key={opt.id || opt.name}
                              value={opt.id || opt.name}
                            >
                              {opt.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                {/* Coil Length (shared across all cores) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Coil Length (meters)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.coil_length}
                    onChange={(e) =>
                      handleProductFieldChange("coil_length", e.target.value)
                    }
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 90"
                  />
                </div>

                {/* Core Type - Multi-select Checkboxes (Add Mode) */}
                {dbCoreTypes.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Core Types (Optional)
                    </label>
                    <p className="text-gray-500 text-xs mb-3">
                      Check all core types that apply to this product. Leave empty if the product doesn't have core types.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {dbCoreTypes.map((ct) => {
                        const isChecked = selectedCoreTypeIds.includes(String(ct.id));
                        return (
                          <label
                            key={ct.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                              isChecked
                                ? "bg-blue-500/20 border-blue-500 text-white"
                                : "bg-gray-700/50 border-gray-600 text-gray-300 hover:border-gray-500"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCoreTypeIds((prev) => [...prev, String(ct.id)]);
                                } else {
                                  setSelectedCoreTypeIds((prev) =>
                                    prev.filter((id) => id !== String(ct.id)),
                                  );
                                  // Also remove the price entry
                                  setCorePrices((prev) => {
                                    const copy = { ...prev };
                                    delete copy[ct.id];
                                    return copy;
                                  });
                                }
                              }}
                              className="w-4 h-4 rounded border-gray-500 text-blue-500 focus:ring-blue-500 bg-gray-700"
                            />
                            <span className="text-sm font-medium">
                              {generateCode(ct.name || ct.display_name)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    
                    {/* Manual Core Type Input */}
                    <div className="mt-4">
                      {!isManualCore ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsManualCore(true);
                            handleProductFieldChange("core_type", "");
                          }}
                          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          <span>+</span> Add New Core Type (Manual)
                        </button>
                      ) : (
                        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-300">
                              New Core Type Name *
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setIsManualCore(false);
                                handleProductFieldChange("core_type", "");
                              }}
                              className="text-xs text-blue-400 hover:text-blue-300"
                            >
                              Close
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newProduct.core_type}
                              onChange={(e) =>
                                handleProductFieldChange("core_type", e.target.value)
                              }
                              className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-blue-500"
                              placeholder="e.g., 5 Core or XLPE Armoured"
                            />
                            <button
                              type="button"
                              onClick={handleCreateCoreType}
                              disabled={submitting || !newProduct.core_type}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors disabled:opacity-50"
                            >
                              Add
                            </button>
                          </div>
                          {newProduct.core_type && (
                            <p className="text-xs text-gray-400 mt-1">
                              Preview Code: <span className="text-blue-400 font-mono">{generateCode(newProduct.core_type)}</span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {selectedCoreTypeIds.length > 0 && (
                      <p className="text-blue-400 text-xs mt-2">
                        {selectedCoreTypeIds.length} core type(s) selected
                      </p>
                    )}
                  </div>
                )}

                {/* Base Price - Only show when no core types selected */}
                {selectedCoreTypeIds.length === 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Base Price (Rs.) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400 text-sm">
                        Rs.
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={newProduct.base_price}
                        onChange={(e) =>
                          handleProductFieldChange("base_price", e.target.value)
                        }
                        className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter base price"
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      Set the base price since no core types are selected.
                    </p>
                  </div>
                )}

                {/* ── Price per Selected Core Type ── */}
                {selectedCoreTypeIds.length > 0 && (
                  <div className="md:col-span-2">
                    <div className="border border-green-500/30 rounded-lg p-4 bg-green-500/5 mt-2">
                      <h4 className="text-md font-semibold text-green-300 mb-3">
                        💰 Set Price for Each Core Type
                      </h4>
                      <p className="text-gray-400 text-sm mb-4">
                        Enter the base price for each selected core type.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedCoreTypeIds.map((ctId) => {
                          const ct = dbCoreTypes.find(
                            (c) => String(c.id) === String(ctId),
                          );
                          const label = generateCode(ct?.name || ct?.display_name || `Core #${ctId}`);
                          return (
                            <div
                              key={ctId}
                              className="bg-gray-700/50 p-3 rounded-lg border border-gray-600"
                            >
                              <label className="block text-sm font-medium text-green-300 mb-2">
                                {label}
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400 text-sm">
                                  Rs.
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  value={corePrices[ctId]?.price || ""}
                                  onChange={(e) =>
                                    setCorePrices((prev) => ({
                                      ...prev,
                                      [ctId]: {
                                        ...prev[ctId],
                                        price: e.target.value,
                                        coil_length:
                                          prev[ctId]?.coil_length ||
                                          newProduct.coil_length ||
                                          "",
                                      },
                                    }))
                                  }
                                  className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Enter price"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Price Fields (Edit Mode Only) */}
            {mode === "edit" && selectedCable && (
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Edit Prices
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getPriceFieldsConfig().map((fieldConfig, index) => (
                    <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {fieldConfig.label}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                          Rs.
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={
                            fieldConfig.isMatrix
                              ? priceFields[fieldConfig.field]?.price || ""
                              : priceFields[fieldConfig.field] || ""
                          }
                          onChange={(e) =>
                            handlePriceChange(fieldConfig.field, e.target.value)
                          }
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
              {mode === "edit" && selectedCable ? "Cancel Edit" : "Reset"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={submitting}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === "edit"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {submitting
                ? "Processing..."
                : mode === "edit"
                  ? "Update Product"
                  : "Add New Product"}
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
                <span className="font-medium">Edit Mode:</span> Select a cable
                category and then choose a specific cable to update its prices.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <p className="text-gray-300">
                <span className="font-medium">Add Mode:</span> Enter details for
                a new cable and set its prices across all available types.
              </p>
            </div>
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                ⚠️ Note: Price changes will affect all future quotations. Make
                sure to enter correct prices.
              </p>
            </div>
          </div>

          {/* Current Selection Summary */}
          {selectedCategory && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="text-md font-semibold text-white mb-3">
                Current Selection
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Mode</p>
                  <p className="text-white font-medium">
                    {mode === "edit" ? "Editing" : "Adding New"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Category</p>
                  <p className="text-white font-medium">{selectedCategory}</p>
                </div>
                {selectedSubCategory && (
                  <div>
                    <p className="text-gray-400 text-sm">Type</p>
                    <p className="text-white font-medium">
                      {selectedSubCategory}
                    </p>
                  </div>
                )}
                {mode === "edit" && selectedCable && (
                  <div className="md:col-span-3">
                    <p className="text-gray-400 text-sm">Selected Cable</p>
                    <p className="text-white font-medium">{selectedCable}</p>
                  </div>
                )}
                {mode === "add" && newProduct.name && (
                  <div className="md:col-span-3">
                    <p className="text-gray-400 text-sm">New Cable Name</p>
                    <p className="text-white font-medium">{newProduct.name}</p>
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
