import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Razorpay from "react-razorpay"; // Import the Razorpay component
import "./Epense.css";

const PremiumPurchase = () => {
  const [paymentData, setPaymentData] = useState(null);
  const token = localStorage.getItem("token");

  const fetchPaymentData = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/purchase/premiummembership",
        { headers: { Authorization: token } }
      );
      setPaymentData(response.data);
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchPaymentData();
  }, [token, fetchPaymentData]);

  const handlePaymentSuccess = (response) => {
    console.log("Payment successful!", response);

    axios
      .post(
        "http://localhost:4000/api/purchase/updatetransactionstatus",
        {
          order_id: paymentData.order.id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      )
      .then(() => {
        alert("You are a Premium User Now");
      })
      .catch(() => {
        alert("Something went wrong. Try Again!!!");
      });
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    // Handle payment error as needed
  };

  return (
    <div>
      <button
        id="rzp-button1"
        className="btn-addexpense"
        onClick={() => {
          // Check if paymentData is available
          if (!paymentData) {
            // Payment data not fetched yet, fetch it first
            fetchPaymentData();
          } else {
            // Payment data is available, open the Razorpay popup
            // Use the Razorpay component directly
            // Pass the options and event handlers
            <Razorpay
              options={{
                key: paymentData.key_id,
                name: "Expense premium",
                order_id: paymentData.order.id,
                prefill: {
                  name: "shaik asif",
                  email: "smd.20sa@gmail.com",
                  contact: "9553875763",
                },
                theme: {
                  color: "#3399cc",
                },
                handler: handlePaymentSuccess, // Use the defined handler function
              }}
              onPaymentError={handlePaymentError}
            >
              Pay with Razorpay
            </Razorpay>;
          }
        }}
      >
        Buy Premium
      </button>
    </div>
  );
};

export default PremiumPurchase;

// const PremiumPurchase = () => {
//   const [paymentData, setPaymentData] = useState(null);
//   const token = localStorage.getItem("token"); // Get the token from localStorage

//   const fetchPaymentData = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:4000/api/purchase/premiummembership",
//         { headers: { Authorization: token } }
//       );
//       setPaymentData(response.data);
//     } catch (error) {
//       console.error("Error fetching payment data:", error);
//     }
//   }, [token]);

//   const openRazorpayPopup = () => {
//     // Check if paymentData is available
//     if (!paymentData) {
//       // Payment data not fetched yet, fetch it first
//       fetchPaymentData();
//     } else {
//       // Payment data is available, open the Razorpay popup

//       // Create a new instance of Razorpay
//       const rzp1 = new Razorpay({
//         key: paymentData.key_id,
//         name: "Expense premium",
//         order_id: paymentData.order.id,
//         prefill: {
//           name: "shaik asif",
//           email: "smd.20sa@gmail.com",
//           contact: "9553875763",
//         },
//         theme: {
//           color: "#3399cc",
//         },
//         handler: (response) => handlePaymentSuccess(response),
//       });

//       // Open the Razorpay payment popup
//       rzp1.open();
//     }
//   };

//   const handlePaymentSuccess = (response) => {
//     console.log("Payment successful!", response);

//     // Send a POST request to update the transaction status
//     axios
//       .post(
//         "http://localhost:4000/api/purchase/updatetransactionstatus",
//         {
//           order_id: paymentData.order.id,
//           payment_id: response.razorpay_payment_id,
//         },
//         { headers: { Authorization: token } }
//       )
//       .then(() => {
//         alert("You are a Premium User Now");
//       })
//       .catch(() => {
//         alert("Something went wrong. Try Again!!!");
//       });
//   };

//   return (
//     <div>
//       <button
//         id="rzp-button1"
//         className="btn-addexpense"
//         onClick={openRazorpayPopup}
//       >
//         Buy Premium
//       </button>
//     </div>
//   );
// };

// export default PremiumPurchase;

// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import Razorpay from "react-razorpay";
// import "./Epense.css";

// const PremiumPurchase = () => {
//   const [paymentData, setPaymentData] = useState(null);
//   const token = localStorage.getItem("token"); // Get the token from localStorage

//   const fetchPaymentData = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:4000/api/purchase/premiummembership",
//         { headers: { Authorization: token } }
//       );
//       setPaymentData(response.data);
//     } catch (error) {
//       console.error("Error fetching payment data:", error);
//     }
//   }, [token]);

//   // eslint-disable-next-line
//   useEffect(() => {
//     fetchPaymentData();
//   }, [token, fetchPaymentData]);

//   const handlePaymentSuccess = (response) => {
//     console.log("Payment successful!", response);

//     // Send a POST request to update the transaction status
//     axios
//       .post(
//         "http://localhost:4000/api/purchase/updatetransactionstatus",
//         {
//           order_id: paymentData.order.id,
//           payment_id: response.razorpay_payment_id,
//         },
//         { headers: { Authorization: token } }
//       )
//       .then(() => {
//         alert("You are a Premium User Now");
//       })
//       .catch(() => {
//         alert("Something went wrong. Try Again!!!");
//       });
//   };

//   const handlePaymentError = (error) => {
//     console.error("Payment error:", error);

//     // Handle payment error as needed
//   };

//   return (
//     <div>
//       <button
//         id="rzp-button1"
//         className="btn-addexpense"
//         onClick={fetchPaymentData} // Call fetchPaymentData directly
//       >
//         Buy Premium
//       </button>
//       {paymentData && (
//         <Razorpay
//           options={{
//             key: paymentData.key_id,
//             name: "Expense premium",
//             order_id: paymentData.order.id,
//             prefill: {
//               name: "shaik asif",
//               email: "smd.20sa@gmail.com",
//               contact: "9553875763",
//             },
//             theme: {
//               color: "#3399cc",
//             },
//             handler: (response) => handlePaymentSuccess(response),
//           }}
//           onPaymentError={handlePaymentError}
//         >
//           Pay with Razorpay
//         </Razorpay>
//       )}
//     </div>
//   );
// };

// export default PremiumPurchase;
