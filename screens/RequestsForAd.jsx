import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FinancingRequest from '../FireBase/modelsWithOperations/FinancingRequest';
import Layout from '../src/Layout';

const RequestsForAd = ({ route, navigation }) => {
  const { adId, adTitle } = route.params;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adId) {
      Alert.alert('خطأ', 'معرف الإعلان غير متوفر');
      setLoading(false);
      return;
    }
    const unsubscribe = FinancingRequest.subscribeByAdvertisementId(adId, (fetchedRequests) => {
      setRequests(fetchedRequests);
      setLoading(false);
    }, (error) => {
      Alert.alert('خطأ', 'فشل في جلب الطلبات: ' + (error.message || 'يرجى المحاولة لاحقًا'));
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [adId]);

  const handleApprove = (request) => {
    Alert.alert(
      'تأكيد القبول',
      'هل أنت متأكد من قبول هذا الطلب؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'قبول',
          onPress: async () => {
            try {
              await request.update({ reviewStatus: 'approved' });
              Alert.alert('تم', 'تم قبول الطلب بنجاح');
            } catch (error) {
              Alert.alert('خطأ', 'فشل في قبول الطلب: ' + (error.message || 'يرجى المحاولة لاحقًا'));
            }
          },
        },
      ],
    );
  };

  const handleReject = (request) => {
    Alert.alert(
      'تأكيد الرفض',
      'هل أنت متأكد من رفض هذا الطلب؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'رفض',
          onPress: async () => {
            try {
              await request.reject('سبب الرفض');
              Alert.alert('تم', 'تم رفض الطلب بنجاح');
            } catch (error) {
              Alert.alert('خطأ', 'فشل في رفض الطلب: ' + (error.message || 'يرجى المحاولة لاحقًا'));
            }
          },
        },
      ],
    );
  };

  const renderRequest = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.requestCard}
        onPress={() => {
        }}
      >
        <View style={styles.requestContent}>
          <Text style={styles.requestTitle}>طلب رقم: {item.id}</Text>
          <View style={styles.requestDetailContainer}>
            <Text style={styles.requestDetailText}>الدخل الشهري: {item.monthly_income || 'غير محدد'} جنيه</Text>
            <MaterialIcons name="person" size={14} color="#4D00B1" />
          </View>
          <View style={styles.requestDetailContainer}>
            <Text style={styles.requestDetailText}>الوظيفة: {item.job_title || 'غير محدد'}</Text>
            <MaterialIcons name="work" size={14} color="#4D00B1" />
          </View>
          <View style={styles.requestDetailContainer}>
            <Text style={styles.requestDetailText}>جهة العمل: {item.employer || 'غير محدد'}</Text>
            <MaterialIcons name="business" size={14} color="#4D00B1" />
          </View>
          <View style={styles.requestDetailContainer}>
            <Text style={styles.requestDetailText}>العمر: {item.age || 'غير محدد'}</Text>
            <MaterialIcons name="calendar-today" size={14} color="#4D00B1" />
          </View>
          <View style={styles.requestDetailContainer}>
            <Text style={styles.requestDetailText}>الحالة الاجتماعية: {item.marital_status || 'غير محدد'}</Text>
            <MaterialIcons name="family-restroom" size={14} color="#4D00B1" />
          </View>
          <View style={styles.requestDetailContainer}>
            <Text style={styles.requestDetailText}>عدد المعالين: {item.dependents || 'غير محدد'}</Text>
            <MaterialIcons name="group" size={14} color="#4D00B1" />
          </View>
          <View style={styles.requestDetailContainer}>
            <Text style={styles.requestDetailText}>مبلغ التمويل: {item.financing_amount || 'غير محدد'} جنيه</Text>
            <MaterialIcons name="attach-money" size={14} color="#4D00B1" />
          </View>
          <View style={styles.requestDetailContainer}>
            <Text style={styles.requestDetailText}>مدة السداد: {item.repayment_years || 'غير محدد'} سنوات</Text>
            <MaterialIcons name="schedule" size={14} color="#4D00B1" />
          </View>
          <View style={styles.requestDetailContainer}>
            <Text style={styles.requestDetailText}>رقم الهاتف: {item.phone_number || 'غير محدد'}</Text>
            <MaterialIcons name="phone" size={14} color="#4D00B1" />
          </View>
          <View style={styles.requestDetailContainer}>
            <Text style={styles.requestDetailText}>الحالة: {item.reviewStatus || 'قيد الانتظار'}</Text>
            <MaterialIcons name="check-circle" size={14} color="#4D00B1" />
          </View>
          <View style={styles.requestDetailContainer}>
            <Text style={styles.requestDetailText}>تاريخ التقديم: {item.submitted_at?.toDate().toLocaleString('ar-EG') || 'غير محدد'}</Text>
            <MaterialIcons name="event" size={14} color="#4D00B1" />
          </View>
          <View style={styles.requestActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#4D00B1' }]}
              onPress={() => handleApprove(item)}
            >
              <Text style={styles.actionButtonText}>قبول</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF4D4D' }]}
              onPress={() => handleReject(item)}
            >
              <Text style={styles.actionButtonText}>رفض</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <Layout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4D00B1" />
          <Text style={styles.loadingText}>جاري تحميل الطلبات...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>طلبات إعلان: {adTitle || 'غير محدد'}</Text>
        </View>
        {requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>لا توجد طلبات لهذا الإعلان</Text>
          </View>
        ) : (
          <FlatList
            data={requests}
            renderItem={renderRequest}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    direction: 'rtl',
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
    direction: 'rtl',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4D00B1',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4D00B1',
    writingDirection: 'rtl',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    writingDirection: 'rtl',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    direction: 'rtl',
  },
  requestContent: {
    padding: 15,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4D00B1',
    marginBottom: 10,
    textAlign: 'center',
  },
  requestDetailContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 5,
    gap:10
  },
  requestDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 'auto', 
    writingDirection: 'rtl',
    gap:10
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    paddingBottom: 10,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RequestsForAd;