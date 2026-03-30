import React, { useState, useEffect, useMemo } from "react";
import {
  getCategories,
  createCategory,
  getCoreTypes,
  createCoreType,
  createProduct,
  getVariantTypes,
  getVariantOptions,
  getProducts,
  deleteProduct,
  updateProduct,
  //createPriceMatrix,   // ← ADD THIS
  setProductPriceMatrix,
  getProductPriceMatrix,  // ← ADD THIS
} from "../api/api";

// ─────────────────────────────────────────────
// Each "core entry" in the local state is:
// { localId: string, name: string, price: string, coil_length: string }
// localId is a client-only UUID so two entries can have the same name without
// colliding.  We only resolve to a real DB core_type_id at save-time.
// ─────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);

const generateCode = (str) => {
  if (!str) return "";
  let s = str.toString().toLowerCase().trim();
  if (s.includes("single")) return "single_core";
  const match = s.match(/(\d+)/);
  if (match) return `${match[1]}_core`;
  return s.replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
};

// ─────────────────────────────────────────────
const EMPTY_PRODUCT = {
  name: "",
  description: "",
  size: "",
  construction: "",
  material: "",
  gauge: "",
  voltage_rating: "",
  uom: "MTR",
  base_price: "",
  coil_length: "",
  category_name: "",
  category_code: "",
};

