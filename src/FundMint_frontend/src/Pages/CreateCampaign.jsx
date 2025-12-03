import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TwoHands from "../assets/Background.png";

// Auth
import { getPrincipal } from "../Utils/Auth.jsx";
import { createAuthenticatedActor } from "../Utils/Plug-Wallet";

export default function CreateCampaign() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    deadline: "",
    imageFile: null,
    imagePreview: null,
    imageUrl: "",
  });

  const [milestones, setMilestones] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [principal, setPrincipal] = useState("");

  // Load principal
  useEffect(() => {
    const load = async () => {
      try {
        const p = await getPrincipal();
        setPrincipal(p.toText());
      } catch (err) {
        console.error("Principal load error:", err);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      { title: "", description: "", target: "", deadline: "" },
    ]);
  };

  const handleMilestoneChange = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (!formData.goal || Number(formData.goal) <= 0)
      newErrors.goal = "Goal must be a positive number";

    if (!formData.deadline) newErrors.deadline = "Deadline is required";
    else if (new Date(formData.deadline) < new Date())
      newErrors.deadline = "Deadline must be in the future";

    if (formData.imageUrl && !/^https?:\/\/.+\..+/.test(formData.imageUrl))
      newErrors.imageUrl = "Invalid image URL";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------------------------------------------------
  // ✔ THE FIXED SUBMIT HANDLER
  // ------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // If you want IPFS upload:
      // const ipfsCid = await uploadToIPFS(formData.imageFile);

      const campaignData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        target: BigInt(Number(formData.goal)),
        deadline: BigInt(
          Math.floor(new Date(formData.deadline).getTime() / 1000)
        ),
        milestones: milestones.map((m) => ({
          title: m.title,
          description: m.description,
          target: BigInt(Number(m.target || 0)),
          deadline: BigInt(Math.floor(new Date(m.deadline).getTime() / 1000)),
          isReleased: false,
        })),
      };

      // 🔥 Plug actor (the only safe method)
      const backend = await createAuthenticatedActor();

      const result = await backend.createCampaign(
        campaignData.title,
        campaignData.description,
        campaignData.target,
        campaignData.deadline,
        campaignData.milestones
      );

      console.log("Campaign created:", result);
      navigate(`/campaigns`);
    } catch (err) {
      console.error("Error creating campaign:", err);
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mmin-h-screen p-8 flex items-center justify-center mx-4">
      {/* Left Side Image */}
      <div className="hidden md:flex w-1/2 h-screen">
        <img
          src={TwoHands}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-xl">
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {errors.submit}
            </div>
          )}

          <p className="text-2xl font-bold mb-6">Create New Campaign</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium">
                Campaign Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium">Description *</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-medium">
                Funding Goal (ICP) *
              </label>
              <input
                type="number"
                name="goal"
                min="1"
                step="0.01"
                value={formData.goal}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2"
              />
              {errors.goal && (
                <p className="text-red-500 text-sm">{errors.goal}</p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium">Deadline *</label>
              <input
                type="date"
                name="deadline"
                min={new Date().toISOString().split("T")[0]}
                value={formData.deadline}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2"
              />
              {errors.deadline && (
                <p className="text-red-500 text-sm">{errors.deadline}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium">
                Upload Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData((prev) => ({
                      ...prev,
                      imageFile: file,
                      imagePreview: URL.createObjectURL(file),
                    }));
                  }
                }}
                className="mt-1 block w-full border rounded-md p-2"
              />

              {formData.imagePreview && (
                <div className="mt-4">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        imageFile: null,
                        imagePreview: null,
                      }))
                    }
                    className="mt-3 px-3 py-1 bg-red-500 text-white text-sm rounded"
                  >
                    Clear Image
                  </button>
                </div>
              )}
            </div>

            {/* Milestones */}
            <div>
              <label className="block text-sm font-medium">Milestones</label>

              {milestones.map((m, index) => (
                <div key={index} className="p-3 border rounded mt-2">
                  <input
                    type="text"
                    placeholder="Milestone Title"
                    value={m.title}
                    onChange={(e) =>
                      handleMilestoneChange(index, "title", e.target.value)
                    }
                    className="border w-full rounded p-1 mb-2"
                  />

                  <textarea
                    placeholder="Description"
                    rows={2}
                    value={m.description}
                    onChange={(e) =>
                      handleMilestoneChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    className="border w-full rounded p-1 mb-2"
                  />

                  <input
                    type="number"
                    placeholder="Target ICP"
                    value={m.target}
                    onChange={(e) =>
                      handleMilestoneChange(index, "target", e.target.value)
                    }
                    className="border w-full rounded p-1 mb-2"
                  />

                  <input
                    type="date"
                    value={m.deadline}
                    onChange={(e) =>
                      handleMilestoneChange(index, "deadline", e.target.value)
                    }
                    className="border w-full rounded p-1"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addMilestone}
                className="mt-3 px-3 py-1 bg-lime-300 rounded hover:bg-lime-500"
              >
                Add Milestone
              </button>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded bg-lime-300 hover:bg-lime-500"
              >
                {isSubmitting ? "Creating..." : "Create Campaign"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
