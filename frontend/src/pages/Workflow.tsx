import "./Workflow.css";
import Script from "./Script";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
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
import BarLoader from "react-spinners/BarLoader";



type Script = {
    id?: any;
    entry_point: string;
    arguments: any[];
    content: string;
    output?: string | null;
}

type Job = {
    id?: any;
    component_id: string;
    script?: Script;
    engine_id: any;
    component_content?: JSX.Element;
    completed?: boolean;
}

type Line = {
    from: Job;
    to: Job;
}


function WorkflowPage() {
    const [name, setName] = useState<string>("");
    const [openEngine, setOpenEngine] = useState(false);
    const [selectedEngine, setSelectedEngine] = useState<any>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [boxes, setBoxes] = useState<JSX.Element[]>([]);
    const [addLinkBtnText, setAddLinkBtnText] = useState("+ Link");
    const [addLinkBtnEnabled, setAddLinkBtnEnabled] = useState(true);
    const [selecting, setSelecting] = useState(""); // 'source' or 'destination'
    const [source, setSource] = useState<Job | null>(null);
    const [lines, setLines] = useState<Line[]>([]);
    const [openScript, setOpenScript] = useState(false);
    const [currentJob, setCurrentJob] = useState<Job | null>(null);    // currently editing job
    const [isPolling, setIsPolling] = useState(false);
    const [currentScriptId, setCurrentScriptId] = useState<any>("");    // for getting outputs

    // TODO ensure only create one workflow
    var workflowId: any = '';
    const createWorkflow = useMutation(api.workflow.createWorkflow);
    createWorkflow().then(id => { workflowId = id; });

    const runWorkflow = useMutation(api.workflow.runWorkflow);
    const createScript = useMutation(api.script.createScript);
    const createJob = useMutation(api.job.createJob);
    const connectJobs = useMutation(api.job.connectJobs);
    const enableJob = useMutation(api.job.enableJob);
    const output = useQuery(api.script.getOutput, { id: currentScriptId });

    const handleAddEngine = () => {
        setOpenEngine(true);
        setSelectedEngine(null);
    };
    const onSourceClick = (job: Job) => {
        console.log('selecting source');
        setSource(job);
        setAddLinkBtnText("Click on destination engine");
        setSelecting("destination");
    }
    const onDestClick = (job: Job) => {
        console.log('selecting dest');
        setAddLinkBtnEnabled(true);
        setAddLinkBtnText("+ Link");
        if (source == null) return;
        const line = { from: source, to: job };
        setLines([...lines, line]);
        console.log(line)
        console.log(lines);
        setSelecting("");
        setSource(null);
    }
    const handleClose = () => {
        setOpenEngine(false);
        // do nothing after closing dialog if no engine is selected
        if (selectedEngine === null) {
            return;
        }
        const component_content = <a>{selectedEngine}</a>;
        const newJob: Job = {
            component_id: selectedEngine + '_' + jobs.length,
            engine_id: selectedEngine,
            component_content: component_content
        };
        setJobs([...jobs, newJob]);
        const newBox = <Draggable onMouseDown={
            () => { selecting === 'destination' ? onDestClick(newJob) : onSourceClick(newJob) }}>
            <div style={{ width: "100px", height: "100px", backgroundColor: "lightblue" }}>{newJob.component_id}</div>
        </Draggable>
        setBoxes([...boxes, newBox]);
    };
    const handleAddLink = () => {
        console.log("handle add link");
        setSelecting('source');
        setAddLinkBtnText("Click on source engine");
        setAddLinkBtnEnabled(false);
    }
    const handleOpenScript = (job: Job) => {
        // TODO pass current job script to continue editing
        console.log("handle open script");
        setOpenScript(true);
        setCurrentJob(job);
    }
    const onScriptDone = (newCode: string, newEntryPoint: string, newArgument: string) => {
        var args: any[] = [];
        try {
            args = JSON.parse(newArgument);
        } catch (error) {
            args = [newArgument];
        }
        if (!Array.isArray(args)) {
            args = [args];
        }
        const script: Script = { content: newCode, entry_point: newEntryPoint, arguments: args };
        console.log(script);
        setOpenScript(false);
        if (currentJob === null) return;
        currentJob.script = script;
        setCurrentJob(null);
    }
    const onExecute = async () => {
        // for each job, insert the scripts and update script id, then insert job
        await jobs.forEach(async (job) => {
            const script = job.script;
            if (script == null) {
                console.error('null script for job: ');
                console.error(job);
                return;
            }
            console.log(script);
            await createScript({ entry_point: script?.entry_point, arguments: script?.arguments, content: script?.content })
                .then(id => { if (job.script == null) { return; } job.script.id = id; })
                .then(async () => {
                    if (job.script == null) return;
                    createJob({
                        script_id: job.script!.id,
                        engine_id: job.engine_id,
                        workflow_id: workflowId,
                    }).then(id => job.id = id);
                });
        });

        // Link jobs for each line and increase count
        lines.forEach((line) => {
            console.log(line);
            connectJobs({ from_id: line.from.id, to_id: line.to.id });
        })

        // set status of all jobs to runnable after setting up next jobs
        jobs.forEach((job) => enableJob({ id: job.id }));

        await runWorkflow({ id: workflowId });
        // TODO disable UI etc

        // change all job component content to loading bar
        jobs.forEach((job) => {
            job.component_content = <BarLoader />;
        })
        setJobs(jobs);

        // repeatedly check all unfinished jobs for output
        setIsPolling(true);
        // setInterval(() => {
        //     jobs.forEach((job) => {
        //         console.log(job);
        //         if (job.script == null) return;
        //         console.log("job script not empty");
        //         setCurrentScriptId(job.script.id);
        //         console.log(job.script.id + " " + output);
        //         if (output == null) return;
        //         job.script.output = output;
        //         job.component_content = <div>{output}</div>
        //         job.completed = true;
        //         setJobs(jobs);
        //     })
        // }, 3000);

        // TODO do only for final job (try)
    }

    return (
        <div className="workflow">
            <div className="top-bar">
                <TextField
                    placeholder="My New Workflow"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div>
                    <Button variant="contained" onClick={handleAddEngine}>
                        + Engine
                    </Button>
                    <Button variant="contained" onClick={handleAddLink} disabled={!addLinkBtnEnabled} style={{ marginLeft: "8px" }}>
                        {addLinkBtnText}
                    </Button>
                </div>
            </div>
            <div className="workspace">
                {jobs.map((job) => <Draggable
                    onMouseDown={
                        () => {
                            if (selecting === 'source') { onSourceClick(job); }
                            else if (selecting === 'destination') { onDestClick(job) };
                        }}>
                    <div
                        onDoubleClick={() => handleOpenScript(job)}
                        id={job.component_id}
                        style={{ display: "inline-block", padding: "10px", borderRadius: "4px", backgroundColor: "lightblue" }}>
                        {job.component_content}
                    </div>
                </Draggable>)}
                <Xwrapper>
                    {lines.map((line, i) => (
                        <Xarrow key={i} start={line.from.component_id} end={line.to.component_id} zIndex={100} />
                    ))}
                </Xwrapper>
            </div>
            <Button onClick={onExecute}>
                Execute
            </Button>
            <Dialog open={openEngine} onClose={handleClose}>
                <DialogTitle>Select an engine</DialogTitle>
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
            <Dialog open={openScript} fullWidth maxWidth="lg">
                <DialogTitle>Script Editor</DialogTitle>
                <DialogContent>
                    <Script onScriptDone={onScriptDone} />
                    {/* TODO */}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default WorkflowPage;