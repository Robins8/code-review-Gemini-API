import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1;\n}`);
  const [review, setReview] = useState("");

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });
      setReview(response.data);
    } catch (error) {
      console.error("Error calling backend:", error);
      setReview("⚠ Failed to get review. Make sure backend is running.");
    }
  }

  return (
    <main>
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            padding={10}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 16,
              height: "100%",
            }}
          />
        </div>
        <div className="review" onClick={reviewCode}>
          Review
        </div>
      </div>
      <div className="right">
        <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
      </div>
    </main>
  );
}

export default App;
