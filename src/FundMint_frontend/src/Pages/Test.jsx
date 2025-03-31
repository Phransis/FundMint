import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FundMint_backend } from "declarations/FundMint_backend";

export default function Test() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    deadline: "",
    imageUrl: "",
  });
  const [milestones, setMilestones] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setMilestones([
      ...milestones,
      {
        title: "",
        description: "",
        target: 0,
        deadline: "",
      },
    ]);
  };

  const handleMilestoneChange = (index, field, value) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.goal || isNaN(formData.goal) || Number(formData.goal) <= 0) {
      newErrors.goal = "Please enter a valid positive number";
    }
    if (!formData.deadline || new Date(formData.deadline) < new Date()) {
      newErrors.deadline = "Please select a future date";
    }
    if (formData.imageUrl && !/^https?:\/\/.+\..+/.test(formData.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const campaignData = {
        title: formData.title,
        description: formData.description,
        target: BigInt(Math.floor(Number(formData.goal) )), // Convert ICP to e8s
        deadline: BigInt(
          Math.floor(new Date(formData.deadline).getTime() / 1000)
        ), // Unix timestamp in seconds
        milestones: milestones.map((m) => ({
          title: m.title,
          description: m.description,
          target: BigInt(m.target),
          deadline: BigInt(Math.floor(new Date(m.deadline).getTime() / 1000)),
          isReleased: false,
        })),
      };

      const result = await FundMint_backend.createCampaign(
        campaignData.title,
        campaignData.description,
        campaignData.target,
        campaignData.deadline,
        campaignData.milestones
      );

      console.log("Campaign created:", result);
      navigate("/campaigns");
    } catch (error) {
      console.error("Error creating campaign:", error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create New Campaign</h1>

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Campaign Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.title ? "border-red-500" : "border"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.description ? "border-red-500" : "border"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Goal (ICP) */}
        <div>
          <label
            htmlFor="goal"
            className="block text-sm font-medium text-gray-700"
          >
            Funding Goal (ICP) *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="goal"
              name="goal"
              min="1"
              step="0.01"
              value={formData.goal}
              onChange={handleChange}
              className={`block w-full pr-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.goal ? "border-red-500" : "border"
              }`}
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">ICP</span>
            </div>
          </div>
          {errors.goal && (
            <p className="mt-1 text-sm text-red-600">{errors.goal}</p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-gray-700"
          >
            Deadline *
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            min={new Date().toISOString().split("T")[0]}
            value={formData.deadline}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.deadline ? "border-red-500" : "border"
            }`}
          />
          {errors.deadline && (
            <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Cover Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.imageUrl ? "border-red-500" : "border"
            }`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
          )}
        </div>

        {/* Milestones */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Milestones
          </label>
          <div className="space-y-4 mt-2">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-md"
              >
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs text-gray-500">Title</label>
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) =>
                        handleMilestoneChange(index, "title", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">
                      Target (ICP)
                    </label>
                    <input
                      type="number"
                      value={milestone.target}
                      onChange={(e) =>
                        handleMilestoneChange(index, "target", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-gray-500">
                    Description
                  </label>
                  <textarea
                    value={milestone.description}
                    onChange={(e) =>
                      handleMilestoneChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={milestone.deadline}
                    min={
                      formData.deadline ||
                      new Date().toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      handleMilestoneChange(index, "deadline", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addMilestone}
            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            Add Milestone
          </button>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}
