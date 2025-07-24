'use client';

import React, { useState, useEffect } from "react";
import PlaidLink from "@/components/PlaidLink";
import TransactionsTable from "@/components/TransactionsTable";
import axios from "axios";

export type Transaction = {
  date: string;
  name: string;
  amount: number;
  pending: boolean;
};

export default function HomeScreen() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    axios.post("/api/transactions", { access_token: accessToken })
      .then((res) => {
        setTransactions(
          (res.data.transactions || []).map((tx: { date: string; name: string; amount: number; pending: boolean }) => ({
            date: new Date(tx.date).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
            }),
            name: tx.name,
            amount: tx.amount,
            pending: tx.pending,
          }))
        );
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch transactions");
        setLoading(false);
      });
  }, [accessToken]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">Plaid Test App</h1>
        <div className="mb-6 text-gray-500">Sandbox Bank Account</div>
        {!accessToken && (
          <PlaidLink onSuccess={setAccessToken} onLinkStart={() => setLoading(true)} />
        )}
        {accessToken && (
          <div className="w-full mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Transactions</h2>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <span className="loader"></span>
              </div>
            ) : error ? (
              <div className="text-red-600 text-center">{error}</div>
            ) : (
              <TransactionsTable transactions={transactions} />
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        .loader {
          border: 4px solid #e0e7ef;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
