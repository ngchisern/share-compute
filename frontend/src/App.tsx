import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import HomePage from "./pages/Home";
import WorkflowPage from "./pages/Workflow";
import ScriptPage from "./pages/Script";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/script" element={<ScriptPage />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;