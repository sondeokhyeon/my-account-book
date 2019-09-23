import app from './src/app'
import dotenv from 'dotenv';
import path from 'path'

dotenv.config({path : path.resolve(__dirname, '.env')});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`${PORT}포트로 서버 실행 중..`)
})