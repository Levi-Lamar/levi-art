import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

const CommissionRequestForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferredSize: '',
    additionalInstructions: '',
    referenceImage: null
  });

  const [submissionStatus, setSubmissionStatus] = useState({
    success: false,
    error: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      referenceImage: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const commissionRef = collection(db, 'commissionRequests');
      await addDoc(commissionRef, {
        ...formData,
        timestamp: new Date(),
        status: 'Pending'
      });

      setSubmissionStatus({
        success: true,
        error: null
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        preferredSize: '',
        additionalInstructions: '',
        referenceImage: null
      });

    } catch (error) {
      setSubmissionStatus({
        success: false,
        error: error.message
      });
    }
  };

  return (
    <div className="bg-dark-card p-8 rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-brand-orange">
        Request a Custom Commission
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full bg-black text-white p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-black text-white p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="preferredSize" className="block mb-2">Preferred Size</label>
          <select
            id="preferredSize"
            name="preferredSize"
            value={formData.preferredSize}
            onChange={handleInputChange}
            className="w-full bg-black text-white p-2 rounded"
          >
            <option value="">Select Size</option>
            <option value="8x10">8x10 inches</option>
            <option value="11x14">11x14 inches</option>
            <option value="16x20">16x20 inches</option>
            <option value="24x36">24x36 inches</option>
          </select>
        </div>

        <div>
          <label htmlFor="referenceImage" className="block mb-2">Reference Image</label>
          <input
            type="file"
            id="referenceImage"
            name="referenceImage"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full bg-black text-white p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="additionalInstructions" className="block mb-2">Additional Instructions</label>
          <textarea
            id="additionalInstructions"
            name="additionalInstructions"
            value={formData.additionalInstructions}
            onChange={handleInputChange}
            className="w-full bg-black text-white p-2 rounded"
            rows="4"
          />
        </div>

        {submissionStatus.success && (
          <div className="bg-green-600 text-white p-4 rounded">
            Commission request submitted successfully!
          </div>
        )}

        {submissionStatus.error && (
          <div className="bg-red-600 text-white p-4 rounded">
            {submissionStatus.error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-brand-orange text-white p-3 rounded hover:bg-orange-600 transition"
        >
          Submit Commission Request
        </button>
      </form>
    </div>
  );
};

export default CommissionRequestForm;
