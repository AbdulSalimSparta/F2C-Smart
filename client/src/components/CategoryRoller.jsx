import React from "react";
import "../styles/CategoryRoll.css";

const categories = [
    { id: "1", name: "Vegetables", imageUrl: "https://th.bing.com/th/id/OIP.xlX2rUvxoS-SApi24IcgCwHaEK?rs=1&pid=ImgDetMain" },
    { id: "2", name: "Fruits", imageUrl: "https://www.pixelstalk.net/wp-content/uploads/2016/08/Fruit-HD-Wallpaper.jpg" },
    { id: "3", name: "Dairy Products", imageUrl: "https://th.bing.com/th/id/OIP.ZPmBgIBSeJLtLv0SgnGZ_wHaEJ?w=626&h=351&rs=1&pid=ImgDetMain" },
    { id: "4", name: "Nuts", imageUrl: "https://img.favpng.com/5/0/22/food-mixed-nuts-nut-ingredient-nuts-amp-seeds-png-favpng-mCCwyiFsvWeGTMJTSyi0dqYNJ.jpg" },
    { id: "5", name: "Dry Fruits", imageUrl: "https://png.pngtree.com/thumb_back/fh260/background/20231023/pngtree-close-up-detailed-texture-of-dried-fruits-image_13674553.png" },
    { id: "6", name: "Grains", imageUrl: "https://thumbs.dreamstime.com/b/big-collection-different-cereals-edible-seeds-grain-angular-pattern-top-view-155762152.jpg" },
    { id: "7", name: "Fruits", imageUrl: "https://th.bing.com/th/id/OIP.P0kFHeTdC0DtZ49pZRRmQAHaEs?rs=1&pid=ImgDetMain" },
];

function CategoryRoller() {
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
                <img src={category.imageUrl} alt={category.name} />
            </div>
            <h4>{category.name}</h4>
        </div>
    );
}

export default CategoryRoller;
