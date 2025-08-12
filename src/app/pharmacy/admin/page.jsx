"use client";

import PharmaFooter from "@/components/pharmacyFooter";
import PharmaNavbar from "@/components/pharmacyNav";
import { useUser } from "@/context/userContext";
import { useState } from "react";

export default function AddMedicinePage() {
    const [form, setForm] = useState({
        name: "",
        category: "Antibiotic",
        description: [""],
        price: "",
        stock: "",
    });

    const { user } = useUser();

    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (index, value) => {
        const newDesc = [...form.description];
        newDesc[index] = value;
        setForm((prev) => ({ ...prev, description: newDesc }));
    };

    const addDescriptionField = () => {
        setForm((prev) => ({ ...prev, description: [...prev.description, ""] }));
    };

    const removeDescriptionField = (index) => {
        setForm((prev) => ({
            ...prev,
            description: prev.description.filter((_, i) => i !== index),
        }));
    };

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files) return;

        setUploading(true);
        for (let file of files) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    const errText = await res.text();
                    alert("Upload failed: " + errText);
                    continue;
                }

                const data = await res.json();
                if (data.url) {
                    setImages((prev) => [...prev, data.url]);
                }
            } catch (err) {
                alert("Error uploading image: " + err.message);
            }
        }
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
            image: images,
        };

        try {
            const res = await fetch("/api/medicines/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Medicine added successfully!");
                setForm({
                    name: "",
                    category: "Antibiotic",
                    description: [""],
                    price: "",
                    stock: "",
                });
                setImages([]);
            } else {
                alert(data.error || "Failed to add medicine");
            }
        } catch (err) {
            alert("Error submitting form: " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <PharmaNavbar user={user} />
            <div className="flex justify-center py-10">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl"
                >
                    <h1 className="text-2xl font-bold mb-4 text-blue-600">
                        Add New Medicine
                    </h1>

                    {/* Name */}
                    <label className="block mb-2 font-semibold">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="border p-2 rounded w-full mb-4"
                        required
                    />

                    {/* Category */}
                    <label className="block mb-2 font-semibold">Category</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="border p-2 rounded w-full mb-4"
                    >
                        <option>Antibiotic</option>
                        <option>Painkiller</option>
                        <option>Antipyretic</option>
                        <option>Vaccine</option>
                        <option>Antiseptic</option>
                        <option>Antifungal</option>
                        <option>Antiviral</option>
                        <option>Antidepressant</option>
                        <option>Antihistamine</option>
                        <option>Antacid</option>
                        <option>Antimalarial</option>
                        <option>Cough & Cold</option>
                        <option>Diabetes Medication</option>
                        <option>Blood Pressure Medication</option>
                        <option>Cardiac Medication</option>
                        <option>Vitamins & Supplements</option>
                        <option>Eye Drops</option>
                        <option>Skin Ointment</option>
                        <option>Hormonal Therapy</option>
                        <option>Immunosuppressant</option>
                        <option>Respiratory Medication</option>
                    </select>

                    {/* Description */}
                    <label className="block mb-2 font-semibold">Description</label>
                    {form.description.map((desc, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={desc}
                                onChange={(e) =>
                                    handleDescriptionChange(idx, e.target.value)
                                }
                                className="border p-2 rounded w-full"
                                placeholder={`Description ${idx + 1}`}
                            />
                            {idx > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeDescriptionField(idx)}
                                    className="px-2 bg-red-500 text-white rounded"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addDescriptionField}
                        className="text-blue-600 mb-4"
                    >
                        + Add More Description
                    </button>

                    {/* Price */}
                    <label className="block mb-2 font-semibold">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        className="border p-2 rounded w-full mb-4"
                        required
                    />

                    {/* Stock */}
                    <label className="block mb-2 font-semibold">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        className="border p-2 rounded w-full mb-4"
                    />

                    {/* Image Upload */}
                    <label className="block mb-2 font-semibold">Images</label>
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                        {images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`medicine-${idx}`}
                                className="w-20 h-20 object-cover rounded"
                            />
                        ))}
                        <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-blue-400 rounded cursor-pointer text-blue-500 hover:bg-blue-50">
                            +
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                multiple
                            />
                        </label>
                    </div>
                    {uploading && (
                        <p className="text-sm text-gray-500">Uploading...</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        disabled={uploading}
                    >
                        Add Medicine
                    </button>
                </form>
            </div>
            <PharmaFooter/>
        </div>
    );
}
