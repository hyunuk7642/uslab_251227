# Netlify 배포 설정 가이드

## 중요: Publish 디렉토리 설정 제거 필수

`@netlify/plugin-nextjs`를 사용할 때는 **반드시** Netlify UI에서 Publish 디렉토리 설정을 제거해야 합니다.

## 설정 방법

1. **Netlify 대시보드 접속**
   - https://app.netlify.com 접속
   - 배포하려는 사이트 선택

2. **Build settings 이동**
   - 왼쪽 메뉴에서 **Site settings** 클릭
   - **Build & deploy** 섹션 클릭
   - **Build settings** 섹션으로 스크롤

3. **Publish directory 제거**
   - **Publish directory** 필드 찾기
   - 필드가 비어있지 않다면 **완전히 비워두기** (빈 값으로 설정)
   - 또는 필드 옆의 **X** 버튼을 클릭하여 제거

4. **저장 및 재배포**
   - **Save** 버튼 클릭
   - **Deploys** 탭으로 이동
   - **Trigger deploy** > **Clear cache and deploy site** 클릭

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