const ProductManagement = () => {
  const [mode, setMode] = useState("edit"); // 'edit' | 'add'
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ── DB state ──────────────────────────────
  const [dbCategories, setDbCategories] = useState([]);
  const [dbCoreTypes, setDbCoreTypes] = useState([]);
  const [variantTypes, setVariantTypes] = useState([]);
  const [variantOptions, setVariantOptions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // ── Selection ─────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedCable, setSelectedCable] = useState(""); // product id (edit) or "" (add)
  const [selectedVariantType, setSelectedVariantType] = useState("");
  const [selectedVariantOption, setSelectedVariantOption] = useState("");

  // ── Product form ──────────────────────────
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
  const [isManualCategory, setIsManualCategory] = useState(false);

  // ── Core entries (free-form, per-product) ─
  // Array of { localId, name, price, coil_length }
  const [coreEntries, setCoreEntries] = useState([]);
  const [newCoreName, setNewCoreName] = useState("");
  const [showAddCore, setShowAddCore] = useState(false);
  // ── Post-create core type flow ─────────────
  const [justCreatedProduct, setJustCreatedProduct] = useState(null); // { id, name, base_price }
  const [showPostCreateCoreTypes, setShowPostCreateCoreTypes] = useState(false);
  const [postCreateSubmitting, setPostCreateSubmitting] = useState(false);
  const [productPriceMatrices, setProductPriceMatrices] = useState({});//newly added

  // ─────────────────────────────────────────
  // Fetch
  // ─────────────────────────────────────────
  const fetchData = async () => {
    try {
      const [catRes, coreRes, varTypeRes, prodRes] = await Promise.all([
        getCategories(),
        getCoreTypes(),
        getVariantTypes(),
        getProducts(),
      ]);

      const extract = (res, ...keys) => {
        for (const k of keys) if (res.data?.[k]) return res.data[k];
        return Array.isArray(res.data) ? res.data : [];
      };

      const categories = extract(catRes, "data", "categories");
      const coreTypes = extract(coreRes, "data", "core_types");
      const varTypes = extract(varTypeRes, "data", "variant_types");
      const products = extract(prodRes, "data", "products");

      setDbCategories(categories);
      setDbCoreTypes(coreTypes);
      setVariantTypes(varTypes);
      setAllProducts(products);
      console.log("Products sample:", products[0]);
      console.log("has_core_types value:", products[0]?.has_core_types);
      console.log("productsWithCores count:", products.filter(p => p.has_core_types).length);

      // Fetch price matrices for products that have core types
      const productsWithCores = products.filter((p) => p.has_core_types);
      const matrixResults = await Promise.all(
        productsWithCores.map((p) =>
          getProductPriceMatrix(p.id)
            .then((res) => ({ id: p.id, data: res.data }))
            .catch(() => ({ id: p.id, data: null }))
        )
      );

      const matrices = {};
      for (const { id, data } of matrixResults) {
        if (!data) continue;
        const coreTypesForProduct = data.core_types || [];
        const prices = data.prices || {};
        matrices[id] = coreTypesForProduct
          .filter((ct) => prices[ct.code]?.exists === true)
          .map((ct) => ({
            id: ct.id,
            name: ct.display_name || ct.name,
            code: ct.code,
            price: prices[ct.code]?.price,
            coil_length: prices[ct.code]?.coil_length,
          }));
      }
      setProductPriceMatrices(matrices);

    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ─────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────
  const handleProductFieldChange = (field, value) =>
    setNewProduct((prev) => ({ ...prev, [field]: value }));

  const handleReset = () => {
    setSelectedCategory("");
    setSelectedCable("");
    setSelectedSubCategory("");
    setNewProduct(EMPTY_PRODUCT);
    setIsManualCategory(false);
    setSelectedVariantType("");
    setSelectedVariantOption("");
    setVariantOptions([]);
    setCoreEntries([]);
    setNewCoreName("");
    setShowAddCore(false);
    setJustCreatedProduct(null);         // ← ADD
    setShowPostCreateCoreTypes(false);   // ← ADD
    setPostCreateSubmitting(false);      // ← ADD
  };

  // ─────────────────────────────────────────
  // Category helpers
  // ─────────────────────────────────────────
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedCable("");
    setSelectedSubCategory("");
    setCoreEntries([]);
  };

  // ─────────────────────────────────────────
  // Core entries helpers
  // ─────────────────────────────────────────
  const addCoreEntry = () => {
    const trimmed = newCoreName.trim();
    if (!trimmed) return;
    setCoreEntries((prev) => [
      ...prev,
      { localId: uid(), name: trimmed, price: "", coil_length: "" },
    ]);
    setNewCoreName("");
    setShowAddCore(false);
  };

  const removeCoreEntry = (localId) =>
    setCoreEntries((prev) => prev.filter((e) => e.localId !== localId));

  const updateCoreEntry = (localId, field, value) =>
    setCoreEntries((prev) =>
      prev.map((e) => (e.localId === localId ? { ...e, [field]: value } : e))
    );

  // ─────────────────────────────────────────
  // Variant helpers
  // ─────────────────────────────────────────
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
      const filtered = opts.filter((opt) =>
        opt.variant_type
          ? String(opt.variant_type.id) === String(value)
          : String(opt.variant_type_id) === String(value)
      );
      const selectedTypeObj = variantTypes.find(
        (vt) => String(vt.id) === String(value) || vt.name === value
      );
      if (selectedTypeObj?.name?.toLowerCase().includes("color")) {
        setVariantOptions([
          { id: "black", name: "Black" },
          { id: "red", name: "Red" },
          { id: "blue", name: "Blue" },
          { id: "yellow", name: "Yellow" },
          { id: "green", name: "Green" },
          { id: "white", name: "White" },
          { id: "grey", name: "Grey" },
          { id: "yellow_green", name: "Yellow/Green" },
          { id: "brown", name: "Brown" },
        ]);
      } else {
        setVariantOptions(filtered);
      }
    } catch (err) {
      console.error("Error fetching variant options:", err);
    }
  };

  // ─────────────────────────────────────────
  // Cable select (Edit mode)
  // ─────────────────────────────────────────
  const handleCableSelect = async (productId) => {
    setSelectedCable(productId);
    const p = allProducts.find((x) => String(x.id) === String(productId));
    if (!p) return;

    setNewProduct({
      name: p.name || "",
      description: p.description || "",
      size: p.size || "",
      construction: p.construction || "",
      material: p.material || "",
      gauge: p.gauge || "",
      voltage_rating: p.voltage_rating || "",
      uom: p.uom || "MTR",
      base_price: p.base_price || "",
      coil_length: p.coil_length || "",
      category_name: p.category?.name || dbCategories.find((c) => String(c.id) === String(p.category_id))?.name || "",
      category_code: p.category?.code || "",
    });

    // Set category
    const catObj = p.category || dbCategories.find((c) => String(c.id) === String(p.category_id));
    if (catObj) setSelectedCategory(catObj.name);

    // Fetch price matrix separately
    try {
      const res = await getProductPriceMatrix(productId);
      const coreTypes = res.data?.core_types || [];
      const prices = res.data?.prices || {};

      // Only include core types that have a price set (exists: true)
      const entries = coreTypes
        .filter((ct) => prices[ct.code]?.exists === true)
        .map((ct) => ({
          localId: uid(),
          name: ct.display_name || ct.name,
          dbId: String(ct.id),
          price: String(prices[ct.code]?.price || ""),
          coil_length: String(prices[ct.code]?.coil_length || p.coil_length || ""),
        }));

      setCoreEntries(entries);
    } catch (err) {
      console.error("Failed to fetch price matrix:", err);
      setCoreEntries([]);
    }
  };

  // ─────────────────────────────────────────
  // Resolve or create a DB core_type by name
  // Match ONLY by exact name — never by generated code.
  // This prevents "2/C PVC" reusing the seeded "2_core" record.
  // Every distinct label gets its own DB record so the dropdown
  // in CreateQuotation shows exactly what was typed here.
  // ─────────────────────────────────────────
  const resolveOrCreateCoreType = async (name) => {
    const nameLower = name.trim().toLowerCase();
    const existing = dbCoreTypes.find(
      (ct) =>
        ct.name?.trim().toLowerCase() === nameLower ||
        ct.display_name?.trim().toLowerCase() === nameLower
    );
    if (existing) return existing.id;

    // Always create a new record with a unique code so the exact name is preserved
    const uniqueCode = generateCode(name) + "_" + Date.now();
    try {
      const res = await createCoreType({
        name: name.trim(),
        display_name: name.trim(),
        code: uniqueCode,
      });
      const created = res.data?.data || res.data?.core_type || res.data;
      // Refresh local cache so subsequent lookups find the new record
      await fetchData();
      return created?.id || null;
    } catch (err) {
      console.warn("Core type creation failed:", err);
      // Race condition: someone else created it — re-fetch and match by exact name
      const freshRes = await getCoreTypes();
      const fresh = freshRes.data?.data || freshRes.data?.core_types || (Array.isArray(freshRes.data) ? freshRes.data : []);
      setDbCoreTypes(fresh);
      const nameLower = name.trim().toLowerCase();
      const found = fresh.find(
        (ct) =>
          ct.name?.trim().toLowerCase() === nameLower ||
          ct.display_name?.trim().toLowerCase() === nameLower
      );
      return found?.id || null;
    }
  };

  // ─────────────────────────────────────────
  // Resolve or create a DB category
  // ─────────────────────────────────────────
  const resolveOrCreateCategory = async (categoryName, categoryCode) => {
    const inputCode = categoryCode
      ? categoryCode.trim().replace(/\s+/g, "_")
      : generateCode(categoryName);

    const existing = dbCategories.find(
      (c) =>
        generateCode(c.name) === generateCode(categoryName) ||
        (c.code && c.code === inputCode)
    );
    if (existing) return existing.id;

    try {
      const res = await createCategory({
        name: categoryName,
        display_name: categoryName,
        code: inputCode || `cat_${Date.now()}`,
      });
      return (
        res.data?.data?.id ||
        res.data?.id ||
        res.data?.category?.id ||
        null
      );
    } catch (err) {
      if (
        err.response?.status === 422 &&
        JSON.stringify(err.response.data).match(/taken|exists/i)
      ) {
        const fresh = await getCategories();
        const cats =
          fresh.data?.data ||
          fresh.data?.categories ||
          (Array.isArray(fresh.data) ? fresh.data : []);
        setDbCategories(cats);
        const found = cats.find(
          (c) => generateCode(c.name) === inputCode || c.code === inputCode
        );
        if (found) return found.id;
      }
      throw err;
    }
  };

  // ─────────────────────────────────────────
  // Save
  // ─────────────────────────────────────────
  const handleSave = async () => {
    if (mode === "add") {
      if (!newProduct.name || !newProduct.category_name) {
        alert("Product Name and Category Name are required");
        return;
      }
      if (!newProduct.base_price || parseFloat(newProduct.base_price) <= 0) {
        alert("Base Price is required before adding a product.");
        return;
      }
      setSubmitting(true);
      try {
        const categoryId = await resolveOrCreateCategory(
          newProduct.category_name,
          newProduct.category_code
        );
        if (!categoryId) throw new Error("Could not determine Category ID");

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
          formation: newProduct.gauge,
          voltage_rating: newProduct.voltage_rating,
          uom: newProduct.uom,
          base_price: parseFloat(newProduct.base_price) || 0,
          coil_length: parseFloat(newProduct.coil_length) || 0,
          variant_type_id: selectedVariantType || undefined,
          variant_option_id: selectedVariantOption || undefined,
          color: variantTypes
            .find(
              (vt) =>
                String(vt.id) === String(selectedVariantType) ||
                vt.name === selectedVariantType
            )
            ?.name?.toLowerCase()
            .includes("color")
            ? selectedVariantOption || undefined
            : undefined,
          is_active: true,
        };

        console.log("Creating product:", productData);
        const res = await createProduct(productData);
        const createdProduct = res.data?.product || res.data?.data || res.data;
        const newProductId = createdProduct?.id;

        // Check success: explicit flag, HTTP 2xx with an ID, or message containing "success"
        const isSuccess =
          res.data.success ||
          res.data.data?.success ||
          (res.status >= 200 && res.status < 300 && newProductId) ||
          (res.data.message && res.data.message.toLowerCase().includes("success"));

        if (isSuccess && newProductId) {
          // Product saved — now offer core type entry
          alert(`Product "${newProduct.name}" created successfully!`);
          setJustCreatedProduct({
            id: newProductId,
            name: newProduct.name,
            base_price: newProduct.base_price,
          });
          // Pre-fill first core entry with base_price so user can rename it
          setCoreEntries([
            {
              localId: uid(),
              name: "",
              price: newProduct.base_price,
              coil_length: newProduct.coil_length || "",
            },
          ]);
          setShowPostCreateCoreTypes(true);
          fetchData();
        } else {
          alert(
            "Failed to add product: " +
              (res.data.message || res.data.data?.message || "Unknown error")
          );
        }
      } catch (err) {
        console.error("Error in add flow:", err);
        let msg = err.message;
        if (err.response?.data) {
          const d = err.response.data;
          msg =
            d.message ||
            Object.values(d.errors || {}).flat().join(" ") ||
            JSON.stringify(d);
        }
        alert("Failed to process request: " + msg);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // ── Edit mode ──────────────────────────
    if (!selectedCable) {
      alert("Please select a cable to edit");
      return;
    }
    setSubmitting(true);
    try {
      const selectedCableData = allProducts.find(
        (p) => String(p.id) === String(selectedCable)
      );
      if (!selectedCableData?.id) {
        alert("Could not identify the database product to update.");
        return;
      }

      let categoryId = selectedCableData.category_id;
      const currentCatName =
        selectedCableData.category?.name ||
        dbCategories.find((c) => String(c.id) === String(selectedCableData.category_id))?.name;

      if (newProduct.category_name && newProduct.category_name !== currentCatName) {
        categoryId = await resolveOrCreateCategory(
          newProduct.category_name,
          newProduct.category_code
        );
      }

      // Build price_matrix
      const priceMatrixEntries = [];
      for (const entry of coreEntries) {
        if (!entry.name || !(parseFloat(entry.price) > 0)) continue;
        const coreTypeId = entry.dbId || (await resolveOrCreateCoreType(entry.name));
        if (!coreTypeId) {
          alert(`Failed to resolve core type: ${entry.name}`);
          return;
        }
        priceMatrixEntries.push({
          core_type_id: parseInt(coreTypeId),
          price: parseFloat(entry.price) || 0,
          coil_length:
            parseFloat(entry.coil_length) ||
            parseFloat(newProduct.coil_length) ||
            0,
        });
      }

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
        base_price:
          priceMatrixEntries.length > 0
            ? priceMatrixEntries[0].price
            : parseFloat(newProduct.base_price) || 0,
        coil_length: parseFloat(newProduct.coil_length) || 0,
        price_matrix: priceMatrixEntries,
      };

      console.log("Updating product:", selectedCableData.id, productData);
      const res = await updateProduct(selectedCableData.id, productData);
      if (res.data.success) {
        alert("Product updated successfully!");
        fetchData();
        handleReset();
      } else {
        alert("Failed to update: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error saving:", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────
  // Delete
  // ─────────────────────────────────────────
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setSubmitting(true);
      await deleteProduct(id);
      alert("Product deleted successfully");
      fetchData();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };
    // ─────────────────────────────────────────
  // Save price matrix against already-created product
  // ─────────────────────────────────────────
  const handlePostCreatePriceMatrix = async () => {
    console.log("DEBUG justCreatedProduct:", justCreatedProduct);  // ← ADD
    console.log("DEBUG coreEntries:", coreEntries);                // ← ADD
    if (!justCreatedProduct?.id) return;

    const validEntries = coreEntries.filter(
      (e) => e.name.trim() && parseFloat(e.price) > 0
    );
    if (validEntries.length === 0) {
      alert("Please add at least one core type with a name and price.");
      return;
    }

    setPostCreateSubmitting(true);
    try {
      const priceMatrixEntries = [];
      for (const entry of validEntries) {
        const coreTypeId =
          entry.dbId || (await resolveOrCreateCoreType(entry.name));
        if (!coreTypeId) {
          alert(`Failed to resolve core type: ${entry.name}`);
          return;
        }
        priceMatrixEntries.push({
          core_type_id: parseInt(coreTypeId),
          price: parseFloat(entry.price) || 0,
          coil_length:
            parseFloat(entry.coil_length) ||
            parseFloat(newProduct.coil_length) ||
            0,
        });
      }
      ////////////
      await setProductPriceMatrix(justCreatedProduct.id, { prices: priceMatrixEntries });

      // Sync first core type name and price back to the product
      const firstEntry = validEntries[0];
      await updateProduct(justCreatedProduct.id, {
        name: newProduct.name,
        description: newProduct.description,
        size: newProduct.size,
        construction: newProduct.construction,
        material: newProduct.material,
        gauge: newProduct.gauge,
        voltage_rating: newProduct.voltage_rating,
        uom: newProduct.uom,
        coil_length: parseFloat(newProduct.coil_length) || 0,
        core_type: firstEntry.name,
        base_price: parseFloat(firstEntry.price),
      });

      alert("Core types saved successfully!");
      handleReset();
      fetchData();
    } catch (err) {
      console.error("Price matrix error:", err);
      alert(
        "Failed to save core types: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setPostCreateSubmitting(false);
    }
  };

  // ─────────────────────────────────────────
  // Filtered products for table
  // ─────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allProducts.filter((p) => {
      const catName =
        p.category?.name ||
        dbCategories.find((c) => String(c.id) === String(p.category_id))?.name ||
        "";
      return (
        p.name?.toLowerCase().includes(q) || catName.toLowerCase().includes(q)
      );
    });
  }, [allProducts, dbCategories, searchQuery]);

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────
  const isColorVariant = variantTypes
    .find(
      (vt) =>
        String(vt.id) === String(selectedVariantType) ||
        vt.name === selectedVariantType
    )
    ?.name?.toLowerCase()
    .includes("color");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Cable Prices</h1>
          <p className="text-gray-400">
            Edit existing cable prices or add new cables to the database
          </p>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => { setMode("edit"); handleReset(); }}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === "edit" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Edit Existing Cable
            </button>
            <button
              onClick={() => { setMode("add"); handleReset(); }}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === "add" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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

            {/* ── Category ── */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {mode === "add" ? "Category Name *" : "Select Cable Category"}
              </label>
              {mode === "add" ? (
                !isManualCategory ? (
                  <select
                    value={newProduct.category_name}
                    onChange={(e) => {
                      if (e.target.value === "__MANUAL__") {
                        setIsManualCategory(true);
                        handleProductFieldChange("category_name", "");
                        handleProductFieldChange("category_code", "");
                      } else {
                        handleProductFieldChange("category_name", e.target.value);
                      }
                    }}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {dbCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                    <option value="__MANUAL__">+ Add New Category</option>
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={newProduct.category_name}
                      onChange={(e) => handleProductFieldChange("category_name", e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
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
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {dbCategories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Category Code (manual add only) */}
            {mode === "add" && isManualCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category Code *
                </label>
                <input
                  type="text"
                  value={newProduct.category_code}
                  onChange={(e) => handleProductFieldChange("category_code", e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., BW_001"
                />
              </div>
            )}

            {/* ── Products Table (Edit Mode) ── */}
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
                        <th className="px-3 py-3 font-semibold">Core Types</th>
                        <th className="px-3 py-3 font-semibold">Material</th>
                        <th className="px-3 py-3 font-semibold">Construction</th>
                        <th className="px-3 py-3 font-semibold">Voltage</th>
                        <th className="px-3 py-3 font-semibold text-right">Prices (Rs.)</th>
                        <th className="px-3 py-3 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredProducts.map((p) => {
                        const matrix = productPriceMatrices[p.id] || [];
                        const hasMatrix = matrix.length > 0;
                        const catName =
                          p.category?.name ||
                          dbCategories.find((c) => String(c.id) === String(p.category_id))?.name ||
                          "N/A";
                        const isSelected = String(selectedCable) === String(p.id);
                        return (
                          <tr
                            key={p.id}
                            className={`hover:bg-gray-700/30 transition-colors ${isSelected ? "bg-blue-500/10" : ""}`}
                          >
                            <td className="px-3 py-3 text-gray-400">{catName}</td>
                            <td className="px-3 py-3 font-medium text-gray-200">{p.name}</td>
                            <td className="px-3 py-3 text-gray-400">
                              {hasMatrix ? (
                                <div className="flex flex-wrap gap-1">
                                  {matrix.map((m, idx) => (
                                    <span key={idx} className="bg-gray-700 px-1.5 py-0.5 rounded text-[10px]">
                                      {m.name}
                                    </span>
                                  ))}
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
                                  {matrix.map((m, idx) => (
                                    <div key={idx} className="whitespace-nowrap">
                                      <span className="text-[10px] text-gray-500 mr-1">{m.name}:</span>
                                      <span className="text-gray-200">
                                        {(parseFloat(m.price) || 0).toLocaleString()}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-200 font-semibold">
                                  {(parseFloat(p.base_price) || 0).toLocaleString()}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleCableSelect(String(p.id))}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isSelected
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-700 text-blue-400 hover:bg-gray-600"
                                  }`}
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
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan="8" className="px-4 py-8 text-center text-gray-500 italic">
                            No products found in database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Product Detail Form (Add or Edit with selection) ── */}
            {(mode === "add" || (mode === "edit" && selectedCable)) && (
              <>
                <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6">
                    {mode === "edit" ? "Edit Product Details" : "New Product Details"}
                  </h3>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => handleProductFieldChange("name", e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1.0mm² Solid Building Wire"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <input
                    type="text"
                    value={newProduct.description}
                    onChange={(e) => handleProductFieldChange("description", e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1.0mm² Solid Copper Building Wire 450/750V"
                  />
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
                  <input
                    type="text"
                    value={newProduct.size}
                    onChange={(e) => handleProductFieldChange("size", e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1.0mm²"
                  />
                </div>

                {/* Construction */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Construction</label>
                  <input
                    type="text"
                    value={newProduct.construction}
                    onChange={(e) => handleProductFieldChange("construction", e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Solid or Stranded"
                  />
                </div>

                {/* Material */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Material</label>
                  <input
                    type="text"
                    value={newProduct.material}
                    onChange={(e) => handleProductFieldChange("material", e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Copper/PVC"
                  />
                </div>

                {/* Gauge */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gauge</label>
                  <input
                    type="text"
                    value={newProduct.gauge}
                    onChange={(e) => handleProductFieldChange("gauge", e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1/1.13 mm"
                  />
                </div>

                {/* Voltage Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Voltage Rating</label>
                  <input
                    type="text"
                    value={newProduct.voltage_rating}
                    onChange={(e) => handleProductFieldChange("voltage_rating", e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 450/750V"
                  />
                </div>

                {/* UOM */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Unit of Measure *</label>
                  <select
                    value={newProduct.uom}
                    onChange={(e) => handleProductFieldChange("uom", e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MTR">MTR (Meter)</option>
                    <option value="RFT">RFT (Running Foot)</option>
                    <option value="UNIT">UNIT</option>
                  </select>
                </div>

                {/* Variant Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Variant Type</label>
                  <select
                    value={selectedVariantType}
                    onChange={(e) => handleVariantTypeChange(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">None</option>
                    {variantTypes.map((vt) => (
                      <option key={vt.id || vt.name} value={vt.id || vt.name}>
                        {vt.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Variant Option (color) */}
                {selectedVariantType && isColorVariant && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Color</label>
                    <select
                      value={selectedVariantOption}
                      onChange={(e) => setSelectedVariantOption(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select color</option>
                      {variantOptions.map((opt) => (
                        <option key={opt.id || opt.name} value={opt.id || opt.name}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Coil Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Coil Length (meters)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.coil_length}
                    onChange={(e) => handleProductFieldChange("coil_length", e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 90"
                  />
                </div>

                {/* ─── Core Types & Prices (Edit mode only — in Add mode, core types are added after product creation) ─── */}
                {mode === "edit" && (
                <div className="md:col-span-2">
                  <div className="border border-blue-500/30 rounded-xl p-5 bg-blue-500/5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-md font-semibold text-blue-300">
                        Core Types &amp; Prices
                      </h4>
                      <span className="text-xs text-gray-400">
                        Each cable can have its own custom core type names
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mb-4">
                      Add core types specific to this cable (e.g. "2_core", "2/C PVC", "3.5/C XLPE"). Each gets its own price.
                      Leave empty to use a single base price instead.
                    </p>

                    {/* Existing core entries */}
                    {coreEntries.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {coreEntries.map((entry) => (
                          <div
                            key={entry.localId}
                            className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-700/60 p-3 rounded-lg border border-gray-600"
                          >
                            {/* Core name */}
                            <div className="flex-1 min-w-[140px]">
                              <label className="block text-[10px] text-gray-400 mb-1">Core Type Name</label>
                              <input
                                type="text"
                                value={entry.name}
                                onChange={(e) =>
                                  updateCoreEntry(entry.localId, "name", e.target.value)
                                }
                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., 2/C PVC"
                              />
                            </div>

                            {/* Price */}
                            <div className="flex-1 min-w-[120px]">
                              <label className="block text-[10px] text-gray-400 mb-1">Price (Rs.)</label>
                              <div className="relative">
                                <span className="absolute left-2 top-2 text-gray-400 text-xs">Rs.</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={entry.price}
                                  onChange={(e) =>
                                    updateCoreEntry(entry.localId, "price", e.target.value)
                                  }
                                  className="w-full pl-8 p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-blue-500"
                                  placeholder="0"
                                />
                              </div>
                            </div>

                            {/* Coil Length (per core) */}
                            <div className="flex-1 min-w-[120px]">
                              <label className="block text-[10px] text-gray-400 mb-1">Coil Length (m)</label>
                              <input
                                type="number"
                                min="0"
                                value={entry.coil_length}
                                onChange={(e) =>
                                  updateCoreEntry(entry.localId, "coil_length", e.target.value)
                                }
                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-blue-500"
                                placeholder={newProduct.coil_length || "0"}
                              />
                            </div>

                            {/* Remove */}
                            <button
                              type="button"
                              onClick={() => removeCoreEntry(entry.localId)}
                              className="mt-4 sm:mt-5 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                              title="Remove core type"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add new core entry */}
                    {showAddCore ? (
                      <div className="flex gap-2 items-center bg-gray-700/40 p-3 rounded-lg border border-dashed border-blue-500/40">
                        <input
                          type="text"
                          value={newCoreName}
                          onChange={(e) => setNewCoreName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") addCoreEntry(); if (e.key === "Escape") { setShowAddCore(false); setNewCoreName(""); } }}
                          autoFocus
                          className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter core type name, e.g. 2/C PVC or 3.5/C XLPE"
                        />
                        <button
                          type="button"
                          onClick={addCoreEntry}
                          disabled={!newCoreName.trim()}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors disabled:opacity-50"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowAddCore(false); setNewCoreName(""); }}
                          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAddCore(true)}
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors mt-1"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Core Type
                      </button>
                    )}

                    {coreEntries.length > 0 && (
                      <p className="text-blue-400 text-xs mt-3">
                        {coreEntries.length} core type(s) configured
                      </p>
                    )}
                  </div>
                </div>
                )}

                {/* Base Price — always visible in add mode; in edit mode, only when no core entries */}
                {(mode === "add" || coreEntries.length === 0) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Base Price (Rs.) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400 text-sm">Rs.</span>
                      <input
                        type="number"
                        min="0"
                        value={newProduct.base_price}
                        onChange={(e) => handleProductFieldChange("base_price", e.target.value)}
                        className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter base price"
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      {mode === "add"
                        ? "Set the base price. You can optionally add core types with different prices after saving."
                        : "Set a single base price since no core types are configured."}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Action Buttons ── */}
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

        {/* ── Info Panel ── */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <p className="text-gray-300">
                <span className="font-medium">Edit Mode:</span> Select a product from the table to load its details and update prices.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <p className="text-gray-300">
                <span className="font-medium">Add Mode:</span> Fill in product details and add one or more core types with individual prices.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
              <p className="text-gray-300">
                <span className="font-medium">Core Types:</span> Each cable can have completely custom core type names — no ID conflicts.
                Names like "2_core" and "2/C PVC" can co-exist across different cables.
              </p>
            </div>
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                ⚠️ Note: Price changes will affect all future quotations. Make sure to enter correct prices.
              </p>
            </div>
          </div>

          {/* Current Selection Summary */}
          {(selectedCategory || mode === "add") && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="text-md font-semibold text-white mb-3">Current Selection</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Mode</p>
                  <p className="text-white font-medium">{mode === "edit" ? "Editing" : "Adding New"}</p>
                </div>
                {selectedCategory && (
                  <div>
                    <p className="text-gray-400 text-sm">Category</p>
                    <p className="text-white font-medium">{selectedCategory}</p>
                  </div>
                )}
                {mode === "add" && newProduct.category_name && (
                  <div>
                    <p className="text-gray-400 text-sm">Category</p>
                    <p className="text-white font-medium">{newProduct.category_name}</p>
                  </div>
                )}
                {mode === "edit" && selectedCable && (
                  <div className="md:col-span-3">
                    <p className="text-gray-400 text-sm">Selected Product ID</p>
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
        {/* ── Post-Create: Add Core Types Panel ── */}
        {showPostCreateCoreTypes && justCreatedProduct && (
          <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-green-500/40">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <h3 className="text-lg font-bold text-green-400">
                ✅ Product "{justCreatedProduct.name}" created successfully!
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Do you want to add core types against this product? The first core type's
              price is pre-filled from the base price (
              <span className="text-white font-medium">
                Rs. {justCreatedProduct.base_price}
              </span>
              ). You can rename it and add more below.
            </p>

            {/* Core entries */}
            <div className="space-y-3 mb-4">
              {coreEntries.map((entry, idx) => (
                <div
                  key={entry.localId}
                  className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-700/60 p-3 rounded-lg border border-gray-600"
                >
                  {idx === 0 && (
                    <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                      1st core = base price
                    </span>
                  )}
                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-[10px] text-gray-400 mb-1">
                      Core Type Name
                    </label>
                    <input
                      type="text"
                      value={entry.name}
                      onChange={(e) =>
                        updateCoreEntry(entry.localId, "name", e.target.value)
                      }
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-green-500"
                      placeholder="e.g., 2/C PVC"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[10px] text-gray-400 mb-1">
                      Price (Rs.)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-2 text-gray-400 text-xs">
                        Rs.
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={entry.price}
                        onChange={(e) =>
                          updateCoreEntry(entry.localId, "price", e.target.value)
                        }
                        className="w-full pl-8 p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-green-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[10px] text-gray-400 mb-1">
                      Coil Length (m)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={entry.coil_length}
                      onChange={(e) =>
                        updateCoreEntry(entry.localId, "coil_length", e.target.value)
                      }
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-green-500"
                      placeholder="0"
                    />
                  </div>
                  {coreEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCoreEntry(entry.localId)}
                      className="mt-4 sm:mt-5 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add another core entry */}
            {showAddCore ? (
              <div className="flex gap-2 items-center bg-gray-700/40 p-3 rounded-lg border border-dashed border-green-500/40 mb-4">
                <input
                  type="text"
                  value={newCoreName}
                  onChange={(e) => setNewCoreName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addCoreEntry();
                    if (e.key === "Escape") { setShowAddCore(false); setNewCoreName(""); }
                  }}
                  autoFocus
                  className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-green-500"
                  placeholder="e.g., 3/C XLPE"
                />
                <button
                  type="button"
                  onClick={addCoreEntry}
                  disabled={!newCoreName.trim()}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors disabled:opacity-50"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddCore(false); setNewCoreName(""); }}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddCore(true)}
                className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors mb-6"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Another Core Type
              </button>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-end border-t border-gray-700 pt-4">
              <button
                type="button"
                onClick={() => { handleReset(); }}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Skip — No Core Types
              </button>
              <button
                type="button"
                onClick={handlePostCreatePriceMatrix}
                disabled={postCreateSubmitting}
                className={`px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors ${
                  postCreateSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {postCreateSubmitting ? "Saving..." : "Save Core Types"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;


//////////////////////////////////////
////////////////////////////////////////////