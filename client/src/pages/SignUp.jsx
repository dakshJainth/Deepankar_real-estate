import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();

    try {
      
      setIsLoading(true);
      const res = await fetch('/api/auth/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if(data.success === false){
        setError(data.message);
        console.log(data);
        setIsLoading(false);
        return;
      }
  
      setIsLoading(false);
      setError(null);
      navigate('/sign-in');

    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
}

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button disabled={isLoading} className="bg-slate-600 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80">
          {isLoading? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth/>
      </form>

      <div className="flex gap-2">
        <p>Have an account?</p>
        <Link to={"/sign-in"} className="text-blue-700 font-bold">
          Sign in
        </Link>
      </div>
      {error && <p className="text-red-700">{error}</p>}
    </div>
  );
};

export default SignUp;
