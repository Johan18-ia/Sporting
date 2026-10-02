// Encargado: Reportes
// Descripción: Panel de reportes con vista gráfica + export CSV
// Archivo: src/presentation/views/reports/ReportsScreen.tsx
// ============================================
import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Share,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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
    { id: 'students', label: 'Estudiantes', icon: 'school', color: '#A52A2A', endpoint: '/students' },
    { id: 'categories', label: 'Categorías', icon: 'pricetag', color: '#B22222', endpoint: '/categories' },
    { id: 'schedules', label: 'Horarios', icon: 'calendar', color: '#C41E3A', endpoint: '/schedules' },
    { id: 'tournaments', label: 'Torneos', icon: 'trophy', color: '#8B4513', endpoint: '/tournaments' },
    { id: 'products', label: 'Productos', icon: 'bag', color: '#A0522D', endpoint: '/products' },
];

const CSV_HEADERS: Record<string, string[]> = {
    users: ['ID', 'Nombre', 'Apellido', 'Email', 'Rol', 'Teléfono', 'Estado'],
    students: ['ID', 'Nombre', 'Apellido', 'Documento', 'Categoría', 'Teléfono'],
    categories: ['ID', 'Año', 'Descripción'],
    schedules: ['ID', 'Categoría', 'Día', 'Hora Inicio', 'Hora Fin'],
    tournaments: ['ID', 'Nombre', 'Categoría', 'Estado', 'Estudiantes'],
    products: ['ID', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Categoría'],
};

const CSV_FIELDS: Record<string, string[]> = {
    users: ['id', 'name', 'lastname', 'email', 'role', 'phone', 'is_active'],
    students: ['id', 'name', 'lastname', 'document', 'category_year', 'phone'],
    categories: ['id', 'category_year', 'description'],
    schedules: ['id', 'category_name', 'day_of_week', 'start_time', 'end_time'],
    tournaments: ['id', 'name', 'category', 'status', 'students'],
    products: ['id', 'nombre', 'descripcion', 'precio', 'stock', 'categoria'],
};

const { width: SCREEN_W } = Dimensions.get('window');

export const ReportsScreen = () => {
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState<string | null>(null);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [loadingStats, setLoadingStats] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const loadStats = async () => {
        setLoadingStats(true);
        try {
            const results = await Promise.allSettled(
                REPORTS.map((r) => ApiDelivery.get(r.endpoint))
            );
            const next: Record<string, number> = {};
            results.forEach((res, i) => {
                const id = REPORTS[i].id;
                if (res.status === 'fulfilled') {
                    const data = Array.isArray(res.value.data)
                        ? res.value.data
                        : res.value.data?.data || [];
                    next[id] = Array.isArray(data) ? data.length : 0;
                } else {
                    next[id] = 0;
                }
            });
            setCounts(next);
        } catch {
            // silencioso
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const totalRecords = useMemo(
        () => Object.values(counts).reduce((a, b) => a + b, 0),
        [counts]
    );

    const formatCSVValue = (value: any): string => {
        if (value === null || value === undefined) return '';
        const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
        return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };

    const generateCSV = (data: any[], headers: string[], fields: string[]): string => {
        const headerRow = headers.join(',');
        const dataRows = data.map((row) =>
            fields.map((field) => formatCSVValue(row[field])).join(',')
        );
        return [headerRow, ...dataRows].join('\n');
    };

    const exportReport = async (report: Report) => {
        setLoading(report.id);
        try {
            const response = await ApiDelivery.get(report.endpoint);
            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.data || [];

            if (data.length === 0) {
                Alert.alert('Sin Datos', `No hay datos disponibles para ${report.label}`);
                return;
            }

            const headers = CSV_HEADERS[report.id] || ['Datos'];
            const fields = CSV_FIELDS[report.id] || ['data'];
            const csv = generateCSV(data, headers, fields);

            await Share.share({
                message: csv,
                title: `${report.label} - Sporting Club`,
            });
        } catch (error) {
            Alert.alert('Error', 'No se pudo generar el reporte');
        } finally {
            setLoading(null);
        }
    };

    const selected = REPORTS.find((r) => r.id === selectedId) || null;
    const selectedCount = selected ? counts[selected.id] || 0 : 0;
    const selectedPct =
        totalRecords > 0 ? Math.round((selectedCount / totalRecords) * 100) : 0;

    if (selected) {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => setSelectedId(null)}
                        >
                            <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.headerTitle}>{selected.label}</Text>
                            <Text style={styles.headerSub}>Detalle del reporte</Text>
                        </View>
                    </View>

                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Distribución</Text>

                        <View style={styles.donutRow}>
                            <View style={styles.donutWrap}>
                                <View
                                    style={[styles.donutOuter, { borderColor: selected.color }]}
                                >
                                    <View style={styles.donutInner}>
                                        <Text style={styles.donutValue}>{selectedCount}</Text>
                                        <Text style={styles.donutLabel}>registros</Text>
                                    </View>
                                </View>
                                <View style={styles.pctBadge}>
                                    <Text style={styles.pctBadgeText}>{selectedPct}%</Text>
                                </View>
                            </View>

                            <View style={styles.legendCol}>
                                {REPORTS.map((r) => {
                                    const c = counts[r.id] || 0;
                                    const pct =
                                        totalRecords > 0
                                            ? Math.round((c / totalRecords) * 100)
                                            : 0;
                                    return (
                                        <View key={r.id} style={styles.legendRow}>
                                            <View
                                                style={[
                                                    styles.legendDot,
                                                    { backgroundColor: r.color }
                                                ]}
                                            />
                                            <Text
                                                style={[
                                                    styles.legendText,
                                                    r.id === selected.id && styles.legendTextActive
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {r.label}
                                            </Text>
                                            <Text style={styles.legendPct}>{pct}%</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.barTrack}>
                            {REPORTS.map((r) => {
                                const c = counts[r.id] || 0;
                                if (!totalRecords || c === 0) return null;
                                const widthPct = (c / totalRecords) * 100;
                                return (
                                    <View
                                        key={r.id}
                                        style={{
                                            width: `${widthPct}%` as any,
                                            height: 8,
                                            backgroundColor: r.color
                                        }}
                                    />
                                );
                            })}
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statBoxValue}>{selectedCount}</Text>
                            <Text style={styles.statBoxLabel}>Total</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statBoxValue}>{selectedPct}%</Text>
                            <Text style={styles.statBoxLabel}>Del sistema</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statBoxValue}>{totalRecords}</Text>
                            <Text style={styles.statBoxLabel}>Global</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.downloadBtn}
                        onPress={() => exportReport(selected)}
                        disabled={loading !== null}
                        activeOpacity={0.85}
                    >
                        {loading === selected.id ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="download-outline" size={22} color="#fff" />
                                <Text style={styles.downloadBtnText}>
                                    Descargar Excel (CSV)
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.downloadHint}>
                        Se genera un CSV compatible con Excel y Hojas de cálculo.
                    </Text>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerTitle}>Reportes</Text>
                        <Text style={styles.headerSub}>Gráficas y descarga de datos</Text>
                    </View>
                </View>

                <View style={styles.panel}>
                    <View style={styles.panelChart}>
                        <Text style={styles.panelChartTitle}>Resumen</Text>
                        {loadingStats ? (
                            <ActivityIndicator
                                color={MyColors.primary}
                                style={{ marginVertical: 24 }}
                            />
                        ) : (
                            <>
                                <View style={styles.miniDonut}>
                                    <View style={styles.miniDonutOuter}>
                                        <View style={styles.miniDonutInner}>
                                            <Text style={styles.miniDonutValue}>
                                                {totalRecords}
                                            </Text>
                                            <Text style={styles.miniDonutLabel}>total</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.miniLegend}>
                                    {REPORTS.slice(0, 3).map((r) => (
                                        <View key={r.id} style={styles.miniLegendRow}>
                                            <View
                                                style={[
                                                    styles.legendDot,
                                                    { backgroundColor: r.color }
                                                ]}
                                            />
                                            <Text style={styles.miniLegendText}>{r.label}</Text>
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}
                    </View>

                    <View style={styles.panelList}>
                        {REPORTS.map((report) => (
                            <TouchableOpacity
                                key={report.id}
                                style={styles.listItem}
                                onPress={() => setSelectedId(report.id)}
                                activeOpacity={0.8}
                            >
                                <View
                                    style={[
                                        styles.listIcon,
                                        { backgroundColor: report.color + '22' }
                                    ]}
                                >
                                    <Ionicons
                                        name={report.icon}
                                        size={18}
                                        color={report.color}
                                    />
                                </View>
                                <View style={styles.listInfo}>
                                    <Text style={styles.listLabel}>{report.label}</Text>
                                    <Text style={styles.listCount}>
                                        {loadingStats
                                            ? '…'
                                            : `${counts[report.id] ?? 0} registro${
                                                  (counts[report.id] ?? 0) !== 1 ? 's' : ''
                                              }`}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#C4A8A8" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <Ionicons
                        name="information-circle-outline"
                        size={22}
                        color={MyColors.primary}
                    />
                    <Text style={styles.infoText}>
                        Toca un reporte para ver su gráfica y descargar el Excel (CSV).
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F4F4' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 8,
        gap: 8,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.3,
    },
    headerSub: { fontSize: 13, color: '#8A7A7A', marginTop: 2 },
    panel: {
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 20,
        overflow: 'hidden',
        flexDirection: 'row',
        minHeight: 280,
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    panelChart: {
        width: SCREEN_W * 0.42,
        backgroundColor: '#FFFFFF',
        padding: 16,
        justifyContent: 'center',
    },
    panelChartTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    miniDonut: { alignItems: 'center', marginBottom: 14 },
    miniDonutOuter: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 12,
        borderColor: MyColors.primary,
        borderTopColor: '#E8D5D5',
        borderRightColor: '#C45C5C',
        borderBottomColor: MyColors.primary,
        borderLeftColor: '#A52A2A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    miniDonutInner: { alignItems: 'center' },
    miniDonutValue: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
    miniDonutLabel: { fontSize: 11, color: '#9A8585' },
    miniLegend: { gap: 6 },
    miniLegendRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    miniLegendText: { fontSize: 11, color: '#6B5555', fontWeight: '500' },
    panelList: {
        flex: 1,
        backgroundColor: '#4A0E0E',
        paddingVertical: 8,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: 8,
    },
    listIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    listInfo: { flex: 1 },
    listLabel: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
    listCount: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 1 },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 14,
        borderRadius: 14,
        alignItems: 'flex-start',
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.06)',
    },
    infoText: { flex: 1, fontSize: 13, color: '#6B5555', lineHeight: 18 },
    chartCard: {
        marginHorizontal: 16,
        marginTop: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.05)',
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    donutRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    donutWrap: { alignItems: 'center', position: 'relative' },
    donutOuter: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAF8F8',
    },
    donutInner: { alignItems: 'center' },
    donutValue: { fontSize: 26, fontWeight: '800', color: '#1A1A1A' },
    donutLabel: { fontSize: 11, color: '#9A8585' },
    pctBadge: {
        position: 'absolute',
        bottom: -4,
        backgroundColor: MyColors.primary,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
    },
    pctBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    legendCol: { flex: 1, gap: 8 },
    legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { flex: 1, fontSize: 12, color: '#6B5555', fontWeight: '500' },
    legendTextActive: { color: '#1A1A1A', fontWeight: '700' },
    legendPct: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8A7A7A',
        width: 36,
        textAlign: 'right',
    },
    barTrack: {
        flexDirection: 'row',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#F0EAEA',
        marginTop: 18,
    },
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 14,
        gap: 10,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.05)',
    },
    statBoxValue: { fontSize: 18, fontWeight: '800', color: MyColors.primary },
    statBoxLabel: {
        fontSize: 11,
        color: '#9A8585',
        marginTop: 4,
        fontWeight: '500',
    },
    downloadBtn: {
        marginHorizontal: 16,
        marginTop: 20,
        backgroundColor: MyColors.primary,
        borderRadius: 14,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    downloadBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    downloadHint: {
        textAlign: 'center',
        marginTop: 10,
        marginHorizontal: 24,
        fontSize: 12,
        color: '#9A8585',
    },
});