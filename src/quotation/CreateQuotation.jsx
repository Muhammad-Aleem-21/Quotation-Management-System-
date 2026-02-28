// import React, { useState, useEffect } from "react";
// import {
//   getProducts,
//   getCategories,
//   getCoreTypes,
//   getCatalogCategories,
//   getCatalogCoreTypes,
//   submitQuotation,
//   getClients,
//   createClient,
// } from "../api/api";

// // Standard wire colors
// const standardColors = [
//   "Black",
//   "Red",
//   "Blue",
//   "Yellow",
//   "Green",
//   "White",
//   "Grey",
//   "Yellow/Green",
//   "Brown",
// ];

// const discountLimits = {
//   "super-admin": 38,
//   admin: 38,
//   manager: 35,
//   salesperson: 30,
// };

// const CreateQuotation = ({ userRole = "salesperson" }) => {
//   const [step, setStep] = useState(1);

//   // Client info
//   const [clientInfo, setClientInfo] = useState({
//     Name: "",
//     client_id: "",
//     quotation_date: new Date().toISOString().split("T")[0],
//     company_name: "",
//     email: "",
//     phone: "",
//     client_address: "",
//     region: "",
//   });

//   // DB data loaded on mount
//   const [allProducts, setAllProducts] = useState([]);
//   const [allCategories, setAllCategories] = useState([]);
//   const [allCoreTypes, setAllCoreTypes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState("");

//   // Step 2 selections
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");
//   const [selectedProductId, setSelectedProductId] = useState("");
//   const [selectedCoreTypeId, setSelectedCoreTypeId] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");

//   // Derived / filtered lists
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [priceMatrix, setPriceMatrix] = useState([]);
//   const [priceMatrixLoading, setPriceMatrixLoading] = useState(false);

//   // Pricing
//   const [selectedPrice, setSelectedPrice] = useState(0);
//   const [selectedCoilLength, setSelectedCoilLength] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [discountType, setDiscountType] = useState("percentage");
//   const [discountValue, setDiscountValue] = useState(0);

//   // Multi-product list
//   const [quotationItems, setQuotationItems] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Client Management States
//   const [allClients, setAllClients] = useState([]);
//   const [clientMode, setClientMode] = useState("select"); // 'select' or 'create'
//   const [isCreatingClient, setIsCreatingClient] = useState(false);

//   const getDiscountLimit = () => discountLimits[userRole] || 30;

//   // ── Fetch all data on mount ──
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setLoadError("");
//       try {
//         const isSalesOrManager = userRole === "salesperson" || userRole === "manager";
        
//         console.log("Starting data fetch...");
        
//         const [prodRes, catRes, coreRes, clientRes] = await Promise.all([
//           getProducts().catch(err => { console.error("Products Fetch Error:", err); throw err; }),
//           (isSalesOrManager ? getCatalogCategories() : getCategories()).catch(err => { console.error("Categories Fetch Error:", err); throw err; }),
//           (isSalesOrManager ? getCatalogCoreTypes() : getCoreTypes()).catch(err => { console.error("CoreTypes Fetch Error:", err); throw err; }),
//           getClients().catch(err => { console.error("Clients Fetch Error:", err); throw err; }),
//         ]);

//         console.log("All API calls completed successfully.");

//         const products = prodRes.data?.data || prodRes.data?.products || (Array.isArray(prodRes.data) ? prodRes.data : []);
//         setAllProducts(products);

//         const cats = catRes.data?.data || catRes.data?.categories || (Array.isArray(catRes.data) ? catRes.data : []);
//         setAllCategories(cats);

//         const cores = coreRes.data?.data || coreRes.data?.core_types || (Array.isArray(coreRes.data) ? coreRes.data : []);
//         setAllCoreTypes(cores);

//         const clientsArray = clientRes.data?.data || clientRes.data?.clients || (Array.isArray(clientRes.data) ? clientRes.data : []);
//         console.log("Fetched Clients Raw:", clientRes.data);
//         console.log("Processed Clients:", clientsArray);
        
//         // Ensure we have an array and each object has a name fallback
//         const sanitizedClients = (Array.isArray(clientsArray) ? clientsArray : []).map(c => ({
//           ...c,
//           id: c.id || c.client_id,
//           name: c.name || c.client_name || c.company_name || "Unnamed Client",
//           region: c.region || ""
//         }));
        
//         setAllClients(sanitizedClients);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoadError(
//           "Failed to load data from server. " + (error.response?.data?.message || error.message)
//         );
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [userRole]);

//   // ── When category changes → filter products ──
//   useEffect(() => {
//     if (!selectedCategoryId) {
//       setFilteredProducts([]);
//       setSelectedProductId("");
//       setPriceMatrix([]);
//       setSelectedCoreTypeId("");
//       setSelectedPrice(0);
//       return;
//     }

//     const filtered = allProducts.filter(
//       (p) => String(p.category_id) === String(selectedCategoryId),
//     );
//     setFilteredProducts(filtered);

//     // Reset downstream
//     setSelectedProductId("");
//     setPriceMatrix([]);
//     setSelectedCoreTypeId("");
//     setSelectedPrice(0);
//     setSelectedCoilLength(0);
//   }, [selectedCategoryId, allProducts]);

//   // ── When product changes → read price matrix from product data ──
//   useEffect(() => {
//     if (!selectedProductId) {
//       setPriceMatrix([]);
//       setSelectedCoreTypeId("");
//       setSelectedPrice(0);
//       setSelectedCoilLength(0);
//       return;
//     }

//     // Read price_matrix directly from the product object
//     const product = allProducts.find(
//       (p) => String(p.id) === String(selectedProductId),
//     );
//     const matrix = product?.price_matrix;

//     if (Array.isArray(matrix) && matrix.length > 0) {
//       setPriceMatrix(matrix);
//     } else {
//       setPriceMatrix([]);
//     }
//     setPriceMatrixLoading(false);

//     // Reset downstream
//     setSelectedCoreTypeId("");
//     setSelectedPrice(0);
//     setSelectedCoilLength(0);
//   }, [selectedProductId]);

//   // ── When core type changes → set price from matrix ──
//   useEffect(() => {
//     if (!selectedCoreTypeId || priceMatrix.length === 0) {
//       setSelectedPrice(0);
//       setSelectedCoilLength(0);
//       return;
//     }

//     const entry = priceMatrix.find(
//       (p) => String(p.core_type_id) === String(selectedCoreTypeId),
//     );
//     if (entry) {
//       setSelectedPrice(parseFloat(entry.price) || 0);
//       setSelectedCoilLength(parseFloat(entry.coil_length) || 0);
//     } else {
//       setSelectedPrice(0);
//       setSelectedCoilLength(0);
//     }
//   }, [selectedCoreTypeId, priceMatrix]);

//   // ── Price calculations ──
//   const totalBeforeDiscount = selectedPrice * quantity;
//   let discountAmount = 0;
//   if (discountValue > 0 && discountType === "percentage") {
//     const effectiveDiscount = Math.min(discountValue, getDiscountLimit());
//     discountAmount = (totalBeforeDiscount * effectiveDiscount) / 100;
//   } else if (discountValue > 0 && discountType === "fixed") {
//     discountAmount = discountValue;
//   }
//   const finalPrice = totalBeforeDiscount - discountAmount;
//   const grandTotal = quotationItems.reduce((s, i) => s + i.finalPrice, 0);

//   // ── Helpers ──
//   const getCategoryName = (id) =>
//     allCategories.find((c) => String(c.id) === String(id))?.name || id;

//   const getProductName = (id) =>
//     allProducts.find((p) => String(p.id) === String(id))?.name || id;

//   const getCoreTypeName = (id) =>
//     allCoreTypes.find((c) => String(c.id) === String(id))?.name ||
//     allCoreTypes.find((c) => String(c.id) === String(id))?.display_name ||
//     id;

//   // Available core types = those present in the price matrix
//   const availableCoreTypes = priceMatrix
//     .map((pm) => {
//       const ct = allCoreTypes.find(
//         (c) => String(c.id) === String(pm.core_type_id),
//       );
//       return ct
//         ? { id: ct.id, name: ct.name || ct.display_name, price: pm.price }
//         : { id: pm.core_type_id, name: `Core Type #${pm.core_type_id}`, price: pm.price };
//     })
//     .filter((ct) => ct.price > 0); // Only show core types with a price

//   const handleClientInfoChange = (field, value) => {
//     setClientInfo((prev) => ({ ...prev, [field]: value }));
//   };

//   const validateClientInfo = () => {
//     let required = [];
//     if (clientMode === "select") {
//       required = ["client_id", "quotation_date"];
//     } else {
//       required = [
//         "Name",
//         "company_name",
//         "email",
//         "phone",
//         "client_address",
//         "region",
//         "quotation_date",
//       ];
//     }
    
//     const missing = required.filter((f) => !String(clientInfo[f] || "").trim());
//     if (missing.length > 0) {
//       console.log("Validation failed. Missing fields:", missing);
//     }
    
//     return missing.length === 0;
//   };

//   const handleAddToQuotation = () => {
//     if (!selectedProductId || !selectedCoreTypeId || selectedPrice <= 0) {
//       alert("Please select a product and core type to add to quotation.");
//       return;
//     }

//     const item = {
//       id: Date.now(),
//       productId: selectedProductId,
//       coreTypeId: selectedCoreTypeId,
//       productName: getProductName(selectedProductId),
//       categoryName: getCategoryName(selectedCategoryId),
//       coreTypeName: getCoreTypeName(selectedCoreTypeId),
//       color: selectedColor,
//       quantity,
//       coilLength: selectedCoilLength,
//       unitPrice: selectedPrice,
//       totalBeforeDiscount,
//       discountType,
//       discountValue,
//       discountAmount,
//       finalPrice,
//     };

//     setQuotationItems((prev) => [...prev, item]);

//     // Reset form for next product
//     setSelectedProductId("");
//     setSelectedCoreTypeId("");
//     setSelectedColor("");
//     setPriceMatrix([]);
//     setSelectedPrice(0);
//     setSelectedCoilLength(0);
//     setQuantity(1);
//     setDiscountType("percentage");
//     setDiscountValue(0);
//   };

