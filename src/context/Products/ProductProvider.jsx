import { useEffect, useState } from 'react'
import ProductContext from './ProductContext';

const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const API_URL = 'https://fakestoreapi.com/products';
    const [cart, setCart] = useState([]);

    function addToCart(product) {
        setCart((prev) => {
            const existing = prev.find((p) => p.id === product.id);
            if (existing) {
                return prev.map((p) => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    }

    function removeFromCart(productId) {
        setCart((prev) => prev.filter((p) => p.id !== productId));
    }

    const cartCount = cart.reduce((sum, p) => sum + (p.qty || 0), 0);
    const cartTotal = cart.reduce((sum, p) => sum + (Number(p.price || 0) * (p.qty || 0)), 0);

    // Fetch products
    useEffect(() => {
        const fetchData = async () => {
            try{
                let response = await fetch(API_URL)
                if (!response.ok){
                    throw new Error (`HTTP error! Status: ${response.status}`)
                }

                let data = await response.json();
                setProducts(data)
                // console.log(data)

            }catch(error){
                console.error(error)
            }
        }
        fetchData();
    }, []);

    return (
        <ProductContext.Provider value={[products, setProducts, cart, addToCart, cartCount, cartTotal, removeFromCart]}>
            {children}
        </ProductContext.Provider>
    )
}

export default ProductProvider