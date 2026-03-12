# 🚀 Meeple Court 배포 가이드

## 준비물 확인
- [x] GitHub 계정
- [x] 터미널 사용 가능
- [ ] Node.js 설치 (없으면 아래 0단계 참고)

---

## 0단계: Node.js 설치 (이미 있으면 건너뛰기)

터미널에서 아래 명령어를 실행:
```bash
node --version
```
버전이 나오면 이미 설치됨 → 1단계로.
안 나오면 https://nodejs.org 에서 LTS 버전 설치.

---

## 1단계: 프로젝트 폴더 준비

다운로드한 `meeple-court` 폴더를 원하는 위치에 놓고, 터미널에서 이동:
```bash
cd meeple-court
```

의존성 설치:
```bash
npm install
```

로컬에서 테스트 (선택):
```bash
npm run dev
```
브라우저에서 `http://localhost:5173` 으로 확인.

---

## 2단계: GitHub 저장소 생성

1. https://github.com/new 접속
2. Repository name: `meeple-court`
3. Public 선택
4. **Create repository** 클릭

---

## 3단계: 코드 업로드

터미널에서 (meeple-court 폴더 안에서):
```bash
git init
git add .
git commit -m "Initial commit: Meeple Court prototype"
git branch -M main
git remote add origin https://github.com/여기에_본인_GitHub_아이디/meeple-court.git
git push -u origin main
```

⚠️ `여기에_본인_GitHub_아이디` 를 실제 GitHub 아이디로 바꿔주세요!

---

## 4단계: Vercel 배포

1. https://vercel.com 접속 → **Sign Up** (GitHub 계정으로 로그인)
2. **Add New → Project** 클릭
3. GitHub 저장소 목록에서 `meeple-court` 선택 → **Import**
4. 설정은 기본값 그대로 두고 **Deploy** 클릭
5. 1~2분 대기 → 완료!

배포 완료 후 `https://meeple-court-xxxxx.vercel.app` 같은 URL이 생성됩니다.

---

## 5단계: 커스텀 도메인 (선택)

Vercel 대시보드 → 프로젝트 → Settings → Domains 에서
원하는 도메인을 연결할 수 있습니다. (도메인을 별도로 구매해야 함)

---

## 이후 업데이트 방법

코드를 수정한 후:
```bash
git add .
git commit -m "업데이트 내용 설명"
git push
```
Vercel이 자동으로 감지해서 재배포합니다.

---

## 문제 해결

| 증상 | 해결 |
|------|------|
| `npm install` 실패 | Node.js 버전 확인 (18 이상 필요) |
| Vercel 빌드 실패 | Vercel 로그 확인 → 에러 메시지를 Claude에게 보여주세요 |
| DB 연결 안 됨 | Supabase 프로젝트가 활성 상태인지 확인 |
| 화면이 비어있음 | SQL 스키마를 Supabase에서 실행했는지 확인 |
