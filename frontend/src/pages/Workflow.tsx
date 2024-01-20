import "../App.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import Draggable from "react-draggable";
import Xarrow, { Xwrapper } from "react-xarrows";



type Line = {
    from: string;
    to: string;
}



function WorkflowPage() {
    const [name, setName] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [selectedEngine, setSelectedEngine] = useState<any>(null);
    const [jobs, setJobs] = useState<any[]>([]);
    const [boxes, setBoxes] = useState<JSX.Element[]>([]);
    const [addLinkBtnText, setAddLinkBtnText] = useState("+ Link");
    const [addLinkBtnEnabled, setAddLinkBtnEnabled] = useState(true);
    const [selecting, setSelecting] = useState(""); // 'source' or 'destination'
    const [source, setSource] = useState<string>("");
    const [lines, setLines] = useState<Line[]>([]);

    const handleAddEngine = () => {
        setOpen(true);
        setSelectedEngine(null);
    };
    const onSourceClick = (job: string) => {
        console.log('selecting source');
        setSource(job);
        setAddLinkBtnText("Click on destination engine");
        setSelecting("destination");
    }
    const onDestClick = (job: string) => {
        console.log('selecting dest');
        setAddLinkBtnEnabled(true);
        setAddLinkBtnText("+ Link");
        const line = { from: source, to: job };
        setLines([...lines, line]);
        console.log(line)
        console.log(lines);
        setSelecting("");
        setSource("");
    }
    const handleClose = () => {
        setOpen(false);
        // do nothing after closing dialog if no engine is selected
        if (selectedEngine === null) {
            return;
        }
        const newJob = selectedEngine + '_' + jobs.length
        setJobs([...jobs, newJob]);
        const newBox = <Draggable onMouseDown={
            () => { selecting === 'destination' ? onDestClick(newJob) : onSourceClick(newJob) }}>
            <div style={{ width: "100px", height: "100px", backgroundColor: "lightblue" }}>{newJob}</div>
        </Draggable>
        setBoxes([...boxes, newBox]);
    };
    const handleAddLink = () => {
        console.log("handle add link")
        setSelecting('source');
        setAddLinkBtnText("Click on source engine");
        setAddLinkBtnEnabled(false);
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
                {jobs.map((job) => <Draggable onMouseDown={
                    () => {
                        if (selecting === 'source') { onSourceClick(job); }
                        else if (selecting === 'destination') { onDestClick(job) };
                    }}>
                    <div id={job} style={{ width: "100px", height: "100px", backgroundColor: "lightblue" }}>{job}</div>
                </Draggable>)}
                <Xwrapper>
                    {lines.map((line, i) => (
                        <Xarrow key={i} start={line.from} end={line.to} zIndex={100} />
                    ))}
                </Xwrapper>
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