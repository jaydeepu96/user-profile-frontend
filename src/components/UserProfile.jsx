import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/profile.css";

const UserProfile = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    bio: "",
  });
  const [profiles, setProfiles] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setProfiles(response.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = editMode
        ? `/api/users/${currentUserId}`
        : "/api/users/create";

      const method = editMode ? axios.put : axios.post;

      await method(apiUrl, {
        userID: editMode ? currentUserId : Date.now().toString(),
        ...formData,
      });

      resetForm();
      await fetchProfiles();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      bio: "",
    });
    setEditMode(false);
    setCurrentUserId(null);
  };

  const handleEdit = (profile) => {
    setFormData(profile);
    setEditMode(true);
    setCurrentUserId(profile.userID);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        {Object.keys(formData).map((key) =>
          key === "bio" ? (
            <textarea
              key={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder="Other information"
              className="textarea"
            />
          ) : (
            <input
              key={key}
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder={capitalizeFirstLetter(key)}
              className="input"
              required
            />
          )
        )}

        <button type="submit" className="button">
          {editMode ? "Update" : "Save"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Other information</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.userID}>
              <td>{profile.email}</td>
              <td>{profile.username}</td>
              <td>{profile.firstName}</td>
              <td>{profile.lastName}</td>
              <td>{profile.bio}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(profile)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default UserProfile;
