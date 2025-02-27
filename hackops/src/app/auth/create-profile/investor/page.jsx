"use client";
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "@/api/lib/firebaseConfig"; // Adjust the path if needed

function ProfileForm({ role = "startup", onSubmit }) {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Initialize Firebase Storage (using the default app)
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setError("You must be signed in to create a profile.");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `logos/${file.name}-${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData((prev) => ({ ...prev, logo: url }));
    } catch (err) {
      setError("Failed to upload logo");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be signed in to create a profile.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Include the authenticated user's UID in the request
      const response = await fetch("/api/create-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, role, ...formData }),
      });
      if (!response.ok) {
        throw new Error("Failed to create profile");
      }
      if (onSubmit) {
        onSubmit(await response.json());
      }
    } catch (err) {
      setError("Failed to create profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startupFields = [
    { name: "companyName", label: "Company Name", type: "text", required: true },
    {
      name: "industry",
      label: "Industry",
      type: "select",
      required: true,
      options: ["SaaS", "Fintech", "Healthcare", "E-commerce", "AI/ML", "Other"],
    },
    {
      name: "fundingStage",
      label: "Funding Stage",
      type: "select",
      required: true,
      options: ["Pre-seed", "Seed", "Series A", "Series B", "Series C+"],
    },
    { name: "location", label: "Location", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "businessModel", label: "Business Model", type: "text", required: true },
    {
      name: "revenueRange",
      label: "Revenue Range",
      type: "select",
      required: true,
      options: ["Pre-revenue", "$0-100K", "$100K-1M", "$1M-10M", "$10M+"],
    },
    { name: "teamSize", label: "Team Size", type: "number", required: true },
    { name: "foundingDate", label: "Founding Date", type: "date", required: true },
    { name: "website", label: "Website", type: "url", required: true },
  ];

  const investorFields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "firmName", label: "Firm Name", type: "text", required: true },
    {
      name: "preferredIndustries",
      label: "Preferred Industries",
      type: "select",
      multiple: true,
      required: true,
      options: ["SaaS", "Fintech", "Healthcare", "E-commerce", "AI/ML", "Other"],
    },
    {
      name: "checkSize",
      label: "Check Size Range",
      type: "select",
      required: true,
      options: ["$0-250K", "$250K-1M", "$1M-5M", "$5M+"],
    },
    {
      name: "preferredStages",
      label: "Preferred Stages",
      type: "select",
      multiple: true,
      required: true,
      options: ["Pre-seed", "Seed", "Series A", "Series B", "Series C+"],
    },
    {
      name: "investmentThesis",
      label: "Investment Thesis",
      type: "textarea",
      required: true,
    },
    { name: "location", label: "Location", type: "text", required: true },
  ];

  const fields = role === "startup" ? startupFields : investorFields;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6 rounded-xl bg-white p-8 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {role === "startup" ? "Startup Profile" : "Investor Profile"}
        </h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Logo</label>
        <div className="mt-2 flex items-center gap-4">
          {formData.logo && (
            <img src={formData.logo} alt="Logo preview" className="h-16 w-16 rounded-lg object-cover" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="rounded-lg border text-black border-gray-200 px-4 py-2"
          />
        </div>
      </div>

      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{field.label}</label>
          <div className="overflow-hidden text-black rounded-lg border border-gray-200 bg-white focus-within:border-[#357AFF] focus-within:ring-1 focus-within:ring-[#357AFF]">
            {field.type === "select" ? (
              <select
                name={field.name}
                required={field.required}
                multiple={field.multiple}
                onChange={handleInputChange}
                className="w-full text-black px-4 py-3 text-lg outline-none"
              >
                <option value="">{`Select ${field.label}`}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                name={field.name}
                required={field.required}
                onChange={handleInputChange}
                className="w-full text-black px-4 py-3 text-lg outline-none"
                rows={4}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                required={field.required}
                onChange={handleInputChange}
                className="w-full text-black px-4 py-3 text-lg outline-none"
              />
            )}
          </div>
        </div>
      ))}

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full rounded-lg bg-[#357AFF] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#2E69DE] focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2 disabled:opacity-50"
      >
        {loading || uploading ? "Loading..." : "Create Profile"}
      </button>
    </form>
  );
}

function ProfileFormStory() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="w-full max-w-2xl">
        <h3 className="mb-4 text-xl font-semibold">Investor Profile Form</h3>
        <ProfileForm role="startup" onSubmit={console.log} />
      </div>

      <div className="w-full max-w-2xl">
        <h3 className="mb-4 text-xl font-semibold">Investor Profile Form</h3>
        <ProfileForm role="investor" onSubmit={console.log} />
      </div>
    </div>
  );
}

export default ProfileForm;
