"use client";

import React, { useEffect, useState } from "react";
import UserNavbar from "@/components/UserNavbar";
import { useSearchParams } from "next/navigation";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f3e8ff",
    padding: 20,
    fontSize: 12,
    color: "#3c1361",
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "bold",
    color: "#6b21a8",
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    marginLeft: 4,
  },
  testBlock: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#9d6efd",
    borderRadius: 8,
  },
});

// PDF Document component
const TestReportPDF = ({ test, patientName, date, labname }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Lab Name: {labname}</Text>
      <Text style={styles.header}>Test Report: {test.name}</Text>
      <View style={styles.section}>
        <Text>
          <Text style={styles.label}>Patient:</Text>
          <Text style={styles.value}>{patientName}</Text>
        </Text>
        <Text>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{date}</Text>
        </Text>
      </View>
      <View style={styles.testBlock}>
        <Text>
          <Text style={styles.label}>Result:</Text> {test.result || "N/A"}
        </Text>
        <Text>
          <Text style={styles.label}>Normal Range:</Text>{" "}
          {test.normalRange || "N/A"}
        </Text>
        <Text>
          <Text style={styles.label}>Units:</Text> {test.units || "N/A"}
        </Text>
        <Text>
          <Text style={styles.label}>Remarks:</Text> {test.remarks || "None"}
        </Text>
      </View>
    </Page>
  </Document>
);

const PathlabReportDetailsPage = () => {
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("id");
  const patientName = searchParams.get("patientName") || "Unknown Patient";
  const fee = searchParams.get("fee") || "N/A";
  const date = searchParams.get("date")
    ? new Date(searchParams.get("date")).toLocaleDateString()
    : "N/A";
  const testsList = searchParams.get("tests")
    ? searchParams.get("tests").split(",")
    : [];
  const labname = searchParams.get("labname");
  // console.log("labname" , labname)
  const [testDetails, setTestDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setError("Booking ID is required to fetch report details.");
      setLoading(false);
      return;
    }

    const fetchReportDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/pathlab/completed-reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });
        const data = await res.json();

        if (data.success) {
          setTestDetails(data.tests || []);
        } else {
          setError(data.message || "Failed to fetch test details.");
        }
      } catch (err) {
        setError("Server error while fetching test details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [bookingId]);

  const openModal = (test) => {
    setSelectedTest(test);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedTest(null);
    setShowModal(false);
  };

  // Render each test card with View & Download buttons
  const renderTestCard = (test, idx) => (
    <div
      key={idx}
      className="bg-purple-100 dark:bg-purple-800 rounded-xl p-6 shadow-md space-y-2"
    >
      <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-100">
        🧪 {test.name}
      </h3>
      <p>
        <span className="font-medium">Result:</span> {test.result || "N/A"}
      </p>
      <p>
        <span className="font-medium">Normal Range:</span>{" "}
        {test.normalRange || "N/A"}
      </p>
      <p>
        <span className="font-medium">Units:</span> {test.units || "N/A"}
      </p>
      <p>
        <span className="font-medium">Remarks:</span> {test.remarks || "None"}
      </p>
      <div className="flex gap-4 mt-3">


        <PDFDownloadLink
          document={
            <TestReportPDF
              test={test}
              patientName={patientName}
              date={date}
              labname={labname}
            />
          }
          fileName={`${test.name.replace(/\s+/g, "_")}_Report.pdf`}
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition flex items-center justify-center"
        >
          {({ loading }) =>
            loading ? "Preparing PDF..." : "Download"
          }
        </PDFDownloadLink>
      </div>
    </div>
  );

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-purple-50 dark:bg-purple-900 py-10 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-purple-950 border border-purple-300 dark:border-purple-700 rounded-2xl shadow-lg p-8 space-y-8">
          <h1 className="text-3xl font-bold text-center text-purple-800 dark:text-white">
            Pathlab Report Details
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800 dark:text-gray-200">
            <p>
              👤 <span className="font-medium">Patient:</span> {patientName}
            </p>
            <p>
              📅 <span className="font-medium">Date:</span> {date}
            </p>
            <p>
              🧪 <span className="font-medium">Tests:</span>{" "}
              {testsList.length > 0 ? testsList.join(", ") : "N/A"}
            </p>
            <p>
              💰 <span className="font-medium">Fee:</span> ₹{fee}
            </p>
          </div>

          {loading ? (
            <p className="text-center text-purple-700 dark:text-purple-300">
              Loading test details...
            </p>
          ) : error ? (
            <p className="text-center text-red-600 dark:text-red-400">{error}</p>
          ) : testDetails.length > 0 ? (
            <div className="space-y-6">
              {testDetails.map((test, idx) => renderTestCard(test, idx))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-300">
              No test details found.
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedTest && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-purple-900 rounded-2xl p-6 max-w-lg w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-xl font-bold mb-4 text-purple-800 dark:text-purple-100">
              {labname}
            </h1>
            <h2 className="text-xl font-bold mb-4 text-purple-800 dark:text-purple-100">
              Detailed View: {selectedTest.name}
            </h2>

            <p>
              <span className="font-semibold">Result:</span>{" "}
              {selectedTest.result || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Normal Range:</span>{" "}
              {selectedTest.normalRange || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Units:</span>{" "}
              {selectedTest.units || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Remarks:</span>{" "}
              {selectedTest.remarks || "None"}
            </p>

            <button
              onClick={closeModal}
              className="mt-6 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PathlabReportDetailsPage;
