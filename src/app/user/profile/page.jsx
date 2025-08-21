"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import ChatButton from "@/components/chatbutton";
import { toast } from "react-toastify";

function MyProfile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const { user, loading } = useUser();
  // console.log("user details", user);
  const [userDetails, setUserDetails] = React.useState(null);

  React.useEffect(() => {
    if (user) {
      setUserDetails({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        emergencyContact: user.emergencyContact || "",
        bloodType: user.bloodType || "",
        allergies: user.allergies || "",
        medications: user.medications || "",
        weight: user.weight || "",
        height: user.height || "",
        age: user.age || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSaveChanges = async () => {
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          ...userDetails,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Profile Updated!!");
        setIsEditing(false);
        router.push("/user/profile");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("An error occurred. Please try again.");
    }
  };

  if (loading || !userDetails) {
    return (
      <div className="flex justify-center items-center py-20 min-h-screen bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#1e293b] dark:via-[#334155] dark:to-[#1e293b]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#2563eb] border-dashed rounded-full animate-spin dark:border-[#60a5fa]"></div>
          <p className="text-[#2563eb] dark:text-[#60a5fa] text-lg font-semibold animate-pulse">
            Loading Profile Details...
          </p>
        </div>
      </div>
    );
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <>
      <UserNavbar />
      <div className="relative min-h-screen bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#1e293b] dark:via-[#334155] dark:to-[#1e293b] pt-28 px-4 pb-8">
        {/* Decorative SVG background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg width="100%" height="100%" className="opacity-10 dark:opacity-10">
            <defs>
              <radialGradient id="profile-bg" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#profile-bg)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          {isEditing ? (
            <div className="glassmorphic bg-white/95 dark:bg-[#f3f4f6]/95 p-12 rounded-3xl shadow-2xl border border-[#c7d2fe] dark:border-[#60a5fa] transition-all duration-300">
              <h2 className="text-4xl font-extrabold text-[#2563eb] dark:text-[#2563eb] mb-10 text-center tracking-tight drop-shadow-glow">
                Edit Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {userDetails &&
                  Object.entries(userDetails).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <label className="block text-[#2563eb] dark:text-[#2563eb] font-semibold mb-2 capitalize tracking-wide">
                        {key.replace(/([A-Z])/g, " $1")}:
                      </label>
                      <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-[#f8fafc] dark:bg-[#e0e7ef] text-[#2563eb] dark:text-[#2563eb] border border-[#c7d2fe] dark:border-[#60a5fa] focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition shadow-sm"
                      />
                    </div>
                  ))}
              </div>
              <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
                <Button
                  onClick={handleSaveChanges}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-10 py-3 rounded-full font-semibold shadow-lg transition text-lg"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={toggleEdit}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-10 py-3 rounded-full font-semibold shadow-lg transition text-lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row-reverse gap-12">
              {/* Profile Section */}
              <div className="glassmorphic bg-white/95 dark:bg-[#f3f4f6]/95 p-10 rounded-3xl w-full lg:w-1/3 shadow-2xl border border-[#c7d2fe] dark:border-[#60a5fa] flex flex-col items-center transition-all duration-300">
                <div className="flex flex-col items-center mb-8">
                  <div className="relative mb-3">
                    <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#2563eb] to-[#60a5fa] blur-sm opacity-30"></span>
                    <img
                      src={user.profilePic}
                      alt="User"
                      className="w-36 h-36 rounded-full object-cover border-4 border-[#2563eb] shadow-xl relative z-10"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-[#2563eb] dark:text-[#2563eb] mb-1 tracking-tight text-center">
                    {userDetails?.name}
                  </h2>
                  <p className="text-base text-[#2563eb] dark:text-[#2563eb] opacity-80 text-center">
                    {userDetails?.email}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8 w-full">
                  <Button
                    onClick={() => handleLogout()}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full w-full sm:w-auto font-semibold shadow-md transition"
                  >
                    Logout
                  </Button>
                  <Button
                    onClick={toggleEdit}
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-2 rounded-full w-full sm:w-auto font-semibold shadow-md transition"
                  >
                    Edit Profile
                  </Button>
                </div>
                <div className="space-y-4 w-full">
                  {userDetails &&
                    ["phone", "address", "emergencyContact"].map(
                      (key) => (
                        <div
                          key={key}
                          className="flex flex-col lg:flex-row lg:justify-between text-base"
                        >
                          <span className="text-[#2563eb] dark:text-[#2563eb] font-semibold capitalize">
                            {key.replace(/([A-Z])/g, " $1")}:
                          </span>
                          <span className="text-[#2563eb] dark:text-[#2563eb] text-right lg:ml-2">
                            {userDetails[key]}
                          </span>
                        </div>
                      )
                    )}
                </div>
              </div>
              {/* Medical Info Section */}
              <div className="glassmorphic bg-white/95 dark:bg-[#f3f4f6]/95 p-10 rounded-3xl w-full lg:w-2/3 shadow-2xl border border-[#c7d2fe] dark:border-[#60a5fa] transition-all duration-300">
                <h3 className="text-3xl font-extrabold text-[#2563eb] dark:text-[#2563eb] mb-10 tracking-tight border-b border-[#c7d2fe] dark:border-[#60a5fa] pb-4">
                  Medical Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {userDetails &&
                    [
                      "bloodType",
                      "allergies",
                      "medications",
                      "weight",
                      "height",
                      "age",
                    ].map((key) => (
                      <div
                        key={key}
                        className="flex flex-col gap-1 bg-[#f8fafc] dark:bg-[#e0e7ef] rounded-xl p-4 border border-[#c7d2fe] dark:border-[#60a5fa] shadow-sm"
                      >
                        <span className="text-[#2563eb] dark:text-[#2563eb] font-semibold capitalize text-base">
                          {key.replace(/([A-Z])/g, " $1")}:
                        </span>
                        <span className="text-[#2563eb] dark:text-[#2563eb] text-lg font-medium">
                          {userDetails[key]}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ChatButton />
      <UserFooter />
    </>
  );
}

export default MyProfile;
