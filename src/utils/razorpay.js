import api from "../api/axiosConfig";

export async function payWithRazorpay(amount, gameIds = [], userDetails = {}, onSuccess, onFailure) {
  try {
    const { data } = await api.post("/payment/create-order", { amount, gameIds });

    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "Your Game Store",
      description: "Order Payment",
      order_id: data.orderId,

      handler: async function (response) {
        try {
          const verifyRes = await api.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            onSuccess(response);
          } else {
            onFailure("Payment verification failed");
          }
        } catch (err) {
          onFailure("Verification error");
        }
      },

      prefill: {
        name: userDetails.name || "",
        email: userDetails.email || "",
        contact: userDetails.contact || "",
      },

      notes: {
        order_context: "Game Store Purchase",
      },

      theme: { color: "#22c55e" },

      modal: {
        ondismiss: function () {
          onFailure("Payment cancelled by user");
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      onFailure(response.error.description || "Payment failed");
    });

    rzp.open();
  } catch (err) {
    onFailure("Could not initiate payment");
  }
}