//   const handleRemoveItem = (id) => {
//     setQuotationItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   const handleSubmit = async () => {
//     console.log("Submit button clicked!");
//     console.log("Current items:", quotationItems);

//     if (quotationItems.length === 0) {
//       console.log("Validation failed: No items");
//       alert("Please add at least one item to the quotation.");
//       return;
//     }

//     const invalidItems = quotationItems.filter(item => !item.coreTypeId);
//     if (invalidItems.length > 0) {
//       console.error("Some items are missing coreTypeId:", invalidItems);
//       alert("Error: Some items in your quotation are missing required data (Core Type). Please remove and add them again.");
//       setIsSubmitting(false);
//       return;
//     }

//     setIsSubmitting(true);
//     console.log("isSubmitting set to true");
//     try {
//       const payload = {
//         client_id: clientInfo.client_id,
//         quotation_date: clientInfo.quotation_date,
//         company_name: clientInfo.company_name,
//         client_name: clientInfo.Name,
//         email: clientInfo.email,
//         phone: clientInfo.phone,
//         client_address: clientInfo.client_address,
//         region: clientInfo.region,
//         total_amount: grandTotal,
//         items: quotationItems.map((item) => ({
//           product_id: item.productId,
//           core_type: item.coreTypeId,
//           color: item.color,
//           quantity: item.quantity,
//           unit_price: item.unitPrice,
//           discount_type: item.discountType,
//           discount_value: item.discountValue,
//           final_price: item.finalPrice,
//           coil_length: item.coilLength,
//         })),
//       };
      
//       console.log("Full Payload Structure:", JSON.stringify(payload, null, 2));
//       console.log("Items verification:", payload.items.map(i => ({ pid: i.product_id, ct: i.core_type })));
      
//       console.log("Payload prepared:", payload);

//       // Assuming submitQuotation is imported from an API service
//       console.log("Calling submitQuotation API...");
//       const res = await submitQuotation(payload);
//       console.log("API Response received:", res);

//       if (res.data?.success || res.status === 201 || res.status === 200) {
//         console.log("Submission successful!");
//         alert("Quotation submitted successfully!");
//         // Reset form
//         setQuotationItems([]);
//         setStep(1);
//         setClientInfo({
//           Name: "",
//           client_id: "",
//           quotation_date: new Date().toISOString().split("T")[0],
//           company_name: "",
//           email: "",
//           phone: "",
//           client_address: "",
//         });
//       } else {
//         throw new Error(res.data?.message || "Submission failed");
//       }
//     } catch (error) {
//       console.error("Error submitting quotation:", error);
//       alert(
//         "Failed to submit quotation: " +
//           (error.response?.data?.message || error.message)
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ── LOADING / ERROR STATES ──
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-xl font-medium">Loading Quotation Data...</p>
//           <p className="text-gray-400 mt-2">Fetching products and clients...</p>
//         </div>
//       </div>
//     );
//   }

//   if (loadError) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white p-4">
//         <div className="max-w-md w-full bg-gray-800 border-l-4 border-red-500 p-6 rounded-lg shadow-2xl">
//           <div className="flex items-center mb-4">
//             <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//             </svg>
//             <h2 className="text-xl font-bold">Data Loading Error</h2>
//           </div>
//           <p className="text-gray-300 mb-6">{loadError}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
//           >
//             Retry Loading
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════
//   // RENDER: Step 1 — Client Information
//   // ═══════════════════════════════════════════
//   if (step === 1) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold mb-2">Create Quotation</h1>
//             <p className="text-gray-400">Step 1: Enter Client Information</p>
//             <div className="flex items-center gap-2 mt-4">
//               <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                 1
//               </div>
//               <span className="text-blue-400 font-medium">
//                 Client Information
//               </span>
//               <div className="h-px flex-1 bg-gray-700 mx-4"></div>
//               <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
//                 2
//               </div>
//               <span className="text-gray-500">Cable Selection</span>
//             </div>
//           </div>

//           {/* Client Form */}
//           <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold">Client Details</h2>
//               <div className="flex bg-gray-700 p-1 rounded-lg">
//                 <button
//                   type="button"
//                   onClick={() => setClientMode("select")}
//                   className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                     clientMode === "select"
//                       ? "bg-blue-600 text-white shadow-lg"
//                       : "text-gray-400 hover:text-white"
//                   }`}
//                 >
//                   Return Client
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setClientMode("create")}
//                   className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                     clientMode === "create"
//                       ? "bg-blue-600 text-white shadow-lg"
//                       : "text-gray-400 hover:text-white"
//                   }`}
//                 >
//                   New Client
//                 </button>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {clientMode === "select" ? (
//                 <>
//                   {/* Select Client Dropdown */}
//                   <div className="md:col-span-2">
//                     <label
//                       htmlFor="client_select"
//                       className="block text-sm font-medium text-gray-300 mb-2"
//                     >
//                       Select Existing Client *
//                     </label>
//                     <select
//                       id="client_select"
//                       value={clientInfo.client_id}
//                       onChange={(e) => {
//                         const selectedId = e.target.value;
//                         const client = allClients.find(
//                           (c) => String(c.id) === String(selectedId)
//                         );
//                         if (client) {
//                           setClientInfo({
//                             ...clientInfo,
//                             client_id: client.id,
//                             Name: client.name || client.client_name || "",
//                             company_name: client.company_name || "",
//                             email: client.email || "",
//                             phone: client.phone || "",
//                             client_address: client.client_address || client.address || "",
//                             region: client.region || "",
//                           });
//                         } else {
//                           setClientInfo({
//                             ...clientInfo,
//                             client_id: "",
//                             Name: "",
//                             company_name: "",
//                             email: "",
//                             phone: "",
//                             client_address: "",
//                             region: "",
//                           });
//                         }
//                       }}
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">-- Choose a client --</option>
//                       {allClients.map((c) => (
//                         <option key={c.id} value={c.id}>
//                           {c.company_name || c.name || c.client_name} (
//                           {c.email || "No Email"})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   {/* Name (Contact Person) */}
//                   <div>
//                     <label
//                       htmlFor="Name"
//                       className="block text-sm font-medium text-gray-300 mb-2"
//                     >
//                       Contact Name *
//                     </label>
//                     <input
//                       id="Name"
//                       type="text"
//                       value={clientInfo.Name}
//                       onChange={(e) =>
//                         handleClientInfoChange("Name", e.target.value)
//                       }
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Enter contact name"
//                     />
//                   </div>

//                   {/* Company Name */}
//                   <div>
//                     <label
//                       htmlFor="company_name"
//                       className="block text-sm font-medium text-gray-300 mb-2"
//                     >
//                       Company Name *
//                     </label>
//                     <input
//                       id="company_name"
//                       type="text"
//                       value={clientInfo.company_name}
//                       onChange={(e) =>
//                         handleClientInfoChange("company_name", e.target.value)
//                       }
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Enter company name"
//                     />
//                   </div>

//                   {/* Email */}
//                   <div>
//                     <label
//                       htmlFor="email"
//                       className="block text-sm font-medium text-gray-300 mb-2"
//                     >
//                       Email Address *
//                     </label>
//                     <input
//                       id="email"
//                       type="email"
//                       value={clientInfo.email}
//                       onChange={(e) =>
//                         handleClientInfoChange("email", e.target.value)
//                       }
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="email@company.com"
//                     />
//                   </div>

//                   {/* Phone */}
//                   <div>
//                     <label
//                       htmlFor="phone"
//                       className="block text-sm font-medium text-gray-300 mb-2"
//                     >
//                       Phone Number *
//                     </label>
//                     <input
//                       id="phone"
//                       type="tel"
//                       value={clientInfo.phone}
//                       onChange={(e) =>
//                         handleClientInfoChange("phone", e.target.value)
//                       }
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="+92 300 1234567"
//                     />
//                   </div>

//                   {/* Address */}
//                   <div>
//                     <label
//                       htmlFor="client_address"
//                       className="block text-sm font-medium text-gray-300 mb-2"
//                     >
//                       Client Address *
//                     </label>
//                     <input
//                       id="client_address"
//                       type="text"
//                       value={clientInfo.client_address}
//                       onChange={(e) =>
//                         handleClientInfoChange("client_address", e.target.value)
//                       }
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Street address, Building, Area"
//                     />
//                   </div>

//                   {/* Region */}
//                   <div>
//                     <label
//                       htmlFor="region"
//                       className="block text-sm font-medium text-gray-300 mb-2"
//                     >
//                       Region *
//                     </label>
//                     <input
//                       id="region"
//                       type="text"
//                       value={clientInfo.region}
//                       onChange={(e) =>
//                         handleClientInfoChange("region", e.target.value)
//                       }
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="e.g. Asia, Europe, Karachi, etc."
//                     />
//                   </div>
//                 </>
//               )}

//               {/* Quotation Date (Always visible) */}
//               <div className="md:col-span-2">
//                 <label
//                   htmlFor="quotation_date"
//                   className="block text-sm font-medium text-gray-300 mb-2"
//                 >
//                   Quotation Date *
//                 </label>
//                 <input
//                   id="quotation_date"
//                   type="date"
//                   value={clientInfo.quotation_date}
//                   onChange={(e) =>
//                     handleClientInfoChange("quotation_date", e.target.value)
//                   }
//                   className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="mt-8 flex justify-between">
//               <button
//                 type="button"
//                 className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
//                 onClick={() => window.history.back()}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={async () => {
//                   if (!validateClientInfo()) {
//                     alert("Please fill all required fields (marked with *)");
//                     return;
//                   }

//                   if (clientMode === "create") {
//                     setIsCreatingClient(true);
//                     try {
//                       const clientPayload = {
//                         name: clientInfo.Name,
//                         company_name: clientInfo.company_name,
//                         email: clientInfo.email,
//                         phone: clientInfo.phone,
//                         address: clientInfo.client_address,
//                         region: clientInfo.region,
//                       };
//                       const res = await createClient(clientPayload);
//                       console.log("Client Creation Success:", res.data);
                      
