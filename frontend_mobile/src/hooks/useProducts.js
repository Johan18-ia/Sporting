import { useState, useEffect } from 'react';
import ProductModel from '../models/ProductModel';

const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        const resultado = await ProductModel.getAllProducts();
        if (resultado.success) {
            setProducts(resultado.data);
        } else {
            setError(resultado.error || 'Error al conectar con el servidor');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { products, loading, error, refetch: fetchProducts };
};

export default useProducts;