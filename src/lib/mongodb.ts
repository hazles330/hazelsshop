import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI가 설정되지 않았습니다.');
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI가 설정되지 않았습니다.');
    }

    const { connection } = await mongoose.connect(mongoUri);
    
    if (connection.readyState === 1) {
      console.log('MongoDB에 연결되었습니다.');
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    return Promise.reject(error);
  }
};

export default connectDB;
