import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBusinessProfile, getCurrentUser } from "../api/api"; 
import "../styles/Onboarding.css";

const Onboarding = () => {
  const [businessData, setBusinessData] = useState({
    businessName: "",
    businessType: "",
    email: "",
    phone: "",
    address: "",
    operatingHours: "9:00 AM - 5:00 PM",
    services: [{ name: "", price: "", description: "" }],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        console.log("User data in onboarding:", user);
        if (user?.businessId) {
          navigate("/dashboard");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error checking user:", err);
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...businessData.services];
    updatedServices[index][field] = field === "price" ? parseFloat(value) || 0 : value;
    setBusinessData((prevData) => ({ ...prevData, services: updatedServices }));
  };

  const addService = () => {
    setBusinessData((prevData) => ({
      ...prevData,
      services: [...prevData.services, { name: "", price: "", description: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
  
    try {
      const response = await createBusinessProfile(businessData);
      console.log("API Response:", response); 
  
      if (response.success) {
        console.log("Redirecting to dashboard..."); 
        navigate("/dashboard"); 
        return; 
      } else {
        setError("Business setup failed. Please check your details.");
      }
    } catch (error) {
      console.error("Error submitting business setup:", error);
      setError("An error occurred. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>; 

  return (
    <div className="onboarding-container">
      <h2>Welcome! Set Up Your Business</h2>
      {error && <p className="error-message">{error}</p>}

      <form className="onboarding-form" onSubmit={handleSubmit}>
        <input type="text" name="businessName" placeholder="Business Name" value={businessData.businessName} onChange={handleChange} required />
        <select name="businessType" value={businessData.businessType} onChange={handleChange} required>
          <option value="" disabled>Select Business Type</option>
          <option value="Fitness">Fitness</option>
          <option value="Salon">Salon</option>
          <option value="Medical">Medical</option>
          <option value="Consulting">Consulting</option>
          <option value="Other">Other</option>
        </select>
        <input type="email" name="email" placeholder="Business Email" value={businessData.email} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone Number" value={businessData.phone} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Business Address" value={businessData.address} onChange={handleChange} required />
        <input type="text" name="operatingHours" placeholder="Operating Hours (e.g., 9 AM - 6 PM)" value={businessData.operatingHours} onChange={handleChange} required />

        <h3>Services Offered:</h3>
        {businessData.services.map((service, index) => (
          <div key={index} className="service-input">
            <input
              type="text"
              placeholder="Service Name"
              value={service.name}
              onChange={(e) => handleServiceChange(index, "name", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price ($)"
              value={service.price}
              onChange={(e) => handleServiceChange(index, "price", e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={service.description}
              onChange={(e) => handleServiceChange(index, "description", e.target.value)}
              required
            />
          </div>
        ))}

        <button type="button" onClick={addService}>+ Add Another Service</button>
        <button type="submit">Finish Setup</button>
      </form>
    </div>
  );
};

export default Onboarding;