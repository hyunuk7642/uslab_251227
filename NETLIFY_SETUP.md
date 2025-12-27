# Netlify 배포 설정 가이드

## ⚠️ 중요: Publish 디렉토리 설정 제거 필수

`@netlify/plugin-nextjs`를 사용할 때는 **반드시** Netlify UI에서 Publish 디렉토리 설정을 제거해야 합니다.

## 🔧 설정 방법 (단계별)

### 1단계: Netlify 대시보드 접속
- https://app.netlify.com 접속
- 로그인 후 배포하려는 사이트를 선택

### 2단계: Site settings 이동
- 사이트 대시보드에서 왼쪽 사이드바의 **Site settings** 클릭
- 또는 사이트 이름 옆의 **Settings** 버튼 클릭

### 3단계: Build & deploy 섹션
- **Build & deploy** 메뉴 클릭
- **Build settings** 섹션으로 스크롤

### 4단계: Publish directory 제거 (가장 중요!)
- **Build settings** 섹션에서 **Publish directory** 필드를 찾습니다
- 현재 값이 무엇이든 (예: `.next`, `out`, `/opt/build/repo` 등) **완전히 비워야 합니다**
- 필드에 커서를 두고 모든 텍스트를 삭제하거나
- 필드 옆의 **X** 버튼이나 **Clear** 버튼이 있다면 클릭
- **필드가 완전히 비어있어야 합니다** (공백도 없어야 함)

### 5단계: 저장
- 페이지 하단의 **Save** 버튼 클릭
- 저장 성공 메시지 확인

### 6단계: 재배포
- 상단의 **Deploys** 탭 클릭
- **Trigger deploy** 드롭다운 클릭
- **Clear cache and deploy site** 선택
- 배포가 시작되면 로그를 확인하세요

## 왜 필요한가?

`@netlify/plugin-nextjs` 플러그인은 Next.js 애플리케이션의 배포를 자동으로 처리합니다. 
Publish 디렉토리를 수동으로 설정하면 플러그인과 충돌하여 다음 에러가 발생합니다:

```
Error: Your publish directory cannot be the same as the base directory of your site.
```

## 확인 방법

배포 로그에서 다음을 확인하세요:

```
Resolved config
  build:
    publish: (없어야 함 또는 다른 경로)
    publishOrigin: config (ui가 아닌 config여야 함)
```

`publishOrigin: ui`가 보이면 아직 UI에서 설정이 남아있는 것입니다.

