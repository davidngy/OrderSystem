import { useState } from "react";
import * as authStore from "@/lib/authStore"

export function TableView() {
    const[from, setFrom] = useState("");
    const[to, setTo] = useState("");
    
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        handleCreateTable();
    }

    async function handleCreateTable() {
        const response = await fetch("/api/table/createTable", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `BEARER ${authStore.getToken()}`
            },
            credentials: "include",
            body: JSON.stringify({
                from,
                to
            })
        })

        if(response.status === 401) {
            try {
                const tokenResponse = await fetch("/api/auth/token", {
                    method: "POST",
                    credentials: "include", 
                })
                const token = await tokenResponse.json();
                authStore.setToken(token.accessToken)
                return handleCreateTable();
            } catch {
                throw new Error("Session expired");
            }
        }
         if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result)
    }
    
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-6">
        
        {/* Restaurant Name */}
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Kapcha
        </h1>

        {/* Range Inputs */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Von
            </label>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              type="number"
              placeholder="z. B. 1"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Bis
            </label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              type="number"
              placeholder="z. B. 20"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          {/* Generate Button */}
            <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition"
            >
            Tische generieren
            </button>
        </form>
            
      </div>
    </div>
  );
}
