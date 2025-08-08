import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FinancingRequest from '../FireBase/modelsWithOperations/FinancingRequest';
import Layout from '../src/Layout';
import { auth } from '../FireBase/firebaseConfig';
import { useRoute } from '@react-navigation/native';

const MyOrders = ({ navigation }) => {
  const route = useRoute();
  const { userId } = route.params || {};
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;
    const currentUserId = userId || auth.currentUser?.uid || 'guest';

    if (!currentUserId || currentUserId === 'guest') {
      setError('يرجى تسجيل الدخول لعرض طلباتك');
      setLoading(false);
      return;
    }

    try {
      unsubscribe = FinancingRequest.subscribeByUser(currentUserId, (fetchedRequests) => {
        setRequests(fetchedRequests);
        setLoading(false);
      });
    } catch (err) {
      setError('حدث خطأ أثناء جلب الطلبات');
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId]);

  const translate = {
    monthly_income: 'الدخل الشهري',
    job_title: 'المسمى الوظيفي',
    employer: 'جهة العمل',
    age: 'السن',
    dependents: 'عدد المعالين',
    repayment_years: 'مدة السداد (سنوات)',
    financing_amount: 'مبلغ التمويل',
    marital_status: 'الحالة الاجتماعية',
    status: 'حالة الطلب',
    advertisement_title: 'عنوان الإعلان',
    phone_number: 'رقم الهاتف',
  };

  const icons = {
    monthly_income: 'person',
    job_title: 'work',
    employer: 'business',
    age: 'calendar-today',
    dependents: 'group',
    repayment_years: 'schedule',
    financing_amount: 'attach-money',
    marital_status: 'family-restroom',
    status: 'check-circle',
    phone_number: 'phone',
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'approved':
        return 'تمت الموافقة';
      case 'rejected':
        return 'مرفوض';
      default:
        return status;
    }
  };

  const translateMaritalStatus = (status) => {
    switch (status) {
      case 'single':
        return 'أعزب';
      case 'married':
        return 'متزوج';
      case 'divorced':
        return 'مطلق';
      case 'widowed':
        return 'أرمل';
      default:
        return status;
    }
  };

  const handleDelete = async (requestId) => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد أنك تريد حذف هذا الطلب؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              const request = await FinancingRequest.getById(requestId);
              if (!request) {
                throw new Error('الطلب غير موجود');
              }
              await request.delete();
              Alert.alert('نجاح', 'تم حذف الطلب بنجاح');
              setRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
            } catch (error) {
              Alert.alert('خطأ', `حدث خطأ أثناء حذف الطلب: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const renderRequest = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.requestCard}
        onPress={() => {
        }}
      >
        <View style={styles.requestContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.requestTitle}>طلب رقم: {item.id}</Text>
          </View>
          <View style={styles.requestDetailContainer}>

          </View>
          {Object.entries(item).map(([key, value]) => {
            if (
              key === 'id' ||
              key === 'user_id' ||
              key === 'advertisement_id' ||
              key === 'submitted_at' ||
              key === 'advertisement_title'
            ) {
              return null;
            }
            return (
              <View key={key} style={styles.requestDetailContainer}>
                <Text style={styles.requestDetailText}>
                  {translate[key] || key}: {key === 'status' ? translateStatus(value) : key === 'marital_status' ? translateMaritalStatus(value) : typeof value === 'number' ? value.toLocaleString() : value || 'غير محدد'}
                </Text>
                <MaterialIcons name={icons[key] || 'info'} size={14} color="#4D00B1" />
              </View>
            );
          })}
          {item.submitted_at && (
            <View style={styles.requestDetailContainer}>
              <Text style={styles.requestDetailText}>
                تاريخ التقديم: {item.submitted_at?.toDate().toLocaleString('ar-EG') || 'غير محدد'}
              </Text>
              <MaterialIcons name="event" size={14} color="#4D00B1" />
            </View>
          )}
        </View>
             <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
             <Text style={{color:'white'}}>حذف</Text>
            </TouchableOpacity>
      </TouchableOpacity>
      
    );
  };

  if (loading) {
    return (
      <Layout>
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#4D00B1" />
          <Text style={styles.loadingText}>جاري تحميل الطلبات...</Text>
        </View>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <View style={styles.centeredContainer}>
          <MaterialIcons name="error-outline" size={40} color="#4D00B1" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>طلباتي</Text>
        {requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="info-outline" size={40} color="#999" />
            <Text style={styles.emptyText}>لا توجد طلبات تمويل مسجلة</Text>
          </View>
        ) : (
          requests.map((item) => renderRequest({ item }))
        )}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
    direction: 'rtl',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4D00B1',
    textAlign: 'center',
    marginVertical: 20,
    writingDirection: 'rtl',
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
  headerContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4D00B1',
    textAlign: 'center',
    margin:'auto'
  },
  deleteButton: {
    paddingVertical:6,
    paddingHorizontal:20,
    textAlign:'center',
    margin:'auto',
    backgroundColor:'#4D00B1',
  borderRadius:15,
  marginBottom:10
  },
  requestDetailContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 5,
    gap: 10,
  },
  requestDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 'auto',
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
    marginTop: 8,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4D00B1',
    writingDirection: 'rtl',
  },
  errorText: {
    fontSize: 16,
    color: '#4D00B1',
    textAlign: 'center',
    marginTop: 8,
    writingDirection: 'rtl',
  },
});

export default MyOrders;