import React from 'react';

const PattaOptionsStep = ({
  formData,
  handleInputChange,
  handleStep2Submit,
  districts,
  taluksByDistrict,
  reasonOptions,
  handleReasonChange,
  hasCAN,
  userName,
  goToPreviousStep
}) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl mb-8 border border-green-200">
      {/* CAN User Display */}
      {hasCAN && userName && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 text-sm">✓</span>
            </div>
            <div>
              <p className="text-blue-800 font-semibold">CAN Verified User</p>
              <p className="text-blue-600 text-sm">Name: {userName}</p>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Patta Service Options
      </h3>
      
      {/* Service Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => handleInputChange({ target: { name: 'pattaOption', value: 'PATTA transfer' } })}
          className={`p-6 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
            formData.pattaOption === 'PATTA transfer' 
              ? 'border-blue-500 bg-blue-50 shadow-md' 
              : 'border-gray-300 hover:border-blue-300 bg-white'
          }`}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 text-lg">🏠</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Patta Transfer</h4>
            <p className="text-sm text-gray-600">Transfer of patta ownership</p>
          </div>
        </button>

        <button
          onClick={() => handleInputChange({ target: { name: 'pattaOption', value: 'subdivision' } })}
          className={`p-6 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
            formData.pattaOption === 'subdivision' 
              ? 'border-blue-500 bg-blue-50 shadow-md' 
              : 'border-gray-300 hover:border-blue-300 bg-white'
          }`}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-lg">📊</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Sub Division</h4>
            <p className="text-sm text-gray-600">Divide property into sub-sections</p>
          </div>
        </button>

        <button
          onClick={() => handleInputChange({ target: { name: 'pattaOption', value: 'naatham patta transfer' } })}
          className={`p-6 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
            formData.pattaOption === 'naatham patta transfer' 
              ? 'border-blue-500 bg-blue-50 shadow-md' 
              : 'border-gray-300 hover:border-blue-300 bg-white'
          }`}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 text-lg">📝</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Naatham Patta Transfer</h4>
            <p className="text-sm text-gray-600">Transfer of naatham patta</p>
          </div>
        </button>
      </div>

      {/* Service Details Form */}
      {formData.pattaOption && (
        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
             Details for {formData.pattaOption}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District *
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                required
              >
                <option value="">Select District</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* Taluk */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taluk *
              </label>
              <select
                name="taluk"
                value={formData.taluk}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                required
                disabled={!formData.district}
              >
                <option value="">Select Taluk</option>
                {formData.district && taluksByDistrict[formData.district]?.map(taluk => (
                  <option key={taluk} value={taluk}>{taluk}</option>
                ))}
              </select>
              {!formData.district && (
                <p className="text-sm text-gray-500 mt-1">Please select district first</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Village */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Village *
              </label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Enter Village name"
                required
              />
            </div>

            {/* Area Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area Type *
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="areaType"
                    value="rural"
                    checked={formData.areaType === 'rural'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="text-gray-700">Rural</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="areaType"
                    value="natham"
                    checked={formData.areaType === 'natham'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="text-gray-700">Natham</span>
                </label>
              </div>
            </div>
          </div>

          {/* Reason for Application */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Reason for Application *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reasonOptions.map((reason, index) => (
                <label key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={formData.reason.includes(reason)}
                    onChange={(e) => handleReasonChange(reason, e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-gray-700 text-sm">{reason}</span>
                </label>
              ))}
            </div>
            {formData.reason && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-700 text-sm">
                  <strong>Selected reasons:</strong> {formData.reason}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <button
              onClick={goToPreviousStep}
              className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold"
            >
              Previous
            </button>
            <button
              onClick={handleStep2Submit}
              className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold shadow-lg"
            >
              Next Step
            </button>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default PattaOptionsStep;