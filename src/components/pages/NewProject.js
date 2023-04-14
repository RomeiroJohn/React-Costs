import styles from './NewProject.module.css'
import ProjectForm from '../project/ProjectForm'
import { useNavigate } from 'react-router-dom'

function NewProject(){

    const history = useNavigate()

    function createPost(project){

        //Initalizing cost and services
        project.cost = 0;
        project.services = [];

        //API request
        fetch("http://localhost:5000/projects", {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(project),
        })
        .then(resp => resp.json())
        .then(() => {
            history('/projects', {state: { message: "project created successfully" }});
        })
        .catch(err => console.log(err))

    }

    return (
        <div className={styles.newProjectContainer}>
            <h1>Create Project</h1>
            <p>Create your project and manage services</p>
            <ProjectForm handleSubmit={createPost} btnText="Create Project"/>
        </div>

    )
}

export default NewProject