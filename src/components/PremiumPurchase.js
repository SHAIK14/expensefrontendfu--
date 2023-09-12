import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PremiumPurchase.css";
// import { Jwt } from "jsonwebtoken";
const PremiumPurchase = () => {
  // const [isPremium, setIsPremium] = useState(false);
  // const token = localStorage.getItem("token");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isPremium, setIsPremium] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  useEffect(() => {
    // Update the token from local storage and check if the user is premium
    const decodedToken = parseJwt(token);
    setIsPremium(decodedToken && decodedToken.isPremium);
  }, [token]);

  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }
  const decodedToken = parseJwt(token);
  console.log(decodedToken);
  const fetchLeaderboardData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/premium/showLeaderBoard",
        {
          headers: { Authorization: token },
        }
      );
      setLeaderboardData(response.data);
      // Toggle the leaderboard visibility
      setShowLeaderboard(!showLeaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      // Handle the error, e.g., show an error message to the user
    }
  };
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const result = await axios.get(
      "http://localhost:4000/api/purchase/premiummembership",
      { headers: { Authorization: token } }
    );

    if (!result || !result.data.order_id) {
      alert("Server error or missing order ID. Are you online?");
      return;
    }

    const { amount, order_id, currency } = result.data;
    console.log(amount, order_id, currency);

    const options = {
      key: "rzp_test_3iiTrQs6HNxDQF", // Enter the Key ID generated from the Dashboard

      currency: currency,
      name: "Expense.",
      description: "Test Transaction",

      order_id: order_id,

      handler: async function (response) {
        console.log(response);

        axios
          .post(
            "http://localhost:4000/api/purchase/updatetransactionstatus",
            {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
            },
            { headers: { Authorization: token } }
          )
          .then((response) => {
            const newToken = response.data.token; // Assuming your API returns the new token
            localStorage.setItem("token", newToken); // Set the new token in localStorage

            // Update the state with the new token
            setToken(newToken);

            alert("You are a premium user");
          })
          .catch(() => {
            alert("Something went wrong. Try Again!!!");
          });

        // axios
        //   .post(
        //     "http://localhost:4000/api/purchase/updatetransactionstatus",
        //     {
        //       payment_id: response.razorpay_payment_id,
        //       order_id: response.razorpay_order_id,
        //     },
        //     { headers: { Authorization: token } }
        //   )
        //   .then(() => {
        //     alert("you are a premium user");
        //   })
        //   .catch(() => {
        //     alert("Something went wrong. Try Again!!!");
        //   });
      },
      prefill: {
        name: "Expense",
        email: "Expense123@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Test",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
  return (
    <div>
      {isPremium ? (
        <div>
          <h1 className="user">Premium user</h1>
          <button onClick={fetchLeaderboardData} className="show-leaderboard">
            {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
          </button>
          {showLeaderboard && (
            <div className="leaderboard">
              <h2>Leaderboard</h2>
              <ul className="leaderboard-list">
                {leaderboardData.map((user, index) => (
                  <li key={index} className="leaderboard-item">
                    <span className="leaderboard-name">{user.name}:</span>{" "}
                    <span className="leaderboard-cost">{user.total_cost}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button onClick={displayRazorpay} className="buypremium">
          Buy Premium
        </button>
      )}
    </div>

    // <div>
    //   {isPremium ? (
    //     <div>
    //       <h1 className="user">Premium user</h1>
    //       <button onClick={fetchLeaderboardData} className="show-leaderboard">
    //         {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
    //       </button>
    //       {showLeaderboard && (
    //         <div className="leaderboard">
    //           <h2>Leaderboard</h2>
    //           <ul>
    //             {leaderboardData.map((user, index) => (
    //               <li key={index}>
    //                 {user.name}: {user.total_cost}
    //               </li>
    //             ))}
    //           </ul>
    //         </div>
    //       )}
    //     </div>
    //   ) : (
    //     <button onClick={displayRazorpay} className="buypremium">
    //       Buy Premium
    //     </button>
    //   )}
    // </div>
  );
};
export default PremiumPurchase;

// "handler": function (response) {
//   console.log(response);
//   axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
//       order_id: options.order_id,
//       payment_id: response.razorpay_payment_id,
//   }, { headers: {"Authorization" : token} }).then(() => {
//       alert('You are a Premium User Now')
//   }).catch(() => {
//       alert('Something went wrong. Try Again!!!')
//   })
// },
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function PremiumPurchase() {
//   const [paymentData, setPaymentData] = useState(null);
//   const [scriptLoaded, setScriptLoaded] = useState(false);
//   const token = localStorage.getItem("token");

//   const loadScript = (src) => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = src;
//       script.onload = () => {
//         resolve(true);
//       };
//       script.onerror = () => {
//         resolve(false);
//       };
//       document.body.appendChild(script);
//     });
//   };

//   const displayRazorpay = async () => {
//     if (paymentData && scriptLoaded) {
//       try {
//         const response = await axios.get(
//           "http://localhost:4000/api/purchase/premiummembership",
//           { headers: { Authorization: token } }
//         );
//         setPaymentData(response.data);

//         const { key_id, order } = response.data;

//         const options = {
//           key: key_id,
//           name: "Expense premium",
//           order_id: order.id,
//           prefill: {
//             name: "shaik asif",
//             email: "smd.20sa@gmail.com",
//             contact: "9553875763",
//           },
//           theme: { color: "#3399cc" },
//         };

//         const result = await loadScript(
//           "https://checkout.razorpay.com/v1/checkout.js"
//         );

//         if (!result) {
//           alert("Razorpay SDK failed to load. Are you online?");
//           return;
//         }

//         const paymentObject = new window.Razorpay(options);
//         paymentObject.open();

//         paymentObject.on("payment.success", (response) => {
//           console.log("Payment successful!", response);
//           // Handle success as needed
//           handlePaymentSuccess(response);
//         });

//         paymentObject.on("payment.error", (error) => {
//           console.error("Payment error:", error);
//           // Handle payment error as needed
//           handlePaymentError(error);
//         });
//       } catch (error) {
//         console.error("Error fetching payment data:", error);
//         alert("Something went wrong. Try Again!!!");
//       }
//     }
//   };

//   const handlePaymentSuccess = async (response) => {
//     try {
//       await axios.post(
//         `http://localhost:4000/api/purchase/updatetransactionstatus?order_id=${paymentData.order.id}&payment_id=${response.razorpay_payment_id}`,
//         {},
//         {
//           headers: { Authorization: token },
//         }
//       );
//       alert("You are a Premium User Now");
//     } catch (error) {
//       alert("Something went wrong. Try Again!!!");
//     }
//   };

//   const handlePaymentError = (error) => {
//     console.error("Payment error:", error);
//   };

//   useEffect(() => {
//     const loadScript = async () => {
//       try {
//         const result = await loadScript(
//           "https://checkout.razorpay.com/v1/checkout.js"
//         );
//         setScriptLoaded(result);
//       } catch (error) {
//         console.error("Razorpay SDK failed to load.", error);
//       }
//     };
//     loadScript();
//   }, []);

//   return (
//     <div>
//       <button className="btn-addexpense" onClick={displayRazorpay}>
//         Buy Premium
//       </button>
//     </div>
//   );
// }

// export default PremiumPurchase;

// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import RazorpayCheckout from "react-razorpay"; // Import the Razorpay component
// // import "./Epense.css";

// const PremiumPurchase = () => {
//   const [paymentData, setPaymentData] = useState(null);
//   const [scriptLoaded, setScriptLoaded] = useState(false);
//   const token = localStorage.getItem("token");

//   const handlePaymentSuccess = async (response) => {
//     console.log("Payment successful!", response);
//     try {
//       await axios.post(
//         `http://localhost:4000/api/purchase/updatetransactionstatus?order_id=${paymentData.order.id}&payment_id=${response.razorpay_payment_id}`,
//         {},
//         {
//           headers: { Authorization: token },
//         }
//       );
//       alert("You are a Premium User Now");
//     } catch (error) {
//       alert("Something went wrong. Try Again!!!");
//     }
//   };

//   const handlePaymentError = (error) => {
//     console.error("Payment error:", error);
//   };

//   useEffect(() => {
//     const fetchPaymentData = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:4000/api/purchase/premiummembership",
//           { headers: { Authorization: token } }
//         );
//         setPaymentData(response.data);
//       } catch (error) {
//         console.error("Error fetching payment data:", error);
//       }
//     };
//     fetchPaymentData();
//   }, [token]);

//   useEffect(() => {
//     const loadScript = () => {
//       return new Promise((resolve) => {
//         // Check if the script is already loaded
//         const isLoaded = document.getElementById("razorpay-script");
//         if (isLoaded) {
//           // Resolve the promise with true
//           resolve(true);
//         } else {
//           // Create a new script element
//           const script = document.createElement("script");
//           script.id = "razorpay-script";
//           script.src = "https://checkout.razorpay.com/v1/checkout.js";
//           // Append the script to the document body
//           document.body.appendChild(script);
//           // Add an event listener for the load event
//           script.onload = () => {
//             // Resolve the promise with true
//             resolve(true);
//           };
//           // Add an event listener for the error event
//           script.onerror = () => {
//             // Resolve the promise with false
//             resolve(false);
//           };
//         }
//       });
//     };

//     loadScript().then((result) => {
//       setScriptLoaded(result);
//     });
//   }, []);

//   return (
//     <div>
//       <button
//         id="rzp-button1"
//         className="btn-addexpense"
//         onClick={async () => {
//           if (paymentData && scriptLoaded) {
//             try {
//               const response = await RazorpayCheckout({
//                 options: {
//                   key: paymentData.key_id,
//                   name: "Expense premium",
//                   order_id: paymentData.order.id,
//                   prefill: {
//                     name: "shaik asif",
//                     email: "smd.20sa@gmail.com",
//                     contact: "9553875763",
//                   },
//                   theme: { color: "#3399cc" },
//                 },
//               });

//               // Process the response from Razorpay
//               if (response.razorpay_payment_id) {
//                 handlePaymentSuccess(response);
//               } else {
//                 handlePaymentError("Payment failed.");
//               }
//             } catch (error) {
//               handlePaymentError(error);
//             }
//           }
//         }}
//       >
//         Buy Premium
//       </button>
//     </div>
//   );
// };

// export default PremiumPurchase;

// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import RazorpayCheckout from "react-razorpay"; // Import the Razorpay component
// import "./Epense.css";

// const PremiumPurchase = () => {
//   const [paymentData, setPaymentData] = useState(null);
//   const token = localStorage.getItem("token");

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

//   useEffect(() => {
//     fetchPaymentData();
//   }, [token, fetchPaymentData]);

//   const handlePaymentSuccess = (response) => {
//     console.log("Payment successful!", response);

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
//   };

//   return (
//     <div>
//       <button
//         id="rzp-button1"
//         className="btn-addexpense"
//         onClick={() => {
//           if (!paymentData) {
//             fetchPaymentData();
//           } else {
//             <RazorpayCheckout
//               options={{
//                 key: paymentData.key_id,
//                 name: "Expense premium",
//                 order_id: paymentData.order.id,
//                 prefill: {
//                   name: "shaik asif",
//                   email: "smd.20sa@gmail.com",
//                   contact: "9553875763",
//                 },
//                 theme: {
//                   color: "#3399cc",
//                 },
//                 handler: handlePaymentSuccess,
//               }}
//               onPaymentError={handlePaymentError}
//             >
//               Pay with Razorpay
//             </RazorpayCheckout>;
//           }
//         }}
//       >
//         Buy Premium
//       </button>
//     </div>
//   );
// };

// export default PremiumPurchase;

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
