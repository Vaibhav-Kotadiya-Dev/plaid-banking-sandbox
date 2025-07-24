import React from "react";
import clsx from "clsx";

type Transaction = {
  date: string;
  name: string;
  amount: number;
  pending: boolean;
};

type Props = {
  transactions: Transaction[];
};

export default function TransactionsTable({ transactions }: Props) {
  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Spent</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Received</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.map((tx, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-800">{tx.date}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{tx.name}</td>
              <td className="px-6 py-4 text-sm text-red-600 text-right">
                {tx.amount < 0 ? `$${Math.abs(tx.amount).toFixed(2)}` : "—"}
              </td>
              <td className="px-6 py-4 text-sm text-green-600 text-right">
                {tx.amount > 0 ? `$${tx.amount.toFixed(2)}` : "—"}
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <span
                  className={clsx(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                    tx.pending
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  )}
                >
                  {tx.pending ? "Pending" : "Posted"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
