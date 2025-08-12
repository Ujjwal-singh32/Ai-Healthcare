"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Loader2 } from "lucide-react";
import DocNav from "@/components/DocNavbar";
import UserDoctorFooter from "@/components/DocFooter";
import { useRef, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "react-toastify";
export default function AppointmentDetails() {
  const { ids } = useParams();
  const [activeSection, setActiveSection] = useState("chat");
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [medicationData, setMedicationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fileInputRef = useRef(null);

  const [booking, setBooking] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [newMedications, setNewMedications] = useState([
    { name: "", dosage: "", frequency: "" },
  ]);

  const [uploadedReports, setUploadedReports] = useState([]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await axios.post("/api/booking/detailsbyId", {
          bookingId: ids,
        });

        if (res.data.success) {
          setBooking(res.data.booking);
        } else {
          console.error("Failed to fetch booking details:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (ids) {
      fetchBookingDetails();
    }
  }, [ids]);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const senderId = booking?.doctorId?._id || booking?.doctorId || null;
  const receiverId = booking?.patientId?._id || booking?.patientId || null;

  const handleCreateZoomMeeting = async () => {
    try {
      const res = await fetch("/api/zoom/createMeeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: booking._id,
          doctorId: senderId,
          patientId: receiverId,
          doctorName: senderId
            ? booking.doctorId.name
            : "Doctor name loading!!",
          patientName: receiverId
            ? booking.patientId.name
            : "Patient name loading!!",
          date: new Date().toISOString(),
          duration: 30,
        }),
      });

      const data = await res.json();
      // console.log("Zoom meeting created:", data);

      if (data?.join_url) {
        const popup = window.open(
          data.join_url,
          "_blank",
          "width=1000,height=700,toolbar=no,scrollbars=yes,resizable=yes"
        );
        if (popup) popup.focus();
        else alert("Popup blocked! Please allow popups for this site.");
      } else {
        alert("Failed to create Zoom meeting.");
      }
    } catch (error) {
      console.error("Error creating Zoom meeting:", error);
      alert("An error occurred while starting the Zoom meeting.");
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(
          `/api/doctor/reports?doctorId=${senderId}&patientId=${receiverId}`
        );

        const data = await res.json();

        if (res.ok) {
          // console.log("data reports", data.reports)
          const transformed = data.reports
            // Step 1: Sort by date ascending so oldest first
            .slice()
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            // Step 2: Number them in upload order
            .map((r, i) => ({
              name: `Report_${i + 1} (${r.patientName || "Unknown"})`,

              url: r.url,
              date: new Date(r.date).toLocaleDateString(),
              time: new Date(r.date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            }))
            // Step 3: Reverse so newest shows at top in UI
            .reverse();

          setUploadedReports(transformed);
        } else {
          console.log("report error");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (senderId) {
      fetchReports();
      const interval = setInterval(fetchReports, 10000); // Every 10 seconds
      return () => clearInterval(interval);
    }
  }, [senderId]);

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        const res = await fetch(`/api/medications?patientId=${receiverId}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.medications)) {
          setMedicationData(data.medications);
        } else {
          setMedicationData([]);
        }
      } catch (err) {
        console.error("Error fetching meds:", err);
        setMedicationData([]);
      }
    };

    if (receiverId) {
      fetchMeds();
      const interval = setInterval(fetchMeds, 10000); // Every 10 seconds
      return () => clearInterval(interval);
    }
  }, [receiverId]);

  // const socket = useRef(null);

  // useEffect(() => {
  //   if (!receiverId || !senderId || activeSection !== "chat") return;

  //   const token = localStorage.getItem("drtoken") || "";

  //   socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  //     autoConnect: true,
  //     auth: { token },
  //   });

  //   socket.current.emit("join", { userId: senderId });

  //   socket.current.on("newMessage", (msg) => {
  //     setMessages((prev) => [...prev, msg]);
  //   });

  //   return () => {
  //     socket.current?.disconnect();
  //   };
  // }, [receiverId, senderId, activeSection]);

  useEffect(() => {
    if (!receiverId || !senderId || activeSection !== "chat" || !booking?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.post("/api/chat/get", { bookingId: booking._id });
        if (res.data.success) {
          setMessages(res.data.messages); // messages will already include senderName from API
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    // Fetch immediately on mount
    fetchMessages();


    const intervalId = setInterval(fetchMessages, 1200);

    // Cleanup on unmount or dependency change
    return () => clearInterval(intervalId);

  }, [receiverId, senderId, activeSection, booking?._id]);

  if (loading || !booking || !senderId || !receiverId) {
    return (
      <div className="flex justify-center items-center py-20 bg-blue-50 dark:bg-[#181c2a] min-h-[50vh] px-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 border-4 border-transparent border-t-[#2563eb] border-l-[#60a5fa] rounded-full animate-spin bg-gradient-to-r from-[#93c5fd] via-[#2563eb] to-[#60a5fa] shadow-lg"></div>
          <p className="text-[#2563eb] dark:text-[#60a5fa] text-lg font-semibold animate-pulse">
            Loading Appointment Details...
          </p>
        </div>
      </div>
    );
  }

  const handleAddMedication = () => {
    setNewMedications([
      ...newMedications,
      { name: "", dosage: "", frequency: "" },
    ]);
  };

  const handleRemoveMedication = (index) => {
    const updated = [...newMedications];
    updated.splice(index, 1);
    setNewMedications(updated);
  };

  const handleMedicationChange = (index, field, value) => {
    const updated = [...newMedications];
    updated[index][field] = value;
    setNewMedications(updated);
  };

  const handleSubmitMedications = async () => {
    try {
      const res = await fetch("/api/medications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: receiverId, // valid ObjectId
          doctorId: senderId, // valid ObjectId
          medications: newMedications,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Medications sent to patient!");
      } else {
        toast.error("Failed to send medications: " + data.error);
      }
    } catch (error) {
      console.error("Error sending medications:", error);
      toast.error("Error sending medications");
    }
  };


  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      text: messageInput,
      senderId,
      senderType: "Doctor",
      receiverId,
      receiverType: "Patient",
      timestamp: new Date(),
    };

    // Emit via socket
    // socket.current.emit("sendMessage", { to: receiverId, message: newMessage });

    // Save to DB
    try {
      await axios.post("/api/chat/save", {
        bookingId: booking._id,
        ...newMessage,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }

    setMessages(prev => [...prev, newMessage]);
    setMessageInput("");
  };


  const handleSelectChange = (isoDate) => {
    const med = medicationData.find(
      (m) => new Date(m.date).toISOString() === isoDate
    );
    setSelectedMedication(med);
  };

  const handleDownloadPdf = () => {
    if (!selectedMedication) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Medication Report", 14, 15);
    doc.setFontSize(12);
    doc.text(`Date: ${selectedMedication.date}`, 14, 25);

    // Table headers and rows
    const headers = [["Name", "Dosage", "Frequency"]];
    const rows = selectedMedication.medications.map((m) => [
      m.name,
      m.dosage,
      m.frequency,
    ]);

    // Using autoTable for cleaner layout (if installed)
    autoTable(doc, {
      startY: 35,
      head: headers,
      body: rows,
    });

    // Save PDF
    doc.save(`Medication_${selectedMedication.date}.pdf`);
  };
  const handleMarkCompleted = async () => {
    try {
      const res = await axios.post("/api/booking/markcomplete", {
        bookingId: ids,
      });
      if (res.data.success) {
        toast.success("Status Updated");
        router.push("/doctor/appointments");
      } else {
        toast.error("Error Occured");
      }
    } catch (error) {
      toast.error("Error Occured");
      console.log(error);
    }
  };

  if (!isClient) return null;

  return (
    <>
      <DocNav />
      <div className="pt-28 p-4 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Left Column */}
          <div className="space-y-4 md:sticky md:top-32 h-fit">
            {/* Appointment Info */}
            <Card className="bg-blue-50 dark:bg-[#181c2a] border border-[#2563eb]/20 dark:border-[#60a5fa]/20 shadow-md">
              <CardContent className="p-4 space-y-1">
                <h2 className="text-xl font-bold text-[#2563eb] dark:text-[#60a5fa]">
                  Appointment Details
                </h2>
                <p>
                  <strong>Patient Name:</strong>{" "}
                  {receiverId
                    ? booking.patientId.name
                    : "patient name loading!!"}
                </p>
                <p>
                  <strong>Doctor Name:</strong>
                  {senderId ? booking.doctorId.name : "Doctor name loading!!"}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(booking.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p>
                  <strong>Disease:</strong>{" "}
                  {booking.disease || "disease loading"}
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleMarkCompleted}
                    className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-[#2563eb] transition-colors duration-300 cursor-pointer"
                  >
                    Mark as Completed
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="space-y-3">
              {["chat", "medications", "send Medication", "reports", "zoom"].map((section) => (
                <Button
                  key={section}
                  variant={activeSection === section ? "default" : "outline"}
                  className={`w-full capitalize cursor-pointer
                    ${activeSection === section
                      ? 'bg-[#2563eb] !text-white dark:bg-[#60a5fa] !dark:text-[#181c2a] !border-[#2563eb] !dark:border-[#60a5fa] pointer-events-none'
                      : 'border-[#2563eb] dark:border-[#60a5fa] text-[#2563eb] dark:text-[#60a5fa] hover:bg-[#e0e7ff] dark:hover:bg-[#181c2a] hover:text-[#2563eb] dark:hover:text-[#60a5fa]'}
                  `}
                  onClick={() => setActiveSection(section)}
                >
                  {section === "reports"
                    ? "View Reports"
                    : section === "zoom"
                      ? "Zoom Meeting"
                      : section}
                </Button>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-3 space-y-4">
            {activeSection === "chat" && (
              <Card className="bg-gradient-to-br from-[#e0e7ff] to-[#f8fafc] dark:from-[#181c2a] dark:to-[#2563eb]/10 border border-[#2563eb]/30 dark:border-[#60a5fa]/30 shadow-2xl rounded-3xl">
                <CardContent className="p-0 md:p-0 flex flex-col h-[500px] md:h-[600px]">
                  {/* Header */}
                  <div className="flex items-center justify-center gap-2 px-4 py-4 border-b border-[#2563eb]/10 dark:border-[#60a5fa]/10 bg-white/80 dark:bg-[#181c2a]/80 mt-0">
                    <div className="w-12 h-12 rounded-full bg-[#2563eb]/10 flex items-center justify-center text-2xl font-bold text-[#2563eb] dark:text-[#60a5fa] shadow-md">
                      {booking.patientId.name ? booking.patientId.name[0] : "P"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-[#2563eb] dark:text-[#60a5fa]">{booking.patientId.name || "patient name loading!!"}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-300">Online</span>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto px-2 md:px-6 py-4 space-y-3 bg-transparent custom-scrollbar">
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 animate-fade-in">
                        <span className="text-3xl">💬</span>
                        <span className="mt-2">No messages yet. Start the conversation!</span>
                      </div>
                    )}
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`max-w-[80%] md:max-w-[60%] px-5 py-3 rounded-2xl shadow-md relative
                          ${msg.senderType === "Doctor"
                            ? "ml-auto bg-gradient-to-br from-[#2563eb] to-[#60a5fa] text-white dark:from-[#60a5fa] dark:to-[#2563eb] dark:text-[#181c2a]"
                            : "mr-auto bg-white dark:bg-[#181c2a] border border-[#2563eb]/10 dark:border-[#60a5fa]/10 text-[#2563eb] dark:text-[#60a5fa]"}
                        `}
                      >
                        <p className="break-words text-base font-medium">{String(msg.text)}</p>
                        <span className="absolute -bottom-5 right-2 text-xs text-gray-400 dark:text-gray-500 select-none">
                          {msg.time}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <form
                    className="flex items-center gap-2 px-4 py-4 border-t border-[#2563eb]/10 dark:border-[#60a5fa]/10 bg-white/80 dark:bg-[#181c2a]/80 rounded-b-3xl"
                    onSubmit={e => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                  >
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                      className="flex-1 rounded-full px-5 py-3 border-2 border-[#2563eb]/30 dark:border-[#60a5fa]/30 bg-[#f8fafc] dark:bg-[#181c2a] text-black dark:text-white font-bold focus:border-2 focus:border-[#2563eb] dark:focus:border-[#60a5fa] focus:outline-none shadow-sm placeholder:text-[#2563eb] dark:placeholder:text-[#60a5fa] focus:bg-[#dbeafe] dark:focus:bg-[#2563eb]/30"
                      onKeyDown={e => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      className="rounded-full px-6 py-3 bg-gradient-to-br from-[#2563eb] to-[#60a5fa] text-white font-bold shadow-lg hover:from-[#1d4ed8] hover:to-[#60a5fa] dark:bg-gradient-to-br dark:from-[#60a5fa] dark:to-[#2563eb] dark:text-[#181c2a] transition-all duration-200 flex items-center gap-2"
                    >
                      Send
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeSection === "medications" && (
              <Card className="bg-blue-50 dark:bg-[#181c2a] border border-[#2563eb]/20 dark:border-[#60a5fa]/20 shadow-md rounded-3xl">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-[#2563eb] dark:text-[#60a5fa] mb-4">
                    Medications
                  </h2>

                  {/* Date Dropdown */}
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="w-[200px] bg-white dark:bg-[#181c2a] border-[#2563eb] dark:border-[#60a5fa] mb-4 placeholder:text-[#2563eb] placeholder:font-bold">
                      <SelectValue placeholder={<span className='text-[#2563eb] font-bold'>Select a date</span>} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#dbeafe] dark:bg-[#181c2a] text-[#2563eb] dark:text-[#60a5fa] font-bold">
                      {medicationData.map((med, index) => (
                        <SelectItem
                          key={index}
                          value={med.date} // keep original or ISO if you need exact value
                        >
                          {(() => {
                            const d = new Date(med.date);
                            const datePart = d.toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            });
                            const timePart = d.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            });
                            return (
                              <span className="flex gap-2 w-full">
                                <span>{datePart}</span>
                                <span>{timePart}</span>
                              </span>
                            );
                          })()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Show Medications when a date is selected */}
                  {selectedMedication && (
                    <Tabs defaultValue="details" className="mt-6">
                      <TabsList>
                        <TabsTrigger value="details">
                          View Medications
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="details">
                        <div className="overflow-x-auto mt-2 max-h-50 overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-blue-200 dark:bg-[#2563eb]">
                              <tr>
                                <th className="p-2 text-left">Name</th>
                                <th className="p-2 text-left">Dosage</th>
                                <th className="p-2 text-left">Frequency</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-[#181c2a]">
                              {selectedMedication.medications.map((m, idx) => (
                                <tr key={idx} className="border-b">
                                  <td className="p-2">{m.name}</td>
                                  <td className="p-2">{m.dosage}</td>
                                  <td className="p-2">{m.frequency}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Button
                          className="mt-3 flex gap-2 items-center cursor-pointer bg-[#2563eb] hover:bg-[#1d4ed8] text-white dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-[#181c2a]"
                          onClick={handleDownloadPdf}
                        >
                          <Download className="w-4 h-4 cursor-pointer" /> Download PDF
                        </Button>
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === "reports" && (
              <Card className="bg-blue-50 dark:bg-[#181c2a] border border-[#2563eb]/20 dark:border-[#60a5fa]/20 shadow-md rounded-3xl">
                <CardContent className="p-4 space-y-4">
                  <h2 className="text-xl font-semibold text-[#2563eb] dark:text-[#60a5fa]">
                    Uploaded Reports
                  </h2>
                  {uploadedReports.length > 0 ? (
                    <div className="space-y-2">
                      <h3 className="font-medium text-[#2563eb] dark:text-[#60a5fa]">
                        Available Files:
                      </h3>
                      <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                        {uploadedReports.map((file, index) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-[#181c2a] p-2 rounded shadow border border-[#2563eb]/10 dark:border-[#60a5fa]/10 space-y-2 sm:space-y-0 sm:space-x-4"
                          >
                            <div className="w-full sm:w-auto overflow-hidden">
                              <span className="block font-medium truncate max-w-full sm:max-w-xs">
                                {file.name}
                              </span>
                              <div className="text-xs text-gray-600 dark:text-gray-400 break-words">
                              Uploaded on: {file.date || "Unknown date"} {file.time ? `at ${file.time}` : ""}

                                {file.patientName && (
                                  <> | Patient: {file.patientName}</>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-[#2563eb] dark:text-[#60a5fa] hover:bg-[#dbeafe] dark:hover:bg-[#2563eb]/20 hover:text-[#2563eb] dark:hover:text-[#60a5fa] font-bold border-[#2563eb] dark:border-[#60a5fa] cursor-pointer"
                                onClick={() => window.open(file.url, "_blank")}
                              >
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-[#2563eb] dark:text-[#60a5fa] hover:bg-[#dbeafe] dark:hover:bg-[#2563eb]/20 hover:text-[#2563eb] dark:hover:text-[#60a5fa] font-bold border-[#2563eb] dark:border-[#60a5fa] cursor-pointer"
                                onClick={() => {
                                  const link = document.createElement("a");
                                  link.href = file.url;
                                  link.setAttribute("download", file.name);
                                  link.setAttribute("target", "_blank");
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }}
                              >
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#2563eb] dark:text-[#60a5fa]">
                      No reports available.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === "send Medication" && (
              <Card className="bg-blue-50 dark:bg-[#181c2a] border border-[#2563eb]/20 dark:border-[#60a5fa]/20 shadow-md rounded-3xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold text-[#2563eb] dark:text-[#60a5fa]">
                      Send Medications
                    </h2>
                    <Button
                      variant="outline"
                      className="border-[#2563eb] text-[#2563eb] dark:border-[#60a5fa] dark:text-[#60a5fa] hover:bg-[#e0e7ff] dark:hover:bg-[#2563eb]/20 hover:text-[#2563eb] dark:hover:text-[#60a5fa] cursor-pointer"
                      onClick={handleAddMedication}
                    >
                      Add Row
                    </Button>
                  </div>

                  <div className="overflow-x-auto max-h-64 overflow-y-auto rounded-lg">
                    <table className="w-full text-sm bg-white dark:bg-[#181c2a] rounded-lg">
                      <thead className="bg-blue-200 dark:bg-[#2563eb] sticky top-0">
                        <tr>
                          <th className="p-2 text-left">Name</th>
                          <th className="p-2 text-left">Dosage</th>
                          <th className="p-2 text-left">Frequency</th>
                          <th className="p-2 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newMedications.map((med, idx) => (
                          <tr key={idx} className="border-b border-[#2563eb]/10 dark:border-[#60a5fa]/10">
                            <td className="p-2">
                              <Input
                                value={med.name}
                                onChange={(e) =>
                                  handleMedicationChange(idx, "name", e.target.value)
                                }
                                className="bg-white dark:bg-[#181c2a] border-[#2563eb]/30 dark:border-[#60a5fa]/30 focus:border-[#2563eb] dark:focus:border-[#60a5fa] font-bold text-[#2563eb] dark:text-[#60a5fa] placeholder:font-normal placeholder:text-[#2563eb]/50 dark:placeholder:text-[#60a5fa]/60"
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                value={med.dosage}
                                onChange={(e) =>
                                  handleMedicationChange(idx, "dosage", e.target.value)
                                }
                                className="bg-white dark:bg-[#181c2a] border-[#2563eb]/30 dark:border-[#60a5fa]/30 focus:border-[#2563eb] dark:focus:border-[#60a5fa] font-bold text-[#2563eb] dark:text-[#60a5fa] placeholder:font-normal placeholder:text-[#2563eb]/50 dark:placeholder:text-[#60a5fa]/60"
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                value={med.frequency}
                                onChange={(e) =>
                                  handleMedicationChange(idx, "frequency", e.target.value)
                                }
                                className="bg-white dark:bg-[#181c2a] border-[#2563eb]/30 dark:border-[#60a5fa]/30 focus:border-[#2563eb] dark:focus:border-[#60a5fa] font-bold text-[#2563eb] dark:text-[#60a5fa] placeholder:font-normal placeholder:text-[#2563eb]/50 dark:placeholder:text-[#60a5fa]/60"
                              />
                            </td>
                            <td className="p-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:border-red-400/40 dark:hover:bg-red-950 dark:hover:text-red-400 cursor-pointer"
                                onClick={() => handleRemoveMedication(idx)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitMedications}
                      className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-[#181c2a] cursor-pointer"
                    >
                      Send to Patient
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {activeSection === "zoom" && (
              <Card className="bg-blue-50 dark:bg-[#181c2a] border border-[#2563eb]/20 dark:border-[#60a5fa]/20 shadow-md rounded-3xl">
                <CardContent className="p-4 space-y-2">
                  <h2 className="text-xl font-semibold text-[#2563eb] dark:text-[#60a5fa]">
                    Start Video Call
                  </h2>
                  <p className="text-sm text-[#2563eb] dark:text-[#60a5fa]">
                    Click below to create and join a Zoom video consultation.
                  </p>
                  <Button
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-[#181c2a] cursor-pointer"
                    onClick={handleCreateZoomMeeting}
                  >
                    Start Zoom Meeting
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <UserDoctorFooter />
    </>
  );
}
