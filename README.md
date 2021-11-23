# Catchinichi-SERVER

## CAU capstone design (2)

### 역할분담

|    담당    | 이름       |
| :--------: | ---------- |
| 안드로이드 | 이지현     |
|  **서버**  | **신지호** |
|     AI     | 송유지     |

<img width="661" alt="스크린샷 2021-11-21 오후 6 25 54" src="https://user-images.githubusercontent.com/60956392/142955338-6f3dbcd1-be6a-45e8-8abe-3b890553f64b.png">
<img width="536" alt="스크린샷 2021-11-21 오후 6 25 49" src="https://user-images.githubusercontent.com/60956392/142955350-b6bbee66-bc5f-493e-b1f5-c651f50afa7e.png">

### 기술스택

`Node.js, Mysql, AWS EC2, AWS RDS, AWS S3`

### 디렉토리 구조

```bash
#Catchi-Nichi-SERVER

├── config
│   └── config.js
├── controllers
│   ├── fragranceController.js
│   ├── memoController.js
│   ├── recommendController.js
│   ├── reviewController.js
│   ├── searchController.js
│   └── userController.js
├── models
│   ├── fragrance.js
│   ├── index.js
│   ├── like.js
│   ├── memo.js
│   ├── note.js
│   ├── review.js
│   └── user.js
├── module
│   ├── jwt.js
│   ├── middlewares.js
│   └── statusCode.js
├── recommender
│   ├── DataFrames
│   │   ├── df_preds.csv
│   │   └── user_row_df.csv
│   ├── mysql_reviews.py
│   ├── requirements.txt
│   ├── similar_fragrance.py
│   ├── updateTable.py
│   └── user_based.py
├── routes
│   ├── fragrance.js
│   ├── index.js
│   ├── memo.js
│   ├── recommend.js
│   ├── review.js
│   ├── search.js
│   ├── token.js
│   └── user.js
├── search
├── swagger
│   ├── swagger.js
│   └── swagger.yaml
├── README.md
├── app.js
├── package-lock.json
└── package.json
```

### 휴대폰 인증을 위해  Twilio 가입

Twillio([twilio.com](http://twilio.com/)) 가입 후, **ACCOUNT SID, AUTH TOKEN, PHONE NUMBER**을 발급받습니다.

### 프로젝트 파일 받기 (**git clone)**

```bash
git clone https://github.com/Catchi-Nichi/Catchinichi-SERVER.git
```

### 사용한 라이브러리 다운로드

프로젝트 폴더에서 밑의 명령어를 입력합니다.

```bash
npm i
```

### 비공개 파일 생성

암호를 관리할 .env 파일을 생성합니다.

**.env 파일**

```
JWT_SECRET= 

TWILIO_ACCOUNT_SID = 
TWILIO_AUTH_TOKEN = 
TWILIO_PHONE_NUMBER = 

S3_AWSAccessKeyId=
S3_AWSSecretKey=

DB_PASSWORD = 
```

### 향수 추천을 위한 파이썬 파일 가져오기

AI 쪽에서 recommender 폴더를 다운로드합니다. ([https://github.com/Catchi-Nichi/Catchinichi-AI](https://github.com/Catchi-Nichi/Catchinichi-AI)**)**

해당 폴더를 서버 폴더에 넣습니다.

### 향수 사진 검색을 위한 파이썬 파일 가져오기

AI 쪽에서 label_lecog 폴더를 다운로드합니다. ([https://github.com/Catchi-Nichi/Catchinichi-AI](https://github.com/Catchi-Nichi/Catchinichi-AI)**)**

해당 폴더를 서버 폴더에 넣습니다.

### 실행해보기

아래 명령어로 서버를 실행시켜 봅니다.

```bash
npm start
```
