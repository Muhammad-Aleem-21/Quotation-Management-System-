// import { FiAlertCircle, FiSave, FiPlus, FiTrash2, FiEdit, FiCheckCircle, FiXCircle, FiAlertTriangle, FiRefreshCw, FiSearch, FiChevronDown, FiX } from "react-icons/fi";

// import React, { useState, useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import {
//   getProducts,
//   getCategories,
//   getCoreTypes,
//   getCatalogCategories,
//   getCatalogCoreTypes,
//   getClients,
//   createClient,
//   submitQuotation,
//   updateQuotation,
//   resubmitQuotation,
//   forceSubmitQuotation,
//   getPriceMatrix,
// } from "../api/api";
// import DuplicateAlertDialog from "../components/DuplicateAlertDialog";

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

// // ── Searchable Select Component ──
// const SearchableSelect = ({
//   options,
//   value,
//   onChange,
//   placeholder,
//   searchPlaceholder,
//   disabled = false,
//   emptyMessage = "No results found",
// }) => {
//   const [search, setSearch] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef(null);
//   const searchRef = useRef(null);

//   const selectedOption = options.find((o) => String(o.value) === String(value));

//   const filtered = options.filter((o) =>
//     o.label.toLowerCase().includes(search.toLowerCase())
//   );

//   // Close on outside click
//   useEffect(() => {
//     const handleClick = (e) => {
//       if (containerRef.current && !containerRef.current.contains(e.target)) {
//         setIsOpen(false);
//         setSearch("");
//       }
//     };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   // Focus search when opened
//   useEffect(() => {
//     if (isOpen && searchRef.current) {
//       searchRef.current.focus();
//     }
//   }, [isOpen]);

//   const handleSelect = (optionValue) => {
//     onChange(optionValue);
//     setIsOpen(false);
//     setSearch("");
//   };

//   const handleClear = (e) => {
//     e.stopPropagation();
//     onChange("");
//     setSearch("");
//   };

//   return (
//     <div ref={containerRef} className="relative w-full">
//       {/* Trigger */}
//       <button
//         type="button"
//         disabled={disabled}
//         onClick={() => !disabled && setIsOpen((prev) => !prev)}
//         className={`w-full flex items-center justify-between p-3 bg-gray-700 border rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//           disabled
//             ? "border-gray-600 opacity-50 cursor-not-allowed"
//             : isOpen
//             ? "border-blue-500 bg-gray-700"
//             : "border-gray-600 hover:border-gray-400"
//         }`}
//       >
//         <span className={selectedOption ? "text-white" : "text-gray-400"}>
//           {selectedOption ? selectedOption.label : placeholder}
//         </span>
//         <div className="flex items-center gap-1 ml-2 shrink-0">
//           {value && !disabled && (
//             <span
//               onClick={handleClear}
//               className="p-1 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
//               title="Clear"
//             >
//               <FiX size={14} />
//             </span>
//           )}
//           <FiChevronDown
//             size={16}
//             className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
//           />
//         </div>
//       </button>

//       {/* Dropdown */}
//       {isOpen && (
//         <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-2xl overflow-hidden">
//           {/* Search input */}
//           <div className="p-2 border-b border-gray-700">
//             <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-md">
//               <FiSearch size={14} className="text-gray-400 shrink-0" />
//               <input
//                 ref={searchRef}
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder={searchPlaceholder || "Search..."}
//                 className="w-full bg-transparent text-white text-sm placeholder-gray-400 focus:outline-none"
//               />
//               {search && (
//                 <button
//                   type="button"
//                   onClick={() => setSearch("")}
//                   className="text-gray-400 hover:text-white"
//                 >
//                   <FiX size={13} />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Options list */}
//           <div className="max-h-52 overflow-y-auto">
//             {filtered.length === 0 ? (
//               <div className="px-4 py-3 text-sm text-gray-400">{emptyMessage}</div>
//             ) : (
//               filtered.map((option) => (
//                 <button
//                   key={option.value}
//                   type="button"
//                   onClick={() => handleSelect(option.value)}
//                   className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-700 focus:bg-gray-700 focus:outline-none ${
//                     String(option.value) === String(value)
//                       ? "bg-blue-600/20 text-blue-300 font-medium"
//                       : "text-gray-200"
//                   }`}
//                 >
//                   {option.label}
//                 </button>
//               ))
//             )}
//           </div>

//           {/* Count badge */}
//           <div className="px-4 py-1.5 border-t border-gray-700 text-xs text-gray-500">
//             {filtered.length} of {options.length} {options.length === 1 ? "result" : "results"}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const CreateQuotation = ({ userRole = "salesperson" }) => {
//   const location = useLocation();
//   const [step, setStep] = useState(1);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingQuotationId, setEditingQuotationId] = useState(null);
//   const [isResubmit, setIsResubmit] = useState(false);
//   const [resubmissionComment, setResubmissionComment] = useState("");
//   const [rejectionDetails, setRejectionDetails] = useState(null);
//   const hasPrefilled = React.useRef(null);
//   const isEditingRef = React.useRef(false);

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
//     valid_until: "",
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
//   const [discountType, setDiscountType] = useState("none");
//   const [discountValue, setDiscountValue] = useState(0);
//   const [showDiscountInPdf, setShowDiscountInPdf] = useState(true);

//   // Multi-product list
//   const [quotationItems, setQuotationItems] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [editingItemId, setEditingItemId] = useState(null);

//   // Client Management States
//   const [allClients, setAllClients] = useState([]);
//   const [clientMode, setClientMode] = useState("select"); // 'select' or 'create'
//   const [isCreatingClient, setIsCreatingClient] = useState(false);

//   // Error state for submission
//   const [submissionErrors, setSubmissionErrors] = useState(null);

//   // Duplicate detection states
//   const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
//   const [duplicateData, setDuplicateData] = useState(null);
//   const [pendingPayload, setPendingPayload] = useState(null);
//   const [isForceSubmitting, setIsForceSubmitting] = useState(false);

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

//         const rawCores = coreRes.data?.data || coreRes.data?.core_types || (Array.isArray(coreRes.data) ? coreRes.data : []);
//         const cores = rawCores.map((c) =>
//           typeof c === "string"
//             ? { id: c, name: c, display_name: c, code: c }
//             : c
//         );
//         setAllCoreTypes(cores);
        
//         console.log("allCoreTypes after set:", cores);

//         const clientsArray = clientRes.data?.data || clientRes.data?.clients || (Array.isArray(clientRes.data) ? clientRes.data : []);
//         console.log("Fetched Clients Raw:", clientRes.data);
//         console.log("Processed Clients:", clientsArray);
        
//         const user = JSON.parse(localStorage.getItem("user") || "{}");
//         const currentUserId = String(user.id || "");

//         let sanitizedClients = (Array.isArray(clientsArray) ? clientsArray : []).map(c => ({
//           ...c,
//           id: c.id || c.client_id,
//           name: c.name || c.client_name || c.company_name || "Unnamed Client",
//           region: c.region || ""
//         }));
        
//         if (currentUserId) {
//           console.log("CreateQuotation - Filtering clients for user:", currentUserId);
//           sanitizedClients = sanitizedClients.filter(c => {
//             const clientOwnerId = String(c.salesperson_id || c.user_id || "");
//             return clientOwnerId === currentUserId;
//           });
//           console.log("CreateQuotation - Filtered clients count:", sanitizedClients.length);
//         }
        
//         setAllClients(sanitizedClients);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoadError(
//           "Failed to load data from server. " + (error.response?.data?.message || error.message)
//         );
//       } finally {
//         setLoading(false);
//         console.log("Core Type IDs from allCoreTypes:", allCoreTypes.map(c => c.id));
//       }
//     };
//     fetchData();
//   }, [userRole]);

//   // ── Handle Edit Mode Pre-filling ──
//   useEffect(() => {
//     if (location.state?.editQuotation) {
//       const editQuote = location.state.editQuotation;
      
//       if (loading || allCoreTypes.length === 0) {
//         return;
//       }

//       if (hasPrefilled.current === editQuote.id) {
//         return;
//       }
      
//       console.log("========== ENTERING EDIT MODE ==========");
//       console.log("Quotation Data:", editQuote);
      
//       setIsEditMode(true);
//       setEditingQuotationId(editQuote.id);

//       const formatDate = (dateStr) => {
//         if (!dateStr) return "";
//         return dateStr.split('T')[0];
//       };

//       const client_id = editQuote.client_id || editQuote.client?.id || "";
//       const Name = editQuote.client_name || editQuote.client?.name || editQuote.customer || editQuote.customer_name || editQuote.name || "";
//       const company_name = editQuote.company_name || editQuote.client?.company_name || "";
//       const email = editQuote.email || editQuote.client?.email || editQuote.customer_email || editQuote.client_email || "";
//       const phone = editQuote.phone || editQuote.client?.phone || editQuote.customer_phone || editQuote.client_phone || "";
//       const client_address = editQuote.client_address || editQuote.client?.address || editQuote.customer_address || editQuote.address || "";
//       const region = editQuote.region || editQuote.client?.region || "";
//       const quotation_date = formatDate(editQuote.quotation_date || editQuote.created_at) || new Date().toISOString().split("T")[0];
//       const valid_until = formatDate(editQuote.valid_until) || "";

//       setClientInfo({
//         client_id,
//         Name,
//         company_name,
//         email,
//         phone,
//         client_address,
//         region,
//         quotation_date,
//         valid_until,
//       });

//       if (client_id) {
//         setClientMode("select");
//       } else {
//         setClientMode("create");
//       }

//       if (editQuote.items && Array.isArray(editQuote.items)) {
//         console.log("Mapping items:", editQuote.items);
//         const mappedItems = editQuote.items.map(item => {
//           let coreId = item.core_type_id || item.core_type;
//           let coreName = item.core_type_name || (typeof item.core_type === 'string' ? item.core_type : "");
//           let coreCode = item.core_type_code || (typeof item.core_type === 'string' ? item.core_type : null);
          
//           if (typeof coreId === 'string' && isNaN(coreId)) {
//             const foundCoreType = allCoreTypes.find(ct => 
//               ct.name?.toLowerCase() === coreId.toLowerCase() || 
//               ct.display_name?.toLowerCase() === coreId.toLowerCase() ||
//               ct.code?.toLowerCase() === coreId.toLowerCase()
//             );
//             if (foundCoreType) {
//               coreId = foundCoreType.id;
//               coreName = foundCoreType.display_name || foundCoreType.name;
//               coreCode = foundCoreType.code;
//             }
//           } else if (coreId && allCoreTypes.length > 0) {
//             const foundCoreType = allCoreTypes.find(ct => String(ct.id) === String(coreId));
//             if (foundCoreType) {
//               coreName = foundCoreType.display_name || foundCoreType.name;
//               coreCode = foundCoreType.code;
//             }
//           }

//           const unitPrice = parseFloat(item.base_price || item.unit_price || item.price || 0);
//           const qty = parseInt(item.quantity) || 0;
//           const totalBefore = unitPrice * qty;
//           const discVal = parseFloat(item.discount_value || item.discount || 0);
//           const discType = item.discount_type || "percentage";
          
//           let discAmt = 0;
//           if (discType === 'percentage') {
//             discAmt = (totalBefore * discVal) / 100;
//           } else if (discType === 'fixed' || discType === 'amount') {
//             discAmt = discVal;
//           }

//           return {
//             id: item.id || Date.now() + Math.random(),
//             productId: item.product_id || item.productId || item.product?.id,
//             coreTypeId: coreId,
//             productName: item.product?.name || item.product_name || item.name || `Product #${item.product_id}`,
//             categoryName: item.product?.category?.name || item.category_name || "N/A",
//             coreTypeName: coreName || (typeof item.core_type === 'string' ? item.core_type : `Core #${item.core_type}`),
//             coreTypeCode: coreCode,
//             color: item.color || "",
//             quantity: qty,
//             coilLength: item.coil_length || item.coilLength || 0,
//             unitPrice: unitPrice,
//             totalBeforeDiscount: totalBefore,
//             discountType: discType,
//             discountValue: discVal,
//             discountAmount: discAmt,
//             finalPrice: parseFloat(item.final_price || item.finalPrice) || (totalBefore - discAmt),
//             showDiscountInPdf: item.show_discount_in_pdf !== undefined ? item.show_discount_in_pdf : true,
//           };
//         });
//         console.log("Mapped items:", mappedItems);
//         setQuotationItems(mappedItems);
//       }
      
//       hasPrefilled.current = editQuote.id;

//       if (location.state.isResubmit) {
//         setIsResubmit(true);
//         setRejectionDetails({
//           reason: editQuote.rejection_reason || "No reason provided",
//           history: editQuote.rejection_history || []
//         });
//       } else {
//         setIsResubmit(false);
//         setRejectionDetails(null);
//       }
//     } else {
//       setIsEditMode(false);
//       setIsResubmit(false);
//       setEditingQuotationId(null);
//       setRejectionDetails(null);
//       hasPrefilled.current = null;
//     }
//   }, [location.state, allCategories, allProducts, allCoreTypes, allClients, loading]);

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

//     if (isEditingRef.current) return;

//     setSelectedProductId("");
//     setPriceMatrix([]);
//     setSelectedCoreTypeId("");
//     setSelectedPrice(0);
//     setSelectedCoilLength(0);
//   }, [selectedCategoryId, allProducts]);

