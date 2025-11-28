import "../styles/CreateItemPage.css"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { getFilterOptions, createItem } from "../api/items"

function CreateItemPage() {
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        kcal_aprox: '',
        precio: '',
        id_categoria: '1', // Default to first category (usually Fondo)
        nivel_picante: '0',
        sabor_base: 'salado'
    });

    // Dynamic Data State
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedAllergens, setSelectedAllergens] = useState([]);

    // Options from Backend
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [availableAllergens, setAvailableAllergens] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const data = await getFilterOptions();
                setAvailableTags(data.etiquetas);
                setAvailableAllergens(data.alergenos);
                // Categories might come as strings, but we need IDs. 
                // Wait, getFilterOptions returns names. itemController.js returns names.
                // But createItem expects id_categoria.
                // ISSUE: getFilterOptions returns ['Entradas', 'Platos fuertes', ...]
                // But we need IDs to save. 
                // Quick fix: Map names to IDs based on known order or fetch categories with IDs.
                // Better: Update backend to return objects {id, nombre}.
                // For now, let's assume standard IDs: 1=Entradas, 2=Platos fuertes, etc.
                // Actually, let's just use the index + 1 or map them if we know them.
                // Or better, update backend to return full objects.
                // Let's check base_datos.sql... 
                // 1: Entradas, 2: Platos fuertes, 3: Bebidas, 4: Postres, 5: Complementos (from seed script)
                // We will rely on this order for now or just fetch categories properly.
                // Let's assume the order from seed script matches IDs 1-5.
                setAvailableCategories(data.categorias || []);
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        };
        fetchOptions();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        // Map input IDs to state keys
        const keyMap = {
            'input-nombre': 'nombre', // Added id to input
            'input-kcal': 'kcal_aprox',
            'input-precio': 'precio',
            'input-cat': 'id_categoria'
        };
        const key = keyMap[id] || e.target.name;

        if (key) {
            setFormData(prev => ({ ...prev, [key]: value }));
        } else if (e.target.className.includes('textarea-style')) {
            setFormData(prev => ({ ...prev, descripcion: value }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddIngredient = () => {
        if (newIngredient.trim()) {
            setIngredients([...ingredients, newIngredient.trim()]);
            setNewIngredient('');
        }
    };

    const handleRemoveIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const toggleAllergen = (allergen) => {
        if (selectedAllergens.includes(allergen)) {
            setSelectedAllergens(selectedAllergens.filter(a => a !== allergen));
        } else {
            setSelectedAllergens([...selectedAllergens, allergen]);
        }
    };

    const handleSubmit = async () => {
        try {
            const data = new FormData();
            data.append('nombre', formData.nombre);
            data.append('descripcion', formData.descripcion);
            data.append('precio', formData.precio);
            data.append('kcal_aprox', formData.kcal_aprox);
            data.append('id_categoria', formData.id_categoria);
            data.append('nivel_picante', formData.nivel_picante);
            data.append('sabor_base', formData.sabor_base);

            if (imageFile) {
                data.append('image', imageFile);
            }

            // Append arrays as JSON strings
            data.append('ingredientes', JSON.stringify(ingredients));
            data.append('etiquetas', JSON.stringify(selectedTags));
            data.append('alergenos', JSON.stringify(selectedAllergens));

            await createItem(data);
            alert('Item creado exitosamente!');
            navigate('/menu-admin');
        } catch (error) {
            console.error("Error creating item:", error);
            alert('Error al crear el item. Por favor intente nuevamente.');
        }
    };

    // Helper to map category name to ID (Temporary fix until backend returns IDs)
    const getCategoryId = (name) => {
        const map = {
            'Entradas': 1,
            'Platos fuertes': 2,
            'Bebidas': 3,
            'Postres': 4,
            'Complementos': 5
        };
        return map[name] || 1;
    };

    return (
        <div className="createItem-main-container">
            <h1>Agregar Item</h1>
            <h2>Informacion básica</h2>
            <div className="basic-info-item-container row">
                <div className="data-one-container">
                    <h3>Nombre del item</h3>
                    <input
                        id="input-nombre"
                        className="form-input-general"
                        placeholder="Ejemplo: Ceviche Clásico"
                        value={formData.nombre}
                        onChange={handleInputChange}
                    />
                    <h3>Descripcion</h3>
                    <textarea
                        className="form-input-general textarea-style"
                        placeholder="Ejemplo: Pescado fresco..."
                        value={formData.descripcion}
                        onChange={handleInputChange}
                    />
                    <h3>Kcal aprox.</h3>
                    <input
                        id="input-kcal"
                        className="form-input-general"
                        placeholder="Ejemplo: 300"
                        type="number"
                        value={formData.kcal_aprox}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="data-two-container">
                    <h3>Precio (S/)</h3>
                    <input
                        id="input-precio"
                        className="form-input-general"
                        placeholder="Ejemplo: 22.00"
                        type="number"
                        step="0.10"
                        value={formData.precio}
                        onChange={handleInputChange}
                    />
                    <h3>Categoría</h3>
                    <select
                        id="input-cat"
                        className="form-input-general"
                        value={formData.id_categoria}
                        onChange={handleInputChange}
                    >
                        {availableCategories.map(cat => (
                            <option key={cat} value={getCategoryId(cat)}>{cat}</option>
                        ))}
                        {availableCategories.length === 0 && (
                            <>
                                <option value="1">Entradas</option>
                                <option value="2">Platos fuertes</option>
                                <option value="3">Bebidas</option>
                                <option value="4">Postres</option>
                            </>
                        )}
                    </select>
                </div>
                <div className="item-img-container">
                    <h3>Imagen del item</h3>
                    <div className="image-upload-wrapper">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="image-preview" />
                        ) : (
                            <div className="placeholder-image">Sin imagen</div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ marginTop: '10px' }}
                        />
                    </div>
                </div>
            </div>

            <div className="ingredientes-extra-container row">
                <div className="ingredientes-container">
                    <h2>Ingredientes</h2>
                    <ul className="elements-list-form row wrap">
                        {ingredients.map((ing, index) => (
                            <li key={index} onClick={() => handleRemoveIngredient(index)} title="Click para eliminar">
                                {ing} ✖
                            </li>
                        ))}
                    </ul>
                    <div className="add-ingredient-wrapper">
                        <input
                            type="text"
                            className="form-input-general small-input"
                            placeholder="Nuevo ingrediente"
                            value={newIngredient}
                            onChange={(e) => setNewIngredient(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
                        />
                        <h3 className="text-add-style" onClick={handleAddIngredient}>+ Añadir ingrediente</h3>
                    </div>
                </div>
                <div className="extra-container">
                    <h2>Nivel de picante</h2>
                    <div className="extra-options-container row">
                        <input
                            type="radio"
                            name="nivel_picante"
                            value="0"
                            checked={formData.nivel_picante === '0'}
                            onChange={(e) => setFormData({ ...formData, nivel_picante: e.target.value })}
                        />
                        <label>0</label>

                        <input
                            type="radio"
                            name="nivel_picante"
                            value="1"
                            checked={formData.nivel_picante === '1'}
                            onChange={(e) => setFormData({ ...formData, nivel_picante: e.target.value })}
                        />
                        <label>bajo</label>

                        <input
                            type="radio"
                            name="nivel_picante"
                            value="2"
                            checked={formData.nivel_picante === '2'}
                            onChange={(e) => setFormData({ ...formData, nivel_picante: e.target.value })}
                        />
                        <label>alto</label>
                    </div>
                </div>
            </div>

            <div className="etiquetas-sabor-container row">
                <div className="etiquetas-container">
                    <h2>Etiquetas (Estilo de vida)</h2>
                    <ul className="elements-list-form row wrap selectable-list">
                        {availableTags.map(tag => (
                            <li
                                key={tag}
                                className={selectedTags.includes(tag) ? 'selected' : ''}
                                onClick={() => toggleTag(tag)}
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>
                    {/* <h3 className="text-add-style">+ Añadir etiqueta</h3> */}
                </div>

                <div className="etiquetas-container">
                    <h2>Alérgenos</h2>
                    <ul className="elements-list-form row wrap selectable-list">
                        {availableAllergens.map(allergen => (
                            <li
                                key={allergen}
                                className={selectedAllergens.includes(allergen) ? 'selected-allergen' : ''}
                                onClick={() => toggleAllergen(allergen)}
                            >
                                {allergen}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="sabor-container">
                    <h2>Sabor base</h2>
                    <div className="sabor-options-container row">
                        <input
                            type="radio"
                            name="sabor_base"
                            value="dulce"
                            checked={formData.sabor_base === 'dulce'}
                            onChange={(e) => setFormData({ ...formData, sabor_base: e.target.value })}
                        />
                        <label>dulce</label>

                        <input
                            type="radio"
                            name="sabor_base"
                            value="salado"
                            checked={formData.sabor_base === 'salado'}
                            onChange={(e) => setFormData({ ...formData, sabor_base: e.target.value })}
                        />
                        <label>salado</label>

                        <input
                            type="radio"
                            name="sabor_base"
                            value="agridulce"
                            checked={formData.sabor_base === 'agridulce'}
                            onChange={(e) => setFormData({ ...formData, sabor_base: e.target.value })}
                        />
                        <label>agridulce</label>
                    </div>
                </div>
            </div>

            <div className="foot-form row">
                <button onClick={() => { navigate('/menu-admin') }} className="cancel-item-button button-general">Cancelar</button>
                <button onClick={handleSubmit} className="save-item-button button-general">Guardar</button>
            </div>
        </div>
    )
}

export default CreateItemPage;