import React from 'react';

interface GuidePageProps {
    onBack: () => void;
}

const Section: React.FC<{ index: string; title: string; children: React.ReactNode }> = ({ index, title, children }) => (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10 border-t border-[#F0C8D5]">
        <div className="md:col-span-3">
            <div className="flex items-baseline gap-3 md:sticky md:top-24">
                <span className="text-[10px] tracking-[0.3em] text-[#8A737B]">{index}</span>
                <h2 className="text-sm tracking-tight text-[#223055] font-medium">{title}</h2>
            </div>
        </div>
        <div className="md:col-span-9 space-y-4 text-[13px] leading-relaxed text-[#3f3f46]">
            {children}
        </div>
    </section>
);

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-4 py-2 border-b border-[#F7DCE5] last:border-b-0">
        <div className="text-[11px] uppercase tracking-[0.15em] text-[#8A737B] pt-0.5">{label}</div>
        <div className="sm:col-span-3">{children}</div>
    </div>
);

const Key: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block px-1.5 py-0.5 border border-[#E2AEBF] text-[11px] tracking-wide text-[#223055] align-middle">
        {children}
    </span>
);

const GuidePage: React.FC<GuidePageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-[#FFE1E9] text-zinc-900 pb-24">
            <header className="border-b border-[#F0C8D5] py-3 px-4 md:py-4 md:px-6 flex justify-between items-center bg-[#FFE1E9] sticky top-0 z-50">
                <button
                    onClick={onBack}
                    className="sm-lift flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-[#6B5A60] hover:text-[#223055] transition-colors"
                >
                    <span className="w-3 h-3 rounded-full border border-[#223055] inline-block"></span>
                    Back
                </button>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#8A737B]">Guide</span>
            </header>

            <main className="max-w-[1100px] mx-auto px-4 md:px-6">
                {/* Masthead */}
                <div className="pt-16 pb-12 sm-rise">
                    <img src="/sm-logo.png" alt="SM Entertainment Group" className="w-[190px] max-w-[60vw] mb-8" />
                    <h1 className="text-2xl md:text-3xl tracking-tight text-[#223055]">AI Studio 사용 가이드</h1>
                    <p className="mt-3 text-[13px] text-[#6B5A60] max-w-xl leading-relaxed">
                        이미지와 영상을 프롬프트로 생성하는 사내 도구입니다. 처음 쓰신다면 01번부터
                        순서대로 따라오시면 됩니다.
                    </p>
                </div>

                <Section index="01" title="시작하기">
                    <p>
                        접속하면 파란 오류 화면이 먼저 보입니다. 실제 오류가 아니라 외부 노출을 막기 위한 위장 화면입니다.
                        <strong className="text-[#223055]"> 화면 우측 하단 모서리를 클릭</strong>하면 안으로 들어갑니다.
                    </p>
                    <div className="mt-4">
                        <Row label="1단계">위장 화면 우측 하단 클릭</Row>
                        <Row label="2단계">비밀번호 입력 후 <Key>Enter</Key></Row>
                        <Row label="3단계">Gemini API 키 붙여넣기</Row>
                        <Row label="4단계">채널 선택 — Image 또는 Video</Row>
                    </div>
                </Section>

                <Section index="02" title="API 키">
                    <p>
                        생성 요청은 각자의 Google Gemini 키로 나갑니다. 키는 <strong className="text-[#223055]">어디에도 저장되지 않습니다</strong> —
                        브라우저 메모리에만 잠깐 머물다 새로고침하면 사라지므로, 접속할 때마다 다시 넣어야 합니다.
                        불편하지만 키가 유출되면 요금이 그대로 청구되기 때문에 의도된 설계입니다.
                    </p>
                    <div className="mt-4">
                        <Row label="발급">
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
                                className="sm-underline text-[#223055]">Google AI Studio</a>
                            에서 발급받습니다.
                        </Row>
                        <Row label="초기화">설정(우측 상단 점) → <Key>Reset API Key</Key></Row>
                        <Row label="주의">키는 개인별로 발급받아 쓰시고, 공유하지 마세요. 사용량이 발급자 계정에 쌓입니다.</Row>
                    </div>
                </Section>

                <Section index="03" title="채널 선택">
                    <p>진입하면 화면이 좌우로 나뉩니다. 좌우 아무 곳이나 클릭하면 해당 작업실로 들어갑니다.</p>
                    <div className="mt-4">
                        <Row label="네이비 / 좌측">
                            <strong className="text-[#223055]">Image</strong> — 정지 이미지 생성. 공간·제품·컨셉 비주얼용.
                        </Row>
                        <Row label="핑크 / 우측">
                            <strong className="text-[#223055]">Video</strong> — 8초 영상 생성. 무빙 컷·티저용.
                        </Row>
                    </div>
                    <p className="text-[#6B5A60]">헤더 좌측의 점을 누르면 언제든 이 선택 화면으로 돌아옵니다.</p>
                </Section>

                <Section index="04" title="이미지 만들기">
                    <p>
                        왼쪽에 프롬프트를 쓰고 아래 버튼을 누르면 오른쪽에 결과가 나옵니다.
                        프롬프트나 레퍼런스 이미지 <strong className="text-[#223055]">둘 중 하나는 반드시</strong> 있어야 실행됩니다.
                    </p>
                    <div className="mt-4">
                        <Row label="레퍼런스">
                            빈 칸을 클릭하거나 이미지를 끌어다 놓습니다. 여러 장 넣을수록 톤과 구조가 그쪽으로 붙습니다.
                            우측 상단 <Key>×</Key>로 제거합니다.
                        </Row>
                        <Row label="Consistency">
                            자물쇠 토글. 켜면 레퍼런스의 형태와 색을 더 강하게 유지합니다.
                            같은 오브젝트를 여러 컷으로 변주할 때 켜세요.
                        </Row>
                        <Row label="엔진">
                            <Key>4K ULTRA</Key> 는 품질 우선, <Key>NANOBANANA 2</Key> 는 속도 우선입니다.
                            시안을 빠르게 훑을 땐 후자, 최종본은 전자를 쓰시면 됩니다.
                        </Row>
                        <Row label="Settings">
                            우측 상단 점 → 비율(1:1 · 16:9 · 9:16)과 출력 품질(1K · 2K · 4K)을 정합니다.
                            품질을 올리면 시간과 비용이 함께 올라갑니다.
                        </Row>
                        <Row label="Full / Fit">결과 미리보기를 꽉 채워 볼지, 비율 그대로 볼지 전환합니다.</Row>
                    </div>
                </Section>

                <Section index="05" title="영상 만들기">
                    <p>
                        Veo 3.1 기반이며 길이는 <strong className="text-[#223055]">8초 고정</strong>입니다.
                        렌더링에 보통 1~3분 걸리니 실행 후 탭을 닫지 마세요.
                    </p>
                    <div className="mt-4">
                        <Row label="모델">
                            버튼을 누를 때마다 <Key>VEO 3.1</Key> → <Key>FAST</Key> → <Key>LITE</Key> 로 순환합니다.
                            아래로 갈수록 빠르고 가볍습니다.
                        </Row>
                        <Row label="비율 / 해상도">
                            16:9 와 9:16 중 선택합니다. <strong className="text-[#223055]">1080p는 16:9에서만</strong> 쓸 수 있고,
                            9:16에서는 자동으로 720p로 내려갑니다.
                        </Row>
                        <Row label="Start Frame">
                            이미지를 넣으면 그 장면에서 출발하는 영상을 만듭니다. 비워두면 프롬프트만으로 생성합니다.
                            Image 채널에서 뽑은 결과를 여기 넣는 흐름을 추천합니다.
                        </Row>
                        <Row label="Advanced">
                            펼치면 네거티브 프롬프트를 넣을 수 있습니다. 빼고 싶은 요소를 쉼표로 나열하세요.
                        </Row>
                    </div>
                </Section>

                <Section index="06" title="결과 관리">
                    <div>
                        <Row label="히스토리">
                            화면 하단에 <strong className="text-[#223055]">최근 20개</strong>가 쌓입니다. 썸네일을 누르면 그때 결과와
                            프롬프트를 다시 불러옵니다.
                        </Row>
                        <Row label="저장 위치">
                            브라우저 로컬 저장소입니다. 다른 기기·다른 브라우저에서는 보이지 않고,
                            방문 기록을 지우면 함께 사라집니다.
                        </Row>
                        <Row label="다운로드">
                            결과 위 <Key>Download</Key> 로 받습니다. 파일명에 날짜가 들어갑니다.
                        </Row>
                        <Row label="권장">
                            중요한 컷은 <strong className="text-[#223055]">바로 다운로드해서 별도 보관</strong>하세요.
                            히스토리는 백업이 아닙니다.
                        </Row>
                    </div>
                </Section>

                <Section index="07" title="프롬프트 요령">
                    <p>
                        모델은 짧고 모호한 문장보다 <strong className="text-[#223055]">구체적인 명사</strong>에 잘 반응합니다.
                        형용사를 늘리기보다 대상·재질·조명·앵글을 각각 지정하는 편이 결과가 안정적입니다.
                    </p>
                    <div className="mt-4">
                        <Row label="구성">대상 → 재질·질감 → 조명 → 카메라 앵글 → 분위기 순으로 씁니다.</Row>
                        <Row label="예시">
                            <span className="text-[#6B5A60]">
                                “무광 알루미늄 진열대 위의 향수병, 측면에서 들어오는 부드러운 자연광,
                                로우 앵글 클로즈업, 차분하고 미니멀한 분위기”
                            </span>
                        </Row>
                        <Row label="반복">
                            한 번에 완성하려 하지 말고, 마음에 드는 컷을 레퍼런스로 다시 넣어 좁혀가는 편이 빠릅니다.
                        </Row>
                        <Row label="자동 보정">
                            화질 관련 기본 지시와 제외 조건은 시스템이 자동으로 덧붙입니다.
                            “고화질로”, “선명하게” 같은 말은 따로 안 쓰셔도 됩니다.
                        </Row>
                    </div>
                </Section>

                <Section index="08" title="문제가 생기면">
                    <div>
                        <Row label="Usage limit exceeded">
                            키의 사용 한도를 넘겼습니다. Google AI Studio에서 할당량과 결제 상태를 확인하세요.
                        </Row>
                        <Row label="결과가 안 나옴">
                            프롬프트가 안전 필터에 걸렸을 수 있습니다. 표현을 바꿔 다시 시도해 보세요.
                        </Row>
                        <Row label="영상이 멈춘 듯할 때">
                            8초 영상도 3분까지 걸립니다. 진행 표시가 돌고 있으면 정상이니 기다려 주세요.
                        </Row>
                        <Row label="화면이 이상할 때">
                            새로고침하면 대부분 해결됩니다. 단, API 키는 다시 입력해야 합니다.
                        </Row>
                    </div>
                </Section>

                <div className="pt-12 flex items-center justify-between text-[10px] tracking-[0.25em] uppercase text-[#8A737B]">
                    <span>SM Entertainment Group</span>
                    <button onClick={onBack} className="sm-underline text-[#223055]">Back to Studio</button>
                </div>
            </main>
        </div>
    );
};

export default GuidePage;