//   // ── When product changes → fetch price matrix from API based on has_core_types ──
//   // ── When product changes → fetch price matrix from API based on has_core_types ──
//   useEffect(() => {
//     const fetchPriceMatrixForProduct = async () => {
//       if (!selectedProductId) {
//         setPriceMatrix([]);
//         setSelectedCoreTypeId("");
//         setSelectedPrice(0);
//         setSelectedCoilLength(0);
//         return;
//       }

//       if (isEditingRef.current) return;

//       // Get the selected product to check has_core_types
//       const product = allProducts.find(
//         (p) => String(p.id) === String(selectedProductId)
//       );
      
//       // Check if product has core types
//       const hasCoreTypes = product?.has_core_types === true;
      
//       if (!hasCoreTypes) {
//         // Product doesn't have core types - use base price
//         setPriceMatrix([]);
//         const basePrice = parseFloat(product?.base_price || product?.unit_price || product?.price || 0);
//         setSelectedPrice(basePrice);
//         setSelectedCoilLength(parseFloat(product?.coil_length) || 0);
//         setSelectedCoreTypeId("none");
//         setPriceMatrixLoading(false);
//         return;
//       }
      
//       // Product has core types - fetch price matrix
//       setPriceMatrixLoading(true);
      
//       try {
//         // Fetch price matrix from the API
//         const response = await getPriceMatrix(selectedProductId);
        
//         console.log("Price Matrix Response:", response.data);
        
//         // Extract core_types and prices from the response
//         const coreTypes = response.data?.core_types || [];
//         const prices = response.data?.prices || {};
        
//         // Create matrix array by combining core_types with their prices
//         const matrix = coreTypes.map(coreType => {
//           const priceData = prices[coreType.code];
//           return {
//             core_type_id: coreType.id,
//             core_type_name: coreType.display_name || coreType.name,
//             core_type_code: coreType.code,
//             price: priceData?.price ? parseFloat(priceData.price) : null,
//             coil_length: priceData?.coil_length ? parseFloat(priceData.coil_length) : null,
//             exists: priceData?.exists || false
//           };
//         });
        
//         // Filter to only include entries with valid price > 0
//         const validMatrix = matrix.filter(entry => 
//           entry.price && entry.price > 0 && entry.exists === true
//         );
        
//         console.log("Valid Matrix:", validMatrix);
        
//         if (validMatrix.length > 0) {
//           setPriceMatrix(validMatrix);
//           setSelectedCoreTypeId("");
//           setSelectedPrice(0);
//           setSelectedCoilLength(0);
//         } else {
//           // If no matrix entries with valid prices, treat as no core types
//           setPriceMatrix([]);
//           const basePrice = parseFloat(product?.base_price || product?.unit_price || product?.price || 0);
//           setSelectedPrice(basePrice);
//           setSelectedCoilLength(parseFloat(product?.coil_length) || 0);
//           setSelectedCoreTypeId("none");
//         }
//       } catch (error) {
//         console.error("Error fetching price matrix:", error);
//         // Fallback to product's base price
//         setPriceMatrix([]);
//         const basePrice = parseFloat(product?.base_price || product?.unit_price || product?.price || 0);
//         setSelectedPrice(basePrice);
//         setSelectedCoilLength(parseFloat(product?.coil_length) || 0);
//         setSelectedCoreTypeId("none");
//       } finally {
//         setPriceMatrixLoading(false);
//       }
//     };
    
//     fetchPriceMatrixForProduct();
//   }, [selectedProductId, allProducts]);

//   // ── When core type changes → set price from matrix ──
//   useEffect(() => {
//     if (!selectedCoreTypeId || selectedCoreTypeId === "none" || priceMatrix.length === 0) {
//       if (selectedCoreTypeId !== "none") {
//         setSelectedPrice(0);
//         setSelectedCoilLength(0);
//       }
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

//   const getCoreTypeName = (id) => {
//     if (!id || id === "none") return "N/A";
//     const ct = allCoreTypes.find((c) => String(c.id) === String(id));
//     return ct?.display_name || ct?.name || String(id);
//   };

//   const getCoreTypeCode = (id) => {
//     if (!id || id === "none") return null;
//     const ct = allCoreTypes.find((c) => String(c.id) === String(id));
//     if (ct?.code) return ct.code;
//     const pm = priceMatrix.find((p) => String(p.core_type_id) === String(id));
//     return pm?.core_type_code || null;
//   };

//   // ── Available core types for the selected product ──
//   // ── Available core types for the selected product ──
//   // Only show core types if the product has_core_types is true AND we have valid matrix entries
//   const product = allProducts.find(p => String(p.id) === String(selectedProductId));
//   const hasCoreTypes = product?.has_core_types === true;

//   const availableCoreTypes = hasCoreTypes && priceMatrix.length > 0
//     ? priceMatrix
//         .filter(pm => pm.core_type_id && pm.price && pm.price > 0)
//         .map((pm) => ({
//           id: pm.core_type_id,
//           name: pm.core_type_name || `Core Type ${pm.core_type_id}`,
//           code: pm.core_type_code,
//           price: pm.price,
//           coil_length: pm.coil_length,
//         }))
//     : [];

//   // ── Build options arrays for SearchableSelect ──
//   const categoryOptions = allCategories.map((cat) => ({
//     value: String(cat.id),
//     label: cat.name,
//   }));

//   const productOptions = filteredProducts.map((prod) => ({
//     value: String(prod.id),
//     label: prod.name + (prod.size ? ` — ${prod.size}` : ""),
//   }));

//   const coreTypeOptions = availableCoreTypes.map((ct) => ({
//     value: String(ct.id),
//     label: `${ct.name} — Rs. ${parseFloat(ct.price).toLocaleString()}${ct.coil_length ? ` (${ct.coil_length}m coil)` : ''}`,
//   }));

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
//     // Get the selected product to check has_core_types
//     const product = allProducts.find(p => String(p.id) === String(selectedProductId));
//     const productHasCoreTypes = product?.has_core_types === true;
    
//     if (!selectedProductId) {
//       alert("Please select a product to add to quotation.");
//       return;
//     }
    
//     if (productHasCoreTypes && !selectedCoreTypeId) {
//       alert("Please select a core type for this product.");
//       return;
//     }
    
//     if (selectedPrice <= 0) {
//       alert("Invalid price. Please try selecting the product again.");
//       return;
//     }

//     const resolvedCoreTypeName = !productHasCoreTypes || selectedCoreTypeId === "none" || !selectedCoreTypeId
//       ? "N/A"
//       : getCoreTypeName(selectedCoreTypeId);

//     const item = {
//       id: editingItemId || Date.now(),
//       productId: selectedProductId,
//       coreTypeId: productHasCoreTypes ? selectedCoreTypeId : null,
//       productName: getProductName(selectedProductId),
//       categoryName: getCategoryName(selectedCategoryId),
//       coreTypeName: resolvedCoreTypeName,
//       coreTypeCode: (() => {
//         if (!productHasCoreTypes || !selectedCoreTypeId || selectedCoreTypeId === "none") return null;
//         const ct = allCoreTypes.find(c => String(c.id) === String(selectedCoreTypeId));
//         return ct?.code || null;
//       })(),
//       color: selectedColor,
//       quantity,
//       coilLength: selectedCoilLength,
//       unitPrice: selectedPrice,
//       totalBeforeDiscount,
//       discountType,
//       discountValue,
//       discountAmount,
//       finalPrice,
//       showDiscountInPdf,
//     };

//     if (editingItemId) {
//       setQuotationItems((prev) =>
//         prev.map((existing) => (existing.id === editingItemId ? item : existing))
//       );
//       setEditingItemId(null);
//     } else {
//       setQuotationItems((prev) => [...prev, item]);
//     }

//     // Reset form
//     setSelectedProductId("");
//     setSelectedCoreTypeId("");
//     setSelectedColor("");
//     setPriceMatrix([]);
//     setSelectedPrice(0);
//     setSelectedCoilLength(0);
//     setQuantity(1);
//     setDiscountType("none");
//     setDiscountValue(0);
//     setShowDiscountInPdf(true);
//   };

//   const handleEditItem = async (item) => {
//   isEditingRef.current = true;
//   setEditingItemId(item.id);

//   const product = allProducts.find((p) => String(p.id) === String(item.productId));
//   if (product) {
//     setSelectedCategoryId(String(product.category_id));
//     const filtered = allProducts.filter(
//       (p) => String(p.category_id) === String(product.category_id)
//     );
//     setFilteredProducts(filtered);
//   }

//   setSelectedProductId(String(item.productId));

//   // Check if product has core types
//   const productData = allProducts.find(p => String(p.id) === String(item.productId));
//   const hasCoreTypesProduct = productData?.has_core_types === true;
  
//   if (hasCoreTypesProduct && item.coreTypeId && item.coreTypeId !== "none") {
//     // Fetch price matrix for edit mode
//     setPriceMatrixLoading(true);
//     try {
//       const response = await getPriceMatrix(item.productId);
      
//       console.log("Edit Mode - Price Matrix Response:", response.data);
      
//       // Extract core_types and prices from the response
//       const coreTypes = response.data?.core_types || [];
//       const prices = response.data?.prices || {};
      
//       // Create matrix array by combining core_types with their prices
//       const matrix = coreTypes.map(coreType => {
//         const priceData = prices[coreType.code];
//         return {
//           core_type_id: coreType.id,
//           core_type_name: coreType.display_name || coreType.name,
//           core_type_code: coreType.code,
//           price: priceData?.price ? parseFloat(priceData.price) : null,
//           coil_length: priceData?.coil_length ? parseFloat(priceData.coil_length) : null,
//           exists: priceData?.exists || false
//         };
//       });
      
//       // Filter to only include entries with valid price > 0
//       const validMatrix = matrix.filter(entry => 
//         entry.price && entry.price > 0 && entry.exists === true
//       );
      
//       console.log("Edit Mode - Valid Matrix:", validMatrix);
      
//       setPriceMatrix(validMatrix);
      
//       // Set the core type ID after matrix is loaded
//       setSelectedCoreTypeId(String(item.coreTypeId));
      
//       // Find and set the price for this core type
//       const matrixEntry = validMatrix.find(
//         (p) => String(p.core_type_id) === String(item.coreTypeId)
//       );
//       if (matrixEntry) {
//         setSelectedPrice(parseFloat(matrixEntry.price) || 0);
//         setSelectedCoilLength(parseFloat(matrixEntry.coil_length) || 0);
//       } else {
//         setSelectedPrice(item.unitPrice || 0);
//         setSelectedCoilLength(item.coilLength || 0);
//       }
//     } catch (error) {
//       console.error("Error fetching price matrix for edit:", error);
//       setPriceMatrix([]);
//       setSelectedCoreTypeId(String(item.coreTypeId));
//       setSelectedPrice(item.unitPrice || 0);
//       setSelectedCoilLength(item.coilLength || 0);
//     } finally {
//       setPriceMatrixLoading(false);
//     }
//   } else {
//     // Product doesn't have core types
//     setPriceMatrix([]);
//     setSelectedCoreTypeId("none");
//     setSelectedPrice(item.unitPrice || 0);
//     setSelectedCoilLength(item.coilLength || 0);
//   }
  
//   setSelectedColor(item.color || "");
//   setQuantity(item.quantity || 1);
//   setDiscountType(item.discountType || "percentage");
//   setDiscountValue(item.discountValue || 0);
//   setShowDiscountInPdf(item.showDiscountInPdf !== undefined ? item.showDiscountInPdf : true);

//   setTimeout(() => {
//     isEditingRef.current = false;
//   }, 0);
// };

//   const handleCancelEdit = () => {
//     setEditingItemId(null);
//     setSelectedProductId("");
//     setSelectedCategoryId("");
//     setSelectedCoreTypeId("");
//     setSelectedColor("");
//     setPriceMatrix([]);
//     setSelectedPrice(0);
//     setSelectedCoilLength(0);
//     setQuantity(1);
//     setDiscountType("none");
//     setDiscountValue(0);
//     setShowDiscountInPdf(true);
//   };

//   const handleRemoveItem = (id) => {
//     setQuotationItems((prev) => prev.filter((item) => item.id !== id));
//     if (editingItemId === id) {
//       handleCancelEdit();
//     }
//   };

//   const validatePayload = (payload) => {
//     const errors = [];

//     if (!payload.client_id) errors.push("client_id is required");
//     if (!payload.quotation_date) errors.push("quotation_date is required");

//     if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
//       errors.push("At least one item is required");
//     } else {
//       payload.items.forEach((item, index) => {
//         if (!item.product_id) errors.push(`Item ${index + 1}: product_id is required`);
        
//         const product = allProducts.find(p => String(p.id) === String(item.product_id));
//         const hasCoreTypesProduct = product?.has_core_types === true;

//         // Only require core_type if the product has_core_types is true
//         if (hasCoreTypesProduct && !item.core_type) {
//           errors.push(`Item ${index + 1}: core_type is required for this product`);
//         }
        
//         if (!item.quantity || item.quantity <= 0) errors.push(`Item ${index + 1}: quantity must be greater than 0`);
//         if (!item.base_price || item.base_price <= 0) errors.push(`Item ${index + 1}: base_price must be greater than 0`);
//         if (item.final_price === undefined || item.final_price === null) errors.push(`Item ${index + 1}: final_price is required`);
//       });
//     }

