import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FundMint_backend } from "declarations/FundMint_backend";

function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampaignDetails = async (campaignId) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching campaign details for ID:", campaignId);
      const numericId = Number(campaignId);

      if (isNaN(numericId)) {
        throw new Error("Invalid campaign ID");
      }

      const data = await FundMint_backend.getCampaignById(numericId);
      console.log("Campaign data:", data);
      setCampaign(data);
    } catch (err) {
      console.error("Error fetching campaign details:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaignContributors = async (campaignId) => {
    try {
      const numericId = Number(campaignId);
      if (isNaN(numericId)) {
        throw new Error("Invalid campaign ID");
      }
      const contributions = await FundMint_backend.getAllContributions(
        numericId
      );
      console.log("Contributors data:", contributions);
      setContributions(contributions);
      // setContributions((prevCampaign) => ({
      //   ...prevCampaign,
      //   contributors: contributors,
      // }));
    } catch (err) {
      console.error("Error fetching contributors:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };
  // Fetch campaign details when the component mounts or when the ID changes

  useEffect(() => {
    if (id) {
      fetchCampaignDetails(id);
      fetchCampaignContributors(id);
    } else {
      setError(new Error("No campaign ID provided"));
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading campaign details: {error.message}</div>;
  }

  if (!campaign) {
    return <div>No campaign found</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Campaign Image */}
        {campaign.length > 0 ? (
          <p>
            {campaign.map((campaign, idx) => (
              <div key={idx}>
                {" "}
                <div className="w-full md:w-1/2 lg:w-1/3 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={campaign.imageUrl || "/default-campaign.jpg"}
                    alt={campaign.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
                {/* Campaign Stats */}
                <div className="w-full md:w-1/2 lg:w-2/3">
                  <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
                  <p className="text-gray-600 mb-4">{campaign.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">
                        {(
                          (Number(campaign.raised) / Number(campaign.target)) *
                          100
                        ).toFixed(2)}
                        % Funded
                      </span>
                      <span className="text-gray-600">
                        {Number(campaign.raised).toLocaleString()} ICP /{" "}
                        {Number(campaign.target).toLocaleString()} ICP
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (Number(campaign.raised).toLocaleString() /
                              Number(campaign.target).toLocaleString()) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500">Goal</p>
                      <p className="text-xl font-bold">
                        {Number(campaign.target).toLocaleString()} ICP
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500">Raised</p>
                      <p className="text-xl font-bold">
                        {Number(campaign.raised).toLocaleString()} ICP
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500">Deadline</p>
                      <p className="text-xl font-bold">
                        {new Date(
                          Number(campaign.deadline) * 1000
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Fund Button */}
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                    Fund This Campaign
                  </button>
                </div>
                {/* Campaign Story */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                  <h2 className="text-2xl font-bold mb-4">Campaign Story</h2>
                  <div className="prose max-w-none">
                    {campaign.story} {/* Can be Markdown-rendered */}
                  </div>
                </div>
              </div>
            ))}
          </p>
        ) : (
          <p>No data</p>
        )}
        {/* {campaign.length > 0 ? (        
          {campaign.map((data, idx) => (
            <div key={idx}>
              <p>{data.title}</p>
              <p>{data.description}</p>
            </div>
        ))})
        
          :( <p>No campaign found</p>)
        } */}

        {/* Contributors Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Contributors</h2>

          {contributions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contributor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount (ICP)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contributions.map((contributor, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            {contributor.contributor}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {contributor.contributor}...
                              {contributor.contributor}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contributor.amount} ICP
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(
                          Number(campaign.deadline) * 1000
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">
              No contributors yet. Be the first to fund this campaign!
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default CampaignDetails;
