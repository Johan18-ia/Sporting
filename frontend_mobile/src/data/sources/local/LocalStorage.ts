// Encargado: Almacenamiento Local
// Descripción: Wrapper de AsyncStorage con logging para depuración
// Archivo: src/data/sources/local/LocalStorage.ts
// ============================================
// frontend_mobile/src/data/sources/local/LocalStorage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export const LocalStorage = () => {
    const save = async (key: string, value: string) => {
        try {
            console.log(`Guardando ${key}:`, value ? `${value.substring(0, 20)}...` : 'valor vacio');
            await AsyncStorage.setItem(key, value);
            
            // Verificar que se guardo
            const saved = await AsyncStorage.getItem(key);
            console.log(`${key} guardado correctamente:`, saved ? 'Si' : 'No');
        } catch (error) {
            console.log('Error en Local Storage save:', error);
        }
    };

    const getItem = async (key: string) => {
        try {
            const item = await AsyncStorage.getItem(key);
            console.log(`Leyendo ${key}:`, item ? `${item.substring(0, 20)}...` : 'No existe');
            return item;
        } catch (error) {
            console.log('Error en Local Storage getItem:', error);
            return null;
        }
    };

    const remove = async (key: string) => {
        try {
            console.log(`Eliminando ${key}`);
            await AsyncStorage.removeItem(key);
            console.log(`${key} eliminado`);
        } catch (error) {
            console.log('Error en Local Storage remove:', error);
        }
    };

    const clear = async () => {
        try {
            console.log('Limpiando todo el almacenamiento');
            await AsyncStorage.clear();
            console.log('Almacenamiento limpiado');
        } catch (error) {
            console.log('Error en Local Storage clear:', error);
        }
    };

    return {
        save,
        getItem,
        remove,
        clear
    };
};