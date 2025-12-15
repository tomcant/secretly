import { BrowserRouter, Routes, Route } from "react-router";
import { CreateSecret, HowItWorks, NotFound, ViewSecret } from "#/pages";

function App() {
  return (
    <BrowserRouter>
      <div className="gradient-bg relative overflow-hidden">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f1_1px,transparent_1px),linear-gradient(to_bottom,#6366f1_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-8"></div>

        <div
          className="relative flex items-center justify-center p-4 sm:p-10 z-10"
          style={{ minHeight: "100dvh" }}
        >
          <Routes>
            <Route path="/" element={<CreateSecret />} />
            <Route path="/secret/:id" element={<ViewSecret />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
