import {useEffect, useState} from 'react';

import styles from './ProjectForm.module.css'
import Input from '../form/Input'
import Select from '../form/Select'
import Submit from '../form/Submit'

function ProjectForm({btnText, handleSubmit, projectData}){

    const[categories,setCategories] = useState([])
    const[project,setProject] = useState(projectData || {})

    useEffect(() => {
        fetch("http://localhost:5000/categories",{
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        }
    }).then((resp) => resp.json())
    .then((data => setCategories(data)))
    .catch( err => console.log(err))
    }, [])


    const submit = (e) => {
        e.preventDefault()
        handleSubmit(project)
    }

    function handleChange(e){
        setProject({ ...project, [e.target.name]: e.target.value })

    }

    function handleCategory(e){
        setProject({ ...project, category: {
            id: e.target.value,
            name: e.target.options[e.target.selectedIndex].text,
        } })

    }



        return (
            <form onSubmit={submit}className={styles.form}>
                <Input type="text"
                text="Project Name:"
                name="name"
                placeholder="Insert the project name: "
                handleOnChange={handleChange}
                value={project.name ? project.name : ''}
                />
                <Input type="number"
                text="Orçamento"
                name="budget"
                placeholder="Insert the Orçamento total: "
                handleOnChange={handleChange}
                value={project.budget ? project.budget : ''}
                />
                <Select name="categoryId"
                text="Select the category ID:"
                options={categories}
                handleOnChange={handleCategory}
                value={project.category ? project.category.id : ''}
                />
                <Submit text={btnText}/>
            </form>
        )

}

export default ProjectForm