//     return errors;
//   };

//   const handleSubmit = async () => {
//     console.log("========== SUBMIT BUTTON CLICKED ==========");
//     if (isSubmitting) return;
//     setSubmissionErrors(null);

//     if (quotationItems.length === 0) {
//       alert("Please add at least one item to the quotation.");
//       return;
//     }

//     const invalidItems = quotationItems.filter(item => {
//       const product = allProducts.find(p => String(p.id) === String(item.productId));
//       const hasCoreTypesProduct = product?.has_core_types === true;
//       return hasCoreTypesProduct && !item.coreTypeId;
//     });

//     if (invalidItems.length > 0) {
//       alert("Error: Some items are missing required data (Core Type). Please remove and add them again.");
//       return;
//     }

//     if (isResubmit && !resubmissionComment.trim()) {
//       alert("Please provide a resubmission response explaining your changes.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const payload = {
//         client_id: clientInfo.client_id ? parseInt(clientInfo.client_id) : null,
//         quotation_date: clientInfo.quotation_date,
//         show_discount_columns: showDiscountInPdf,  
//         valid_until: clientInfo.valid_until || undefined,
//         company_name: clientInfo.company_name || undefined,
//         attention_to: clientInfo.Name || undefined,
//         client_email: clientInfo.email || undefined,
//         client_contact: clientInfo.phone || undefined,
//         client_address: clientInfo.client_address || undefined,
//         total_amount: grandTotal,
//         items: quotationItems.map((item) => ({
//           product_id: parseInt(item.productId),
//           core_type: (() => {
//             const ct = allCoreTypes.find(c => String(c.id) === String(item.coreTypeId));
//             if (ct?.code) return ct.code;
//             if (item.coreTypeCode && !item.coreTypeCode.match(/\d{10,}/)) return item.coreTypeCode;
//             return null;
//           })(),
//           quantity: parseInt(item.quantity),
//           base_price: parseFloat(item.unitPrice),
//           discount_percentage: (item.discountType !== 'none' && parseFloat(item.discountValue) > 0)
//             ? parseFloat(item.discountValue)
//             : 0,
//           final_price: parseFloat(item.finalPrice),
//           coil_length: parseFloat(item.coilLength) || undefined,
//           colors: item.color
//             ? [{ color: item.color, quantity: parseInt(item.quantity) }]
//             : undefined,
//         })),
//         resubmit_reason: isResubmit ? resubmissionComment : null,
//       };

//       console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #60a5fa; font-weight: bold");
//       console.log("%c  📋 QUOTATION SUBMISSION SUMMARY", "color: #60a5fa; font-size: 14px; font-weight: bold");
//       console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #60a5fa; font-weight: bold");

//       console.log("%c🧾 Client Info", "color: #a78bfa; font-weight: bold; font-size: 12px");
//       console.table({
//         "Client ID":      payload.client_id || "—",
//         "Client Name":    clientInfo.Name || "—",
//         "Company":        clientInfo.company_name || "—",
//         "Email":          clientInfo.email || "—",
//         "Phone":          clientInfo.phone || "—",
//         "Address":        clientInfo.client_address || "—",
//         "Region":         clientInfo.region || "—",
//         "Quotation Date": payload.quotation_date || "—",
//         "Valid Until":    clientInfo.valid_until || "—",
//       });

//       console.log("%c📦 Items (%d total)", "color: #34d399; font-weight: bold; font-size: 12px", quotationItems.length);
//       quotationItems.forEach((item, index) => {
//         const subtotal = item.unitPrice * item.quantity;
//         const discAmt  = item.discountAmount || 0;
//         const payloadCoreTypeId = (item.coreTypeId === "none" || !item.coreTypeId)
//           ? null
//           : (parseInt(item.coreTypeId) || null);
//         const coreTypeObj = allCoreTypes.find(ct => String(ct.id) === String(item.coreTypeId));
//         const coreMatch = coreTypeObj
//           ? `✅ id=${coreTypeObj.id} | "${coreTypeObj.display_name || coreTypeObj.name}"`
//           : `⚠️ NOT FOUND in allCoreTypes (raw id stored: "${item.coreTypeId}")`;

//         console.log(`%c  Item ${index + 1}: ${item.productName}`, "color: #fbbf24; font-weight: bold");
//         console.table({
//           "Category":                   item.categoryName,
//           "Product":                    item.productName,
//           "Core Type (display name)":   item.coreTypeName || "N/A",
//           "Core Type ID (stored)":      String(item.coreTypeId ?? "—"),
//           "Core Type ID (→ API int)":   String(payloadCoreTypeId ?? "null ← BUG if unexpected"),
//           "allCoreTypes lookup result": coreMatch,
//           "Color":                      item.color || "—",
//           "Coil Length (m)":            item.coilLength || "—",
//           "Quantity (coils)":           item.quantity,
//           "Unit Price (Rs.)":           item.unitPrice.toLocaleString(),
//           "Subtotal (Rs.)":             subtotal.toLocaleString(),
//           "Discount Type":              item.discountType || "none",
//           "Discount %":                 item.discountValue ? `${item.discountValue}%` : "0%",
//           "Discount Amt (Rs.)":         discAmt > 0 ? discAmt.toLocaleString() : "0",
//           "Final Price (Rs.)":          item.finalPrice.toLocaleString(),
//           "Show Discount in PDF":       item.showDiscountInPdf ? "Yes" : "No",
//         });
//       });

//       console.log("%c🔬 allCoreTypes reference (what was fetched from API):", "color: #fb923c; font-weight: bold; font-size: 12px");
//       console.table(allCoreTypes.map(ct => ({
//         id:           ct.id,
//         name:         ct.name,
//         display_name: ct.display_name,
//         code:         ct.code,
//       })));

//       console.log("%c💰 Totals", "color: #f87171; font-weight: bold; font-size: 12px");
//       console.table({
//         "Grand Total (Rs.)": grandTotal.toLocaleString(),
//         "Total Items":       quotationItems.length,
//       });

//       console.log("%c📤 Raw Payload (exact JSON going to backend):", "color: #94a3b8; font-weight: bold; font-size: 12px");
//       console.log(JSON.parse(JSON.stringify(payload)));
//       console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #60a5fa; font-weight: bold");

//       setPendingPayload(payload);
//       const validationErrors = validatePayload(payload);
//       if (validationErrors.length > 0) {
//         setSubmissionErrors({ validation: validationErrors });
//         alert("Validation failed. Check console for details.");
//         setIsSubmitting(false);
//         return;
//       }

//       const res = isResubmit
//         ? await resubmitQuotation(editingQuotationId, payload)
//         : (isEditMode 
//           ? await updateQuotation(editingQuotationId, payload)
//           : await submitQuotation(payload));

//       const resData = res.data;

//       if (resData?.duplicate_warning || resData?.duplicates || resData?.has_duplicates) {
//         setDuplicateData(resData);
//         setPendingPayload(null);
//         setShowDuplicateDialog(true);
//         setIsSubmitting(false);
//         return;
//       }

//       if (resData?.success || res.status === 201 || res.status === 200) {
//         const isAutoApproved = resData?.auto_approved === true || 
//                                resData?.quotation?.status === 'approved' || 
//                                resData?.quotation?.status === 'accepted';
        
//         const successMessage = isAutoApproved 
//           ? "Quotation created and auto-approved successfully!"
//           : (resData?.message || (isResubmit 
//             ? "Quotation has been resubmitted and is now pending review!" 
//             : `Quotation ${isEditMode ? "updated" : "submitted"} successfully and is now pending review!`));
//         alert(successMessage);
        
//         if (isEditMode) {
//           window.history.back();
//         } else {
//           setQuotationItems([]);
//           setStep(1);
//           setClientInfo({
//             Name: "",
//             client_id: "",
//             quotation_date: new Date().toISOString().split("T")[0],
//             company_name: "",
//             email: "",
//             phone: "",
//             client_address: "",
//             region: "",
//             valid_until: "",
//           });
//           setShowDiscountInPdf(true);
//         }
//       } else {
//         throw new Error(resData?.message || "Submission failed");
//       }
//     } catch (error) {
//       console.error("Error submitting:", error);

//       if (error.response) {
//         const errorData = error.response.data;
//         const errorMessage = errorData?.message || errorData?.error || JSON.stringify(errorData);
//         setSubmissionErrors({ status: error.response.status, data: errorData, message: errorMessage });
        
//         if (error.response.status === 422) {
//           if (errorData.errors) {
//             alert(`Validation failed: ${Object.values(errorData.errors).flat().join('\n')}`);
//           } else {
//             alert(`Validation failed: ${errorMessage}`);
//           }
//         } else {
//           alert(`Server error (${error.response.status}): ${errorMessage}`);
//         }
//       } else if (error.request) {
//         alert("No response from server. Please check your network connection.");
//       } else {
//         alert(`Request failed: ${error.message}`);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ── Force Submit ──
//   const handleForceSubmit = () => {
//     setShowDuplicateDialog(false);
//     setDuplicateData(null);
//     setPendingPayload(null);
//   };

//   const handleCancelDuplicate = () => {
//     setShowDuplicateDialog(false);
//     setDuplicateData(null);
//     setPendingPayload(null);
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
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold mb-2">{isEditMode ? "Edit Quotation" : "Create Quotation"}</h1>
//             <p className="text-gray-400">Step 1: Enter Client Information</p>
//             <div className="flex items-center gap-2 mt-4">
//               <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">1</div>
//               <span className="text-blue-400 font-medium">Client Information</span>
//               <div className="h-px flex-1 bg-gray-700 mx-4"></div>
//               <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">2</div>
//               <span className="text-gray-500">Cable Selection</span>
//             </div>
//           </div>

//           <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold">Client Details</h2>
//               <div className="flex bg-gray-700 p-1 rounded-lg">
//                 <button
//                   type="button"
//                   onClick={() => setClientMode("select")}
//                   className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                     clientMode === "select" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
//                   }`}
//                 >
//                   Return Client
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setClientMode("create")}
//                   className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                     clientMode === "create" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
//                   }`}
//                 >
//                   New Client
//                 </button>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {clientMode === "select" ? (
//                 <div className="md:col-span-2">
//                   <label htmlFor="client_select" className="block text-sm font-medium text-gray-300 mb-2">
//                     Select Existing Client *
//                   </label>
//                   <select
//                     id="client_select"
//                     value={clientInfo.client_id}
//                     onChange={(e) => {
//                       const selectedId = e.target.value;
//                       const client = allClients.find((c) => String(c.id) === String(selectedId));
//                       if (client) {
//                         setClientInfo({
//                           ...clientInfo,
//                           client_id: client.id,
//                           Name: client.name || client.client_name || "",
//                           company_name: client.company_name || "",
//                           email: client.email || "",
//                           phone: client.phone || "",
//                           client_address: client.client_address || client.address || "",
//                           region: client.region || "",
//                         });
//                       } else {
//                         setClientInfo({ ...clientInfo, client_id: "", Name: "", company_name: "", email: "", phone: "", client_address: "", region: "" });
//                       }
//                     }}
//                     className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">-- Choose a client --</option>
//                     {allClients.map((c) => (
//                       <option key={c.id} value={c.id}>
//                         {c.company_name || c.name || c.client_name} ({c.email || "No Email"})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               ) : (
//                 <>
//                   <div>
//                     <label htmlFor="Name" className="block text-sm font-medium text-gray-300 mb-2">Contact Name *</label>
//                     <input id="Name" type="text" value={clientInfo.Name} onChange={(e) => handleClientInfoChange("Name", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" placeholder="Enter contact name" />
//                   </div>
//                   <div>
//                     <label htmlFor="company_name" className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
//                     <input id="company_name" type="text" value={clientInfo.company_name} onChange={(e) => handleClientInfoChange("company_name", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" placeholder="Enter company name" />
//                   </div>
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
//                     <input id="email" type="email" value={clientInfo.email} onChange={(e) => handleClientInfoChange("email", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" placeholder="email@company.com" />
//                   </div>
//                   <div>
//                     <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
//                     <input id="phone" type="tel" value={clientInfo.phone} onChange={(e) => handleClientInfoChange("phone", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" placeholder="+92 300 1234567" />
//                   </div>
//                   <div>
//                     <label htmlFor="client_address" className="block text-sm font-medium text-gray-300 mb-2">Client Address *</label>
//                     <input id="client_address" type="text" value={clientInfo.client_address} onChange={(e) => handleClientInfoChange("client_address", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" placeholder="Street address, Building, Area" />
//                   </div>
//                   <div>
//                     <label htmlFor="region" className="block text-sm font-medium text-gray-300 mb-2">Region *</label>
//                     <input id="region" type="text" value={clientInfo.region} onChange={(e) => handleClientInfoChange("region", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" placeholder="e.g. Asia, Europe, Karachi, etc." />
//                   </div>
//                 </>
//               )}

//               <div>
//                 <label htmlFor="quotation_date" className="block text-sm font-medium text-gray-300 mb-2">Quotation Date *</label>
//                 <input id="quotation_date" type="date" value={clientInfo.quotation_date} onChange={(e) => handleClientInfoChange("quotation_date", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" />
//               </div>
//               <div>
//                 <label htmlFor="valid_until" className="block text-sm font-medium text-gray-300 mb-2">Valid Until</label>
//                 <input id="valid_until" type="date" value={clientInfo.valid_until} onChange={(e) => handleClientInfoChange("valid_until", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" />
//               </div>
//             </div>

