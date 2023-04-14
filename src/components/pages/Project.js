import {v4 as uuidv4} from 'uuid'

import styles from './Project.module.css'
import {useParams} from 'react-router-dom'
import {useState,useEffect} from 'react'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard'
import Message from '../layout/Message'

function Project(){

    const { id } = useParams()
    const [project,setProject] = useState()
    const [services,setServices] = useState()
    const [showProjectForm,SetShowProjectForm] = useState(false)
    const [showServiceForm,SetShowServiceForm] = useState(false)
    const [message,setMessage] = useState()
    const [type,setType] = useState()
    
    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`,{
            method: "GET",
            headers: {
                'Content-Type': 'application-json',
            }
        })
        .then(resp => resp.json())
        .then((data) => {
            setProject(data)
            setServices(data.services)
        })
        .catch((err) => console.log(err))

        },3000)
    },[id])

    function editPost(project){
        setMessage('')
        //budget validation
        if(project.budget < project.cost){
            setMessage("The budget cannot be lower than project cost")
            setType("error")
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
        .then(resp => resp.json())
        .then((data) => {
            setProject(data)
            SetShowProjectForm(true)
            setMessage("Project updated")
            setType("success")
        })
        .catch(err => console.log(err))

    }

    function createService(project){
        setMessage('')

        const lastService = project.services[project.services.length -1]
        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        if(newCost > parseFloat(project.budget)){
            setMessage("buget invalid, check the service cost")
            setType("error")
            project.services.pop()
            return false
        }

        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`,{
        method: "PATCH",
        headers:{
            "Content-Type": 'application/json',
        },
        body: JSON.stringify(project)
        })
        .then(resp => resp.json())
        .then(data => {
            SetShowServiceForm(false)
            setMessage("Service added successfully")
            setType("success")
        })
        .catch(err => console.log(err))

    }

    function toggleProjectForm(){
        SetShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm(){
        SetShowServiceForm(!showServiceForm)
    }

    function removeService(id,cost){

        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project

        projectUpdated.services = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)
        
        fetch(`http://localhost:5000/projects/${projectUpdated.id}`,{
            method:"PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(projectUpdated)

        })
        .then(resp => resp.json())
        .then(data => {
            setProject(projectUpdated)
            setServices(servicesUpdated)
            setMessage("Service successfully removed")
            setType("success")
        })
        .catch(err => console.log(err))

    }

    return(
        <>
        {project ? (
            <div className={styles.projectDetails}>
                <Container customClass="column">
                    {message && <Message type={type} msg={message}/>}
                    <div className={styles.detailsContainer}>
                        <h1>Project: {project.name}</h1>
                        <button className={styles.btn} onClick={toggleProjectForm}>{showProjectForm ? "Edit Project" : "Close"}</button>
                        {!showProjectForm ? (
                            <div className={styles.projectInfo}>
                                <ProjectForm handleSubmit={editPost} btnText="Edit" projectData={project}/>
                            </div>
                            
                        ) : (
                            <div className={styles.projectInfo}>
                            <p><span>Categories:</span>{project.category.name}</p>
                            <p><span>Buget:</span>R${project.budget}</p>
                            <p><span>Total wasted:</span>R${project.cost}</p>
                            </div>
                        )}
                    </div>
                    <div className={styles.serviceFormContainer}>
                        <h2>Add an service:</h2>
                        <button className={styles.btn} onClick={toggleServiceForm}>
                        {showServiceForm ? "Close" : "New service"}</button>
                        <div className={styles.projectInfo}>
                            {showServiceForm &&(
                                <ServiceForm
                                handleSubmit={createService}
                                btnText="Add Service"
                                projectData={project}
                                />
                        )}
                        </div>
                    </div>
                    <h2>Services</h2>
                    <Container customClass="start">
                        {services.length > 0 && (
                            services.map((service) => (
                                <ServiceCard
                                id={service.id}
                                name={service.name}
                                cost={service.cost}
                                description={service.description}
                                key={service.id}
                                handleRemove={removeService}
                                />
                            ))
                        )}
                        {services.length === 0 && <p>no services</p>}
                    </Container>
                </Container>
            </div>
        ): (
            <Loading/>
        )}
        </>
    )

}

export default Project