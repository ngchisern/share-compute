import { useState } from "react";
import Draggable from "react-draggable";

function WorkflowPage() {
    const [name, setName] = useState<string>("");

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button>+</button>
            </div>
            {/* <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Draggable>
                    <div style={{ border: '1px solid black', padding: '10px' }}>
                        Draggable Block
                    </div>
                    <div style={{ border: '1px solid black', padding: '10px' }}>
                        Draggable Block
                    </div>
                    <div style={{ border: '1px solid black', padding: '10px' }}>
                        Draggable Block
                    </div>
                </Draggable>
            </div> */}
        </div>
    )
}

export default WorkflowPage;