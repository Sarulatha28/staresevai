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

  const services = [
    "Patta Services",
    "Ticket Booking",
    "Xerox Services",
    "E-Sevai Maiyam Services",
    "Mobile Recharge",
    "Bill Payments"
  ];

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
    if (!Array.isArray(files)) {
      console.error("Invalid argument passed to handleImageUpload");
      return;
    }
    
    if (uploadedImages.length + files.length > 8) {
      alert("You can only upload up to 8 documents");
      return;
    }
    
    const newImages = files.map(fileObj => {
      const previewUrl = URL.createObjectURL(fileObj.file);
      return {
        ...fileObj,
        preview: previewUrl
      };
    });
    
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      if (newImages[index].preview) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleReviewSubmit = () => {
    setCurrentStep(6);
  };

  // Combined fetch function for final submission
  const handleFinalSubmit = async () => {
    try {
      // Check if all required documents are uploaded (documents 1-5)
      const requiredDocumentIds = [1, 2, 3, 4, 5];
      const uploadedDocumentIds = uploadedImages.map(img => img.documentType);
      const allRequiredUploaded = requiredDocumentIds.every(id => 
        uploadedDocumentIds.includes(id)
      );
      
      if (!allRequiredUploaded) {
        alert("Please upload all required documents (Documents 1-5)");
        return;
      }

      // Prepare form data for submission
      const submissionData = {
        ...formData,
        hasCAN: hasCAN,
        canNumber: canNumber
      };

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('applicationData', JSON.stringify(submissionData));
      
      // Append files with their document types
      uploadedImages.forEach((image, index) => {
        formDataToSend.append('documents', image.file);
        formDataToSend.append('documentTypes', image.documentType);
      });

      // Submit to backend
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
        return {
          ...prev,
          reason: [...currentReasons, reasonValue].join(', ')
        };
      } else {
        return {
          ...prev,
          reason: currentReasons.filter(r => r !== reasonValue).join(', ')
        };
      }
    });
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="Star Mobile Logo" 
                className="h-10 w-10 mr-2" 
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Star Mobile</h1>
          </div>

          <button
            onClick={() => navigate("/")}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
          >
            Back to Home
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Star Mobile Services</h2>
          <p className="text-lg text-gray-600">Patta and Land Record Services</p>
        </div>

        {(!selectedService || showSuccess) && (
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Patta Services</h3>
                <p className="text-gray-600 mb-4">Land records, patta transfer, and registration</p>
                <button 
                  onClick={() => handleServiceSelect("patta")}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
                >
                  Start Patta Service
                </button>
              </div>
            </div>
          </div>
        )}

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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Our Location</h3>
            <div className="space-y-2">
              <p className="text-blue-800 font-medium">Star Mobile</p>
              <p className="text-blue-700">Near Sobha Bakery</p>
              <p className="text-blue-700">Sivanmalai, Kangayam</p>
              <p className="text-blue-600 text-sm">Tiruppur District, Tamil Nadu</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <p className="text-gray-300">Email: info@starmobile.com</p>
              <p className="text-gray-300">Phone: +91 9876543210</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
              <p className="text-gray-300">Monday - Saturday: 9:00 AM - 8:00 PM</p>
              <p className="text-gray-300">Sunday: 10:00 AM - 6:00 PM</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="text-gray-300 space-y-1">
                <li>Patta Services</li>
                <li>Mobile Recharge</li>
                <li>Bill Payments</li>
                <li>Xerox Services</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">&copy; 2024 Star Mobile. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;