import { useState } from "react";
import "./App.css";
import * as toxicity from "@tensorflow-models/toxicity";

function App() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [result, setResult] = useState([]);

  function checkToxicity() {
    setLoading(true);
    toxicity
      .load(0.5)
      .then((model) => {
        model
          .classify([text])
          .then((predictions) => {
            console.log(predictions);
            setResult(predictions);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <h1>TensorFlow.js</h1>
      <div
        className="card"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          style={{ padding: "5px", height: "20px" }}
        />
        <button
          onClick={checkToxicity}
          disabled={loading}
          style={{ margin: "10px 0" }}
        >
          Check Toxicity
        </button>
        {loading ? (
          "Model is loading..."
        ) : result[0] ? (
          <>
            <p>Results:</p>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Probability</th>
                  <th>Toxic?</th>
                </tr>
              </thead>
              <tbody>
                {result?.map((r, i) => {
                  return (
                    <tr key={i}>
                      <td>{r.label}</td>
                      <td>
                        {(r.results[0].probabilities[1] * 100).toFixed(2)}
                      </td>
                      <td>{r.results[0].match ? "True" : "False"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ) : (
          "Type a message to see if it's obscene."
        )}
      </div>
    </>
  );
}

export default App;
