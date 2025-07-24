'use client';

import React, { useState, useEffect } from "react";
import Script from "next/script";
import axios from "axios";

export default function PlaidLink({ onSuccess, onLinkStart }: { onSuccess: (accessToken: string) => void; onLinkStart?: () => void }) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [plaidReady, setPlaidReady] = useState<boolean>(false);

  useEffect(() => {
    // @ts-expect-error Plaid is loaded via script and not typed
    if (typeof window !== "undefined" && window?.Plaid) {
      setPlaidReady(true);
    }
  }, []);

  useEffect(() => {
    axios.post("/api/create-link-token")
      .then((res) => setLinkToken(res.data.link_token));
  }, []);

  const handlePlaid = async () => {
    if (onLinkStart) onLinkStart();
    // @ts-expect-error Plaid is loaded via script and not typed
    if (!linkToken || !window?.Plaid) return;
    // @ts-expect-error Plaid is loaded via script and not typed
    const handler = window.Plaid.create({
      token: linkToken,
      onSuccess: async (public_token: string) => {
        setLoading(true);
        const res = await axios.post("/api/exchange-public-token", { public_token });
        setLoading(false);
        if (res.data.access_token) {
          onSuccess(res.data.access_token);
        }
      },
      onExit: () => { },
    });
    handler.open();
  };

  return (
    <>
      <Script
        src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"
        strategy="afterInteractive"
        onLoad={() => setPlaidReady(true)}
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 cursor-pointer flex items-center justify-center"
        onClick={handlePlaid}
        disabled={!linkToken || loading || !plaidReady}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span>Linking...</span>
          </div>
        ) : (
          "Link Bank Account"
        )}
      </button>

    </>
  );
}