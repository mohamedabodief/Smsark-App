import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Svg, Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import instapayLogo from "../assets/instapay.png"; 
import bankLogo from "../assets/bankLogo.png"; 
const PaymentIcons = {
  Bank: (
    <Image
      source={bankLogo}
      style={{ width: 100, height: 100 }}
      resizeMode="contain"
    />
  ),
  vodafone: (
    <Svg height="50" width="50" viewBox="0 0 48 48">
      <Path
        fill="#d50000"
        d="M16.65,5.397c5.015-1.999,10.857-1.861,15.738,0.461l0.066,0.085l0.098-0.034c3.704,1.776,6.852,4.706,8.857,8.303c1.718,3.062,2.614,6.591,2.526,10.105c-0.017,4.545-1.716,9.045-4.628,12.52c-2.754,3.314-6.605,5.698-10.803,6.653c-4.209,0.971-8.738,0.552-12.677-1.237c-3.855-1.722-7.12-4.714-9.197-8.395c-1.728-3.059-2.642-6.586-2.566-10.105c0.008-4.384,1.565-8.735,4.283-12.164C10.518,8.852,13.399,6.675,16.65,5.397z"
      />
      <Path
        fill="#fff"
        d="M28.205,6.039c1.377-0.233,2.792-0.392,4.183-0.181l0.2,0.034l-0.134,0.051c-1.294,0.371-2.545,0.951-3.554,1.86c-1.816,1.58-2.961,3.981-2.828,6.411c2.464,0.618,4.926,1.703,6.61,3.674c1.764,2.013,2.402,4.806,2.206,7.431c-0.311,4.005-3.029,7.754-6.812,9.142c-2.521,0.94-5.409,0.952-7.898-0.102c-2.583-1.064-4.727-3.127-5.944-5.642c-1.182-2.397-1.505-5.159-1.156-7.792c0.527-3.716,2.393-7.19,5.057-9.808C20.912,8.505,24.466,6.745,28.205,6.039z"
      />
    </Svg>
  ),
  instapay: (
    <Image
      source={instapayLogo}
      style={{ width: 130, height: 130 }}
      resizeMode="contain"
    />
  ),
};
const accountDetails = {
  VISA: {
    bankAccount: "1234 5678 9012 3456",
    phone: "غير متاح",
    paymentAddress: "غير متاح",
  },
  "فودافون كاش": {
    phone: "0109 876 5432",
    bankAccount: "غير متاح",
    paymentAddress: "غير متاح",
  },
  "انستا باي": {
    bankAccount: "9876 5432 1098 7654",
    phone: "0112 345 6789",
    paymentAddress: "smsark-alakary@instapay",
  },
};
const PaymentMethods = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleOpen = (methodName) => {
    setSelectedMethod(methodName);
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setSelectedMethod(null);
  };

  const methods = [
    { name: "حساب بنكي", icon: PaymentIcons.Bank },
    { name: "فودافون كاش", icon: PaymentIcons.vodafone },
    { name: "انستا باي", icon: PaymentIcons.instapay },
  ];

  const renderModalContent = () => {
    if (!selectedMethod) return null;

    switch (selectedMethod) {
      case "VISA":
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              <Text style={styles.modalLabel}>رقم الحساب البنكي: </Text>
              {accountDetails["VISA"].bankAccount}
            </Text>
          </View>
        );

      case "فودافون كاش":
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              <Text style={styles.modalLabel}>رقم التليفون: </Text>
              {accountDetails["فودافون كاش"].phone}
            </Text>
          </View>
        );

      case "انستا باي":
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              <Text style={styles.modalLabel}>رقم الحساب البنكي: </Text>
              {accountDetails["انستا باي"].bankAccount}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.modalLabel}>رقم التليفون: </Text>
              {accountDetails["انستا باي"].phone}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.modalLabel}>عنوان الدفع: </Text>
              {accountDetails["انستا باي"].paymentAddress}
            </Text>
          </View>
        );

      default:
        return <Text style={styles.modalText}>لا توجد تفاصيل متاحة.</Text>;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>وسائل تحويل الاموال المتاحة</Text>
      <View style={styles.methodsContainer}>
        {methods.map((method, index) => (
          <TouchableOpacity
            key={index}
            style={styles.methodBox}
            onPress={() => handleOpen(method.name)}
          >
            <View style={styles.iconContainer}>{method.icon}</View>
            <Text style={styles.methodName}>{method.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>تفاصيل الدفع - {selectedMethod}</Text>
            </View>
            <View style={styles.modalDivider} />
            {renderModalContent()}
          </View>
        </View>
      </Modal>

      {/* Note Text */}
      <Text style={styles.noteText}>
        <Text style={styles.noteLabel}>تنويه هام: </Text>
        يرجى من العميل اختيار وسيلة الدفع الأنسب له، وسداد قيمة الباقة المختارة،
        ثم تجهيز صورة إيصال الدفع ليتم رفعها عند استكمال عملية الاشتراك في
        الباقة
      </Text>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
    justifyContent:'center'
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#6E00FE",
    marginBottom: 24,
    textAlign: "center",
    width: "100%",
    marginTop:30
  },
  methodsContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  methodBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    width: "90%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  methodName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "right",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 12,
  },
  modalContent: {
    paddingVertical: 8,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
    textAlign: "right",
  },
  modalLabel: {
    fontWeight: "bold",
    color: "#6E00FE",
  },
  noteText: {
    fontSize: 14,
    color: "#444",
    textAlign: "right",
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 20,
    width: "90%",
  },
  noteLabel: {
    fontWeight: "bold",
    color: "#6E00FE",
  },
});

export default PaymentMethods;