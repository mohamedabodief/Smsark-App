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
    return (
        <TouchableOpacity style={styles.card}
            onPress={() => navigation.navigate('DevelopmentDetails', { item })}>
            <Image
                source={item.image ? { uri: item.image } : require('../../assets/1.webp')}
                style={styles.image}
            />

            <View style={styles.content}>
                <Text style={styles.price}>
                    {item.price_start_from ? item.price_start_from.toLocaleString() : '—'} -
                    {item.price_end_to ? item.price_end_to.toLocaleString() : '—'} ج.م
                </Text>
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.model}>{item.developer_name}</Text>
            </View>
            <FavoriteButton id={item.advertisement_id} type="development" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: Dimensions.get('window').width * 0.7,
        marginRight: 16,
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
    price: {
        color: '#1976D2',
        fontWeight: 'bold',
        fontSize: 16,
    },
    name: {
        fontSize: 15,
        marginTop: 4,
    },
    model: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
});
