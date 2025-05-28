import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [addressData, setAddressData] = useState({});
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data || {});
      setAddressData(res.data || {});
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const saveChanges = async () => {
    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("phonenumber", userData.phonenumber || "");
    formData.append("street_address", addressData.street_address || "");
    formData.append("city", addressData.city || "");
    formData.append("postal_code", addressData.postal_code || "");
    formData.append("phone", addressData.phone || "");
    formData.append("type", addressData.type || "");
    if (profileImage) {
      formData.append("profileimg", profileImage);
    }

    try {
      await axios.put("http://localhost:5000/api/user/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg("Profile updated successfully!");
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleSellerRequest = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/user/apply-seller",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg("Seller request sent!");
    } catch (error) {
      console.error("Seller request error:", error);
    }
  };

  return (
    <div className="user-profile-page">
      <div className="user-profile-container">
        <aside className="user-profile-sidebar">
          <img
            src={
              userData.profileimg || "/default-profile.png"
            }
            alt="Profile"
            className="user-profile-img"
          />
          <h2>{userData.username}</h2>
          <p>{userData.email}</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={!editing}
          />
        </aside>

        <div className="user-profile-content">
          {successMsg && <div className="user-profile-success">{successMsg}</div>}

          <div className="user-profile-section">
            <h3>Account Information</h3>
            <div className="user-profile-field">
              <label>Username</label>
              <input
                name="username"
                value={userData.username || ""}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>
            <div className="user-profile-field">
              <label>Email</label>
              <input value={userData.email || ""} disabled />
            </div>
            <div className="user-profile-field">
              <label>Phone Number</label>
              <input
                name="phonenumber"
                value={userData.phonenumber || ""}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>
            <div className="user-profile-field">
              <label>Role</label>
              <input value={userData.role || ""} disabled />
            </div>
          </div>

          <div className="user-profile-section">
            <h3>Shipping Address</h3>
            <div className="user-profile-field">
              <label>Street</label>
              <input
                name="street_address"
                value={addressData.street_address || ""}
                onChange={handleAddressChange}
                disabled={!editing}
              />
            </div>
            <div className="user-profile-field">
              <label>City</label>
              <input
                name="city"
                value={addressData.city || ""}
                onChange={handleAddressChange}
                disabled={!editing}
              />
            </div>
            <div className="user-profile-field">
              <label>Postal Code</label>
              <input
                name="postal_code"
                value={addressData.postal_code || ""}
                onChange={handleAddressChange}
                disabled={!editing}
              />
            </div>
            <div className="user-profile-field">
              <label>Phone</label>
              <input
                name="phone"
                value={addressData.phone || ""}
                onChange={handleAddressChange}
                disabled={!editing}
              />
            </div>
            <div className="user-profile-field">
              <label>Type</label>
              <input
                name="type"
                value={addressData.type || ""}
                onChange={handleAddressChange}
                disabled={!editing}
              />
            </div>
          </div>

          <div className="user-profile-actions">
            {!editing ? (
              <button onClick={() => setEditing(true)}>Edit Profile</button>
            ) : (
              <button onClick={saveChanges}>Save Changes</button>
            )}
            <button onClick={handleSellerRequest} className="seller-request">
              Apply to Become a Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
