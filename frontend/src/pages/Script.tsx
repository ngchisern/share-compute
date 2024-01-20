import './Script.css';
import { useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Button, TextField } from '@mui/material';

function Script() {
    const [code, setCode] = useState("");
    const [entryPoint, setEntryPoint] = useState("");
    const [argument, setArgument] = useState("");

    return (
        <div className="script-container">
            <div className="script-left-panel">
            <CodeEditor
                className='script-code'
                value={code}
                language="py"
                placeholder="Write your python script here!"
                onChange={(evn) => setCode(evn.target.value)}
                padding={15}
                style={{
                    fontSize: 15,
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
            />
            </div>
            <div className="script-right-panel">
                <div className="script-text-field">
                    <h4
                        style={
                            {
                                textAlign: "left",
                                marginLeft: "10%"
                            }
                        }>
                        Entry Point</h4>
                    <TextField
                        placeholder="Your function name"
                        type="text"
                        value={entryPoint}
                        onChange={(e) => setEntryPoint(e.target.value)}
                        style={
                            {
                                width: "80%"
                            }
                        }
                    />
                </div>
                <div className="script-text-field">
                    <h4
                        style={ 
                        {
                            textAlign: "left",
                            marginLeft: "10%"
                        }
                    }>
                        Arguments</h4>
                    <TextField
                        placeholder="E.g. [1, 2, 3]"
                        type="text"
                        value={argument}
                        onChange={(e) => setArgument(e.target.value)}
                        style={
                            {
                                width: "80%"
                            }
                        }
                    />
                </div>
                <div className='done-button'>
                    <Button variant="contained" color="success">Done</Button>

                </div>
            </div>
        </div>
    );
}

export default Script;