//                       // Flexible ID extraction
//                       const newClientId = 
//                         res.data?.id || 
//                         res.data?.data?.id || 
//                         res.data?.client?.id || 
//                         res.data?.data?.client?.id;

//                       if (!newClientId) {
//                         console.error("ID not found in response:", res.data);
//                         throw new Error("Client created but failed to retrieve unique ID from server response.");
//                       }
                      
//                       setClientInfo((prev) => ({ ...prev, client_id: newClientId }));
                      
//                       // Refresh clients list
//                       const updatedClientsRes = await getClients();
//                       const updatedList = updatedClientsRes.data?.data || 
//                                          (Array.isArray(updatedClientsRes.data) ? updatedClientsRes.data : []);
//                       setAllClients(updatedList.map(c => ({ ...c, region: c.region || "" })));
//                     } catch (error) {
//                       console.error("Error creating client:", error);
//                       alert("Failed to create client: " + (error.response?.data?.message || error.message));
//                       return;
//                     } finally {
//                       setIsCreatingClient(false);
//                     }
//                   }
                  
//                   setStep(2);
//                 }}
//                 disabled={isCreatingClient}
//                 className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${
//                   isCreatingClient ? "opacity-70 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isCreatingClient ? "Registering Client..." : (
//                   <>Next: Select Cables <span>→</span></>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Client Summary */}
//           {clientInfo.Name && (
//             <div className="mt-6 bg-gray-800 rounded-xl p-4 border border-gray-700">
//               <h3 className="text-lg font-semibold text-white mb-3">
//                 Client Summary
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 <div>
//                   <p className="text-gray-400 text-sm">Company</p>
//                   <p className="text-white font-medium">{clientInfo.company_name || clientInfo.Name}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-400 text-sm">Email</p>
//                   <p className="text-white font-medium">
//                     {clientInfo.email}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-gray-400 text-sm">Phone</p>
//                   <p className="text-white font-medium">{clientInfo.phone}</p>
//                 </div>
//                 <div className="md:col-span-3">
//                   <p className="text-gray-400 text-sm">Delivery Address</p>
//                   <p className="text-white font-medium">
//                     {clientInfo.deliveryAddress}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-gray-400 text-sm">Region</p>
//                   <p className="text-white font-medium">{clientInfo.region || "N/A"}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Role info */}
//           <div className="text-sm text-gray-400 mb-2 mt-4">
//             Logged in as:{" "}
//             <span className="text-blue-400 font-medium capitalize">
//               {userRole}
//             </span>
//             <span className="mx-2">•</span>
//             Discount limit:{" "}
//             <span className="text-green-400 font-medium">
//               {getDiscountLimit()}%
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════
//   // RENDER: Step 2 — Cable Selection (API-Driven)
//   // ═══════════════════════════════════════════
//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-3xl font-bold mb-2">Create Quotation</h1>
//               <p className="text-gray-400">
//                 Step 2: Select Cable Specifications
//               </p>
//             </div>
//             <button
//               onClick={() => setStep(1)}
//               className="px-4 py-2 text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-500 rounded-lg transition-colors"
//             >
//               ← Back to Client Info
//             </button>
//           </div>
//           <div className="flex items-center gap-2 mt-4">
//             <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
//               ✓
//             </div>
//             <span className="text-green-400 font-medium">
//               Client Information
//             </span>
//             <div className="h-px flex-1 bg-gray-700 mx-4"></div>
//             <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//               2
//             </div>
//             <span className="text-blue-400 font-medium">Cable Selection</span>
//           </div>
//         </div>

//         {/* Loading state */}
//         {loading ? (
//           <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
//             <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
//             <p className="text-gray-400">Loading products from database...</p>
//           </div>
//         ) : loadError ? (
//           <div className="bg-gray-800 rounded-xl p-12 border border-red-500/30 text-center">
//             <p className="text-red-400 mb-4">{loadError}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
//             >
//               Retry
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* ── Cable Selection Form ── */}
//             <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//               <h2 className="text-xl font-bold mb-6">Select Cable Details</h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* 1. Category Dropdown */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Select Category *
//                   </label>
//                   <select
//                     value={selectedCategoryId}
//                     onChange={(e) => setSelectedCategoryId(e.target.value)}
//                     className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select a category</option>
//                     {allCategories.map((cat) => (
//                       <option key={cat.id} value={cat.id}>
//                         {cat.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* 2. Product/Cable Dropdown */}
//                 {selectedCategoryId && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Select Cable / Product *
//                     </label>
//                     <select
//                       value={selectedProductId}
//                       onChange={(e) => setSelectedProductId(e.target.value)}
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">Select a product</option>
//                       {filteredProducts.map((prod) => (
//                         <option key={prod.id} value={prod.id}>
//                           {prod.name}
//                           {prod.size ? ` — ${prod.size}` : ""}
//                         </option>
//                       ))}
//                     </select>
//                     {filteredProducts.length === 0 && (
//                       <p className="text-yellow-400 text-xs mt-1">
//                         No products found for this category.
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 {/* 3. Core Type Dropdown (from price matrix) */}
//                 {selectedProductId && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Select Core Type *
//                     </label>
//                     {priceMatrixLoading ? (
//                       <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
//                         Loading core types...
//                       </div>
//                     ) : (
//                       <select
//                         value={selectedCoreTypeId}
//                         onChange={(e) => setSelectedCoreTypeId(e.target.value)}
//                         className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       >
//                         <option value="">Select core type</option>
//                         {availableCoreTypes.map((ct) => (
//                           <option key={ct.id} value={ct.id}>
//                             {ct.name} — Rs. {parseFloat(ct.price).toLocaleString()}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                     {!priceMatrixLoading && availableCoreTypes.length === 0 && priceMatrix.length === 0 && (
//                       <p className="text-yellow-400 text-xs mt-1">
//                         No price matrix found for this product.
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 {/* 4. Color Dropdown */}
//                 {selectedProductId && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Select Color
//                     </label>
//                     <select
//                       value={selectedColor}
//                       onChange={(e) => setSelectedColor(e.target.value)}
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">Select color (optional)</option>
//                       {standardColors.map((color) => (
//                         <option key={color} value={color}>
//                           {color}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 {/* 5. Quantity */}
//                 {selectedCoreTypeId && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Quantity (Coils) *
//                     </label>
//                     <div className="flex items-center">
//                       <input
//                         type="number"
//                         min="1"
//                         value={quantity}
//                         onChange={(e) =>
//                           setQuantity(parseInt(e.target.value) || 1)
//                         }
//                         className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       />
//                       <span className="ml-3 text-gray-400 whitespace-nowrap">
//                         coils
//                         {selectedCoilLength > 0 &&
//                           ` (${selectedCoilLength}m each)`}
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Selected product info badge */}
//               {selectedCoreTypeId && selectedPrice > 0 && (
//                 <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
//                   <p className="text-green-400 font-medium mb-1">
//                     ✓ Product: {getProductName(selectedProductId)} —{" "}
//                     {getCoreTypeName(selectedCoreTypeId)}
//                   </p>
//                   <p className="text-gray-400 text-sm">
//                     Price per coil: Rs. {selectedPrice.toLocaleString()}
//                     {selectedCoilLength > 0 &&
//                       ` | Coil length: ${selectedCoilLength}m`}
//                   </p>
//                 </div>
//               )}

