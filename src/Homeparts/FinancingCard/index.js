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

export default function FinancingCard({ item }) {
    const navigation = useNavigation();
    // console.log(item);
    return (
        <TouchableOpacity style={[styles.card, { borderWidth: 0.2, borderColor: '#fff' }]}
            onPress={() => navigation.navigate('detailsForFinancingAds', { id:item.id })}>
            <Image
                source={item.image ? { uri: item.image } : require('../../assets/1.webp')}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text style={styles.price}>
                    {item.start_limit ? item.start_limit.toLocaleString() : '—'} -
                    {item.end_limit ? item.end_limit.toLocaleString() : '—'} ج.م
                </Text>
                <Text style={styles.name}>{item.org_name}</Text>
                <Text style={styles.model}>{item.financing_model}</Text>
                
            </View>
            <FavoriteButton id={item.id} type="financing" />

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: Dimensions.get('window').width * 0.8,
        marginRight: 10,
        marginBottom:20,
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


// stop_________________________________________