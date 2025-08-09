"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const MakePayment = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Add fade-in animation after component mounts
    setFadeIn(true);
  }, []);
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  const searchParams = useSearchParams();

  const labId = searchParams.get("labId");
  const patientId = searchParams.get("patientId");
  const date = searchParams.get("date");
  const tests = searchParams.get("tests");
  const fee = searchParams.get("fee");
  console.log("fee", fee);
  const handlePayment = async () => {
    setLoading(true);
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      toast.error("Failed to load payment gateway. Please try again.");
      setLoading(false);
      return;
    }

    try {
      console.log("fee", fee);
      const amount = fee;

      const { data } = await axios.post("/api/payment/create-order", {
        amount,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Rakshaa Health",
        description: "Appointment Payment",
        order_id: data.orderId,
        handler: async function (response) {
          const verifyRes = await axios.post("/api/payment/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            const bookingRes = await axios.post("/api/booking/lab-booking", {
              labId,
              patientId,
              date,
              tests,
              fee,
            });
            if (bookingRes.data.success) {
              setPaymentComplete(true);
              toast.success("Booking Successfully Completed!");
              setTimeout(() => {
                router.push("/user/home");
              }, 2000);
            } else {
              toast.error(
                "Payment verified but booking failed. Please contact support."
              );
            }
          } else {
            toast.error(
              "Payment verification failed. Please try again or contact support."
            );
          }
        },
        prefill: {
          name: "Rakshaa",
          email: "raksha@email.com",
          contact: "9876543210",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment Error:", err);
      toast.error(
        "Payment failed. Please try again or use a different payment method."
      );
    } finally {
      setLoading(false);
    }
  };

  // Success animation component
  const PaymentSuccess = () => (
    <div className="flex flex-col items-center justify-center animate-fadeIn">
      <div className="w-16 h-16 mb-4 relative">
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            className="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            className="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-green-600">Payment Successful!</h3>
      <p className="mt-2 text-gray-600">Redirecting to home page...</p>
      <div className="mt-4 flex items-center justify-center">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping mr-1"></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-ping mr-1"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-ping"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
      <style jsx>{`
        .checkmark {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: #4bb543;
          stroke-miterlimit: 10;
          box-shadow: inset 0px 0px 0px #4bb543;
          animation: fill 0.4s ease-in-out 0.4s forwards,
            scale 0.3s ease-in-out 0.9s both;
        }
        .checkmark__circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #4bb543;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .checkmark__check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes scale {
          0%,
          100% {
            transform: none;
          }
          50% {
            transform: scale3d(1.1, 1.1, 1);
          }
        }
        @keyframes fill {
          100% {
            box-shadow: inset 0px 0px 0px 30px #4bb54333;
          }
        }
      `}</style>
    </div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#232946] dark:via-[#334155] dark:to-[#232946] px-4 overflow-hidden">
      {/* Animated SVG background */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="blob-blue-1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25">
                <animate
                  attributeName="stopOpacity"
                  values="0.25;0.15;0.25"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.15">
                <animate
                  attributeName="stopOpacity"
                  values="0.15;0.25;0.15"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            <linearGradient id="blob-blue-2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2">
                <animate
                  attributeName="stopOpacity"
                  values="0.2;0.1;0.2"
                  dur="7s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.12">
                <animate
                  attributeName="stopOpacity"
                  values="0.12;0.22;0.12"
                  dur="7s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            <linearGradient id="blob-blue-3" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.15">
                <animate
                  attributeName="stopOpacity"
                  values="0.15;0.05;0.15"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.1">
                <animate
                  attributeName="stopOpacity"
                  values="0.1;0.2;0.1"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>
          <g>
            <path
              d="M400,400 Q470,320,540,400 T680,400 T820,400 T960,400 T1100,400"
              stroke="rgba(37, 99, 235, 0.2)"
              strokeWidth="2"
              fill="none"
            >
              <animate
                attributeName="d"
                values="M400,400 Q470,320,540,400 T680,400 T820,400 T960,400 T1100,400;
                        M400,400 Q470,480,540,400 T680,400 T820,400 T960,400 T1100,400;
                        M400,400 Q470,320,540,400 T680,400 T820,400 T960,400 T1100,400"
                dur="15s"
                repeatCount="indefinite"
              />
            </path>

            <ellipse
              cx="400"
              cy="400"
              rx="340"
              ry="220"
              fill="url(#blob-blue-1)"
            >
              <animate
                attributeName="cx"
                values="400;420;380;400"
                dur="20s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="400;380;420;400"
                dur="18s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values="340;370;340"
                dur="8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="ry"
                values="220;250;220"
                dur="7s"
                repeatCount="indefinite"
              />
            </ellipse>

            <ellipse
              cx="1100"
              cy="700"
              rx="260"
              ry="160"
              fill="url(#blob-blue-2)"
              opacity="0.7"
            >
              <animate
                attributeName="cx"
                values="1100;1080;1120;1100"
                dur="19s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="700;720;680;700"
                dur="17s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values="260;290;260"
                dur="10s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="ry"
                values="160;190;160"
                dur="9s"
                repeatCount="indefinite"
              />
            </ellipse>

            <ellipse
              cx="700"
              cy="200"
              rx="180"
              ry="120"
              fill="url(#blob-blue-3)"
              opacity="0.5"
            >
              <animate
                attributeName="cx"
                values="700;720;680;700"
                dur="22s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="200;180;220;200"
                dur="21s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values="180;200;180"
                dur="12s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="ry"
                values="120;140;120"
                dur="11s"
                repeatCount="indefinite"
              />
            </ellipse>

            <circle cx="300" cy="700" r="8" fill="#2563eb" opacity="0.6">
              <animate
                attributeName="r"
                values="8;12;8"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0.3;0.6"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            <circle cx="900" cy="300" r="6" fill="#2563eb" opacity="0.6">
              <animate
                attributeName="r"
                values="6;10;6"
                dur="4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0.3;0.6"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>

            <circle cx="1200" cy="500" r="7" fill="#2563eb" opacity="0.6">
              <animate
                attributeName="r"
                values="7;11;7"
                dur="3.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0.3;0.6"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>
      </div>

      <div
        className={`relative z-10 bg-white/30 backdrop-blur-lg shadow-2xl p-8 sm:p-10 rounded-3xl max-w-md w-full text-center border border-white/30 transition-all duration-700 transform ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {paymentComplete ? (
          <PaymentSuccess />
        ) : (
          <>
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-600 rounded-full p-5 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-[#2563eb] mb-4 mt-6">
              Complete Your Payment
            </h2>

            <div className="w-16 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>

            <p className="mb-8 text-[#2563eb] font-medium">
              Click below to pay ₹{fee} securely via Razorpay
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handlePayment}
                disabled={loading}
                className={`relative bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 cursor-pointer w-full sm:w-auto ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2 justify-center">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <span className="mr-2">Pay ₹{fee}</span>
                    <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                      →
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={() => router.back()}
                disabled={loading}
                className="border border-gray-300 hover:border-gray-400 bg-white text-gray-700 font-medium px-6 py-3 rounded-full transition-all duration-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>

            <p className="mt-6 text-xs text-gray-600 dark:text-gray-300">
              Secured by Razorpay Payment Gateway
            </p>

            <div className="mt-8 flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
                <span className="text-xs">Secure</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-xs">Quick</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-xs">Reliable</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MakePayment;
