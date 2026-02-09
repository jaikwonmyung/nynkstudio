#!/bin/bash

# 현재 디렉토리로 이동 (스크립트 위치)
cd "$(dirname "$0")" || exit

# 의존성 설치 확인
if [ ! -d "node_modules" ]; then
    echo "📦 필요한 패키지를 설치하는 중입니다..."
    npm install
fi

# 개발 서버 실행
echo "🚀 nynkstudio 서버를 실행합니다..."
npm run dev
