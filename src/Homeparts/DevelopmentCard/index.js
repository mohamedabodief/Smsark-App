import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import FavoriteButton from '../FavoriteButton';
import { useNavigation } from '@react-navigation/native';

export default function DevelopmentCard({ item }) {
    const navigation = useNavigation();

    if (!item) {
        return (
            <View style={styles.card}>
                <Text>خطأ: لا توجد بيانات للإعلان</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity
            style={[styles.card, { borderWidth: 0.2, borderColor: '#fff' }]}
            onPress={() => navigation.navigate('DevelopmentDetails', { id: item.id })}
        >
            <Image
                source={item.images && item.images.length > 0 ? { uri: item.images[0] } : require('../../assets/1.webp')}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text style={styles.price}>
                    {item.price_start_from ? item.price_start_from.toLocaleString() : '—'} -
                    {item.price_end_to ? item.price_end_to.toLocaleString() : '—'} ج.م
                </Text>
                <Text style={styles.name}>{item.developer_name}</Text>
                {/* <Text style={styles.model}>{item.developer_name}</Text> */}
                <Text
                    style={styles.description}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {item.description || 'لا يوجد وصف متاح'}
                </Text>
            </View>
            {/* <View style={styles.favoriteIcon}> */}
                <FavoriteButton id={item.id} type="development" />
            {/* </View> */}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: Dimensions.get('window').width * 0.7,
        marginRight: 10,
        marginBottom: 0,
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        position: 'relative',

    },
    image: {
        width: '100%',
        height: 160,
    },
    content: {
        padding: 12,
    },
    description: {
        fontSize: 13,
        color: '#444',
        marginTop: 4,
        lineHeight: 18,
        textAlign: 'right',      
        writingDirection: 'rtl',   
    },

    price: {
        color: '#1976D2',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'right',      
        writingDirection: 'rtl',   
    },
    name: {
        fontSize: 15,
        marginTop: 4,
        textAlign: 'right',      
        writingDirection: 'rtl',   
    },
    model: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    favoriteIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
});

// stop_____________________