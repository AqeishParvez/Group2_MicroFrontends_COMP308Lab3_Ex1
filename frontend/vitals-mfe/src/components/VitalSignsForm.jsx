import React, { useState } from 'react';
import { useMutation, gql, useQuery } from '@apollo/client';

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

const VitalSignsForm = () => {
  const [formData, setFormData] = useState({ userId: '', bloodPressure: '', heartRate: 0, temperature: 0 });
  const { data } = useQuery(GET_VITAL_SIGNS, { variables: { userId: formData.userId } });

  const [addVitalSign] = useMutation(ADD_VITAL_SIGN);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addVitalSign({ variables: formData });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User ID"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
        />
        <input
          type="text"
          placeholder="Blood Pressure"
          value={formData.bloodPressure}
          onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
        />
        <input
          type="number"
          placeholder="Heart Rate"
          value={formData.heartRate}
          onChange={(e) => setFormData({ ...formData, heartRate: parseInt(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Temperature"
          value={formData.temperature}
          onChange={(e) => setFormData({ ...formData, temperature: parseInt(e.target.value) })}
        />
        <button type="submit">Add Vital Sign</button>
      </form>

      <h3>Vital Signs:</h3>
      {data &&
        data.vitalSigns.map((vital) => (
          <div key={vital.id}>
            <p>Blood Pressure: {vital.bloodPressure}</p>
            <p>Heart Rate: {vital.heartRate}</p>
            <p>Temperature: {vital.temperature}</p>
          </div>
        ))}
    </div>
  );
};

export default VitalSignsForm;