import React, { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setAdminData(data.admin);
        }
      } catch (err) {
        console.error("Error fetching admin:", err);
      }
    };
    fetchAdmin();
  }, []);

  const handleEditClick = () => {
    setShowPasswordCheck(true);
  };

  const handlePasswordCheck = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/admin/verify-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: passwordInput }),
      });
      const data = await res.json();
      if (data.success) {
        setFormData({
          companyName: adminData.companyName,
          name: adminData.name,
          email: adminData.email,
          phone: adminData.phone,
          currentPassword: passwordInput,
          newPassword: "",
        });
        setShowPasswordCheck(false);
        setShowEditForm(true);
      } else {
        alert(data.message || "Invalid password");
      }
    } catch (err) {
      console.error("Error verifying password:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/admin/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Profile updated successfully!");
        setAdminData(data.admin);
        setShowEditForm(false);
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (!adminData) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 shadow-lg rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>

      {!showPasswordCheck && !showEditForm && (
        <div>
          <p><strong>Company:</strong> {adminData.companyName}</p>
          <p><strong>Name:</strong> {adminData.name}</p>
          <p><strong>Email:</strong> {adminData.email}</p>
          <p><strong>Phone:</strong> {adminData.phone}</p>

          <button
            onClick={handleEditClick}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Edit
          </button>
        </div>
      )}

      {showPasswordCheck && (
        <div className="mt-4">
          <input
            type="password"
            placeholder="Enter current password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="border p-2 w-full rounded mb-2"
          />
          <button
            onClick={handlePasswordCheck}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Verify
          </button>
        </div>
      )}

      {showEditForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company Name"
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border p-2 w-full rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border p-2 w-full rounded"
          />
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New Password (optional)"
            className="border p-2 w-full rounded"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-blue-700 text-white rounded-lg"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminProfile;
