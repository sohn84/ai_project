# Next.js Vercel 배포 가이드

**Next.js**로 변환된 프로젝트(`travel-expense-next`)를 **Vercel**에 배포하는 방법입니다.

## 방법 1: Vercel CLI 사용 (가장 빠름)

터미널에서 바로 배포하는 방법입니다.

1.  **Vercel CLI 설치** (아직 안 했다면)
    ```powershell
    npm install -g vercel
    ```

2.  **프로젝트 폴더로 이동**
    ```powershell
    cd C:\Users\HANA\AI_project\travel-expense-next
    ```

3.  **배포 명령어 실행**
    ```powershell
    vercel
    ```

4.  **질문 답변**
    명령어를 실행하면 몇 가지 질문이 나옵니다. 대부분 엔터(Enter)를 쳐서 기본값을 선택하면 됩니다.
    *   Set up and deploy? **Y**
    *   Which scope? **(본인 계정 선택)**
    *   Link to existing project? **N**
    *   Project name? **travel-expense-next** (또는 원하는 이름)
    *   In which directory? **./** (그냥 엔터)
    *   Want to modify these settings? **N**

5.  **완료**
    배포가 완료되면 `Production: https://...` 주소가 나옵니다.

## 방법 2: GitHub 연동 (추천)

코드를 GitHub에 올리고 Vercel과 연결하면, 코드를 수정할 때마다 자동으로 배포됩니다.

1.  **GitHub에 레포지토리 생성**
2.  **코드 푸시**
    ```powershell
    cd C:\Users\HANA\AI_project\travel-expense-next
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin <당신의_GITHUB_REPO_주소>
    git push -u origin main
    ```
3.  **Vercel 대시보드 접속** (https://vercel.com)
4.  **"Add New..." -> "Project"** 클릭
5.  **GitHub 레포지토리 선택** 후 **Import** 클릭
6.  **Deploy** 클릭

---
**참고**: Supabase URL과 Key는 현재 코드에 포함되어 있지만, 보안을 위해 Vercel의 **Environment Variables**에 설정하는 것이 좋습니다.
*   `NEXT_PUBLIC_SUPABASE_URL`
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
(코드의 `lib/supabase.js`도 이에 맞춰 수정해야 합니다.)
