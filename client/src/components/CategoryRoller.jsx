import React,{useEffect,useState} from "react";
import "../styles/CategoryRoll.css";
import {fetchCategories } from "../Data/data";


function CategoryRoller() {
    const [categories, setCategories] = useState([]);
        useEffect(() => {
            const getCategories = async () => {
                const data = await fetchCategories();
                setCategories(data);
            };
            getCategories();
        }, []);



    return (
        <div className="container">
            <div className="CategoryRoll">
                <div className="CategoryTitle">
                    <img width="24" height="24" src="https://img.icons8.com/material-outlined/24/40C057/shopping-cart--v1.png" alt="shopping-cart"/>
                    <h5>Shop By Category</h5>
                </div>
                <div className="CategoryItems">
                    {categories.map((category) => (
                        <CategoryList key={category.id} category={category} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function CategoryList({ category }) {
    return (
        <div className="CategoriesItemsBox">
            <div className="ImageCircle">
                <img src={category.imageurl} alt={category.name} />
            </div>
            <h4>{category.name}</h4>
        </div>
    );
}

export default CategoryRoller;
