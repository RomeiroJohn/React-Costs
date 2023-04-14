import { useState} from 'react'

import Input from '../form/Input'
import Submit from '../form/Submit'

import styles from '../project/ProjectForm.module.css'

function ServiceForm({handleSubmit, btnText, projectData}){

    const [service,setService] = useState()

    function submit(e){
        e.preventDefault()
        projectData.services.push(service)
        handleSubmit(projectData)
    }

    function handleChange(e){
        setService({...service, [e.target.name]: e.target.value})
    }
    return(
        <form onSubmit={submit} className={styles.form}>
            <Input
            type="text"
            text="Service name:"
            name="name"
            placeholder="Insert the service name"
            handleOnChange={handleChange}
            />
            <Input
            type="number"
            text="service cost"
            name="cost"
            placeholder="Insert the total value"
            handleOnChange={handleChange}
            />
            <Input
            type="text"
            text="Description:"
            name="description"
            placeholder="Insert an description"
            handleOnChange={handleChange}
            />
            <Submit text={btnText}/>
        </form>
    )
}

export default ServiceForm