//             <div className="mt-8 flex justify-between">
//               <button type="button" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors" onClick={() => window.history.back()}>
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
//                       const newClientId = res.data?.id || res.data?.data?.id || res.data?.client?.id || res.data?.data?.client?.id;
//                       if (!newClientId) throw new Error("Client created but failed to retrieve ID.");
//                       setClientInfo((prev) => ({ ...prev, client_id: newClientId }));
//                       const updatedClientsRes = await getClients();
//                       const updatedList = updatedClientsRes.data?.data || (Array.isArray(updatedClientsRes.data) ? updatedClientsRes.data : []);
//                       setAllClients(updatedList.map(c => ({ ...c, region: c.region || "" })));
//                     } catch (error) {
//                       alert("Failed to create client: " + (error.response?.data?.message || error.message));
//                       return;
//                     } finally {
//                       setIsCreatingClient(false);
//                     }
//                   }
                  
//                   setStep(2);
//                 }}
//                 disabled={isCreatingClient}
//                 className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${isCreatingClient ? "opacity-70 cursor-not-allowed" : ""}`}
//               >
//                 {isCreatingClient ? "Registering Client..." : (<>Next: Select Cables <span>→</span></>)}
//               </button>
//             </div>
//           </div>

//           {clientInfo.Name && (
//             <div className="mt-6 bg-gray-800 rounded-xl p-4 border border-gray-700">
//               <h3 className="text-lg font-semibold text-white mb-3">Client Summary</h3>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 <div>
//                   <p className="text-gray-400 text-sm">Company</p>
//                   <p className="text-white font-medium">{clientInfo.company_name || clientInfo.Name}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-400 text-sm">Email</p>
//                   <p className="text-white font-medium">{clientInfo.email}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-400 text-sm">Phone</p>
//                   <p className="text-white font-medium">{clientInfo.phone}</p>
//                 </div>
//                 <div className="md:col-span-3">
//                   <p className="text-gray-400 text-sm">Delivery Address</p>
//                   <p className="text-white font-medium">{clientInfo.client_address || "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-400 text-sm">Region</p>
//                   <p className="text-white font-medium">{clientInfo.region || "N/A"}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="text-sm text-gray-400 mb-2 mt-4">
//             Logged in as: <span className="text-blue-400 font-medium capitalize">{userRole}</span>
//             <span className="mx-2">•</span>
//             Discount limit: <span className="text-green-400 font-medium">{getDiscountLimit()}%</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════
//   // RENDER: Step 2 — Cable Selection
//   // ═══════════════════════════════════════════
//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-3xl font-bold mb-2">{isEditMode ? "Edit Quotation" : "Create Quotation"}</h1>
//               <p className="text-gray-400">Step 2: Select Cable Specifications</p>
//             </div>
//             <button onClick={() => setStep(1)} className="px-4 py-2 text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-500 rounded-lg transition-colors">
//               ← Back to Client Info
//             </button>
//           </div>
//           <div className="flex items-center gap-2 mt-4">
//             <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">✓</div>
//             <span className="text-green-400 font-medium">Client Information</span>
//             <div className="h-px flex-1 bg-gray-700 mx-4"></div>
//             <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">2</div>
//             <span className="text-blue-400 font-medium">Cable Selection</span>
//           </div>
//         </div>
        
//         {/* Rejection Details */}
//         {isResubmit && rejectionDetails && (
//           <div className="mb-8 space-y-4">
//             <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6">
//               <div className="flex items-center gap-3 mb-4 text-red-400">
//                 <FiAlertCircle className="text-2xl" />
//                 <h2 className="text-xl font-bold">Quotation Rejected</h2>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Latest Rejection Reason</p>
//                   <p className="text-white text-lg mt-1 italic">"{rejectionDetails.reason}"</p>
//                 </div>
//                 {rejectionDetails.history.length > 0 && (
//                   <div className="mt-4 pt-4 border-t border-red-500/20">
//                     <p className="text-gray-400 text-sm mb-3">Rejection History</p>
//                     <div className="space-y-3">
//                       {rejectionDetails.history.map((hist, idx) => (
//                         <div key={idx} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
//                           <div className="flex justify-between text-xs text-gray-400 mb-1">
//                             <span>{hist.rejected_by_name || 'Manager'}</span>
//                             <span>{new Date(hist.rejected_at).toLocaleDateString()}</span>
//                           </div>
//                           <p className="text-sm text-gray-200">{hist.rejection_reason}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="bg-blue-900/20 border border-blue-500/50 rounded-xl p-6">
//               <div className="flex items-center gap-3 mb-4 text-blue-400">
//                 <FiSave className="text-2xl" />
//                 <h2 className="text-xl font-bold">Resubmission Response</h2>
//               </div>
//               <p className="text-gray-400 text-sm mb-3">Please explain the changes you've made to address the rejection reasons above.</p>
//               <textarea
//                 value={resubmissionComment}
//                 onChange={(e) => setResubmissionComment(e.target.value)}
//                 className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 min-h-[100px]"
//                 placeholder="Describe your changes here..."
//                 required={isResubmit}
//               />
//               {isResubmit && !resubmissionComment && (
//                 <p className="text-red-400 text-xs mt-2">* Resubmission comment is required.</p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Submission errors */}
//         {submissionErrors && (
//           <div className="mb-6 bg-red-900/50 border border-red-500 rounded-xl p-4">
//             <h3 className="text-lg font-semibold text-red-400 mb-2">Submission Error</h3>
//             {submissionErrors.validation ? (
//               <ul className="list-disc list-inside text-red-200 text-sm">
//                 {submissionErrors.validation.map((error, index) => <li key={index}>{error}</li>)}
//               </ul>
//             ) : (
//               <div>
//                 <p className="text-red-300">Status: {submissionErrors.status}</p>
//                 <p className="text-red-300">Message: {submissionErrors.message}</p>
//                 {submissionErrors.data && (
//                   <pre className="mt-2 p-2 bg-gray-800 rounded text-xs text-red-200 overflow-auto">
//                     {JSON.stringify(submissionErrors.data, null, 2)}
//                   </pre>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {/* ── Cable Selection Form ── */}
//         <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//           <h2 className="text-xl font-bold mb-6">Select Cable Details</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* 1. Category — Searchable */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Select Category *
//               </label>
//               <SearchableSelect
//                 options={categoryOptions}
//                 value={selectedCategoryId}
//                 onChange={(val) => setSelectedCategoryId(val)}
//                 placeholder="Select a category"
//                 searchPlaceholder="Search categories..."
//                 emptyMessage="No categories found"
//               />
//             </div>

//             {/* 2. Product — Searchable */}
//             {selectedCategoryId && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   Select Cable / Product *
//                 </label>
//                 <SearchableSelect
//                   options={productOptions}
//                   value={selectedProductId}
//                   onChange={(val) => setSelectedProductId(val)}
//                   placeholder="Select a product"
//                   searchPlaceholder="Search products..."
//                   emptyMessage="No products found for this category"
//                   disabled={productOptions.length === 0}
//                 />
//                 {productOptions.length === 0 && (
//                   <p className="text-yellow-400 text-xs mt-1">No products found for this category.</p>
//                 )}
//               </div>
//             )}

//             {/* 3. Core Type - Only show if product has core types */}
//             {selectedProductId && hasCoreTypes && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   Select Core Type *
//                 </label>
//                 {priceMatrixLoading ? (
//                   <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
//                     <div className="flex items-center gap-2">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
//                       Loading core types...
//                     </div>
//                   </div>
//                 ) : availableCoreTypes.length > 0 ? (
//                   <SearchableSelect
//                     options={coreTypeOptions}
//                     value={selectedCoreTypeId}
//                     onChange={(val) => setSelectedCoreTypeId(val)}
//                     placeholder="Select core type"
//                     searchPlaceholder="Search core types..."
//                     emptyMessage="No core types available for this product"
//                   />
//                 ) : (
//                   <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400">
//                     No core types with valid prices available for this product
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* 4. Color */}
//             {selectedProductId && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">Select Color</label>
//                 <select
//                   value={selectedColor}
//                   onChange={(e) => setSelectedColor(e.target.value)}
//                   className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select color (optional)</option>
//                   {standardColors.map((color) => (
//                     <option key={color} value={color}>{color}</option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             {/* 5. Quantity */}
//             {selectedProductId && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">Quantity (Coils) *</label>
//                 <div className="flex items-center">
//                   <input
//                     type="number"
//                     min="1"
//                     value={quantity}
//                     onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
//                     className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
//                   />
//                   <span className="ml-3 text-gray-400 whitespace-nowrap">
//                     coils{selectedCoilLength > 0 && ` (${selectedCoilLength}m each)`}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Selected product info badge */}
//           {!priceMatrixLoading && selectedProductId && selectedPrice > 0 && (
//             <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
//               <p className="text-green-400 font-medium mb-1">
//                 ✓ Product: {getProductName(selectedProductId)}
//                 {hasCoreTypes && selectedCoreTypeId && selectedCoreTypeId !== "none" && ` — ${getCoreTypeName(selectedCoreTypeId)}`}
//               </p>
//               <p className="text-gray-400 text-sm">
//                 Price per coil: Rs. {selectedPrice.toLocaleString()}
//                 {selectedCoilLength > 0 && ` | Coil length: ${selectedCoilLength}m`}
//               </p>
//             </div>
//           )}

