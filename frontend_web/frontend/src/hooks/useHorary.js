import { useState, useEffect } from 'react';
import TrainingScheduleModel from '../models/TrainingScheduleModel';
import CategoryModel from '../models/CategoryModel'; // Lo necesitamos para el select

const useSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        
        // Cargamos horarios y categorías al tiempo
        const resSchedules = await TrainingScheduleModel.getAllSchedules();
        const resCategories = await CategoryModel.getAllCategories();

        if (resSchedules.success) setSchedules(resSchedules.data);
        if (resCategories.success) setCategories(resCategories.data);
        
        if (!resSchedules.success || !resCategories.success) {
            setError('Error al sincronizar los datos del servidor');
        }
        setLoading(false);
    };

    const createSchedule = async (categoryId, dayOfWeek, startTime, endTime) => {
        const resultado = await TrainingScheduleModel.createSchedule({
            category_id: categoryId,
            day_of_week: dayOfWeek,
            start_time: startTime,
            end_time: endTime
        });
        if (resultado.success) {
            loadData(); // Recargar la tabla
            return { success: true };
        }
        return { success: false, message: resultado.error };
    };

    useEffect(() => {
        loadData();
    }, []);

    return { schedules, categories, loading, error, createSchedule };
};

export default useSchedules;