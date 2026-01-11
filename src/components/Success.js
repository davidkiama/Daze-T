import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Success({ darkMode }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // These come from the URL constructed in the Node redirect
  const kes = searchParams.get("amount");
  const phone = searchParams.get("phone");
  const orderId = searchParams.get("trackId");

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const review = e.target.review.value;
    console.log("Saving review to DB (Pseudo):", { orderId, review });
    alert("Thank you for your review!");
  };

  return (
    <main className={`${darkMode ? "dark-2" : ""} main`}>
      <section className="content">
        <div className="card">
          <h4 className="heading-4 card__heading">🎉 Order Submitted!</h4>
          <div className="card__content">
            {/* <div className="con">
              <span className="con--circle"> </span>
            </div> */}
            <div className="card__text">
              <p>
                <strong>Order ID:</strong> {orderId}
              </p>
              <p>
                <strong>Amount:</strong> {kes || "Processing..."}
              </p>
              <p>
                <strong>Mpesa number:</strong> {phone || "Processing..."}
              </p>
            </div>
            {/* <div className="con">
              <span className="con--circle"> </span>
            </div> */}
          </div>

          <div
            className="review-section"
            style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}
          >
            <h4>Leave a Review</h4>
            <form onSubmit={handleReviewSubmit}>
              <textarea
                name="review"
                placeholder="How was your experience?"
                rows="3"
                required
                className={`${darkMode ? "dark" : ""}`}
              ></textarea>
              <button type="submit" className={`${darkMode ? "dark" : ""} btn`}>
                Submit Review
              </button>
            </form>
          </div>

          <p style={{ marginTop: "2rem" }}>
            {!kes && !phone ? "Awaiting Blockchain confirmation..." : "Thank you for your order"}
          </p>

          <input
            type="submit"
            value="Back to Home"
            className={`${darkMode ? "dark" : ""} btn`}
            onClick={() => navigate("/")}
            style={{ marginTop: "20px" }}
          />
        </div>
      </section>
    </main>
  );
}

export default Success;