//           {/* Discount Section */}
//           {!priceMatrixLoading && selectedProductId && selectedPrice > 0 && (
//             <div className="mt-6 border border-gray-600 rounded-lg p-4 bg-gray-700/30">
//               <h3 className="text-lg font-semibold text-white mb-4">Discount Options</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Discount Type</label>
//                   <select
//                     value={discountType}
//                     onChange={(e) => setDiscountType(e.target.value)}
//                     className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="percentage">Percentage (%)</option>
//                     <option value="none">No Discount</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Discount Value ({getDiscountLimit()}% max)
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="number"
//                       min="0"
//                       max={discountType === "percentage" ? getDiscountLimit() : 999999}
//                       value={discountValue === 0 ? "" : discountValue}
//                       onChange={(e) => {
//                         const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
//                         if (discountType === "percentage" && val > getDiscountLimit()) {
//                           alert(`Your role (${userRole}) allows up to ${getDiscountLimit()}% discount.`);
//                           return;
//                         }
//                         setDiscountValue(val);
//                       }}
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
//                       placeholder={`Enter % (Max: ${getDiscountLimit()}%)`}
//                       disabled={discountType === "none"}
//                     />
//                     <span className="absolute right-3 top-3 text-gray-400">%</span>
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="bg-gray-800 p-4 rounded-lg w-full">
//                     <p className="text-gray-400 text-sm">Discount Applied</p>
//                     <p className="text-xl font-bold text-red-400">
//                       {discountType === "percentage" && discountValue > 0 ? `${discountValue}%` : "None"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {discountType === "percentage" && discountValue > getDiscountLimit() && (
//                 <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
//                   <p className="text-red-400 text-sm">⚠️ Discount exceeds your limit! Max: {getDiscountLimit()}%</p>
//                 </div>
//               )}
//               {discountType === "percentage" && discountValue > 20 && discountValue <= getDiscountLimit() && (
//                 <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
//                   <p className="text-yellow-400 text-sm">⚠️ High discount ({discountValue}%) applied</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Price Calculation */}
//           {!priceMatrixLoading && selectedPrice > 0 && totalBeforeDiscount > 0 && (
//             <div className="mt-8 p-6 bg-gray-700 rounded-lg border border-gray-600">
//               <h3 className="text-lg font-semibold text-white mb-4">Price Calculation</h3>
//               <div className="space-y-3 mb-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-400">Price per coil: Rs. {selectedPrice.toLocaleString()}</span>
//                   <span className="text-gray-300">× {quantity} coils</span>
//                 </div>
//                 <div className="flex justify-between items-center pt-3 border-t border-gray-600">
//                   <span className="text-gray-300 font-medium">Subtotal</span>
//                   <span className="text-xl font-semibold text-gray-300">Rs. {totalBeforeDiscount.toLocaleString()}</span>
//                 </div>
//                 {discountAmount > 0 && discountType !== "none" && (
//                   <>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-300">Discount ({discountValue}%)</span>
//                       <span className="text-red-400 font-medium">- Rs. {discountAmount.toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between items-center pt-3 border-t border-gray-600">
//                       <span className="text-gray-300 font-medium text-lg">Final Total</span>
//                       <span className="text-3xl font-bold text-green-400">Rs. {finalPrice.toLocaleString()}</span>
//                     </div>
//                     <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
//                       <div className="flex justify-between items-center">
//                         <span className="text-green-400">You save</span>
//                         <span className="text-green-400 font-bold">Rs. {discountAmount.toLocaleString()}</span>
//                       </div>
//                     </div>
//                   </>
//                 )}
//                 {(discountAmount === 0 || discountType === "none") && (
//                   <div className="flex justify-between items-center pt-3 border-t border-gray-600">
//                     <span className="text-gray-300 font-medium text-lg">Total Amount</span>
//                     <span className="text-3xl font-bold text-green-400">Rs. {totalBeforeDiscount.toLocaleString()}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Action buttons */}
//           <div className="mt-8 flex justify-end gap-4">
//             <button
//               type="button"
//               onClick={() => {
//                 setSelectedCategoryId("");
//                 setSelectedProductId("");
//                 setSelectedCoreTypeId("");
//                 setSelectedColor("");
//                 setPriceMatrix([]);
//                 setSelectedPrice(0);
//                 setSelectedCoilLength(0);
//                 setQuantity(1);
//                 setDiscountType("none");
//                 setDiscountValue(0);
//                 setShowDiscountInPdf(true);
//               }}
//               className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
//             >
//               Reset
//             </button>
//             <button
//               type="button"
//               onClick={handleAddToQuotation}
//               disabled={
//                 !selectedProductId || 
//                 (hasCoreTypes && !selectedCoreTypeId) || 
//                 selectedPrice <= 0 || 
//                 priceMatrixLoading
//               }
//               className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
//                 !selectedProductId || 
//                 (hasCoreTypes && !selectedCoreTypeId) || 
//                 selectedPrice <= 0 || 
//                 priceMatrixLoading
//                   ? "bg-gray-600 text-gray-400 cursor-not-allowed"
//                   : editingItemId
//                     ? "bg-amber-600 hover:bg-amber-700 text-white"
//                     : "bg-blue-600 hover:bg-blue-700 text-white"
//               }`}
//             >
//               {editingItemId ? <><span>✓</span> Update Item</> : <><span>+</span> Add to Quotation</>}
//             </button>
//             {editingItemId && (
//               <button type="button" onClick={handleCancelEdit} className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors">
//                 Cancel Edit
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Added Items List */}
//         {quotationItems.length > 0 && (
//           <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
//             <h3 className="text-lg font-semibold text-white mb-4">Quotation Items ({quotationItems.length})</h3>
//             <div className="space-y-4">
//               {quotationItems.map((item, index) => (
//                 <div
//                   key={item.id}
//                   className={`p-4 rounded-lg border flex items-center justify-between transition-colors ${
//                     editingItemId === item.id
//                       ? "bg-blue-900/30 border-blue-500"
//                       : "bg-gray-700/50 border-gray-600 hover:border-gray-400 cursor-pointer"
//                   }`}
//                 >
//                   <div className="flex-1 cursor-pointer" onClick={() => handleEditItem(item)} title="Click to edit this item">
//                     <p className="text-white font-medium">
//                       {index + 1}. {item.productName}
//                       {editingItemId === item.id && <span className="ml-2 text-xs text-blue-400 font-normal">(Editing)</span>}
//                     </p>
//                     <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
//                       <span>Category: {item.categoryName}</span>
//                       {item.coreTypeName && item.coreTypeName !== "N/A" && (
//                         <span>Core: {item.coreTypeName}</span>
//                       )}
//                       {item.color && <span>Color: {item.color}</span>}
//                       <span>Qty: {item.quantity} coils</span>
//                       {item.coilLength > 0 && <span>({item.coilLength}m/coil)</span>}
//                       <span
//                         className={`text-xs px-1.5 py-0.5 rounded-full ${
//                           item.showDiscountInPdf
//                             ? "bg-green-500/15 text-green-400"
//                             : "bg-gray-600/40 text-gray-500"
//                         }`}
//                       >
//                         {item.showDiscountInPdf ? "Disc shown in PDF" : "Disc hidden in PDF"}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="text-right ml-4">
//                     <p className="text-green-400 font-bold text-lg">Rs. {item.finalPrice.toLocaleString()}</p>
//                     {item.discountAmount > 0 && (
//                       <p className="text-red-400 text-sm">-{item.discountValue}% off</p>
//                     )}
//                   </div>
//                   <div className="flex flex-col gap-1 ml-4">
//                     <button onClick={() => handleEditItem(item)} className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit item">✎</button>
//                     <button onClick={() => handleRemoveItem(item.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors" title="Remove item">✕</button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-6 pt-4 border-t border-gray-600 flex justify-between items-center">
//               <span className="text-xl font-semibold text-white">Grand Total</span>
//               <span className="text-3xl font-bold text-green-400">Rs. {grandTotal.toLocaleString()}</span>
//             </div>

//             <div className="mt-4 flex items-center gap-3 p-3 bg-gray-800/60 border border-gray-600 rounded-lg">
//               <input
//                 type="checkbox"
//                 id="globalShowDiscountInPdf"
//                 checked={showDiscountInPdf}
//                 onChange={(e) => setShowDiscountInPdf(e.target.checked)}
//                 className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-blue-500 focus:ring-blue-500 cursor-pointer accent-blue-500"
//               />
//               <label htmlFor="globalShowDiscountInPdf" className="text-sm text-gray-300 cursor-pointer select-none">
//                 Show <span className="text-white font-medium">Discount %</span> and <span className="text-white font-medium">Discount Amount</span> columns in PDF
//               </label>
//               <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
//                 showDiscountInPdf
//                   ? "bg-green-500/20 text-green-400 border border-green-500/30"
//                   : "bg-gray-600/40 text-gray-400 border border-gray-600"
//               }`}>
//                 {showDiscountInPdf ? "Visible" : "Hidden"}
//               </span>
//             </div>

