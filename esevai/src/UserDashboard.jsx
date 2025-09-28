import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/starmobilelogo.jpg";
import CANStep from "./CANStep";
import PersonalDetailsStep from "./PersonalDetailsStep";
import PattaOptionsStep from "./PattaOptionsStep";
import LandDetailsStep from "./LandDetailsStep";
import DocumentUploadStep from "./DocumentUploadStep";
import ReviewSubmitStep from "./ReviewSubmitStep";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState("");
  const [hasCAN, setHasCAN] = useState(null);
  const [canNumber, setCanNumber] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPaymentUpload, setShowPaymentUpload] = useState(false);
  const [paymentName, setPaymentName] = useState("");
  const [paymentMobile, setPaymentMobile] = useState("");
  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    aadharName: "",
    aadharNumber: "",
    fatherName: "",
    motherName: "",
    dob: "",
    address: "",
    mobileNumber: "",
    pattaOption: "",
    district: "",
    taluk: "",
    village: "",
    areaType: "",
    reason: "",
    surveyNo: "",
    subDivisionNo: "",
    sroName: "",
    regDocNo: "",
    registeredDate: "",
    landCategory: "",
    pattaNo: "",
    landType: "",
    extentHec: "",
    extentAres: ""
  });

  // Existing data arrays
  const districts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
    "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
    "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
    "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
    "Vellore", "Viluppuram", "Virudhunagar"
  ];

  const taluksByDistrict = { 
    "Tiruppur": ["Tiruppur", "Dharapuram", "Kangayam", "Madathukulam", "Palladam", "Udumalaipettai"],
    "Ariyalur": ["Ariyalur", "Sendurai", "Udayarpalayam"], 
    "Chengalpattu": ["Chengalpattu", "Chithamur", "Madurantakam", "Pallavaram", "Tambaram", "Tirukalukundram", "Vandalur"],
    "Chennai": ["Ambattur", "Alandur", "Egmore", "Guindy", "Mambalam", "Perambur", "Purasawalkam", "Tondiarpet"], 
    "Coimbatore": ["Coimbatore North", "Coimbatore South", "Madukkarai", "Perur", "Sulur", "Pollachi", "Valparai"],
    "Cuddalore": ["Cuddalore", "Chidambaram", "Kattumannarkoil", "Panruti", "Tittakudi", "Vriddhachalam"],
    "Dharmapuri": ["Dharmapuri", "Harur", "Karimangalam", "Nallampalli", "Palacode", "Pappireddipatti"], 
    "Dindigul": ["Dindigul", "Athoor", "Gujiliamparai", "Kodaikanal", "Natham", "Nilakkottai", "Palani", "Vedasandur"], 
    "Erode": ["Erode", "Bhavani", "Gobichettipalayam", "Kodumudi", "Perundurai", "Sathyamangalam"], 
    "Kallakurichi": ["Kallakurichi", "Chinnasalem", "Kalvarayan Hills", "Sankarapuram", "Tirukoyilur", "Ulundurpettai"], 
    "Kanchipuram": ["Kanchipuram", "Cheyyur", "Kundrathur", "Maduranthakam", "Sriperumbudur", "Uthiramerur", "Walajabad"], 
    "Kanyakumari": ["Agastheeswaram", "Kalkulam", "Thovalai", "Vilavancode"],
    "Karur": ["Karur", "Aravakurichi", "Kadavur", "Kulithalai", "Krishnarayapuram", "Pugalur"],
    "Krishnagiri": ["Krishnagiri", "Bargur", "Hosur", "Pochampalli", "Uthangarai"],
    "Madurai": ["Madurai North", "Madurai South", "Melur", "Peraiyur", "Thirumangalam", "Usilampatti", "Vadipatti"],
    "Mayiladuthurai": ["Mayiladuthurai", "Kuthalam", "Sirkazhi", "Tharangambadi"],
    "Nagapattinam": ["Nagapattinam", "Kilvelur", "Thirukkuvalai", "Vedaranyam"],
    "Namakkal": ["Namakkal", "Kolli Hills", "Paramathi Velur", "Rasipuram", "Tiruchengode"],
    "Nilgiris": ["Udhagamandalam", "Coonoor", "Gudalur", "Kotagiri", "Kundah"],
    "Perambalur": ["Perambalur", "Alathur", "Kunnam", "Veppanthattai"],
    "Pudukkottai": ["Pudukkottai", "Alangudi", "Aranthangi", "Avudaiyarkoil", "Gandarvakottai", "Illuppur", "Karambakudi"], 
    "Ramanathapuram": ["Ramanathapuram", "Kadaladi", "Kamuthi", "Mudukulathur", "Paramakudi", "Rameswaram", "Tiruvadanai"], 
    "Ranipet": ["Ranipet", "Arakkonam", "Arcot", "Nemili", "Sholinghur", "Walajah"],
    "Salem": ["Salem", "Attur", "Gangavalli", "Mettur", "Omalur", "Sankagiri", "Yercaud"], 
    "Sivaganga": ["Sivaganga", "Devakottai", "Ilayangudi", "Kalaiyarkoil", "Karaikudi", "Manamadurai", "Singampunari"],
    "Tenkasi": ["Tenkasi", "Kadayanallur", "Sankarankovil", "Shenkottai", "Veerakeralamputhur"],
    "Thanjavur": ["Thanjavur", "Budalur", "Orathanadu", "Pattukkottai", "Peravurani", "Thiruvaiyaru", "Thiruvidaimarudur"], 
    "Theni": ["Theni", "Aandipatti", "Bodinayakanur", "Periyakulam", "Uthamapalayam"],
    "Thoothukudi": ["Thoothukudi", "Ettayapuram", "Kovilpatti", "Ottapidaram", "Sathankulam", "Srivaikuntam", "Tiruchendur", "Vilathikulam"], 
    "Tiruchirappalli": ["Tiruchirappalli", "Lalgudi", "Manachanallur", "Manapparai", "Srirangam", "Thottiyam", "Thuraiyur"], 
    "Tirunelveli": ["Tirunelveli", "Ambasamudram", "Cheranmahadevi", "Nanguneri", "Palayamkottai", "Radhapuram", "Sankarankovil"],
    "Tirupathur": ["Tirupathur", "Ambur", "Natrampalli", "Vaniyambadi"],
    "Tiruvallur": ["Tiruvallur", "Ambattur", "Gummidipoondi", "Ponneri", "Poonamallee", "R.K.Pet", "Tiruttani"], 
    "Tiruvannamalai": ["Tiruvannamalai", "Chengam", "Cheyyar", "Jamunamarathur", "Kilpennathur", "Polur", "Thandarampattu", "Vandavasi"], 
    "Tiruvarur": ["Tiruvarur", "Kodavasal", "Koothanallur", "Mannargudi", "Nannilam", "Needamangalam", "Thiruthuraipoondi", "Valangaiman"],
    "Vellore": ["Vellore", "Anaicut", "Gudiyatham", "K.V.Kuppam", "Katpadi", "Wallajah"],
    "Viluppuram": ["Viluppuram", "Gingee", "Kandachipupram", "Marakkanam", "Sankarapuram", "Tindivanam", "Tirukkoyilur", "Vanur"],
    "Virudhunagar": ["Virudhunagar", "Aruppukkottai", "Kariapatti", "Rajapalayam", "Sattur", "Sivakasi", "Srivilliputhur", "Tiruchuli"] 
  };

  const reasonOptions = [
    "Order of Appellate Authorities",
    "Court Auction Sale",
    "Legal Heir",
    "Settlement Deed",
    "Gift Deed",
    "Sale Deed",
    "Partition Deed"
  ];

  // Handlers for existing forms
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setCurrentStep(1);
    setShowSuccess(false);
    setShowPaymentUpload(false);
  };

  const handleCANSuccess = (hasCANValue) => {
    if (hasCANValue === true) {
      setShowSuccess(true);
      setSelectedService("");
      setCurrentStep(1);
      setHasCAN(null);
      setCanNumber("");
    } else if (hasCANValue === false) {
      setCurrentStep(2);
    }
  };

  const handleStep1Submit = () => {
    if (!formData.name || !formData.aadharNumber || !formData.mobileNumber) {
      alert("Please fill all required fields");
      return;
    }
    setCurrentStep(3);
  };

  const handleStep2Submit = () => {
    if (!formData.pattaOption || !formData.district || !formData.taluk || !formData.village) {
      alert("Please fill all required fields");
      return;
    }
    setCurrentStep(4);
  };

  const handleStep3Submit = () => {
    if (!formData.surveyNo || !formData.subDivisionNo || !formData.sroName || !formData.regDocNo || !formData.landCategory) {
      alert("Please fill all required land details");
      return;
    }
    setCurrentStep(5);
  };

  const handleImageUpload = (files) => {
    if (!Array.isArray(files)) return;
    if (uploadedImages.length + files.length > 8) {
      alert("You can only upload up to 8 documents");
      return;
    }
    const newImages = files.map(fileObj => ({
      ...fileObj,
      preview: URL.createObjectURL(fileObj.file)
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      if (newImages[index].preview) URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleReviewSubmit = () => setCurrentStep(6);

  const handleFinalSubmit = async () => {
    try {
      const requiredDocumentIds = [1,2,3,4,5];
      const uploadedDocumentIds = uploadedImages.map(img => img.documentType);
      const allRequiredUploaded = requiredDocumentIds.every(id => uploadedDocumentIds.includes(id));
      if (!allRequiredUploaded) {
        alert("Please upload all required documents (Documents 1-5)");
        return;
      }
      const submissionData = { ...formData, hasCAN, canNumber };
      const formDataToSend = new FormData();
      formDataToSend.append('applicationData', JSON.stringify(submissionData));
      uploadedImages.forEach(img => {
        formDataToSend.append('documents', img.file);
        formDataToSend.append('documentTypes', img.documentType);
      });
      const response = await fetch('http://localhost:5000/api/applications/submit', {
        method: 'POST',
        body: formDataToSend
      });
      const result = await response.json();
      if (result.success) {
        alert("Patta application submitted successfully!");
        setShowSuccess(true);
        setSelectedService("");
        setHasCAN(null);
        setCanNumber("");
        setCurrentStep(1);
        setUploadedImages([]);
        setFormData({
          name: "",
          aadharName: "",
          aadharNumber: "",
          fatherName: "",
          motherName: "",
          dob: "",
          address: "",
          mobileNumber: "",
          pattaOption: "",
          district: "",
          taluk: "",
          village: "",
          areaType: "",
          reason: "",
          surveyNo: "",
          subDivisionNo: "",
          sroName: "",
          regDocNo: "",
          registeredDate: "",
          landCategory: "",
          pattaNo: "",
          landType: "",
          extentHec: "",
          extentAres: ""
        });
      } else {
        alert("Failed to submit application: " + result.message);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert("Error submitting application. Please try again.");
    }
  };

  const handleReasonChange = (reasonValue, isChecked) => {
    setFormData(prev => {
      const currentReasons = prev.reason ? prev.reason.split(', ') : [];
      if (isChecked) {
        return { ...prev, reason: [...currentReasons, reasonValue].join(', ') };
      } else {
        return { ...prev, reason: currentReasons.filter(r => r !== reasonValue).join(', ') };
      }
    });
  };

  const goToPreviousStep = () => setCurrentStep(prev => prev - 1);

  // Payment Upload Handlers - Corrected version
  const handlePaymentSubmit = async () => {
    if (!paymentName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!paymentMobile.trim()) {
      alert('Please enter your mobile number');
      return;
    }
    
    if (!paymentFile) {
      alert('Please select a payment screenshot');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', paymentName);
      formData.append('mobileNumber', paymentMobile);
      formData.append('paymentFile', paymentFile);

      const response = await fetch('http://localhost:5000/api/payments/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        setPaymentSuccess(true);
        // Reset form after 3 seconds and redirect
        setTimeout(() => {
          setPaymentSuccess(false);
          setShowPaymentUpload(false);
          setPaymentName('');
          setPaymentMobile('');
          setPaymentFile(null);
        }, 3000);
      } else {
        alert('Payment submission failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Error submitting payment. Please try again.');
    }
  };

  const handleBackToDashboard = () => {
    setShowPaymentUpload(false);
    setPaymentName('');
    setPaymentMobile('');
    setPaymentFile(null);
    setPaymentSuccess(false);
  };

  // Button click animation handler
  const handleAnimatedClick = (callback, event) => {
    const button = event.currentTarget;
    button.classList.add('animate-pulse');
    setTimeout(() => {
      button.classList.remove('animate-pulse');
      callback();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="Star Mobile Logo" 
                className="h-10 w-10 mr-2 rounded-full" 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Star Mobile</h1>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={(e) => handleAnimatedClick(() => navigate("/"), e)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm shadow-md"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* Payment Upload Section */}
        {showPaymentUpload && (
          <div className="bg-white p-8 rounded-2xl shadow-2xl mb-8 border border-green-200 transform transition-all duration-300 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                {paymentSuccess ? "Payment Upload Successful!" : "Upload Payment Screenshot"}
              </h2>
              <button
                onClick={(e) => handleAnimatedClick(handleBackToDashboard, e)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm shadow-md"
              >
                Back to Dashboard
              </button>
            </div>
            
            {paymentSuccess ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Uploaded Successfully!</h3>
                <p className="text-gray-600">Your payment screenshot has been submitted successfully.</p>
                <p className="text-gray-600">Redirecting back to dashboard...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={paymentName}
                    onChange={(e) => setPaymentName(e.target.value)}
                    className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={paymentMobile}
                    onChange={(e) => setPaymentMobile(e.target.value)}
                    className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Screenshot *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPaymentFile(e.target.files[0])}
                    className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
                <div className="flex justify-between space-x-4">
                  <button
                    onClick={(e) => handleAnimatedClick(handlePaymentSubmit, e)}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 active:scale-95 flex-1 shadow-lg font-semibold"
                  >
                    Submit Payment
                  </button>
                  <button
                    onClick={(e) => handleAnimatedClick(handleBackToDashboard, e)}
                    className="bg-gray-400 text-white px-6 py-3 rounded-xl hover:bg-gray-500 transition-all duration-300 transform hover:scale-105 active:scale-95 flex-1 shadow-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Service Selection Cards - Centered and Larger */}
        {(!selectedService || showSuccess) && !showPaymentUpload && (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="grid grid-cols-1 gap-8 w-full max-w-2xl">
              {/* Patta Services Card */}
              <div className="bg-white p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-orange-100">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-4xl">🏠</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                    Patta Services
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    Comprehensive land records management, patta transfer services, and property registration assistance with expert guidance.
                  </p>
                  <button 
                    onClick={(e) => handleAnimatedClick(() => handleServiceSelect("patta"), e)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg font-semibold shadow-lg w-full max-w-xs mx-auto"
                  >
                    Start Patta Service
                  </button>
                </div>
              </div>

              {/* Upload Payment Card */}
              <div className="bg-white p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-green-100">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-4xl">💳</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                    Payment Upload
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    Securely upload your payment confirmation screenshots for quick processing and verification of your transactions.
                  </p>
                  <button 
                    onClick={(e) => handleAnimatedClick(() => { setShowPaymentUpload(true); setSelectedService(""); }, e)}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg font-semibold shadow-lg w-full max-w-xs mx-auto"
                  >
                    Upload Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render steps */}
        {selectedService && currentStep === 1 && (
          <CANStep 
            hasCAN={hasCAN}
            setHasCAN={setHasCAN}
            canNumber={canNumber}
            setCanNumber={setCanNumber}
            onSuccess={handleCANSuccess}
          />
        )}
        {selectedService && currentStep === 2 && (
          <PersonalDetailsStep 
            formData={formData}
            handleInputChange={handleInputChange}
            handleStep1Submit={handleStep1Submit}
            goToPreviousStep={goToPreviousStep}
          />
        )}
        {selectedService && currentStep === 3 && (
          <PattaOptionsStep 
            formData={formData}
            handleInputChange={handleInputChange}
            handleStep2Submit={handleStep2Submit}
            districts={districts}
            taluksByDistrict={taluksByDistrict}
            reasonOptions={reasonOptions}
            handleReasonChange={handleReasonChange}
            hasCAN={hasCAN}
            goToPreviousStep={goToPreviousStep}
          />
        )}
        {selectedService && currentStep === 4 && (
          <LandDetailsStep 
            formData={formData}
            handleInputChange={handleInputChange}
            handleLandDetailsSubmit={handleStep3Submit}
            goToPreviousStep={goToPreviousStep}
          />
        )}
        {selectedService && currentStep === 5 && (
          <DocumentUploadStep 
            uploadedImages={uploadedImages}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            goToPreviousStep={goToPreviousStep}
            handleReviewSubmit={handleReviewSubmit}
          />
        )}
        {selectedService && currentStep === 6 && (
          <ReviewSubmitStep 
            formData={formData}
            uploadedImages={uploadedImages}
            goToPreviousStep={goToPreviousStep}
            handleFinalSubmit={handleFinalSubmit}
          />
        )}
      </main>

      {/* Footer Content in 4 Columns */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              <img 
                src={logo} 
                alt="Star Mobile Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold">Star Mobile</span>
            </div>
          </div>

          {/* Footer Content in 4 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Services */}
            <div className="flex flex-col items-center text-center">
              <h4 className="font-bold mb-2">Services</h4>
              <p className="text-sm text-gray-300">Patta Services</p>
              <p className="text-sm text-gray-300">Ticket Booking</p>
              <p className="text-sm text-gray-300">Xerox Services</p>
              <p className="text-sm text-gray-300">E-Sevai Maiyam</p>
              <p className="text-sm text-gray-300">Mobile Recharge</p>
              <p className="text-sm text-gray-300">Bill Payments</p>
            </div>

            {/* Location */}
            <div className="flex flex-col items-center text-center">
              <h4 className="font-bold mb-2">Location</h4>
              <p className="text-sm text-gray-300">Tiruppur main road, Sivanmalai, Kangayam</p>
            </div>

            {/* Timing */}
            <div className="flex flex-col items-center text-center">
              <h4 className="font-bold mb-2">Timing</h4>
              <p className="text-sm text-gray-300">Mon-Sat: 9:00 AM - 8:00 PM</p>
            </div>

            {/* Contact */}
            <div className="flex flex-col items-center text-center">
              <h4 className="font-bold mb-2">Contact</h4>
              <p className="text-sm text-gray-300">📞 +91 9943275557</p>
              <p className="text-sm text-gray-300">✉️ star.siv96@gmail.com</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-6 pt-4 text-center">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Star Mobile. All rights reserved. | Designed with ❤️ for our customers
            </p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
     
    </div>
  );
};

export default UserDashboard;