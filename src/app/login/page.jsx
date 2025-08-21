"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { MailIcon, LockIcon } from "lucide-react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
const roles = ["Patient", "Doctor", "Pathlab"];
import axios from "axios";
import imageCompression from 'browser-image-compression';

const IconInput = ({ icon: Icon, onKeyDown, ...props }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      <Icon size={16} />
    </span>
    <Input
      className="pl-10 py-6 rounded-full bg-gray-100 text-sm"
      onKeyDown={onKeyDown}
      {...props}
    />
  </div>
);

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(0);

  // Individual form states
  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: "",
    bloodType: "",
    allergies: "",
    medications: "",
    weight: "",
    height: "",
    age: "",
    password: "",
    profilePic: null,
  });

  const [doctorData, setDoctorData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    phone: "",
    qualification: "",
    experience: "",
    hospital: "",
    address: "",
    languages: "",
    consultationFees: "",
    achievements: "",
    college: "",
    pastHospitals: "",
    profilePic: null,
  });

  const [pathlabData, setPathlabData] = useState({
    labName: "",
    email: "",
    password: "",
    phone: "",
    labAddress: "",
    profilePic: null,
  });

  const getFormData = () => {
    if (role === "Patient") return patientData;
    if (role === "Doctor") return doctorData;
    if (role === "Pathlab") return pathlabData;
    return {};
  };

  const setFormData = (data) => {
    if (role === "Patient") setPatientData((prev) => ({ ...prev, ...data }));
    if (role === "Doctor") setDoctorData((prev) => ({ ...prev, ...data }));
    if (role === "Pathlab") setPathlabData((prev) => ({ ...prev, ...data }));
  };

  const handleChange = (field, value) => {
    setFormData({ [field]: value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNextStep(); // Go to next step
    }
  };

  const handleImageChange = async (file) => {
    const options = {
      maxSizeMB: 9, // max size in mb
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      setFormData({ profilePic: compressedFile });
    } catch (error) {
      console.error("Image compression error:", error);
    }
  };

  const getSignupSteps = () => {
    switch (role) {
      case "Patient":
        return [
          { label: "Name", field: "name", type: "text", required: true },
          { label: "Email", field: "email", type: "email", required: true },
          { label: "Phone", field: "phone", type: "tel", required: true },
          { label: "Address", field: "address", type: "text" },
          {
            label: "Emergency Contact",
            field: "emergencyContact",
            type: "tel",
          },
          {
            label: "Blood Type",
            field: "bloodType",
            type: "select",
            options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true,
          },
          { label: "Allergies", field: "allergies", type: "text" },
          { label: "Medications", field: "medications", type: "text" },
          { label: "Weight (Kg)", field: "weight", type: "number" },
          { label: "Height (cm)", field: "height", type: "number" },
          { label: "Age (Years)", field: "age", type: "number", min: 0 },
          {
            label: "Password",
            field: "password",
            type: "password",
            required: true,
          },
          { label: "Profile Picture", field: "profilePic", type: "image" },
        ];

      case "Doctor":
        return [
          { label: "Name", field: "name" },
          { label: "Email", field: "email" },
          { label: "Password", field: "password", type: "password" },
          { label: "Specialization", field: "specialization" },
          { label: "Phone", field: "phone" },
          { label: "Qualification", field: "qualification" },
          { label: "Experience", field: "experience" },
          { label: "Hospital", field: "hospital" },
          { label: "Address", field: "address" },
          { label: "Languages", field: "languages" },
          {
            label: "Consultation Fees",
            field: "consultationFees",
            type: "number",
            min: 0,
          },
          { label: "Achievements", field: "achievements" },
          { label: "College", field: "college" },
          { label: "Past Hospitals", field: "pastHospitals" },
          { label: "Profile Picture", field: "profilePic", type: "image" },
        ];
      case "Pathlab":
        return [
          { label: "Lab Name", field: "labName" },
          { label: "Email", field: "email" },
          { label: "Password", field: "password", type: "password" },
          { label: "Phone", field: "phone" },
          { label: "Lab Address", field: "labAddress" },
          { label: "Profile Picture", field: "profilePic", type: "image" },
        ];
      default:
        return [];
    }
  };

  const steps = getSignupSteps();
  const currentData = getFormData();

  const handleLogin = async () => {
    const { email, password } = currentData;

    try {
      if (role === "Patient") {
        Cookies.remove("healthChatMessages");
        await loginPatient(email, password);
        
      } else if (role === "Doctor") {
        await loginDoctor(email, password);
      }
      else if (role === "Pathlab") {
        await loginPathlab(email, password);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSignup = async () => {
    try {
      if (role === "Patient") {
        await signupPatient(patientData);
      } else if (role === "Doctor") {
        await signupDoctor(doctorData);
      }
      else if (role === "Pathlab") {
        await signupPathlab(pathlabData);
      }
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  const loginPatient = async (email, password) => {
    try {
      const response = await axios.post("/api/user/login", {
        email,
        password,
      });

      const data = response.data;
      // console.log("Login Response:", data);

      if (data.success) {
        // Save token if needed
        localStorage.setItem("token", data.token);
        toast.success("Successfully Logged In");
        // router.push("/user/home");
        window.location.href = "/user/home";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const loginDoctor = async (email, password) => {
    try {
      const response = await axios.post("/api/doctor/login", {
        email,
        password,
      });

      const data = response.data;
      // console.log("Login Response:", data);

      if (data.success) {
        // Save token if needed
        localStorage.setItem("drtoken", data.token);
        toast.success("Successfully Logged In");
        // router.push("/doctor/home");
        // here we have changed the direct routing to refreshed routing because there was a bug that all time same user details are displayed
        window.location.href = "/doctor/home";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  const loginPathlab = async (email, password) => {
    try {
      const response = await axios.post("/api/pathlab/login", {
        email,
        password,
      });

      const data = response.data;
      console.log("Login Response:", data);

      if (data.success) {
        // Save token if needed
        localStorage.setItem("pttoken", data.token);
        toast.success("Successfully Logged In");
        // router.push("/pathlab/home");
        window.location.href = "/pathlab/home";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const signupPatient = async (data) => {
    try {
      const formData = new FormData();

      // Append all fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      const response = await axios.post("/api/user/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // console.log("Patient created:", response.data);
        toast.success("Account Created Successfully Now login");
        // since it is signed up so move it to login mode
        setMode("login");
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };
  const signupPathlab = async (data) => {
    try {
      const formData = new FormData();

      // Append all fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      const response = await axios.post("/api/pathlab/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // console.log("pathlab signup:", response.data);
        toast.success("Account Created Successfully Now login");
        setMode("login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const signupDoctor = async (data) => {
    try {
      const formData = new FormData();

      // Append all fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      const response = await axios.post("/api/doctor/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // console.log("doctor created:", response.data);
        toast.success("Account Created Successfully Now Login!!");
        setMode("login");
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setStep(0);
  };

  // Remove FloatingBlobs for a more professional look
  const handleNextStep = () => {
    if (step >= steps.length) {
      if (mode === "signup") {
        handleSignup();
      }
      return;
    }

    const currentField = steps[step].field;
    const isImageField = steps[step].type === "image";
    const currentLabel = steps[step].label;

    if (isImageField) {
      if (!currentData.profilePic) {
        setErrorMessage("Please upload a profile picture or click Skip.");
        return;
      }
    } else {
      const value = currentData[currentField];

      if (!value) {
        setErrorMessage(`${currentLabel} is required.`);
        return;
      }

      if (currentField === "phone" || currentField === "emergencyContact") {
        const isNumeric = /^\d{10,15}$/.test(value);
        if (!isNumeric) {
          setErrorMessage("Please enter a valid phone number.");
          return;
        }
      }

      if (currentField === "email") {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!isValidEmail) {
          setErrorMessage("Please enter a valid email address.");
          return;
        }
      }
    }

    setErrorMessage("");
    setStep((prev) => prev + 1);
  };

  return (
  <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-50 overflow-hidden font-sans px-2 sm:px-4 md:px-6">
      {/* Animated floating glass blobs */}
  <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-gradient-to-br from-blue-200/30 via-blue-100/20 to-white/10 rounded-full blur-2xl animate-pulse-slow z-0" />
  <div className="absolute bottom-0 right-0 w-[320px] h-[320px] bg-gradient-to-tr from-blue-300/20 via-blue-200/10 to-white/5 rounded-full blur-xl animate-pulse-slower z-0" />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/10 via-blue-50/10 to-white/5 rounded-full blur-[100px] z-0" />

      {/* Glassmorphic Card */}
  <div className="relative z-10 w-full max-w-md mx-auto rounded-3xl shadow-2xl bg-white/60 dark:bg-blue-950/60 backdrop-blur-2xl border border-blue-300/60 dark:border-blue-800/60 p-4 sm:p-8 md:p-12 flex flex-col items-center gap-8 animate-fade-in ring-2 ring-blue-200/40 dark:ring-blue-900/40 ring-offset-2 ring-offset-blue-100 dark:ring-offset-blue-950 transition-all duration-300 sm:mx-4 md:mx-6" style={{boxShadow: '0 8px 32px 0 rgba(37,99,235,0.12), 0 1.5px 8px 0 rgba(37,99,235,0.10)'}}> 
        {/* Glowing Rakshaa Logo/Text */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl sm:text-5xl font-black text-blue-700 dark:text-blue-200 tracking-tight">
            Rakshaa
          </span>
          <span className="text-base sm:text-lg font-medium text-blue-900/80 dark:text-blue-100/80 tracking-widest uppercase letter-spacing-[0.2em]">
            Secure Healthcare Portal
          </span>
        </div>
        <div className="w-full">
            {!role ? (
              <>
                <h2 className="text-xl sm:text-2xl font-semibold text-center text-blue-900 dark:text-blue-100 mb-6 tracking-wide">
                  Select Your Role
                </h2>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full">
                    {roles.map((r) => (
                      <Button
                        key={r}
                        variant="outline"
                        className="rounded-xl border-2 border-blue-400/70 text-blue-800 dark:text-blue-200 bg-white/70 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800/80 shadow font-semibold w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg transition-all duration-200 cursor-pointer hover:text-blue-700"
                        onClick={() => setRole(r)}
                      >
                        {r}
                      </Button>
                    ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-center text-blue-900 dark:text-blue-100 mb-6 font-sans tracking-tight animate-fade-in">
                  {mode === "login" ? "Welcome Back" : `${role} Signup`}
                </h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-sm text-gray-500">Role:</span>
                  <select
                    className="text-base border-2 border-blue-300/60 rounded-xl px-4 py-2 text-blue-800 dark:text-blue-200 bg-white/60 dark:bg-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold shadow-sm"
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {mode === "login" ? (
                  <div className="space-y-4">
                    <IconInput
                      icon={MailIcon}
                      placeholder="Your Email"
                      value={currentData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <IconInput
                      icon={LockIcon}
                      placeholder="Your Password"
                      type="password"
                      value={currentData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                      <label className="flex items-center gap-1 sm:gap-2">
                        <input type="checkbox" className="accent-blue-500" />
                        Remember me
                      </label>
                      <a href="/forgot-password" className="text-blue-600 hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 sm:py-6 text-lg font-bold tracking-wide shadow-lg transition-all duration-200 border border-blue-700/20"
                      onClick={handleLogin}
                    >
                      LOGIN
                    </Button>
                    <p className="text-center text-base mt-4 text-blue-900/80 dark:text-blue-100/80">
                      Don’t have an account?{' '}
                      <span
                        className="text-blue-700 cursor-pointer hover:underline font-semibold"
                        onClick={() => {
                          setMode("signup");
                          setStep(0);
                        }}
                      >
                        Signup
                      </span>
                    </p>
                  </div>
                ) : (
                  <>
                    <Progress
                      value={(step / (steps.length - 1)) * 100}
                      className="mb-4 bg-blue-200 dark:bg-blue-900 h-2 rounded-full shadow-inner"
                    />
                    <div className="space-y-4">
                      {steps[step] && steps[step].type === "image" ? (
                        <div className="space-y-2">
                          <div className="flex flex-col items-center space-y-4">
                            <label
                              htmlFor="profile-upload"
                              className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-blue-400/60 flex items-center justify-center cursor-pointer hover:bg-blue-100/60 dark:hover:bg-blue-900/60 transition-all bg-white/50 dark:bg-blue-950/40 shadow-inner animate-fade-in"
                            >
                              {currentData.profilePic ? (
                                <img
                                  src={URL.createObjectURL(
                                    currentData.profilePic
                                  )}
                                  alt="Profile"
                                  className="w-full h-full object-cover rounded-2xl"
                                />
                              ) : (
                                <span className="text-center text-xs sm:text-sm text-blue-500 px-2">
                                  Click to upload
                                </span>
                              )}
                              <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleImageChange(e.target.files[0])
                                }
                              />
                            </label>
                            {currentData.profilePic && (
                              <p className="text-xs sm:text-sm text-blue-600 text-center truncate max-w-xs">
                                {currentData.profilePic.name}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {steps[step].type === "select" ? (
                            <div className="relative w-full">
                              <select
                                className={`w-full py-3 px-4 pr-10 rounded-xl bg-white/70 dark:bg-blue-900/60 text-blue-900 dark:text-white text-base font-semibold border-2 ${errorMessage
                                  ? "border-red-500"
                                  : "border-blue-400 dark:border-blue-700"
                                  } shadow-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 appearance-none cursor-pointer outline-none hover:bg-blue-50/80 dark:hover:bg-blue-800/60`}
                                value={currentData[steps[step].field] || ""}
                                onChange={(e) =>
                                  handleChange(steps[step].field, e.target.value)
                                }
                              >
                                <option value="" className="text-blue-400 font-normal">
                                  Select {steps[step].label}
                                </option>
                                {steps[step].options.map((option) => (
                                  <option key={option} value={option} className="text-blue-900 dark:text-white font-semibold">
                                    {option}
                                  </option>
                                ))}
                              </select>
                              {/* Custom arrow icon */}
                              <div className="pointer-events-none absolute top-1/2 right-4 transform -translate-y-1/2 text-blue-400 dark:text-blue-200 text-xl">
                                ▼
                              </div>
                            </div>
                          ) : (
                            <Input
                              placeholder={steps[step].label}
                              type={steps[step].type || "text"}
                              value={currentData[steps[step].field] || ""}
                              onChange={(e) =>
                                handleChange(steps[step].field, e.target.value)
                              }
                              onKeyDown={handleKeyDown}
                              className={`py-4 rounded-xl bg-white/80 dark:bg-blue-900/60 text-base text-blue-900 dark:text-white border-2 ${errorMessage ? "border-red-500" : "border-blue-200 dark:border-blue-700"} shadow-sm focus:ring-2 focus:ring-blue-400`}
                            />
                          )}
                          {errorMessage && (
                            <p className="text-red-500 text-xs sm:text-sm ml-2">
                              {errorMessage}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between">
                        <Button
                          variant="ghost"
                          disabled={step === 0}
                          onClick={() => setStep((prev) => prev - 1)}
                          className="text-xs sm:text-sm"
                        >
                          Back
                        </Button>
                        {step === steps.length - 1 ? (
                          <Button
                            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm"
                            onClick={handleSignup}
                          >
                            Submit
                          </Button>
                        ) : (
                          <Button
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm"
                            onClick={handleNextStep}
                          >
                            Next
                          </Button>
                        )}
                      </div>
                      <p className="text-center text-xs sm:text-sm mt-2 sm:mt-4">
                        Already have an account?{" "}
                        <span
                          className="text-blue-600 cursor-pointer hover:underline"
                          onClick={() => setMode("login")}
                        >
                          Login
                        </span>
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
        </div>
      </div>
    </div>
  );
}
