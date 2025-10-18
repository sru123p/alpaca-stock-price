import { useState } from "react";

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === import.meta.env.PTL_APP_PASSWORD) {
      localStorage.setItem("authenticated", "true");
      onSuccess();
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-80 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Restricted Access</h1>
        <input
          type="password"
          placeholder="Enter password"
          className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
