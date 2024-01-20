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
import { toast } from 'react-toastify';
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";


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
    const [boxes, setBoxes] = useState<JSX.Element[]>([]);
    const [addLinkBtnText, setAddLinkBtnText] = useState("+ Link");
    const [addLinkBtnEnabled, setAddLinkBtnEnabled] = useState(true);

    const handleAddEngine = () => {
        setOpen(true);
        setSelectedEngine(null);
    };
    const DraggableBox = ({ id }) => {
        return (
            <Draggable>
                <div style={{ width: "100px", height: "100px", backgroundColor: "lightblue" }}>{id}</div>
            </Draggable>
        );
    };
    const handleClose = () => {
        setOpen(false);
        // do nothing after closing dialog if no engine is selected
        if (selectedEngine === null) {
            return;
        }
        const newJob = selectedEngine
        setJobs([...jobs, newJob]);
        const newId = selectedEngine + '_' + jobs.length;
        const newBox = <DraggableBox id={newId}></DraggableBox>
        setBoxes([...boxes, newBox]);
    };
    const handleAddLink = () => {
        console.log("hello")
        // TODO handle from and to using states
        setAddLinkBtnText("Click on source engine");
        setAddLinkBtnEnabled(false);
        setIsSelectingSource(true);
    }


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
                <div>
                    <Button variant="contained" onClick={handleAddEngine}>
                        + Engine
                    </Button>
                    <Button variant="contained" onClick={handleAddLink} disabled={!addLinkBtnEnabled}>
                        {addLinkBtnText}
                    </Button>
                </div>
            </div>
            <div className="workspace">
                {boxes}
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