import { useState, useEffect } from "react";
import { FundMint_backend } from "declarations/FundMint_backend";
import DonateToCampaign from "../components/Donate";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [milestone, setMilestone] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [amount, setAmount] = useState("");

  async function getCampaigns() {
    try {
      const campaigns = await FundMint_backend.getCampaigns();
      console.log("Campaigns:", campaigns);
      setCampaigns(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createCampaign(goal) {
    try {
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const target = document.getElementById("target").value;
      const deadline = document.getElementById("deadline").value;
      const milestone = document.getElementById("milestone").value;
      console.log("Creating campaign with:", {
        title,
        description,
        target,
        deadline,
        milestone,
      });
      const result = await FundMint_backend.createCampaign(
        title,
        description,
        goal,
        deadline,
        milestone
      );
      console.log("Create Campaign:", result);
      getCampaigns();
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  }

  useEffect(() => {
    createCampaign(); // 1 ICP = 100_000_000 e8s
    const interval = setInterval(getCampaigns, 5000);
    return () => clearInterval(interval);
    // getCampaigns();
  }, []);

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
            <button
              onClick={getCampaigns}
              className="px-4 py-2 bg-lime-300  rounded hover:bg-lime-500 transition"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading campaigns...</p>
          ) : campaigns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-lime-300 t">
                    <th className="px-4 py-2"> ID</th>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Owner</th>
                    <th className="px-4 py-2">Goal</th>
                    <th className="px-4 py-2">Deadline</th>
                    <th className="px-4 py-2">Balance</th>
                    <th className="px-4 py-2">State</th>
                    <th className="px-4 py-2">View</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign, idx) => (
                    <tr
                      key={campaign.id || idx}
                      className="bg-white even:bg-gray-100"
                    >
                      <td className="border border-gray-300 p-2">
                        # {new Intl.NumberFormat().format(Number(campaign.id))}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {campaign.title}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {campaign.owner.toText()}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {new Intl.NumberFormat().format(
                          Number(campaign.target)
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {new Date(
                          Number(campaign.deadline) * 1000
                        ).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {new Intl.NumberFormat().format(
                          Number(campaign.target) - Number(campaign.raised)
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {campaign.isClosed ? "Closed" : "Open"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <a
                          href={`/campaign/${campaign.id}`}
                          className="text-blue-500 hover:underline"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No campaigns found.</p>
          )}
        </section>

        {campaigns.map((campaign, idx) => (
          <div
            key={campaign.id || idx}
            className="rounded-xl shadow-lg p-4 bg-white"
          >
            <h2 className="text-xl font-bold">{campaign.title}</h2>
            <p>{campaign.description}</p>

            <div className="bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="relative bg-green-500 h-4 rounded-full"
                style={{
                  width: `${
                    (Number(campaign.raised) / Number(campaign.target)) * 100
                  }%`,
                }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-red text-xs">
                  {`${(
                    (Number(campaign.raised) / Number(campaign.target)) *
                    100
                  ).toFixed(1)}%`}
                </span>
              </div>
            </div>

            <div className="flex justify-between mt-2 text-sm">
              <span>{Number(campaign.raised)} ICP Raised</span>
              <span>{Number(campaign.target)} ICP Goal</span>
            </div>

            <button
              onClick={() => fundCampaign(campaign.id, 100000000)} // 1 ICP = 100_000_000 e8s
              className="mt-4 w-full bg-lime-300 text-white p-2 rounded-lg hover:bg-purple-700"
            >
              Fund 1 ICP & Get NFT
            </button>
          </div>
        ))}




      </div>
    </main>
  );
}

// function FormSection({ title, inputs, onSubmit, buttonText }) {
//   return (
//     <section className="mb-10 bg-white shadow-md rounded-lg p-6">
//       <h2 className="text-2xl font-semibold mb-4">{title}</h2>
//       <form onSubmit={onSubmit} className="flex flex-col gap-4">
//         {inputs.map(({ id, label, type }) => (
//           <div key={id} className="flex flex-col">
//             <label htmlFor={id} className="mb-1">
//               {label}
//             </label>
//             <input
//               id={id}
//               type={type}
//               className="p-3 border border-gray-300 rounded-md"
//             />
//           </div>
//         ))}
//         <button
//           type="submit"
//           className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition self-start"
//         >
//           {buttonText}
//         </button>
//       </form>
//     </section>
//   );
// }

export default Campaigns;
