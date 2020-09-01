import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap';
import addMemoryStyles from './AddMemory.module.css';

function AddMemory(props : any) {
    
    const [memory, setMemory] = useState('');

    const addMemory = (event) => {
        event.preventDefault();
        if(memory.length > 0)
            props.createMemory(memory);
    }

    return (
        <div className={addMemoryStyles.bttmDiv}>
            <Form onSubmit={addMemory}>
                <Form.Control className={`mb-2 ${addMemoryStyles.inpTa}`} as="textarea" rows={4} placeholder="Add a memory" value={memory} onChange={e => setMemory(e.target.value)}/>
                <Button type="submit" className={addMemoryStyles.adMryBtn}>Add memory</Button>
            </Form>
        </div>
    )
}

export default AddMemory