//               {/* ── Discount Section ── */}
//               {selectedCoreTypeId && selectedPrice > 0 && (
//                 <div className="mt-6 border border-gray-600 rounded-lg p-4 bg-gray-700/30">
//                   <h3 className="text-lg font-semibold text-white mb-4">
//                     Discount Options
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {/* Discount Type */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Discount Type
//                       </label>
//                       <select
//                         value={discountType}
//                         onChange={(e) => setDiscountType(e.target.value)}
//                         className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       >
//                         <option value="percentage">Percentage (%)</option>
//                         <option value="none">No Discount</option>
//                       </select>
//                     </div>

//                     {/* Discount Value */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Discount Value ({getDiscountLimit()}% max)
//                       </label>
//                       <div className="relative">
//                         <input
//                           type="number"
//                           min="0"
//                           max={
//                             discountType === "percentage"
//                               ? getDiscountLimit()
//                               : 999999
//                           }
//                           value={discountValue === 0 ? "" : discountValue}
//                           onChange={(e) => {
//                             const val =
//                               e.target.value === ""
//                                 ? 0
//                                 : parseFloat(e.target.value);
//                             if (
//                               discountType === "percentage" &&
//                               val > getDiscountLimit()
//                             ) {
//                               alert(
//                                 `Your role (${userRole}) allows up to ${getDiscountLimit()}% discount.`,
//                               );
//                               return;
//                             }
//                             setDiscountValue(val);
//                           }}
//                           className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           placeholder={`Enter % (Max: ${getDiscountLimit()}%)`}
//                           disabled={discountType === "none"}
//                         />
//                         <span className="absolute right-3 top-3 text-gray-400">
//                           %
//                         </span>
//                       </div>
//                     </div>

//                     {/* Preview */}
//                     <div className="flex items-center">
//                       <div className="bg-gray-800 p-4 rounded-lg w-full">
//                         <p className="text-gray-400 text-sm">
//                           Discount Applied
//                         </p>
//                         <p className="text-xl font-bold text-red-400">
//                           {discountType === "percentage" && discountValue > 0
//                             ? `${discountValue}%`
//                             : "None"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Discount warnings */}
//                   {discountType === "percentage" &&
//                     discountValue > getDiscountLimit() && (
//                       <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
//                         <p className="text-red-400 text-sm">
//                           ⚠️ Discount exceeds your limit! Max:{" "}
//                           {getDiscountLimit()}%
//                         </p>
//                       </div>
//                     )}
//                   {discountType === "percentage" &&
//                     discountValue > 20 &&
//                     discountValue <= getDiscountLimit() && (
//                       <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
//                         <p className="text-yellow-400 text-sm">
//                           ⚠️ High discount ({discountValue}%) applied
//                         </p>
//                       </div>
//                     )}
//                 </div>
//               )}

//               {/* ── Price Calculation ── */}
//               {selectedPrice > 0 && totalBeforeDiscount > 0 && (
//                 <div className="mt-8 p-6 bg-gray-700 rounded-lg border border-gray-600">
//                   <h3 className="text-lg font-semibold text-white mb-4">
//                     Price Calculation
//                   </h3>
//                   <div className="space-y-3 mb-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-400">
//                         Price per coil: Rs. {selectedPrice.toLocaleString()}
//                       </span>
//                       <span className="text-gray-300">
//                         × {quantity} coils
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center pt-3 border-t border-gray-600">
//                       <span className="text-gray-300 font-medium">
//                         Subtotal
//                       </span>
//                       <span className="text-xl font-semibold text-gray-300">
//                         Rs. {totalBeforeDiscount.toLocaleString()}
//                       </span>
//                     </div>

//                     {discountAmount > 0 && discountType !== "none" && (
//                       <>
//                         <div className="flex justify-between items-center">
//                           <span className="text-gray-300">
//                             Discount ({discountValue}%)
//                           </span>
//                           <span className="text-red-400 font-medium">
//                             - Rs. {discountAmount.toLocaleString()}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center pt-3 border-t border-gray-600">
//                           <span className="text-gray-300 font-medium text-lg">
//                             Final Total
//                           </span>
//                           <span className="text-3xl font-bold text-green-400">
//                             Rs. {finalPrice.toLocaleString()}
//                           </span>
//                         </div>
//                         <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
//                           <div className="flex justify-between items-center">
//                             <span className="text-green-400">You save</span>
//                             <span className="text-green-400 font-bold">
//                               Rs. {discountAmount.toLocaleString()}
//                             </span>
//                           </div>
//                         </div>
//                       </>
//                     )}

//                     {(discountAmount === 0 || discountType === "none") && (
//                       <div className="flex justify-between items-center pt-3 border-t border-gray-600">
//                         <span className="text-gray-300 font-medium text-lg">
//                           Total Amount
//                         </span>
//                         <span className="text-3xl font-bold text-green-400">
//                           Rs. {totalBeforeDiscount.toLocaleString()}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Action buttons */}
//               <div className="mt-8 flex justify-end gap-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setSelectedCategoryId("");
//                     setSelectedProductId("");
//                     setSelectedCoreTypeId("");
//                     setSelectedColor("");
//                     setPriceMatrix([]);
//                     setSelectedPrice(0);
//                     setSelectedCoilLength(0);
//                     setQuantity(1);
//                     setDiscountType("percentage");
//                     setDiscountValue(0);
//                   }}
//                   className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleAddToQuotation}
//                   disabled={!selectedProductId || !selectedCoreTypeId || selectedPrice <= 0}
//                   className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
//                     !selectedProductId || !selectedCoreTypeId || selectedPrice <= 0
//                       ? "bg-gray-600 text-gray-400 cursor-not-allowed"
//                       : "bg-blue-600 hover:bg-blue-700 text-white"
//                   }`}
//                 >
//                   <span>+</span> Add to Quotation
//                 </button>
//               </div>
//             </div>

//             {/* ── Added Items List ── */}
//             {quotationItems.length > 0 && (
//               <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
//                 <h3 className="text-lg font-semibold text-white mb-4">
//                   Quotation Items ({quotationItems.length})
//                 </h3>
//                 <div className="space-y-4">
//                   {quotationItems.map((item, index) => (
//                     <div
//                       key={item.id}
//                       className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 flex items-center justify-between"
//                     >
//                       <div className="flex-1">
//                         <p className="text-white font-medium">
//                           {index + 1}. {item.productName}
//                         </p>
//                         <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
//                           <span>Category: {item.categoryName}</span>
//                           <span>Core: {item.coreTypeName}</span>
//                           {item.color && <span>Color: {item.color}</span>}
//                           <span>Qty: {item.quantity} coils</span>
//                           {item.coilLength > 0 && (
//                             <span>({item.coilLength}m/coil)</span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="text-right ml-4">
//                         <p className="text-green-400 font-bold text-lg">
//                           Rs. {item.finalPrice.toLocaleString()}
//                         </p>
//                         {item.discountAmount > 0 && (
//                           <p className="text-red-400 text-sm">
//                             -{item.discountValue}% off
//                           </p>
//                         )}
//                       </div>
//                       <button
//                         onClick={() => handleRemoveItem(item.id)}
//                         className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
//                         title="Remove item"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Grand Total */}
//                 <div className="mt-6 pt-4 border-t border-gray-600 flex justify-between items-center">
//                   <span className="text-xl font-semibold text-white">
//                     Grand Total
//                   </span>
//                   <span className="text-3xl font-bold text-green-400">
//                     Rs. {grandTotal.toLocaleString()}
//                   </span>
//                 </div>

//                 {/* Submit */}
//                 <div className="mt-6 flex justify-end">
//                   <button
//                     type="button"
//                     onClick={handleSubmit}
//                     disabled={isSubmitting}
//                     className={`px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-lg flex items-center gap-2 ${
//                       isSubmitting ? "opacity-70 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <svg
//                           className="animate-spin h-5 w-5 text-white"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           ></path>
//                         </svg>
//                         Submitting...
//                       </>
//                     ) : (
//                       "Submit Quotation"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* ── Current Selection Summary ── */}
//             <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
//               <h3 className="text-lg font-semibold text-white mb-4">
//                 Current Selection
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <p className="text-gray-400">Category:</p>
//                   <p className="text-white font-medium">
//                     {selectedCategoryId
//                       ? getCategoryName(selectedCategoryId)
//                       : "Not selected"}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-gray-400">Product:</p>
//                   <p className="text-white font-medium">
//                     {selectedProductId
//                       ? getProductName(selectedProductId)
//                       : "Not selected"}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-gray-400">Core Type:</p>
//                   <p className="text-white font-medium">
//                     {selectedCoreTypeId
//                       ? getCoreTypeName(selectedCoreTypeId)
//                       : "Not selected"}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-gray-400">Color:</p>
//                   <p className="text-white font-medium">
//                     {selectedColor || "Not selected"}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-gray-400">Unit Price:</p>
//                   <p className="text-white font-medium">
//                     {selectedPrice > 0
//                       ? `Rs. ${selectedPrice.toLocaleString()}`
//                       : "—"}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-gray-400">Final Price:</p>
//                   <p className="text-white font-medium">
//                     {finalPrice > 0
//                       ? `Rs. ${finalPrice.toLocaleString()}`
//                       : "—"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreateQuotation;

import { FiAlertCircle, FiSave, FiPlus, FiTrash2, FiEdit, FiCheckCircle, FiXCircle, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getProducts,
  getCategories,
  getCoreTypes,
  getCatalogCategories,
  getCatalogCoreTypes,
  getClients,
  createClient,
  submitQuotation,
  updateQuotation,
  resubmitQuotation,
} from "../api/api";

// Standard wire colors
const standardColors = [
  "Black",
  "Red",
  "Blue",
  "Yellow",
  "Green",
  "White",
  "Grey",
  "Yellow/Green",
  "Brown",
];

const discountLimits = {
  "super-admin": 38,
  admin: 38,
  manager: 35,
  salesperson: 30,
};

const CreateQuotation = ({ userRole = "salesperson" }) => {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingQuotationId, setEditingQuotationId] = useState(null);
  const [isResubmit, setIsResubmit] = useState(false);
  const [resubmissionComment, setResubmissionComment] = useState("");
  const [rejectionDetails, setRejectionDetails] = useState(null);
  const hasPrefilled = React.useRef(null);
  const isEditingRef = React.useRef(false);

  // Client info
  const [clientInfo, setClientInfo] = useState({
    Name: "",
    client_id: "",
    quotation_date: new Date().toISOString().split("T")[0],
    company_name: "",
    email: "",
    phone: "",
    client_address: "",
    region: "",
    valid_until: "",
  });

  // DB data loaded on mount
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allCoreTypes, setAllCoreTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Step 2 selections
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedCoreTypeId, setSelectedCoreTypeId] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Derived / filtered lists
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceMatrix, setPriceMatrix] = useState([]);
  const [priceMatrixLoading, setPriceMatrixLoading] = useState(false);

  // Pricing
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedCoilLength, setSelectedCoilLength] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState(0);

  // Multi-product list
  const [quotationItems, setQuotationItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  // Client Management States
  const [allClients, setAllClients] = useState([]);
  const [clientMode, setClientMode] = useState("select"); // 'select' or 'create'
  const [isCreatingClient, setIsCreatingClient] = useState(false);

  // Error state for submission
  const [submissionErrors, setSubmissionErrors] = useState(null);

  const getDiscountLimit = () => discountLimits[userRole] || 30;

  // ── Fetch all data on mount ──
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const isSalesOrManager = userRole === "salesperson" || userRole === "manager";
        
        console.log("Starting data fetch...");
        
        const [prodRes, catRes, coreRes, clientRes] = await Promise.all([
          getProducts().catch(err => { console.error("Products Fetch Error:", err); throw err; }),
          (isSalesOrManager ? getCatalogCategories() : getCategories()).catch(err => { console.error("Categories Fetch Error:", err); throw err; }),
          (isSalesOrManager ? getCatalogCoreTypes() : getCoreTypes()).catch(err => { console.error("CoreTypes Fetch Error:", err); throw err; }),
          getClients().catch(err => { console.error("Clients Fetch Error:", err); throw err; }),
        ]);

        console.log("All API calls completed successfully.");

        const products = prodRes.data?.data || prodRes.data?.products || (Array.isArray(prodRes.data) ? prodRes.data : []);
        setAllProducts(products);

        const cats = catRes.data?.data || catRes.data?.categories || (Array.isArray(catRes.data) ? catRes.data : []);
        setAllCategories(cats);

        const cores = coreRes.data?.data || coreRes.data?.core_types || (Array.isArray(coreRes.data) ? coreRes.data : []);
        setAllCoreTypes(cores);

        const clientsArray = clientRes.data?.data || clientRes.data?.clients || (Array.isArray(clientRes.data) ? clientRes.data : []);
        console.log("Fetched Clients Raw:", clientRes.data);
        console.log("Processed Clients:", clientsArray);
        
        // Ensure we have an array and each object has a name fallback
        const sanitizedClients = (Array.isArray(clientsArray) ? clientsArray : []).map(c => ({
          ...c,
          id: c.id || c.client_id,
          name: c.name || c.client_name || c.company_name || "Unnamed Client",
          region: c.region || ""
        }));
        
        setAllClients(sanitizedClients);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadError(
          "Failed to load data from server. " + (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userRole]);

  // ── Handle Edit Mode Pre-filling ──
  useEffect(() => {
    if (location.state?.editQuotation) {
      const editQuote = location.state.editQuotation;
      
      // Wait for master data to load before pre-filling items
      // This ensures core types can be resolved correctly
      if (loading || allCoreTypes.length === 0) {
        return;
      }

      // Guard: Only pre-fill once for THIS quotation ID
      if (hasPrefilled.current === editQuote.id) {
        return;
      }
      
      console.log("========== ENTERING EDIT MODE ==========");
      console.log("Quotation Data:", editQuote);
      
      setIsEditMode(true);
      setEditingQuotationId(editQuote.id);

      // Helper to format date strings to yyyy-MM-dd
      const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return dateStr.split('T')[0]; // Extract yyyy-MM-dd from ISO or similar
      };

      // Pre-fill client info with broad fallbacks
      const client_id = editQuote.client_id || editQuote.client?.id || "";
      const Name = editQuote.client_name || editQuote.client?.name || editQuote.customer || editQuote.customer_name || editQuote.name || "";
      const company_name = editQuote.company_name || editQuote.client?.company_name || "";
      const email = editQuote.email || editQuote.client?.email || editQuote.customer_email || editQuote.client_email || "";
      const phone = editQuote.phone || editQuote.client?.phone || editQuote.customer_phone || editQuote.client_phone || "";
      const client_address = editQuote.client_address || editQuote.client?.address || editQuote.customer_address || editQuote.address || "";
      const region = editQuote.region || editQuote.client?.region || "";
      const quotation_date = formatDate(editQuote.quotation_date || editQuote.created_at) || new Date().toISOString().split("T")[0];
      const valid_until = formatDate(editQuote.valid_until) || "";

      setClientInfo({
        client_id,
        Name,
        company_name,
        email,
        phone,
        client_address,
        region,
        quotation_date,
        valid_until,
      });

      // Set client mode
      if (client_id) {
        setClientMode("select");
      } else {
        setClientMode("create");
      }

      // Pre-fill items if they exist
      if (editQuote.items && Array.isArray(editQuote.items)) {
        console.log("Mapping items:", editQuote.items);
        const mappedItems = editQuote.items.map(item => {
          // Resolve coreTypeId - prioritize explicit ID, then try to find ID from name in allCoreTypes
          let coreId = item.core_type_id || item.core_type;
          let coreName = item.core_type_name || (typeof item.core_type === 'string' ? item.core_type : "");
          
          if (typeof coreId === 'string' && isNaN(coreId)) {
            const foundCoreType = allCoreTypes.find(ct => 
              ct.name?.toLowerCase() === coreId.toLowerCase() || 
              ct.display_name?.toLowerCase() === coreId.toLowerCase()
            );
            if (foundCoreType) {
              coreId = foundCoreType.id;
              coreName = foundCoreType.name || foundCoreType.display_name;
            }
          } else if (coreId && allCoreTypes.length > 0) {
            const foundCoreType = allCoreTypes.find(ct => String(ct.id) === String(coreId));
            if (foundCoreType) {
              coreName = foundCoreType.name || foundCoreType.display_name;
            }
          }

          const unitPrice = parseFloat(item.base_price || item.unit_price || item.price || 0);
          const qty = parseInt(item.quantity) || 0;
          const totalBefore = unitPrice * qty;
          const discVal = parseFloat(item.discount_value || item.discount || 0);
          const discType = item.discount_type || "percentage";
          
          let discAmt = 0;
          if (discType === 'percentage') {
            discAmt = (totalBefore * discVal) / 100;
          } else if (discType === 'fixed' || discType === 'amount') {
            discAmt = discVal;
          }

          return {
            id: item.id || Date.now() + Math.random(),
            productId: item.product_id || item.productId || item.product?.id,
            coreTypeId: coreId,
            productName: item.product?.name || item.product_name || item.name || `Product #${item.product_id}`,
            categoryName: item.product?.category?.name || item.category_name || "N/A",
            coreTypeName: coreName || (typeof item.core_type === 'string' ? item.core_type : `Core #${item.core_type}`),
            color: item.color || "",
            quantity: qty,
            coilLength: item.coil_length || item.coilLength || 0,
            unitPrice: unitPrice,
            totalBeforeDiscount: totalBefore,
            discountType: discType,
            discountValue: discVal,
            discountAmount: discAmt,
            finalPrice: parseFloat(item.final_price || item.finalPrice) || (totalBefore - discAmt),
          };
        });
        console.log("Mapped items:", mappedItems);
        setQuotationItems(mappedItems);
      }
      
      // Mark as pre-filled for this ID
      hasPrefilled.current = editQuote.id;

      // Handle Resubmit Specifics
      if (location.state.isResubmit) {
        setIsResubmit(true);
        setRejectionDetails({
          reason: editQuote.rejection_reason || "No reason provided",
          history: editQuote.rejection_history || []
        });
      } else {
        setIsResubmit(false);
        setRejectionDetails(null);
      }
    } else {
      setIsEditMode(false);
      setIsResubmit(false);
      setEditingQuotationId(null);
      setRejectionDetails(null);
      hasPrefilled.current = null;
    }
  }, [location.state, allCategories, allProducts, allCoreTypes, allClients, loading]);

  // ── When category changes → filter products ──
  useEffect(() => {
    if (!selectedCategoryId) {
      setFilteredProducts([]);
      setSelectedProductId("");
      setPriceMatrix([]);
      setSelectedCoreTypeId("");
      setSelectedPrice(0);
      return;
    }

    const filtered = allProducts.filter(
      (p) => String(p.category_id) === String(selectedCategoryId),
    );
    setFilteredProducts(filtered);

    // Skip resetting downstream when editing an existing item
    if (isEditingRef.current) return;

    // Reset downstream
    setSelectedProductId("");
    setPriceMatrix([]);
    setSelectedCoreTypeId("");
    setSelectedPrice(0);
    setSelectedCoilLength(0);
  }, [selectedCategoryId, allProducts]);

  // ── When product changes → read price matrix from product data ──
  useEffect(() => {
    if (!selectedProductId) {
      setPriceMatrix([]);
      setSelectedCoreTypeId("");
      setSelectedPrice(0);
      setSelectedCoilLength(0);
      return;
    }

    // Skip resetting downstream when editing an existing item
    if (isEditingRef.current) return;

    // Read price_matrix directly from the product object
    const product = allProducts.find(
      (p) => String(p.id) === String(selectedProductId),
    );
    const matrix = product?.price_matrix;

    if (Array.isArray(matrix) && matrix.length > 0) {
      setPriceMatrix(matrix);
      // Reset downstream
      setSelectedCoreTypeId("");
      setSelectedPrice(0);
      setSelectedCoilLength(0);
    } else {
      setPriceMatrix([]);
      // If no matrix, use product's base price
      const basePrice = parseFloat(product?.base_price || product?.unit_price || product?.price || 0);
      setSelectedPrice(basePrice);
      setSelectedCoilLength(0);
      setSelectedCoreTypeId("none"); // Marker for products without core types
    }
    setPriceMatrixLoading(false);
  }, [selectedProductId]);

  // ── When core type changes → set price from matrix ──
  useEffect(() => {
    if (!selectedCoreTypeId || selectedCoreTypeId === "none" || priceMatrix.length === 0) {
      // If "none", price is already set in selection effect
      if (selectedCoreTypeId !== "none") {
        setSelectedPrice(0);
        setSelectedCoilLength(0);
      }
      return;
    }

    const entry = priceMatrix.find(
      (p) => String(p.core_type_id) === String(selectedCoreTypeId),
    );
    if (entry) {
      setSelectedPrice(parseFloat(entry.price) || 0);
      setSelectedCoilLength(parseFloat(entry.coil_length) || 0);
    } else {
      setSelectedPrice(0);
      setSelectedCoilLength(0);
    }
  }, [selectedCoreTypeId, priceMatrix]);

  // ── Price calculations ──
  const totalBeforeDiscount = selectedPrice * quantity;
  let discountAmount = 0;
  if (discountValue > 0 && discountType === "percentage") {
    const effectiveDiscount = Math.min(discountValue, getDiscountLimit());
    discountAmount = (totalBeforeDiscount * effectiveDiscount) / 100;
  } else if (discountValue > 0 && discountType === "fixed") {
    discountAmount = discountValue;
  }
  const finalPrice = totalBeforeDiscount - discountAmount;
  const grandTotal = quotationItems.reduce((s, i) => s + i.finalPrice, 0);

  // ── Helpers ──
  const getCategoryName = (id) =>
    allCategories.find((c) => String(c.id) === String(id))?.name || id;

  const getProductName = (id) =>
    allProducts.find((p) => String(p.id) === String(id))?.name || id;

  const getCoreTypeName = (id) =>
    allCoreTypes.find((c) => String(c.id) === String(id))?.name ||
    allCoreTypes.find((c) => String(c.id) === String(id))?.display_name ||
    id;

  const getCoreTypeCode = (id) =>
    allCoreTypes.find((c) => String(c.id) === String(id))?.code || id;

  const normalizeCoreType = (str) => {
    if (!str) return "";
    let s = str.toString().toLowerCase().trim();
    
    if (s.includes("single")) return "single_core";
    
    const match = s.match(/(\d+)/);
    if (match) {
      return `${match[1]}_core`;
    }

    return s
      .replace(/\s+/g, "_")
      .replace(/-+/g, "_")
      .replace(/[^\w]/g, "");
  };

  // Available core types = those present in the price matrix
  const availableCoreTypes = priceMatrix
    .map((pm) => {
      const ct = allCoreTypes.find(
        (c) => String(c.id) === String(pm.core_type_id),
      );
      return ct
        ? { id: ct.id, name: ct.name || ct.display_name, price: pm.price }
        : { id: pm.core_type_id, name: `${pm.core_type_id} Core`, price: pm.price };
    })
    .filter((ct) => ct.price > 0); // Only show core types with a price

  const handleClientInfoChange = (field, value) => {
    setClientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const validateClientInfo = () => {
    let required = [];
    if (clientMode === "select") {
      required = ["client_id", "quotation_date"];
    } else {
      required = [
        "Name",
        "company_name",
        "email",
        "phone",
        "client_address",
        "region",
        "quotation_date",
      ];
    }
    
    const missing = required.filter((f) => !String(clientInfo[f] || "").trim());
    if (missing.length > 0) {
      console.log("Validation failed. Missing fields:", missing);
    }
    
    return missing.length === 0;
  };

  const handleAddToQuotation = () => {
    const hasCoreTypes = availableCoreTypes.length > 0;
    
    if (!selectedProductId || (hasCoreTypes && !selectedCoreTypeId) || selectedPrice <= 0) {
      alert("Please select a product " + (hasCoreTypes ? "and core type " : "") + "to add to quotation.");
      return;
    }

    const item = {
      id: editingItemId || Date.now(),
      productId: selectedProductId,
      coreTypeId: selectedCoreTypeId,
      productName: getProductName(selectedProductId),
      categoryName: getCategoryName(selectedCategoryId),
      coreTypeName: selectedCoreTypeId === "none" ? "N/A" : getCoreTypeName(selectedCoreTypeId),
      coreTypeCode: selectedCoreTypeId === "none" ? null : getCoreTypeCode(selectedCoreTypeId),
      color: selectedColor,
      quantity,
      coilLength: selectedCoilLength,
      unitPrice: selectedPrice,
      totalBeforeDiscount,
      discountType,
      discountValue,
      discountAmount,
      finalPrice,
    };

    if (editingItemId) {
      // Update existing item in place
      setQuotationItems((prev) =>
        prev.map((existing) => (existing.id === editingItemId ? item : existing))
      );
      setEditingItemId(null);
    } else {
      // Add new item
      setQuotationItems((prev) => [...prev, item]);
    }

    // Reset form for next product
    setSelectedProductId("");
    setSelectedCoreTypeId("");
    setSelectedColor("");
    setPriceMatrix([]);
    setSelectedPrice(0);
    setSelectedCoilLength(0);
    setQuantity(1);
    setDiscountType("percentage");
    setDiscountValue(0);
  };

  const handleEditItem = (item) => {
    // Set the editing flag to prevent useEffect cascading resets
    isEditingRef.current = true;
    setEditingItemId(item.id);

    // Find the category for this product
    const product = allProducts.find((p) => String(p.id) === String(item.productId));
    if (product) {
      setSelectedCategoryId(String(product.category_id));
      // Filter products for this category
      const filtered = allProducts.filter(
        (p) => String(p.category_id) === String(product.category_id)
      );
      setFilteredProducts(filtered);
    }

    setSelectedProductId(String(item.productId));

    // Set price matrix from product
    if (product?.price_matrix && Array.isArray(product.price_matrix) && product.price_matrix.length > 0) {
      setPriceMatrix(product.price_matrix);
    }

    setSelectedCoreTypeId(String(item.coreTypeId || ""));
    setSelectedColor(item.color || "");
    setQuantity(item.quantity || 1);
    setSelectedPrice(item.unitPrice || 0);
    setSelectedCoilLength(item.coilLength || 0);
    setDiscountType(item.discountType || "percentage");
    setDiscountValue(item.discountValue || 0);

    // Clear the editing flag after React processes the state updates
    setTimeout(() => {
      isEditingRef.current = false;
    }, 0);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setSelectedProductId("");
    setSelectedCategoryId("");
    setSelectedCoreTypeId("");
    setSelectedColor("");
    setPriceMatrix([]);
    setSelectedPrice(0);
    setSelectedCoilLength(0);
    setQuantity(1);
    setDiscountType("percentage");
    setDiscountValue(0);
  };

  const handleRemoveItem = (id) => {
    setQuotationItems((prev) => prev.filter((item) => item.id !== id));
    if (editingItemId === id) {
      handleCancelEdit();
    }
  };

  // Enhanced validation function
  const validatePayload = (payload) => {
    const errors = [];

    // Check client_id
    if (!payload.client_id) {
      errors.push("client_id is required");
    }

    // Check quotation_date
    if (!payload.quotation_date) {
      errors.push("quotation_date is required");
    }

    // Check items array
    if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
      errors.push("At least one item is required");
    } else {
      // Validate each item
      payload.items.forEach((item, index) => {
        if (!item.product_id) {
          errors.push(`Item ${index + 1}: product_id is required`);
        }
        
        // Check if this product actually requires a core type
        const product = allProducts.find(p => String(p.id) === String(item.product_id));
        const requiresCoreType = product?.price_matrix && Array.isArray(product.price_matrix) && product.price_matrix.length > 0;
        
        if (requiresCoreType && !item.core_type && !item.core_type_id) {
          errors.push(`Item ${index + 1}: core_type is required for this product`);
        }
        
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`Item ${index + 1}: quantity must be greater than 0`);
        }
        if (!item.base_price || item.base_price <= 0) {
          errors.push(`Item ${index + 1}: base_price must be greater than 0`);
        }
        if (item.final_price === undefined || item.final_price === null) {
          errors.push(`Item ${index + 1}: final_price is required`);
        }
      });
    }

    return errors;
  };

  const handleSubmit = async () => {
    console.log("========== SUBMIT BUTTON CLICKED ==========");
    console.log("Current items:", quotationItems);
    console.log("Client Info:", clientInfo);
    
    // Clear previous errors
    setSubmissionErrors(null);

    if (quotationItems.length === 0) {
      console.log("Validation failed: No items");
      alert("Please add at least one item to the quotation.");
      return;
    }

    const invalidItems = quotationItems.filter(item => {
      // Check if product originally had core types but none selected
      const product = allProducts.find(p => String(p.id) === String(item.productId));
      const hasCoreTypes = product?.price_matrix && Array.isArray(product.price_matrix) && product.price_matrix.length > 0;
      return hasCoreTypes && !item.coreTypeId;
    });

    if (invalidItems.length > 0) {
      console.error("Some items are missing coreTypeId:", invalidItems);
      alert("Error: Some items in your quotation are missing required data (Core Type). Please remove and add them again.");
      setIsSubmitting(false);
      return;
    }

    if (isResubmit && !resubmissionComment.trim()) {
      alert("Please provide a resubmission response explaining your changes.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    console.log("isSubmitting set to true");

    try {
      console.log("========== PREPARING PAYLOAD ==========");
      console.log("All Core Types Reference:", allCoreTypes);
      
      const payload = {
        client_id: clientInfo.client_id ? parseInt(clientInfo.client_id) : null,
        quotation_date: clientInfo.quotation_date,
        valid_until: clientInfo.valid_until || null,
        company_name: clientInfo.company_name || null,
        client_name: clientInfo.Name || null,
        email: clientInfo.email || null,
        phone: clientInfo.phone || null,
        client_address: clientInfo.client_address || null,
        region: clientInfo.region || null,
        total_amount: grandTotal,
        status: "pending",
        items: quotationItems.map((item) => ({
          product_id: parseInt(item.productId),
          core_type: (item.coreTypeId === "none" || !item.coreTypeId) ? null : normalizeCoreType(item.coreTypeName),
          core_type_id: (item.coreTypeId === "none" || !item.coreTypeId) ? null : (parseInt(item.coreTypeId) || null),
          color: item.color || null,
          quantity: parseInt(item.quantity),
          base_price: parseFloat(item.unitPrice),
          discount_type: item.discountType || null,
          discount_value: parseFloat(item.discountValue) || 0,
          final_price: parseFloat(item.finalPrice),
          coil_length: parseFloat(item.coilLength) || null,
        })),
        resubmit_reason: isResubmit ? resubmissionComment : null,
      };
      
      // Remove null values to avoid sending null where backend expects something else
      Object.keys(payload).forEach(key => {
        if (payload[key] === null) {
          delete payload[key];
        }
      });

      // Remove discount fields if discount_type is 'none'
      payload.items = payload.items.map(item => {
        if (item.discount_type === 'none' || !item.discount_type) {
          delete item.discount_type;
          delete item.discount_value;
        }
        return item;
      });

      console.log("========== PAYLOAD VALIDATION ==========");
      console.log("Full Payload Structure:", JSON.stringify(payload, null, 2));
      
      // Validate payload before sending
      const validationErrors = validatePayload(payload);
      if (validationErrors.length > 0) {
        console.error("========== VALIDATION ERRORS ==========");
        validationErrors.forEach(error => console.error("❌", error));
        setSubmissionErrors({ validation: validationErrors });
        alert("Validation failed. Check console for details.");
        setIsSubmitting(false);
        return;
      }

      console.log("✅ Payload validation passed");
      console.log("Items verification:", payload.items.map(i => ({ 
        pid: i.product_id, 
        ct_name: i.core_type,
        ct_id: i.core_type_id,
        qty: i.quantity,
        price: i.unit_price 
      })));
      
      console.log("========== SENDING REQUEST ==========");
      console.log("Calling " + (isResubmit ? "resubmitQuotation" : (isEditMode ? "updateQuotation" : "submitQuotation")) + " API...");
      
      const res = isResubmit
        ? await resubmitQuotation(editingQuotationId, payload)
        : (isEditMode 
          ? await updateQuotation(editingQuotationId, payload)
          : await submitQuotation(payload));
      
      console.log("========== RESPONSE RECEIVED ==========");
      console.log("Response Status:", res.status);
      console.log("Response Status Text:", res.statusText);
      console.log("Response Headers:", res.headers);
      console.log("Response Data:", res.data);

      if (res.data?.success || res.status === 201 || res.status === 200) {
        console.log("✅ " + (isResubmit ? "Resubmission" : (isEditMode ? "Update" : "Submission")) + " successful!");
        const successMessage = isResubmit 
          ? "Quotation has been resubmitted and is now pending review!" 
          : `Quotation ${isEditMode ? "updated" : "submitted"} successfully and is now pending review!`;
        alert(successMessage);
        // Reset form or navigate back
        if (isEditMode) {
          window.history.back();
        } else {
          setQuotationItems([]);
          setStep(1);
          setClientInfo({
            Name: "",
            client_id: "",
            quotation_date: new Date().toISOString().split("T")[0],
            company_name: "",
            email: "",
            phone: "",
            client_address: "",
            region: "",
            valid_until: "",
          });
        }
      } else {
        throw new Error(res.data?.message || "Submission failed");
      }
    } catch (error) {
      console.error("========== ERROR SUBMITTING QUOTATION ==========");
      console.error("Error Object:", error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("❌ Server responded with error:");
        console.error("Status:", error.response.status);
        console.error("Status Text:", error.response.statusText);
        console.error("Response Data:", error.response.data);
        console.error("Response Headers:", error.response.headers);
        
        // Try to extract validation errors
        const errorData = error.response.data;
        const errorMessage = errorData?.message || errorData?.error || JSON.stringify(errorData);
        
        // Store errors for display
        setSubmissionErrors({
          status: error.response.status,
          data: errorData,
          message: errorMessage
        });
        
        // If it's a 422, likely validation errors
        if (error.response.status === 422) {
          console.error("❌ VALIDATION ERRORS (422):");
          if (errorData.errors) {
            // Laravel style validation errors
            Object.keys(errorData.errors).forEach(field => {
              console.error(`Field "${field}":`, errorData.errors[field]);
            });
            alert(`Validation failed: ${Object.values(errorData.errors).flat().join('\n')}`);
          } else {
            alert(`Validation failed: ${errorMessage}`);
          }
        } else {
          alert(`Server error (${error.response.status}): ${errorMessage}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("❌ No response received from server");
        console.error("Request:", error.request);
        alert("No response from server. Please check your network connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("❌ Request setup error:", error.message);
        alert(`Request failed: ${error.message}`);
      }
      
      // Log the complete error stack
      console.error("Error Stack:", error.stack);
    } finally {
      setIsSubmitting(false);
      console.log("========== SUBMIT PROCESS COMPLETE ==========");
    }
  };

  // ── LOADING / ERROR STATES ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl font-medium">Loading Quotation Data...</p>
          <p className="text-gray-400 mt-2">Fetching products and clients...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white p-4">
        <div className="max-w-md w-full bg-gray-800 border-l-4 border-red-500 p-6 rounded-lg shadow-2xl">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold">Data Loading Error</h2>
          </div>
          <p className="text-gray-300 mb-6">{loadError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // ... rest of your JSX remains exactly the same ...

  // ═══════════════════════════════════════════
  // RENDER: Step 1 — Client Information
  // ═══════════════════════════════════════════
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{isEditMode ? "Edit Quotation" : "Create Quotation"}</h1>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Client Details</h2>
              <div className="flex bg-gray-700 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setClientMode("select")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    clientMode === "select"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Return Client
                </button>
                <button
                  type="button"
                  onClick={() => setClientMode("create")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    clientMode === "create"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  New Client
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clientMode === "select" ? (
                <>
                  {/* Select Client Dropdown */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="client_select"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Select Existing Client *
                    </label>
                    <select
                      id="client_select"
                      value={clientInfo.client_id}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const client = allClients.find(
                          (c) => String(c.id) === String(selectedId)
                        );
                        if (client) {
                          setClientInfo({
                            ...clientInfo,
                            client_id: client.id,
                            Name: client.name || client.client_name || "",
                            company_name: client.company_name || "",
                            email: client.email || "",
                            phone: client.phone || "",
                            client_address: client.client_address || client.address || "",
                            region: client.region || "",
                          });
                        } else {
                          setClientInfo({
                            ...clientInfo,
                            client_id: "",
                            Name: "",
                            company_name: "",
                            email: "",
                            phone: "",
                            client_address: "",
                            region: "",
                          });
                        }
                      }}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- Choose a client --</option>
                      {allClients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.company_name || c.name || c.client_name} (
                          {c.email || "No Email"})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  {/* Name (Contact Person) */}
                  <div>
                    <label
                      htmlFor="Name"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Contact Name *
                    </label>
                    <input
                      id="Name"
                      type="text"
                      value={clientInfo.Name}
                      onChange={(e) =>
                        handleClientInfoChange("Name", e.target.value)
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter contact name"
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label
                      htmlFor="company_name"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Company Name *
                    </label>
                    <input
                      id="company_name"
                      type="text"
                      value={clientInfo.company_name}
                      onChange={(e) =>
                        handleClientInfoChange("company_name", e.target.value)
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter company name"
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
                  <div>
                    <label
                      htmlFor="client_address"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Client Address *
                    </label>
                    <input
                      id="client_address"
                      type="text"
                      value={clientInfo.client_address}
                      onChange={(e) =>
                        handleClientInfoChange("client_address", e.target.value)
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Street address, Building, Area"
                    />
                  </div>

                  {/* Region */}
                  <div>
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Region *
                    </label>
                    <input
                      id="region"
                      type="text"
                      value={clientInfo.region}
                      onChange={(e) =>
                        handleClientInfoChange("region", e.target.value)
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Asia, Europe, Karachi, etc."
                    />
                  </div>
                </>
              )}

              {/* Quotation Date */}
              <div>
                <label
                  htmlFor="quotation_date"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Quotation Date *
                </label>
                <input
                  id="quotation_date"
                  type="date"
                  value={clientInfo.quotation_date}
                  onChange={(e) =>
                    handleClientInfoChange("quotation_date", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Valid Until Date */}
              <div>
                <label
                  htmlFor="valid_until"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Valid Until
                </label>
                <input
                  id="valid_until"
                  type="date"
                  value={clientInfo.valid_until}
                  onChange={(e) =>
                    handleClientInfoChange("valid_until", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!validateClientInfo()) {
                    alert("Please fill all required fields (marked with *)");
                    return;
                  }

                  if (clientMode === "create") {
                    setIsCreatingClient(true);
                    try {
                      const clientPayload = {
                        name: clientInfo.Name,
                        company_name: clientInfo.company_name,
                        email: clientInfo.email,
                        phone: clientInfo.phone,
                        address: clientInfo.client_address,
                        region: clientInfo.region,
                      };
                      const res = await createClient(clientPayload);
                      console.log("Client Creation Success:", res.data);
                      
                      // Flexible ID extraction
                      const newClientId = 
                        res.data?.id || 
                        res.data?.data?.id || 
                        res.data?.client?.id || 
                        res.data?.data?.client?.id;

                      if (!newClientId) {
                        console.error("ID not found in response:", res.data);
                        throw new Error("Client created but failed to retrieve unique ID from server response.");
                      }
                      
                      setClientInfo((prev) => ({ ...prev, client_id: newClientId }));
                      
                      // Refresh clients list
                      const updatedClientsRes = await getClients();
                      const updatedList = updatedClientsRes.data?.data || 
                                         (Array.isArray(updatedClientsRes.data) ? updatedClientsRes.data : []);
                      setAllClients(updatedList.map(c => ({ ...c, region: c.region || "" })));
                    } catch (error) {
                      console.error("Error creating client:", error);
                      alert("Failed to create client: " + (error.response?.data?.message || error.message));
                      return;
                    } finally {
                      setIsCreatingClient(false);
                    }
                  }
                  
                  setStep(2);
                }}
                disabled={isCreatingClient}
                className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  isCreatingClient ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isCreatingClient ? "Registering Client..." : (
                  <>Next: Select Cables <span>→</span></>
                )}
              </button>
            </div>
          </div>

          {/* Client Summary */}
          {clientInfo.Name && (
            <div className="mt-6 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">
                Client Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Company</p>
                  <p className="text-white font-medium">{clientInfo.company_name || clientInfo.Name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">
                    {clientInfo.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white font-medium">{clientInfo.phone}</p>
                </div>
                <div className="md:col-span-3">
                  <p className="text-gray-400 text-sm">Delivery Address</p>
                  <p className="text-white font-medium">
                    {clientInfo.client_address || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Region</p>
                  <p className="text-white font-medium">{clientInfo.region || "N/A"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Role info */}
          <div className="text-sm text-gray-400 mb-2 mt-4">
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

  // ═══════════════════════════════════════════
  // RENDER: Step 2 — Cable Selection (API-Driven)
  // ═══════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{isEditMode ? "Edit Quotation" : "Create Quotation"}</h1>
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
        
        {/* Rejection Details Block */}
        {isResubmit && rejectionDetails && (
          <div className="mb-8 space-y-4">
            <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4 text-red-400">
                <FiAlertCircle className="text-2xl" />
                <h2 className="text-xl font-bold">Quotation Rejected</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Latest Rejection Reason</p>
                  <p className="text-white text-lg mt-1 italic">"{rejectionDetails.reason}"</p>
                </div>

                {rejectionDetails.history.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-red-500/20">
                    <p className="text-gray-400 text-sm mb-3">Rejection History</p>
                    <div className="space-y-3">
                      {rejectionDetails.history.map((hist, idx) => (
                        <div key={idx} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>{hist.rejected_by_name || 'Manager'}</span>
                            <span>{new Date(hist.rejected_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-200">{hist.rejection_reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Salesperson Response Block */}
            <div className="bg-blue-900/20 border border-blue-500/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4 text-blue-400">
                <FiSave className="text-2xl" />
                <h2 className="text-xl font-bold">Resubmission Response</h2>
              </div>
              <p className="text-gray-400 text-sm mb-3">Please explain the changes you've made to address the rejection reasons above.</p>
              <textarea
                value={resubmissionComment}
                onChange={(e) => setResubmissionComment(e.target.value)}
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                placeholder="Describe your changes here (e.g., 'Reduced discount to 5% as requested')..."
                required={isResubmit}
              />
              {isResubmit && !resubmissionComment && (
                <p className="text-red-400 text-xs mt-2">* Resubmission comment is required.</p>
              )}
            </div>
          </div>
        )}

        {/* Display submission errors if any */}
        {submissionErrors && (
          <div className="mb-6 bg-red-900/50 border border-red-500 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Submission Error</h3>
            {submissionErrors.validation ? (
              <div>
                <p className="text-red-300 mb-2">Validation Errors:</p>
                <ul className="list-disc list-inside text-red-200 text-sm">
                  {submissionErrors.validation.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <p className="text-red-300">Status: {submissionErrors.status}</p>
                <p className="text-red-300">Message: {submissionErrors.message}</p>
                {submissionErrors.data && (
                  <pre className="mt-2 p-2 bg-gray-800 rounded text-xs text-red-200 overflow-auto">
                    {JSON.stringify(submissionErrors.data, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading products from database...</p>
          </div>
        ) : loadError ? (
          <div className="bg-gray-800 rounded-xl p-12 border border-red-500/30 text-center">
            <p className="text-red-400 mb-4">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* ── Cable Selection Form ── */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-6">Select Cable Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Category Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Category *
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {allCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Product/Cable Dropdown */}
                {selectedCategoryId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Cable / Product *
                    </label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a product</option>
                      {filteredProducts.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name}
                          {prod.size ? ` — ${prod.size}` : ""}
                        </option>
                      ))}
                    </select>
                    {filteredProducts.length === 0 && (
                      <p className="text-yellow-400 text-xs mt-1">
                        No products found for this category.
                      </p>
                    )}
                  </div>
                )}

                {/* 3. Core Type Dropdown (from price matrix) */}
                {selectedProductId && availableCoreTypes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Core Type *
                    </label>
                    {priceMatrixLoading ? (
                      <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
                        Loading core types...
                      </div>
                    ) : (
                      <select
                        value={selectedCoreTypeId}
                        onChange={(e) => setSelectedCoreTypeId(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select core type</option>
                        {availableCoreTypes.map((ct) => (
                          <option key={ct.id} value={ct.id}>
                            {ct.name} — Rs. {parseFloat(ct.price).toLocaleString()}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {/* 4. Color Dropdown */}
                {selectedProductId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Color
                    </label>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select color (optional)</option>
                      {standardColors.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 5. Quantity */}
                {selectedProductId && (selectedCoreTypeId || availableCoreTypes.length === 0) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Quantity (Coils) *
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(parseInt(e.target.value) || 1)
                        }
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="ml-3 text-gray-400 whitespace-nowrap">
                        coils
                        {selectedCoilLength > 0 &&
                          ` (${selectedCoilLength}m each)`}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected product info badge */}
              {selectedProductId && selectedPrice > 0 && (selectedCoreTypeId || availableCoreTypes.length === 0) && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 font-medium mb-1">
                    ✓ Product: {getProductName(selectedProductId)}
                    {selectedCoreTypeId && selectedCoreTypeId !== "none" && ` — ${getCoreTypeName(selectedCoreTypeId)}`}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Price per coil: Rs. {selectedPrice.toLocaleString()}
                    {selectedCoilLength > 0 &&
                      ` | Coil length: ${selectedCoilLength}m`}
                  </p>
                </div>
              )}

              {/* ── Discount Section ── */}
              {selectedProductId && selectedPrice > 0 && (selectedCoreTypeId || availableCoreTypes.length === 0) && (
                <div className="mt-6 border border-gray-600 rounded-lg p-4 bg-gray-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Discount Options
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Discount Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Discount Type
                      </label>
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="none">No Discount</option>
                      </select>
                    </div>

                    {/* Discount Value */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Discount Value ({getDiscountLimit()}% max)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max={
                            discountType === "percentage"
                              ? getDiscountLimit()
                              : 999999
                          }
                          value={discountValue === 0 ? "" : discountValue}
                          onChange={(e) => {
                            const val =
                              e.target.value === ""
                                ? 0
                                : parseFloat(e.target.value);
                            if (
                              discountType === "percentage" &&
                              val > getDiscountLimit()
                            ) {
                              alert(
                                `Your role (${userRole}) allows up to ${getDiscountLimit()}% discount.`,
                              );
                              return;
                            }
                            setDiscountValue(val);
                          }}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Enter % (Max: ${getDiscountLimit()}%)`}
                          disabled={discountType === "none"}
                        />
                        <span className="absolute right-3 top-3 text-gray-400">
                          %
                        </span>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="flex items-center">
                      <div className="bg-gray-800 p-4 rounded-lg w-full">
                        <p className="text-gray-400 text-sm">
                          Discount Applied
                        </p>
                        <p className="text-xl font-bold text-red-400">
                          {discountType === "percentage" && discountValue > 0
                            ? `${discountValue}%`
                            : "None"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Discount warnings */}
                  {discountType === "percentage" &&
                    discountValue > getDiscountLimit() && (
                      <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm">
                          ⚠️ Discount exceeds your limit! Max:{" "}
                          {getDiscountLimit()}%
                        </p>
                      </div>
                    )}
                  {discountType === "percentage" &&
                    discountValue > 20 &&
                    discountValue <= getDiscountLimit() && (
                      <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                        <p className="text-yellow-400 text-sm">
                          ⚠️ High discount ({discountValue}%) applied
                        </p>
                      </div>
                    )}
                </div>
              )}

              {/* ── Price Calculation ── */}
              {selectedPrice > 0 && totalBeforeDiscount > 0 && (
                <div className="mt-8 p-6 bg-gray-700 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Price Calculation
                  </h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">
                        Price per coil: Rs. {selectedPrice.toLocaleString()}
                      </span>
                      <span className="text-gray-300">
                        × {quantity} coils
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-600">
                      <span className="text-gray-300 font-medium">
                        Subtotal
                      </span>
                      <span className="text-xl font-semibold text-gray-300">
                        Rs. {totalBeforeDiscount.toLocaleString()}
                      </span>
                    </div>

                    {discountAmount > 0 && discountType !== "none" && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">
                            Discount ({discountValue}%)
                          </span>
                          <span className="text-red-400 font-medium">
                            - Rs. {discountAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-600">
                          <span className="text-gray-300 font-medium text-lg">
                            Final Total
                          </span>
                          <span className="text-3xl font-bold text-green-400">
                            Rs. {finalPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-green-400">You save</span>
                            <span className="text-green-400 font-bold">
                              Rs. {discountAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {(discountAmount === 0 || discountType === "none") && (
                      <div className="flex justify-between items-center pt-3 border-t border-gray-600">
                        <span className="text-gray-300 font-medium text-lg">
                          Total Amount
                        </span>
                        <span className="text-3xl font-bold text-green-400">
                          Rs. {totalBeforeDiscount.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId("");
                    setSelectedProductId("");
                    setSelectedCoreTypeId("");
                    setSelectedColor("");
                    setPriceMatrix([]);
                    setSelectedPrice(0);
                    setSelectedCoilLength(0);
                    setQuantity(1);
                    setDiscountType("percentage");
                    setDiscountValue(0);
                  }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleAddToQuotation}
                  disabled={!selectedProductId || (availableCoreTypes.length > 0 && !selectedCoreTypeId) || selectedPrice <= 0}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    !selectedProductId || (availableCoreTypes.length > 0 && !selectedCoreTypeId) || selectedPrice <= 0
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : editingItemId
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {editingItemId ? (
                    <><span>✓</span> Update Item</>
                  ) : (
                    <><span>+</span> Add to Quotation</>
                  )}
                </button>
                {editingItemId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>

            {/* ── Added Items List ── */}
            {quotationItems.length > 0 && (
              <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Quotation Items ({quotationItems.length})
                </h3>
                <div className="space-y-4">
                  {quotationItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-lg border flex items-center justify-between transition-colors ${
                        editingItemId === item.id
                          ? "bg-blue-900/30 border-blue-500"
                          : "bg-gray-700/50 border-gray-600 hover:border-gray-400 cursor-pointer"
                      }`}
                    >
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleEditItem(item)}
                        title="Click to edit this item"
                      >
                        <p className="text-white font-medium">
                          {index + 1}. {item.productName}
                          {editingItemId === item.id && (
                            <span className="ml-2 text-xs text-blue-400 font-normal">(Editing)</span>
                          )}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
                          <span>Category: {item.categoryName}</span>
                          <span>Core: {item.coreTypeName}</span>
                          {item.color && <span>Color: {item.color}</span>}
                          <span>Qty: {item.quantity} coils</span>
                          {item.coilLength > 0 && (
                            <span>({item.coilLength}m/coil)</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-green-400 font-bold text-lg">
                          Rs. {item.finalPrice.toLocaleString()}
                        </p>
                        {item.discountAmount > 0 && (
                          <p className="text-red-400 text-sm">
                            -{item.discountValue}% off
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 ml-4">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit item"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grand Total */}
                <div className="mt-6 pt-4 border-t border-gray-600 flex justify-between items-center">
                  <span className="text-xl font-semibold text-white">
                    Grand Total
                  </span>
                  <span className="text-3xl font-bold text-green-400">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>

                {/* Submit */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-lg flex items-center gap-2 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      isResubmit ? "Resubmit Quotation" : (isEditMode ? "Update Quotation" : "Submit Quotation")
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── Current Selection Summary ── */}
            <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Current Selection
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-400">Category:</p>
                  <p className="text-white font-medium">
                    {selectedCategoryId
                      ? getCategoryName(selectedCategoryId)
                      : "Not selected"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400">Product:</p>
                  <p className="text-white font-medium">
                    {selectedProductId
                      ? getProductName(selectedProductId)
                      : "Not selected"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400">Core Type:</p>
                  <p className="text-white font-medium">
                    {selectedCoreTypeId
                      ? getCoreTypeName(selectedCoreTypeId)
                      : "Not selected"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400">Color:</p>
                  <p className="text-white font-medium">
                    {selectedColor || "Not selected"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400">Unit Price:</p>
                  <p className="text-white font-medium">
                    {selectedPrice > 0
                      ? `Rs. ${selectedPrice.toLocaleString()}`
                      : "—"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400">Final Price:</p>
                  <p className="text-white font-medium">
                    {finalPrice > 0
                      ? `Rs. ${finalPrice.toLocaleString()}`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateQuotation;