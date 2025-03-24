import { useState, useEffect } from 'react';
import { FundMint_backend } from 'declarations/FundMint_backend';

function App() {
  const [greeting, setGreeting] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    FundMint_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
  }

  async function getCampaigns() {
    try {
      const campaigns = await FundMint_backend.getCampaigns();
      console.log('Campaigns:', campaigns);
      setCampaigns(campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCampaigns();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <img src="/logo2.svg" alt="DFINITY Logo" className="h-16" />
          <h1 className="text-3xl font-bold">FundMint DApp</h1>
        </header>

        {/* Greeting Section */}
        <section className="mb-10 bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <input
              id="name"
              alt="Name"
              type="text"
              placeholder="Enter your name"
              className="p-3 border border-gray-300 rounded-md flex-1"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Say Hello
            </button>
          </form>
          {greeting && (
            <p className="mt-4 text-lg text-green-600">👋 {greeting}</p>
          )}
        </section>

        {/* Campaigns Section */}
        <section className="mb-10 bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Campaigns</h2>
            <button
              onClick={getCampaigns}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
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
                  <tr className="bg-indigo-600 text-white">
                    <th className="px-4 py-2">Campaign ID</th>
                    <th className="px-4 py-2">Owner</th>
                    <th className="px-4 py-2">Goal</th>
                    <th className="px-4 py-2">Deadline</th>
                    <th className="px-4 py-2">Balance</th>
                    <th className="px-4 py-2">State</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign, idx) => (
                    <tr key={campaign.id || idx} className="border-b even:bg-gray-50">
                      <td className="px-4 py-2 text-center">{campaign.id}</td>
                      <td className="px-4 py-2">{campaign.owner?.toText?.() || 'N/A'}</td>
                      <td className="px-4 py-2 text-center">{Number(campaign.goal) || 0}</td>
                      <td className="px-4 py-2 text-center">
                        {new Date(Number(campaign.deadline)).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-center">{Number(campaign.balance) || 0}</td>
                      <td className="px-4 py-2 text-center">
                        {campaign.state ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Active</span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded">Closed</span>
                        )}
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

        {/* Create Campaign */}
        <FormSection
          title="Create Campaign"
          inputs={[
            { id: 'goal', label: 'Goal', type: 'number' }
          ]}
          onSubmit={(e) => {
            e.preventDefault();
            // handle create campaign
          }}
          buttonText="Create Campaign"
        />

        {/* Contribute */}
        <FormSection
          title="Contribute to Campaign"
          inputs={[
            { id: 'campaignId', label: 'Campaign ID', type: 'number' },
            { id: 'amount', label: 'Amount', type: 'number' }
          ]}
          onSubmit={(e) => {
            e.preventDefault();
            // handle contribute
          }}
          buttonText="Contribute"
        />

        {/* Withdraw */}
        <FormSection
          title="Withdraw from Campaign"
          inputs={[
            { id: 'campaignId', label: 'Campaign ID', type: 'number' }
          ]}
          onSubmit={(e) => {
            e.preventDefault();
            // handle withdraw
          }}
          buttonText="Withdraw"
        />

        {/* Get Refund */}
        <FormSection
          title="Get Refund from Campaign"
          inputs={[
            { id: 'campaignId', label: 'Campaign ID', type: 'number' }
          ]}
          onSubmit={(e) => {
            e.preventDefault();
            // handle refund
          }}
          buttonText="Get Refund"
        />

        {/* Get Campaign Details */}
        <FormSection
          title="Get Campaign Details"
          inputs={[
            { id: 'campaignId', label: 'Campaign ID', type: 'number' }
          ]}
          onSubmit={(e) => {
            e.preventDefault();
            // handle get details
          }}
          buttonText="Get Details"
        />
      </div>
    </main>
  );
}

function FormSection({ title, inputs, onSubmit, buttonText }) {
  return (
    <section className="mb-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {inputs.map(({ id, label, type }) => (
          <div key={id} className="flex flex-col">
            <label htmlFor={id} className="mb-1">{label}</label>
            <input
              id={id}
              type={type}
              className="p-3 border border-gray-300 rounded-md"
            />
          </div>
        ))}
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition self-start"
        >
          {buttonText}
        </button>
      </form>
    </section>
  );
}

export default App;
