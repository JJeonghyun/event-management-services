# event-management-services

이벤트 관리 서비스

## 1일차

### 프로젝트 버전 관리

```
node - 18 (고정)
nest - 최신
DB - MongoDB
인증 - JWT
배포/실행 - docker + docker-compose
언어 - TS
```

### 프로젝트 설정 및 서버 구축

1. Gateway Server - 모든 API의 진입점, 인증 및 권한 검사

   - NestJS의 `@nestjs/passport` `AuthGuard` `RolesGuard` 사용할 것

2. Auth Server - 유저 정보 관리, 로그인, 역할 관리, JWT 발급
3. Event Server - 이벤트 생성, 보상 정의, 보상 요청 관리, 지급 상태 저장

- nestjs 전역 설치

```bash
# nestjs cli 전역 설치
npm install -global @nestjs/cli@latest
```

- nestJS 사용 명령어

```bash
# gateway 서비스 구축
nest new gateway

# gateway 라이브러리 설치
npm install @nestjs/microservices @nestjs/passport passport passport-jwt jsonwebtoken bcrypt

# auth 서비스 구축
nest new auth
npm install @nestjs/microservices

# event 서비스 구축
nest new event
npm install @nestjs/microservices
```

### docker-compse 실행 및 각 서비스 빌드

```bash
# 컨테이너 실행 및 빌드 명령어
docker-compose up --build

# 혹은
docker compose up --build

# 컨테이너 종료
docker-compse down
```

## 2일차

- MongoDB 설치

```bash
# 로컬 docker를 통한 mongodb 설치
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=1234 mongo

# @nestjs/mongoose: NestJS용 Mongoose 모듈
npm install @nestjs/mongoose mongoose
```

- 비밀번호 암호화
  - 유저 등록시
  - 로그인 시

```bash
# nest bcrypt
npm i bcrypt
npm i -D @types/bcrypt
```
