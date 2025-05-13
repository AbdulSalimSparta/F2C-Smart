export const fetchProducts = async () => {
  try {
      const response = await fetch('http://localhost:5000/api/products'); // Ensure URL matches backend
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const products = await response.json();
      return products;
  } catch (error) {
      console.error('Error fetching products:', error);
      return [];
  }
};

export const fetchProductById = async (id) => {
  console.log("Fetching product with ID:", id); // Debugging

  try {
    const response = await fetch(`http://localhost:5000/api/products/${id}`);
    console.log("API Response Status:", response.status); // Debugging

    if (!response.ok) {
      throw new Error("Product not found");
    }

    const data = await response.json();
    console.log("Fetched product data:", data); // Debugging
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};


export const fetchCategories = async () => {
  try {
      const response = await fetch('http://localhost:5000/api/categories'); // Ensure URL matches backend
      if (!response.ok) throw new Error('Failed to fetch Categories');
      
      const categories = await response.json();
      return categories;
  } catch (error) {
      console.error('Error fetching Categories:', error);
      return [];
  }
};



export const fetchUser = async () => {
  const token = localStorage.getItem("token"); // ✅ Fetch from localStorage
  console.log("Retrieved Token:", token); // 🔍 Check if it's actually there

  try {
    const response = await fetch("/api/user", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // ✅ Send token in Authorization header
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    console.log("User Data:", result);
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};



// export const categories = [
//     { id: "1", name: "Vegetables", imageUrl: "https://th.bing.com/th/id/OIP.xlX2rUvxoS-SApi24IcgCwHaEK?rs=1&pid=ImgDetMain" },
//     { id: "2", name: "Fruits", imageUrl: "https://www.pixelstalk.net/wp-content/uploads/2016/08/Fruit-HD-Wallpaper.jpg" },
//     { id: "3", name: "Dairy Products", imageUrl: "https://th.bing.com/th/id/OIP.ZPmBgIBSeJLtLv0SgnGZ_wHaEJ?w=626&h=351&rs=1&pid=ImgDetMain" },
//     { id: "4", name: "Nuts", imageUrl: "https://img.favpng.com/5/0/22/food-mixed-nuts-nut-ingredient-nuts-amp-seeds-png-favpng-mCCwyiFsvWeGTMJTSyi0dqYNJ.jpg" },
//     { id: "5", name: "Dry Fruits", imageUrl: "https://png.pngtree.com/thumb_back/fh260/background/20231023/pngtree-close-up-detailed-texture-of-dried-fruits-image_13674553.png" },
//     { id: "6", name: "Grains", imageUrl: "https://thumbs.dreamstime.com/b/big-collection-different-cereals-edible-seeds-grain-angular-pattern-top-view-155762152.jpg" },
// ];
  
  export const products = [
    { id: 1, name: "Apple", price: 50, category: "Fruits", imageUrl: "https://th.bing.com/th/id/OIP.XdI0fUNuABSlWKCG9WPgVgHaE-?rs=1&pid=ImgDetMain" , quantity: 1},
    { id: 2, name: "Oranges", price: 20, category: "Fruits", imageUrl: "https://th.bing.com/th/id/OIP.DsdFEw2-2VUE_4Krmzo1agHaFj?rs=1&pid=ImgDetMain", quantity: 1 },
    { id: 3, name: "Coconut", price: 50, category: "Vegetable", imageUrl: "https://th.bing.com/th/id/R.c872c36b9fe7bb9bdd460d7b91630881?rik=cA7Vwzj7lUY6Sw&riu=http%3a%2f%2fcdn.shopify.com%2fs%2ffiles%2f1%2f0358%2f7879%2f7448%2fproducts%2fcoconut_1200x1200.png%3fv%3d1602297120&ehk=j7e6UElZa8jdSPsuDRc7zVvHshex6ChVN9digA%2fB9JE%3d&risl=&pid=ImgRaw&r=0", quantity: 1 },
    { id: 4, name: "Garlic", price: 20, category: "Vegetable", imageUrl: "https://th.bing.com/th/id/OIP.dQ7oBkXYd_yLeaHV1mN0SwHaGH?rs=1&pid=ImgDetMain" , quantity: 1},
    { id: 5, name: "Red Grapes", price: 100, category: "Fruits", imageUrl: "https://th.bing.com/th/id/OIP.9MFUrUXKBTD3KBu3pF9AiQHaF7?rs=1&pid=ImgDetMain", quantity: 1 },
    { id: 6, name: "Lettuce", price: 30, category: "Vegetable", imageUrl: "https://cdn.britannica.com/77/170677-050-F7333D51/lettuce.jpg" , quantity: 1},
    { id: 7, name: "Ladysfinger", price: 20, category: "Vegetable", imageUrl: "https://th.bing.com/th/id/OIP.DcKopbmxCth5OhJer-nZTgHaFy?rs=1&pid=ImgDetMain" , quantity: 1},
    { id: 8, name: "Potatoes", price: 30, category: "Vegetable", imageUrl: "https://th.bing.com/th/id/R.1746905e79820c611a75f362be285401?rik=Om5Rt8artWAu4A&riu=http%3a%2f%2fwww.valleyspuds.com%2fwp-content%2fuploads%2fRusset-Potatoes-cut.jpg&ehk=%2f9WbC1j%2fDMKQkwnb8Q9l7NfVGeVMrHuQmCWM%2fR9kpg8%3d&risl=&pid=ImgRaw&r=0", quantity: 1 },
    { id: 9, name: "Grapes", price: 100, category: "Fruits", imageUrl: "https://media.istockphoto.com/photos/green-grape-isolated-on-white-background-picture-id489520104?k=20&m=489520104&s=612x612&w=0&h=n1_B8jn9fb4dQibPhkXftNpjKA4Rvrjp_ttgj6sq5jY=", quantity: 1 },
    { id: 10, name: 'Fresh Tomatoes', category: 'Vegetable', price: 100, imageUrl: 'https://www.pngarts.com/files/3/Sliced-Tomato-Free-PNG-Image.png', quantity: 1 },
    { id: 11, name: 'Organic Apples', category: 'Fruits', price: 150, imageUrl: 'https://png.pngtree.com/png-clipart/20231118/original/pngtree-fresh-harvest-of-apples-png-image_13629745.png', quantity: 1 },
    { id: 12, name: 'Onion', category: 'Vegetable', price: 100, imageUrl: 'https://www.maatarafruitscompany.com/wp-content/uploads/2022/06/istockphoto-184781848-612x612-1.jpg', quantity: 1 },
    { id: 13, name: 'Carrot', category: 'Vegetable', price: 50, imageUrl: 'https://th.bing.com/th/id/R.87c21222875469046d481534e8a92f3f?rik=1eKEY%2bLiMVpikg&riu=http%3a%2f%2fwww.freepngimg.com%2fdownload%2fcarrot%2f4-2-carrot-png.png&ehk=fmuxovmcoHNLVyzeqXT41lSZ3vUwthhdSHeAOZaqO00%3d&risl=&pid=ImgRaw&r=0', quantity: 1 },
    { id: 14, name: 'Milk', category: 'Dairy Products', price: 23, imageUrl: 'https://png.pngtree.com/png-clipart/20240323/original/pngtree-milk-bottle-dairy-product-png-image_14657285.png', quantity: 1 },
    { id: 15, name: 'Walnut', category: 'Nuts', price: 215, imageUrl: 'https://th.bing.com/th/id/OIP.d7YVdXpFKVz8BjowRDCmbwHaGo?rs=1&pid=ImgDetMain', quantity: 1 },
    { id: 16, name: 'Wheat', category: 'Grains', price: 47, imageUrl: 'https://png.pngtree.com/png-clipart/20220109/original/pngtree-whole-grains-png-image_7025009.png', quantity: 1 },
    { id: 17, name: 'Almonds', category: 'Nuts', price: 900, imageUrl: 'https://th.bing.com/th/id/R.ff53fa7796675b36393cdd2d9c92da16?rik=SGIWD1zx4dKo0w&riu=http%3a%2f%2fpngimg.com%2fuploads%2falmond%2falmond_PNG11.png&ehk=jsic6XpmpideIIeoMtdE8HjnEStJldjkmT9q%2fhx2few%3d&risl=&pid=ImgRaw&r=0', quantity: 1 },
  ];
  

