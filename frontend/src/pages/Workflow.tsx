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

// const boxStyle = { border: 'grey solid 2px', borderRadius: '10px', padding: '5px' };

const DraggableBox = ({ id }) => {
    const updateXarrow = useXarrow();
    return (
        <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
            <div id={id}>
                {id}
            </div>
        </Draggable>
    );
};


function WorkflowPage() {
    const [name, setName] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [selectedEngine, setSelectedEngine] = useState<any>(null);
    const [jobs, setJobs] = useState<any[]>([]);
    const [addLinkBtnText, setAddLinkBtnText] = useState("+ Link");
    const [addLinkBtnEnabled, setAddLinkBtnEnabled] = useState(true);
    const [isSelectingSource, setIsSelectingSource] = useState(false);
    const [isSelectingDest, setIsSelectingDest] = useState(false);
    const [sourceEngine, setSourceEngine] = useState(null);
    const [destEngine, setDestEngine] = useState(null);

    const handleAddEngine = () => {
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
    const handleAddLink = () => {
        console.log("hello")
        // TODO handle from and to using states
        setAddLinkBtnText("Click on source engine");
        setAddLinkBtnEnabled(false);
        setIsSelectingSource(true);
    }
    const onEngineClick = (event) => {
        // TODO handle script
        if (isSelectingSource) {
            setSourceEngine(event.target);
            setIsSelectingSource(false);
            setIsSelectingDest(true);
        } else if (isSelectingDest) {
            setDestEngine(event.target);
            setIsSelectingDest(false);
            // TODO draw line
        }
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
                <Xwrapper>
                    <DraggableBox id={'elem1'} />
                    <DraggableBox id={'elem2'} />
                    <Xarrow start={'elem1'} end="elem2" />
                </Xwrapper>
                {/* {jobs.map((job, index) => (
                    <DraggableBox id={index}>
                        <Button>
                            {job}
                        </Button>
                    </DraggableBox>
                ))} */}
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