import { registerWithEmailAndPassword } from './registerWithEmailAndPassword';

const result = await registerWithEmailAndPassword('test@example.com', '123456');
if (result.success) {
  console.log('تم التسجيل والـ UID:', result.uid);
} else {
  console.error(result.error);
}
