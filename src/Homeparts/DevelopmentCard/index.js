import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import FavoriteButton from '../FavoriteButton';
import RealEstateDeveloperAdvertisement from '../../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import { useNavigation } from '@react-navigation/native';

export default function DevelopmentCard({ item }) {
    const navigation = useNavigation();
    const [ad, setAd] = useState(item); // استخدام item كقيمة افتراضية

    useEffect(() => {
        const fetchAd = async () => {
            try {
                if (!item?.id) {
                    console.error('معرف الإعلان غير موجود:', item);
                    return;
                }
                const fetchedAd = await RealEstateDeveloperAdvertisement.getById(item.id);
                if (fetchedAd) {
                    setAd(fetchedAd);
                }
            } catch (error) {
                console.error('خطأ في جلب بيانات الإعلان:', error);
            }
        };
        fetchAd();
    }, [item?.id]);

    if (!ad) {
        return (
            <View style={styles.card}>
                <Text>خطأ: لا توجد بيانات للإعلان</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity style={styles.card}
            onPress={() => navigation.navigate('DevelopmentDetails', { item })}>
            <Image
                source={ad.images && ad.images.length > 0 ? { uri: ad.images[0] } : require('../../assets/1.webp')}
                style={styles.image}
            />

            <View style={styles.content}>
                <Text style={styles.price}>
                    {ad.price_start_from ? ad.price_start_from.toLocaleString() : '—'} -
                    {ad.price_end_to ? ad.price_end_to.toLocaleString() : '—'} ج.م
                </Text>
                <Text style={styles.name}>{ad.developer_name}</Text>
                <Text style={styles.model}>{ad.developer_name}</Text>
            </View>
            <FavoriteButton id={ad.id} type="development" />
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


// stop_________________________________________