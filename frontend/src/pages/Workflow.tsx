import "../App.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Paper,
    Select,
    TextField
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Draggable from "react-draggable";


type Engine = {
    _id: string;
    name: string;
    status: any;
}


function WorkflowPage() {
    const [name, setName] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [selectedEngine, setSelectedEngine] = useState<any>(null);
    const [jobs, setJobs] = useState<any[]>([]);

    const handleClickOpen = () => {
        setOpen(true);
        setSelectedEngine(null);
    };
    const handleClose = () => {
        setOpen(false);
        // do nothing after closing dialog if no engine is selected
        if (selectedEngine === null) {
            return;
        }
        const newJob = selectedEngine
        setJobs([...jobs, newJob]);
    };

    return (
        <div className="workflow">
            <div className="top-bar">
                <TextField
                    variant="filled"
                    placeholder="My New Workflow"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={handleClickOpen}
                >
                    +
                </Button>
            </div>
            <div className="workspace">
                {jobs.map((job, index) => (
                    <Draggable key={index}>
                        <Button>
                            {job}
                        </Button>
                    </Draggable>
                ))}
            </div>
            <Button>
                Execute
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{"Select an engine"}</DialogTitle>
                <DialogContent>
                    <Select onChange={(event) => setSelectedEngine(event.target.value)}>
                        {useQuery(api.engine.get)?.map(object => (
                            <MenuItem value={object._id} key={object._id}>
                                {object.name}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Okay</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default WorkflowPage;