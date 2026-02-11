import Main from "../Components/Main";


export default function HobbyPage() {

    const items = [
        { category: "취미",
            title: "주말 필름카메라 산책 모임",
            desc: "필름카메라와 거리 사진에 관심 있는 사람들과 함께 가볍게 산책하며 사진을 찍는 취미 모임입니다.",
            mode: "offline",
            capacity: 8,
            schedule: "TBD"
        },
        {
            category: "취미",
            title: "퇴근 후 보드게임 모임",
            desc: "가볍게 모여 다양한 보드게임을 즐기며 새로운 사람들과 교류하는 시간입니다.",
            mode: "offline",
            capacity: 6,
            schedule: "Wed 19:00"
        },
        {
            category: "취미",
            title: "온라인 독서 토론 스터디",
            desc: "한 달에 한 권 책을 읽고 자유롭게 의견을 나누는 온라인 독서 모임입니다.",
            mode: "online",
            capacity: 10,
            schedule: "TBD"
        },
        {
            category: "취미",
            title: "러닝 입문 크루",
            desc: "가볍게 달리기를 시작하고 싶은 사람들을 위한 초보자 러닝 모임입니다.",
            mode: "offline",
            capacity: 12,
            schedule: "Sat 09:00"
        },
        {
            category: "취미",
            title: "취미 코딩 사이드 프로젝트 모임",
            desc: "각자 만들고 싶은 작은 프로젝트를 진행하며 서로 피드백을 주고받는 모임입니다.",
            mode: "hybrid",
            capacity: 7,
            schedule: "TBD"
        },
        {
            category: "취미",
            title: "카페 투어 크루",
            desc: "새로운 카페를 탐방하며 커피와 공간을 함께 즐기는 소규모 모임입니다.",
            mode: "offline",
            capacity: 5,
            schedule: "Sun 14:00"
        },
        {
            category: "취미",
            title: "취미 드로잉 클래스",
            desc: "기초 드로잉부터 차근차근 배우며 그림을 즐기는 편안한 모임입니다.",
            mode: "hybrid",
            capacity: 9,
            schedule: "TBD"
        },
        {
            category: "취미",
            title: "넷플릭스 영화 같이 보기",
            desc: "정해진 영화를 함께 보고 감상을 나누는 온라인 취미 모임입니다.",
            mode: "online",
            capacity: 15,
            schedule: "Fri 21:00"
        },
        {
            category: "취미",
            title: "주말 베이킹 소모임",
            desc: "간단한 디저트를 함께 만들며 레시피를 공유하는 취미 베이킹 모임입니다.",
            mode: "offline",
            capacity: 4,
            schedule: "TBD"
        },
        {
            category: "취미",
            title: "사진 보정 스터디",
            desc: "라이트룸과 포토샵을 활용해 사진 보정 기술을 서로 배우는 모임입니다.",
            mode: "online",
            capacity: 11,
            schedule: "Tue 20:00"
        },
        {
            category: "취미",
            title: "야경 출사 모임",
            desc: "도심 야경을 촬영하며 촬영 팁과 장비 정보를 나누는 취미 사진 모임입니다.",
            mode: "offline",
            capacity: 6,
            schedule: "Sat 19:30"
        },
        {
            category: "취미",
            title: "취미 기타 연주 모임",
            desc: "초보자도 부담 없이 참여할 수 있는 기타 연습과 합주 중심의 모임입니다.",
            mode: "hybrid",
            capacity: 8,
            schedule: "TBD"
        },
        {
            category: "취미",
            title: "퍼즐 맞추기 소모임",
            desc: "조용한 분위기에서 퍼즐을 맞추며 힐링하는 취미 모임입니다.",
            mode: "offline",
            capacity: 3,
            schedule: "Sun 16:00"
        },
        {
            category: "취미",
            title: "온라인 글쓰기 챌린지",
            desc: "매주 글쓰기 주제를 공유하고 서로 피드백을 나누는 온라인 취미 모임입니다.",
            mode: "online",
            capacity: 20,
            schedule: "TBD"
        },
        {
            category: "취미",
            title: "취미 요가 스트레칭 클래스",
            desc: "몸을 가볍게 풀며 스트레칭과 요가를 함께 배우는 편안한 모임입니다.",
            mode: "hybrid",
            capacity: 10,
            schedule: "Mon 18:30"
        }
    ];


    return(
        <>
            <div className="search-wrap">
                <input className="search-input"
                type="text" placeholder="취미 모임 검색" />
            </div>

            <Main items={items} />
        </>
    );
}
