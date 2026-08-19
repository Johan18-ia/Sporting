// Encargado: Reportes
// Descripción: Generación y exportación de reportes (CSV, compartir)
// Archivo: src/presentation/views/reports/ReportsScreen.tsx
// ============================================
// src/presentation/views/reports/ReportsScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

interface Report {
    id: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    endpoint: string;
}

const REPORTS: Report[] = [
    { id: 'users', label: 'Usuarios', icon: 'people', color: '#8B0000', endpoint: '/users' },
    { id: 'students', label: 'Estudiantes', icon: 'school', color: '#2196F3', endpoint: '/students' },
    { id: 'categories', label: 'Categorías', icon: 'pricetag', color: '#9C27B0', endpoint: '/categories' },
    { id: 'schedules', label: 'Horarios', icon: 'calendar', color: '#00BCD4', endpoint: '/schedules' },
    { id: 'tournaments', label: 'Torneos', icon: 'trophy', color: '#FF9800', endpoint: '/tournaments' },
    { id: 'products', label: 'Productos', icon: 'bag', color: '#4CAF50', endpoint: '/products' },
    { id: 'teams', label: 'Equipos', icon: 'people-circle', color: '#795548', endpoint: '/teams' },
];

const CSV_HEADERS: Record<string, string[]> = {
    users: ['ID', 'Nombre', 'Apellido', 'Email', 'Rol', 'Teléfono', 'Estado'],
    students: ['ID', 'Nombre', 'Apellido', 'Documento', 'Categoría', 'Teléfono'],
    categories: ['ID', 'Año', 'Descripción'],
    schedules: ['ID', 'Categoría', 'Día', 'Hora Inicio', 'Hora Fin'],
    tournaments: ['ID', 'Nombre', 'Categoría', 'Estado', 'Estudiantes'],
    products: ['ID', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Categoría'],
    teams: ['ID', 'Nombre', 'Descripción', 'Integrantes'],
};

const CSV_FIELDS: Record<string, string[]> = {
    users: ['id', 'name', 'lastname', 'email', 'role', 'phone', 'is_active'],
    students: ['id', 'name', 'lastname', 'document', 'category', 'phone'],
    categories: ['id', 'category_year', 'description'],
    schedules: ['id', 'category', 'day', 'start_time', 'end_time'],
    tournaments: ['id', 'name', 'category', 'status', 'students'],
    products: ['id', 'name', 'description', 'price', 'stock', 'category'],
    teams: ['id', 'name', 'description', 'students'],
};

export const ReportsScreen = () => {
    const [loading, setLoading] = useState<string | null>(null);

    const formatCSVValue = (value: any): string => {
        if (value === null || value === undefined) return '';
        const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
        return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };

    const generateCSV = (data: any[], headers: string[], fields: string[]): string => {
        const headerRow = headers.join(',');
        const dataRows = data.map(row => fields.map(field => formatCSVValue(row[field])).join(','));
        return [headerRow, ...dataRows].join('\n');
    };

    const exportReport = async (report: Report) => {
        setLoading(report.id);
        try {
            const response = await ApiDelivery.get(report.endpoint);
            const data = Array.isArray(response.data)
                ? response.data
                : (response.data?.data || []);

            if (data.length === 0) {
                Alert.alert('Sin Datos', `No hay datos disponibles para ${report.label}`);
                return;
            }

            const headers = CSV_HEADERS[report.id as keyof typeof CSV_HEADERS] || ['Datos'];
            const fields = CSV_FIELDS[report.id] || ['data'];
            const csv = generateCSV(data, headers, fields);
            
            // Compartir el archivo usando Share API
            const result = await Share.share({
                message: csv,
                title: `${report.label} - Sporting Club`,
            });

            if (result.action === Share.sharedAction) {
                console.log('Archivo compartido');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo generar el reporte');
        } finally {
            setLoading(null);
        }
    };

    const ReportCard = ({ report }: { report: Report }) => (
        <TouchableOpacity
            style={[styles.reportCard, { borderLeftColor: report.color }]}
            onPress={() => exportReport(report)}
            activeOpacity={0.7}
            disabled={loading !== null}
        >
            <View style={styles.reportIcon}>
                <Ionicons name={report.icon} size={32} color={report.color} />
            </View>
            <View style={styles.reportInfo}>
                <Text style={styles.reportLabel}>{report.label}</Text>
                <Text style={styles.reportAction}>
                    {loading === report.id ? 'Generando...' : 'Exportar CSV'}
                </Text>
            </View>
            {loading === report.id ? (
                <ActivityIndicator color={report.color} />
            ) : (
                <Ionicons name="download-outline" size={24} color={report.color} />
            )}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Reportes</Text>
                <Text style={styles.headerSubtitle}>
                    Descarga la información del sistema en formato CSV
                </Text>
            </View>

            <View style={styles.reportsList}>
                {REPORTS.map((report) => (
                    <ReportCard key={report.id} report={report} />
                ))}
            </View>

            <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={24} color="#666" />
                <Text style={styles.infoText}>
                    Los reportes se generan en formato CSV y se pueden abrir con Excel u otras herramientas de hojas de cálculo.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    reportsList: {
        padding: 12,
    },
    reportCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    reportIcon: {
        marginRight: 16,
    },
    reportInfo: {
        flex: 1,
    },
    reportLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    reportAction: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 12,
        padding: 16,
        borderRadius: 12,
        alignItems: 'flex-start',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});