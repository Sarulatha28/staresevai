import React from 'react';

const PattaOptionsStep = ({
  formData,
  handleInputChange,
  handleStep2Submit,
  districts,
  taluksByDistrict,
  reasonOptions,
  handleReasonChange,
  hasCAN
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {hasCAN ? "Patta Service Options" : " Patta Service Options"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => handleInputChange({ target: { name: 'pattaOption', value: 'PATTA transfer' } })}
          className={`p-4 border rounded-lg transition ${
            formData.pattaOption === ' PATTA transfer' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-300'
          }`}
        >
          <h4 className="font-semibold mb-2">Patta Transfer</h4>
          <p className="text-sm text-gray-600">Transfer of patta ownership</p>
        </button>

        <button
          onClick={() => handleInputChange({ target: { name: 'pattaOption', value: 'subdivision' } })}
          className={`p-4 border rounded-lg transition ${
            formData.pattaOption === 'subdivision' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-300'
          }`}
        >
          <h4 className="font-semibold mb-2">Sub Division</h4>
          <p className="text-sm text-gray-600">Divide property into sub-sections</p>
        </button>

        <button
          onClick={() => handleInputChange({ target: { name: 'pattaOption', value: 'naatham patta transfer' } })}
          className={`p-4 border rounded-lg transition ${
            formData.pattaOption === 'naatham patta transfer' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-300'
          }`}
        >
          <h4 className="font-semibold mb-2">Naatham Patta Transfer</h4>
          <p className="text-sm text-gray-600">Transfer of naatham patta</p>
        </button>
      </div>

      {formData.pattaOption && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select District</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taluk *</label>
              <select
                name="taluk"
                value={formData.taluk}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!formData.district}
              >
                <option value="">Select Taluk</option>
                {formData.district && taluksByDistrict[formData.district]?.map(taluk => (
                  <option key={taluk} value={taluk}>{taluk}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Village *</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Village name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area Type *</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="areaType"
                    value="rural"
                    checked={formData.areaType === 'rural'}
                    onChange={handleInputChange}
                    className="mr-2"
                    required
                  />
                  Rural
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="areaType"
                    value="natham"
                    checked={formData.areaType === 'natham'}
                    onChange={handleInputChange}
                    className="mr-2"
                    required
                  />
                  Natham
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Application *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              {reasonOptions.map((reason, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.reason.includes(reason)}
                    onChange={(e) => handleReasonChange(reason, e.target.checked)}
                    className="mr-2"
                  />
                  {reason}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleStep2Submit}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {hasCAN ? 'Next Step' : 'Next Step'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PattaOptionsStep;