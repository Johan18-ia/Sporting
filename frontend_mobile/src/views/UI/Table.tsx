// src/views/ui/Table.tsx
import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

interface TableProps {
    children: React.ReactNode
    headers?: string[]
}

const Table: React.FC<TableProps> = ({ children, headers }) => {
    return (
        <View style={styles.wrapper}>
            <ScrollView horizontal>
                <View style={styles.table}>
                    {headers && (
                        <View style={styles.headerRow}>
                            {headers.map((header, index) => (
                                <Text key={index} style={styles.headerCell}>
                                    {header}
                                </Text>
                            ))}
                        </View>
                    )}
                    {children}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        overflow: 'hidden',
        marginBottom: 16,
    },
    table: {
        minWidth: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#8B0000',
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    headerCell: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
        flex: 1,
        minWidth: 100,
    },
})

export default Table