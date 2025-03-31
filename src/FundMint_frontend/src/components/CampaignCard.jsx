import { useNavigate } from "react-router-dom";


export default function CampaignCard(params) {
    const navigate = useNavigate();
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 w-64 h-80 flex flex-col">
      {/* Image container - adjust height as needed */}
      <div className="h-32 mb-3 overflow-hidden rounded-t-lg">
        <img
          src={params.campaign.imageUrl || "https://via.placeholder.com/256"}
          alt={params.campaign.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col">
        <h2 className="text-xl font-bold mb-2 line-clamp-2">
          {params.campaign.title}
        </h2>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {params.campaign.description}
        </p>

        <div className="mt-auto space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Goal:</span>
            <span>{params.campaign.goal} ICP</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Raised:</span>
            <span>{params.campaign.raised} ICP</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Deadline:</span>
            <span>{params.campaign.deadline}</span>
            {Math.round((params.campaign.raised / params.campaign.goal) * 100)}% Funded
          </div>
        </div>

        <button
          onClick={() => navigate(`/campaign/${params.campaign.id}`)}
          className="mt-4 bg-lime-300 hover:bg-lime-500  px-4 py-2 rounded transition-colors"
        >
          Fund Now
        </button>
        {/* <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors w-full">
          View Campaign
        </button> */}
      </div>
    </div>
  );
}
