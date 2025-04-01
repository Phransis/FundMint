import { useState, useEffect } from "react";
import { FundMint_backend } from "declarations/FundMint_backend";
import { Link } from "react-router-dom";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const pageSize = 5; // Items per page

  async function getCampaigns() {
    try {
      setLoading(true);
      const [campaignsData, count] = await Promise.all([
        FundMint_backend.getCampaignsPaginated(currentPage, pageSize),
        FundMint_backend.getCampaignCount(),
      ]);
      setCampaigns(campaignsData);
      setTotalCampaigns(Number(count));
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) / 1_000_000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatICP = (amount) => {
    return new Intl.NumberFormat().format(Number(amount) / 100_000_000);
  };

  useEffect(() => {
    getCampaigns();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCampaigns / pageSize);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <img src="/logo2.svg" alt="DFINITY Logo" className="h-16" />
          <h1 className="text-3xl font-bold">FundMint DApp</h1>
        </header>

        {/* Campaigns Section */}
        <section className="mb-10 bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Campaigns</h2>
            <div className="flex space-x-2">
              <button
                onClick={getCampaigns}
                cursor="pointer"
                disabled={loading}
                className="px-4 py-2 bg-lime-300 rounded hover:bg-lime-500 transition"
              >
                Refresh
              </button>
              <Link
                to="/create-campaign"
                className="px-4 py-2 bg-lime-300  rounded hover:bg-lime-500 transition"
              >
                Create Campaign
              </Link>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-500 py-4 text-center">
              Loading campaigns...
            </p>
          ) : campaigns.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-lime-300">
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Title</th>
                      <th className="px-4 py-2">Owner</th>
                      <th className="px-4 py-2">Goal (ICP)</th>
                      <th className="px-4 py-2">Balance (ICP)</th>
                      <th className="px-4 py-2">Deadline</th>
                      <th className="px-4 py-2">Created</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr
                        key={Number(campaign.id)}
                        className="bg-white even:bg-gray-50 hover:bg-gray-100"
                      >
                        <td className="border border-gray-200 p-2 text-center">
                          #{Number(campaign.id)}
                        </td>
                        <td className="border border-gray-200 p-2">
                          {campaign.title}
                        </td>
                        <td className="border border-gray-200 p-2 text-sm">
                          {campaign.owner.toText().slice(0, 6)}...
                          {campaign.owner.toText().slice(-4)}
                        </td>
                        <td className="border border-gray-200 p-2 text-right">
                          {new Intl.NumberFormat().format(
                            Number(campaign.target)
                          )}
                        </td>
                        <td className="border border-gray-200 p-2 text-right">
                          {new Intl.NumberFormat().format(
                          Number(campaign.target) - Number(campaign.raised)
                          )}
                        </td>
                        <td className="border border-gray-200 p-2">
                          {new Date(
                            Number(campaign.deadline) * 1000
                          ).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="border border-gray-200 p-2">
                          {formatDate(campaign.timestamp)}
                        </td>
                        <td className="border border-gray-200 p-2 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              campaign.isClosed
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {campaign.isClosed ? "Closed" : "Open"}
                          </span>
                        </td>
                        <td className="border border-gray-200 p-2 text-center">
                          <Link
                            to={`/campaign/${campaign.id}`}
                            className="text-blue-500 hover:underline text-sm"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className={`px-4 py-2 rounded ${
                    currentPage === 0
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-lime-300 hover:bg-lime-400"
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className={`px-4 py-2 rounded ${
                    currentPage >= totalPages - 1
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-lime-300 hover:bg-lime-400"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 py-4 text-center">
              No campaigns found.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default Campaigns;
