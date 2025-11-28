import '../styles/MainPage.css'
import Chatbot from '../components/Chatbot';
import Navbar from '../components/Navbar';
import ItemMenu from '../components/ItemMenu';
import { useEffect, useState } from 'react';
import { getItems, getFilterOptions } from "../api/items";

function MainPage() {
    const [itemsMenuDisponibles, setItemsMenuDisponibles] = useState([]);
    const [allItems, setAllItems] = useState([]); // Store all items

    // Filter options from backend
    const [availableTags, setAvailableTags] = useState([]);
    const [availableAllergens, setAvailableAllergens] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);

    // Filter states
    const [nivelPicante, setNivelPicante] = useState(null);
    const [saborBase, setSaborBase] = useState(null);
    const [maxKcal, setMaxKcal] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedAllergens, setSelectedAllergens] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch items and filter options in parallel
                const [itemsData, filtersData] = await Promise.all([
                    getItems(),
                    getFilterOptions()
                ]);

                setAllItems(itemsData);
                setItemsMenuDisponibles(itemsData);
                setAvailableTags(filtersData.etiquetas);
                setAvailableAllergens(filtersData.alergenos);
                setAvailableCategories(filtersData.categorias || []);
            } catch (error) {
                console.error("❌ Error al obtener datos:", error);
            }
        };
        fetchData();
    }, []);

    // Apply filters whenever filter state changes
    useEffect(() => {
        applyFilters();
    }, [nivelPicante, saborBase, maxKcal, selectedTags, selectedAllergens, selectedCategories, allItems]);

    const applyFilters = () => {
        let filtered = [...allItems];

        // Filter by Category - MATCH ANY logic (Item must match ANY of the selected categories)
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(item => selectedCategories.includes(item.categoria));
        }

        // Filter by nivel de picante
        if (nivelPicante !== null) {
            filtered = filtered.filter(item => item.nivel_picante === nivelPicante);
        }

        // Filter by sabor base
        if (saborBase !== null && saborBase !== '') {
            filtered = filtered.filter(item => item.sabor_base === saborBase);
        }

        // Filter by max kcal
        if (maxKcal !== '' && !isNaN(maxKcal)) {
            const maxKcalNum = parseInt(maxKcal);
            filtered = filtered.filter(item => {
                return item.kcal_aprox && item.kcal_aprox <= maxKcalNum;
            });
        }

        // Filter by Tags (Estilo de vida) - INCLUDE logic (Item must have ALL selected tags)
        if (selectedTags.length > 0) {
            filtered = filtered.filter(item => {
                if (!item.etiquetas || item.etiquetas.length === 0) return false;
                // Check if every selected tag is present in item's tags
                return selectedTags.every(tag => item.etiquetas.includes(tag));
            });
        }

        // Filter by Allergens - EXCLUDE logic (Item must NOT have ANY selected allergen)
        if (selectedAllergens.length > 0) {
            filtered = filtered.filter(item => {
                if (!item.alergenos || item.alergenos.length === 0) return true; // Safe if no allergens
                // Check if NONE of the selected allergens are present in item's allergens
                return !selectedAllergens.some(allergen => item.alergenos.includes(allergen));
            });
        }

        setItemsMenuDisponibles(filtered);
    };

    const handlePicanteChange = (nivel) => {
        setNivelPicante(nivel === nivelPicante ? null : nivel);
    };

    const handleSaborChange = (sabor) => {
        setSaborBase(sabor === saborBase ? null : sabor);
    };

    const handleKcalChange = (e) => {
        setMaxKcal(e.target.value);
    };

    const handleTagChange = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleAllergenChange = (allergen) => {
        if (selectedAllergens.includes(allergen)) {
            setSelectedAllergens(selectedAllergens.filter(a => a !== allergen));
        } else {
            setSelectedAllergens([...selectedAllergens, allergen]);
        }
    };

    const handleCategoryChange = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const clearFilters = () => {
        setNivelPicante(null);
        setSaborBase(null);
        setMaxKcal('');
        setSelectedTags([]);
        setSelectedAllergens([]);
        setSelectedCategories([]);
    };

    return (
        <div className="main-page-container">
            <Navbar />
            <div className='mainpage-body-container row'>
                <aside className="filtros-container">

                    <h2>Categoría</h2>
                    <div className='tag-aside-container'>
                        {availableCategories.map(category => (
                            <div key={category} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`category-${category}`}
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                />
                                <label htmlFor={`category-${category}`}>{category}</label>
                            </div>
                        ))}
                    </div>

                    <h2>Estilo de vida</h2>
                    <div className='tag-aside-container'>
                        {availableTags.map(tag => (
                            <div key={tag} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`tag-${tag}`}
                                    checked={selectedTags.includes(tag)}
                                    onChange={() => handleTagChange(tag)}
                                />
                                <label htmlFor={`tag-${tag}`}>{tag}</label>
                            </div>
                        ))}
                    </div>

                    <h2>Alérgenos (Excluir)</h2>
                    <div className='tag-aside-container'>
                        {availableAllergens.map(allergen => (
                            <div key={allergen} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`allergen-${allergen}`}
                                    checked={selectedAllergens.includes(allergen)}
                                    onChange={() => handleAllergenChange(allergen)}
                                />
                                <label htmlFor={`allergen-${allergen}`}>{allergen}</label>
                            </div>
                        ))}
                    </div>

                    <div className='preferencias-especificas-container'>
                        <h2>Preferencias</h2>

                        <div className="extra-container">
                            <h3 id="preferencias-picante">Nivel de picante</h3>
                            <div className="extra-options-container row">
                                <input
                                    type="radio"
                                    name="opcionExtra"
                                    id="picante-0"
                                    checked={nivelPicante === '0'}
                                    onChange={() => handlePicanteChange('0')}
                                />
                                <label htmlFor="picante-0">0</label>

                                <input
                                    type="radio"
                                    name="opcionExtra"
                                    id="picante-bajo"
                                    checked={nivelPicante === '1'}
                                    onChange={() => handlePicanteChange('1')}
                                />
                                <label htmlFor="picante-bajo">bajo</label>

                                <input
                                    type="radio"
                                    name="opcionExtra"
                                    id="picante-alto"
                                    checked={nivelPicante === '2'}
                                    onChange={() => handlePicanteChange('2')}
                                />
                                <label htmlFor="picante-alto">alto</label>
                            </div>
                        </div>

                        <div className="sabor-container">
                            <h3>Sabor base</h3>
                            <div className="sabor-options-container row">
                                <input
                                    type="radio"
                                    name="opcionSabor"
                                    id="sabor-dulce"
                                    checked={saborBase === 'dulce'}
                                    onChange={() => handleSaborChange('dulce')}
                                />
                                <label htmlFor="sabor-dulce">dulce</label>

                                <input
                                    type="radio"
                                    name="opcionSabor"
                                    id="sabor-salado"
                                    checked={saborBase === 'salado'}
                                    onChange={() => handleSaborChange('salado')}
                                />
                                <label htmlFor="sabor-salado">salado</label>

                                <input
                                    type="radio"
                                    name="opcionSabor"
                                    id="sabor-agridulce"
                                    checked={saborBase === 'agridulce'}
                                    onChange={() => handleSaborChange('agridulce')}
                                />
                                <label htmlFor="sabor-agridulce">agridulce</label>
                            </div>
                        </div>

                        <h2>Kcal</h2>
                        <input
                            placeholder="ej:200"
                            className='form-input-general'
                            type="number"
                            value={maxKcal}
                            onChange={handleKcalChange}
                        />

                        <button className="clear-filters-btn" onClick={clearFilters}>
                            Limpiar filtros
                        </button>

                        <div className="filter-summary">
                            <p>Mostrando {itemsMenuDisponibles.length} de {allItems.length} platos</p>
                        </div>
                    </div>

                </aside>
                <section className="items-container">
                    {itemsMenuDisponibles.length > 0 ? (
                        itemsMenuDisponibles.map(item => (
                            <ItemMenu key={item.id_item} item={item} />
                        ))
                    ) : (
                        <div className="no-results">
                            <p>No se encontraron platos con los filtros seleccionados</p>
                            <button onClick={clearFilters}>Limpiar filtros</button>
                        </div>
                    )}
                </section>
            </div>
        <Chatbot />
        </div>
    );
}

export default MainPage;