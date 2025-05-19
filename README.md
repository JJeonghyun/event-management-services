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

## 3일차

이벤트 및 보상 CRUD

### 이벤트

- 이벤트 등록(CREATE)

  - 등록은 관리자(ADMIN)와 운영자(OPERATOR)가 할 수 있다.
  - 그 외 권한을 가진 자가 접근 시 에러 발생
  - 이벤트 이름, 설명, 조건, 활성화상태, 시작일자, 끝일자 로 구성되어 있다
  - 같은 일자의 동일한 이벤트는 등록될 수 없다.
    - 단, 같은 이벤트가 다른일자에는 등록이 될 수 있다

- 이벤트 조회(READ)

  - 이벤트 목록, 상세정보를 조회할 수 있어야 한다.
    - 전체 목록 조회 시 빈 배열이 반환 된다.
    - 상세 정보 조회 시 id값에 따른 정보가 없다면 에러가 발생한다.
  - 권한은 사용자, 운영자, 관리자가 할 수 있다.

- 이벤트 수정(UPDATE)

- 이벤트 삭제(DELETE)
  - 등록과 마찬가지로 운영자와 관리자만 삭제할 수 있다.
  - 존재하지 않는 이벤트의 id값으로 요청 시 에러가 발생한다.

### 보상

- 보상 등록(CREATE)
  - 등록은 운영자와 관리자가 가능하다.
  - 연결하고자 하는 이벤트 ID값을 담아 요청해야한다.
  - 보상 항목은 여러개가 될 수 있다
    - 추후 추가, 삭제, 정정 할 수 있다.
- 보상 조회(READ)

  - 조회는 전체목록, 상세 정보를 조회 할 수 있다.
  - 조회 시 연결되어 있는 이벤트의 ID값을 조회 할 수 있다.
    - 해당 id값으로 어떤 이벤트인지 나타내야 함

- 보상 수정(UPDATE)

  - 권한은 운영자와 관리자가 가능
  - 보상에 대한 항목을 변경하는 것이 아닌 보상 정보를 수정
  - 존재하지 않는 보상에 대한 정보를 수정 요청 시 에러 발생

- 보상 삭제(DELETE)

  - 권한은 운영자와 관리자가 가능
  - 존재 하지 않는 보상에 대한 정보를 삭제 요청 시 에러 발생

- 보상 항목 추가

  - 권한은 운영자와 관리자가 가능
  - 존재하는 보상에 대한 항목들을 추가
  - 존재하지 않는 보상에 대한 항목 추가 시 에러가 발생

- 보상 항목 삭제

  - 권한은 운영자와 관리자가 가능
  - 존재하는 보상에 대한 항목들을 삭제
  - 존재하지 않는 보상에 대한 항목 삭제 시 에러가 발생

- 보상 항목 정정
  - 권한은 운영자와 관리자가 가능
  - 존재하는 보상에 대한 항목들을 정정
  - 존재하지 않는 보상에 대한 항목 정정 시 에러가 발생
