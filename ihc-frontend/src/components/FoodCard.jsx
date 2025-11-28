import '../styles/FoodCard.css'

function FoodCard(){

    return(
        
        <div className="foodcard-container row padding">
            <div className="foodcard-left-container col padding">
                <img src={ceviche} alt="ceviche"></img>
                <h2>Descripción</h2>
                <p>Pescado fresco en cubos, marinado al instante en jugo de limón, con cebolla roja, ají limo y un toque de culantro. Servido con camote, choclo y chifle para equilibrar acidez y picor.</p>
            </div>
            <div className="foodcard-right-container col padding">
                <div className="foodcard-right-head-container row">
                    <h1>Ceviche Clasico</h1>
                    <span>S/ 22.00</span>
                </div>
                <div className='foodcard-tags-container row'>
                    <span className='tag-general'>Picante</span>
                    <span className='tag-general'>Sin gluten</span>
                    <span className='tag-general'>Sin lactosa</span>
                    <span className='tag-general'>Picante</span>
                    <span className='tag-general'>Sin gluten</span>
                    <span className='tag-general'>Picante</span>
                    <span className='tag-general'>Sin gluten</span>
                    <span className='tag-general'>Sin lactosa</span>
                    <span className='tag-general'>Picante</span>
                    <span className='tag-general'>Sin gluten</span>
                    <span className='tag-general'>Sin lactosa</span>                
                </div>
                <div className='foodcard-ingredientesAlergenos-container row'>
                    <div className='foodcard-ingredientes-container'>
                        <h2>Ingredientes</h2>
                        <div className='tag-ingredientes-container row wrap'>
                            <span className='tag-ingrediente tag-general'>Sin lactosa</span>
                            <span className='tag-ingrediente tag-general'>Sin gluten</span>
                            <span className='tag-ingrediente tag-general'>Picante</span>
                            <span className='tag-ingrediente tag-general'>Sin gluten</span>
                            <span className='tag-ingrediente tag-general'>Picante</span>
                            <span className='tag-ingrediente tag-general'>Sin gluten</span>      
                            <span className='tag-ingrediente tag-general'>Sin lactosa</span>                                                                                            
                        </div>
                    </div>
                    <div className='foodcard-alergenos-container'>
                        <h2>Alergenos</h2>                       
                        <div className='tag-alergenos-container row wrap'>
                            <span className='tag-alergeno tag-general'>Sin gluten</span>
                            <span className='tag-alergeno tag-general'>Sin gluten</span>
                            <span className='tag-alergeno tag-general'>Sin gluten</span>
                            <span className='tag-alergeno tag-general'>Sin gluten</span>
                            <span className='tag-alergeno tag-general'>Sin gluten</span>
                            <span className='tag-alergeno tag-general'>Sin gluten</span>
                        </div>
                    </div>
                </div>
                <div className='foodcard-infoNutricional-container'>
                    <h2>kcal aprox.</h2>
                    <div className='row'>
                        <span>300</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FoodCard;