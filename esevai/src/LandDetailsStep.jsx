import React from "react";

const LandDetailsStep = ({
  currentStep,
  formData,
  handleInputChange,
  handleLandDetailsSubmit,
  goToPreviousStep
}) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
         {currentStep} Land Details
      </h2>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Survey Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Survey Number *
            </label>
            <input
              type="text"
              name="surveyNo"
              value={formData.surveyNo || ""}
              onChange={handleInputChange}
              placeholder="Enter Survey Number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Sub Division Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub Division Number *
            </label>
            <input
              type="text"
              name="subDivisionNo"
              value={formData.subDivisionNo || ""}
              onChange={handleInputChange}
              placeholder="Enter Sub Division Number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* SRO Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
               Name of SRO *
            </label>
            <input
              type="text"
              name="sroName"
              value={formData.sroName || ""}
              onChange={handleInputChange}
              placeholder="Enter SRO Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Document Number and Year */}
         {/* Document Number and Year */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Document Number and Year *
  </label>
  <div className="flex items-center space-x-2">
    <input
      type="text"
      name="regDocNo"
      value={formData.regDocNo || ""}
      onChange={handleInputChange}
      placeholder="Doc No"
      className="w-24 border border-gray-300 rounded-lg px-3 py-3 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      required
    />
    <span className="text-gray-500 font-bold text-lg">/</span>
    <input
      type="text"
      name="docYear"
      value={formData.docYear || ""}
      onChange={handleInputChange}
      placeholder="Year"
      className="w-20 border border-gray-300 rounded-lg px-3 py-3 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      required
    />
  </div>
</div>
          {/* Registered Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registered Date *
            </label>
            <input
              type="date"
              name="registeredDate"
              value={formData.registeredDate || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Land Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land Category *
            </label>
            <select
              name="landCategory"
              value={formData.landCategory || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Land Category</option>
              <option value="Housing">Land for Housing plots/layouts</option>
              <option value="Agriculture">Agricultural Land</option>
             
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-8 py-3 rounded-lg transition duration-200"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={handleLandDetailsSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition duration-200"
          >
            Next Step →
          </button>
        </div>
      </form>
    </div>
  );
};

export default LandDetailsStep;