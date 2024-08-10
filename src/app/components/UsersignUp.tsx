import React, { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  name: string;
  age: string;
  state: string;
  district: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

const UserSignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    state: "",
    district: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Add form submission logic here
    console.log(formData);
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-2xl font-bold mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-1">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-1">District</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSignUp;
