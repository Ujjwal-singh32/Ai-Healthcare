"use client";

import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Loader2 } from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useUser } from "@/context/userContext";
import axios from "axios";
import { Send } from "lucide-react";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useParams } from "next/navigation";

export default function AppointmentDetails() {
  const [activeSection, setActiveSection] = useState("chat");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sendingReport, setSendingReport] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [uploadedReports, setUploadedReports] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [receivedMedication, setReceivedMedication] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [messages, setMessages] = useState([]);
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const { user } = useUser();
  const [meetingLink, setMeetingLink] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await axios.post("/api/booking/detailsbyId", {
          bookingId: id,
        });

        if (res.data.success) {
          // console.log("debugging", res.data.booking);
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

    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const senderId = booking?.patientId?._id || booking?.patientId || null;
  // console.log("secsd" ,senderId);?\

  const receiverId = booking?.doctorId?._id || booking?.doctorId || null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!booking?._id) return;
      try {
        const res = await fetch(
          `/api/appointments/user-upcoming?appointmentId=${booking._id}`
        );
        const data = await res.json();
        if (res.ok && data.meetingLink) {
          setMeetingLink(data.meetingLink);
        }
      } catch (err) {
        console.error("Failed to fetch appointment:", err);
      }
    };

    fetchAppointment();
    const interval = setInterval(fetchAppointment, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [senderId]);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const res = await fetch(
          `/api/medications?patientId=${senderId}&doctorId=${receiverId}`
        );
        const data = await res.json();
        // console.log("Fetched medications:", data.medications);
        setReceivedMedication(data.medications);
      } catch (error) {
        console.error("Error fetching medications:", error);
      }
    };

    if (receiverId && senderId) {
      fetchMedications();
      const interval = setInterval(fetchMedications, 10000); // Every 10 seconds
      return () => clearInterval(interval);
    }
  }, [receiverId, senderId]);

  const fileInputRef = useRef(null);

  const socket = useRef(null);

  // useEffect(() => {
  //   if (!receiverId || !senderId || activeSection !== "chat") return;

  //   const token = localStorage.getItem("token") || "";

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
    if (!receiverId || !senderId || activeSection !== "chat" || !booking?._id)
      return;

    const fetchMessages = async () => {
      try {
        const res = await axios.post("/api/chat/get", {
          bookingId: booking._id,
        });
        if (res.data.success) {
          setMessages(res.data.messages); // messages will already include senderName from API
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    // Fetch immediately on mount
    fetchMessages();

    // Set up auto-refresh every 1.5 seconds
    const intervalId = setInterval(fetchMessages, 1500);

    // Cleanup on unmount or dependency change
    return () => clearInterval(intervalId);
  }, [receiverId, senderId, activeSection, booking?._id]);

  const [messageInput, setMessageInput] = useState("");

  if (loading || !receiverId || !senderId) {
    return (
      <div className="flex justify-center items-center py-20 bg-blue-50 dark:bg-[#181c2a] min-h-screen px-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 border-4 border-transparent border-t-[#2563eb] border-l-[#60a5fa] rounded-full animate-spin bg-gradient-to-r from-[#93c5fd] via-[#2563eb] to-[#60a5fa] shadow-lg"></div>
          <p className="text-[#2563eb] dark:text-[#60a5fa] text-xl font-semibold animate-pulse">
            Loading Appointment Details...
          </p>
        </div>
      </div>
    );
  }

  const handleReportUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const compressedReports = await Promise.all(
      files.map(async (file) => {
        try {
          // Compress the image file
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 9, // max size is 9 mb
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });

          return {
            name: compressedFile.name,
            url: URL.createObjectURL(compressedFile),
            file: compressedFile,
          };
        } catch (error) {
          console.error("Compression error:", error);
          // Fallback: use original file if compression fails
          return {
            name: file.name,
            url: URL.createObjectURL(file),
            file: file,
          };
        }
      })
    );

    setUploadedReports((prev) => [...prev, ...compressedReports]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  const filteredMeds = receivedMedication;

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const med = filteredMeds.find((m) => m.date === date);
    setSelectedMedication(med);
  };

  const handleSendReports = async () => {
    if (uploadedReports.length === 0) {
      alert("Please upload at least one report before sending.");
      return;
    }
    setSendingReport(true);
    const formData = new FormData();
    formData.append("patientId", senderId);
    formData.append("doctorId", receiverId);
    uploadedReports.forEach((file) => {
      formData.append("reports", file instanceof File ? file : file.file);
    });
    try {
      const response = await axios.post("/api/user/send-reports", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success("Reports Sent");
        setUploadedReports([]);
      } else {
        toast.success("Failed to Send Reports");
      }
    } catch (error) {
      console.error("Error sending reports:", error);
    } finally {
      setSendingReport(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    setSendingMessage(true);
    const newMessage = {
      text: messageInput,
      senderId,
      senderType: "Patient",
      receiverId,
      receiverType: "Doctor",
      timestamp: new Date(),
    };
    try {
      await axios.post("/api/chat/save", {
        bookingId: booking._id,
        ...newMessage,
      });
      setMessages((prev) => [...prev, newMessage]);
      setMessageInput("");
    } catch (error) {
      console.error("Error saving message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  // if (!isClient) return null;
  // console.log("booking", booking);
  if (!isClient || loading || !booking) {
    return (
      <div className="flex justify-center items-center py-20 bg-blue-50 dark:bg-[#181c2a] min-h-screen px-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 border-4 border-transparent border-t-[#2563eb] border-l-[#60a5fa] rounded-full animate-spin bg-gradient-to-r from-[#93c5fd] via-[#2563eb] to-[#60a5fa] shadow-lg"></div>
          <p className="text-[#2563eb] dark:text-[#60a5fa] text-xl font-semibold animate-pulse">
            Loading Appointment Details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <UserNavbar />
      <div className="pt-28 p-4 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Appointment Info */}
            <Card className="bg-blue-50 dark:bg-[#181c2a] border border-[#2563eb]/20 dark:border-[#60a5fa]/20">
              <CardContent className="p-4 space-y-1">
                <h2 className="text-xl font-bold text-[#2563eb] dark:text-[#60a5fa]">
                  Appointment Details
                </h2>
                <p>
                  <strong>Patient Name:</strong>{" "}
                  {user ? user.name : "patient name loading!!"}
                </p>
                <p>
                  <strong>Doctor Name:</strong>{" "}
                  {booking.doctorName || "doctor name loading !!"}
                </p>
                <p>
                  <strong>Date: </strong>
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
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="space-y-3">
              {["chat", "medications", "reports", "zoom"].map((section) => (
                <Button
                  key={section}
                  variant={activeSection === section ? "default" : "outline"}
                  className={`w-full capitalize cursor-pointer
                    ${
                      activeSection === section
                        ? "bg-[#2563eb] !text-white dark:bg-[#60a5fa] !dark:text-[#181c2a] !border-[#2563eb] !dark:border-[#60a5fa] pointer-events-none"
                        : "border-[#2563eb] dark:border-[#60a5fa] text-[#2563eb] dark:text-[#60a5fa] hover:bg-[#e0e7ff] dark:hover:bg-[#181c2a] hover:text-[#2563eb] dark:hover:text-[#60a5fa]"
                    }
                  `}
                  onClick={() => setActiveSection(section)}
                >
                  {section === "reports"
                    ? "Upload Reports"
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
                      {booking.doctorName ? booking.doctorName[0] : "D"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-[#2563eb] dark:text-[#60a5fa]">
                        {" "}
                        {booking.doctorName || "name loading!!"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-300">
                        Online
                      </span>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto px-2 md:px-6 py-4 space-y-3 bg-transparent custom-scrollbar">
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 animate-fade-in">
                        <span className="text-3xl">💬</span>
                        <span className="mt-2">
                          No messages yet. Start the conversation!
                        </span>
                      </div>
                    )}
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`max-w-[80%] md:max-w-[60%] px-5 py-3 rounded-2xl shadow-md relative
                          ${
                            msg.senderType === "Patient"
                              ? "ml-auto bg-gradient-to-br from-[#2563eb] to-[#60a5fa] text-white dark:from-[#60a5fa] dark:to-[#2563eb] dark:text-[#181c2a]"
                              : "mr-auto bg-white dark:bg-[#181c2a] border border-[#2563eb]/10 dark:border-[#60a5fa]/10 text-[#2563eb] dark:text-[#60a5fa]"
                          }
                        `}
                      >
                        <p className="break-words text-base font-medium">
                          {String(msg.text)}
                        </p>
                        <span className="absolute -bottom-5 right-2 text-xs text-gray-400 dark:text-gray-500 select-none">
                          {msg.time}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <form
                    className="flex items-center gap-2 px-4 py-4 border-t border-[#2563eb]/10 dark:border-[#60a5fa]/10 bg-white/80 dark:bg-[#181c2a]/80 rounded-b-3xl"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                  >
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1 rounded-full px-5 py-3 border-2 border-[#2563eb]/30 dark:border-[#60a5fa]/30 bg-[#f8fafc] dark:bg-[#181c2a] text-black dark:text-white font-bold focus:border-2 focus:border-[#2563eb] dark:focus:border-[#60a5fa] focus:outline-none shadow-sm placeholder:text-[#2563eb] dark:placeholder:text-[#60a5fa] focus:bg-[#dbeafe] dark:focus:bg-[#2563eb]/30"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      className="rounded-full px-6 py-3 bg-gradient-to-br from-[#2563eb] to-[#60a5fa] text-white font-bold shadow-lg hover:from-[#1d4ed8] hover:to-[#60a5fa] dark:bg-gradient-to-br dark:from-[#60a5fa] dark:to-[#2563eb] dark:text-[#181c2a] transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
                      disabled={sendingMessage}
                    >
                      {sendingMessage ? (
                        <>
                          <Loader2 className="animate-spin w-5 h-5" />
                          Sending...
                        </>
                      ) : (
                        "Send"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeSection === "medications" && (
              <Card className="bg-blue-50 dark:bg-[#181c2a] border border-[#2563eb]/20 dark:border-[#60a5fa]/20">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold text-[#2563eb] dark:text-[#60a5fa] mb-4">
                    Medications
                  </h2>

                  {/* Date Dropdown */}
                  <Select onValueChange={handleDateSelect}>
                    <SelectTrigger className="w-[200px] bg-white dark:bg-[#181c2a] border-[#2563eb] dark:border-[#60a5fa] mb-4 placeholder:text-[#2563eb] placeholder:font-bold">
                      <SelectValue
                        placeholder={
                          <span className="text-[#2563eb] font-bold">
                            Select a date
                          </span>
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-[#dbeafe] dark:bg-[#181c2a] text-[#2563eb] dark:text-[#60a5fa] font-bold">
                      {filteredMeds.map((med, index) => (
                        <SelectItem
                          key={index}
                          value={med.date}
                          className="bg-[#dbeafe] dark:bg-[#181c2a] text-[#2563eb] dark:text-[#60a5fa] font-bold hover:bg-[#2563eb] hover:text-white dark:hover:bg-[#60a5fa] dark:hover:text-[#181c2a] focus:bg-[#2563eb] focus:text-white dark:focus:bg-[#60a5fa] dark:focus:text-[#181c2a]"
                        >
                          {new Intl.DateTimeFormat("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(new Date(med.date))}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Show Medication Table if a Date is Selected */}
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
                          <Download className="w-4 h-4" /> Download PDF
                        </Button>
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === "reports" && (
              <>
                <Card className="bg-blue-50 dark:bg-[#181c2a] border border-[#2563eb]/20 dark:border-[#60a5fa]/20">
                  <CardContent className="p-4 space-y-4">
                    <h2 className="text-xl font-semibold text-[#2563eb] dark:text-[#60a5fa]">
                      Upload Reports
                    </h2>
                    <Input
                      type="file"
                      multiple
                      onChange={handleReportUpload}
                      className="bg-white dark:bg-[#181c2a] border-[#2563eb] dark:border-[#60a5fa]"
                      ref={(ref) => (fileInputRef.current = ref)}
                    />

                    {/* Uploaded Reports List with Scroll */}
                    {uploadedReports.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-medium text-[#2563eb] dark:text-[#60a5fa]">
                          Uploaded Files:
                        </h3>
                        <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                          {uploadedReports.map((file, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-white dark:bg-[#181c2a] p-2 rounded shadow border border-[#2563eb]/10 dark:border-[#60a5fa]/10"
                            >
                              <span className="truncate">{file.name}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-[#2563eb] dark:text-[#60a5fa] hover:bg-[#dbeafe] dark:hover:bg-[#2563eb]/20 hover:text-[#2563eb] dark:hover:text-[#60a5fa] font-bold border-[#2563eb] dark:border-[#60a5fa]"
                                onClick={() => window.open(file.url, "_blank")}
                              >
                                See
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Send Button */}
                <div className="mt-4 flex justify-end">
                  <Button
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center gap-2 cursor-pointer dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-[#181c2a] disabled:opacity-70"
                    onClick={handleSendReports}
                    disabled={sendingReport}
                  >
                    {sendingReport ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Reports
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {activeSection === "zoom" &&
              (meetingLink ? (
                <Card className="bg-blue-50 dark:bg-[#181c2a] border border-[#2563eb]/20 dark:border-[#60a5fa]/20">
                  <CardContent className="p-4 space-y-2">
                    <h2 className="text-xl font-semibold text-[#2563eb] dark:text-[#60a5fa]">
                      Join Video Call
                    </h2>
                    <p className="text-sm text-[#2563eb] dark:text-[#60a5fa]">
                      Click below to join your scheduled video consultation.
                    </p>
                    <Button
                      className="bg-[#2563eb] text-white hover:bg-[#1d4ed8] cursor-pointer dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-[#181c2a]"
                      onClick={() =>
                        window.open(
                          meetingLink,
                          "_blank",
                          "width=1000,height=700,toolbar=no,scrollbars=yes,resizable=yes"
                        )
                      }
                    >
                      Join Zoom Meeting
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-blue-100 dark:bg-[#2563eb]/20 border border-[#2563eb]/20 dark:border-[#60a5fa]/20">
                  <CardContent className="p-4 space-y-2">
                    <h2 className="text-xl font-semibold text-[#2563eb] dark:text-[#60a5fa]">
                      Waiting for Doctor to Start Meeting
                    </h2>
                    <p className="text-sm text-[#2563eb] dark:text-[#60a5fa]">
                      Please wait while the doctor connects. This page will
                      update automatically once the meeting is live.
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
      <UserFooter />
    </>
  );
}
