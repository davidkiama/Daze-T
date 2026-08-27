import React, { useState, useEffect } from "react";

// New component for the educational content
const EducationSection = ({ darkMode }) => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  // The structure you provided, now integrated with React state logic
  return (
    <div className={`education-section ${darkMode ? "dark-3" : ""}`}>
      {/* NY Reversal Scanner Strategy    */}
      <div className="accordion-item">
        <div
          className={`accordion-header ${darkMode ? "dark" : ""}`}
          onClick={() => toggleAccordion("concept")}
        >
          <h3>What is the Core Concept?</h3>
          <span className="accordion-toggle">{activeAccordion === "concept" ? "−" : "+"}</span>
        </div>
        <div className={`accordion-content ${activeAccordion === "concept" ? "open" : ""}`}>
          <p>
            This strategy attempts to capture intraday reversals during the New York morning
            session. It establishes a "Baseline" range during the overnight and early morning hours,
            waits for a false breakout during the NY "Killzone," and enters limit orders on the
            subsequent pullback to catch the reversal.
          </p>
        </div>
      </div>

      {/* How to Use This Tool */}
      <div className="accordion-item">
        <div
          className={`accordion-header ${darkMode ? "dark" : ""}`}
          onClick={() => toggleAccordion("timings")}
        >
          <h3>Session Timings</h3>
          <span className="accordion-toggle">{activeAccordion === "timings" ? "−" : "+"}</span>
        </div>
        <div className={`accordion-content ${activeAccordion === "timings" ? "open" : ""}`}>
          <p>
            The strategy operates strictly on a New York time schedule. It requires a timezone
            offset (ServerToNY_OffsetHours) to ensure the broker server time aligns with these NY
            phases:
            <ul>
              <li>00:00 to 10:00 NY: Baseline Building Phase (Observation only)</li>

              <li>10:00 to 11:00 NY: Killzone Phase (Active scanning & execution)</li>

              <li>11:00+ NY: End of session (No new trades taken)</li>
            </ul>
          </p>
        </div>
      </div>

      <div className="accordion-item">
        <div
          className={`accordion-header ${darkMode ? "dark" : ""}`}
          onClick={() => toggleAccordion("baseline")}
        >
          <h3>Establish the Baseline. 00:00 - 10:00 NY Time.</h3>
          <span className="accordion-toggle">{activeAccordion === "baseline" ? "−" : "+"}</span>
        </div>
        <div className={`accordion-content ${activeAccordion === "baseline" ? "open" : ""}`}>
          <p>
            The EA tracks the highest High (baselineHigh) and lowest Low (baselineLow) formed during
            this 10-hour window. This establishes the trading range for the session.
          </p>
        </div>
      </div>

      <div className="accordion-item">
        <div
          className={`accordion-header ${darkMode ? "dark" : ""}`}
          onClick={() => toggleAccordion("breakout")}
        >
          <h3>Identify the Breakout. 10:00 - 11:00 NY Killzone.</h3>
          <span className="accordion-toggle">{activeAccordion === "breakout" ? "−" : "+"}</span>
        </div>
        <div className={`accordion-content ${activeAccordion === "breakout" ? "open" : ""}`}>
          <p>
            The strategy follows a strict procedural sequence to execute a trade. If any step fails
            to materialize, no trade is taken for the day. The strategy monitors live prices for a
            breakout of the baseline range.
            <ul>
              <li>
                Short Setup: Price breaks above baselineHigh. The EA tracks the absolute peak of
                this breakout as the extremeLevel.
              </li>
              <li>
                Long Setup: Price breaks below baselineLow. The EA tracks the absolute bottom of
                this breakout as the extremeLevel.
              </li>
            </ul>
          </p>
        </div>
      </div>

      <div className="accordion-item">
        <div
          className={`accordion-header ${darkMode ? "dark" : ""}`}
          onClick={() => toggleAccordion("reversal")}
        >
          <h3>Confirm the Reversal</h3>
          <span className="accordion-toggle">{activeAccordion === "reversal" ? "−" : "+"}</span>
        </div>
        <div className={`accordion-content ${activeAccordion === "reversal" ? "open" : ""}`}>
          <p>
            Once an extremeLevel is established, the EA waits for price to snap back in the opposite
            direction. It calculates a trigger level using a Fibonacci ratio (FibTrigger = 23.6%) of
            the total range (from the baseline to the extreme level). If price touches this 23.6%
            retracement line, the reversal is confirmed.
          </p>
        </div>
      </div>

      <div className="accordion-item">
        <div
          className={`accordion-header ${darkMode ? "dark" : ""}`}
          onClick={() => toggleAccordion("execution")}
        >
          <h3>Executing limit orders</h3>
          <span className="accordion-toggle">{activeAccordion === "execution" ? "−" : "+"}</span>
        </div>
        <div className={`accordion-content ${activeAccordion === "execution" ? "open" : ""}`}>
          <p>
            Immediately upon confirming Signal 2, places two Limit Orders into the market to catch a
            deeper pullback toward the extreme level before the true reversal happens. The amount of
            risk for both trades is advised to be the same so for example a $10,000 account one
            could risk 0.5% of the account for each trade. This means that we have Trade B with a
            risk of $50 and Trade A also with a risk of $50 Totaling up to $100 (1% of account) on
            one trade idea Take profits for each trade to be placed at 0.62 on the fib level. This
            will ensure the risk:reward on Trade B to be 1:2 and for Trade A to be 1:3
          </p>
        </div>
      </div>
    </div>
  );
};

export default EducationSection;
