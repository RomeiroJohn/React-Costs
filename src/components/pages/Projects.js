import { useLocation } from 'react-router-dom'
import {useState, useEffect} from 'react'

import Message from '../layout/Message'
import Container from '../layout/Container'
import LinkButton from '../layout/LinkButton'
import ProjectCard from '../project/ProjectCard'
import Loading from '../layout/Loading'

import styles from './Projects.module.css'

function Projects(){

    const [projects,setProjects] = useState([])
    const [removeLoading,setRemoveLoading] = useState(false)
    const [projectMessage,setProjectMessage] = useState('')

    

    const location = useLocation()
    let message = ''

    if(location.state){
        message = location.state.message
    }

    useEffect(() => {
        setTimeout(() => { //immersion
            fetch('http://localhost:5000/projects',{
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(resp => resp.json())
        .then(data => {
            setProjects(data)
            setRemoveLoading(true)

        })
        .catch((err) => console.log(err))
        }, 3000)

    }, [])

    function removeProject(id) {
        fetch(`http://localhost:5000/projects/${id}`,{
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(resp => resp.json())
        .then(() => {
            setProjects(projects.filter((project) => project.id !== id))
            setProjectMessage('Project successfully deleted!')
            
        })
        .catch(err => console.log(err))
    }

    return (
        <div className={styles.projectContainer}>
            <div className={styles.titleContainer}>
                <h1>My Projects</h1>
                <LinkButton to='/newproject' text="Create Project"/>
            </div>
            {message && <Message type="success" msg={message} />}
            {projectMessage && <Message type="success" msg={projectMessage} />}
            <Container customClass="start">
                {projects && projects.map((project) => 
                <ProjectCard 
                id={project.id}
                name={project.name}
                budget={project.budget}
                category={project.category.name}
                key={project.id}
                handleRemove={removeProject}
                />
                )}
                {!removeLoading && <Loading/>}
                {removeLoading && projects.length === 0 &&(
                    <p>There's not registered projects</p>
                )

                }

            </Container>

        </div>
    )
}

export default Projects