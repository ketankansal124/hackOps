import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterStartup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmPassword: "",
    password: "",
    startup_name: "",
    industry: "",
    number_of_founders: "",
    male_presenters:   0 ,
    female_presenters:  0 ,
    transgender: 0 ,
    couple_presenters:  0 ,
    pitchers_average_age: "",
    pitchers_state: "",
    yearly_revenue: "",
    monthly_sales: "",
    gross_margin: "",
    net_margin: "",
    ebitda: "",
    cash_burn: false,
    skus: "",

    has_patents: false,
    bootstrapped: false,

    original_ask_amount: "",
    original_offered_equity: "",
    valuation_requested: "",
    advisory_equity: "",

    received_offer: false,

  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        ...formData,
        role: "investor",
      });
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Investor Registration</h2>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
      <input type="text" name="startup_name" placeholder="Startup Name" onChange={handleChange} required />
      <input type="text" name="industry" placeholder="Industry" onChange={handleChange} required />
      <input type="number" name="number_of_founders" placeholder="Number of Founders" onChange={handleChange} required />
      <input type="number" name="male_presenters" placeholder="Male Presenters" onChange={handleChange} required />
      <input type="number" name="female_presenters" placeholder="Female Presenters" onChange={handleChange} required />
      <input type="number" name="transgender" placeholder="Transgender Presenters" onChange={handleChange} required />
      <input type="number" name="couple_presenters" placeholder="Couple Presenters" onChange={handleChange} required />
      <input type="number" name="pitchers_average_age" placeholder="Pitchers Average Age" onChange={handleChange} required />
      <input type="text" name="pitchers_state" placeholder="Pitchers' State" onChange={handleChange} required />
      <input type="number" name="yearly_revenue" placeholder="Yearly Revenue" onChange={handleChange} required />
      <input type="number" name="monthly_sales" placeholder="Monthly Sales" onChange={handleChange} required />
      <input type="number" name="gross_margin" placeholder="Gross Margin" onChange={handleChange} required />
      <input type="number" name="net_margin" placeholder="Net Margin" onChange={handleChange} required />
      <input type="number" name="ebitda" placeholder="EBITDA" onChange={handleChange} required />
      <label>
        Cash Burn:
        <input type="checkbox" name="cash_burn" checked={formData.cash_burn} onChange={handleChange} />
      </label>
      <input type="text" name="skus" placeholder="SKUs" onChange={handleChange} required />
      <label>
        Has Patents:
        <input type="checkbox" name="has_patents" checked={formData.has_patents} onChange={handleChange} />
      </label>
      <label>
        Bootstrapped:
        <input type="checkbox" name="bootstrapped" checked={formData.bootstrapped} onChange={handleChange} />
      </label>
      <input type="number" name="original_ask_amount" placeholder="Original Ask Amount" onChange={handleChange} required />
      <input type="number" name="original_offered_equity" placeholder="Original Offered Equity" onChange={handleChange} required />
      <input type="number" name="valuation_requested" placeholder="Valuation Requested" onChange={handleChange} required />
      <input type="number" name="advisory_equity" placeholder="Advisory Equity" onChange={handleChange} required />
      <label>
        Received Offer:
        <input type="checkbox" name="received_offer" checked={formData.received_offer} onChange={handleChange} />
      </label>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterStartup;
