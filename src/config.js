// 청첩장 공용 데이터. 실제 값으로 교체할 것(현재는 모두 임시 값).
export const config = {
  groom: {
    name: "신랑",
    father: "아버지",
    mother: "어머니",
    order: "장남",
    photo: "", // 폴라로이드에 들어갈 사진 경로(없으면 자리 표시)
  },
  bride: {
    name: "신부",
    father: "아버지",
    mother: "어머니",
    order: "삼녀",
    photo: "",
  },

  intro: {
    gate: false, // 벽장 게이트(꾹 눌렀다 놓기) 사용 여부. 끄면 표지가 바로 나타난다.
    gateText: "주먹을 꼭 쥐고, 눈을 감아 보세요",
    cover: "", // 표지 배경 사진(선택). 없으면 해안 일러스트만 사용
  },

  wedding: {
    date: "2027-01-23", // YYYY-MM-DD (KST)
    time: "14:00", // HH:mm (KST)
    durationHours: 2, // "예식이 진행 중입니다" 표시 구간
    venue: "더메리든",
    hall: "", // 홀 이름(있으면 예식장 이름 뒤에 붙는다)
    address: "경기도 성남시 분당구 서현로 180번길 19 비전월드 8층",
    map: {
      // map.kakao.com '지도 퍼가기'에서 발급되는 값(API 키 등록 불필요)
      kakao: { timestamp: "1725626770032", key: "2kkei" },
      naver: "https://map.naver.com/p/entry/place/34329597",
    },
    transport: [
      {
        label: "지하철",
        text: "분당선 서현역 5번 출구",
        sub: "출구에서 좌측으로 도보 3분",
      },
      { label: "버스", text: "서현역.AK플라자, 이매촌한신아파트 하차" },
      {
        label: "자가용",
        text: "판교IC에서 약 10분",
        sub: "건물 내 주차장 이용 (700대 이상)",
      },
    ],
  },

  greeting: {
    title: "초대합니다",
    lines: [
      "우리는 모두 같은 속도로",
      "시간 위를 걸어가고 있습니다.",
      "",
      "그 길에서 서로를 만난 두 사람이",
      "이제 남은 시간을 함께 걸으려 합니다.",
      "",
      "그 첫걸음에 함께해 주세요.",
    ],
  },

  gallery: [
    // { src: 'assets/img/g1-1200.webp', thumb: 'assets/img/g1-800.webp', alt: '' }
  ],
  galleryPlaceholderCount: 6,

  accounts: {
    groom: [
      { role: "신랑", bank: "은행", number: "000-0000-0000", holder: "예금주" },
      {
        role: "아버지",
        bank: "은행",
        number: "000-0000-0000",
        holder: "예금주",
      },
      {
        role: "어머니",
        bank: "은행",
        number: "000-0000-0000",
        holder: "예금주",
      },
    ],
    bride: [
      { role: "신부", bank: "은행", number: "000-0000-0000", holder: "예금주" },
      {
        role: "아버지",
        bank: "은행",
        number: "000-0000-0000",
        holder: "예금주",
      },
      {
        role: "어머니",
        bank: "은행",
        number: "000-0000-0000",
        holder: "예금주",
      },
    ],
  },

  // 비어 있으면 BGM 버튼을 표시하지 않는다.
  // 파헬벨 "캐논" 피아노 연주, Lee Galloway (CC BY-SA 3.0) - Wikimedia Commons. 푸터에 출처를 표기한다.
  bgm: { src: "assets/audio/bgm.mp3" },

  share: {
    title: "결혼합니다",
    text: "저희 결혼식에 초대합니다.",
    url: "", // 배포 주소(카카오 앱에 등록한 도메인). 비우면 현재 주소 사용
    image: "", // 카카오톡 카드 이미지의 절대 URL(권장 800x400 이상)
    kakao: {
      key: "", // 카카오디벨로퍼스 JavaScript 키. 비우면 카카오톡 공유 버튼을 숨긴다.
      sdkVersion: "2.8.3",
      integrity: "", // 다운로드 페이지의 해당 버전 SRI 해시(sha384-...)
    },
  },
};
