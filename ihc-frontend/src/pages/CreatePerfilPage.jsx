import "../styles/CreatePerfilPage.css"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPepperHot } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom"


function CreatePerfilPage(){
    const navigate = useNavigate();

    return(
        <div className="createPerfil-main-container">
            <h1>Crear Perfil Personalizado</h1>
            <h2>Nombre del perfil</h2>
            <input className="form-input-general" placeholder="Ejemplo: Yo, Papá, Hermanos, Niños"></input>

            <h2>Diete / Estilo de vida</h2>
            <div className="diet-checkbox-container row wrap">
                <label><input type="radio" name="diet"/>Omnivoro</label>
                <label><input type="radio" name="diet"/>Vegetariano</label>
                <label><input type="radio" name="diet"/>Vegano</label>
                <label><input type="radio" name="diet"/>Pescetariano</label>
            </div>               
            
            <h2>Preferencias personales</h2>
            <h3>Nivel de picante</h3>
            <button className="low-spicy spicy-button"><FontAwesomeIcon icon={faPepperHot} /></button>
            <label>Bajo</label>
            <button className="high-spicy spicy-button"><FontAwesomeIcon icon={faPepperHot} /></button>
            <label>Alto</label>
            <h3>Alérgenos a evitar</h3>
            <div className="alergenos-container">
                <ul className="elements-list-form row wrap">
                    <li>Lácteos</li>
                    <li>Mariscos</li>
                    <li>Lácteos</li>
                    <li>Mariscos</li>
                    <li>Lácteos</li>
                    <li>Mariscos</li>
                    <li>Lácteos</li>
                    <li>Mariscos</li>                                                                                     
                </ul>                
            </div>
            <h3 className="text-add-style">+ Añadir alérgeno</h3>
            <h3>Rango de calorías</h3>
            <div className="calorias-rango-container row">
                <div className="row">
                    <input className="form-input-general" value={0}></input>
                    <label>kcal</label>
                </div>
                <p>hasta</p>
                <div className="row">
                    <input type="number" className="form-input-general"></input>
                    <label>kcal</label>
                </div>
            </div>
            <div className="createPerfil-foot-container row">
                <button className="save-perfil-button button-general">Guardar Perfil</button>    
                <button onClick={() => {navigate('/mis-perfiles')}} className="cancel-perfil-button button-general">Cancelar</button>                           
            </div>
        </div>
    )
}

export default CreatePerfilPage;