import "../App.css";
import { useState } from "react";
import { Button, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Draggable from "react-draggable";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: 'Roboto',
        body1: {
            color: '#ffffff'
        }
    }
})

function WorkflowPage() {
    const [name, setName] = useState<string>("");

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="workflow">
                <div className="top-bar">
                    <TextField
                        placeholder="My New Workflow"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Button variant="contained">
                        +
                    </Button>
                </div>
                <div className="panel">
                    bla
                </div>
            </div>
        </ThemeProvider>
    )
}

export default WorkflowPage;