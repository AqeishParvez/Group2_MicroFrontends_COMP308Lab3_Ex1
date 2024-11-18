import React, { useState } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";

const ADD_VITAL_SIGN = gql`
  mutation AddVitalSign($userId: String!, $bloodPressure: String!, $heartRate: Int!, $temperature: Int!) {
    addVitalSign(userId: $userId, bloodPressure: $bloodPressure, heartRate: $heartRate, temperature: $temperature) {
      id
      bloodPressure
      heartRate
      temperature
    }
  }
`;

const GET_VITAL_SIGNS = gql`
  query GetVitalSigns($userId: String!) {
    vitalSigns(userId: $userId) {
      id
      bloodPressure
      heartRate
      temperature
    }
  }
`;

const UPDATE_VITAL_SIGN = gql`
  mutation UpdateVitalSign($id: String!, $bloodPressure: String!, $heartRate: Int!, $temperature: Int!) {
    updateVitalSign(id: $id, bloodPressure: $bloodPressure, heartRate: $heartRate, temperature: $temperature) {
      id
      bloodPressure
      heartRate
      temperature
    }
  }
`;

const VitalSignsForm = () => {
  const [formData, setFormData] = useState({ bloodPressure: "", heartRate: 0, temperature: 0 });
  const [editData, setEditData] = useState(null); // Track data for editing
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [queryError, setQueryError] = useState("");

  // Fetch userId from localStorage
  const userId = localStorage.getItem("userId");

  const { data, loading, error, refetch } = useQuery(GET_VITAL_SIGNS, {
    variables: { userId }, // Use authenticated user's ID
    skip: !userId, // Skip the query if userId is missing
    onError: (err) => setQueryError(err.message),
  });

  const [addVitalSign] = useMutation(ADD_VITAL_SIGN, {
    onError: (err) => setErrorMessage(err.message),
  });

  const [updateVitalSign] = useMutation(UPDATE_VITAL_SIGN, {
    onError: (err) => setErrorMessage(err.message),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    setShowMessage(false); // Reset success message

    if (!userId) {
      setErrorMessage("User ID is missing. Please log in again.");
      return;
    }

    try {
      if (editData) {
        // Update existing vital sign
        await updateVitalSign({
          variables: { id: editData.id, ...formData },
        });
        setEditData(null); // Clear edit data
      } else {
        // Add new vital sign
        await addVitalSign({
          variables: { ...formData, userId },
        });
      }
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); // Success message disappears after 3 seconds
      refetch(); // Refresh the list of vital signs
      setFormData({ bloodPressure: "", heartRate: 0, temperature: 0 }); // Clear form
    } catch (err) {
      console.error("Error submitting vital sign:", err);
    }
  };

  const handleEdit = (vital) => {
    setEditData(vital); // Set the data to edit
    setFormData({
      bloodPressure: vital.bloodPressure,
      heartRate: vital.heartRate,
      temperature: vital.temperature,
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">{editData ? "Edit Vital Sign" : "Add Vital Signs"}</h2>
            {errorMessage && (
              <div className="alert alert-danger text-center" role="alert">
                {errorMessage}
              </div>
            )}
            {showMessage && (
              <div className="alert alert-success text-center" role="alert">
                Vital sign {editData ? "updated" : "added"} successfully!
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="bloodPressure" className="form-label">
                  Blood Pressure
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="bloodPressure"
                  placeholder="Enter blood pressure"
                  value={formData.bloodPressure}
                  onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="heartRate" className="form-label">
                  Heart Rate
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="heartRate"
                  placeholder="Enter heart rate"
                  value={formData.heartRate}
                  onChange={(e) => setFormData({ ...formData, heartRate: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="temperature" className="form-label">
                  Temperature
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="temperature"
                  placeholder="Enter temperature"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseInt(e.target.value) })}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                {editData ? "Update Vital Sign" : "Add Vital Sign"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center mt-4">
          <p>Loading vital signs...</p>
        </div>
      )}

      {queryError && (
        <div className="text-center mt-4 alert alert-danger">
          <p>Error fetching vital signs: {queryError}</p>
        </div>
      )}

      {data && data.vitalSigns.length > 0 && (
        <div className="row mt-5">
          <div className="col-md-8 offset-md-2">
            <h3 className="text-center mb-4">Vital Signs</h3>
            <div className="row">
              {data.vitalSigns.map((vital) => (
                <div className="col-md-4 mb-4" key={vital.id}>
                  <div className="card p-3 shadow-sm">
                    <h5 className="card-title">Vital Sign ID: {vital.id}</h5>
                    <p className="card-text">Blood Pressure: {vital.bloodPressure}</p>
                    <p className="card-text">Heart Rate: {vital.heartRate}</p>
                    <p className="card-text">Temperature: {vital.temperature}°C</p>
                    <button
                      className="btn btn-secondary mt-2"
                      onClick={() => handleEdit(vital)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalSignsForm;
