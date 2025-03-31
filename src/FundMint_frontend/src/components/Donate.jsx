import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FundMint_backend } from "declarations/FundMint_backend";

export default function DonateToCampaign() {
  const { id } = useParams();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Convert ICP to e8s (1 ICP = 100,000,000 e8s)
  const icpToE8s = (icpAmount) => {
    // return BigInt(Math.floor(Number(icpAmount) * 100_000_000));
    return BigInt(Math.floor(Number(icpAmount)));
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid donation amount");
      return;
    }

    setIsSubmitting(true);

    try {
      const e8sAmount = icpToE8s(amount);
      console.log(
        `Donating ${amount} ICP (${e8sAmount} e8s) to campaign ${id}`
      );

      const result = await FundMint_backend.contribute(
        BigInt(Number(id)), // campaignId as Nat
        e8sAmount // amount as Nat (in e8s)
      );

      setSuccess(
        `Successfully donated ${amount} ICP! Transaction ID: ${JSON.stringify(
          result
        )}`
      );

      // Reset the form
      setAmount("");
    } catch (err) {
      console.error("Donation failed:", err);
      setError(err.message || "Failed to process donation");
    } finally {
      setIsSubmitting(false);
    }
  };
    
    // useEffect(() => {
    //     handleDonate();
    //     const interval = setInterval(getCampaign, 5000);
    //     return () => clearInterval(interval);
    //   }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Donate to Campaign</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleDonate} className="space-y-4">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount (ICP) *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="amount"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full pr-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">ICP</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-700">
            Donation Information
          </h3>
          <ul className="mt-2 text-sm text-gray-600 space-y-1">
            <li>• Minimum donation: 0.01 ICP</li>
            <li>• Transactions are irreversible</li>
            <li>• You'll receive a confirmation</li>
          </ul>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium  bg-lime-300 hover:bg-lime-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Processing..." : "Donate Now"}
          </button>
        </div>
      </form>
    </div>
  );
}
