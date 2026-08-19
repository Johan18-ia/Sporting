// src/presentation/components/CustomTextInput.tsx
// Encargado: Componente - CustomTextInput
// Descripción: Input personalizado con estilos y validaciones ligeras
// Archivo: src/presentation/components/CustomTextInput.tsx
// ============================================
import React from 'react';
import {
    View,
    TextInput,
    Image,
    StyleSheet,
    KeyboardType,
} from 'react-native';

interface Props {
    image: any;
    placeholder: string;
    value: string;
    keyboardType: KeyboardType;
    secureTextEntry?: boolean;
    property: string;
    onChangeText: (property: string, value: any) => void;
    editable?: boolean;
}

export const CustomTextInput = ({
    image,
    placeholder,
    value,
    keyboardType,
    secureTextEntry = false,
    property,
    onChangeText,
    editable = true,
}: Props) => {
    return (
        <View style={styles.formInput}>
            <Image style={styles.formIcon} source={image} />
            <TextInput
                style={styles.formTextInput}
                placeholder={placeholder}
                keyboardType={keyboardType}
                value={value}
                onChangeText={text => onChangeText(property, text)}
                secureTextEntry={secureTextEntry}
                editable={editable}
                placeholderTextColor="#999"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    formIcon: {
        width: 25,
        height: 25,
        marginTop: 5,
    },
    formInput: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
    },
    formTextInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#AAAAAA',
        marginLeft: 15,
        paddingVertical: 8,
        fontSize: 15,
        color: '#333',
    },
});