//             <div className="mt-6 flex justify-end">
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className={`px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-lg flex items-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Submitting...
//                   </>
//                 ) : (
//                   isResubmit ? "Resubmit Quotation" : (isEditMode ? "Update Quotation" : "Submit Quotation")
//                 )}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Current Selection Summary */}
//         <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
//           <h3 className="text-lg font-semibold text-white mb-4">Current Selection</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <p className="text-gray-400">Category:</p>
//               <p className="text-white font-medium">{selectedCategoryId ? getCategoryName(selectedCategoryId) : "Not selected"}</p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-gray-400">Product:</p>
//               <p className="text-white font-medium">{selectedProductId ? getProductName(selectedProductId) : "Not selected"}</p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-gray-400">Core Type:</p>
//               <p className="text-white font-medium">
//                 {hasCoreTypes ? (selectedCoreTypeId ? getCoreTypeName(selectedCoreTypeId) : "Not selected") : "N/A"}
//               </p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-gray-400">Color:</p>
//               <p className="text-white font-medium">{selectedColor || "Not selected"}</p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-gray-400">Unit Price:</p>
//               <p className="text-white font-medium">{selectedPrice > 0 ? `Rs. ${selectedPrice.toLocaleString()}` : "—"}</p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-gray-400">Final Price:</p>
//               <p className="text-white font-medium">{finalPrice > 0 ? `Rs. ${finalPrice.toLocaleString()}` : "—"}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Duplicate Quotation Alert Dialog */}
//       {showDuplicateDialog && duplicateData && (
//         <DuplicateAlertDialog
//           duplicateData={duplicateData}
//           onCancel={handleForceSubmit}
//           onForceSubmit={handleForceSubmit}
//           isSubmitting={false}
//           okOnly={true}
//         />
//       )}
//     </div>
//   );
// };

// export default CreateQuotation;














import { FiAlertCircle, FiSave, FiPlus, FiTrash2, FiEdit, FiCheckCircle, FiXCircle, FiAlertTriangle, FiRefreshCw, FiSearch, FiChevronDown, FiX } from "react-icons/fi";

import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  getProducts,
  getCategories,
  getCoreTypes,
  getCatalogCategories,
  getCatalogCoreTypes,
  getAllCoreTypes,      // ADD THIS
  getClients,
  createClient,
  submitQuotation,
  updateQuotation,
  resubmitQuotation,
  forceSubmitQuotation,
  getPriceMatrix,
  getCatalogPriceMatrix, // add this
} from "../api/api";
import DuplicateAlertDialog from "../components/DuplicateAlertDialog";

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

// ── Searchable Select Component ──
const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  disabled = false,
  emptyMessage = "No results found",
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const selectedOption = options.find((o) => String(o.value) === String(value));

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between p-3 bg-gray-700 border rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled
            ? "border-gray-600 opacity-50 cursor-not-allowed"
            : isOpen
            ? "border-blue-500 bg-gray-700"
            : "border-gray-600 hover:border-gray-400"
        }`}
      >
        <span className={selectedOption ? "text-white" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          {value && !disabled && (
            <span
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
              title="Clear"
            >
              <FiX size={14} />
            </span>
          )}
          <FiChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-700">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-md">
              <FiSearch size={14} className="text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder || "Search..."}
                className="w-full bg-transparent text-white text-sm placeholder-gray-400 focus:outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400">{emptyMessage}</div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-700 focus:bg-gray-700 focus:outline-none ${
                    String(option.value) === String(value)
                      ? "bg-blue-600/20 text-blue-300 font-medium"
                      : "text-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>

          {/* Count badge */}
          <div className="px-4 py-1.5 border-t border-gray-700 text-xs text-gray-500">
            {filtered.length} of {options.length} {options.length === 1 ? "result" : "results"}
          </div>
        </div>
      )}
    </div>
  );
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
  const [discountType, setDiscountType] = useState("none");
  const [discountValue, setDiscountValue] = useState(0);
  const [showDiscountInPdf, setShowDiscountInPdf] = useState(true);

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

  // Duplicate detection states
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateData, setDuplicateData] = useState(null);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [isForceSubmitting, setIsForceSubmitting] = useState(false);

  const getDiscountLimit = () => discountLimits[userRole] || 30;

  // Define this once near the top of your component (after the userRole prop):
  const fetchPriceMatrix = (productId) => {
    const isSalesOrManager = userRole === "salesperson" || userRole === "manager";
    return isSalesOrManager
      ? getCatalogPriceMatrix(productId)
      : getPriceMatrix(productId);
  };

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
          getAllCoreTypes().catch(err => { console.error("CoreTypes Fetch Error:", err); throw err; }),  // ← ALL roles use this
          getClients().catch(err => { console.error("Clients Fetch Error:", err); throw err; }),
        ]);

        console.log("All API calls completed successfully.");

        const products = prodRes.data?.data || prodRes.data?.products || (Array.isArray(prodRes.data) ? prodRes.data : []);
        setAllProducts(products);

        const cats = catRes.data?.data || catRes.data?.categories || (Array.isArray(catRes.data) ? catRes.data : []);
        setAllCategories(cats);

        const rawCores = coreRes.data?.data || coreRes.data?.core_types || (Array.isArray(coreRes.data) ? coreRes.data : []);
        const cores = rawCores.map((c) =>
          typeof c === "string"
            ? { id: c, name: c, display_name: c, code: c }
            : c
        );
        setAllCoreTypes(cores);
        
        console.log("allCoreTypes after set:", cores);

        const clientsArray = clientRes.data?.data || clientRes.data?.clients || (Array.isArray(clientRes.data) ? clientRes.data : []);
        console.log("Fetched Clients Raw:", clientRes.data);
        console.log("Processed Clients:", clientsArray);
        
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const currentUserId = String(user.id || "");

        let sanitizedClients = (Array.isArray(clientsArray) ? clientsArray : []).map(c => ({
          ...c,
          id: c.id || c.client_id,
          name: c.name || c.client_name || c.company_name || "Unnamed Client",
          region: c.region || ""
        }));
        
        if (currentUserId) {
          console.log("CreateQuotation - Filtering clients for user:", currentUserId);
          sanitizedClients = sanitizedClients.filter(c => {
            const clientOwnerId = String(c.salesperson_id || c.user_id || "");
            return clientOwnerId === currentUserId;
          });
          console.log("CreateQuotation - Filtered clients count:", sanitizedClients.length);
        }
        
        setAllClients(sanitizedClients);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadError(
          "Failed to load data from server. " + (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
        console.log("Core Type IDs from allCoreTypes:", allCoreTypes.map(c => c.id));
      }
    };
    fetchData();
  }, [userRole]);

  // ── Handle Edit Mode Pre-filling ──
  useEffect(() => {
  if (location.state?.editQuotation) {
    const editQuote = location.state.editQuotation;

    if (loading || allCoreTypes.length === 0) return;
    if (hasPrefilled.current === editQuote.id) return;

    (async () => {
      console.log("========== ENTERING EDIT MODE ==========");
      console.log("Quotation Data:", editQuote);

      setIsEditMode(true);
      setEditingQuotationId(editQuote.id);

      const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return dateStr.split('T')[0];
      };

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

      if (client_id) {
        setClientMode("select");
      } else {
        setClientMode("create");
      }

      if (editQuote.items && Array.isArray(editQuote.items)) {
        console.log("Mapping items:", editQuote.items);

        // ── Fetch price matrix for each unique product upfront ──
        const uniqueProductIds = [...new Set(
          editQuote.items.map(item => String(item.product_id || item.product?.id))
        )];

        const matrixMap = {};
        await Promise.all(
          uniqueProductIds.map(async (productId) => {
            try {
              const response = await fetchPriceMatrix(productId);
              const coreTypes = response.data?.core_types || [];
              const prices = response.data?.prices || {};
              const matrix = coreTypes.map(coreType => {
                const priceData = prices[coreType.code];
                return {
                  core_type_id: coreType.id,
                  core_type_name: coreType.display_name || coreType.name,
                  core_type_code: coreType.code,
                  price: priceData?.price ? parseFloat(priceData.price) : null,
                  coil_length: priceData?.coil_length ? parseFloat(priceData.coil_length) : null,
                  exists: priceData?.exists || false
                };
              }).filter(entry => entry.price && entry.price > 0 && entry.exists === true);
              matrixMap[productId] = matrix;
            } catch (err) {
              console.error("Failed to fetch price matrix for product:", productId, err);
              matrixMap[productId] = [];
            }
          })
        );

        console.log("Matrix map built:", matrixMap);

        const mappedItems = editQuote.items.map(item => {
          const productId = String(item.product_id || item.product?.id || "");
          const categoryId = item.product?.category_id ?? null;
          const unitPrice = parseFloat(item.unit_price || item.base_price || 0);
          const qty = parseInt(item.quantity) || 0;
          const totalBefore = unitPrice * qty;
          const discVal = parseFloat(
            item.discount_percentage ??
            item.discount_value ??
            item.discount_percent ??
            0
          );
          const discType = discVal > 0 ? "percentage" : "none";

          let discAmt = 0;
          if (discType === 'percentage') {
            discAmt = (totalBefore * discVal) / 100;
          }

          // ── Resolve core type by matching unit_price against price matrix ──
          const matrix = matrixMap[productId] || [];
          const matrixEntry = matrix.find(
            p => parseFloat(p.price) === parseFloat(unitPrice)
          );

          console.log(
            `Item product_id=${productId} unit_price=${unitPrice}`,
            "→ matched core:", matrixEntry?.core_type_name ?? "NOT FOUND"
          );

          const categoryName = allCategories.find(
            c => String(c.id) === String(categoryId)
          )?.name || item.product?.category?.name || "N/A";

          return {
            id: item.id || Date.now() + Math.random(),
            productId: productId,
            coreTypeId: matrixEntry ? String(matrixEntry.core_type_id) : null,
            productName: item.product?.name || item.description || `Product #${productId}`,
            categoryName: categoryName,
            coreTypeName: matrixEntry?.core_type_name || "",
            coreTypeCode: matrixEntry?.core_type_code || null,
            color: item.color || item.color_distribution?.[0]?.color || "",
            quantity: qty,
            coilLength: parseFloat(item.product?.coil_length || item.coil_length || 0),
            unitPrice: unitPrice,
            totalBeforeDiscount: totalBefore,
            discountType: discType,
            discountValue: discVal,
            discountAmount: discAmt,
            finalPrice: parseFloat(item.total_price || item.final_price) || (totalBefore - discAmt),
            showDiscountInPdf: item.show_discount_in_pdf !== undefined ? item.show_discount_in_pdf : true,
          };
        });

        console.log("Mapped items with resolved core types:", mappedItems);
        setQuotationItems(mappedItems);
      }

      hasPrefilled.current = editQuote.id;

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
    })();

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

    if (isEditingRef.current) return;

    setSelectedProductId("");
    setPriceMatrix([]);
    setSelectedCoreTypeId("");
    setSelectedPrice(0);
    setSelectedCoilLength(0);
  }, [selectedCategoryId, allProducts]);

  // ── When product changes → fetch price matrix from API based on has_core_types ──
  // ── When product changes → fetch price matrix from API based on has_core_types ──
  useEffect(() => {
    const fetchPriceMatrixForProduct = async () => {
      if (!selectedProductId) {
        setPriceMatrix([]);
        setSelectedCoreTypeId("");
        setSelectedPrice(0);
        setSelectedCoilLength(0);
        return;
      }

      if (isEditingRef.current) return;

      // Get the selected product to check has_core_types
      const product = allProducts.find(
        (p) => String(p.id) === String(selectedProductId)
      );
      
      // Check if product has core types
      const hasCoreTypes = product?.has_core_types === true;
      
      if (!hasCoreTypes) {
        // Product doesn't have core types - use base price
        setPriceMatrix([]);
        const basePrice = parseFloat(product?.base_price || product?.unit_price || product?.price || 0);
        setSelectedPrice(basePrice);
        setSelectedCoilLength(parseFloat(product?.coil_length) || 0);
        setSelectedCoreTypeId("none");
        setPriceMatrixLoading(false);
        return;
      }
      
      // Product has core types - fetch price matrix
      setPriceMatrixLoading(true);
      
      try {
        // Fetch price matrix from the API
        const response = await fetchPriceMatrix(selectedProductId);
        
        console.log("Price Matrix Response:", response.data);
        
        // Extract core_types and prices from the response
        const coreTypes = response.data?.core_types || [];
        const prices = response.data?.prices || {};
        
        // Create matrix array by combining core_types with their prices
        const matrix = coreTypes.map(coreType => {
          const priceData = prices[coreType.code];
          return {
            core_type_id: coreType.id,
            core_type_name: coreType.display_name || coreType.name,
            core_type_code: coreType.code,
            price: priceData?.price ? parseFloat(priceData.price) : null,
            coil_length: priceData?.coil_length ? parseFloat(priceData.coil_length) : null,
            exists: priceData?.exists || false
          };
        });
        
        // Filter to only include entries with valid price > 0
        const validMatrix = matrix.filter(entry => 
          entry.price && entry.price > 0 && entry.exists === true
        );
        
        console.log("Valid Matrix:", validMatrix);
        
        if (validMatrix.length > 0) {
          setPriceMatrix(validMatrix);
          setSelectedCoreTypeId("");
          setSelectedPrice(0);
          setSelectedCoilLength(0);
        } else {
          // If no matrix entries with valid prices, treat as no core types
          setPriceMatrix([]);
          const basePrice = parseFloat(product?.base_price || product?.unit_price || product?.price || 0);
          setSelectedPrice(basePrice);
          setSelectedCoilLength(parseFloat(product?.coil_length) || 0);
          setSelectedCoreTypeId("none");
        }
      } catch (error) {
        console.error("Error fetching price matrix:", error);
        // Fallback to product's base price
        setPriceMatrix([]);
        const basePrice = parseFloat(product?.base_price || product?.unit_price || product?.price || 0);
        setSelectedPrice(basePrice);
        setSelectedCoilLength(parseFloat(product?.coil_length) || 0);
        setSelectedCoreTypeId("none");
      } finally {
        setPriceMatrixLoading(false);
      }
    };
    
    fetchPriceMatrixForProduct();
  }, [selectedProductId, allProducts]);

  // ── When core type changes → set price from matrix ──
  useEffect(() => {
    if (!selectedCoreTypeId || selectedCoreTypeId === "none" || priceMatrix.length === 0) {
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

  const getCoreTypeName = (id) => {
    if (!id || id === "none") return "N/A";
    const ct = allCoreTypes.find((c) => String(c.id) === String(id));
    return ct?.display_name || ct?.name || String(id);
  };

  const getCoreTypeCode = (id) => {
    if (!id || id === "none") return null;
    const ct = allCoreTypes.find((c) => String(c.id) === String(id));
    if (ct?.code) return ct.code;
    const pm = priceMatrix.find((p) => String(p.core_type_id) === String(id));
    return pm?.core_type_code || null;
  };

  // ── Available core types for the selected product ──
  // ── Available core types for the selected product ──
  // Only show core types if the product has_core_types is true AND we have valid matrix entries
  const product = allProducts.find(p => String(p.id) === String(selectedProductId));
  const hasCoreTypes = product?.has_core_types === true;

  const availableCoreTypes = hasCoreTypes && priceMatrix.length > 0
    ? priceMatrix
        .filter(pm => pm.core_type_id && pm.price && pm.price > 0)
        .map((pm) => ({
          id: pm.core_type_id,
          name: pm.core_type_name || `Core Type ${pm.core_type_id}`,
          code: pm.core_type_code,
          price: pm.price,
          coil_length: pm.coil_length,
        }))
    : [];

  // ── Build options arrays for SearchableSelect ──
  const categoryOptions = allCategories.map((cat) => ({
    value: String(cat.id),
    label: cat.name,
  }));

  const productOptions = filteredProducts.map((prod) => ({
    value: String(prod.id),
    label: prod.name + (prod.size ? ` — ${prod.size}` : ""),
  }));

  const coreTypeOptions = availableCoreTypes.map((ct) => ({
    value: String(ct.id),
    label: `${ct.name} — Rs. ${parseFloat(ct.price).toLocaleString()}${ct.coil_length ? ` (${ct.coil_length}m coil)` : ''}`,
  }));

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
    // Get the selected product to check has_core_types
    const product = allProducts.find(p => String(p.id) === String(selectedProductId));
    const productHasCoreTypes = product?.has_core_types === true;
    
    if (!selectedProductId) {
      alert("Please select a product to add to quotation.");
      return;
    }
    
    if (productHasCoreTypes && !selectedCoreTypeId) {
      alert("Please select a core type for this product.");
      return;
    }
    
    if (selectedPrice <= 0) {
      alert("Invalid price. Please try selecting the product again.");
      return;
    }

    const resolvedCoreTypeName = !productHasCoreTypes || selectedCoreTypeId === "none" || !selectedCoreTypeId
      ? "N/A"
      : getCoreTypeName(selectedCoreTypeId);

    const item = {
      id: editingItemId || Date.now(),
      productId: selectedProductId,
      coreTypeId: productHasCoreTypes ? selectedCoreTypeId : null,
      productName: getProductName(selectedProductId),
      categoryName: getCategoryName(selectedCategoryId),
      coreTypeName: resolvedCoreTypeName,
      coreTypeCode: (() => {
        if (!productHasCoreTypes || !selectedCoreTypeId || selectedCoreTypeId === "none") return null;
        const ct = allCoreTypes.find(c => String(c.id) === String(selectedCoreTypeId));
        return ct?.code || null;
      })(),
      color: selectedColor,
      quantity,
      coilLength: selectedCoilLength,
      unitPrice: selectedPrice,
      totalBeforeDiscount,
      discountType,
      discountValue,
      discountAmount,
      finalPrice,
      showDiscountInPdf,
    };

    if (editingItemId) {
      setQuotationItems((prev) =>
        prev.map((existing) => (existing.id === editingItemId ? item : existing))
      );
      setEditingItemId(null);
    } else {
      setQuotationItems((prev) => [...prev, item]);
    }

    // Reset form
    setSelectedProductId("");
    setSelectedCoreTypeId("");
    setSelectedColor("");
    setPriceMatrix([]);
    setSelectedPrice(0);
    setSelectedCoilLength(0);
    setQuantity(1);
    setDiscountType("none");
    setDiscountValue(0);
    setShowDiscountInPdf(true);
  };

  const handleEditItem = async (item) => {
    isEditingRef.current = true;
    setEditingItemId(item.id);

    const product = allProducts.find((p) => String(p.id) === String(item.productId));
    if (product) {
      setSelectedCategoryId(String(product.category_id));
      const filtered = allProducts.filter(
        (p) => String(p.category_id) === String(product.category_id)
      );
      setFilteredProducts(filtered);
    }

    setSelectedProductId(String(item.productId));

    const productData = allProducts.find(p => String(p.id) === String(item.productId));
    const hasCoreTypesProduct = productData?.has_core_types === true;

    if (hasCoreTypesProduct) {
      setPriceMatrixLoading(true);
      try {
        // Use role-based endpoint (correct permissions per role)
        const response = await fetchPriceMatrix(item.productId);

        const coreTypes = response.data?.core_types || [];
        const prices = response.data?.prices || {};

        const matrix = coreTypes.map(coreType => {
          const priceData = prices[coreType.code];
          return {
            core_type_id: coreType.id,
            core_type_name: coreType.display_name || coreType.name,
            core_type_code: coreType.code,
            price: priceData?.price ? parseFloat(priceData.price) : null,
            coil_length: priceData?.coil_length ? parseFloat(priceData.coil_length) : null,
            exists: priceData?.exists || false
          };
        });

        const validMatrix = matrix.filter(entry =>
          entry.price && entry.price > 0 && entry.exists === true
        );

        console.log("Valid Matrix:", validMatrix);
        console.log("Target unit price to match:", item.unitPrice);

        // ── Match core type by unit_price ──
        // Since API doesn't return core_type_id on saved items,
        // we identify the correct core type by matching the saved unit_price
        const targetPrice = parseFloat(item.unitPrice);
        const matrixEntry = validMatrix.find(
          (p) => parseFloat(p.price) === targetPrice
        );

        console.log("Matched matrix entry by price:", matrixEntry);

        setPriceMatrix(validMatrix);

        if (matrixEntry) {
          setSelectedPrice(parseFloat(matrixEntry.price) || 0);
          setSelectedCoilLength(parseFloat(matrixEntry.coil_length) || 0);
          setTimeout(() => {
            setSelectedCoreTypeId(String(matrixEntry.core_type_id));
            isEditingRef.current = false;
          }, 50);
        } else {
          // No match found — set price but leave core type for manual selection
          console.warn("No matrix entry matched price:", targetPrice, "| Available prices:", validMatrix.map(e => e.price));
          setSelectedPrice(item.unitPrice || 0);
          setSelectedCoilLength(item.coilLength || 0);
          setSelectedCoreTypeId("");
          isEditingRef.current = false;
        }

      } catch (error) {
        console.error("Error fetching price matrix for edit:", error);
        setPriceMatrix([]);
        setSelectedCoreTypeId("");
        setSelectedPrice(item.unitPrice || 0);
        setSelectedCoilLength(item.coilLength || 0);
        isEditingRef.current = false;
      } finally {
        setPriceMatrixLoading(false);
      }
    } else {
      setPriceMatrix([]);
      setSelectedCoreTypeId("none");
      setSelectedPrice(item.unitPrice || 0);
      setSelectedCoilLength(item.coilLength || 0);
      isEditingRef.current = false;
    }

    setSelectedColor(item.color || "");
    setQuantity(item.quantity || 1);
    setDiscountType(item.discountType || "percentage");
    setDiscountValue(item.discountValue || 0);
    setShowDiscountInPdf(item.showDiscountInPdf !== undefined ? item.showDiscountInPdf : true);
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
    setDiscountType("none");
    setDiscountValue(0);
    setShowDiscountInPdf(true);
  };

  const handleRemoveItem = (id) => {
    setQuotationItems((prev) => prev.filter((item) => item.id !== id));
    if (editingItemId === id) {
      handleCancelEdit();
    }
  };

  const validatePayload = (payload) => {
    const errors = [];

    if (!payload.client_id) errors.push("client_id is required");
    if (!payload.quotation_date) errors.push("quotation_date is required");

    if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
      errors.push("At least one item is required");
    } else {
      payload.items.forEach((item, index) => {
        if (!item.product_id) errors.push(`Item ${index + 1}: product_id is required`);
        
        const product = allProducts.find(p => String(p.id) === String(item.product_id));
        const hasCoreTypesProduct = product?.has_core_types === true;

        // Only require core_type if the product has_core_types is true
        if (hasCoreTypesProduct && !item.core_type) {
          errors.push(`Item ${index + 1}: core_type is required for this product`);
        }
        
        if (!item.quantity || item.quantity <= 0) errors.push(`Item ${index + 1}: quantity must be greater than 0`);
        if (!item.base_price || item.base_price <= 0) errors.push(`Item ${index + 1}: base_price must be greater than 0`);
        if (item.final_price === undefined || item.final_price === null) errors.push(`Item ${index + 1}: final_price is required`);
      });
    }

    return errors;
  };

  const handleSubmit = async () => {
    console.log("========== SUBMIT BUTTON CLICKED ==========");
    if (isSubmitting) return;
    setSubmissionErrors(null);

    if (quotationItems.length === 0) {
      alert("Please add at least one item to the quotation.");
      return;
    }

    const invalidItems = quotationItems.filter(item => {
      const product = allProducts.find(p => String(p.id) === String(item.productId));
      const hasCoreTypesProduct = product?.has_core_types === true;
      return hasCoreTypesProduct && !item.coreTypeId;
    });

    if (invalidItems.length > 0) {
      alert("Error: Some items are missing required data (Core Type). Please remove and add them again.");
      return;
    }

    if (isResubmit && !resubmissionComment.trim()) {
      alert("Please provide a resubmission response explaining your changes.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        client_id: clientInfo.client_id ? parseInt(clientInfo.client_id) : null,
        quotation_date: clientInfo.quotation_date,
        show_discount_columns: showDiscountInPdf,  
        valid_until: clientInfo.valid_until || undefined,
        company_name: clientInfo.company_name || undefined,
        attention_to: clientInfo.Name || undefined,
        client_email: clientInfo.email || undefined,
        client_contact: clientInfo.phone || undefined,
        client_address: clientInfo.client_address || undefined,
        total_amount: grandTotal,
        items: quotationItems.map((item) => ({
          product_id: parseInt(item.productId),
          core_type: (() => {
            const ct = allCoreTypes.find(c => String(c.id) === String(item.coreTypeId));
            if (ct?.code) return ct.code;
            if (item.coreTypeCode && !item.coreTypeCode.match(/\d{10,}/)) return item.coreTypeCode;
            return null;
          })(),
          quantity: parseInt(item.quantity),
          base_price: parseFloat(item.unitPrice),
          discount_percentage: (item.discountType !== 'none' && parseFloat(item.discountValue) > 0)
            ? parseFloat(item.discountValue)
            : 0,
          final_price: parseFloat(item.finalPrice),
          coil_length: parseFloat(item.coilLength) || undefined,
          colors: item.color
            ? [{ color: item.color, quantity: parseInt(item.quantity) }]
            : undefined,
        })),
        resubmit_reason: isResubmit ? resubmissionComment : null,
      };

      console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #60a5fa; font-weight: bold");
      console.log("%c  📋 QUOTATION SUBMISSION SUMMARY", "color: #60a5fa; font-size: 14px; font-weight: bold");
      console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #60a5fa; font-weight: bold");

      console.log("%c🧾 Client Info", "color: #a78bfa; font-weight: bold; font-size: 12px");
      console.table({
        "Client ID":      payload.client_id || "—",
        "Client Name":    clientInfo.Name || "—",
        "Company":        clientInfo.company_name || "—",
        "Email":          clientInfo.email || "—",
        "Phone":          clientInfo.phone || "—",
        "Address":        clientInfo.client_address || "—",
        "Region":         clientInfo.region || "—",
        "Quotation Date": payload.quotation_date || "—",
        "Valid Until":    clientInfo.valid_until || "—",
      });

      console.log("%c📦 Items (%d total)", "color: #34d399; font-weight: bold; font-size: 12px", quotationItems.length);
      quotationItems.forEach((item, index) => {
        const subtotal = item.unitPrice * item.quantity;
        const discAmt  = item.discountAmount || 0;
        const payloadCoreTypeId = (item.coreTypeId === "none" || !item.coreTypeId)
          ? null
          : (parseInt(item.coreTypeId) || null);
        const coreTypeObj = allCoreTypes.find(ct => String(ct.id) === String(item.coreTypeId));
        const coreMatch = coreTypeObj
          ? `✅ id=${coreTypeObj.id} | "${coreTypeObj.display_name || coreTypeObj.name}"`
          : `⚠️ NOT FOUND in allCoreTypes (raw id stored: "${item.coreTypeId}")`;

        console.log(`%c  Item ${index + 1}: ${item.productName}`, "color: #fbbf24; font-weight: bold");
        console.table({
          "Category":                   item.categoryName,
          "Product":                    item.productName,
          "Core Type (display name)":   item.coreTypeName || "N/A",
          "Core Type ID (stored)":      String(item.coreTypeId ?? "—"),
          "Core Type ID (→ API int)":   String(payloadCoreTypeId ?? "null ← BUG if unexpected"),
          "allCoreTypes lookup result": coreMatch,
          "Color":                      item.color || "—",
          "Coil Length (m)":            item.coilLength || "—",
          "Quantity (coils)":           item.quantity,
          "Unit Price (Rs.)":           item.unitPrice.toLocaleString(),
          "Subtotal (Rs.)":             subtotal.toLocaleString(),
          "Discount Type":              item.discountType || "none",
          "Discount %":                 item.discountValue ? `${item.discountValue}%` : "0%",
          "Discount Amt (Rs.)":         discAmt > 0 ? discAmt.toLocaleString() : "0",
          "Final Price (Rs.)":          item.finalPrice.toLocaleString(),
          "Show Discount in PDF":       item.showDiscountInPdf ? "Yes" : "No",
        });
      });

      console.log("%c🔬 allCoreTypes reference (what was fetched from API):", "color: #fb923c; font-weight: bold; font-size: 12px");
      console.table(allCoreTypes.map(ct => ({
        id:           ct.id,
        name:         ct.name,
        display_name: ct.display_name,
        code:         ct.code,
      })));

      console.log("%c💰 Totals", "color: #f87171; font-weight: bold; font-size: 12px");
      console.table({
        "Grand Total (Rs.)": grandTotal.toLocaleString(),
        "Total Items":       quotationItems.length,
      });

      console.log("%c📤 Raw Payload (exact JSON going to backend):", "color: #94a3b8; font-weight: bold; font-size: 12px");
      console.log(JSON.parse(JSON.stringify(payload)));
      console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #60a5fa; font-weight: bold");

      setPendingPayload(payload);
      const validationErrors = validatePayload(payload);
      if (validationErrors.length > 0) {
        setSubmissionErrors({ validation: validationErrors });
        alert("Validation failed. Check console for details.");
        setIsSubmitting(false);
        return;
      }

      const res = isResubmit
        ? await resubmitQuotation(editingQuotationId, payload)
        : (isEditMode 
          ? await updateQuotation(editingQuotationId, payload)
          : await submitQuotation(payload));

      const resData = res.data;

      if (resData?.duplicate_warning || resData?.duplicates || resData?.has_duplicates) {
        setDuplicateData(resData);
        setPendingPayload(null);
        setShowDuplicateDialog(true);
        setIsSubmitting(false);
        return;
      }

      if (resData?.success || res.status === 201 || res.status === 200) {
        const isAutoApproved = resData?.auto_approved === true || 
                               resData?.quotation?.status === 'approved' || 
                               resData?.quotation?.status === 'accepted';
        
        const successMessage = isAutoApproved 
          ? "Quotation created and auto-approved successfully!"
          : (resData?.message || (isResubmit 
            ? "Quotation has been resubmitted and is now pending review!" 
            : `Quotation ${isEditMode ? "updated" : "submitted"} successfully and is now pending review!`));
        alert(successMessage);
        
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
          setShowDiscountInPdf(true);
        }
      } else {
        throw new Error(resData?.message || "Submission failed");
      }
    } catch (error) {
      console.error("Error submitting:", error);

      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.message || errorData?.error || JSON.stringify(errorData);
        setSubmissionErrors({ status: error.response.status, data: errorData, message: errorMessage });
        
        if (error.response.status === 422) {
          if (errorData.errors) {
            alert(`Validation failed: ${Object.values(errorData.errors).flat().join('\n')}`);
          } else {
            alert(`Validation failed: ${errorMessage}`);
          }
        } else {
          alert(`Server error (${error.response.status}): ${errorMessage}`);
        }
      } else if (error.request) {
        alert("No response from server. Please check your network connection.");
      } else {
        alert(`Request failed: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Force Submit ──
  const handleForceSubmit = () => {
    setShowDuplicateDialog(false);
    setDuplicateData(null);
    setPendingPayload(null);
  };

  const handleCancelDuplicate = () => {
    setShowDuplicateDialog(false);
    setDuplicateData(null);
    setPendingPayload(null);
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

  // ═══════════════════════════════════════════
  // RENDER: Step 1 — Client Information
  // ═══════════════════════════════════════════
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{isEditMode ? "Edit Quotation" : "Create Quotation"}</h1>
            <p className="text-gray-400">Step 1: Enter Client Information</p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">1</div>
              <span className="text-blue-400 font-medium">Client Information</span>
              <div className="h-px flex-1 bg-gray-700 mx-4"></div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">2</div>
              <span className="text-gray-500">Cable Selection</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Client Details</h2>
              <div className="flex bg-gray-700 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setClientMode("select")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    clientMode === "select" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Return Client
                </button>
                <button
                  type="button"
                  onClick={() => setClientMode("create")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    clientMode === "create" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
                  }`}
                >
                  New Client
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clientMode === "select" ? (
                <div className="md:col-span-2">
                  <label htmlFor="client_select" className="block text-sm font-medium text-gray-300 mb-2">
                    Select Existing Client *
                  </label>
                  <select
                    id="client_select"
                    value={clientInfo.client_id}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const client = allClients.find((c) => String(c.id) === String(selectedId));
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
                        setClientInfo({ ...clientInfo, client_id: "", Name: "", company_name: "", email: "", phone: "", client_address: "", region: "" });
                      }
                    }}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Choose a client --</option>
                    {allClients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name || c.name || c.client_name} ({c.email || "No Email"})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="Name" className="block text-sm font-medium text-gray-300 mb-2">Contact Name *</label>
                    <input id="Name" type="text" value={clientInfo.Name} onChange={(e) => handleClientInfoChange("Name", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" placeholder="Enter contact name" />
                  </div>
                  <div>
                    <label htmlFor="company_name" className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
                    <input id="company_name" type="text" value={clientInfo.company_name} onChange={(e) => handleClientInfoChange("company_name", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" placeholder="Enter company name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                    <input id="email" type="email" value={clientInfo.email} onChange={(e) => handleClientInfoChange("email", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" placeholder="email@company.com" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                    <input id="phone" type="tel" value={clientInfo.phone} onChange={(e) => handleClientInfoChange("phone", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" placeholder="+92 300 1234567" />
                  </div>
                  <div>
                    <label htmlFor="client_address" className="block text-sm font-medium text-gray-300 mb-2">Client Address *</label>
                    <input id="client_address" type="text" value={clientInfo.client_address} onChange={(e) => handleClientInfoChange("client_address", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" placeholder="Street address, Building, Area" />
                  </div>
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-300 mb-2">Region *</label>
                    <input id="region" type="text" value={clientInfo.region} onChange={(e) => handleClientInfoChange("region", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" placeholder="e.g. Asia, Europe, Karachi, etc." />
                  </div>
                </>
              )}

              <div>
                <label htmlFor="quotation_date" className="block text-sm font-medium text-gray-300 mb-2">Quotation Date *</label>
                <input id="quotation_date" type="date" value={clientInfo.quotation_date} onChange={(e) => handleClientInfoChange("quotation_date", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="valid_until" className="block text-sm font-medium text-gray-300 mb-2">Valid Until</label>
                <input id="valid_until" type="date" value={clientInfo.valid_until} onChange={(e) => handleClientInfoChange("valid_until", e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button type="button" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors" onClick={() => window.history.back()}>
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
                      const newClientId = res.data?.id || res.data?.data?.id || res.data?.client?.id || res.data?.data?.client?.id;
                      if (!newClientId) throw new Error("Client created but failed to retrieve ID.");
                      setClientInfo((prev) => ({ ...prev, client_id: newClientId }));
                      const updatedClientsRes = await getClients();
                      const updatedList = updatedClientsRes.data?.data || (Array.isArray(updatedClientsRes.data) ? updatedClientsRes.data : []);
                      setAllClients(updatedList.map(c => ({ ...c, region: c.region || "" })));
                    } catch (error) {
                      alert("Failed to create client: " + (error.response?.data?.message || error.message));
                      return;
                    } finally {
                      setIsCreatingClient(false);
                    }
                  }
                  
                  setStep(2);
                }}
                disabled={isCreatingClient}
                className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${isCreatingClient ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isCreatingClient ? "Registering Client..." : (<>Next: Select Cables <span>→</span></>)}
              </button>
            </div>
          </div>

          {clientInfo.Name && (
            <div className="mt-6 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">Client Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Company</p>
                  <p className="text-white font-medium">{clientInfo.company_name || clientInfo.Name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">{clientInfo.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white font-medium">{clientInfo.phone}</p>
                </div>
                <div className="md:col-span-3">
                  <p className="text-gray-400 text-sm">Delivery Address</p>
                  <p className="text-white font-medium">{clientInfo.client_address || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Region</p>
                  <p className="text-white font-medium">{clientInfo.region || "N/A"}</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-400 mb-2 mt-4">
            Logged in as: <span className="text-blue-400 font-medium capitalize">{userRole}</span>
            <span className="mx-2">•</span>
            Discount limit: <span className="text-green-400 font-medium">{getDiscountLimit()}%</span>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // RENDER: Step 2 — Cable Selection
  // ═══════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{isEditMode ? "Edit Quotation" : "Create Quotation"}</h1>
              <p className="text-gray-400">Step 2: Select Cable Specifications</p>
            </div>
            <button onClick={() => setStep(1)} className="px-4 py-2 text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-500 rounded-lg transition-colors">
              ← Back to Client Info
            </button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">✓</div>
            <span className="text-green-400 font-medium">Client Information</span>
            <div className="h-px flex-1 bg-gray-700 mx-4"></div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">2</div>
            <span className="text-blue-400 font-medium">Cable Selection</span>
          </div>
        </div>
        
        {/* Rejection Details */}
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

            <div className="bg-blue-900/20 border border-blue-500/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4 text-blue-400">
                <FiSave className="text-2xl" />
                <h2 className="text-xl font-bold">Resubmission Response</h2>
              </div>
              <p className="text-gray-400 text-sm mb-3">Please explain the changes you've made to address the rejection reasons above.</p>
              <textarea
                value={resubmissionComment}
                onChange={(e) => setResubmissionComment(e.target.value)}
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="Describe your changes here..."
                required={isResubmit}
              />
              {isResubmit && !resubmissionComment && (
                <p className="text-red-400 text-xs mt-2">* Resubmission comment is required.</p>
              )}
            </div>
          </div>
        )}

        {/* Submission errors */}
        {submissionErrors && (
          <div className="mb-6 bg-red-900/50 border border-red-500 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Submission Error</h3>
            {submissionErrors.validation ? (
              <ul className="list-disc list-inside text-red-200 text-sm">
                {submissionErrors.validation.map((error, index) => <li key={index}>{error}</li>)}
              </ul>
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

        {/* ── Cable Selection Form ── */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-6">Select Cable Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Category — Searchable */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Category *
              </label>
              <SearchableSelect
                options={categoryOptions}
                value={selectedCategoryId}
                onChange={(val) => setSelectedCategoryId(val)}
                placeholder="Select a category"
                searchPlaceholder="Search categories..."
                emptyMessage="No categories found"
              />
            </div>

            {/* 2. Product — Searchable */}
            {selectedCategoryId && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Cable / Product *
                </label>
                <SearchableSelect
                  options={productOptions}
                  value={selectedProductId}
                  onChange={(val) => setSelectedProductId(val)}
                  placeholder="Select a product"
                  searchPlaceholder="Search products..."
                  emptyMessage="No products found for this category"
                  disabled={productOptions.length === 0}
                />
                {productOptions.length === 0 && (
                  <p className="text-yellow-400 text-xs mt-1">No products found for this category.</p>
                )}
              </div>
            )}

            {/* 3. Core Type - Only show if product has core types */}
            {selectedProductId && hasCoreTypes && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Core Type *
                </label>
                {priceMatrixLoading ? (
                  <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      Loading core types...
                    </div>
                  </div>
                ) : availableCoreTypes.length > 0 ? (
                  <SearchableSelect
                    options={coreTypeOptions}
                    value={selectedCoreTypeId}
                    onChange={(val) => setSelectedCoreTypeId(val)}
                    placeholder="Select core type"
                    searchPlaceholder="Search core types..."
                    emptyMessage="No core types available for this product"
                  />
                ) : (
                  <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400">
                    No core types with valid prices available for this product
                  </div>
                )}
              </div>
            )}

            {/* 4. Color */}
            {selectedProductId && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Color</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select color (optional)</option>
                  {standardColors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            )}

            {/* 5. Quantity */}
            {selectedProductId && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quantity (Coils) *</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-400 whitespace-nowrap">
                    coils{selectedCoilLength > 0 && ` (${selectedCoilLength}m each)`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Selected product info badge */}
          {!priceMatrixLoading && selectedProductId && selectedPrice > 0 && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 font-medium mb-1">
                ✓ Product: {getProductName(selectedProductId)}
                {hasCoreTypes && selectedCoreTypeId && selectedCoreTypeId !== "none" && ` — ${getCoreTypeName(selectedCoreTypeId)}`}
              </p>
              <p className="text-gray-400 text-sm">
                Price per coil: Rs. {selectedPrice.toLocaleString()}
                {selectedCoilLength > 0 && ` | Coil length: ${selectedCoilLength}m`}
              </p>
            </div>
          )}

          {/* Discount Section */}
          {!priceMatrixLoading && selectedProductId && selectedPrice > 0 && (
            <div className="mt-6 border border-gray-600 rounded-lg p-4 bg-gray-700/30">
              <h3 className="text-lg font-semibold text-white mb-4">Discount Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="none">No Discount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Discount Value ({getDiscountLimit()}% max)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max={discountType === "percentage" ? getDiscountLimit() : 999999}
                      value={discountValue === 0 ? "" : discountValue}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                        if (discountType === "percentage" && val > getDiscountLimit()) {
                          alert(`Your role (${userRole}) allows up to ${getDiscountLimit()}% discount.`);
                          return;
                        }
                        setDiscountValue(val);
                      }}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter % (Max: ${getDiscountLimit()}%)`}
                      disabled={discountType === "none"}
                    />
                    <span className="absolute right-3 top-3 text-gray-400">%</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-gray-800 p-4 rounded-lg w-full">
                    <p className="text-gray-400 text-sm">Discount Applied</p>
                    <p className="text-xl font-bold text-red-400">
                      {discountType === "percentage" && discountValue > 0 ? `${discountValue}%` : "None"}
                    </p>
                  </div>
                </div>
              </div>

              {discountType === "percentage" && discountValue > getDiscountLimit() && (
                <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">⚠️ Discount exceeds your limit! Max: {getDiscountLimit()}%</p>
                </div>
              )}
              {discountType === "percentage" && discountValue > 20 && discountValue <= getDiscountLimit() && (
                <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-sm">⚠️ High discount ({discountValue}%) applied</p>
                </div>
              )}
            </div>
          )}

          {/* Price Calculation */}
          {!priceMatrixLoading && selectedPrice > 0 && totalBeforeDiscount > 0 && (
            <div className="mt-8 p-6 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4">Price Calculation</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Price per coil: Rs. {selectedPrice.toLocaleString()}</span>
                  <span className="text-gray-300">× {quantity} coils</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-600">
                  <span className="text-gray-300 font-medium">Subtotal</span>
                  <span className="text-xl font-semibold text-gray-300">Rs. {totalBeforeDiscount.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && discountType !== "none" && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Discount ({discountValue}%)</span>
                      <span className="text-red-400 font-medium">- Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-600">
                      <span className="text-gray-300 font-medium text-lg">Final Total</span>
                      <span className="text-3xl font-bold text-green-400">Rs. {finalPrice.toLocaleString()}</span>
                    </div>
                    <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-green-400">You save</span>
                        <span className="text-green-400 font-bold">Rs. {discountAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                )}
                {(discountAmount === 0 || discountType === "none") && (
                  <div className="flex justify-between items-center pt-3 border-t border-gray-600">
                    <span className="text-gray-300 font-medium text-lg">Total Amount</span>
                    <span className="text-3xl font-bold text-green-400">Rs. {totalBeforeDiscount.toLocaleString()}</span>
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
                setDiscountType("none");
                setDiscountValue(0);
                setShowDiscountInPdf(true);
              }}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleAddToQuotation}
              disabled={
                !selectedProductId || 
                (hasCoreTypes && !selectedCoreTypeId) || 
                selectedPrice <= 0 || 
                priceMatrixLoading
              }
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                !selectedProductId || 
                (hasCoreTypes && !selectedCoreTypeId) || 
                selectedPrice <= 0 || 
                priceMatrixLoading
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : editingItemId
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {editingItemId ? <><span>✓</span> Update Item</> : <><span>+</span> Add to Quotation</>}
            </button>
            {editingItemId && (
              <button type="button" onClick={handleCancelEdit} className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors">
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* Added Items List */}
        {quotationItems.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Quotation Items ({quotationItems.length})</h3>
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
                  <div className="flex-1 cursor-pointer" onClick={() => handleEditItem(item)} title="Click to edit this item">
                    <p className="text-white font-medium">
                      {index + 1}. {item.productName}
                      {editingItemId === item.id && <span className="ml-2 text-xs text-blue-400 font-normal">(Editing)</span>}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
                      <span>Category: {item.categoryName}</span>
                      {item.coreTypeName && item.coreTypeName !== "N/A" && (
                        <span>Core: {item.coreTypeName}</span>
                      )}
                      {item.color && <span>Color: {item.color}</span>}
                      <span>Qty: {item.quantity} coils</span>
                      {item.coilLength > 0 && <span>({item.coilLength}m/coil)</span>}
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          item.showDiscountInPdf
                            ? "bg-green-500/15 text-green-400"
                            : "bg-gray-600/40 text-gray-500"
                        }`}
                      >
                        {item.showDiscountInPdf ? "Disc shown in PDF" : "Disc hidden in PDF"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-green-400 font-bold text-lg">Rs. {item.finalPrice.toLocaleString()}</p>
                    {item.discountAmount > 0 && (
                      <p className="text-red-400 text-sm">-{item.discountValue}% off</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 ml-4">
                    <button onClick={() => handleEditItem(item)} className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit item">✎</button>
                    <button onClick={() => handleRemoveItem(item.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors" title="Remove item">✕</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-600 flex justify-between items-center">
              <span className="text-xl font-semibold text-white">Grand Total</span>
              <span className="text-3xl font-bold text-green-400">Rs. {grandTotal.toLocaleString()}</span>
            </div>

            <div className="mt-4 flex items-center gap-3 p-3 bg-gray-800/60 border border-gray-600 rounded-lg">
              <input
                type="checkbox"
                id="globalShowDiscountInPdf"
                checked={showDiscountInPdf}
                onChange={(e) => setShowDiscountInPdf(e.target.checked)}
                className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-blue-500 focus:ring-blue-500 cursor-pointer accent-blue-500"
              />
              <label htmlFor="globalShowDiscountInPdf" className="text-sm text-gray-300 cursor-pointer select-none">
                Show <span className="text-white font-medium">Discount %</span> and <span className="text-white font-medium">Discount Amount</span> columns in PDF
              </label>
              <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
                showDiscountInPdf
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-gray-600/40 text-gray-400 border border-gray-600"
              }`}>
                {showDiscountInPdf ? "Visible" : "Hidden"}
              </span>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-lg flex items-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

        {/* Current Selection Summary */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Current Selection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-400">Category:</p>
              <p className="text-white font-medium">{selectedCategoryId ? getCategoryName(selectedCategoryId) : "Not selected"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Product:</p>
              <p className="text-white font-medium">{selectedProductId ? getProductName(selectedProductId) : "Not selected"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Core Type:</p>
              <p className="text-white font-medium">
                {hasCoreTypes ? (selectedCoreTypeId ? getCoreTypeName(selectedCoreTypeId) : "Not selected") : "N/A"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Color:</p>
              <p className="text-white font-medium">{selectedColor || "Not selected"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Unit Price:</p>
              <p className="text-white font-medium">{selectedPrice > 0 ? `Rs. ${selectedPrice.toLocaleString()}` : "—"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Final Price:</p>
              <p className="text-white font-medium">{finalPrice > 0 ? `Rs. ${finalPrice.toLocaleString()}` : "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Duplicate Quotation Alert Dialog */}
      {showDuplicateDialog && duplicateData && (
        <DuplicateAlertDialog
          duplicateData={duplicateData}
          onCancel={handleForceSubmit}
          onForceSubmit={handleForceSubmit}
          isSubmitting={false}
          okOnly={true}
        />
      )}
    </div>
  );
};

export default CreateQuotation;

/////////////////////////////////////
///